import { addTricycle, deleteTricycleById, exportAllTricycles, getAllTricycles, getTricycleById } from '@/services/tricycleService';
import { GetByIdSchema, TricycleSchema } from '@/types/schema';
import { z } from 'zod';
import { publicProcedure } from '../trpc';


const TricyclePaginationSchema = z.object({
    search: z.string().nullable(),
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(10),
    order: z.string(),
});

const DeleteTricycleSchema = z.object({
    plateNo: z.string()
})

export type deleteTricycleType = z.infer<typeof DeleteTricycleSchema>;

export const tricycleRouter = {
    exportTricycles: publicProcedure.query(async () => {
        return exportAllTricycles();
    }),
    getAllTricycles: publicProcedure
        .input(TricyclePaginationSchema)
        .query(async ({ input }) => {
            return getAllTricycles(input);
        }),
    getTricycleById: publicProcedure.input(GetByIdSchema).query(async ({ input }) => {
        return getTricycleById(input);
    }),
    deleteTricycle: publicProcedure.input(DeleteTricycleSchema).mutation(async ({ input }) => {
        return deleteTricycleById(input)
    }),
    addTricycle: publicProcedure.input(TricycleSchema).mutation(async ({ input }) => {
        return addTricycle(input);
    }),

};
