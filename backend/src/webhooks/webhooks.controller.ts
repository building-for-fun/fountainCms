import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SuperAdminGuard } from '../auth/guards/super-admin.guard';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { WebhooksService } from './webhooks.service';

@ApiTags('webhooks')
@ApiBearerAuth()
@Controller('webhooks')
@UseGuards(SuperAdminGuard)
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post()
  @ApiOperation({
    summary: 'Create webhook subscription (Super Admin only)',
    description:
      'Signing secret is returned once. Payloads are POSTed as JSON with X-Fountain-Signature: sha256=<hex> (HMAC-SHA256 of body).',
  })
  @ApiResponse({ status: 201 })
  async create(@Body() dto: CreateWebhookDto) {
    const { secret, meta } = await this.webhooksService.create(dto);
    return { secret, meta };
  }

  @Get()
  @ApiOperation({ summary: 'List webhook subscriptions (no secrets)' })
  async list() {
    const items = await this.webhooksService.findAll();
    return { data: items };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update webhook subscription',
    description:
      'If regenerateSecret is true, the new secret is returned once in the response.',
  })
  async update(@Param('id') id: string, @Body() dto: UpdateWebhookDto) {
    const res = await this.webhooksService.update(id, dto);
    if (res.secret) {
      return { meta: res.meta, secret: res.secret };
    }
    return { meta: res.meta };
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete webhook subscription' })
  async remove(@Param('id') id: string) {
    const ok = await this.webhooksService.remove(id);
    if (!ok) {
      throw new NotFoundException();
    }
  }
}
