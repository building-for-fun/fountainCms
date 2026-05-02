import { Module } from '@nestjs/common';
import { ApiTokensService } from './api-tokens.service';
import { ApiTokensController } from './api-tokens.controller';
import { SuperAdminGuard } from '../auth/guards/super-admin.guard';

@Module({
  controllers: [ApiTokensController],
  providers: [ApiTokensService, SuperAdminGuard],
  exports: [ApiTokensService],
})
export class ApiTokensModule {}
