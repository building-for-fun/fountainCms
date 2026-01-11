import { ApiProperty } from '@nestjs/swagger';
import { RoleDetails } from '../roles/role-details.model';

export class UserDetailsDto {
  @ApiProperty({ example: 'u1', description: 'Unique user ID', required: false })
  id?: string;

  @ApiProperty({ example: 'john_doe', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  lastName: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  email: string;

  @ApiProperty({
    example: true,
    description: 'Whether the user account is active',
    default: false,
    required: false,
  })
  isActive?: boolean;

  @ApiProperty({
    description: 'Associated role ID (if any)',
    required: false,
    nullable: true,
  })
  roleId?: string | null;

  @ApiProperty({
    description: 'Role information including permissions',
    type: RoleDetails,
    required: false,
    nullable: true,
  })
  role?: RoleDetails | null;

  @ApiProperty({
    description: 'Timestamp when the user was created',
    required: false,
  })
  createdAt?: Date;

  @ApiProperty({
    description: 'Timestamp when the user was last updated',
    required: false,
  })
  updatedAt?: Date;
}
