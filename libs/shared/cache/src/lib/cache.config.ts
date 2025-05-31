import { CacheModuleOptions } from '@nestjs/cache-manager';
import { loggerConfigSettings, LoggerService } from 'logger';
import { redisStore } from 'cache-manager-redis-yet';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';

dotenv.config();

const logger = new LoggerService(loggerConfigSettings);


// export const cacheConfig: CacheModuleOptions = {
//   store: redisStore,
//   host: process.env['REDIS_HOST'] || 'localhost',
//   port: parseInt(process.env['REDIS_PORT'] || '6379', 10),
//   ttl: parseInt(process.env['REDIS_DEFAULT_TTL'] || '86400', 10), // 24 hours default TTL
//   logger,
//   redis: {
//     url: `redis://${process.env['REDIS_HOST'] || 'localhost'}:${process.env['REDIS_PORT'] || 6379}`,
//     db: parseInt(process.env['REDIS_DB'] || '0', 10),
//   },
// };

export const cacheConfig = async (configService: ConfigService) => ({
  store: () =>
    redisStore({
      socket: {
        host: configService.get<string>('REDIS_HOST', 'localhost'),
        port: configService.get<number>('REDIS_PORT', 6379),
      },
      ttl: configService.get<number>('REDIS_DEFAULT_TTL', 600), // TTL in seconds
    }),
});

