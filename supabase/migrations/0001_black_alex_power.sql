CREATE TABLE IF NOT EXISTS "resume_table" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text,
	"user_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resume_table" ADD CONSTRAINT "resume_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
