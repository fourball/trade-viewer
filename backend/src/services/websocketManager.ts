import { WebSocket } from 'ws';
import { MarketData, WebSocketMessage } from '../types/market';
import { logger } from '../utils/logger';

interface WebSocketClient {
  id: string;
  socket: WebSocket;
  subscribedSymbols: Set<string>;
}

export class WebSocketManager {
  private clients: Map<string, WebSocketClient> = new Map();
  private symbolSubscribers: Map<string, Set<string>> = new Map();

  addClient(socket: WebSocket): string {
    const id = this.generateClientId();
    this.clients.set(id, {
      id,
      socket,
      subscribedSymbols: new Set(),
    });
    return id;
  }

  removeClient(id: string): void {
    const client = this.clients.get(id);
    if (client) {
      // Remove from all symbol subscriptions
      client.subscribedSymbols.forEach(symbol => {
        const subscribers = this.symbolSubscribers.get(symbol);
        if (subscribers) {
          subscribers.delete(id);
          if (subscribers.size === 0) {
            this.symbolSubscribers.delete(symbol);
          }
        }
      });
      this.clients.delete(id);
    }
  }

  subscribe(clientId: string, symbols: string[]): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    symbols.forEach(symbol => {
      client.subscribedSymbols.add(symbol);
      
      if (!this.symbolSubscribers.has(symbol)) {
        this.symbolSubscribers.set(symbol, new Set());
      }
      this.symbolSubscribers.get(symbol)!.add(clientId);
    });
  }

  unsubscribe(clientId: string, symbols: string[]): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    symbols.forEach(symbol => {
      client.subscribedSymbols.delete(symbol);
      
      const subscribers = this.symbolSubscribers.get(symbol);
      if (subscribers) {
        subscribers.delete(clientId);
        if (subscribers.size === 0) {
          this.symbolSubscribers.delete(symbol);
        }
      }
    });
  }

  broadcast(symbol: string, data: MarketData): void {
    const subscribers = this.symbolSubscribers.get(symbol);
    if (!subscribers || subscribers.size === 0) return;

    const message: WebSocketMessage = {
      type: 'update',
      data,
    };

    const messageStr = JSON.stringify(message);

    subscribers.forEach(clientId => {
      const client = this.clients.get(clientId);
      if (client && client.socket.readyState === WebSocket.OPEN) {
        try {
          client.socket.send(messageStr);
        } catch (error) {
          logger.error(`Error sending to client ${clientId}:`, error);
          this.removeClient(clientId);
        }
      }
    });
  }

  broadcastAll(data: MarketData[]): void {
    data.forEach(item => {
      this.broadcast(item.symbol, item);
    });
  }

  getSubscribedSymbols(): string[] {
    return Array.from(this.symbolSubscribers.keys());
  }

  getClientCount(): number {
    return this.clients.size;
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}