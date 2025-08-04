import { Schema, model, Document } from "mongoose";
import { Feedback, Comment, User } from "./product.interface";


export interface IFeedback extends Document, Omit<Feedback, "id"> {}

const UserSchema = new Schema<User>({
    image: {type: String, },
    name: { type: String, },
    username: { type: String, },
})

const CommentSchema = new Schema<Comment>(
  {
    // id: { type: String, required: true },
    content: { type: String, required: true },
    user: UserSchema,
  },
  { _id: true }
);

const productFeedbackSchema = new Schema<IFeedback>({
    // id: {type: String, required: true },
    title: {type: String, required: true },
    category: {type: String, required: true },
    upvotes: {type: Number, required: true },
    status: { type: String, required: true },
    description: {type: String, required: true },
    comments: [CommentSchema],
}, {
  timestamps: true
});

export const ProductFeedback = model<IFeedback>('ProductFeedback', productFeedbackSchema);