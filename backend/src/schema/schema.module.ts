import { Module } from '@nestjs/common';
import { SchemaController } from './schema.controller';
import { SchemaService } from './schema.service';
import { SchemaPermissionGuard } from './guards/schema-permission.guard';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SchemaController],
  providers: [SchemaService, SchemaPermissionGuard],
  exports: [SchemaService],
})
export class SchemaModule {}
