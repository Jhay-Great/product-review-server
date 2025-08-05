import express from 'express'
import { addComment, getFeedbackComments } from '../controllers/comment.controller';

const commentRoute = express.Router({mergeParams: true});

commentRoute.get('/', getFeedbackComments);
commentRoute.post('/:feedback/:userId/comments', addComment);

export default commentRoute;