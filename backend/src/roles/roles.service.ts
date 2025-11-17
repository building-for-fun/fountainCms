import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, Prisma } from '@prisma/client';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<Role[]> {
    return await this.prisma.role.findMany();
  }

  async getById(id: string): Promise<Role | null> {
    return await this.prisma.role.findUnique({ where: { id } });
  }

  async create(data: Prisma.RoleCreateInput): Promise<Role> {
    return await this.prisma.role.create({ data });
  }

  async update(id: string, data: Prisma.RoleUpdateInput): Promise<Role | null> {
    try {
      return await this.prisma.role.update({
        where: { id },
        data,
      });
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.role.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
