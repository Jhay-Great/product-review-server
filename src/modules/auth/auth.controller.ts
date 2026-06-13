import { NextFunction, Request, Response } from 'express';
import { loginWithEmailPassword } from './auth.service';

export const authLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const payload = await loginWithEmailPassword(req.body);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: payload,
        });
    } catch (error) {
        next(error);
    }
};

export const authLogout = async (
    _req: Request,
    res: Response,
    _next: NextFunction
): Promise<void> => {
    res.status(200).json({
        success: true,
        message: 'Logout successful',
        data: null,
    });
};
