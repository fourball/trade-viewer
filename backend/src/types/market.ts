export type MarketCategory = 'stock' | 'crypto' | 'commodity' | 'forex' | 'futures';

export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  high: number;
  low: number;
  volume?: number;
  timestamp: string;
  currency: string;
  category?: MarketCategory;
}

export interface MarketDataResponse {
  success: boolean;
  data?: MarketData | MarketData[];
  error?: {
    code: string;
    message: string;
  };
  lastUpdated?: string;
}

export interface WebSocketMessage {
  type: 'subscribe' | 'unsubscribe' | 'initial' | 'update' | 'error';
  symbols?: string[];
  data?: MarketData | MarketData[];
  message?: string;
}

export const MARKET_SYMBOLS = {
  NKY: '日経平均',
  HSI: '香港ハンセン',
  NK225: '日経平均先物',
  NDX: 'ナスダック',
  DJI: 'ダウ平均',
  BTCUSDT: 'ビットコイン',
  GOLD: 'ゴールド',
  USDJPY: 'ドル円',
  NQ: 'ナスダック先物',
  YM: 'ダウ先物',
} as const;

export type MarketSymbol = keyof typeof MARKET_SYMBOLS;

export const SYMBOL_CATEGORIES: Record<MarketSymbol, MarketCategory> = {
  NKY: 'stock',
  HSI: 'stock',
  NK225: 'futures',
  NDX: 'stock',
  DJI: 'stock',
  BTCUSDT: 'crypto',
  GOLD: 'commodity',
  USDJPY: 'forex',
  NQ: 'futures',
  YM: 'futures',
};