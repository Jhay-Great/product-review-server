import { z } from 'zod';

export const AddCommentSchema = z.object({
    content: z.string().min(1, 'Comment content is required').max(250, 'Comment must be under 250 characters'),
});
