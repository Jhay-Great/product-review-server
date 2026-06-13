import express from 'express';
import {
    getAllProductFeedbacks,
    getProductFeedback,
    createProductFeedback,
    updateProductFeedback,
    deleteProductFeedback,
    upvoteProductFeedback,
} from './feedback.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import commentRoute from '../comment/comment.routes';
import { validate } from '../../middleware/validate.middleware';
import { CreateFeedbackSchema, UpdateFeedbackSchema } from './feedback.schema';
import { authRateLimit } from '../../middleware/rate-limit.middleware';

const productFeedbackRoute = express.Router();

productFeedbackRoute.get('/', getAllProductFeedbacks);
productFeedbackRoute.post('/', requireAuth, validate(CreateFeedbackSchema), createProductFeedback);
productFeedbackRoute.get('/:feedbackId', getProductFeedback);
productFeedbackRoute.put(
    '/:feedbackId',
    requireAuth,
    validate(UpdateFeedbackSchema),
    updateProductFeedback
);
productFeedbackRoute.delete('/:feedbackId', requireAuth, deleteProductFeedback);
productFeedbackRoute.post('/upvote/:feedbackId', authRateLimit, requireAuth, upvoteProductFeedback);

// comment routes
productFeedbackRoute.use('/:feedbackId/comments', commentRoute);
// productFeedbackRoute.post('/:feedbackId/')

export default productFeedbackRoute;
