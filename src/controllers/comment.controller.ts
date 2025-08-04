import { Request, Response } from 'express';

export const addComment = async function(req: Request, res: Response) {
    try {
        const comment = req.body;
        const feedbackId = req.params.feedbackId;

        res.status(201).json({
            success: true,
            message: 'Comments added successfully',
            data: [],
        })

    } catch (error) {
        
    }
}

export const getFeedbackComments = async function(req: Request, res:Response) {
    try {
        const { feedbackId } = req.params;
        
    } catch (error) {
        
    }
};
