import { Injectable, Inject, OnModuleInit, HttpStatus } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthProto, UserProto } from 'protos';
import { firstValueFrom } from 'rxjs';
import { CustomHttpException } from 'error';
import { LoggerService } from 'logger';

@Injectable()
export class UserService implements OnModuleInit {
  private userService: UserProto.UserServiceClient;

  constructor(
    @Inject(UserProto.USER_SERVICE_NAME) private userClient: ClientGrpc,
    private readonly logger: LoggerService
  ) {}

  onModuleInit() {
    this.userService = this.userClient.getService(UserProto.USER_SERVICE_NAME);
  }

  async createUser(payload: UserProto.User) {
    const user = await firstValueFrom(this.userService.createUser(payload));

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

  async getUser(id: string) {
    return await firstValueFrom(this.userService.getUser({ id }));
  }

  async getUsers() {
    return await firstValueFrom(this.userService.getUsers({}));
  }
}
