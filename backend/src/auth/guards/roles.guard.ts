import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

/**
 * Minimal authenticated user shape expected on the request.
 */
interface AuthenticatedUser {
  id: string;
  email?: string;
  roles?: string[];
}

/**
 * Typed request which may include the authenticated user.
 */
interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

/**
 * Guard that checks if the user has required roles.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.get<string[]>('roles', context.getHandler()) ?? [];

    if (requiredRoles.length === 0) {
      return true;
    }

    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = req.user;

    if (!user || !Array.isArray(user.roles) || user.roles.length === 0) {
      throw new ForbiddenException('Missing roles');
    }

    const has = requiredRoles.some((role) => user.roles!.includes(role));
    if (!has) throw new ForbiddenException('Insufficient role');
    return true;
  }
}
