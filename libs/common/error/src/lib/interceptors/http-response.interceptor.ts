import { 
  CallHandler, 
  ExecutionContext, 
  Injectable, 
  NestInterceptor 
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => ({
        status: getStatusCode(context),
        message: 'Operation was successful',
        success: true,
        data,
        timestamp: new Date().toISOString()
      }))
    );
  }
}


const getStatusCode = ( context: ExecutionContext) =>{
  const response = context.switchToHttp().getResponse();

  return response.statusCode;
}
