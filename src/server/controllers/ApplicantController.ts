import { addApplicant, addTricycles, countApplicant, deleteApplicant, getAllApplicants } from '@/services/applicantService';

import { z } from 'zod';
import { publicProcedure } from '../trpc';

const capitalizeString = z.string().transform((str) => str.toUpperCase());

const TricycleSchema = z.array(z.object({
    makeOrBrand: capitalizeString,
    engineNo: capitalizeString,
    chassisNo: capitalizeString,
    plateOrStickerNo: capitalizeString,
    driverName: z.string(),
    driverLicenseNo: z.string(),
    applicantId: z.string()
}));

const ApplicantSchema = z.object({
    applicationNo: z.string(),
    applicationType: z.string(),
    fullname: z.string(),
    contactNo: z.string(),
    address: z.string(),
    licenseNo: capitalizeString,
    applicationDate: z.string(),
});

const ApplicantPaginationSchema = z.object({
    search: z.string().nullable(),
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(10),
    filter: z.string(),
    order: z.string(),
});

const ApplicantDeleteSchema = z.object({
    applicantId: z.string()
})

export const applicantRouter = {
    addApplicant: publicProcedure
        .input(ApplicantSchema)
        .mutation(async ({ input }) => {
            return addApplicant(input);
        }),
    addTricycles: publicProcedure
        .input(TricycleSchema)
        .mutation(async ({ input }) => {
            return addTricycles(input);
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
