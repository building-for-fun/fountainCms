import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { MediaController } from './media.controller';
import { MediaServeAuthGuard } from './media-serve-auth.guard';
import { MediaService } from './media.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, ConfigModule, AuthModule],
  controllers: [MediaController],
  providers: [MediaService, MediaServeAuthGuard],
  exports: [MediaService],
})
export class MediaModule {}
