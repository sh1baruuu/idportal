import { date, pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { v4 as uuidv4 } from 'uuid';

export const applicant = pgTable('registrant_tb', {
    applicationNo: uuid('application_no').primaryKey(),
    applicationType: varchar('application_type').notNull(),  // Driver Operator / Operator
    name: varchar('name').notNull(),
    address: varchar('address').notNull(),
    contactNo: varchar('contact_no').notNull(),
    licenseNo: varchar('sss/license_no'),
    applicationDate: date('application_date').notNull(),
});

export const tricycle = pgTable('tricycle_tb', {
    id: uuid('id').default(uuidv4()),
    name: varchar('name').notNull(),
    engineNo: varchar('engine_no').notNull(),
    serialChassisNo: varchar('serial_chassis_no').notNull(),
    plateStickerNo: varchar('plate_sticker_no').notNull(),
    driverName: varchar('driver_name').notNull(),
    driverLicense: varchar('driver_license').notNull(),
    ownerID: uuid('owner_id').references(() => applicant.applicationNo).notNull(),
});






