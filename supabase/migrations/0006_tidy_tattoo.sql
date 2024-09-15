ALTER TABLE "resume_table" DROP CONSTRAINT "resume_table_user_id_users_table_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resume_table" ADD CONSTRAINT "resume_table_user_id_users_table_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
