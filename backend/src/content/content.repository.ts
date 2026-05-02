import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';

export type ContentStatus = 'draft' | 'published';

@Injectable()
export class ContentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    collection: string,
    data: Prisma.InputJsonValue,
    status: ContentStatus = 'draft',
    publishedAt: Date | null = null,
  ) {
    return this.prisma.contentItem.create({
      data: {
        collection,
        data,
        status,
        publishedAt,
      },
    });
  }

  async findMany(collection: string, status?: ContentStatus) {
    const where: Prisma.ContentItemWhereInput = { collection };
    if (status) where.status = status;
    return this.prisma.contentItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async count(collection: string, status?: ContentStatus) {
    const where: Prisma.ContentItemWhereInput = { collection };
    if (status) where.status = status;
    return this.prisma.contentItem.count({ where });
  }

  async findById(collection: string, id: string) {
    return this.prisma.contentItem.findFirst({
      where: {
        id,
        collection,
      },
    });
  }

  async update(
    collection: string,
    id: string,
    data: Prisma.InputJsonValue,
    status?: ContentStatus,
    publishedAt?: Date | null,
  ) {
    const updateData: Prisma.ContentItemUpdateInput = { data };
    if (status !== undefined) updateData.status = status;
    if (publishedAt !== undefined) updateData.publishedAt = publishedAt;
    return this.prisma.contentItem.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(collection: string, id: string) {
    return this.prisma.contentItem.deleteMany({
      where: { id, collection },
    });
  }
}
