import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AppSchema } from './schema.types';
import { SchemaService } from './schema.service';
import { CreateContentTypeDto } from './dto/create-content-type.dto';
import { UpdateContentTypeDto } from './dto/update-content-type.dto';
import { SchemaPermissionGuard } from './guards/schema-permission.guard';

@Controller('schema')
@UseGuards(SchemaPermissionGuard)
export class SchemaController {
  constructor(private readonly schemaService: SchemaService) {}

  @Get()
  getSchema(): AppSchema {
    return this.schemaService.getSchema();
  }

  @Post()
  createContentType(@Body() dto: CreateContentTypeDto) {
    return this.schemaService.createContentType(dto);
  }

  @Patch(':name')
  updateContentType(
    @Param('name') name: string,
    @Body() dto: UpdateContentTypeDto,
  ) {
    return this.schemaService.updateContentType(name, dto);
  }

  @Delete(':name')
  deleteContentType(@Param('name') name: string) {
    return this.schemaService.deleteContentType(name);
  }
}
