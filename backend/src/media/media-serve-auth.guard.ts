import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AuthApplyService,
  type FountainAuthRequest,
} from '../auth/auth-apply.service';
import { verifyMediaFileRequest } from './media-signed-url.util';

/**
 * Serve endpoint: JWT/session (or API token where applicable) **or** valid signed URL
 * when MEDIA_URL_SIGNING_SECRET is set.
 */
@Injectable()
export class MediaServeAuthGuard implements CanActivate {
  constructor(
    private readonly authApply: AuthApplyService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<FountainAuthRequest>();
    const secret = this.config.get<string>('MEDIA_URL_SIGNING_SECRET')?.trim();

    try {
      await this.authApply.apply(req, { allowAnonymousPublishedWhen: false });
      return true;
    } catch {
      if (!secret) {
        throw new UnauthorizedException('Authentication required');
      }
    }

    const id = req.params?.id as string | undefined;
    if (!id) {
      throw new UnauthorizedException('Authentication required');
    }

    const query = req.query as Record<string, string | string[] | undefined>;
    if (verifyMediaFileRequest(id, query, secret!)) {
      return true;
    }

    throw new UnauthorizedException('Invalid or expired media signature');
  }
}
