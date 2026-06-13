import express from 'express';
import { addComment, getFeedbackComments, removeComment } from './comment.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { AddCommentSchema } from './comment.schema';

const commentRoute = express.Router({ mergeParams: true });

commentRoute.get('/', getFeedbackComments);
commentRoute.post('/', requireAuth, validate(AddCommentSchema), addComment);
commentRoute.delete('/:commentId', requireAuth, removeComment);

export default commentRoute;
