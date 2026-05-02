import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { RolesModule } from './roles/roles.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { SchemaModule } from './schema/schema.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { MediaModule } from './media/media.module';
import { ApiTokensModule } from './api-tokens/api-tokens.module';
import { FountainGraphqlModule } from './graphql/graphql.module';
import { ExtensionsCoreModule } from './extensions/extensions-core.module';
import { resolveExtensionModules } from './extensions/extension-catalog';

const ENABLED_EXTENSION_IDS_FROM_ENV = (process.env.EXTENSIONS_ENABLED ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ExtensionsCoreModule.forRoot(ENABLED_EXTENSION_IDS_FROM_ENV),
    ...resolveExtensionModules(ENABLED_EXTENSION_IDS_FROM_ENV),
    PrismaModule,
    AuthModule,
    ApiTokensModule,
    ContentModule,
    FountainGraphqlModule,
    RolesModule,
    UserModule,
    SchemaModule,
    AuditLogsModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
