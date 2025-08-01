import axios from 'axios';
import type { ApiResponse, MarketData } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// APIレスポンスのエラーハンドリング
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export const marketAPI = {
  // すべての市場データを取得
  getAllMarketData: async (): Promise<MarketData[]> => {
    try {
      const response = await apiClient.get<ApiResponse<MarketData[]>>('/api/v1/market/all');
      return response.data.data || [];
    } catch (error) {
      return [];
    }
  },

  // 特定のシンボルのデータを取得
  getMarketData: async (symbol: string): Promise<MarketData | null> => {
    try {
      const response = await apiClient.get<ApiResponse<MarketData>>(`/api/v1/market/${symbol}`);
      return response.data.data || null;
    } catch (error) {
      return null;
    }
  },

  // ヘルスチェック
  healthCheck: async (): Promise<boolean> => {
    try {
      await apiClient.get('/api/health');
      return true;
    } catch (error) {
      return false;
    }
  },
};