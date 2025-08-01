import React from 'react';
import type { MarketData } from '../types';
import styles from './MarketCard.module.css';

interface MarketCardProps {
  data: MarketData;
}

export const MarketCard: React.FC<MarketCardProps> = ({ data }) => {
  const isPositive = data.change >= 0;
  const changeClass = isPositive ? styles.positive : styles.negative;
  const arrow = isPositive ? '▲' : '▼';

  const formatNumber = (num: number, decimals: number = 2): string => {
    return new Intl.NumberFormat('ja-JP', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  const formatCurrency = (num: number, currency: string, symbol: string): string => {
    // FX通貨ペアは小数点第2位まで
    if (symbol === 'USDJPY' || symbol === 'EURJPY' || symbol === 'GBPJPY') {
      return formatNumber(num, 2);
    }
    // それ以外は整数で、通貨記号付き
    if (currency === 'JPY') {
      return `¥${formatNumber(num, 0)}`;
    } else if (currency === 'USD') {
      return `$${formatNumber(num, 0)}`;
    } else if (currency === 'HKD') {
      return `${formatNumber(num, 0)} HKD`;
    }
    return `${formatNumber(num, 0)} ${currency}`;
  };
  
  const formatPrice = (num: number, currency: string, symbol: string): string => {
    // USDJPYは小数点第2位まで
    if (symbol === 'USDJPY' || symbol === 'EURJPY' || symbol === 'GBPJPY') {
      return formatNumber(num, 2);
    }
    // それ以外は整数
    return formatNumber(num, 0);
  };

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.symbol}>{data.symbol}</h3>
          <p className={styles.name}>{data.name}</p>
        </div>
        <span className={styles.updateTime}>{formatTime(data.timestamp)}</span>
      </div>
      
      <div className={styles.priceSection}>
        <div className={styles.currentPrice}>
          {formatCurrency(data.price, data.currency, data.symbol)}
        </div>
        <div className={`${styles.change} ${changeClass}`}>
          <span className={styles.arrow}>{arrow}</span>
          <span className={styles.changeValue}>
            {formatNumber(Math.abs(data.change))}
            ({data.changePercent > 0 ? '+' : ''}{formatNumber(data.changePercent)}%)
          </span>
        </div>
      </div>

      {(data.high || data.low) && (
        <div className={styles.range}>
          <div className={styles.rangeItem}>
            <span className={styles.label}>高値</span>
            <span className={styles.value}>{data.high ? formatPrice(data.high, data.currency, data.symbol) : '-'}</span>
          </div>
          <div className={styles.rangeItem}>
            <span className={styles.label}>安値</span>
            <span className={styles.value}>{data.low ? formatPrice(data.low, data.currency, data.symbol) : '-'}</span>
          </div>
        </div>
      )}
    </div>
  );
};