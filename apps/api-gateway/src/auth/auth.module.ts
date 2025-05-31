import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthProto, AUTH_PROTO_FILE_PATH } from 'protos';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

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
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})

export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthGrpcMiddleware).forRoutes(
      {
        path: '/auth/logout',
        method: RequestMethod.POST,
      },
      {
        path: '/auth/register',
        method: RequestMethod.POST,
      }
    );
  }
}
