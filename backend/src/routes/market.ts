import { FastifyPluginAsync } from 'fastify';
import { MarketDataService } from '../services/marketData';
import { MarketDataResponse } from '../types/market';

interface MarketParams {
  symbol: string;
}

export const marketRoutes: FastifyPluginAsync = async (fastify) => {
  const marketDataService = new MarketDataService(fastify);

  // Get all market data
  fastify.get<{ Reply: MarketDataResponse }>('/market/all', async (_request, reply) => {
    try {
      const data = await marketDataService.fetchAllMarketData();
      const lastUpdated = await marketDataService.getLastUpdate();

      return {
        success: true,
        data,
        lastUpdated: lastUpdated || new Date().toISOString(),
      };
    } catch (error) {
      fastify.log.error('Error fetching all market data:', error);
      return reply.code(500).send({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'サーバーエラーが発生しました',
        },
      });
    }
  });

  // Get specific symbol data
  fastify.get<{ Params: MarketParams; Reply: MarketDataResponse }>(
    '/market/:symbol',
    async (request, reply) => {
      const { symbol } = request.params;

      try {
        const data = await marketDataService.fetchMarketData(symbol);

        if (!data) {
          return reply.code(404).send({
            success: false,
            error: {
              code: 'NOT_FOUND',
              message: 'データが見つかりません',
            },
          });
        }

        return {
          success: true,
          data,
        };
      } catch (error) {
        fastify.log.error(`Error fetching market data for ${symbol}:`, error);
        return reply.code(500).send({
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: 'サーバーエラーが発生しました',
          },
        });
      }
    }
  );
};