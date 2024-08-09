import db from '@/db/db';
import { action, applicant, tricycle } from '@/db/schema';
import { deleteTricycleType } from '@/server/controllers/TricycleController';
import { GetAllTricyclesParams, Tricycle, TricycleExportData } from '@/types';
import { asc, desc, eq, ilike, or, sql } from 'drizzle-orm';



export const exportAllTricycles = async (): Promise<TricycleExportData[]> => {
    // Fetch data from the database
    const data: TricycleExportData[] = await db.select({
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
        applicationNo: tricycle.applicantId,
    }).from(tricycle).leftJoin(applicant, eq(tricycle.applicantId, applicant.applicationNo)).orderBy(asc(applicant.applicationDate));

    const processedData: TricycleExportData[] = [];
    const applicantNoCount: { [key: string]: number } = {};
    const applicantNoMap: { [key: string]: TricycleExportData[] } = {};

    for (const item of data) {
        const { applicationNo } = item;
        
        if (!applicantNoCount[applicationNo]) {
            applicantNoCount[applicationNo] = 0;
            applicantNoMap[applicationNo] = [];
        }
        applicantNoCount[applicationNo]++;
        applicantNoMap[applicationNo].push(item);
    }

    for (const [applicationNo, items] of Object.entries(applicantNoMap)) {
        if (applicantNoCount[applicationNo] > 1) {
            items.forEach((item, index) => {
                const letterSuffix = String.fromCharCode(65 + index); 
                const newApplicantionNo = `${applicationNo}-${letterSuffix}`;
                processedData.push({
                    ...item,
                    applicationNo: newApplicantionNo
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



