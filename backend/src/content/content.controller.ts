import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ContentService } from './content.service';

@Controller('content/collections')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get(':collection')
  getMany(@Param('collection') collection: string) {
    return this.contentService.findMany(collection);
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
