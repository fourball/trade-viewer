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
  NDX: 'ナスダック',
  DJI: 'ダウ平均',
  BTCUSDT: 'ビットコイン',
  GOLD: 'ゴールド',
  USDJPY: 'USD/JPY',
  HSI: '香港ハンセン',
  NQ: 'ナスダック先物',
  YM: 'ダウ先物',
} as const;

export type MarketSymbol = keyof typeof MARKET_SYMBOLS;