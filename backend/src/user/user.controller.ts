import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { UserService, UserDetails } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(): Promise<{ data: UserDetails | null }> {
    const users = await this.userService.getAll();
    return { data: users.length > 0 ? users[0] : null };
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<UserDetails | undefined> {
    const user = await this.userService.getById(id);
    return user;
  }

  @Post()
  async create(@Body() body: Partial<UserDetails>): Promise<UserDetails> {
    const created = await this.userService.create(body);
    return created;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<UserDetails>,
  ): Promise<UserDetails | undefined> {
    const updated = await this.userService.update(id, body);
    return updated;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ success: boolean }> {
    const ok = await this.userService.delete(id);
    return { success: ok };
  }
}
