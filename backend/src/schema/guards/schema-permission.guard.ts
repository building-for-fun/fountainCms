import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { JwtPayload } from '../../auth/auth.types';

const SUPER_ADMIN_ROLE = 'Super Admin';

const METHOD_TO_OP: Record<string, string> = {
  GET: 'read',
  POST: 'create',
  PATCH: 'update',
  DELETE: 'delete',
};

function hasSchemaPermission(
  permissions: string[],
  operation: string,
): boolean {
  const required = `schema:${operation}`;
  return (
    permissions.includes(required) ||
    permissions.includes('schema:*') ||
    permissions.includes('*:*')
  );
}

interface RequestWithUser {
  user?: JwtPayload;
  method?: string;
}

@Injectable()
export class SchemaPermissionGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user?.sub) {
      throw new UnauthorizedException('Authentication required');
    }

    const roleName = user.role;
    if (roleName === SUPER_ADMIN_ROLE) {
      return true;
    }

    if (!roleName) {
      throw new ForbiddenException('No role assigned; schema access denied');
    }

    const method = request.method ?? 'GET';
    const operation = METHOD_TO_OP[method] ?? 'read';

    const role = await this.prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!role) {
      throw new ForbiddenException('Role not found');
    }

    const permissions: string[] = Array.isArray(role.permissions)
      ? role.permissions
      : [];
    if (hasSchemaPermission(permissions, operation)) {
      return true;
    }

    throw new ForbiddenException(
      `Permission denied: missing schema:${operation}`,
    );
  }
}
