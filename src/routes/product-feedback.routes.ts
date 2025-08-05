import express from 'express';
import { 
    getAllProductFeedbacks,
    getProductFeedback,
    createProductFeedback,
    updateProductFeedback,
    deleteProductFeedback,
    upvoteProductFeedback,
 } from '../controllers/product-feedback.controller';
 import commentRoute from './comment.route';

const productFeedbackRoute = express.Router();

productFeedbackRoute.get('/', getAllProductFeedbacks);
productFeedbackRoute.post('/', createProductFeedback);
productFeedbackRoute.get('/:feedbackId', getProductFeedback);
productFeedbackRoute.put('/:feedbackId', updateProductFeedback);
productFeedbackRoute.delete('/:feedbackId', deleteProductFeedback);
productFeedbackRoute.post('/upvote/:feedbackId', upvoteProductFeedback);

// comment routes
productFeedbackRoute.use('/:feedbackId/comments', commentRoute);
// productFeedbackRoute.post('/:feedbackId/')

export default productFeedbackRoute;