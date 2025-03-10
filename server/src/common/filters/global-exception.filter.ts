import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../../../../shared/types/api.types';
/**
 * GlobalExceptionFilter
 *
 * Catches all exceptions and formats them according to our standard API response format:
 * - Sets success to false
 * - Includes appropriate status code
 * - Provides error details in the data field
 * - Includes API version and timestamp
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extract error message and details
    let message = 'Internal server error';
    let errors = null;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const exceptionResponseObj = exceptionResponse as any;
        message = exceptionResponseObj.message || message;
        errors = exceptionResponseObj.errors || null;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Log the error (but not in production for security reasons)
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[${request.method}] ${request.url}`, exception);
    }

    // Return standardized error response
    response.status(status).json({
      success: false,
      status,
      data: null,
      message,
      errors,
      version: process.env.API_VERSION || 'v1',
      timestamp: new Date().toISOString(),
    } as ApiResponse<null>);
  }
}
