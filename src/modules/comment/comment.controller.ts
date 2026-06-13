import { Request, Response, NextFunction } from 'express';
import { addComment as addCommentService, getFeedbackComments as getFeedbackCommentsService } from './comment.service';

export const addComment = async function(req: Request, res: Response, next: NextFunction) {
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
}

export const getFeedbackComments = async function(req: Request, res: Response, next: NextFunction) {
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
