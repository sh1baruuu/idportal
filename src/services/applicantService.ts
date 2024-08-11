import db from '@/db/db';
import { action, applicant, tricycle } from '@/db/schema';
import { AddApplicant, Applicant, ApplicantDelete, GetAllApplicantsParams } from '@/types';
import { and, asc, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { BatchItem } from 'drizzle-orm/batch';

export const addApplicant = async (input: AddApplicant) => {
    const { applicant: app, tricycle: tri } = input;

    const applicantInsertQuery = db.insert(applicant).values({
        applicationNo: app.applicationNo,
        applicationType: app.applicationType,
        fullname: app.fullname,
        address: app.address,
        contactNo: app.contactNo,
        licenseNo: app.licenseNo,
        applicationDate: JSON.stringify(app.applicationDate),
        driverName: app.driverName,
        driverLicenseNo: app.driverLicenseNo,
    }).returning();

    const addActionQuery = db.insert(action).values({
        name: app.fullname,
        category: "Applicant",
        action: "INSERT"
    })


    let query: [BatchItem<"pg">, ...BatchItem<"pg">[]] = [applicantInsertQuery, addActionQuery];

    if (tri && tri.length > 0) {
        const tricycleInsertQuery = db.insert(tricycle).values(tri);
        query.push(tricycleInsertQuery);
    }

    try {
        console.log(query);

        const response = await db.batch(query);
        return response;
    } catch (error) {
        console.error("Error adding applicant and tricycle:", error);
        throw new Error("Failed to add applicant and tricycle.");
    }
};

export const updateApplicant = async (input: Applicant) => {
    const [updateResult] = await db.batch([db.update(applicant).set({
        applicationType: input.applicationType,
        fullname: input.fullname,
        address: input.address,
        contactNo: input.contactNo,
        licenseNo: input.licenseNo,
        applicationDate: JSON.stringify(input.applicationDate),
        driverName: input.driverName,
        driverLicenseNo: input.driverLicenseNo,
    }).where(eq(applicant.applicationNo, input.applicationNo)).returning({ updatedId: applicant.applicationNo }),
    db.insert(action).values({
        name: input.fullname,
        category: "Applicant",
        action: "UPDATE"
    })
    ]);

    return updateResult;
};

export const getApplicantById = async (applicantNo: string) => {
    const data = await db.select().from(applicant).where(eq(applicant.applicationNo, applicantNo));

    if (data.length > 0) {

        return {
            exists: true,
            ...data[0],
        };
    }

    return { exists: false };
};

export const viewApplicantById = async (applicantNo: string) => {
    const data = await db.select().from(applicant).where(eq(applicant.applicationNo, applicantNo));

    return { ...data[0] }
};

export const countApplicant = async () => {
    const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(applicant);

    return count;
};

export const exportAllApplicant = async () => {
    return await db
        .select({
            name: applicant.fullname,
            address: applicant.address,
            licenseNo: applicant.licenseNo,
            applicationType: applicant.applicationType,
            diverName: applicant.driverName,
            driverLicenseNo: applicant.driverLicenseNo,
            ownedTricycles: sql<number>`(SELECT count(*) FROM tricycle_tb WHERE applicant_id = ${applicant.applicationNo})`,
            applicationDate: applicant.applicationDate,
            applicationNo: applicant.applicationNo,
        })
        .from(applicant)
        .leftJoin(tricycle, eq(applicant.applicationNo, tricycle.applicantId))
        .groupBy(applicant.applicationNo).orderBy(asc(applicant.applicationDate));
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

export const deleteApplicant = async ({ applicantId, fullname }: ApplicantDelete) => {
    const response = await db.batch([
        db.delete(tricycle).where(eq(tricycle.applicantId, applicantId)),
        db.delete(applicant).where(eq(applicant.applicationNo, applicantId)).returning({ id: applicant.applicationNo }),
        db.insert(action).values({
            name: fullname,
            category: "Applicant",
            action: "DELETE"
        })
    ])

    return response;
};