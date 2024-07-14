import db from '@/db/db';
import { applicant } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { z } from 'zod';
import { publicProcedure, router } from './trpc';

const applicantSchema = z.object({
    applicationNo: z.string(),
    applicationType: z.string(),
    fullname: z.string(),
    contactNo: z.string(),
    address: z.string(),
    licenseNo: z.string(),
    applicationDate: z.string(),
});


export const appRouter = router({
    addApplicant: publicProcedure
        .input(applicantSchema)
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

                // await db.insert(tricycle).values({

                // })

                return { success: true };
        }),
    countApplicant: publicProcedure.query(async () => {
        const [{ count }] = await db
            .select({ count: sql<number>`count(*)` })
            .from(applicant);

        return count;
    })

});

export type AppRouter = typeof appRouter;
