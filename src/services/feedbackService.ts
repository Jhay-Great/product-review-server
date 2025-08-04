import { ProductFeedback } from '../models/product-feedbackModel';
import { Comment } from '../models/product.interface';

export const createFeeback = async (data: any) => {
  return ProductFeedback.create(data);
};

export const getAllFeedbacks = async () => {
  return ProductFeedback.find();
};

export const getFeedbackById = async (id: string) => {
  return ProductFeedback.findById(id);
};

export const deleteFeedback = async (id: string) => {
    const item = getFeedbackById(id);
    ProductFeedback.deleteOne(item);
    // return ProductFeedback.deleteOne(id);
};

export const addCommentToProduct = async (productId: string, comment: Comment) => {
  const product = await ProductFeedback.findById(productId);
  if (!product) throw new Error('Product not found');

  product.comments.push(comment);
  return product.save();
};

export const deleteCommentFromProduct = async (productId: string, commentId: string) => {
  const product = await ProductFeedback.findById(productId);
  if (!product) throw new Error('Product not found');

  product.comments = product.comments.filter(comment => comment.id!.toString() !== commentId);
  return product.save();
};
