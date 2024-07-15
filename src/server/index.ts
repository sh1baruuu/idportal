
import db from '@/db/db';
import { applicant } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { tricycle } from './../db/schema';
import { publicProcedure, router } from './trpc';

const capitalizeString = z.string().transform((str) => str.toUpperCase());

const TricycleSchema = z.array(z.object({
    makeOrBrand: capitalizeString,
    engineNo: capitalizeString,
    chassisNo: capitalizeString,
    plateOrStickerNo: capitalizeString,
    driverName: z.string(),
    driverLicenseNo: z.string(),
    applicantId: z.string()
}))

const ApplicantSchema = z.object({
    applicationNo: z.string(),
    applicationType: z.string(),
    fullname: z.string(),
    contactNo: z.string(),
    address: z.string(),
    licenseNo: capitalizeString,
    applicationDate: z.string(),
});

export const appRouter = router({
    addApplicant: publicProcedure
        .input(ApplicantSchema)
        .mutation(async ({ input }) => {
            await db.insert(applicant).values({
                applicationNo: input.applicationNo,
                applicationType: input.applicationType,
                fullname: input.fullname,
                address: input.address,
                contactNo: input.contactNo,
                licenseNo: input.licenseNo,
                applicationDate: JSON.stringify(input.applicationDate)
            })


            return { success: true };
        }),
    addTricycles: publicProcedure.input(TricycleSchema).mutation(async ({ input }) => {
        try {

            if (input.length != 0) await db.insert(tricycle).values(input);
        } catch (error: any) {
            console.log(error.message);

        }
    }),
    countApplicant: publicProcedure.query(async () => {
        const [{ count }] = await db
            .select({ count: sql<number>`count(*)` })
            .from(applicant);

        return count;
    }),
    allApplicants: publicProcedure.query(async () => {
        return await db
            .select({
                applicationNo: applicant.applicationNo, 
                fullname: applicant.fullname,
                address: applicant.address,
                licenseNo: applicant.licenseNo,
                applicationType: applicant.applicationType,
                applicationDate: applicant.applicationDate,
                ownedTricycles: sql<number>`(SELECT count(*) FROM tricycle_tb WHERE applicant_id = ${applicant.applicationNo})`
            })
            .from(applicant)
            .leftJoin(tricycle, eq(applicant.applicationNo, tricycle.applicantId))
            .groupBy(applicant.applicationNo);
    }),
    allTricycles: publicProcedure.query(async () => {
        return await db.select({
            id: tricycle.id,
            makeOrBrand: tricycle.makeOrBrand,
            engineNo: tricycle.engineNo,
            chassisNo: tricycle.chassisNo,
            plateOrStickerNo: tricycle.plateOrStickerNo,
            driverName: tricycle.driverName,
            driverLicenseNo: tricycle.driverLicenseNo,
            operator: sql<string>`(SELECT fullname FROM applicant_tb WHERE application_no = ${tricycle.applicantId} )`
        }).from(tricycle); 
    })

});

export type AppRouter = typeof appRouter;
