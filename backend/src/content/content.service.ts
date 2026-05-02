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
import type { FieldSchema } from '../schema/schema.types';
import {
  parseContentListQuery,
  parsePopulate,
  pickContentFields,
  firstQueryValue,
} from './content-query.util';

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
      /** Request is unauthenticated published-only read */
      anonymous: boolean;
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

    const populated = await this.applyPopulate(
      rows,
      collectionSchema.fields,
      parsed.populate,
      { anonymous: options.anonymous },
    );

    return {
      data: populated,
      meta: {
        total,
        limit: parsed.limit ?? null,
        offset: parsed.offset,
        sort: `${parsed.sort.field}:${parsed.sort.direction}`,
      },
    };
  }

  private async validateRelationReferences(
    data: Record<string, unknown>,
    fields: Record<string, FieldSchema>,
  ): Promise<void> {
    for (const [fieldName, fieldSchema] of Object.entries(fields)) {
      if (fieldSchema.type !== 'relation') continue;
      const value = data[fieldName];
      if (value === null || value === undefined) continue;
      const targetCollection = fieldSchema.relationCollection?.trim();
      if (!targetCollection) {
        throw new BadRequestException(
          `Schema misconfigured: relation field '${fieldName}' is missing relationCollection`,
        );
      }
      if (!this.schema.collections[targetCollection]) {
        throw new BadRequestException(
          `Relation target '${targetCollection}' for field '${fieldName}' is not a defined collection`,
        );
      }
      const rid = String(value).trim();
      const related = await this.contentRepository.findById(
        targetCollection,
        rid,
      );
      if (!related) {
        throw new BadRequestException(
          `Field '${fieldName}' references missing '${targetCollection}' entry`,
        );
      }
    }
  }

  private async applyPopulate(
    rows: Record<string, unknown>[],
    fields: Record<string, FieldSchema>,
    populateNames: string[] | null,
    visibility: { anonymous: boolean },
  ): Promise<Record<string, unknown>[]> {
    if (!populateNames?.length) return rows;

    const targets = new Map<string, Set<string>>();

    for (const row of rows) {
      for (const name of populateNames) {
        const raw = row[name];
        if (typeof raw !== 'string' || !raw.trim()) continue;
        const fs = fields[name];
        if (fs?.type !== 'relation') continue;
        const coll = fs.relationCollection?.trim();
        if (!coll) continue;
        if (!targets.has(coll)) targets.set(coll, new Set());
        targets.get(coll)!.add(raw.trim());
      }
    }

    const cache = new Map<string, Record<string, unknown> | null>();

    for (const [coll, ids] of targets) {
      const idList = [...ids];
      const found = await this.prisma.contentItem.findMany({
        where: { collection: coll, id: { in: idList } },
      });
      const byId = new Map(found.map((i) => [i.id, i]));
      for (const rid of idList) {
        const key = `${coll}:${rid}`;
        const item = byId.get(rid);
        if (!item) {
          cache.set(key, null);
          continue;
        }
        if (visibility.anonymous && item.status !== 'published') {
          cache.set(key, null);
          continue;
        }
        cache.set(key, this.toItemResponse(item) as Record<string, unknown>);
      }
    }

    return rows.map((row) => {
      const out = { ...row };
      for (const name of populateNames) {
        const raw = out[name];
        if (typeof raw !== 'string' || !raw.trim()) continue;
        const fs = fields[name];
        if (fs?.type !== 'relation') continue;
        const coll = fs.relationCollection?.trim();
        if (!coll) continue;
        const expanded = cache.get(`${coll}:${raw.trim()}`);
        if (expanded) {
          out[name] = expanded;
        }
      }
      return out;
    });
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

    await this.validateRelationReferences(
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
    opts?: {
      anonymous?: boolean;
      query?: Record<string, string | string[] | undefined>;
    },
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

    const populate = opts?.query
      ? parsePopulate(
          firstQueryValue(opts.query, 'populate'),
          collectionSchema.fields,
        )
      : null;

    let data = this.toItemResponse(item) as Record<string, unknown>;
    const [expanded] = await this.applyPopulate(
      [data],
      collectionSchema.fields,
      populate,
      { anonymous: !!opts?.anonymous },
    );
    data = expanded;

    return {
      data,
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

    await this.validateRelationReferences(
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
