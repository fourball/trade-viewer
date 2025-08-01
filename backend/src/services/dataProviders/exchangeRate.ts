import axios from 'axios';
import { DataProvider } from './base';
import { MarketData, MARKET_SYMBOLS } from '../../types/market';
import { logger } from '../../utils/logger';

interface ExchangeRateResponse {
  rates: {
    JPY: number;
  };
  base: string;
  date: string;
}

export class ExchangeRateProvider extends DataProvider {
  name = 'Exchange Rate API';
  supportedSymbols = ['USDJPY'];

  private baseUrl = 'https://api.exchangerate-api.com/v4/latest';

  async fetchData(symbol: string): Promise<MarketData | null> {
    if (symbol !== 'USDJPY') {
      return null;
    }

    try {
      const response = await axios.get<ExchangeRateResponse>(
        `${this.baseUrl}/USD`,
        {
          timeout: 5000,
        }
      );

      const jpyRate = response.data.rates.JPY;
      if (!jpyRate) {
        logger.error('No JPY rate in exchange rate response');
        return null;
      }

      // For forex, we'll use a simple approximation for previous close
      // In production, you'd want to store historical data
      const previousClose = jpyRate * 0.999; // Assume 0.1% change

      return this.createMarketData({
        symbol: 'USDJPY',
        name: MARKET_SYMBOLS.USDJPY,
        price: jpyRate,
        previousClose,
        currency: 'JPY',
      });
    } catch (error) {
      logger.error('Exchange Rate API fetch error:', error);
      return null;
    }
  }
}