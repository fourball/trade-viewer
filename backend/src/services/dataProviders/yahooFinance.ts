import axios from 'axios';
import { DataProvider } from './base';
import { MarketData, MARKET_SYMBOLS } from '../../types/market';
import { logger } from '../../utils/logger';

// interface YahooFinanceQuote {
//   regularMarketPrice: number;
//   regularMarketPreviousClose: number;
//   regularMarketDayHigh: number;
//   regularMarketDayLow: number;
//   regularMarketVolume?: number;
//   currency: string;
// }

export class YahooFinanceProvider extends DataProvider {
  name = 'Yahoo Finance';
  supportedSymbols = ['NKY', 'NDX', 'DJI', 'HSI', 'NQ', 'YM', 'USDJPY'];

  private symbolMappings: Record<string, string> = {
    NKY: '^N225',
    NDX: '^IXIC',
    DJI: '^DJI',
    HSI: '^HSI',
    NQ: 'NQ=F',
    YM: 'YM=F',
    USDJPY: 'JPY=X',
  };

  async fetchData(symbol: string): Promise<MarketData | null> {
    try {
      const yahooSymbol = this.symbolMappings[symbol];
      if (!yahooSymbol) {
        logger.error(`No Yahoo Finance mapping for symbol: ${symbol}`);
        return null;
      }

      // Note: This is a simplified example. In production, you'd need to use
      // a proper Yahoo Finance API or library like yfinance
      const response = await axios.get(
        `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0',
          },
          timeout: 5000,
        }
      );

      interface YahooMeta {
        regularMarketPrice: number;
        previousClose: number;
        regularMarketDayHigh: number;
        regularMarketDayLow: number;
        regularMarketVolume?: number;
        currency?: string;
      }
      
      const data = response.data as { chart: { result: Array<{ meta: YahooMeta }> } };
      const result = data.chart.result[0];
      const quote = result.meta;

      return this.createMarketData({
        symbol,
        name: MARKET_SYMBOLS[symbol as keyof typeof MARKET_SYMBOLS],
        price: quote.regularMarketPrice,
        previousClose: quote.previousClose,
        high: quote.regularMarketDayHigh,
        low: quote.regularMarketDayLow,
        volume: quote.regularMarketVolume,
        currency: quote.currency || 'USD',
      });
    } catch (error) {
      logger.error(`Yahoo Finance fetch error for ${symbol}:`, error);
      return null;
    }
  }
}