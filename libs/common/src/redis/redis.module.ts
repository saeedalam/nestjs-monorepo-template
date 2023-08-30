import { Module } from '@nestjs/common';
import * as RedisStore from 'cache-manager-ioredis';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: RedisStore,
      host: process.env.REDIS_URI,
      password: process.env.REDIS_PASSWORD,
      port: process.env.REDIS_PORT,
    }),
  ],
  providers: [],
  exports: [CacheModule],
})
export class RedisModule {}
