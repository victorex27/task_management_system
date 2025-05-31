import { NestFactory } from '@nestjs/core';
import { TASK_PROTO_FILE_PATH, TaskProto } from 'protos';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { baseSchema, databaseSchema, redisSchema } from 'config';
import {
  ResponseInterceptor,
  CustomError,
  CustomGrpcException,
  GlobalGrpcExceptionsFilter,
} from 'error';

import { loggerConfigSettings, LoggerService } from 'logger';
import { TaskModule } from './task/task.module';

const { error } = baseSchema
  .concat(databaseSchema)
  .concat(redisSchema)
  .validate(process.env, { allowUnknown: true });

if (error) {
  throw new CustomError('CONFIGURATION_ERROR', status.INTERNAL, {
    message: error.message,
  });
}

async function bootstrap() {
  const logger = new LoggerService(loggerConfigSettings);

  const port = process.env.PORT || 3002;
  const host = process.env.HOST || '0.0.0.0';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TaskModule,
    {
      transport: Transport.GRPC,
      options: {
        package: TaskProto.TASK_PACKAGE_NAME,
        protoPath: TASK_PROTO_FILE_PATH,
        url: `${host}:${port}`,
      },
    }
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true, // Automatically transform payloads to DTO instances
      forbidNonWhitelisted: true, // Reject unexpected fields
      exceptionFactory: (errors) => {
       

        if (!errors || !Array.isArray(errors)) {
          return new CustomGrpcException('Validation failed');
        }


        const result = errors.map((error) => ({
          property: error.property,
          message: error.constraints
            ? Object.values(error.constraints)[0]
            : 'Invalid value',
        }));

        return new CustomGrpcException(result[0].message, { errors: result} , status.INVALID_ARGUMENT);
      },
    })
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalGrpcExceptionsFilter(logger));

  await app.listen();

  logger.log(`Task application is running on: ${host}:${port}`);
}

bootstrap();
