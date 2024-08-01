import { addApplicant, countApplicant, deleteApplicant, getAllApplicants, getApplicantById, updateApplicant, viewApplicantById } from '@/services/applicantService';
import { publicProcedure } from '../trpc';
import { AddApplicantSchema, ApplicantDeleteSchema, GetByIdSchema, ApplicantPaginationSchema, ApplicantSchema } from '@/types/schema';

export const applicantRouter = {
    addApplicant: publicProcedure
        .input(AddApplicantSchema)
        .mutation(async ({ input }) => {
            return addApplicant(input);
        }),
    countApplicant: publicProcedure.query(async () => {
        return countApplicant();
    }),
    getApplicantById: publicProcedure.input(GetByIdSchema).query(async ({ input }) => {
        return getApplicantById(input)
    }),
    viewApplicantById: publicProcedure.input(GetByIdSchema).query(async ({ input }) => {
        return viewApplicantById(input)
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
            const response = await deleteApplicant(input);
            return response;
        })
};
