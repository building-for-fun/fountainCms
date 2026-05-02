import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { FountainAuthRequest } from '../../auth/auth-apply.service';
import { ContentAuthorizationService } from '../content-authorization.service';
import type { ContentOperation } from '../content-permissions';

const METHOD_TO_OP: Record<string, ContentOperation> = {
  GET: 'read',
  POST: 'create',
  PATCH: 'update',
  DELETE: 'delete',
};

@Injectable()
export class ContentPermissionGuard implements CanActivate {
  constructor(
    private readonly contentAuthorization: ContentAuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FountainAuthRequest>();
    const method = request.method ?? 'GET';
    const operation = METHOD_TO_OP[method] ?? 'read';
    const collection = request.params?.collection;

    await this.contentAuthorization.ensureAccess(
      request,
      collection,
      operation,
    );
    return true;
  }
}
