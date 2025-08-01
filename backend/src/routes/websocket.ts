import { FastifyPluginAsync } from 'fastify';
import { WebSocketMessage } from '../types/market';
import { MarketDataService } from '../services/marketData';
import { WebSocketManager } from '../services/websocketManager';

export const websocketRoutes: FastifyPluginAsync = async (fastify) => {
  const marketDataService = new MarketDataService(fastify);
  
  // Use a single WebSocketManager instance
  if (!fastify.wsManager) {
    const wsManager = new WebSocketManager();
    fastify.decorate('wsManager', wsManager);
  }

  fastify.get('/ws', { websocket: true }, (connection, _req) => {
    const socket = connection;  // connectionがWebSocketインスタンス
    const clientId = fastify.wsManager.addClient(socket);
    fastify.log.info(`WebSocket client connected: ${clientId}`);

    socket.on('message', (message: Buffer) => {
      try {
        const data = JSON.parse(message.toString()) as WebSocketMessage;

        switch (data.type) {
          case 'subscribe':
            if (data.symbols) {
              fastify.wsManager.subscribe(clientId, data.symbols);
              
              // Send initial data for subscribed symbols
              void Promise.all(
                data.symbols.map(symbol => marketDataService.fetchMarketData(symbol))
              ).then(initialData => {
                const validData = initialData.filter(item => item !== null);
                
                socket.send(
                  JSON.stringify({
                    type: 'initial',
                    data: validData,
                  } as WebSocketMessage)
                );
              }).catch(error => {
                fastify.log.error('Error fetching initial data:', error);
              });
            }
            break;

          case 'unsubscribe':
            if (data.symbols) {
              fastify.wsManager.unsubscribe(clientId, data.symbols);
            }
            break;

          default:
            socket.send(
              JSON.stringify({
                type: 'error',
                message: 'Unknown message type',
              } as WebSocketMessage)
            );
        }
      } catch (error) {
        fastify.log.error('WebSocket message error:', error);
        socket.send(
          JSON.stringify({
            type: 'error',
            message: 'Invalid message format',
          } as WebSocketMessage)
        );
      }
    });

    socket.on('close', () => {
      fastify.wsManager.removeClient(clientId);
      fastify.log.info(`WebSocket client disconnected: ${clientId}`);
    });

    socket.on('error', (error: Error) => {
      fastify.log.error(`WebSocket error for client ${clientId}:`, error);
      fastify.wsManager.removeClient(clientId);
    });
  });
};

declare module 'fastify' {
  interface FastifyInstance {
    wsManager: WebSocketManager;
  }
}