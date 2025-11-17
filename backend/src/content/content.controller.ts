import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ContentService, ContentDto, ContentItem } from './content.service';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  async getAll(): Promise<{ items: ContentItem[] } & Record<string, unknown>> {
    const result = await this.contentService.getAll();
    return result;
  }

  @Get(':key')
  async getByKey(@Param('key') key: string): Promise<unknown> {
    const item = await this.contentService.getByKey(key);
    return item;
  }

  @Post()
  async create(@Body() body: ContentDto): Promise<ContentItem> {
    const created = await this.contentService.create(body);
    return created;
  }
}
