CREATE TABLE IF NOT EXISTS "posts_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"middle_name" text NOT NULL,
	"last_name" text NOT NULL,
	"suffix" text,
	"position" text NOT NULL,
	"date_of_birth" date NOT NULL,
	"gsis_no" text NOT NULL,
	"tin_no" text NOT NULL,
	"contact_no" text NOT NULL,
	"address" text NOT NULL,
	"emergency_contact_name" text NOT NULL,
	"emergency_contact_number" text NOT NULL,
	"signature_url" text NOT NULL,
	"photo_url" text NOT NULL,
	CONSTRAINT "users_table_gsis_no_unique" UNIQUE("gsis_no"),
	CONSTRAINT "users_table_tin_no_unique" UNIQUE("tin_no")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts_table" ADD CONSTRAINT "posts_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
