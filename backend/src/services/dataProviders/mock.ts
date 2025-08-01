import { DataProvider } from './base';
import { MarketData, MARKET_SYMBOLS } from '../../types/market';
import { logger } from '../../utils/logger';

// Mock provider for development and testing
export class MockProvider extends DataProvider {
  name = 'Mock Provider';
  supportedSymbols = Object.keys(MARKET_SYMBOLS);

  private mockData: Record<string, { base: number; volatility: number; currency: string }> = {
    NKY: { base: 41000, volatility: 500, currency: 'JPY' },
    NDX: { base: 18000, volatility: 200, currency: 'USD' },
    DJI: { base: 39000, volatility: 300, currency: 'USD' },
    BTCUSDT: { base: 115000, volatility: 3000, currency: 'USD' },
    GOLD: { base: 2050, volatility: 20, currency: 'USD' },
    USDJPY: { base: 150.5, volatility: 0.5, currency: 'JPY' },
    HSI: { base: 16500, volatility: 200, currency: 'HKD' },
    NQ: { base: 18100, volatility: 200, currency: 'USD' },
    YM: { base: 39100, volatility: 300, currency: 'USD' },
  };

  fetchData(symbol: string): Promise<MarketData | null> {
    const mockConfig = this.mockData[symbol];
    if (!mockConfig) {
      logger.error(`No mock data for symbol: ${symbol}`);
      return Promise.resolve(null);
    }

    // Generate realistic-looking random data
    const { base, volatility, currency } = mockConfig;
    const changePercent = (Math.random() - 0.5) * 4; // -2% to +2%
    const previousClose = base + (Math.random() - 0.5) * volatility;
    const price = previousClose * (1 + changePercent / 100);
    
    const dayRange = volatility * 0.5;
    const high = price + Math.random() * dayRange;
    const low = price - Math.random() * dayRange;

    return Promise.resolve(this.createMarketData({
      symbol,
      name: MARKET_SYMBOLS[symbol as keyof typeof MARKET_SYMBOLS],
      price: Math.round(price * 100) / 100,
      previousClose: Math.round(previousClose * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      volume: Math.floor(Math.random() * 1000000),
      currency,
    }));
  }
}