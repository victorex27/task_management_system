import { Injectable, NestMiddleware, Inject, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';
import { AuthProto } from 'protos';
import { CustomError, CustomHttpException } from 'error';

interface AuthClientService {
  validateAuthToken(data: {
    token: string;
  }): Observable<{ data: { id: string; email: string } }>;
}

@Injectable()
export class AuthGrpcMiddleware implements NestMiddleware {
  private authClientService: AuthClientService;

  constructor(
    @Inject(AuthProto.AUTH_SERVICE_NAME) private authClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.authClientService = this.authClient.getService<AuthClientService>(
      AuthProto.AUTH_SERVICE_NAME
    );
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CustomHttpException(
        'Missing or invalid Authorization header',
        'UNAUTHORIZED',
        {},
        HttpStatus.UNAUTHORIZED
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      const auth = await lastValueFrom(
        this.authClientService.validateAuthToken({ token })
      );

      if (!auth.data) {
        throw new CustomError('Invalid token', HttpStatus.UNAUTHORIZED);
      }

      req['auth'] = auth.data;
      next();
    } catch (err) {
      throw new CustomHttpException(
        'Invalid token',
        'UNAUTHORIZED',
        err,
        HttpStatus.UNAUTHORIZED
      );
    }
  }
}
