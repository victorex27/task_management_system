import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from 'logger';
import { CustomHttpException } from '../exceptions/custom-http.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode = 'INTERNAL_ERROR';

    if (exception instanceof CustomHttpException) {
      this.logger.error(message, JSON.stringify({
        errorCode,
        context: (exception as CustomHttpException).context,
        stack: (exception as Error).stack,
      }));
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      errorCode = this.getErrorCode(exception);
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(exception.message, exception.stack || '');
    }

    this.logger.error(
      message,
      JSON.stringify({
        path: request.url,
        method: request.method,
        status,
        errorCode,
      })
    );

    response.status(status).json({
      statusCode: status,
      message,
      errorCode,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private getErrorCode(exception: HttpException): string {
    const response = exception.getResponse();
    return typeof response === 'object'
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (response as any).errorCode || 'HTTP_ERROR'
      : 'HTTP_ERROR';
  }
}
