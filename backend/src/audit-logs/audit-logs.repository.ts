import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AuditLog } from '@prisma/client';

@Injectable()
export class AuditLogsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(limit: number, offset: number) {
    return this.prisma.auditLog.findMany({
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  count() {
    return this.prisma.auditLog.count();
  }

  async create(data: {
    action: string;
    entity: string;
    entityId?: string | null;
    collection?: string | null;
    userId?: string | null;
    ip?: string | null;
    userAgent?: string | null;
    payload?: unknown;
  }): Promise<AuditLog> {
    return this.prisma.auditLog.create({
      data: {
        action: data.action,
        entity: data.entity,
        entityId: data.entityId ?? null,
        collection: data.collection ?? null,
        userId: data.userId ?? null,
        ip: data.ip ?? null,
        userAgent: data.userAgent ?? null,
        // Prisma JSON field expects a JSON value or undefined; avoid passing `null` directly.
        payload: data.payload ?? undefined,
      },
    });
  }
}
