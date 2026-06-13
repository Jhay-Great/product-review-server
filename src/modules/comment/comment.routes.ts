import express from 'express'
import { addComment, getFeedbackComments } from './comment.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const commentRoute = express.Router({mergeParams: true});

commentRoute.get('/', getFeedbackComments);
commentRoute.post('/', requireAuth, addComment);

export default commentRoute;
