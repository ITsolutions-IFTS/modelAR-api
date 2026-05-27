import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../../Domain/errors';
import { asyncHandler } from '../lib/async-handler';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function validateUuidParam(param: string) {
  return asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    if (!UUID_RE.test(req.params[param])) {
      throw new ValidationError(`Invalid ${param}: must be a valid UUID`);
    }
    next();
  });
}
