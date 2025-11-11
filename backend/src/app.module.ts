import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ContentModule } from './content/content.module';
import { RolesModule } from './roles/roles.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [ContentModule, RolesModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
