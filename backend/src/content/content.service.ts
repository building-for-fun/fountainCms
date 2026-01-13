import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { loadSchema } from '../../schema/schema.loader';
import { ContentRepository } from './content.repository';
import { SchemaService } from '../schema/schema.service';
import { Prisma } from '@prisma/client';
import { assertObject, validatePayload } from '../utils/content.util';

@Injectable()
export class ContentService {
  private readonly schema = loadSchema();

  constructor(
    private readonly prisma: PrismaService,
    private readonly contentRepository: ContentRepository,
    private readonly schemaService: SchemaService,
  ) {
    this.schema = this.schemaService.getSchema();
  }

  async findMany(collection: string) {
    const collectionSchema = this.schema.collections[collection];

    if (!collectionSchema) {
      throw new NotFoundException('Collection not found');
    }

    const [items, total] = await Promise.all([
      this.contentRepository.findMany(collection),
      this.contentRepository.count(collection),
    ]);

    return {
      data: items.map((item) => {
        const data = assertObject(item.data);

        return {
          id: item.id,
          ...data,
        };
      }),
      meta: { total },
    };
  }

  async create(collection: string, payload: Record<string, unknown>) {
    const collectionSchema = this.schema.collections[collection];

    if (!collectionSchema) {
      throw new NotFoundException('Collection not found');
    }

    const validated = validatePayload(
      payload,
      collectionSchema.fields,
    ) as Prisma.InputJsonValue;

    const item = await this.contentRepository.create(collection, validated);

    const data = assertObject(item.data);

    return {
      data: {
        id: item.id,
        ...data,
      },
    };
  }

  async findOne(collection: string, id: string) {
    const collectionSchema = this.schema.collections[collection];

    if (!collectionSchema) {
      throw new NotFoundException('Collection not found');
    }

    const item = await this.contentRepository.findById(collection, id);

    if (!item) {
      throw new NotFoundException('Content item not found');
    }

    const data = assertObject(item.data);

    return {
      data: {
        id: item.id,
        ...data,
      },
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

    const existingData = assertObject(existing.data);

    // Merge existing + incoming (PATCH semantics)
    const merged = {
      ...existingData,
      ...payload,
    };

    const validated = validatePayload(
      merged,
      collectionSchema.fields,
    ) as Prisma.InputJsonValue;

    const updated = await this.contentRepository.update(
      collection,
      id,
      validated,
    );

    const data = assertObject(updated.data);

    return {
      data: {
        id: updated.id,
        ...data,
      },
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
