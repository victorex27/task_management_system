import { Module } from '@nestjs/common';
import { CacheModule } from 'cache';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule, loggerConfigSettings } from 'logger';
import path from 'path';
import { Task } from './task.entity';

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRoot(loggerConfigSettings),
    TypeOrmModule.forFeature([Task]),
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
  controllers: [TaskController],
  providers: [TaskService, TaskRepository],
})
export class TaskModule {}
