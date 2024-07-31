import db from "@/db/db";
import { applicant, tricycle } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export const getDashboardData = async () => {
    const [totalApplicantsResult, noOfOperatorResult, noOfDriverOperatorResult, totalTricyclesResult] = await db.batch([
        db
            .select({ count: sql<number>`count(*)` })
            .from(applicant),
        db
            .select({ count: sql<number>`count(*)` })
            .from(applicant).where(eq(applicant.applicationType, "Operator")),
        db
            .select({ count: sql<number>`count(*)` })
            .from(applicant).where(eq(applicant.applicationType, "Driver/Operator")),
        db
            .select({ count: sql<number>`count(*)` })
            .from(tricycle)
    ]);

    return {
        totalApplicants: totalApplicantsResult[0]?.count || 0,
        noOfOperator: noOfOperatorResult[0]?.count || 0,
        noOfDriverOperator: noOfDriverOperatorResult[0]?.count || 0,
        totalTricycles: totalTricyclesResult[0]?.count || 0
    }
}


export const getRecentApplicants = async () => {
    return await db
        .select()
        .from(applicant)
        .orderBy(desc(applicant.applicationDate))
        .limit(6);
}