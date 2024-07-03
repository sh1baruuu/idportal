import { pgTable } from 'drizzle-orm/pg-core';
import barangayTableCols from './tb/barangayTableCols';
import registrantsTableCols from './tb/registrantsTableCols';

// Registrant Table

export const registrantsTable = pgTable('registrants_tb', registrantsTableCols);

export type InsertRegistrant = typeof registrantsTable.$inferInsert;
export type SelectRegistrant = typeof registrantsTable.$inferSelect;



// Barangay Table

export const barangayTable = pgTable('barangays_tb', barangayTableCols);

export type InsertBarangay = typeof barangayTable.$inferInsert;
export type SelectBarangay = typeof barangayTable.$inferSelect;
