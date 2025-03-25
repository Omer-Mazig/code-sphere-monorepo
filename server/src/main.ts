// Register module aliases
import 'module-alias/register';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { setupMiddleware } from './config/middleware.config';
import { setupAppConfig } from './config/app.config';
import { setupSwagger } from './config/swagger.config';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { setupNgrokTunnel } from './config/ngrok.config';

/**
 * Main application bootstrap function
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // Enable rawBody for webhook verification
  });

  setupAppConfig(app);
  setupMiddleware(app);

  // Only setup Swagger in development environment
  const configService = app.get(ConfigService);
  const isDevelopment = configService.get('NODE_ENV') !== 'production';
  if (isDevelopment) {
    setupSwagger(app);
  }

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());
  const port = configService.get<number>('PORT', 3000);

  console.log(`Attempting to start server on port: ${port}`);
  await app.listen(port, '0.0.0.0'); // explicitly bind to all network interfaces
  console.log(`Application is running on port: ${port}`);

  if (isDevelopment) {
    console.log(
      `Swagger documentation available at: http://localhost:${port}/api/docs`,
    );

    // Setup ngrok tunnel for development
    await setupNgrokTunnel(port);
  }
}

bootstrap();
