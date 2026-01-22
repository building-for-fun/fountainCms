import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, Prisma } from '@prisma/client';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Injectable()
export class RolesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async getAll(): Promise<Role[]> {
    return await this.prisma.role.findMany();
  }

  async getById(id: string): Promise<Role | null> {
    return await this.prisma.role.findUnique({ where: { id } });
  }

  async create(
    data: Prisma.RoleCreateInput,
    actor?: {
      userId?: string | null;
      ip?: string | null;
      userAgent?: string | null;
    },
  ): Promise<Role> {
    const created = await this.prisma.role.create({ data });

    // Best-effort audit log
    try {
      await this.auditLogsService.create({
        action: 'create',
        entity: 'Role',
        entityId: created.id,
        userId: actor?.userId ?? null,
        ip: actor?.ip ?? null,
        userAgent: actor?.userAgent ?? null,
        payload: { after: created },
      });
    } catch (err) {
      // best-effort - don't block primary operation
      // log to console to avoid unused variable eslint rule

      console.warn(
        'Failed to write audit log for role create',
        (err as Error).message,
      );
    }

    return created;
  }

  async update(
    id: string,
    data: Prisma.RoleUpdateInput,
    actor?: {
      userId?: string | null;
      ip?: string | null;
      userAgent?: string | null;
    },
  ): Promise<Role | null> {
    try {
      const before = await this.prisma.role.findUnique({ where: { id } });
      if (!before) return null;

      const updated = await this.prisma.role.update({ where: { id }, data });

      try {
        await this.auditLogsService.create({
          action: 'update',
          entity: 'Role',
          entityId: id,
          userId: actor?.userId ?? null,
          ip: actor?.ip ?? null,
          userAgent: actor?.userAgent ?? null,
          payload: { before, after: updated },
        });
      } catch (err) {
        // best-effort

        console.warn(
          'Failed to write audit log for role update',
          (err as Error).message,
        );
      }

      return updated;
    } catch {
      return null;
    }
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
      const before = await this.prisma.role.findUnique({ where: { id } });
      if (!before) return false;

      await this.prisma.role.delete({ where: { id } });

      try {
        await this.auditLogsService.create({
          action: 'delete',
          entity: 'Role',
          entityId: id,
          userId: actor?.userId ?? null,
          ip: actor?.ip ?? null,
          userAgent: actor?.userAgent ?? null,
          payload: { before },
        });
      } catch (err) {
        // best-effort

        console.warn(
          'Failed to write audit log for role delete',
          (err as Error).message,
        );
      }

      return true;
    } catch {
      return false;
    }
  }
}
