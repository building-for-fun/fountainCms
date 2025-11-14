import { ApiProperty } from '@nestjs/swagger';

export class ContentDto {
  @ApiProperty({ description: 'Unique identifier for the content item' })
  id: string;

  @ApiProperty({ description: 'Title of the content item' })
  title: string;

  @ApiProperty({ description: 'Body content of the content item' })
  body: string;

  @ApiProperty({ description: 'Creation timestamp in ISO format' })
  createdAt: string;
}

export class ContentItemDto {
  @ApiProperty({ description: 'Unique identifier for the content item' })
  id: string;

  @ApiProperty({ description: 'Title of the content item' })
  title: string;

  @ApiProperty({ description: 'Body content of the content item' })
  body: string;

  @ApiProperty({ description: 'Creation timestamp in ISO format' })
  createdAt: string;
}

export class ContentListDto {
  @ApiProperty({
    description: 'Array of content items',
    type: [ContentItemDto],
  })
  items: ContentItemDto[];
}
