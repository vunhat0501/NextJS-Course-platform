import z from 'zod';

export const courseSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    tags: z.string().min(1, { message: 'Require at least 1 tag' }),
    description: z.string().min(1, { message: 'Description is required' }),
});
