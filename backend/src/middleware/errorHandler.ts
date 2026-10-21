import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env.js';

export interface AppError extends Error {
  statusCode?: number;
  errorCode?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected error occurred';

  console.error(`[Error] [${req.method}] ${req.url}:`, err);

  res.status(statusCode).json({
    success: false,
    message,
    errorCode,
    ...(ENV.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
