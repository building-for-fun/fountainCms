import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<User[]> {
    return await this.prisma.user.findMany({ include: { role: true } });
  }

  async getById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({
      data,
      include: { role: true },
    });
  }

  async update(
    id: string,
    params: {
      data: Prisma.UserUpdateInput;
      roleName?: string | null; // Handle role update logic specifically if needed
    },
  ): Promise<User> {
    const { data, roleName } = params;

    // Handle relation update logic
    if (roleName !== undefined) {
      if (roleName === null) {
        data.role = { disconnect: true };
      } else {
        data.role = { connect: { name: roleName } };
      }
    }

    return await this.prisma.user.update({
      where: { id },
      data,
      include: { role: true },
    });
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
