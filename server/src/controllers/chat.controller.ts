import { Request, Response, NextFunction } from 'express';
import { ChatRequestSchema } from '../models/chat.model';
import { llmHelper } from '../helpers/llm.helper';

export const chatController = {
  async send(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = ChatRequestSchema.parse(req.body);
      const result = await llmHelper.respond(parsed);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
