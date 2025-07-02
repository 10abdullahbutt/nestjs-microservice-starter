/* eslint-disable */
import { ConfigService } from '@nestjs/config';

// Mock Redis client for testing
class MockRedis {
  private store: Map<string, any> = new Map();

  async get(key: string): Promise<string | null> {
    return this.store.get(key) || null;
  }

  async set(key: string, value: string, ttl?: number): Promise<'OK'> {
    this.store.set(key, value);
    if (ttl) {
      setTimeout(() => {
        this.store.delete(key);
      }, ttl * 1000);
    }
    return 'OK';
  }

  async del(key: string): Promise<number> {
    return this.store.delete(key) ? 1 : 0;
  }

  async exists(key: string): Promise<number> {
    return this.store.has(key) ? 1 : 0;
  }

  async expire(key: string, seconds: number): Promise<number> {
    if (this.store.has(key)) {
      setTimeout(() => {
        this.store.delete(key);
      }, seconds * 1000);
      return 1;
    }
    return 0;
  }

  async ttl(key: string): Promise<number> {
    return this.store.has(key) ? -1 : -2;
  }

  async flushall(): Promise<'OK'> {
    this.store.clear();
    return 'OK';
  }

  async disconnect(): Promise<void> {
    this.store.clear();
  }

  // Mock event handlers
  on(event: string, callback: Function): this {
    // Mock event handling
    return this;
  }

  off(event: string, callback: Function): this {
    // Mock event handling
    return this;
  }
}

export const getMockRedisFactory = () => {
  return {
    config: {
      url: 'redis://localhost:6379',
      lazyConnect: true,
      onClientCreated(client: MockRedis) {
        // Mock client setup - no actual connection needed
      },
    },
  };
};

// Factory function that returns either real Redis or mock based on environment
export const getRedisFactory = () => {
  const configService = new ConfigService();
  const isTestEnvironment = process.env.NODE_ENV === 'test';

  if (isTestEnvironment) {
    return getMockRedisFactory();
  }

  // Import the real Redis factory for non-test environments
  const { getIORedisFactory } = require('./ioredis.factory');
  return getIORedisFactory();
};
