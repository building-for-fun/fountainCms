import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User, Prisma } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(): Promise<{ data: User | null }> {
    const users = await this.userService.getAll();
    // Return the first user found, or null if empty (matching previous logic)
    return { data: users.length > 0 ? users[0] : null };
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<User | null> {
    return await this.userService.getById(id);
  }

  @Post()
  async create(@Body() body: Prisma.UserCreateInput): Promise<User> {
    return await this.userService.create(body);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: any, // Using any temporarily to handle the extraction below
  ): Promise<User | null> {
    // Extract role if present, because your service handles relation updates via 'roleName'
    const { role, ...userData } = body;

    return await this.userService.update(id, {
      data: userData,
      roleName: role,
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ success: boolean }> {
    const ok = await this.userService.delete(id);
    return { success: ok };
  }
}
