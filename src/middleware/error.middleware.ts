import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors/AppError';

export const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
    const errObj = err as Record<string, unknown>;
    const status =
        Number.isInteger(errObj.status) && (errObj.status as number) >= 400
            ? (errObj.status as number)
            : 500;
    const isOperational = err instanceof AppError && err.isOperational;
    const message = isOperational ? err.message : 'Internal Server Error';
    const code = typeof errObj.code === 'string' ? errObj.code : null;

    if (status >= 500) {
        // eslint-disable-next-line no-console
        console.error({
            name: errObj.name,
            message: errObj.message,
            stack: errObj.stack,
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
