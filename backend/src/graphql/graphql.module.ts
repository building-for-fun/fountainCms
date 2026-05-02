import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'node:path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { GraphQLJSONObject } from 'graphql-scalars';
import { ContentModule } from '../content/content.module';
import { AuthModule } from '../auth/auth.module';
import { ContentGraphqlResolver } from './content.graphql.resolver';
import { GraphqlContentGuard } from './graphql-content.guard';

const isProd = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      path: '/api/graphql',
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      sortSchema: true,
      context: ({ req, res }: { req: unknown; res: unknown }) => ({
        req,
        res,
      }),
      introspection: !isProd,
      playground: false,
      plugins: isProd ? [] : [ApolloServerPluginLandingPageLocalDefault()],
      resolvers: { JSONObject: GraphQLJSONObject },
    }),
    ContentModule,
    AuthModule,
  ],
  providers: [ContentGraphqlResolver, GraphqlContentGuard],
})
export class FountainGraphqlModule {}
