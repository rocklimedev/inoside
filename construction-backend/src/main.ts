import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // SECURITY
  app.use(helmet());
  app.use(compression());

  // GLOBAL PREFIX
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://inoside.vercel.app',
      'https://buildcon.rippotaiarchitecture.com',
      'https://buildcon-api.rippotaiarchitecture.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // VALIDATION
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // SWAGGER
  const config = new DocumentBuilder()
    .setTitle('Construction API')
    .setDescription('Construction Project Management API Documentation')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 5000;

  await app.listen(port);

  console.log(`🚀 Server running on port ${port}`);
  console.log(`📄 API Docs: http://localhost:${port}/api/api-docs`);
}

bootstrap();
