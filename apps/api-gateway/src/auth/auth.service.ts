import { Injectable, Inject, OnModuleInit, HttpStatus } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthProto } from 'protos';
import { firstValueFrom } from 'rxjs';
import { CustomHttpException } from 'error';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LoggerService } from 'logger';
import { generate } from 'generate-password';
import { UserRegistrationRequestDto } from './dto/request/user-registration.request.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  private authService: AuthProto.AuthServiceClient;

  constructor(
    @Inject(AuthProto.AUTH_SERVICE_NAME) private userClient: ClientGrpc,
    private readonly logger: LoggerService,
    private eventEmitter: EventEmitter2
  ) {}

  onModuleInit() {
    this.authService = this.userClient.getService(AuthProto.AUTH_SERVICE_NAME);
  }

  async registerAuth(
    payload: UserRegistrationRequestDto
  ) {

    const { firstName, lastName, ...rest } = payload;
    const password = generate({
      length: 16,
      numbers: true,
      symbols: true,
      uppercase: true,
      lowercase: true,
    });


    const user = await firstValueFrom(
      this.authService.createAuthUser({ ...rest, password })
    );

    if (!user?.data?.id) {
      throw new CustomHttpException(
        'Could not create user. Please try again later',
        '',
        { email: payload.email },
        HttpStatus.BAD_REQUEST
      );
    }

    this.eventEmitter.emit('create.user', { 
      firstName,
      lastName,
      email: payload.email,
      id: user.data.id,
    });



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
