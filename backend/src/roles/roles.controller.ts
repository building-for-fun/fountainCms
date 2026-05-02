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
import { Role, Prisma } from '../generated/prisma/client';
import { Request } from 'express';

type RequestWithUser = Request & { user?: { sub: string } };

function getActor(req: RequestWithUser) {
  return {
    userId: req.user?.sub ?? null,
    ip:
      (req.ip as string) ?? (req.headers['x-forwarded-for'] as string) ?? null,
    userAgent: (req.headers['user-agent'] as string) ?? null,
  };
}

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
    @Req() req: RequestWithUser,
  ): Promise<Role> {
    return await this.rolesService.create(body, getActor(req));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Prisma.RoleUpdateInput,
    @Req() req: RequestWithUser,
  ): Promise<Role | null> {
    return await this.rolesService.update(id, body, getActor(req));
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<{ success: boolean }> {
    const ok = await this.rolesService.delete(id, getActor(req));
    return { success: ok };
  }
}
