import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { JwtPayload } from '../auth.types';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<{ user?: JwtPayload }>();
    const jwtUser = req.user;

    if (!jwtUser?.sub || jwtUser.apiTokenPermissions) {
      throw new ForbiddenException('Super Admin only');
    }

    if (jwtUser.role === 'Super Admin') {
      return true;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: jwtUser.sub },
      include: { role: true },
    });

    if (user?.role?.name === 'Super Admin') {
      return true;
    }

    throw new ForbiddenException('Super Admin only');
  }
}
