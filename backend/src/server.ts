import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import { logger } from './utils/logger';
import { redisPlugin } from './plugins/redis';
import { marketRoutes } from './routes/market';
import { healthRoutes } from './routes/health';
import { websocketRoutes } from './routes/websocket';
import { startCronJobs } from './workers/marketDataFetcher';
import { cloudfrontAuth } from './middleware/cloudfront-auth';

export async function buildServer(): Promise<FastifyInstance> {
  const server = Fastify({
    logger: logger as unknown as FastifyInstance['log'],
  });

  // Register plugins
  await server.register(cors, {
    origin: process.env.CORS_ORIGIN || true,
  });

  await server.register(websocket, {
    options: {
      maxPayload: 1048576, // 1MB
      verifyClient: function (_info, next) {
        next(true); // Accept all connections
      }
    }
  });
  await server.register(redisPlugin);

  // Add CloudFront authentication middleware
  server.addHook('onRequest', cloudfrontAuth);

  // Register routes
  await server.register(marketRoutes, { prefix: '/api/v1' });
  await server.register(healthRoutes, { prefix: '/api' });
  await server.register(websocketRoutes);

  // Start cron jobs
  server.addHook('onReady', async () => {
    await startCronJobs(server);
  });

  // Graceful shutdown
  const gracefulShutdown = async () => {
    logger.info('Gracefully shutting down...');
    await server.close();
    process.exit(0);
  };

  process.on('SIGINT', () => void gracefulShutdown());
  process.on('SIGTERM', () => void gracefulShutdown());

  return server;
}