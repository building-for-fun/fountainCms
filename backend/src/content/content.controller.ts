import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentPermissionGuard } from './guards/content-permission.guard';

@Controller('content/collections')
@UseGuards(ContentPermissionGuard)
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get(':collection')
  getMany(
    @Param('collection') collection: string,
    @Query('status') status?: string,
  ) {
    const publishedOnly = status === 'published';
    return this.contentService.findMany(collection, publishedOnly);
  }

  @Get(':collection/:id')
  getOne(@Param('collection') collection: string, @Param('id') id: string) {
    return this.contentService.findOne(collection, id);
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
