import express from 'express';
import { register, forgottenPassword, resetPassword } from './user.controller';
import { validate } from '../../middleware/validate.middleware';
import { RegisterSchema, ForgotPasswordSchema, ResetPasswordSchema } from '../auth/auth.schema';
import { authRateLimit } from '../../middleware/rate-limit.middleware';

const userRouter = express.Router();

userRouter.post('/register', authRateLimit, validate(RegisterSchema), register);
userRouter.post('/forgot-password', authRateLimit, validate(ForgotPasswordSchema), forgottenPassword);
userRouter.post('/reset-password', validate(ResetPasswordSchema), resetPassword);

export default userRouter;
