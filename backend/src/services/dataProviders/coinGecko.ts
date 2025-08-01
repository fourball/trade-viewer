import axios from 'axios';
import { DataProvider } from './base';
import { MarketData, MARKET_SYMBOLS } from '../../types/market';
import { logger } from '../../utils/logger';

interface CoinGeckoResponse {
  bitcoin?: {
    usd: number;
    usd_24h_change: number;
    last_updated_at?: number;
  };
}

export class CoinGeckoProvider extends DataProvider {
  name = 'CoinGecko';
  supportedSymbols = ['BTCUSDT'];

  private baseUrl = 'https://api.coingecko.com/api/v3';

  async fetchData(symbol: string): Promise<MarketData | null> {
    if (symbol !== 'BTCUSDT') {
      return null;
    }

    try {
      const response = await axios.get<CoinGeckoResponse>(
        `${this.baseUrl}/simple/price`,
        {
          params: {
            ids: 'bitcoin',
            vs_currencies: 'usd',
            include_24hr_change: true,
            include_last_updated_at: true,
          },
          timeout: 5000,
        }
      );

      const bitcoinData = response.data.bitcoin;
      if (!bitcoinData) {
        logger.error('No bitcoin data in CoinGecko response');
        return null;
      }

      const price = bitcoinData.usd;
      const changePercent = bitcoinData.usd_24h_change;
      const previousClose = price / (1 + changePercent / 100);

      // last_updated_atがあればそれを使用、なければ現在時刻
      const timestamp = bitcoinData.last_updated_at 
        ? new Date(bitcoinData.last_updated_at * 1000).toISOString()
        : new Date().toISOString();

      return this.createMarketData({
        symbol: 'BTCUSDT',
        name: MARKET_SYMBOLS.BTCUSDT,
        price,
        previousClose,
        currency: 'USD',
        timestamp,
      });
    } catch (error) {
      logger.error('CoinGecko fetch error:', error);
      return null;
    }
  }
}