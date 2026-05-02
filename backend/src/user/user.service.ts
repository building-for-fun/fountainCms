import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '../generated/prisma/client';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

/** Omit sensitive fields from user when writing to audit payload */
function sanitizeUserForAudit(
  u: User & { role?: unknown },
): Record<string, unknown> {
  const { passwordHash, ...rest } = u as User & {
    passwordHash?: string;
    role?: unknown;
  };
  return rest as Record<string, unknown>;
}

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async getAll(): Promise<User[]> {
    return await this.prisma.user.findMany({ include: { role: true } });
  }

  async getById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  }

  async create(
    data: Prisma.UserCreateInput,
    actor?: {
      userId?: string | null;
      ip?: string | null;
      userAgent?: string | null;
    },
  ): Promise<User> {
    const created = await this.prisma.user.create({
      data,
      include: { role: true },
    });

    try {
      await this.auditLogsService.create({
        action: 'create',
        entity: 'User',
        entityId: created.id,
        userId: actor?.userId ?? null,
        ip: actor?.ip ?? null,
        userAgent: actor?.userAgent ?? null,
        payload: { after: sanitizeUserForAudit(created) },
      });
    } catch (err) {
      console.warn(
        'Failed to write audit log for user create',
        (err as Error).message,
      );
    }

    return created;
  }

  async update(
    id: string,
    params: {
      data: Prisma.UserUpdateInput;
      roleName?: string | null;
    },
    actor?: {
      userId?: string | null;
      ip?: string | null;
      userAgent?: string | null;
    },
  ): Promise<User> {
    const { data, roleName } = params;

    if (roleName !== undefined) {
      if (roleName === null) {
        data.role = { disconnect: true };
      } else {
        data.role = { connect: { name: roleName } };
      }
    }

    const before = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
    if (!before) {
      throw new NotFoundException('User not found');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data,
      include: { role: true },
    });

    try {
      await this.auditLogsService.create({
        action: 'update',
        entity: 'User',
        entityId: id,
        userId: actor?.userId ?? null,
        ip: actor?.ip ?? null,
        userAgent: actor?.userAgent ?? null,
        payload: {
          before: sanitizeUserForAudit(before),
          after: sanitizeUserForAudit(updated),
        },
      });
    } catch (err) {
      console.warn(
        'Failed to write audit log for user update',
        (err as Error).message,
      );
    }

    return updated;
  }

  async delete(
    id: string,
    actor?: {
      userId?: string | null;
      ip?: string | null;
      userAgent?: string | null;
    },
  ): Promise<boolean> {
    try {
      const before = await this.prisma.user.findUnique({
        where: { id },
        include: { role: true },
      });
      if (!before) return false;

      await this.prisma.user.delete({ where: { id } });

      try {
        await this.auditLogsService.create({
          action: 'delete',
          entity: 'User',
          entityId: id,
          userId: actor?.userId ?? null,
          ip: actor?.ip ?? null,
          userAgent: actor?.userAgent ?? null,
          payload: { before: sanitizeUserForAudit(before) },
        });
      } catch (err) {
        console.warn(
          'Failed to write audit log for user delete',
          (err as Error).message,
        );
      }

      return true;
    } catch {
      return false;
    }
  }
}
