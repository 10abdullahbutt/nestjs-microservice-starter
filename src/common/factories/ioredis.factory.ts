import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

export const getIORedisFactory = () => {
  const configService = new ConfigService();
  return {
    config: {
      url: configService.get<string>('REDIS_HOST'),
      onClientCreated(client: Redis) {
        client.on('connect', () => {
          console.log('Redis connected');
        });
        client.on('reconnecting', () => {
          console.log('Redis reconnected');
        });
        client.on('close', () => {
          console.log('Redis disconnected');
        });
        client.on('error', (error) => {
          console.log('Redis connection failed! ', error);
        });
      },
    },
  };
};
