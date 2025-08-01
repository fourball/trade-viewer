import { useEffect, useRef, useState, useCallback } from 'react';
import type { MarketData, WebSocketMessage } from '../types';

interface UseWebSocketOptions {
  symbols: string[];
  onUpdate?: (data: MarketData | MarketData[]) => void;
  onError?: (error: string) => void;
}

export const useWebSocket = ({ symbols, onUpdate, onError }: UseWebSocketOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const isInitializedRef = useRef(false);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) {
      return;
    }

    const wsUrl = import.meta.env.VITE_WS_URL
      ? `${import.meta.env.VITE_WS_URL}/ws`
      : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`;


    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setIsReconnecting(false);
        reconnectAttemptsRef.current = 0;

        // サブスクライブ
        if (symbols.length > 0) {
          ws.send(JSON.stringify({
            type: 'subscribe',
            symbols,
          } as WebSocketMessage));
        }
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;

          switch (message.type) {
            case 'update':
            case 'initial':
              if (message.data && onUpdate) {
                onUpdate(message.data);
              }
              break;
            case 'error':
              onError?.(message.message || 'Unknown error');
              break;
          }
        } catch (error) {
          // Silently ignore parse errors
        }
      };

      ws.onerror = (error) => {
        onError?.('WebSocket connection error');
      };

      ws.onclose = () => {
        setIsConnected(false);
        wsRef.current = null;

        // 再接続ロジック
        if (reconnectAttemptsRef.current < 5) {
          setIsReconnecting(true);
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, delay);
        }
      };
    } catch (error) {
      onError?.('Failed to connect to WebSocket');
    }
  }, [symbols, onUpdate, onError]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      // CLOSING状態やCONNECTING状態の場合は、強制的にクローズしない
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close(1000, 'Client disconnect');
      }
      wsRef.current = null;
    }

    setIsConnected(false);
    setIsReconnecting(false);
    reconnectAttemptsRef.current = 0;
  }, []);

  const subscribe = useCallback((newSymbols: string[]) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'subscribe',
        symbols: newSymbols,
      } as WebSocketMessage));
    }
  }, []);

  const unsubscribe = useCallback((symbolsToRemove: string[]) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'unsubscribe',
        symbols: symbolsToRemove,
      } as WebSocketMessage));
    }
  }, []);

  useEffect(() => {
    if (isInitializedRef.current) {
      return;
    }

    isInitializedRef.current = true;

    connect();

    return () => {
      if (isInitializedRef.current) {
        isInitializedRef.current = false;
        disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // シンボルが変更されたときの処理
    if (isConnected && wsRef.current?.readyState === WebSocket.OPEN) {
      subscribe(symbols);
    }
  }, [symbols, isConnected, subscribe]);

  return {
    isConnected,
    isReconnecting,
    subscribe,
    unsubscribe,
    disconnect,
    reconnect: connect,
  };
};
