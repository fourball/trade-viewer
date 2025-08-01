export type MarketCategory = 'stock' | 'crypto' | 'commodity' | 'forex' | 'futures';

export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose?: number;
  high?: number;
  low?: number;
  volume?: number;
  currency: string;
  timestamp: string;
  category?: MarketCategory;
}

export interface WebSocketMessage {
  type: 'subscribe' | 'unsubscribe' | 'update' | 'initial' | 'error';
  symbols?: string[];
  data?: MarketData | MarketData[];
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  lastUpdated?: string;
}

export const MARKET_SYMBOLS = {
  // Indices
  NKY: '日経平均',
  HSI: '香港ハンセン',
  NDX: 'ナスダック',
  DJI: 'ダウ平均',
  
  // Futures
  NK225: '日経平均先物',
  NQ: 'ナスダック先物',
  YM: 'ダウ先物',
  
  // Crypto
  BTCUSDT: 'ビットコイン',
  
  // FX
  USDJPY: 'ドル円',
  
  // Commodities
  GOLD: 'ゴールド',
} as const;

export type MarketSymbol = keyof typeof MARKET_SYMBOLS;