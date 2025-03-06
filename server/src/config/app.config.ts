import { INestApplication, ValidationPipe } from '@nestjs/common';

/**
 * Configure global pipes and other application settings
 */
export function setupAppConfig(app: INestApplication): void {
  // Set global prefix for all API routes
  app.setGlobalPrefix('api');

  // Enable CORS for the frontend
  app.enableCors({
    origin: ['http://localhost:5173'], // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that are not in the DTO
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Transform payloads to be objects typed according to their DTO classes
    }),
  );
}
