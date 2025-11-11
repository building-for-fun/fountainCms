import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { UserService, UserDetails } from './user.service';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll(): { data: UserDetails | null } {
    const users = this.userService.getAll();
    return { data: users.length > 0 ? users[0] : null };
  }

  @Post()
  @HttpCode(201)
  create(@Body() body: Partial<UserDetails>): UserDetails {
    return this.userService.create(body);
  }

  @Get(':id')
  getById(@Param('id') id: string): UserDetails {
    const user = this.userService.getById(id);
    if (!user) throw new NotFoundException('Not found');
    return user;
  }

  @Put(':id')
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
  delete(@Param('id') id: string): void {
    const deleted = this.userService.delete(id);
    if (!deleted) throw new NotFoundException('Not found');
  }
}
