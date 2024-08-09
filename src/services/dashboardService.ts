import db from "@/db/db";
import { action, applicant, tricycle } from "@/db/schema";
import { desc, eq, asc, sql } from "drizzle-orm";

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
        .limit(5);
}

export const getRecentActions = async () => {
    return await db
        .select()
        .from(action)
        .orderBy(desc(action.createdAt))
        .limit(5);
}

export const exportTPData = async () => {
    return await db
        .select({
            name: applicant.fullname,
            address: applicant.address,
            licenseNo: applicant.licenseNo,
            applicationType: applicant.applicationType,
            makeOrBrand: tricycle.makeOrBrand,
            engineNo: tricycle.engineNo,
            chassisNo: tricycle.chassisNo,
            plateOrStickerNo: tricycle.plateOrStickerNo,
            diverName: applicant.driverName,
            driverLicenseNo: applicant.driverLicenseNo,
            applicationDate: applicant.applicationDate,
            applicationNo: applicant.applicationNo,
        })
        .from(applicant)
        .leftJoin(tricycle, eq(applicant.applicationNo, tricycle.applicantId))
        .orderBy(asc(applicant.applicationDate));
};