import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface UserDetails {
  id: string;
  bookmark: any | null;
  user: string;
  role: string | null;
  collection: string;
  search: any | null;
  layout: string;
  layout_query: any | null;
  layout_options: any | null;
  refresh_interval: number | null;
  filter: any | null;
  icon: string;
  color: string | null;
}

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<UserDetails[]> {
    const users = await this.prisma.user.findMany({ include: { role: true } });
    return users.map((u) => ({
      id: u.id,
      bookmark: (u.bookmark ?? null) as any,
      user: u.user,
      role: u.role ? u.role.name : null,
      collection: u.collection,
      search: (u.search ?? null) as any,
      layout: u.layout,
      layout_query: (u.layout_query ?? null) as any,
      layout_options: (u.layout_options ?? null) as any,
      refresh_interval: u.refresh_interval ?? null,
      filter: (u.filter ?? null) as any,
      icon: u.icon,
      color: u.color ?? null,
    }));
  }

  async getById(id: string): Promise<UserDetails | undefined> {
    const u = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
    if (!u) return undefined;
    return {
      id: u.id,
      bookmark: (u.bookmark ?? null) as any,
      user: u.user,
      role: u.role ? u.role.name : null,
      collection: u.collection,
      search: (u.search ?? null) as any,
      layout: u.layout,
      layout_query: (u.layout_query ?? null) as any,
      layout_options: (u.layout_options ?? null) as any,
      refresh_interval: u.refresh_interval ?? null,
      filter: (u.filter ?? null) as any,
      icon: u.icon,
      color: u.color ?? null,
    };
  }

  async create(user: Partial<UserDetails>): Promise<UserDetails> {
    const created = await this.prisma.user.create({
      data: {
        bookmark: user.bookmark ?? undefined,
        user: user.user ?? '',
        collection: user.collection ?? '',
        search: user.search ?? undefined,
        layout: user.layout ?? '',
        layout_query: user.layout_query ?? undefined,
        layout_options: user.layout_options ?? undefined,
        refresh_interval: user.refresh_interval ?? undefined,
        filter: user.filter ?? undefined,
        icon: user.icon ?? '',
        color: user.color ?? undefined,
        role: user.role ? { connect: { name: user.role } } : undefined,
      },
      include: { role: true },
    });
    return {
      id: created.id,
      bookmark: (created.bookmark ?? null) as any,
      user: created.user,
      role: created.role ? created.role.name : null,
      collection: created.collection,
      search: (created.search ?? null) as any,
      layout: created.layout,
      layout_query: (created.layout_query ?? null) as any,
      layout_options: (created.layout_options ?? null) as any,
      refresh_interval: created.refresh_interval ?? null,
      filter: (created.filter ?? null) as any,
      icon: created.icon,
      color: created.color ?? null,
    };
  }

  async update(
    id: string,
    update: Partial<UserDetails>,
  ): Promise<UserDetails | undefined> {
    try {
      const data: any = {
        bookmark: update.bookmark ?? undefined,
        user: update.user ?? undefined,
        collection: update.collection ?? undefined,
        search: update.search ?? undefined,
        layout: update.layout ?? undefined,
        layout_query: update.layout_query ?? undefined,
        layout_options: update.layout_options ?? undefined,
        refresh_interval: update.refresh_interval ?? undefined,
        filter: update.filter ?? undefined,
        icon: update.icon ?? undefined,
        color: update.color ?? undefined,
      };
      if (update.role !== undefined) {
        if (update.role === null) {
          data.role = { disconnect: true };
        } else {
          data.role = { connect: { name: update.role } };
        }
      }
      const updated = await this.prisma.user.update({
        where: { id },
        data,
        include: { role: true },
      });
      return {
        id: updated.id,
        bookmark: (updated.bookmark ?? null) as any,
        user: updated.user,
        role: updated.role ? updated.role.name : null,
        collection: updated.collection,
        search: (updated.search ?? null) as any,
        layout: updated.layout,
        layout_query: (updated.layout_query ?? null) as any,
        layout_options: (updated.layout_options ?? null) as any,
        refresh_interval: updated.refresh_interval ?? null,
        filter: (updated.filter ?? null) as any,
        icon: updated.icon,
        color: updated.color ?? null,
      };
    } catch {
      return undefined;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
