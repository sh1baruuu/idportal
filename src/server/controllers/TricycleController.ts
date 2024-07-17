import { getAllTricycles } from '@/services/tricycleService';
import { publicProcedure } from '../trpc';
import { z } from 'zod';


const TricyclePaginationSchema = z.object({
    search: z.string().nullable(),
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(10),
    order: z.string(),
});

export const tricycleRouter = {
    getAllTricycles: publicProcedure
        .input(TricyclePaginationSchema)
        .query(async ({ input }) => {
            return getAllTricycles(input);
        }),
};
