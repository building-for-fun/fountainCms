import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLog } from '@prisma/client';

@Injectable()
export class AuditLogsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
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
}
