import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';

@Injectable()
export class WebhookRawBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Only apply raw body parsing for webhook routes
    if (req.originalUrl.startsWith('/webhooks/')) {
      bodyParser.raw({ type: 'application/json', limit: '10mb' })(
        req,
        res,
        next,
      );
    } else {
      // For other routes, continue to the next middleware
      next();
    }
  }
}
