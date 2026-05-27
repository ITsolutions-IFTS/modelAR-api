import { Request, Response, NextFunction } from 'express';
import {
  DomainError,
  NotFoundError,
  ConflictError,
  ValidationError,
  ForbiddenError,
} from '../../Domain/errors';

const STATUS_MAP = new Map<Function, number>([
  [NotFoundError, 404],
  [ConflictError, 409],
  [ValidationError, 400],
  [ForbiddenError, 403],
]);

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof DomainError) {
    const status = STATUS_MAP.get(err.constructor) ?? 500;
    res.status(status).json({ error: err.message, type: err.name });
    return;
  }
  // Unexpected error — log and respond 500
  console.error(`[ERROR] ${req.method} ${req.path}:`, err);
  res.status(500).json({ error: 'Internal server error' });
}
