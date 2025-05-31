import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class DatabaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        return throwError(() => ({
          code: 14,
          message: 'gRPC Error',
          details: JSON.stringify({
            errorCode: 14,
            message: error.message,
            context: error.context,
          }),
        }));
      })
    );
  }
}
