import express from 'express';
import { authLogin, authLogout } from './auth.controller';

const authRouter = express.Router();

authRouter.post('/login', authLogin);
authRouter.post('/logout', authLogout);

export default authRouter;
