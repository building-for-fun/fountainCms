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
import type { Request } from 'express';
import { ContentService } from './content.service';
import { ContentPermissionGuard } from './guards/content-permission.guard';
import { AllowAnonymousPublishedRead } from '../auth/decorators/allow-anonymous-published.decorator';

@Controller('content/collections')
@UseGuards(ContentPermissionGuard)
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get(':collection')
  @AllowAnonymousPublishedRead()
  getMany(
    @Req() req: Request,
    @Param('collection') collection: string,
    @Query('status') status?: string,
  ) {
    const anon = req.anonymousContentRead === true;
    const publishedOnly = anon ? true : status === 'published';
    return this.contentService.findMany(collection, publishedOnly);
  }

  @Get(':collection/:id')
  @AllowAnonymousPublishedRead()
  getOne(
    @Req() req: Request,
    @Param('collection') collection: string,
    @Param('id') id: string,
  ) {
    const anon = req.anonymousContentRead === true;
    return this.contentService.findOne(collection, id, { anonymous: anon });
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
