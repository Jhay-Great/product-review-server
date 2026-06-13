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

export const getAllProductFeedbacks = async function(req: Request, res:Response, next: NextFunction) {
    try {
        const data = await getAllFeedbacks();

        res.status(200).json({
            success: true,
            message: 'Successful',
            data: data,
        })
    } catch (error) {
        next(error);
    }
};

export const getProductFeedback = async function(req:Request, res:Response, next: NextFunction) {
    try {
        const id = req.params.feedbackId;

        // make request based on id;
        const response = await getFeedbackById(id);

        if (!response.length) {
            throw new NotFoundError('Feedback not found');
        }

        res.status(200).json({
            success: true,
            message: 'Successful gets product feedback',
            data: response,
        })
    } catch (error) {
        next(error);
    }
}

export const createProductFeedback = async function(req:Request, res:Response, next: NextFunction) {
    try {
        const data = req.body;
        const userId = req.authUser!.userId;
        console.log('data from client: ', data);
        // make request
        const response = await createFeeback(data, userId);
        console.log('response: ', response);

        res.status(200).json({
            success: true,
            message: 'Successful creates product feedback',
            data: response,
        })
    } catch (error) {
        next(error);
    }
}

export const updateProductFeedback = async function(req:Request, res:Response, next: NextFunction) {
    try {
        const id = req.params.feedbackId;
        const feedback = req.body;
        // make request based on id;
        const response = await editFeedback(id, feedback);

        res.status(200).json({
            success: true,
            message: 'Successful updates product feedback',
            data: response,
        })
    } catch (error) {
        next(error);
    }
}

export const upvoteProductFeedback = async function(req:Request, res:Response, next: NextFunction) {
    try {
        const id = req.params.feedbackId;

        // query db
        const response = await upvoteFeedback(id);

        res.status(200).json({
            success: true,
            message: 'Upvoted feedback successfully',
            data: response,
        })
    } catch (error) {
        next(error);
    }
}

export const deleteProductFeedback = async function(req:Request, res:Response, next: NextFunction) {
    try {
        const id = req.params.feedbackId;
        // make request based on id;
        const response = await deleteFeedback(id);
        console.log(response.rows);

        res.status(200).json({
            success: true,
            message: 'Successfully deleted product feedback',
            data: response.rows,
        })
    } catch (error) {
        next(error);
    }
}
