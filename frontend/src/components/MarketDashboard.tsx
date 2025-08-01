import React, { useState, useEffect, useCallback } from 'react';
import { MarketCard } from './MarketCard';
import { useWebSocket } from '../hooks/useWebSocket';
import { marketAPI } from '../services/api';
import type { MarketData } from '../types';
import { MARKET_SYMBOLS } from '../types';
import styles from './MarketDashboard.module.css';

export const MarketDashboard: React.FC = () => {
  const [marketData, setMarketData] = useState<Map<string, MarketData>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());

  // すべてのシンボルを取得
  const symbols = Object.keys(MARKET_SYMBOLS);

  // WebSocketのコールバック
  const handleWebSocketUpdate = useCallback((data: MarketData | MarketData[]) => {
    const updates = Array.isArray(data) ? data : [data];
    
    setMarketData((prev) => {
      const newData = new Map(prev);
      updates.forEach((item) => {
        newData.set(item.symbol, item);
      });
      return newData;
    });
    
    setLastUpdateTime(new Date());
  }, []);

  const handleWebSocketError = useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);

  // WebSocket接続
  const { isConnected, isReconnecting } = useWebSocket({
    symbols,
    onUpdate: handleWebSocketUpdate,
    onError: handleWebSocketError,
  });

  // 初期データの取得
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await marketAPI.getAllMarketData();
        const dataMap = new Map<string, MarketData>();
        data.forEach((item) => {
          dataMap.set(item.symbol, item);
        });
        setMarketData(dataMap);
      } catch (err) {
        setError('初期データの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // すべてのデータを一つの配列に
  const allData = Array.from(marketData.values());

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>データを読み込んでいます...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerWrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>Trade Viewer</h1>
          <div className={styles.status}>
            <div className={styles.connectionStatus}>
              <span className={`${styles.statusDot} ${isConnected ? styles.connected : styles.disconnected}`}></span>
              <span className={styles.statusText}>
                {isConnected ? '接続中' : isReconnecting ? '再接続中...' : '切断'}
              </span>
            </div>
            <div className={styles.updateTime}>
              最終更新: {lastUpdateTime.toLocaleTimeString('ja-JP')}
            </div>
          </div>
        </header>
      </div>

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}

      <main className={styles.main}>
        <div className={styles.grid}>
          {allData.map((data) => (
            <MarketCard key={data.symbol} data={data} />
          ))}
        </div>
      </main>
    </div>
  );
};