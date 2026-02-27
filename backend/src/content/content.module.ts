import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { ContentRepository } from './content.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { SchemaModule } from '../schema/schema.module';

@Module({
  imports: [PrismaModule, SchemaModule],
  controllers: [ContentController],
  providers: [ContentService, ContentRepository],
})
export class ContentModule {}
