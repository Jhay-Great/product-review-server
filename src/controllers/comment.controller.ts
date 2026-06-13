import { Request, Response } from 'express';

export const addComment = async function (req: Request, res: Response) {
    try {
        const _comment = req.body;
        const _feedbackId = req.params.feedbackId;

        res.status(201).json({
            success: true,
            message: 'Comments added successfully',
            data: [],
        });
    } catch (_error) {}
};

export const getFeedbackComments = async function (req: Request, _res: Response) {
    try {
        const _feedbackId = req.params.feedbackId;
    } catch (_error) {}
};
