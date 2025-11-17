import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role, Prisma } from '@prisma/client';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async getAll(): Promise<{ data: Role[] }> {
    const data = await this.rolesService.getAll();
    return { data };
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Role | null> {
    return await this.rolesService.getById(id);
  }

  @Post()
  async create(@Body() body: Prisma.RoleCreateInput): Promise<Role> {
    return await this.rolesService.create(body);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Prisma.RoleUpdateInput,
  ): Promise<Role | null> {
    return await this.rolesService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ success: boolean }> {
    const ok = await this.rolesService.delete(id);
    return { success: ok };
  }
}
