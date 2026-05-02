import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { ApiTokensService } from '../api-tokens/api-tokens.service';
import {
  extractApiKeyHeader,
  extractBearerToken,
  extractJwtFromCookie,
  looksLikeJwt,
} from './request-credentials.util';
import type { JwtPayload } from './auth.types';

export type FountainAuthRequest = Request & {
  user?: JwtPayload;
  anonymousContentRead?: boolean;
};

function requestPath(request: { originalUrl?: string; url?: string }): string {
  const raw = request.originalUrl ?? request.url ?? '';
  return raw.split('?')[0] ?? '';
}

function apiTokenAllowedPath(path: string): boolean {
  return path.startsWith('/api/content/') || path.startsWith('/api/graphql');
}

/**
 * Shared JWT / API-key / anonymous-published authentication used by REST and GraphQL.
 */
@Injectable()
export class AuthApplyService {
  constructor(
    private readonly authService: AuthService,
    private readonly apiTokensService: ApiTokensService,
  ) {}

  async apply(
    req: FountainAuthRequest,
    options: { allowAnonymousPublishedWhen: boolean },
  ): Promise<void> {
    const bearer = extractBearerToken(req);
    const cookieJwt = extractJwtFromCookie(req);

    if (bearer && looksLikeJwt(bearer)) {
      const payload = this.authService.validateToken(bearer);
      if (!payload) {
        throw new UnauthorizedException('Invalid or expired token');
      }
      req.user = payload;
      return;
    }

    if (cookieJwt && looksLikeJwt(cookieJwt)) {
      const payload = this.authService.validateToken(cookieJwt);
      if (!payload) {
        throw new UnauthorizedException('Invalid or expired token');
      }
      req.user = payload;
      return;
    }

    if (bearer && !looksLikeJwt(bearer)) {
      const resolved = await this.apiTokensService.validatePlainToken(bearer);
      if (!resolved) {
        throw new UnauthorizedException('Invalid API key');
      }
      const path = requestPath(req);
      if (!apiTokenAllowedPath(path)) {
        throw new ForbiddenException(
          'API tokens may only access Content REST or GraphQL routes',
        );
      }
      req.user = {
        sub: resolved.id,
        email: '',
        username: '',
        role: null,
        apiTokenPermissions: resolved.permissions,
      };
      return;
    }

    const apiKeyHeader = extractApiKeyHeader(req);
    if (apiKeyHeader) {
      const resolved =
        await this.apiTokensService.validatePlainToken(apiKeyHeader);
      if (!resolved) {
        throw new UnauthorizedException('Invalid API key');
      }
      const path = requestPath(req);
      if (!apiTokenAllowedPath(path)) {
        throw new ForbiddenException(
          'API tokens may only access Content REST or GraphQL routes',
        );
      }
      req.user = {
        sub: resolved.id,
        email: '',
        username: '',
        role: null,
        apiTokenPermissions: resolved.permissions,
      };
      return;
    }

    if (options.allowAnonymousPublishedWhen) {
      req.anonymousContentRead = true;
      return;
    }

    throw new UnauthorizedException('Authentication required');
  }
}
