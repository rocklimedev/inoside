import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import helmet from 'helmet';
import compression from 'compression';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // =================================================
  // TRUST PROXY (NGINX / CLOUDFLARE)
  // =================================================
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  // =================================================
  // SECURITY
  // =================================================
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );

  app.use(compression());

  // =================================================
  // COOKIE PARSER (CRITICAL for cookie handling)
  // =================================================
  app.use(cookieParser());

  // =================================================
  // API PREFIX
  // =================================================
  app.setGlobalPrefix('api');

  // =================================================
  // CORS (MUST include credentials: true)
  // =================================================
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://inoside.vercel.app',
      'https://buildcon.rippotaiarchitecture.com',
      'https://buildcon-api.rippotaiarchitecture.com',
      'https://media-buildcon.rippotaiarchitecture.com',
    ],

    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    allowedHeaders: ['Content-Type', 'Authorization', 'x-cdn-key'],

    // ✅ CRITICAL: Allow cookies to be sent/received
    credentials: true,

    // ✅ Allow Set-Cookie header
    exposedHeaders: ['Set-Cookie'],
  });

  // =================================================
  // VALIDATION
  // =================================================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // =================================================
  // SWAGGER
  // =================================================
  const config = new DocumentBuilder()
    .setTitle('Buildcon API')
    .setDescription('Construction Project Management API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // =================================================
  // START SERVER
  // =================================================
  const port = process.env.PORT || 5000;
  const env = process.env.NODE_ENV || 'development';

  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server running on port ${port}`);
  console.log(`📍 Environment: ${env}`);
  console.log(`📄 Swagger Docs: http://localhost:${port}/api-docs`);
  console.log(`🔒 CORS credentials: enabled`);
  console.log(`🍪 Cookie parser: enabled`);
}

bootstrap();
