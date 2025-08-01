import { FastifyInstance } from 'fastify';
import { MarketData, MARKET_SYMBOLS } from '../types/market';
import { createDataProviders, DataProvider } from './dataProviders';
import { CacheService } from './cache';
import { logger } from '../utils/logger';

export class MarketDataService {
  private providers: DataProvider[];
  private cache: CacheService;

  constructor(fastify: FastifyInstance) {
    this.providers = createDataProviders();
    this.cache = new CacheService(fastify);
  }

  async fetchMarketData(symbol: string): Promise<MarketData | null> {
    // Try cache first
    const cached = await this.cache.getMarketData(symbol);
    if (cached) {
      logger.debug(`Cache hit for ${symbol}`);
      return cached;
    }

    // Find suitable provider
    for (const provider of this.providers) {
      if (provider.canHandle(symbol)) {
        logger.debug(`Using ${provider.name} for ${symbol}`);
        
        try {
          const data = await provider.fetchData(symbol);
          if (data) {
            await this.cache.setMarketData(symbol, data);
            return data;
          }
        } catch (error) {
          logger.error(`Provider ${provider.name} failed for ${symbol}:`, error);
        }
      }
    }

    logger.error(`No provider could fetch data for ${symbol}`);
    return null;
  }

  async fetchAllMarketData(): Promise<MarketData[]> {
    // Try cache first
    const cached = await this.cache.getAllMarketData();
    if (cached.length > 0) {
      logger.debug('Cache hit for all market data');
      return cached;
    }

    const results: MarketData[] = [];
    const symbols = Object.keys(MARKET_SYMBOLS);

    // Fetch all symbols in parallel
    const promises = symbols.map(symbol => this.fetchMarketData(symbol));
    const dataResults = await Promise.allSettled(promises);

    for (let i = 0; i < dataResults.length; i++) {
      const result = dataResults[i];
      if (result.status === 'fulfilled' && result.value) {
        results.push(result.value);
      } else {
        logger.error(`Failed to fetch data for ${symbols[i]}`);
      }
    }

    if (results.length > 0) {
      await this.cache.setAllMarketData(results);
      await this.cache.setLastUpdate();
    }

    return results;
  }

  async getLastUpdate(): Promise<string | null> {
    return this.cache.getLastUpdate();
  }

  async clearCache(): Promise<void> {
    await this.cache.clearCache();
  }
}