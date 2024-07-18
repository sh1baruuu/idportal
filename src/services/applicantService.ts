import db from '@/db/db';
import { applicant, tricycle } from '@/db/schema';
import { AddApplicant } from '@/server/controllers/ApplicantController';
import { GetAllApplicantsParams } from '@/types';
import { and, asc, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { BatchItem } from 'drizzle-orm/batch';

export const addApplicant = async (input: AddApplicant) => {
    const { applicant: app, tricycle: tri } = input;

    const applicantInsertQuery = db.insert(applicant).values({
        ...app,
        applicationDate: JSON.stringify(app.applicationDate)
    }).returning();

    const tricycleInsertQuery = db.insert(tricycle).values(tri);

    let query: [BatchItem<"pg">, ...BatchItem<"pg">[]] = [applicantInsertQuery];


    if (tri.length > 0) {
        query.push(tricycleInsertQuery);
    }

    const response = await db.batch(query);

    return response;
};

export const countApplicant = async () => {
    const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(applicant);

    return count;
};


export const getAllApplicants = async ({ page, pageSize, filter, order, search }: GetAllApplicantsParams) => {
    const offset = (page - 1) * pageSize;

    let whereClause = filter !== 'All'
        ? eq(applicant.applicationType, filter)
        : or(eq(applicant.applicationType, "Operator"), eq(applicant.applicationType, "Driver/Operator"));

    let orderByClause;

    if (order) {
        orderByClause = order === "ASC" ? asc(applicant.fullname) : desc(applicant.fullname);
    }

    if (search) {
        const searchClause = or(
            ilike(applicant.fullname, `%${search}%`),
            ilike(applicant.licenseNo, `%${search}%`)
        );
        whereClause = and(whereClause, searchClause);
    }

    let query = db
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
        .where(whereClause)
        .leftJoin(tricycle, eq(applicant.applicationNo, tricycle.applicantId))
        .groupBy(applicant.applicationNo);

    if (orderByClause) {
        query.orderBy(orderByClause);
    }

    const applicants = await query.limit(pageSize).offset(offset);

    const totalApplicants = await db
        .select({ count: sql<number>`count(*)` })
        .from(applicant)
        .where(whereClause)
        .then(([{ count }]) => count);

    const totalPages = Math.ceil(totalApplicants / pageSize);

    return {
        applicants,
        total: totalApplicants,
        page,
        pageSize,
        totalPages,
        isFirstPage: page === 1,
        hasNextPage: page < totalPages,
    };
};


export const deleteApplicant = async (applicantId: string) => {
    const response = await db.batch([
        db.delete(tricycle).where(eq(tricycle.applicantId, applicantId)),
        db.delete(applicant).where(eq(applicant.applicationNo, applicantId)).returning({ id: applicant.applicationNo }),
    ])

    return response;
}