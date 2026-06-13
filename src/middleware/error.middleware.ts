import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors/AppError';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const status = Number.isInteger(err.status) && err.status >= 400 ? err.status : 500;
  const isOperational = err instanceof AppError && err.isOperational;
  const message = isOperational ? err.message : 'Internal Server Error';
  const code = typeof err?.code === 'string' ? err.code : null;

  if (status >= 500) {
    console.error({
      name: err.name,
      message: err.message,
      stack: err.stack,
      method: req.method,
      url: req.url,
    });
  }

  res.status(status).json({
    success: false,
    message,
    data: code ? { code } : null,
  });
};
