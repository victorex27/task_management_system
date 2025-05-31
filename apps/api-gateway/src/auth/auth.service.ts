import { Injectable, Inject, OnModuleInit, HttpStatus } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthProto } from 'protos';
import { firstValueFrom } from 'rxjs';
import { CustomHttpException } from 'error';
import { LoggerService } from 'logger';
import { generate } from 'generate-password';

@Injectable()
export class AuthService implements OnModuleInit {
  private authService: AuthProto.AuthServiceClient;

  constructor(
    @Inject(AuthProto.AUTH_SERVICE_NAME) private userClient: ClientGrpc,
    private readonly logger: LoggerService
  ) {}

  onModuleInit() {
    this.authService = this.userClient.getService(AuthProto.AUTH_SERVICE_NAME);
  }

  async registerAuth(
    payload: Omit<AuthProto.CreateAuthUserRequest, 'password'>
  ) {
    const password = generate({
      length: 16,
      numbers: true,
      symbols: true,
      uppercase: true,
      lowercase: true,
    });

    console.log({password})

    const user = await firstValueFrom(
      this.authService.createAuthUser({ ...payload, password })
    );

    if (!user) {
      throw new CustomHttpException(
        'Could not create user. Please try again later',
        '',
        { email: payload.email },
        HttpStatus.BAD_REQUEST
      );
    }

    return {
      userId: user.data.id,
    };
  }

  async login(payload: AuthProto.LoginRequest) {
    return await firstValueFrom(this.authService.login(payload));
  }

  async logout(payload: AuthProto.LogoutRequest) {
    return await firstValueFrom(this.authService.logout(payload));
  }
}
