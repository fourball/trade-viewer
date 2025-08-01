import axios from 'axios';
import { DataProvider } from './base';
import { MarketData, MARKET_SYMBOLS } from '../../types/market';
import { logger } from '../../utils/logger';

interface AlphaVantageGlobalQuote {
  'Global Quote': {
    '01. symbol': string;
    '05. price': string;
    '08. previous close': string;
    '03. high': string;
    '04. low': string;
    '06. volume': string;
  };
}

export class AlphaVantageProvider extends DataProvider {
  name = 'Alpha Vantage';
  supportedSymbols = ['GOLD'];

  private apiKey = process.env.ALPHA_VANTAGE_API_KEY || '';
  private baseUrl = 'https://www.alphavantage.co/query';

  private symbolMappings: Record<string, string> = {
    GOLD: 'GLD', // Gold ETF as proxy for gold prices
  };

  async fetchData(symbol: string): Promise<MarketData | null> {
    if (!this.apiKey) {
      logger.error('Alpha Vantage API key not configured');
      return null;
    }

    try {
      const alphaSymbol = this.symbolMappings[symbol];
      if (!alphaSymbol) {
        logger.error(`No Alpha Vantage mapping for symbol: ${symbol}`);
        return null;
      }

      const response = await axios.get<AlphaVantageGlobalQuote>(this.baseUrl, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: alphaSymbol,
          apikey: this.apiKey,
        },
        timeout: 5000,
      });

      const quote = response.data['Global Quote'];
      if (!quote || Object.keys(quote).length === 0) {
        logger.error('No quote data in Alpha Vantage response');
        return null;
      }

      return this.createMarketData({
        symbol,
        name: MARKET_SYMBOLS[symbol as keyof typeof MARKET_SYMBOLS],
        price: parseFloat(quote['05. price']),
        previousClose: parseFloat(quote['08. previous close']),
        high: parseFloat(quote['03. high']),
        low: parseFloat(quote['04. low']),
        volume: parseInt(quote['06. volume']),
        currency: 'USD',
      });
    } catch (error) {
      logger.error(`Alpha Vantage fetch error for ${symbol}:`, error);
      return null;
    }
  }
}