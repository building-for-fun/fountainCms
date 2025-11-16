import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
//import type { ContentItem } from './content.service';
import {
  ContentDto,
  ContentItemDto,
  ContentListDto,
} from './content-details.model';
import { ContentService } from './content.service';

@ApiTags('content')
@Controller('api/content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all content items' })
  @ApiResponse({
    status: 200,
    description: 'List of all content items.',
    type: ContentListDto,
  })
  getAll(): ContentListDto {
    // Internally, items are ContentItem, returned as DTOs
    const result = this.contentService.getAll();
    return {
      ...result,
      items: result.items.map((item) => item as ContentItemDto),
    };
  }

  @Get(':key')
  @ApiOperation({ summary: 'Get content item by key' })
  @ApiParam({ name: 'key', description: 'Unique key for content item' })
  @ApiResponse({
    status: 200,
    description: 'The content item with specified key.',
    type: ContentItemDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  getByKey(@Param('key') key: string): ContentItemDto {
    const item = this.contentService.getByKey(key);
    if (typeof item === 'undefined') throw new NotFoundException('Not found');
    // For regular content items, return as ContentItemDto
    // For other keys, handle accordingly (if ever used!)
    if (key === 'items' && Array.isArray(item)) {
      throw new NotFoundException('Key refers to item list, not a single item');
    }
    return item as ContentItemDto;
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new content item' })
  @ApiBody({ type: ContentDto })
  @ApiResponse({
    status: 201,
    description: 'The created content item.',
    type: ContentItemDto,
  })
  create(@Body() body: ContentDto): ContentItemDto {
    const created = this.contentService.create(body);
    return created as ContentItemDto;
  }
}
