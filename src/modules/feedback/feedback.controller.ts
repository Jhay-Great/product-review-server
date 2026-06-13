import { NextFunction, Request, Response } from 'express';
import {
    getAllFeedbacks,
    getFeedbackById,
    createFeeback,
    deleteFeedback,
    editFeedback,
    upvoteFeedback,
} from './feedback.service';
import { NotFoundError } from '../../utils/errors/httpErrors';
import { UpdateFeedback } from '../../types/models';

export const getAllProductFeedbacks = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const data = await getAllFeedbacks(page, limit);

        res.status(200).json({
            success: true,
            message: 'Successful',
            data,
            meta: { page, limit },
        });
    } catch (error) {
        next(error);
    }
};

export const getProductFeedback = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.feedbackId;

        const response = await getFeedbackById(id);

        if (!response.length) {
            throw new NotFoundError('Feedback not found');
        }

        res.status(200).json({
            success: true,
            message: 'Successful gets product feedback',
            data: response,
        });
    } catch (error) {
        next(error);
    }
};

export const createProductFeedback = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const data = req.body;
        const userId = req.authUser!.userId;
        const response = await createFeeback(data, userId);

        res.status(200).json({
            success: true,
            message: 'Successful creates product feedback',
            data: response,
        });
    } catch (error) {
        next(error);
    }
};

export const updateProductFeedback = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const id = req.params.feedbackId;
        const userId = req.authUser!.userId;
        const feedback = req.body as UpdateFeedback;
        const response = await editFeedback(id, userId, feedback);

        if (response.length === 0) {
            throw new NotFoundError('Feedback not found');
        }

        res.status(200).json({
            success: true,
            message: 'Successful updates product feedback',
            data: response,
        });
    } catch (error) {
        next(error);
    }
};

export const upvoteProductFeedback = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const id = req.params.feedbackId;
        const userId = req.authUser!.userId;

        const response = await upvoteFeedback(id, userId);

        res.status(200).json({
            success: true,
            message: 'Upvoted feedback successfully',
            data: response,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProductFeedback = async function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const id = req.params.feedbackId;
        const userId = req.authUser!.userId;
        const rowCount = await deleteFeedback(id, userId);

        if (rowCount === 0) {
            throw new NotFoundError('Feedback not found');
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
