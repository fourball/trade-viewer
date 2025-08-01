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
  supportedSymbols = ['NKY', 'HSI', 'NK225', 'NDX', 'DJI', 'NQ', 'YM', 'USDJPY'];

  private symbolMappings: Record<string, string> = {
    NKY: '^N225',
    HSI: '^HSI',
    NK225: 'NIY=F',  // 日経225先物
    NDX: '^IXIC',
    DJI: '^DJI',
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
        regularMarketTime?: number; // Unix timestamp
        currency?: string;
      }
      
      const data = response.data as { chart: { result: Array<{ meta: YahooMeta }> } };
      const result = data.chart.result[0];
      const quote = result.meta;

      // regularMarketTimeがあればそれを使用、なければ現在時刻
      const timestamp = quote.regularMarketTime 
        ? new Date(quote.regularMarketTime * 1000).toISOString()
        : new Date().toISOString();

      return this.createMarketData({
        symbol,
        name: MARKET_SYMBOLS[symbol as keyof typeof MARKET_SYMBOLS],
        price: quote.regularMarketPrice,
        previousClose: quote.previousClose,
        high: quote.regularMarketDayHigh,
        low: quote.regularMarketDayLow,
        volume: quote.regularMarketVolume,
        currency: quote.currency || 'USD',
        timestamp,
      });
    } catch (error) {
      logger.error(`Yahoo Finance fetch error for ${symbol}:`, error);
      return null;
    }
  }
}