import { z } from 'zod';

const VALID_CATEGORIES = ['UI', 'UX', 'Enhancement', 'Bug', 'Feature'] as const;
const VALID_STATUSES = ['suggestion', 'planned', 'in-progress', 'live'] as const;

export const CreateFeedbackSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title must be under 100 characters'),
    category: z.enum(VALID_CATEGORIES, { error: () => ({ message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}` }) }),
    description: z.string().min(1, 'Description is required').max(500, 'Description must be under 500 characters'),
});

export const UpdateFeedbackSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title must be under 100 characters'),
    category: z.enum(VALID_CATEGORIES, { error: () => ({ message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}` }) }),
    description: z.string().min(1, 'Description is required').max(500, 'Description must be under 500 characters'),
    status: z.enum(VALID_STATUSES, { error: () => ({ message: `Status must be one of: ${VALID_STATUSES.join(', ')}` }) }),
});
