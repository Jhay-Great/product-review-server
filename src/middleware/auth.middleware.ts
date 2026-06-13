import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';

interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

const parseBearerToken = (headerValue?: string): string | null => {
  if (!headerValue) {
    return null;
  }

  const [scheme, token] = headerValue.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
};

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const token = parseBearerToken(req.header('Authorization'));

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized',
      data: { code: 'AUTH_UNAUTHORIZED' },
    });
    return;
  }

  try {
    const payload = verifyToken(token) as JwtPayload;
    req.authUser = { userId: String(payload.userId) };
    next();
  } catch (_error) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized',
      data: { code: 'AUTH_INVALID_TOKEN' },
    });
  }
};
