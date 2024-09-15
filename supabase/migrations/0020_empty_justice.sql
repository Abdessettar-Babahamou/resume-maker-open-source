CREATE TABLE IF NOT EXISTS "skills" (
	"id" varchar PRIMARY KEY NOT NULL,
	"skillsName" text,
	"description" text,
	"resume_Id" varchar
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skills" ADD CONSTRAINT "skills_resume_Id_resumes_id_fk" FOREIGN KEY ("resume_Id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
