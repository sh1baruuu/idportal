import { decimal, integer, pgEnum, serial, timestamp, varchar } from 'drizzle-orm/pg-core';


const statusEnum = pgEnum('status', ["inProgress", "readyForPrinting", "partiallyPrinted", "issues", "completed", "notStarted"])

const paymentStatusEnum = pgEnum('payment_status', ["notApplicable", "paid", "unpaid"])

export default {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull().unique(),
    status: statusEnum('status').default("notStarted"),
    noOfRegistrants: integer('no_of_registrants').default(0),
    paymentStatus: paymentStatusEnum('payment_status').default("notApplicable"),
    amount: decimal('amount', { precision: 10, scale: 2 }).default('0.00'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$onUpdate(() => new Date()),
}

