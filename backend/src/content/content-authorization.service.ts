import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { FountainAuthRequest } from '../auth/auth-apply.service';
import {
  getRequiredContentPermission,
  hasContentPermission,
  type ContentOperation,
} from './content-permissions';

const SUPER_ADMIN_ROLE = 'Super Admin';

const HTTP_METHOD_FOR_OPERATION: Record<
  Exclude<ContentOperation, 'publish'>,
  string
> = {
  read: 'GET',
  create: 'POST',
  update: 'PATCH',
  delete: 'DELETE',
};

function formatMissingContentPermission(
  collection: string,
  operation: ContentOperation,
): string {
  if (operation === 'publish') {
    return `${collection}:publish`;
  }
  return getRequiredContentPermission(
    collection,
    HTTP_METHOD_FOR_OPERATION[operation],
  );
}

@Injectable()
export class ContentAuthorizationService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Enforces collection ACL (roles, API tokens, or anonymous read-only published).
   */
  async ensureAccess(
    req: FountainAuthRequest,
    collection: string | undefined,
    operation: ContentOperation,
  ): Promise<void> {
    if (!collection) {
      return;
    }

    if (req.anonymousContentRead === true) {
      if (operation !== 'read') {
        throw new UnauthorizedException('Authentication required');
      }
      return;
    }

    const user = req.user;

    if (!user?.sub) {
      throw new UnauthorizedException('Authentication required');
    }

    if (user.apiTokenPermissions !== undefined) {
      if (
        hasContentPermission(user.apiTokenPermissions, collection, operation)
      ) {
        return;
      }
      const required = formatMissingContentPermission(collection, operation);
      throw new ForbiddenException(`Permission denied: missing ${required}`);
    }

    const roleName = user.role;
    if (roleName === SUPER_ADMIN_ROLE) {
      return;
    }

    if (!roleName) {
      throw new ForbiddenException('No role assigned; content access denied');
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

    if (hasContentPermission(permissions, collection, operation)) {
      return;
    }

    const required = formatMissingContentPermission(collection, operation);
    throw new ForbiddenException(`Permission denied: missing ${required}`);
  }
}
