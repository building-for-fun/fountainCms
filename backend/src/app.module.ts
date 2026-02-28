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

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ContentModule,
    RolesModule,
    UserModule,
    SchemaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuditLogsModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
