import express from 'express';
import { 
    getAllProductFeedbacks,
    getProductFeedback,
    createProductFeedback,
    updateProductFeedback,
    deleteProductFeedback,
    upvoteProductFeedback,
 } from '../controllers/product-feedback.controller';

const productFeedbackRoute = express.Router();

productFeedbackRoute.get('/', getAllProductFeedbacks);
productFeedbackRoute.post('/', createProductFeedback);
productFeedbackRoute.get('/:feedbackId', getProductFeedback);
productFeedbackRoute.put('/:feedbackId', updateProductFeedback);
productFeedbackRoute.delete('/:feedbackId', deleteProductFeedback);
productFeedbackRoute.post('/upvote/:feedbackId', upvoteProductFeedback);

export default productFeedbackRoute;