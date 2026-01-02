import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { User, Prisma } from '@prisma/client';
import { UserDetailsDto } from './user-details.model';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Return all users.',
    type: UserDetailsDto,
  })
  async getAll(): Promise<{ data: User[] | null }> {
    const users = await this.userService.getAll();
    return { data: users.length > 0 ? users : null };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the user.',
    type: UserDetailsDto,
  })
  async getById(@Param('id') id: string): Promise<User | null> {
    return await this.userService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: UserDetailsDto })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: UserDetailsDto,
  })
  async create(@Body() body: Prisma.UserCreateInput): Promise<User> {
    return await this.userService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UserDetailsDto })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: UserDetailsDto,
  })
  async update(
    @Param('id') id: string,
    @Body() body: any,
  ): Promise<User | null> {
    const { role, ...userData } = body;
    return await this.userService.update(id, {
      data: userData,
      roleName: role,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  async delete(@Param('id') id: string): Promise<{ success: boolean }> {
    const ok = await this.userService.delete(id);
    return { success: ok };
  }
}
