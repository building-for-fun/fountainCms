import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
