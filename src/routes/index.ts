import express from 'express';
import productFeedbackRoute from './product-feedback.routes';
import userRouter from './user.routes';

const router = express.Router();

router.use('/user', userRouter);
router.use('/product-feedback', productFeedbackRoute);
router.get('/', (req, res) => {
    res.send('server is live');
})

export default router;