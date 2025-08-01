import { FastifyInstance } from 'fastify';
import { MarketData } from '../types/market';
import { logger } from '../utils/logger';

const CACHE_TTL = 300; // 5 minutes
const CACHE_PREFIX = 'market:';

export class CacheService {
  constructor(private fastify: FastifyInstance) {}

  async getMarketData(symbol: string): Promise<MarketData | null> {
    try {
      const key = `${CACHE_PREFIX}${symbol}`;
      const data = await this.fastify.redis.get(key);
      
      if (!data) {
        return null;
      }

      return JSON.parse(data) as MarketData;
    } catch (error) {
      logger.error('Error getting market data from cache:', error);
      return null;
    }
  }

  async getAllMarketData(): Promise<MarketData[]> {
    try {
      const key = `${CACHE_PREFIX}all`;
      const data = await this.fastify.redis.get(key);
      
      if (!data) {
        return [];
      }

      return JSON.parse(data) as MarketData[];
    } catch (error) {
      logger.error('Error getting all market data from cache:', error);
      return [];
    }
  }

  async setMarketData(symbol: string, data: MarketData): Promise<void> {
    try {
      const key = `${CACHE_PREFIX}${symbol}`;
      await this.fastify.redis.setEx(key, CACHE_TTL, JSON.stringify(data));
    } catch (error) {
      logger.error('Error setting market data in cache:', error);
    }
  }

  async setAllMarketData(data: MarketData[]): Promise<void> {
    try {
      const key = `${CACHE_PREFIX}all`;
      await this.fastify.redis.setEx(key, CACHE_TTL, JSON.stringify(data));
      
      // Also cache individual items
      for (const item of data) {
        await this.setMarketData(item.symbol, item);
      }
    } catch (error) {
      logger.error('Error setting all market data in cache:', error);
    }
  }

  async getLastUpdate(): Promise<string | null> {
    try {
      const key = `${CACHE_PREFIX}updated`;
      return await this.fastify.redis.get(key);
    } catch (error) {
      logger.error('Error getting last update from cache:', error);
      return null;
    }
  }

  async setLastUpdate(): Promise<void> {
    try {
      const key = `${CACHE_PREFIX}updated`;
      await this.fastify.redis.setEx(
        key,
        CACHE_TTL,
        new Date().toISOString()
      );
    } catch (error) {
      logger.error('Error setting last update in cache:', error);
    }
  }

  async clearCache(): Promise<void> {
    try {
      const keys = await this.fastify.redis.keys(`${CACHE_PREFIX}*`);
      if (keys.length > 0) {
        await this.fastify.redis.del(keys);
      }
    } catch (error) {
      logger.error('Error clearing cache:', error);
    }
  }
}