import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { ApiResponse } from 'shared/types/api.types';
/**
 * ResponseInterceptor
 *
 * Transforms all API responses into a standardized format with:
 * - success flag
 * - status code
 * - data payload
 * - API version
 * - timestamp
 * - optional message
 */
@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => {
        // Check if the controller explicitly set a success flag
        const hasExplicitSuccess =
          data && typeof data === 'object' && '_success' in data;

        // Determine success flag - use explicit if provided, otherwise use status code
        let success = statusCode >= 200 && statusCode < 300;
        if (hasExplicitSuccess) {
          success = Boolean(data._success);

          // Remove _success property from data before sending
          if (typeof data === 'object') {
            const { _success, ...restData } = data as any;
            data = restData as T;
          }
        }

        return {
          success,
          status: statusCode,
          data,
          version: process.env.API_VERSION || 'v1',
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
