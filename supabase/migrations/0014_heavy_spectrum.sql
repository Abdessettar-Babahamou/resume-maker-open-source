CREATE TABLE IF NOT EXISTS "educations_info" (
	"id" varchar PRIMARY KEY NOT NULL,
	"schoolName" text,
	"degree" text,
	"filedStduy" text,
	"startDate" date,
	"endDate" date,
	"resum_Id" varchar
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "educations_info" ADD CONSTRAINT "educations_info_resum_Id_resumes_id_fk" FOREIGN KEY ("resum_Id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
