import { MarketData } from '../../types/market';

export abstract class DataProvider {
  abstract name: string;
  abstract supportedSymbols: string[];

  abstract fetchData(symbol: string): Promise<MarketData | null>;
  
  canHandle(symbol: string): boolean {
    return this.supportedSymbols.includes(symbol);
  }

  protected createMarketData(params: {
    symbol: string;
    name: string;
    price: number;
    previousClose: number;
    high?: number;
    low?: number;
    volume?: number;
    currency: string;
  }): MarketData {
    const { symbol, name, price, previousClose, high, low, volume, currency } = params;
    const change = price - previousClose;
    const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;

    return {
      symbol,
      name,
      price,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      previousClose,
      high: high || price,
      low: low || price,
      volume,
      timestamp: new Date().toISOString(),
      currency,
    };
  }
}