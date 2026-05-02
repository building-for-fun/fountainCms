import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-scalars';

@ObjectType()
export class ContentCollectionMetaGql {
  @Field(() => Int)
  total!: number;

  @Field(() => Int, { nullable: true })
  limit!: number | null;

  @Field(() => Int)
  offset!: number;

  @Field()
  sort!: string;
}

@ObjectType()
export class ContentCollectionResultGql {
  @Field(() => [GraphQLJSONObject])
  data!: Record<string, unknown>[];

  @Field(() => ContentCollectionMetaGql)
  meta!: ContentCollectionMetaGql;
}

@ObjectType()
export class DeleteContentResultGql {
  @Field()
  success!: boolean;
}
