import { Request, Response } from 'express';
// import { 
//     getAllFeedbacks, 
//     getFeedbackById, 
//     createFeeback,
//     deleteFeedback,
//  } from '../services/feedbackService';
import { 
    getAllFeedbacks, 
    getFeedbackById, 
    createFeeback,
    deleteFeedback,
    editFeedback,
    upvoteFeedback,
 } from '../services/pg-services/feedbackService';

export const getAllProductFeedbacks = async function(req: Request, res:Response) {
    try {
        const data = await getAllFeedbacks();
        
        res.status(200).json({
            success: true,
            message: 'Successful',
            data: data,
        })
    } catch (error) {
        console.log('an error occurred: ', error);
    }
};

export const getProductFeedback = async function(req:Request, res:Response) {
    try {
        const id = req.params.feedbackId;
        // if (!id) {
        //     throw new Error('Data not available');
        // }
        
        // make request based on id;
        const response = await getFeedbackById(id);

        if (!response.length) {
            res.status(404).json({
                success: false,
                message: 'Item could not be found',
                data: response,
            })
        }

        res.status(200).json({
            success: true,
            message: 'Successful gets product feedback',
            data: response,
        })
    } catch (error) {
        
    }
}

export const createProductFeedback = async function(req:Request, res:Response) {
    try {
        const data = req.body;
        console.log('data from client: ', data);
        // make request
        const response = await createFeeback(data);
        console.log('response: ', response);

        res.status(200).json({
            success: true,
            message: 'Successful creates product feedback',
            data: response,
        })
    } catch (error) {
        
    }
}

export const updateProductFeedback = async function(req:Request, res:Response) {
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

    }
}

export const upvoteProductFeedback = async function(req:Request, res:Response) {
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
        console.log(error);
        res.status(401).json({
            success: false,
            message: 'Failed to upvote feedback',
        })
    }
}

export const deleteProductFeedback = async function(req:Request, res:Response) {
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
        
    }
}