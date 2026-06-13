import express from 'express';
import { authLogin, authLogout } from './auth.controller';
import { validate } from '../../middleware/validate.middleware';
import { LoginSchema } from './auth.schema';

const authRouter = express.Router();

authRouter.post('/login', validate(LoginSchema), authLogin);
authRouter.post('/logout', authLogout);

export default authRouter;
