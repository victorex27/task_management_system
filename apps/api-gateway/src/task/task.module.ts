import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  TaskProto,
  TASK_PROTO_FILE_PATH,
  AUTH_PROTO_FILE_PATH,
  AuthProto,
} from 'protos';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';

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
        name: TaskProto.TASK_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          package: TaskProto.TASK_PACKAGE_NAME,
          protoPath: TASK_PROTO_FILE_PATH,

          url: process.env.TASK_SERVICE_URL,
        },
      },
    ]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthGrpcMiddleware).forRoutes(
      {
        path: '/tasks/**',
        method: RequestMethod.ALL,
      },
      {
        path: '/tasks',
        method: RequestMethod.ALL,
      }
    );
  }
}
