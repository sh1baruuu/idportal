import db from '@/db/db';
import { applicant, tricycle } from '@/db/schema';
import { deleteTricycleType } from '@/server/controllers/TricycleController';
import { GetAllTricyclesParams, Tricycles } from '@/types';
import { asc, desc, eq, ilike, or, sql } from 'drizzle-orm';




const getAllTricycles = async ({ page, pageSize, order, search }: GetAllTricyclesParams) => {
    const offset = (page - 1) * pageSize;

    let whereClause;
    let orderByClause;

    if (order) {
        orderByClause = order === "ASC" ? asc(tricycle.makeOrBrand) : desc(tricycle.makeOrBrand);
    }

    if (search) {
        whereClause = or(
            ilike(tricycle.makeOrBrand, `%${search}%`),
            ilike(tricycle.chassisNo, `%${search}%`),
            ilike(tricycle.engineNo, `%${search}%`),
            ilike(tricycle.plateOrStickerNo, `%${search}%`),
            // ilike(tricycle.driverLicenseNo, `%${search}%`),
            // ilike(tricycle.driverName, `%${search}%`)
        );
    }

    const query = db.select({
        id: tricycle.id,
        makeOrBrand: tricycle.makeOrBrand,
        engineNo: tricycle.engineNo,
        chassisNo: tricycle.chassisNo,
        plateOrStickerNo: tricycle.plateOrStickerNo,
        driverName: applicant.driverName,
        driverLicenseNo: applicant.driverLicenseNo,
        applicantId: tricycle.applicantId,
        operator: sql<string>`(SELECT fullname FROM applicant_tb WHERE application_no = ${tricycle.applicantId})`
    }).from(tricycle).where(whereClause).leftJoin(applicant, eq(tricycle.applicantId, applicant.applicationNo))

    if (orderByClause) {
        query.orderBy(orderByClause);
    }

    const tricycles = await query.limit(pageSize).offset(offset);

    const totalTricycles = await db
        .select({ count: sql<number>`count(*)` })
        .from(tricycle)
        .where(whereClause)
        .then(([{ count }]) => count);

    const totalPages = Math.ceil(totalTricycles / pageSize);

    return {
        tricycles,
        total: totalTricycles,
        page,
        pageSize,
        totalPages,
        isFirstPage: page === 1,
        hasNextPage: page < totalPages,
    };
};

const deleteTricycleByApplicantId = async (input: deleteTricycleType) => {
    const { plateNo } = input;
    return await db.delete(tricycle).where(eq(tricycle.plateOrStickerNo, plateNo)).returning({ plateNo: tricycle.plateOrStickerNo })
}



export { deleteTricycleByApplicantId, getAllTricycles };
