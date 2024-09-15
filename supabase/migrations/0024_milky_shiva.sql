CREATE TABLE IF NOT EXISTS "certficates_info" (
	"id" varchar PRIMARY KEY NOT NULL,
	"certficateName" text,
	"issuedBy" text,
	"startDate" date,
	"description" text,
	"resume_Id" varchar
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "certficates_info" ADD CONSTRAINT "certficates_info_resume_Id_resumes_id_fk" FOREIGN KEY ("resume_Id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
