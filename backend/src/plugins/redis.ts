import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { createClient } from 'redis';
import { logger } from '../utils/logger';

type RedisClientType = ReturnType<typeof createClient>;

declare module 'fastify' {
  interface FastifyInstance {
    redis: RedisClientType;
  }
}

const redisPluginAsync: FastifyPluginAsync = async (fastify) => {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  
  const client = createClient({
    url: redisUrl,
  });

  client.on('error', (err) => {
    logger.error('Redis Client Error', err);
  });

  client.on('connect', () => {
    logger.info('Redis Client Connected');
  });

  client.on('ready', () => {
    logger.info('Redis Client Ready');
  });

  await client.connect();

  fastify.decorate('redis', client);

  fastify.addHook('onClose', async () => {
    await client.quit();
  });
};

export const redisPlugin = fp(redisPluginAsync, {
  name: 'redis',
});