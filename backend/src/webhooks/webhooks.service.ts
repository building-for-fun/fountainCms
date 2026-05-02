import { randomBytes } from 'node:crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import type { WebhookSubscription } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { KNOWN_WEBHOOK_EVENTS } from './webhook-events';

export type WebhookSubscriptionMeta = {
  id: string;
  name: string;
  url: string;
  events: string[];
  collections: string[];
  headers: Record<string, string> | null;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function headersFromJson(raw: Prisma.JsonValue): Record<string, string> | null {
  if (raw == null) return null;
  if (typeof raw !== 'object' || Array.isArray(raw)) return null;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v === 'string' && k.trim()) {
      out[k] = v;
    }
  }
  return Object.keys(out).length ? out : null;
}

@Injectable()
export class WebhooksService {
  constructor(private readonly prisma: PrismaService) {}

  private assertKnownEvents(events: string[]): void {
    for (const e of events) {
      if (!KNOWN_WEBHOOK_EVENTS.includes(e)) {
        throw new BadRequestException(
          `Unknown webhook event "${e}". Allowed: ${KNOWN_WEBHOOK_EVENTS.join(', ')}`,
        );
      }
    }
  }

  private toMeta(row: WebhookSubscription): WebhookSubscriptionMeta {
    return {
      id: row.id,
      name: row.name,
      url: row.url,
      events: [...row.events],
      collections: [...row.collections],
      headers: headersFromJson(row.headers),
      enabled: row.enabled,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  async create(
    dto: CreateWebhookDto,
  ): Promise<{ secret: string; meta: WebhookSubscriptionMeta }> {
    this.assertKnownEvents(dto.events);
    const secret = randomBytes(32).toString('hex');
    const collections =
      dto.collections?.map((c) => c.trim()).filter(Boolean) ?? [];
    const row = await this.prisma.webhookSubscription.create({
      data: {
        name: dto.name.trim(),
        url: dto.url.trim(),
        secret,
        events: dto.events,
        collections,
        headers:
          dto.headers && Object.keys(dto.headers).length > 0
            ? (dto.headers as Prisma.InputJsonValue)
            : undefined,
      },
    });
    return { secret, meta: this.toMeta(row) };
  }

  async findAll(): Promise<WebhookSubscriptionMeta[]> {
    const rows = await this.prisma.webhookSubscription.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => this.toMeta(r));
  }

  async update(
    id: string,
    dto: UpdateWebhookDto,
  ): Promise<{ meta: WebhookSubscriptionMeta; secret?: string }> {
    const existing = await this.prisma.webhookSubscription.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException();
    }

    if (dto.events) {
      this.assertKnownEvents(dto.events);
    }

    let newSecret: string | undefined;
    const data: Prisma.WebhookSubscriptionUpdateInput = {};

    if (dto.name !== undefined) data.name = dto.name.trim();
    if (dto.url !== undefined) data.url = dto.url.trim();
    if (dto.events !== undefined) data.events = dto.events;
    if (dto.collections !== undefined) {
      data.collections = dto.collections.map((c) => c.trim()).filter(Boolean);
    }
    if (dto.headers !== undefined) {
      data.headers =
        dto.headers === null || Object.keys(dto.headers).length === 0
          ? Prisma.JsonNull
          : (dto.headers as Prisma.InputJsonValue);
    }
    if (dto.enabled !== undefined) data.enabled = dto.enabled;
    if (dto.regenerateSecret) {
      newSecret = randomBytes(32).toString('hex');
      data.secret = newSecret;
    }

    const row = await this.prisma.webhookSubscription.update({
      where: { id },
      data,
    });

    return newSecret
      ? { meta: this.toMeta(row), secret: newSecret }
      : { meta: this.toMeta(row) };
  }

  async remove(id: string): Promise<boolean> {
    try {
      await this.prisma.webhookSubscription.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
