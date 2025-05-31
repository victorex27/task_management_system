import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app/app.module';
import {
  AllExceptionsFilter,
  CustomError,
  HttpResponseInterceptor,
} from 'error';
import { loggerConfigSettings, LoggerService } from 'logger';
import { apiGatewayConnectionSchema, baseSchema } from 'config';

const { error } = baseSchema
  .concat(apiGatewayConnectionSchema)
  .validate(process.env, { allowUnknown: true });

if (error) {
  throw new CustomError(
    'CONFIGURATION_ERROR',
    HttpStatus.INTERNAL_SERVER_ERROR,
    { message: error.message }
  );
}

async function bootstrap() {
  const logger = new LoggerService(loggerConfigSettings);

  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('Aggregates gRPC services')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer' }, 'JWT-auth')
    .build();

  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.use(helmet());
  app.enableCors({
    allowedHeaders: ['Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTO instances
      forbidNonWhitelisted: true, // Reject unexpected fields
    })
  );

  app.useGlobalInterceptors(new HttpResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
