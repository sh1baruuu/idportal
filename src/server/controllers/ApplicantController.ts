import { addApplicant, countApplicant, deleteApplicant, getAllApplicants, getApplicantById, updateApplicant } from '@/services/applicantService';
import { publicProcedure } from '../trpc';
import { AddApplicantSchema, ApplicantDeleteSchema, ApplicantGetByIdSchema, ApplicantPaginationSchema, ApplicantSchema } from '@/types/schema';

export const applicantRouter = {
    addApplicant: publicProcedure
        .input(AddApplicantSchema)
        .mutation(async ({ input }) => {
            return addApplicant(input);
        }),
    countApplicant: publicProcedure.query(async () => {
        return countApplicant();
    }),
    getApplicantById: publicProcedure.input(ApplicantGetByIdSchema).query(async ({ input }) => {
        return getApplicantById(input)
    }),
    updateApplicant: publicProcedure.input(ApplicantSchema).mutation(async ({ input }) => {
        return updateApplicant(input)
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
