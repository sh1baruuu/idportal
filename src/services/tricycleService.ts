import db from '@/db/db';
import { action, applicant, tricycle } from '@/db/schema';
import { deleteTricycleType } from '@/server/controllers/TricycleController';
import { GetAllTricyclesParams, Tricycle } from '@/types';
import { asc, desc, eq, ilike, or, sql } from 'drizzle-orm';

interface TricycleData {
    applicantionNo: string;
    operator: string;
    licenseNo: string | null;
    address: string | null;
    makeOrBrand: string;
    engineNo: string;
    chassisNo: string;
    plateOrStickerNo: string;
    driverName: string | null;
    driverLicenseNo: string | null;
    applicationDate: string | null;
}


export const exportAllTricycles = async (): Promise<TricycleData[]> => {
    // Fetch data from the database
    const data: TricycleData[] = await db.select({
        operator: sql<string>`(SELECT fullname FROM applicant_tb WHERE application_no = ${tricycle.applicantId})`,
        licenseNo: applicant.licenseNo,
        address: applicant.address,
        makeOrBrand: tricycle.makeOrBrand,
        engineNo: tricycle.engineNo,
        chassisNo: tricycle.chassisNo,
        plateOrStickerNo: tricycle.plateOrStickerNo,
        driverName: applicant.driverName,
        driverLicenseNo: applicant.driverLicenseNo,
        applicationDate: applicant.applicationDate,
        applicantionNo: tricycle.applicantId,
    }).from(tricycle).leftJoin(applicant, eq(tricycle.applicantId, applicant.applicationNo)).orderBy(asc(applicant.applicationDate));

    const processedData: TricycleData[] = [];
    const applicantNoCount: { [key: string]: number } = {};
    const applicantNoMap: { [key: string]: TricycleData[] } = {};

    for (const item of data) {
        const { applicantionNo } = item;
        
        if (!applicantNoCount[applicantionNo]) {
            applicantNoCount[applicantionNo] = 0;
            applicantNoMap[applicantionNo] = [];
        }
        applicantNoCount[applicantionNo]++;
        applicantNoMap[applicantionNo].push(item);
    }

    for (const [applicantionNo, items] of Object.entries(applicantNoMap)) {
        if (applicantNoCount[applicantionNo] > 1) {
            items.forEach((item, index) => {
                const letterSuffix = String.fromCharCode(65 + index); 
                const newApplicantionNo = `${applicantionNo}-${letterSuffix}`;
                processedData.push({
                    ...item,
                    applicantionNo: newApplicantionNo
                });
            });
        } else {
            processedData.push(...items);
        }
    }

    return processedData;
};
export const getAllTricycles = async ({ page, pageSize, order, search }: GetAllTricyclesParams) => {
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
            ilike(applicant.driverLicenseNo, `%${search}%`),
            ilike(applicant.driverName, `%${search}%`)
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

export const deleteTricycleById = async (input: deleteTricycleType) => {
    const { plateNo } = input;
    const [ deleteResult ] = await db.batch([db.delete(tricycle).where(eq(tricycle.plateOrStickerNo, plateNo)).returning({ plateNo: tricycle.plateOrStickerNo }),
        db.insert(action).values({
            name: plateNo,
            category: "Tricycle",
            action: "DELETE"
        })
    ])

    return deleteResult;
}

export const getTricycleById = async (applicantNo: string) => {
    return await db.select().from(tricycle).where(eq(tricycle.applicantId, applicantNo));
}

export const addTricycle = async (input: Tricycle) => {
    const [ insertResult ] = await db.batch([
        db.insert(tricycle).values(input).returning({ plateNo: tricycle.plateOrStickerNo}),
        db.insert(action).values({
            name: input.plateOrStickerNo,
            category: "Tricycle",
            action: "INSERT"
        })
    ])

    return insertResult;
}



