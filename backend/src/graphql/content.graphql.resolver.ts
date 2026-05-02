import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-scalars';
import { ContentService } from '../content/content.service';
import { GraphqlContentGuard } from './graphql-content.guard';
import { gqlListArgsToQueryRecord } from './graphql-args.util';
import { AllowAnonymousPublishedRead } from '../auth/decorators/allow-anonymous-published.decorator';
import { RequireContentOperation } from './decorators/require-content-operation.decorator';
import type { FountainAuthRequest } from '../auth/auth-apply.service';
import {
  ContentCollectionResultGql,
  DeleteContentResultGql,
} from './content-gql.types';

@Resolver()
@UseGuards(GraphqlContentGuard)
export class ContentGraphqlResolver {
  constructor(private readonly content: ContentService) {}

  @Query(() => ContentCollectionResultGql, {
    name: 'contentCollection',
    description:
      'List entries (same options as GET /api/content/collections/:collection)',
  })
  @AllowAnonymousPublishedRead()
  async contentCollection(
    @Context() ctx: { req: FountainAuthRequest },
    @Args('collection', { description: 'Content type name (e.g. posts)' })
    collection: string,
    @Args('status', { nullable: true }) status?: string,
    @Args('locale', { nullable: true }) locale?: string,
    @Args('limit', { nullable: true, type: () => Int }) limit?: number,
    @Args('offset', { nullable: true, type: () => Int }) offset?: number,
    @Args('sort', { nullable: true }) sort?: string,
    @Args('fields', { nullable: true }) fields?: string,
    @Args('populate', { nullable: true }) populate?: string,
    @Args('filter', { type: () => GraphQLJSONObject, nullable: true })
    filter?: Record<string, unknown>,
  ): Promise<ContentCollectionResultGql> {
    const req = ctx.req;
    const anon = req.anonymousContentRead === true;
    const publishedOnly = anon ? true : status === 'published';
    const query = gqlListArgsToQueryRecord({
      status,
      locale,
      limit,
      offset,
      sort,
      fields,
      populate,
      filter,
    });
    return this.content.findMany(collection, {
      publishedOnly,
      anonymous: anon,
      query,
    }) as Promise<ContentCollectionResultGql>;
  }

  @Query(() => GraphQLJSONObject, {
    name: 'contentItem',
    description: 'Single entry by id',
  })
  @AllowAnonymousPublishedRead()
  async contentItem(
    @Context() ctx: { req: FountainAuthRequest },
    @Args('collection') collection: string,
    @Args('id') id: string,
    @Args('populate', { nullable: true }) populate?: string,
  ): Promise<Record<string, unknown>> {
    const req = ctx.req;
    const anon = req.anonymousContentRead === true;
    const query =
      populate != null && populate !== ''
        ? ({ populate } as Record<string, string | string[] | undefined>)
        : undefined;
    const res = await this.content.findOne(collection, id, {
      anonymous: anon,
      query,
    });
    return res.data as Record<string, unknown>;
  }

  @Mutation(() => GraphQLJSONObject, { name: 'createCollectionItem' })
  @RequireContentOperation('create')
  async createCollectionItem(
    @Args('collection') collection: string,
    @Args('data', { type: () => GraphQLJSONObject })
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const res = await this.content.create(collection, data);
    return res.data as Record<string, unknown>;
  }

  @Mutation(() => GraphQLJSONObject, { name: 'updateCollectionItem' })
  @RequireContentOperation('update')
  async updateCollectionItem(
    @Context() ctx: { req: FountainAuthRequest },
    @Args('collection') collection: string,
    @Args('id') id: string,
    @Args('data', { type: () => GraphQLJSONObject })
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const res = await this.content.update(collection, id, data, {
      editorUserId: ctx.req.user?.sub ?? null,
    });
    return res.data as Record<string, unknown>;
  }

  @Mutation(() => DeleteContentResultGql, { name: 'deleteCollectionItem' })
  @RequireContentOperation('delete')
  async deleteCollectionItem(
    @Args('collection') collection: string,
    @Args('id') id: string,
  ): Promise<DeleteContentResultGql> {
    await this.content.delete(collection, id);
    return { success: true };
  }
}
