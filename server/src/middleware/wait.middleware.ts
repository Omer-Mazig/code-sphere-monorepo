import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class WaitMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Simulate network latency with a 2-second delay
    setTimeout(() => {
      next();
    }, 0);
  }
}
