import express from 'express';
import { login, register, forgottenPassword, resetPassword } from './user.controller';
import { validate } from '../../middleware/validate.middleware';
import { LoginSchema, RegisterSchema, ForgotPasswordSchema, ResetPasswordSchema } from '../auth/auth.schema';

const userRouter = express.Router();

userRouter.post('/login', validate(LoginSchema), login);
userRouter.post('/register', validate(RegisterSchema), register);
userRouter.post('/forgot-password', validate(ForgotPasswordSchema), forgottenPassword);
userRouter.post('/reset-password', validate(ResetPasswordSchema), resetPassword);

export default userRouter;
