import { Controller, Get, Query } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';

@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  getLogs(@Query('limit') limit = '20', @Query('offset') offset = '0') {
    return this.auditLogsService.getLogs({
      limit: Number(limit),
      offset: Number(offset),
    });
  }
}
