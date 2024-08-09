import { addApplicant, countApplicant, deleteApplicant, exportAllApplicant, getAllApplicants, getApplicantById, updateApplicant, viewApplicantById } from '@/services/applicantService';
import { AddApplicantSchema, ApplicantDeleteSchema, ApplicantPaginationSchema, ApplicantSchema, GetByIdSchema } from '@/types/schema';
import { publicProcedure } from '../trpc';
import { exportTPData } from '@/services/dashboardService';

export const applicantRouter = {
    addApplicant: publicProcedure
        .input(AddApplicantSchema)
        .mutation(async ({ input }) => {
            return addApplicant(input);
        }),
    exportApplicants: publicProcedure.query(async () => {
        return exportAllApplicant()
    }),
    exportTPData: publicProcedure.query(async () => {
        return exportTPData();
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
