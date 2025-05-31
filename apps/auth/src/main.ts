import { NestFactory } from '@nestjs/core';
import { AuthProto, AUTH_PROTO_FILE_PATH } from 'protos';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import {
  baseSchema,
  databaseSchema,
  jwtSchema,
  redisSchema
} from 'config';
import {
  ResponseInterceptor,
  CustomError,
  CustomGrpcException,
  GlobalGrpcExceptionsFilter,
} from 'error';
import { AuthModule } from './auth/auth.module';
import { loggerConfigSettings, LoggerService } from 'logger';

const { error } = baseSchema
  .concat(databaseSchema)
  .concat(jwtSchema)
  .concat(redisSchema)
  .validate(process.env, { allowUnknown: true });

if (error) {
  throw new CustomError('CONFIGURATION_ERROR', status.INTERNAL, {
    message: error.message,
  });
}

async function bootstrap() {
 const logger = new LoggerService(loggerConfigSettings);

  const port = process.env.PORT || 3001;
  const host = process.env.HOST || '0.0.0.0';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.GRPC,
      options: {
        package: AuthProto.AUTH_PACKAGE_NAME,
        protoPath: AUTH_PROTO_FILE_PATH,
        url: `${host}:${port}`,
      },
    }
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTO instances
      forbidNonWhitelisted: true, // Reject unexpected fields
      exceptionFactory: (errors) => {
        // Convert validation errors into gRPC-friendly format
        const messages = errors
          .map((error) => Object.values(error.constraints).join(', '))
          .join('; ');
        return new CustomGrpcException(
          messages,
          { errors },
          status.INVALID_ARGUMENT
        );
      },
    })
  );

  

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalGrpcExceptionsFilter(logger));

  await app.listen();
  
  logger.log(`Auth application is running on: ${host}:${port}`);
}

bootstrap();
