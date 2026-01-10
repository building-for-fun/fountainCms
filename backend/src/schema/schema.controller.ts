import { Controller, Get } from '@nestjs/common';
import { AppSchema } from './schema.types';
import { SchemaService } from './schema.service';

@Controller('schema')
export class SchemaController {
  constructor(private readonly schemaService: SchemaService) {}

  @Get()
  getSchema(): AppSchema {
    return this.schemaService.getSchema();
  }
}
