import { Catch, ExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { CustomGrpcException } from '../exceptions/custom-grpc.exception';
import { LoggerService } from 'logger';
import { GrpcErrorResponse } from '../interfaces/error.interface';

@Catch(CustomGrpcException)
export class GrpcExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: CustomGrpcException): Observable<GrpcErrorResponse> {
    
    const errorInfo = {
      code: exception.grpcStatusCode,
      message: exception.message,
      context: exception.context,
    };

    this.logger.error('gRPC Exception', JSON.stringify(errorInfo));

    return throwError(() => ({
      code: exception.grpcStatusCode || 14,
      message: 'gRPC Error',
      details: JSON.stringify({
        message: exception.message,
        context: exception.context,
      }),
    }));
  }
}
