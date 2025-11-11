import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { ContentService } from './content.service';
import type { ContentItem } from './content.service';
import { ContentDto } from './content.service';

@Controller('api/content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  getAll(): Record<string, unknown> & { items: ContentItem[] } {
    return this.contentService.getAll();
  }

  @Get(':key')
  getByKey(@Param('key') key: string): Record<string, unknown> {
    const item: unknown = this.contentService.getByKey(key);
    if (typeof item === 'undefined') throw new NotFoundException('Not found');
    return { [key]: item };
  }

  @Post()
  @HttpCode(201)
  create(@Body() body: ContentDto): ContentItem {
    return this.contentService.create(body);
  }
}
