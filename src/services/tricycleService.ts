import db from '@/db/db';
import { tricycle } from '@/db/schema';
import { FilterParams, GetAllTricyclesParams } from '@/types';
import { and, asc, desc, ilike, or, sql } from 'drizzle-orm';
import { z } from 'zod';



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
            ilike(tricycle.driverLicenseNo, `%${search}%`),
            ilike(tricycle.driverName, `%${search}%`)
        );
    }

    const query = db.select({
        id: tricycle.id,
        makeOrBrand: tricycle.makeOrBrand,
        engineNo: tricycle.engineNo,
        chassisNo: tricycle.chassisNo,
        plateOrStickerNo: tricycle.plateOrStickerNo,
        driverName: tricycle.driverName,
        driverLicenseNo: tricycle.driverLicenseNo,
        operator: sql<string>`(SELECT fullname FROM applicant_tb WHERE application_no = ${tricycle.applicantId})`
    }).from(tricycle).where(whereClause);

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
