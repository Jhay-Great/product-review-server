// src/utils/jwt.ts
import jwt from 'jsonwebtoken';

export const generateToken = (userId: string): string => {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '1h' });
};

export const verifyToken = (token: string): jwt.JwtPayload | string => {
    return jwt.verify(token, process.env.JWT_SECRET!);
};
