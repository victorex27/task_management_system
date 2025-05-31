import { Global, Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { cacheConfig } from './cache.config';

import * as dotenv from 'dotenv';

dotenv.config();

@Global()
@Module({
  imports: [NestCacheModule.register({ useFactory: () => cacheConfig })],
  exports: [NestCacheModule],
})
export class CacheModule  {
  
}
