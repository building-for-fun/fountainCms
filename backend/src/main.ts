import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './utils/winston.config';

async function bootstrap() {
  const logger = WinstonModule.createLogger(winstonConfig);
  const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || '';
  const allowedOrigins = allowedOriginsEnv
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  logger.log(`🧩 Allowed Origins: ${allowedOrigins}`);

  const app = await NestFactory.create(AppModule, {
    logger,
  });
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  const config = new DocumentBuilder()
    .setTitle('Fountain CMS API')
    .setDescription('Backend API documentation for Fountain CMS')
    .setVersion('1.0')
    .addBearerAuth() // Add if you use JWT authentication
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 4000);
}

bootstrap();
