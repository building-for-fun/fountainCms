import { Injectable } from '@nestjs/common';
import { AuditLogsRepository } from './audit-logs.repository';

@Injectable()
export class AuditLogsService {
  constructor(private readonly auditLogsRepository: AuditLogsRepository) {}
  async getLogs(params: { limit: number; offset: number }) {
    const { limit, offset } = params;

    const [logs, total] = await Promise.all([
      this.auditLogsRepository.findMany(limit, offset),
      this.auditLogsRepository.count(),
    ]);

    return {
      data: logs,
      meta: {
        total,
        limit,
        offset,
      },
    };
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
  }) {
    const created = await this.auditLogsRepository.create(data);
    return created;
  }
}
