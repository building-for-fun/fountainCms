import { createHmac, randomUUID } from 'node:crypto';
import { Injectable, Logger } from '@nestjs/common';
import type { WebhookSubscription } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { subscriptionMatchesEvent, WEBHOOK_EVENTS } from './webhook-events';

function normalizeExtraHeaders(raw: unknown): Record<string, string> {
  if (raw == null || typeof raw !== 'object' || Array.isArray(raw)) {
    return {};
  }
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v === 'string' && k.trim()) {
      out[k] = v;
    }
  }
  return out;
}

@Injectable()
export class WebhookDispatchService {
  private readonly logger = new Logger(WebhookDispatchService.name);

  constructor(private readonly prisma: PrismaService) {}

  emitContentEntryCreated(
    collection: string,
    entry: Record<string, unknown>,
  ): void {
    void this.deliver(WEBHOOK_EVENTS.CONTENT_ENTRY_CREATED, collection, {
      entry,
    });
  }

  emitContentEntryUpdated(
    collection: string,
    entry: Record<string, unknown>,
  ): void {
    void this.deliver(WEBHOOK_EVENTS.CONTENT_ENTRY_UPDATED, collection, {
      entry,
    });
  }

  emitContentEntryDeleted(
    collection: string,
    entry: Record<string, unknown>,
  ): void {
    void this.deliver(WEBHOOK_EVENTS.CONTENT_ENTRY_DELETED, collection, {
      entry,
    });
  }

  private async deliver(
    event: string,
    collection: string,
    data: Record<string, unknown>,
  ): Promise<void> {
    try {
      const subs = await this.prisma.webhookSubscription.findMany({
        where: { enabled: true },
      });
      const targets = subs.filter(
        (s) =>
          subscriptionMatchesEvent(s.events, event) &&
          this.matchesCollection(s.collections, collection),
      );
      await Promise.allSettled(
        targets.map((sub) => this.postOne(sub, event, collection, data)),
      );
    } catch (err) {
      this.logger.warn(
        `Webhook dispatch failed to load subscriptions: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  private matchesCollection(
    collections: string[],
    collection: string,
  ): boolean {
    if (!collections.length) return true;
    return collections.includes(collection);
  }

  private async postOne(
    sub: WebhookSubscription,
    event: string,
    collection: string,
    data: Record<string, unknown>,
  ): Promise<void> {
    const deliveryId = randomUUID();
    const envelope = {
      id: deliveryId,
      type: event,
      timestamp: new Date().toISOString(),
      data: { collection, ...data },
    };
    const body = JSON.stringify(envelope);
    const signature = createHmac('sha256', sub.secret)
      .update(body)
      .digest('hex');
    const baseHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Fountain-Delivery': deliveryId,
      'X-Fountain-Signature': `sha256=${signature}`,
    };
    const custom = normalizeExtraHeaders(sub.headers);
    const headers = { ...custom, ...baseHeaders };

    try {
      const res = await fetch(sub.url, {
        method: 'POST',
        headers,
        body,
        signal: AbortSignal.timeout(15_000),
      });
      if (!res.ok) {
        this.logger.warn(
          `Webhook ${sub.id} → ${res.status} ${res.statusText} (${sub.url})`,
        );
      }
    } catch (err) {
      this.logger.warn(
        `Webhook ${sub.id} request error: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }
}
