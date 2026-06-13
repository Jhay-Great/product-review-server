import { Request, Response, NextFunction } from 'express';
import {
    addComment as addCommentService,
    getFeedbackComments as getFeedbackCommentsService,
    deleteComment as deleteCommentService,
} from './comment.service';
import { NotFoundError } from '../../utils/errors/httpErrors';

export const addComment = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const { feedbackId } = req.params;
        const { content } = req.body;
        const userId = req.authUser!.userId;
        const result = await addCommentService(feedbackId, content, userId);
        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const getFeedbackComments = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { feedbackId } = req.params;
        const result = await getFeedbackCommentsService(feedbackId);
        res.status(200).json({
            success: true,
            message: 'Comments retrieved successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const removeComment = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const { commentId } = req.params;
        const userId = req.authUser!.userId;
        const rowCount = await deleteCommentService(commentId, userId);

        if (rowCount === 0) {
            throw new NotFoundError('Comment not found');
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
