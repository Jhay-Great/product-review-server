import { Request, Response } from 'express';
import { loginWithEmailPassword } from './auth.service';

export const authLogin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: 'Email and password are required',
      data: { code: 'AUTH_VALIDATION_ERROR' },
    });
    return;
  }

  const payload = await loginWithEmailPassword({ email, password });

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
