import { addApplicant, countApplicant, deleteApplicant, getAllApplicants } from '@/services/applicantService';
import { publicProcedure } from '../trpc';
import { AddApplicantSchema, ApplicantDeleteSchema, ApplicantPaginationSchema } from '@/types/schema';

export const applicantRouter = {
    addApplicant: publicProcedure
        .input(AddApplicantSchema)
        .mutation(async ({ input }) => {
            return addApplicant(input);
        }),
    countApplicant: publicProcedure.query(async () => {
        return countApplicant();
    }),
    getAllApplicants: publicProcedure
        .input(ApplicantPaginationSchema)
        .query(async ({ input }) => {
            return getAllApplicants(input);
        }),
    deleteApplicant: publicProcedure.input(ApplicantDeleteSchema)
        .mutation(async ({ input }) => {
            const { applicantId } = input;
            const response = await deleteApplicant(applicantId);
            return response;
        })
};
