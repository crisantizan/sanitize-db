import { NextFunction, Request, Response } from 'express';

/** transform all http responses (only when "json" method is used) */
export function transformResponsePipe(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { json } = res;

  res.json = function(body) {
    const [method, timestamp, path, status, response] = [
      req.method,
      new Date(),
      req.path,
      res.statusCode,
      body,
    ];

    return json.call(this, { method, timestamp, path, status, response });
  };

  next();
}
