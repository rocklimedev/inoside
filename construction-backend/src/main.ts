import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global API Prefix
  app.setGlobalPrefix('api');

  // CORS Configuration
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://inoside.onrender.com',
      'https://inoside.vercel.app',
      'https://buildcon.rippotaiarchitecture.com',
      'https://buildcon-api.rippotaiarchitecture.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  /** */
  /** */
  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Port
  const port = process.env.PORT || 5000;

  await app.listen(port);

  console.log(`🚀 Server running on port ${port}`);
  console.log(`📄 API Docs: http://localhost:${port}/api/docs`);
}

bootstrap();
