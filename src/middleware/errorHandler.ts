import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors/AppError';

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = Number.isInteger(err.status) && err.status >= 400 ? err.status : 500;
    const isOperational = err instanceof AppError && err.isOperational;

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
        message: isOperational ? err.message : 'Internal Server Error',
    });
};
