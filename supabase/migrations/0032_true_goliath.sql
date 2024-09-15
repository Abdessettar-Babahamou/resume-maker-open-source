CREATE TABLE IF NOT EXISTS "languages" (
	"id" varchar PRIMARY KEY NOT NULL,
	"languageName" text NOT NULL,
	"description" text,
	"resume_id" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cv_profile" ALTER COLUMN "emailAddress" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "cv_profile" ALTER COLUMN "phoneNumber" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "cv_profile" ALTER COLUMN "country" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "cv_profile" ALTER COLUMN "jobTitle" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "cv_profile" ALTER COLUMN "resume_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "education_info" ALTER COLUMN "schoolName" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "education_info" ALTER COLUMN "degree" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "education_info" ALTER COLUMN "field_of_study" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "education_info" ALTER COLUMN "startDate" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "education_info" ALTER COLUMN "country" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "education_info" ALTER COLUMN "resume_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "experience_info" ALTER COLUMN "jobTitle" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "experience_info" ALTER COLUMN "employer" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "experience_info" ALTER COLUMN "startDate" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "experience_info" ALTER COLUMN "country" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "experience_info" ALTER COLUMN "resume_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project_info" ALTER COLUMN "projectTitle" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project_info" ALTER COLUMN "organizationName" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project_info" ALTER COLUMN "createdDate" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "project_info" ALTER COLUMN "resume_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "skills" ALTER COLUMN "skillsName" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "skills" ALTER COLUMN "resume_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "training_info" ALTER COLUMN "projectTitle" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "training_info" ALTER COLUMN "organizationName" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "training_info" ALTER COLUMN "createdDate" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "training_info" ALTER COLUMN "resume_id" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "languages" ADD CONSTRAINT "languages_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
