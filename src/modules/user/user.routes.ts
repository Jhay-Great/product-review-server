import express from 'express';
import { login, register, forgottenPassword, resetPassword } from './user.controller';

const userRouter = express.Router();

userRouter.post('/login', login);
userRouter.post('/register', register);
userRouter.post('/forgot-password', forgottenPassword);
userRouter.post('/reset-password', resetPassword);

export default userRouter;
