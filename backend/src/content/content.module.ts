import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { ContentRepository } from './content.repository';
import { PrismaService } from '../prisma/prisma.service';
import { SchemaService } from '../schema/schema.service';

@Module({
  imports: [],
  controllers: [ContentController],
  providers: [ContentService, ContentRepository, PrismaService, SchemaService],
})
export class ContentModule {}
