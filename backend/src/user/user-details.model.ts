import { ApiProperty } from '@nestjs/swagger';

export class UserDetailsDto {
  @ApiProperty({ example: 'u1', description: 'Unique user ID' })
  id: string;

  @ApiProperty({ description: 'Bookmark data', type: Object, nullable: true })
  bookmark: object | null;

  @ApiProperty({ example: 'john_doe', description: 'Username' })
  user: string;

  @ApiProperty({ description: 'Role data', type: Object, nullable: true })
  role: object | null;

  @ApiProperty({
    example: 'default_collection',
    description: 'Collection name',
  })
  collection: string;

  @ApiProperty({ description: 'Search data', type: Object, nullable: true })
  search: object | null;

  @ApiProperty({ example: 'grid', description: 'Layout type' })
  layout: string;

  @ApiProperty({
    description: 'Layout query parameters',
    type: Object,
    nullable: true,
  })
  layout_query: object | null;

  @ApiProperty({
    description: 'Options for layout',
    type: Object,
    nullable: true,
  })
  layout_options: object | null;

  @ApiProperty({
    description: 'Refresh interval',
    type: Object,
    nullable: true,
  })
  refresh_interval: object | null;

  @ApiProperty({ description: 'Filter details', type: Object, nullable: true })
  filter: object | null;

  @ApiProperty({ example: 'user-icon.png', description: 'Icon URL or name' })
  icon: string;

  @ApiProperty({
    description: 'Color information',
    type: Object,
    nullable: true,
  })
  color: object | null;
}
