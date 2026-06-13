import express from 'express';
import authRouter from '../modules/auth/auth.routes';
import userRouter from '../modules/user/user.routes';
import feedbackRouter from '../modules/feedback/feedback.routes';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/feedback', feedbackRouter);
router.get('/', (req, res) => {
    res.send('server is live');
});

export default router;
