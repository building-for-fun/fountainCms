import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role, Prisma } from '@prisma/client';
import { Request } from 'express';

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
  async create(
    @Body() body: Prisma.RoleCreateInput,
    @Req() req: Request,
  ): Promise<Role> {
    const actor = {
      userId: (req.headers['x-user-id'] as string) ?? null,
      ip:
        (req.ip as string) ??
        (req.headers['x-forwarded-for'] as string) ??
        null,
      userAgent: (req.headers['user-agent'] as string) ?? null,
    };
    return await this.rolesService.create(body, actor);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Prisma.RoleUpdateInput,
    @Req() req: Request,
  ): Promise<Role | null> {
    const actor = {
      userId: (req.headers['x-user-id'] as string) ?? null,
      ip:
        (req.ip as string) ??
        (req.headers['x-forwarded-for'] as string) ??
        null,
      userAgent: (req.headers['user-agent'] as string) ?? null,
    };
    return await this.rolesService.update(id, body, actor);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<{ success: boolean }> {
    const actor = {
      userId: (req.headers['x-user-id'] as string) ?? null,
      ip:
        (req.ip as string) ??
        (req.headers['x-forwarded-for'] as string) ??
        null,
      userAgent: (req.headers['user-agent'] as string) ?? null,
    };
    const ok = await this.rolesService.delete(id, actor);
    return { success: ok };
  }
}
