import { Injectable } from '@nestjs/common';
import { AppSchema } from './schema.types';
import { loadSchema } from '../../schema/schema.loader';

@Injectable()
export class SchemaService {
  private readonly schema: AppSchema;

  constructor() {
    this.schema = loadSchema();
  }

  getSchema(): AppSchema {
    return this.schema;
  }
}
