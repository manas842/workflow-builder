import { Request, Response, NextFunction } from 'express';

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) return next();
  res.status(404).json({ error: 'NotFound', path: req.path });
}
