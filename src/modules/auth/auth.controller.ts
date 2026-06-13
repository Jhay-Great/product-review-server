import { Request, Response } from 'express';
import { loginWithEmailPassword } from './auth.service';

export const authLogin = async (req: Request, res: Response): Promise<void> => {
  const payload = await loginWithEmailPassword(req.body);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: payload,
  });
};

export const authLogout = async (_req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Logout successful',
    data: null,
  });
};
