import { Router } from 'express';
import { pipedreamController } from '../controllers/pipedream.controller';

export const pipedreamRoutes = Router();

pipedreamRoutes.post('/connect-token', pipedreamController.createConnectToken);
