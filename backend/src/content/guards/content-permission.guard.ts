import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { JwtPayload } from '../../auth/auth.types';
import {
  getRequiredContentPermission,
  hasContentPermission,
  type ContentOperation,
} from '../content-permissions';

const SUPER_ADMIN_ROLE = 'Super Admin';

const METHOD_TO_OP: Record<string, ContentOperation> = {
  GET: 'read',
  POST: 'create',
  PATCH: 'update',
  DELETE: 'delete',
};

interface RequestWithAuth {
  user?: JwtPayload;
  anonymousContentRead?: boolean;
  params?: { collection?: string };
  method?: string;
}

@Injectable()
export class ContentPermissionGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithAuth>();
    const method = request.method ?? 'GET';

    if (request.anonymousContentRead === true) {
      if (method !== 'GET') {
        throw new UnauthorizedException('Authentication required');
      }
      return true;
    }

    const user = request.user;

    if (!user?.sub) {
      throw new UnauthorizedException('Authentication required');
    }

    if (user.apiTokenPermissions !== undefined) {
      const collection = request.params?.collection;
      if (!collection) {
        return true;
      }
      const operation = METHOD_TO_OP[method] ?? 'read';
      if (
        hasContentPermission(user.apiTokenPermissions, collection, operation)
      ) {
        return true;
      }
      const required = getRequiredContentPermission(collection, method);
      throw new ForbiddenException(`Permission denied: missing ${required}`);
    }

    const roleName = user.role;
    if (roleName === SUPER_ADMIN_ROLE) {
      return true;
    }

    if (!roleName) {
      throw new ForbiddenException('No role assigned; content access denied');
    }

    const collection = request.params?.collection;
    if (!collection) {
      return true;
    }

    const role = await this.prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!role) {
      throw new ForbiddenException('Role not found');
    }

    const permissions: string[] = Array.isArray(role.permissions)
      ? role.permissions
      : [];
    const operation = METHOD_TO_OP[method] ?? 'read';

    if (hasContentPermission(permissions, collection, operation)) {
      return true;
    }

    const required = getRequiredContentPermission(collection, method);
    throw new ForbiddenException(`Permission denied: missing ${required}`);
  }
}
