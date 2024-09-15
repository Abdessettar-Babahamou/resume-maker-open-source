CREATE TABLE IF NOT EXISTS "project_info" (
	"id" varchar PRIMARY KEY NOT NULL,
	"projectTitle" text,
	"organizationName" text,
	"createdDate" date,
	"projectUrl" text,
	"description" text,
	"resume_Id" varchar
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_info" ADD CONSTRAINT "project_info_resume_Id_resumes_id_fk" FOREIGN KEY ("resume_Id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
