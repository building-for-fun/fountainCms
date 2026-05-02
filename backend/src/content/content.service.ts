import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContentRepository, type ContentStatus } from './content.repository';
import { SchemaService } from '../schema/schema.service';
import { Prisma } from '../generated/prisma/client';
import { assertObject, validatePayload } from '../utils/content.util';
import { parseContentListQuery, pickContentFields } from './content-query.util';

const SYSTEM_KEYS = ['status', 'published_at', 'publishedAt'];

function stripSystemFields(
  payload: Record<string, unknown>,
): Record<string, unknown> {
  const out = { ...payload };
  for (const k of SYSTEM_KEYS) delete out[k];
  return out;
}

function parseStatus(v: unknown): ContentStatus | null {
  if (v === 'draft' || v === 'published') return v;
  return null;
}

@Injectable()
export class ContentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly contentRepository: ContentRepository,
    private readonly schemaService: SchemaService,
  ) {}

  /** Schema is loaded at app startup via APP_INITIALIZER; first use is after that. */
  private get schema() {
    return this.schemaService.getSchema();
  }

  private toItemResponse(item: {
    id: string;
    data: Prisma.JsonValue;
    status: string;
    publishedAt: Date | null;
  }) {
    const data = assertObject(item.data);
    return {
      id: item.id,
      ...data,
      status: item.status,
      published_at: item.publishedAt?.toISOString() ?? null,
    };
  }

  async findMany(
    collection: string,
    options: {
      publishedOnly: boolean;
      query: Record<string, string | string[] | undefined>;
    },
  ) {
    const collectionSchema = this.schema.collections[collection];

    if (!collectionSchema) {
      throw new NotFoundException('Collection not found');
    }

    const parsed = parseContentListQuery(
      options.query,
      collectionSchema.fields,
    );

    const statusFilter = options.publishedOnly
      ? ('published' as ContentStatus)
      : undefined;

    const orderBy = {
      [parsed.sort.field]: parsed.sort.direction,
    } as const;

    const dataAnd = parsed.filterAnd.length > 0 ? parsed.filterAnd : undefined;

    const [items, total] = await Promise.all([
      this.contentRepository.findMany({
        collection,
        status: statusFilter,
        skip: parsed.offset,
        take: parsed.limit,
        orderBy,
        dataFilterAnd: dataAnd,
      }),
      this.contentRepository.count({
        collection,
        status: statusFilter,
        dataFilterAnd: dataAnd,
      }),
    ]);

    const rows = items.map((item) => {
      const row = this.toItemResponse(item) as Record<string, unknown>;
      return pickContentFields(row, parsed.fieldPick);
    });

    return {
      data: rows,
      meta: {
        total,
        limit: parsed.limit ?? null,
        offset: parsed.offset,
        sort: `${parsed.sort.field}:${parsed.sort.direction}`,
      },
    };
  }

  private async validateMediaReferences(
    data: Record<string, unknown>,
    fields: Record<string, { type: string }>,
  ): Promise<void> {
    for (const [fieldName, fieldSchema] of Object.entries(fields)) {
      if (fieldSchema.type !== 'media') continue;
      const value = data[fieldName];
      if (value === null || value === undefined) continue;
      const id = String(value);
      const media = await this.prisma.media.findUnique({ where: { id } });
      if (!media) {
        throw new BadRequestException(
          `Field '${fieldName}' references non-existent media ID`,
        );
      }
    }
  }

  async create(collection: string, payload: Record<string, unknown>) {
    const collectionSchema = this.schema.collections[collection];

    if (!collectionSchema) {
      throw new NotFoundException('Collection not found');
    }

    const status = parseStatus(payload.status) ?? 'draft';
    const payloadWithoutSystem = stripSystemFields(payload);
    const validated = validatePayload(
      payloadWithoutSystem,
      collectionSchema.fields,
    ) as Prisma.InputJsonValue;

    await this.validateMediaReferences(
      validated as Record<string, unknown>,
      collectionSchema.fields,
    );

    const publishedAt = status === 'published' ? new Date() : null;
    const item = await this.contentRepository.create(
      collection,
      validated,
      status,
      publishedAt,
    );

    return {
      data: this.toItemResponse(item),
    };
  }

  async findOne(
    collection: string,
    id: string,
    opts?: { anonymous?: boolean },
  ) {
    const collectionSchema = this.schema.collections[collection];

    if (!collectionSchema) {
      throw new NotFoundException('Collection not found');
    }

    const item = await this.contentRepository.findById(collection, id);

    if (!item) {
      throw new NotFoundException('Content item not found');
    }

    if (opts?.anonymous && item.status !== 'published') {
      throw new NotFoundException('Content item not found');
    }

    return {
      data: this.toItemResponse(item),
    };
  }

  async update(
    collection: string,
    id: string,
    payload: Record<string, unknown>,
  ) {
    const collectionSchema = this.schema.collections[collection];

    if (!collectionSchema) {
      throw new NotFoundException('Collection not found');
    }

    if (!payload || typeof payload !== 'object') {
      throw new BadRequestException('Request body must be a JSON object');
    }

    const existing = await this.contentRepository.findById(collection, id);

    if (!existing) {
      throw new NotFoundException('Content item not found');
    }

    const incomingStatus = parseStatus(payload.status);
    const status = incomingStatus ?? (existing.status as ContentStatus);
    let publishedAt: Date | null = existing.publishedAt;
    if (status === 'published' && !existing.publishedAt) {
      publishedAt = new Date();
    } else if (status === 'draft' && incomingStatus === 'draft') {
      publishedAt = null;
    }

    const payloadWithoutSystem = stripSystemFields(payload);
    const existingData = assertObject(existing.data);
    const merged = {
      ...existingData,
      ...payloadWithoutSystem,
    };

    const validated = validatePayload(
      merged,
      collectionSchema.fields,
    ) as Prisma.InputJsonValue;

    await this.validateMediaReferences(
      validated as Record<string, unknown>,
      collectionSchema.fields,
    );

    const updated = await this.contentRepository.update(
      collection,
      id,
      validated,
      status,
      publishedAt,
    );

    return {
      data: this.toItemResponse(updated),
    };
  }

  async delete(collection: string, id: string) {
    const collectionSchema = this.schema.collections[collection];

    if (!collectionSchema) {
      throw new NotFoundException('Collection not found');
    }

    const result = await this.contentRepository.delete(collection, id);

    if (result.count === 0) {
      throw new NotFoundException('Content item not found');
    }

    return {
      success: true,
    };
  }
}
