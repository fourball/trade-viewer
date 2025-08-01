import { FastifyRequest, FastifyReply } from 'fastify';

export const cloudfrontAuth = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  // 開発環境では認証をスキップ
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  // ヘルスチェックエンドポイントは認証をスキップ
  if (request.url === '/api/health') {
    return;
  }

  const secret = request.headers['x-cloudfront-secret'];
  const expectedSecret = process.env.CLOUDFRONT_SECRET;

  if (!expectedSecret) {
    request.log.warn('CLOUDFRONT_SECRET is not set in production');
    return;
  }

  if (secret !== expectedSecret) {
    request.log.warn('Invalid CloudFront secret attempted', {
      ip: request.ip,
      url: request.url,
      userAgent: request.headers['user-agent'],
    });
    
    reply.code(403).send({ error: 'Forbidden' });
  }
};