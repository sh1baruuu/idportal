import { date, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';


export default {
    id: serial('id').primaryKey(),
    firstName: varchar('first_name').notNull(),
    middleName: varchar('middle_name').notNull(),
    lastName: varchar('last_name').notNull(),
    suffix: varchar('suffix'),
    position: varchar('position').notNull(),
    dateOfBirth: date('date_of_birth').notNull(),
    gsisNo: varchar('gsis_no').notNull().unique(),
    tinNo: varchar('tin_no').notNull().unique(),
    contactNo: varchar('contact_no').notNull(),
    address: varchar('address').notNull(),
    emergencyContactPerson: varchar('emergency_contact_person').notNull(),
    emergencyContactNumber: varchar('emergency_contact_number').notNull(),
    signatureUrl: varchar('signature_url').notNull(),
    photoUrl: varchar('photo_url').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$onUpdate(() => new Date()),
}