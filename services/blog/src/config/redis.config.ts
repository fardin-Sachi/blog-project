import { createClient } from 'redis';
import ENV from './env.config.js';

export const redisClient = createClient({
  url: ENV.REDIS_URL,
});

export const connectRedis = async () => {
  redisClient.connect();
}