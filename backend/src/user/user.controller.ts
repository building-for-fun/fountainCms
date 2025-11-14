import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserDetailsDto } from './user-details.model';
import { UserDetails, UserService } from './user.service';
@ApiTags('user') // Groups these endpoints under 'user' in Swagger UI
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get first user or null' })
  @ApiResponse({
    status: 200,
    description: 'Returns the first user or null',
    type: UserDetailsDto,
  })
  getAll(): { data: UserDetails | null } {
    const users = this.userService.getAll();
    return { data: users.length > 0 ? users[0] : null };
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: UserDetailsDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserDetailsDto,
  })
  create(@Body() body: Partial<UserDetails>): UserDetails {
    return this.userService.create(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User found', type: UserDetailsDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  getById(@Param('id') id: string): UserDetails {
    const user = this.userService.getById(id);
    if (!user) throw new NotFoundException('Not found');
    return user;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UserDetailsDto })
  @ApiResponse({
    status: 200,
    description: 'User updated',
    type: UserDetailsDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(
    @Param('id') id: string,
    @Body() body: Partial<UserDetails>,
  ): UserDetails {
    const user = this.userService.update(id, body);
    if (!user) throw new NotFoundException('Not found');
    return user;
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 204, description: 'User deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  delete(@Param('id') id: string): void {
    const deleted = this.userService.delete(id);
    if (!deleted) throw new NotFoundException('Not found');
  }
}
