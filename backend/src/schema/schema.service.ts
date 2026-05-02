import {
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AppSchema, FieldSchema } from './schema.types';
import { CreateContentTypeDto } from './dto/create-content-type.dto';
import { UpdateContentTypeDto } from './dto/update-content-type.dto';

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
            options: f.options as Prisma.InputJsonValue | undefined,
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
            options: f.options as Prisma.InputJsonValue | undefined,
            readonly: f.readonly ?? false,
          })),
        });
      }
    }
    await this.loadSchema();
    return { name };
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
        fields[f.name] = {
          type: f.type as FieldSchema['type'],
          required: f.required,
          default: f.defaultValue as FieldSchema['default'],
          options: f.options as string[] | undefined,
          readonly: f.readonly ?? undefined,
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
