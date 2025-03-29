import { INestApplication } from '@nestjs/common';
import { json } from 'express';
import { ClerkMiddleware } from '../auth/middleware/clerk.middleware';

/**
 * Configure middleware for the application
 */
export function setupMiddleware(app: INestApplication): void {
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

  // Apply Clerk middleware globally
  app.use(new ClerkMiddleware().use);
}
