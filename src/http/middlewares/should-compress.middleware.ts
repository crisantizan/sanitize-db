import { Request, Response } from 'express';
import compression from 'compression';

/** allow decide when no compress the request */
export function shouldCompressMiddleware(req: Request, res: Response) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false;
  }

  // fallback to standard filter function
  return compression.filter(req, res);
}
