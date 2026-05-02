import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ALLOW_ANONYMOUS_PUBLISHED_KEY } from '../decorators/allow-anonymous-published.decorator';
import { AuthService } from '../auth.service';
import { ApiTokensService } from '../../api-tokens/api-tokens.service';
import {
  extractApiKeyHeader,
  extractBearerToken,
  extractJwtFromCookie,
  looksLikeJwt,
} from '../request-credentials.util';
import type { Request } from 'express';
import type { JwtPayload } from '../auth.types';

type FountainRequest = Request & {
  user?: JwtPayload;
  anonymousContentRead?: boolean;
};

function requestPath(request: { originalUrl?: string; url?: string }): string {
  const raw = request.originalUrl ?? request.url ?? '';
  return raw.split('?')[0] ?? '';
}

@Injectable()
export class JwtAuthGuard {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly apiTokensService: ApiTokensService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<FountainRequest>();
    const allowAnonymousPublished = this.reflector.getAllAndOverride<boolean>(
      ALLOW_ANONYMOUS_PUBLISHED_KEY,
      [context.getHandler(), context.getClass()],
    );

    const bearer = extractBearerToken(request);
    const cookieJwt = extractJwtFromCookie(request);

    if (bearer && looksLikeJwt(bearer)) {
      const payload = this.authService.validateToken(bearer);
      if (!payload) {
        throw new UnauthorizedException('Invalid or expired token');
      }
      request.user = payload;
      return true;
    }

    if (cookieJwt && looksLikeJwt(cookieJwt)) {
      const payload = this.authService.validateToken(cookieJwt);
      if (!payload) {
        throw new UnauthorizedException('Invalid or expired token');
      }
      request.user = payload;
      return true;
    }

    if (bearer && !looksLikeJwt(bearer)) {
      const resolved = await this.apiTokensService.validatePlainToken(bearer);
      if (!resolved) {
        throw new UnauthorizedException('Invalid API key');
      }
      const path = requestPath(request);
      if (!path.startsWith('/api/content/')) {
        throw new ForbiddenException(
          'API tokens may only access /api/content/* routes',
        );
      }
      request.user = {
        sub: resolved.id,
        email: '',
        username: '',
        role: null,
        apiTokenPermissions: resolved.permissions,
      };
      return true;
    }

    const apiKeyHeader = extractApiKeyHeader(request);
    if (apiKeyHeader) {
      const resolved =
        await this.apiTokensService.validatePlainToken(apiKeyHeader);
      if (!resolved) {
        throw new UnauthorizedException('Invalid API key');
      }
      const path = requestPath(request);
      if (!path.startsWith('/api/content/')) {
        throw new ForbiddenException(
          'API tokens may only access /api/content/* routes',
        );
      }
      request.user = {
        sub: resolved.id,
        email: '',
        username: '',
        role: null,
        apiTokenPermissions: resolved.permissions,
      };
      return true;
    }

    if (allowAnonymousPublished && request.method === 'GET') {
      request.anonymousContentRead = true;
      return true;
    }

    throw new UnauthorizedException('Authentication required');
  }
}
