import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

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
  private readonly logger = new Logger(GlobalExceptionFilter.name);

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
      this.logger.error(
        `Error occurred while processing request [${request.method}] ${request.url}`,
      );

      this.logger.debug(
        `\n` +
          `Method: ${request.method}\n` +
          `Url: ${request.url}\n` +
          `Status: ${status}\n` +
          `Name: ${exception.name}\n` +
          `Message: ${exception.message}\n` +
          `Stack:\n${exception.stack}\n`,
      );

      this.logger.error(exception);
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
    });
  }
}
