import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class RoleDetails {
  id!: string;
  name!: string;
  description?: string;
  permissions?: string[];
}

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<RoleDetails[]> {
    const roles = await this.prisma.role.findMany();
    return roles.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description ?? '',
      permissions: r.permissions ?? [],
    }));
  }

  async getById(id: string): Promise<RoleDetails | undefined> {
    const r = await this.prisma.role.findUnique({ where: { id } });
    if (!r) return undefined;
    return {
      id: r.id,
      name: r.name,
      description: r.description ?? '',
      permissions: r.permissions ?? [],
    };
  }

  async create(role: Partial<RoleDetails>): Promise<RoleDetails> {
    const created = await this.prisma.role.create({
      data: {
        name: role.name ?? '',
        description: role.description ?? undefined,
        permissions: role.permissions ?? [],
      },
    });
    return {
      id: created.id,
      name: created.name,
      description: created.description ?? '',
      permissions: created.permissions ?? [],
    };
  }

  async update(
    id: string,
    update: Partial<RoleDetails>,
  ): Promise<RoleDetails | undefined> {
    try {
      const updated = await this.prisma.role.update({
        where: { id },
        data: {
          name: update.name ?? undefined,
          description: update.description ?? undefined,
          permissions: update.permissions ?? undefined,
        },
      });
      return {
        id: updated.id,
        name: updated.name,
        description: updated.description ?? '',
        permissions: updated.permissions ?? [],
      };
    } catch {
      return undefined;
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
