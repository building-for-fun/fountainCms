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
import { RolesService, RoleDetails } from './roles.service';

@Controller('api/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  getAll(): { data: RoleDetails[] } {
    return { data: this.rolesService.getAll() };
  }

  @Post()
  @HttpCode(201)
  create(@Body() body: Partial<RoleDetails>): RoleDetails {
    return this.rolesService.create(body);
  }

  @Get(':id')
  getById(@Param('id') id: string): RoleDetails {
    const role = this.rolesService.getById(id);
    if (!role) throw new NotFoundException('Not found');
    return role;
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: Partial<RoleDetails>,
  ): RoleDetails {
    const role = this.rolesService.update(id, body);
    if (!role) throw new NotFoundException('Not found');
    return role;
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string): void {
    const deleted = this.rolesService.delete(id);
    if (!deleted) throw new NotFoundException('Not found');
  }
}
