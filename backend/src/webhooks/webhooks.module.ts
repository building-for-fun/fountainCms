import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { WebhookDispatchService } from './webhook-dispatch.service';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';

@Module({
  imports: [PrismaModule],
  controllers: [WebhooksController],
  providers: [WebhooksService, WebhookDispatchService],
  exports: [WebhookDispatchService],
})
export class WebhooksModule {}
