import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { setupMiddleware } from './config/middleware.config';
import { setupAppConfig } from './config/app.config';
import { setupNgrokTunnel } from './config/ngrok.config';
import { setupSwagger } from './config/swagger.config';

/**
 * Main application bootstrap function
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // Enable rawBody for webhook verification
  });

  // Setup application configuration
  setupAppConfig(app);

  // Setup middleware
  setupMiddleware(app);

  // Setup Swagger documentation
  setupSwagger(app);

  // Get configuration and start server
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(
    `Swagger documentation available at: http://localhost:${port}/api/docs`,
  );

  // Setup ngrok tunnel for development
  await setupNgrokTunnel(port);
}

bootstrap();
