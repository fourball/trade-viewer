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
  NDX: 'NASDAQ総合',
  DJI: 'ダウ平均',
  HSI: 'ハンセン指数',
  
  // Futures
  NQ: 'NASDAQ先物',
  YM: 'ダウ先物',
  
  // Crypto
  BTC: 'ビットコイン',
  ETH: 'イーサリアム',
  
  // FX
  USDJPY: 'USD/JPY',
  
  // Commodities
  GOLD: '金',
  OIL: '原油',
} as const;

export type MarketSymbol = keyof typeof MARKET_SYMBOLS;