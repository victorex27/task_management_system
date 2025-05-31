import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomHttpException extends HttpException {
  constructor(
    message: string,
    public readonly errorCode: string,
    public readonly context?: Record<string, unknown>,
    status: HttpStatus = HttpStatus.BAD_REQUEST
    
  ) {
    super({ message, errorCode }, status);
  }
}