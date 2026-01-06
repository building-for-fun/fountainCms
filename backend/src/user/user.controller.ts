import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  InternalServerErrorException,
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
    type: [UserDetailsDto],
  })
  async getAll(): Promise<{ data: User[] }> {
    try {
      const users = await this.userService.getAll();
      return { data: users ?? [] };
    } catch (error) {
      console.error('🔥 Failed to fetch users:', error);
      throw new InternalServerErrorException('Failed to fetch users');
    }
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
    try {
      return await this.userService.getById(id);
    } catch (error) {
      console.error(`🔥 Failed to fetch user ${id}:`, error);
      throw new InternalServerErrorException('Failed to fetch user');
    }
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
    try {
      return await this.userService.create(body);
    } catch (error) {
      console.error('🔥 Failed to create user:', error);
      throw new InternalServerErrorException('Failed to create user');
    }
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
  ): Promise<User> {
    try {
      const { role, permissions, ...userData } = body;
      const updatedUser = await this.userService.update(id, {
        data: userData,
        roleName: role,
      });
      return updatedUser;
    } catch (error) {
      console.error(`🔥 Failed to update user ${id}:`, error);
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  async delete(@Param('id') id: string): Promise<{ success: boolean }> {
    try {
      const ok = await this.userService.delete(id);
      return { success: ok };
    } catch (error) {
      console.error(`🔥 Failed to delete user ${id}:`, error);
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
