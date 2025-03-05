import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // Enable rawBody for webhook verification
  });

  // Set global prefix for all API routes
  app.setGlobalPrefix('api');

  // Enable CORS for the frontend
  app.enableCors({
    origin: ['http://localhost:5173'], // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Use raw JSON body parser for webhooks route first
  app.use(
    '/api/webhooks',
    json({
      limit: '5mb',
      verify: (req: any, res, buf) => {
        // Store the raw body buffer directly on the request object
        req.rawBody = buf;
        return true;
      },
    }),
  );

  // Regular JSON parser for other routes
  app.use(json({ limit: '10mb' }));

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that are not in the DTO
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Transform payloads to be objects typed according to their DTO classes
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
