import { Request, Response, NextFunction } from 'express';
import { pipedreamHelper } from '../helpers/pipedream.helper';

export const pipedreamController = {
  async createConnectToken(req: Request, res: Response, next: NextFunction) {
    try {
      const externalUserId = (req.body?.externalUserId as string) ?? 'demo-user';
      const token = await pipedreamHelper.createConnectToken(externalUserId);
      res.json(token);
    } catch (err) {
      next(err);
    }
  },
};
