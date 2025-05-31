import { Catch, ExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { CustomGrpcException } from '../exceptions/custom-grpc.exception';
import { LoggerService } from 'logger';
import { GrpcErrorResponse } from '../interfaces/error.interface';
import { RpcException } from '@nestjs/microservices';

@Catch() 
export class GlobalGrpcExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch(exception: any): Observable<GrpcErrorResponse> {
    let statusCode: number;
    let errorMessage: string;
    let context: string;

    if (exception instanceof CustomGrpcException) {
      statusCode = exception.grpcStatusCode || 13;
      errorMessage = exception.message;
      context =
        typeof exception.context === 'string'
          ? exception.context
          : exception.context
          ? JSON.stringify(exception.context)
          : 'Unknown context';
    }
   
    else if (exception instanceof RpcException) {
      statusCode = 13;
      errorMessage = exception.message;
      context = 'RpcException';
    }
   
    else {
      statusCode = 13;
      errorMessage = 'Internal Server Error';
      context = exception?.message || 'Unhandled exception';
    }

   
    this.logger.error(
      `[gRPC Error] ${statusCode}`,
      exception.stack,
      JSON.stringify({
        message: errorMessage,
        context,
      })
    );

   
    return throwError(() => ({
      code: statusCode,
      message: 'gRPC Error',
      details: JSON.stringify({
        message: errorMessage,
        context,
        timestamp: new Date().toISOString(),
      }),
    }));
  }
}
