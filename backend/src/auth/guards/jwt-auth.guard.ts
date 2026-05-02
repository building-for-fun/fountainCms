import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ALLOW_ANONYMOUS_PUBLISHED_KEY } from '../decorators/allow-anonymous-published.decorator';
import {
  AuthApplyService,
  type FountainAuthRequest,
} from '../auth-apply.service';

@Injectable()
export class JwtAuthGuard {
  constructor(
    private readonly reflector: Reflector,
    private readonly authApply: AuthApplyService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<FountainAuthRequest>();
    const path =
      request.originalUrl?.split('?')[0] ?? request.url?.split('?')[0] ?? '';
    if (path.startsWith('/api/graphql')) {
      return true;
    }

    const allowAnonymousPublished = this.reflector.getAllAndOverride<boolean>(
      ALLOW_ANONYMOUS_PUBLISHED_KEY,
      [context.getHandler(), context.getClass()],
    );

    await this.authApply.apply(request, {
      allowAnonymousPublishedWhen:
        Boolean(allowAnonymousPublished) && request.method === 'GET',
    });
    return true;
  }
}
