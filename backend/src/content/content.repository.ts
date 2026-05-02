import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../generated/prisma/client';

export type ContentStatus = 'draft' | 'published';

export interface FindManyContentParams {
  collection: string;
  status?: ContentStatus;
  skip: number;
  /** Omit or undefined = no limit (all rows after skip). */
  take?: number;
  orderBy: Prisma.ContentItemOrderByWithRelationInput;
  dataFilterAnd?: Prisma.ContentItemWhereInput[];
}

export interface CountContentParams {
  collection: string;
  status?: ContentStatus;
  dataFilterAnd?: Prisma.ContentItemWhereInput[];
}

@Injectable()
export class ContentRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(
    collection: string,
    status?: ContentStatus,
    dataFilterAnd?: Prisma.ContentItemWhereInput[],
  ): Prisma.ContentItemWhereInput {
    const where: Prisma.ContentItemWhereInput = { collection };
    if (status) where.status = status;
    if (dataFilterAnd?.length) {
      where.AND = dataFilterAnd;
    }
    return where;
  }

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

  async findMany(params: FindManyContentParams) {
    const where = this.buildWhere(
      params.collection,
      params.status,
      params.dataFilterAnd,
    );
    return this.prisma.contentItem.findMany({
      where,
      orderBy: params.orderBy,
      skip: params.skip,
      ...(params.take !== undefined ? { take: params.take } : {}),
    });
  }

  async count(params: CountContentParams) {
    const where = this.buildWhere(
      params.collection,
      params.status,
      params.dataFilterAnd,
    );
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
