import cron from 'node-cron';
import { FastifyInstance } from 'fastify';
import { MarketDataService } from '../services/marketData';
import { logger } from '../utils/logger';

let cronJob: cron.ScheduledTask | null = null;

export async function startCronJobs(fastify: FastifyInstance): Promise<void> {
  const marketDataService = new MarketDataService(fastify);
  
  // Fetch data immediately on startup
  logger.info('Fetching initial market data...');
  await fetchAndBroadcastData(fastify, marketDataService);

  // Schedule to run every minute
  cronJob = cron.schedule('* * * * *', () => {
    logger.info('Running scheduled market data fetch...');
    void fetchAndBroadcastData(fastify, marketDataService);
  });

  logger.info('Cron jobs started - fetching market data every minute');
}

async function fetchAndBroadcastData(
  fastify: FastifyInstance,
  marketDataService: MarketDataService
): Promise<void> {
  try {
    const startTime = Date.now();
    const data = await marketDataService.fetchAllMarketData();
    const fetchTime = Date.now() - startTime;

    logger.info(`Fetched ${data.length} market data items in ${fetchTime}ms`);

    // Broadcast updates via WebSocket if manager is available
    if (fastify.wsManager) {
      fastify.wsManager.broadcastAll(data);
      logger.info(`Broadcast updates to ${fastify.wsManager.getClientCount()} clients`);
    }
  } catch (error) {
    logger.error('Error in market data fetch job:', error);
  }
}

export function stopCronJobs(): void {
  if (cronJob) {
    cronJob.stop();
    logger.info('Cron jobs stopped');
  }
}