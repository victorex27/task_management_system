import { Module } from '@nestjs/common';
import { CacheModule } from 'cache';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule, loggerConfigSettings } from 'logger';
import path from 'path';
import { User } from './user.entity';

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRoot(loggerConfigSettings),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: +config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [path.join(__dirname, '/*.entity.js')],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    CacheModule
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
