import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ContentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(collection: string, data: Prisma.InputJsonValue) {
    return this.prisma.contentItem.create({
      data: {
        collection,
        data,
      },
    });
  }

  async findMany(collection: string) {
    return this.prisma.contentItem.findMany({
      where: { collection },
      orderBy: { createdAt: 'desc' },
    });
  }

  async count(collection: string) {
    return this.prisma.contentItem.count({
      where: { collection },
    });
  }

  async findById(collection: string, id: string) {
    return this.prisma.contentItem.findFirst({
      where: {
        id,
        collection,
      },
    });
  }

  async update(collection: string, id: string, data: Prisma.InputJsonValue) {
    return this.prisma.contentItem.update({
      where: { id },
      data: {
        data,
      },
    });
  }

  async delete(collection: string, id: string) {
    return this.prisma.contentItem.deleteMany({
      where: { id, collection },
    });
  }
}
