import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AppSchema, FieldSchema } from './schema.types';
import { CreateContentTypeDto } from './dto/create-content-type.dto';
import type { CreateContentTypeFieldDto } from './dto/create-content-type.dto';
import { UpdateContentTypeDto } from './dto/update-content-type.dto';
import type { UpdateContentTypeFieldDto } from './dto/update-content-type.dto';

@Injectable()
export class SchemaService implements OnModuleInit {
  private schemaCache: AppSchema | null = null;

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    await this.loadSchema();
  }

  async ensureSchemaLoaded(): Promise<void> {
    if (!this.schemaCache) {
      await this.loadSchema();
    }
  }

  async createContentType(
    dto: CreateContentTypeDto,
  ): Promise<{ name: string }> {
    const existing = await this.prisma.contentTypeDefinition.findUnique({
      where: { name: dto.name },
    });
    if (existing) {
      throw new ConflictException(`Content type '${dto.name}' already exists`);
    }
    await this.prisma.contentTypeDefinition.create({
      data: {
        name: dto.name,
        label: dto.label ?? null,
        fields: {
          create: dto.fields.map((f) => ({
            name: f.name,
            type: f.type,
            required: f.required ?? false,
            defaultValue:
              f.default !== undefined
                ? (f.default as Prisma.InputJsonValue)
                : undefined,
            options: this.buildStoredOptions(f),
            readonly: f.readonly ?? false,
          })),
        },
      },
    });
    await this.loadSchema();
    return { name: dto.name };
  }

  async updateContentType(
    name: string,
    dto: UpdateContentTypeDto,
  ): Promise<{ name: string }> {
    const def = await this.prisma.contentTypeDefinition.findUnique({
      where: { name },
      include: { fields: true },
    });
    if (!def) {
      throw new NotFoundException(`Content type '${name}' not found`);
    }
    if (dto.label !== undefined) {
      await this.prisma.contentTypeDefinition.update({
        where: { name },
        data: { label: dto.label },
      });
    }
    if (dto.fields !== undefined) {
      await this.prisma.contentTypeField.deleteMany({
        where: { contentTypeDefId: def.id },
      });
      if (dto.fields.length > 0) {
        await this.prisma.contentTypeField.createMany({
          data: dto.fields.map((f) => ({
            contentTypeDefId: def.id,
            name: f.name,
            type: f.type,
            required: f.required ?? false,
            defaultValue:
              f.default !== undefined
                ? (f.default as Prisma.InputJsonValue)
                : undefined,
            options: this.buildStoredOptions(f),
            readonly: f.readonly ?? false,
          })),
        });
      }
    }
    await this.loadSchema();
    return { name };
  }

  private buildStoredOptions(
    f: CreateContentTypeFieldDto | UpdateContentTypeFieldDto,
  ): Prisma.InputJsonValue | undefined {
    if (f.type === 'relation') {
      const rc = f.relationCollection?.trim();
      if (!rc) {
        throw new BadRequestException(
          `Field '${f.name}': relationCollection is required for relation type`,
        );
      }
      return { relationCollection: rc };
    }
    if (f.options?.length) {
      return f.options as unknown as Prisma.InputJsonValue;
    }
    return undefined;
  }

  private mapStoredOptionsToFieldSchema(
    raw: unknown,
  ): Pick<FieldSchema, 'options' | 'relationCollection'> {
    if (raw == null) return {};
    if (Array.isArray(raw)) {
      const opts = raw.filter((x): x is string => typeof x === 'string');
      return opts.length ? { options: opts } : {};
    }
    if (typeof raw === 'object' && !Array.isArray(raw)) {
      const o = raw as Record<string, unknown>;
      const out: Pick<FieldSchema, 'options' | 'relationCollection'> = {};
      if (
        typeof o.relationCollection === 'string' &&
        o.relationCollection.trim()
      ) {
        out.relationCollection = o.relationCollection.trim();
      }
      if (Array.isArray(o.enumValues)) {
        const opts = o.enumValues.filter(
          (x): x is string => typeof x === 'string',
        );
        if (opts.length) out.options = opts;
      }
      return out;
    }
    return {};
  }

  async deleteContentType(name: string): Promise<{ name: string }> {
    const def = await this.prisma.contentTypeDefinition.findUnique({
      where: { name },
    });
    if (!def) {
      throw new NotFoundException(`Content type '${name}' not found`);
    }
    const entryCount = await this.prisma.contentItem.count({
      where: { collection: name },
    });
    if (entryCount > 0) {
      throw new ConflictException(
        `Cannot delete content type '${name}': it has ${entryCount} entries. Delete or move entries first.`,
      );
    }
    await this.prisma.contentTypeDefinition.delete({
      where: { name },
    });
    await this.loadSchema();
    return { name };
  }

  private async loadSchema(): Promise<void> {
    const definitions = await this.prisma.contentTypeDefinition.findMany({
      include: { fields: true },
      orderBy: { name: 'asc' },
    });
    const collections: AppSchema['collections'] = {};
    for (const def of definitions) {
      const fields: Record<string, FieldSchema> = {};
      for (const f of def.fields) {
        const optMap = this.mapStoredOptionsToFieldSchema(f.options);
        fields[f.name] = {
          type: f.type as FieldSchema['type'],
          required: f.required,
          default: f.defaultValue as FieldSchema['default'],
          readonly: f.readonly ?? undefined,
          ...optMap,
        };
      }
      collections[def.name] = {
        label: def.label ?? undefined,
        fields,
      };
    }
    this.schemaCache = { collections };
  }

  getSchema(): AppSchema {
    if (!this.schemaCache) {
      throw new Error('Schema not loaded yet');
    }
    return this.schemaCache;
  }
}
