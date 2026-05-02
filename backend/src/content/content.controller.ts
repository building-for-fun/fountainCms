import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import type { Request } from 'express';
import { ContentService } from './content.service';
import { ContentPermissionGuard } from './guards/content-permission.guard';
import { AllowAnonymousPublishedRead } from '../auth/decorators/allow-anonymous-published.decorator';
import { firstQueryValue } from './content-query.util';

@Controller('content/collections')
@UseGuards(ContentPermissionGuard)
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get(':collection')
  @AllowAnonymousPublishedRead()
  @ApiOperation({
    summary: 'List content entries',
    description:
      'Optional: limit, offset, sort (createdAt|updatedAt|publishedAt, -field or field:desc), filter (JSON object of field equals), fields (comma-separated projection). Omit limit to return all matches.',
  })
  @ApiQuery({ name: 'status', required: false, enum: ['published', 'draft'] })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'offset', required: false, example: 0 })
  @ApiQuery({ name: 'sort', required: false, example: '-createdAt' })
  @ApiQuery({
    name: 'filter',
    required: false,
    description: 'JSON object, e.g. {"title":"Hello"}',
  })
  @ApiQuery({
    name: 'fields',
    required: false,
    description: 'Comma-separated schema fields to include in each item',
  })
  @ApiQuery({
    name: 'populate',
    required: false,
    description:
      'Comma-separated relation field names to expand, or * / all for every relation field',
  })
  getMany(
    @Req() req: Request,
    @Param('collection') collection: string,
    @Query() query: Record<string, string | string[] | undefined>,
  ) {
    const anon = req.anonymousContentRead === true;
    const statusVal = firstQueryValue(query, 'status');
    const publishedOnly = anon ? true : statusVal === 'published';
    return this.contentService.findMany(collection, {
      publishedOnly,
      anonymous: anon,
      query,
    });
  }

  @Get(':collection/:id')
  @AllowAnonymousPublishedRead()
  @ApiQuery({
    name: 'populate',
    required: false,
    description:
      'Comma-separated relation field names to expand, or * / all for every relation field',
  })
  getOne(
    @Req() req: Request,
    @Param('collection') collection: string,
    @Param('id') id: string,
    @Query() query: Record<string, string | string[] | undefined>,
  ) {
    const anon = req.anonymousContentRead === true;
    return this.contentService.findOne(collection, id, {
      anonymous: anon,
      query,
    });
  }

  @Post(':collection')
  create(
    @Param('collection') collection: string,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.contentService.create(collection, payload);
  }

  @Patch(':collection/:id')
  update(
    @Param('collection') collection: string,
    @Param('id') id: string,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.contentService.update(collection, id, payload);
  }

  @Delete(':collection/:id')
  delete(@Param('collection') collection: string, @Param('id') id: string) {
    return this.contentService.delete(collection, id);
  }
}
