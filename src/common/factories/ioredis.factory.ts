import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

export const getIORedisFactory = () => {
  const configService = new ConfigService();
  const isTestEnvironment = process.env.NODE_ENV === 'test';

  return {
    config: {
      url: configService.get<string>('REDIS_HOST'),
      lazyConnect: isTestEnvironment, // Don't connect immediately in tests
      retryDelayOnFailover: isTestEnvironment ? 0 : 100,
      maxRetriesPerRequest: isTestEnvironment ? 0 : 3,
      onClientCreated(client: Redis) {
        client.on('connect', () => {
          if (!isTestEnvironment) {
            console.log('Redis connected');
          }
        });
        client.on('reconnecting', () => {
          if (!isTestEnvironment) {
            console.log('Redis reconnected');
          }
        });
        client.on('close', () => {
          if (!isTestEnvironment) {
            console.log('Redis disconnected');
          }
        });
        client.on('error', (error) => {
          // Only log Redis errors in non-test environments
          if (!isTestEnvironment) {
            console.log('Redis connection failed! ', error);
          }
        });
      },
    },
  };
};
