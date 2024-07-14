CREATE TABLE IF NOT EXISTS "applicant_tb" (
	"application_no" varchar PRIMARY KEY NOT NULL,
	"application_type" varchar NOT NULL,
	"fullname" varchar NOT NULL,
	"address" varchar NOT NULL,
	"contact_no" varchar NOT NULL,
	"sss/license_no" varchar,
	"application_date" date NOT NULL,
	CONSTRAINT "applicant_tb_sss/license_no_unique" UNIQUE("sss/license_no")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tricycle_tb" (
	"id" serial PRIMARY KEY NOT NULL,
	"make_or_brand" varchar NOT NULL,
	"engine_no" varchar NOT NULL,
	"chassis_no" varchar NOT NULL,
	"plate_sticker_no" varchar NOT NULL,
	"driver_name" varchar NOT NULL,
	"driver_license_no" varchar NOT NULL,
	"applicant_id" varchar NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tricycle_tb" ADD CONSTRAINT "tricycle_tb_applicant_id_applicant_tb_application_no_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."applicant_tb"("application_no") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
