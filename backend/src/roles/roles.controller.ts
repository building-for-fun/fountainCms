import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { RolesService, RoleDetails } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async getAll(): Promise<{ data: RoleDetails[] }> {
    const data = await this.rolesService.getAll();
    return { data };
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<RoleDetails | undefined> {
    const role = await this.rolesService.getById(id);
    return role;
  }

  @Post()
  async create(@Body() body: Partial<RoleDetails>): Promise<RoleDetails> {
    const created = await this.rolesService.create(body);
    return created;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<RoleDetails>,
  ): Promise<RoleDetails | undefined> {
    const updated = await this.rolesService.update(id, body);
    return updated;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ success: boolean }> {
    const ok = await this.rolesService.delete(id);
    return { success: ok };
  }
}
