import { Express, Router } from 'express';
import { healthRoutes } from './health.routes';
import { chatRoutes } from './chat.routes';
import { pipedreamRoutes } from './pipedream.routes';

export function registerRoutes(app: Express): void {
  const api = Router();

  api.use('/health', healthRoutes);
  api.use('/chat', chatRoutes);
  api.use('/pipedream', pipedreamRoutes);

  app.use('/api', api);
}
