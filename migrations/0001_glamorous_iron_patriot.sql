ALTER TABLE "users_table" ADD COLUMN "emergency_contact_person" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users_table" DROP COLUMN IF EXISTS "emergency_contact_name";