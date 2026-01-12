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
}
