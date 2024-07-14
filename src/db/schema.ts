
import { date, pgTable, serial, uuid, varchar } from 'drizzle-orm/pg-core';


export const applicant = pgTable('applicant_tb', {
    applicationNo: varchar('application_no').primaryKey(),
    applicationType: varchar('application_type').notNull(), 
    fullname: varchar('fullname').notNull(),
    address: varchar('address').notNull(),
    contactNo: varchar('contact_no').notNull(),
    licenseNo: varchar('sss/license_no').unique(),
    applicationDate: date('application_date').notNull(),
});

export const tricycle = pgTable('tricycle_tb', {
    id: serial('id').primaryKey(),
    makeOrBrand: varchar('make_or_brand').notNull(),
    engineNo: varchar('engine_no').notNull(),
    chassisNo: varchar('chassis_no').notNull(),
    plateStickerNo: varchar('plate_sticker_no').notNull(),
    driverName: varchar('driver_name').notNull(),
    driverLicenseNo: varchar('driver_license_no').notNull(),
    applicantID: varchar('applicant_id').references(() => applicant.applicationNo).notNull(),
});






