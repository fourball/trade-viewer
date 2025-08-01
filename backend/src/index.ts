import 'dotenv/config';
import { buildServer } from './server';
import { logger } from './utils/logger';

const start = async () => {
  try {
    const server = await buildServer();
    const port = process.env.PORT || 3001;
    const host = process.env.HOST || '0.0.0.0';

    await server.listen({ port: Number(port), host });
    
    logger.info(`Server listening on ${host}:${port}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

void start();