import { FastifyPluginAsync } from 'fastify';

export const healthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/health', async (_request, reply) => {
    try {
      // Check Redis connection
      const redisPing = await fastify.redis.ping();
      const redisStatus = redisPing === 'PONG' ? 'connected' : 'disconnected';

      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: {
          redis: redisStatus,
          dataFetch: 'running',
        },
      };
    } catch (error) {
      fastify.log.error('Health check error:', error);
      return reply.code(503).send({
        status: 'error',
        timestamp: new Date().toISOString(),
        services: {
          redis: 'error',
          dataFetch: 'unknown',
        },
      });
    }
  });
};