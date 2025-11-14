import { ApiProperty } from '@nestjs/swagger';

export class RoleDetails {
  @ApiProperty({ example: 'r1', description: 'Unique identifier for the role' })
  id: string;

  @ApiProperty({ example: 'admin', description: 'Role name' })
  name: string;

  @ApiProperty({
    example: 'Full access role',
    description: 'Role description',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: ['read', 'write', 'delete'],
    description: 'Permissions granted to the role',
    type: [String],
    required: false,
  })
  permissions?: string[];
}
