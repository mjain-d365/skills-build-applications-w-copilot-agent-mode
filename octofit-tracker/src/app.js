import express from 'express';
import healthRouter from './routes/health.routes.js';
import itemsRouter from './routes/items.routes.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';

export function createApp() {
  const app = express();

  app.use(express.json());

  app.use('/health', healthRouter);
  app.use('/api/items', itemsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
