import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';

@Module({
  imports: [],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}
