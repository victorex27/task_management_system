import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserProto, USER_PROTO_FILE_PATH, AUTH_PROTO_FILE_PATH, AuthProto } from 'protos';
import { UserService } from './user.service';
import { UserController } from './user.controller';

import { loggerConfigSettings, LoggerModule } from 'logger';
import { AuthGrpcMiddleware } from '../middleware/validate-token';


@Module({
  imports: [
    LoggerModule.forRoot(loggerConfigSettings),
    ClientsModule.register([
          {
            name: AuthProto.AUTH_SERVICE_NAME,
            transport: Transport.GRPC,
            options: {
              package: AuthProto.AUTH_PACKAGE_NAME,
              protoPath: AUTH_PROTO_FILE_PATH,
    
              url: process.env.AUTH_SERVICE_URL,
            },
          },
        ]),
    ClientsModule.register([
      {
        name: UserProto.USER_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          package: UserProto.USER_PACKAGE_NAME,
          protoPath: USER_PROTO_FILE_PATH,

           url: process.env.USER_SERVICE_URL,
          
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})

export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthGrpcMiddleware).forRoutes(
      {
        path: '/user',
        method: RequestMethod.ALL,
      },
      {
        path: '/user/**',
        method: RequestMethod.ALL,
      }
    );
  }
}
