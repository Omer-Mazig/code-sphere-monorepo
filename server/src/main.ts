import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { json } from 'express';

// Add ngrok import at the top
import * as ngrok from 'ngrok';

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

  // Start ngrok in development mode
  if (process.env.NODE_ENV !== 'production') {
    try {
      // Get the authtoken from environment variable
      const authtoken =
        process.env.NGROK_AUTHTOKEN ||
        '2tuQ4QkUViiW00dIK4uVV94tnfV_3dmH9fusUnYdVk45NvxNS';

      // Start ngrok with your auth token
      const url = await ngrok.connect({
        addr: port,
        authtoken: authtoken,
        region: 'eu', // Set to your region (eu, us, au, ap, sa, jp, in)
      });

      console.log(`Ngrok tunnel is active: ${url}`);
      console.log(`Webhook URL: ${url}/api/webhooks`);

      // Log a reminder to update Clerk dashboard
      console.log(
        '\x1b[33m%s\x1b[0m',
        '⚠️  IMPORTANT: Update your webhook URL in Clerk Dashboard',
      );
    } catch (error) {
      console.error('Error starting ngrok:', error);
    }
  }
}
bootstrap();
