import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppSchema, CollectionSchema, FieldSchema } from './schema.types';

@Injectable()
export class SchemaService implements OnModuleInit {
  private schemaCache: AppSchema | null = null;

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    await this.loadSchema();
  }

  /** Called by APP_INITIALIZER to ensure schema is ready before app accepts requests */
  async ensureSchemaLoaded(): Promise<void> {
    if (!this.schemaCache) {
      await this.loadSchema();
    }
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
