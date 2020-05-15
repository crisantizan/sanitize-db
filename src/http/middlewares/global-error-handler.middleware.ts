import { ErrorRequestHandler } from 'express';

export const globalErrorHandlerMiddleware: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  // http status code
  const httpStatus = err.status || err.statusCode || 500;

  res
    .status(httpStatus)
    .json(err.body || err.message || 'Internal server error');
};
