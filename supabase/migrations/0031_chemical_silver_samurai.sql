ALTER TABLE "certficates_info" RENAME TO "certificate_info";--> statement-breakpoint
ALTER TABLE "educations_info" RENAME TO "education_info";--> statement-breakpoint
ALTER TABLE "experinece_info" RENAME TO "experience_info";--> statement-breakpoint
ALTER TABLE "certificate_info" RENAME COLUMN "certficateName" TO "certificate_name";--> statement-breakpoint
ALTER TABLE "certificate_info" RENAME COLUMN "resume_Id" TO "resume_id";--> statement-breakpoint
ALTER TABLE "cv_profile" RENAME COLUMN "countriy" TO "country";--> statement-breakpoint
ALTER TABLE "cv_profile" RENAME COLUMN "State" TO "state";--> statement-breakpoint
ALTER TABLE "cv_profile" RENAME COLUMN "City" TO "city";--> statement-breakpoint
ALTER TABLE "cv_profile" RENAME COLUMN "resum_Id" TO "resume_id";--> statement-breakpoint
ALTER TABLE "education_info" RENAME COLUMN "filedStduy" TO "field_of_study";--> statement-breakpoint
ALTER TABLE "education_info" RENAME COLUMN "countriy" TO "country";--> statement-breakpoint
ALTER TABLE "education_info" RENAME COLUMN "State" TO "state";--> statement-breakpoint
ALTER TABLE "education_info" RENAME COLUMN "resum_Id" TO "resume_id";--> statement-breakpoint
ALTER TABLE "experience_info" RENAME COLUMN "countriy" TO "country";--> statement-breakpoint
ALTER TABLE "experience_info" RENAME COLUMN "State" TO "state";--> statement-breakpoint
ALTER TABLE "experience_info" RENAME COLUMN "resum_Id" TO "resume_id";--> statement-breakpoint
ALTER TABLE "project_info" RENAME COLUMN "resume_Id" TO "resume_id";--> statement-breakpoint
ALTER TABLE "skills" RENAME COLUMN "resume_Id" TO "resume_id";--> statement-breakpoint
ALTER TABLE "training_info" RENAME COLUMN "resume_Id" TO "resume_id";--> statement-breakpoint
ALTER TABLE "certificate_info" DROP CONSTRAINT "certficates_info_resume_Id_resumes_id_fk";
--> statement-breakpoint
ALTER TABLE "cv_profile" DROP CONSTRAINT "cv_profile_resum_Id_resumes_id_fk";
--> statement-breakpoint
ALTER TABLE "education_info" DROP CONSTRAINT "educations_info_resum_Id_resumes_id_fk";
--> statement-breakpoint
ALTER TABLE "experience_info" DROP CONSTRAINT "experinece_info_resum_Id_resumes_id_fk";
--> statement-breakpoint
ALTER TABLE "project_info" DROP CONSTRAINT "project_info_resume_Id_resumes_id_fk";
--> statement-breakpoint
ALTER TABLE "skills" DROP CONSTRAINT "skills_resume_Id_resumes_id_fk";
--> statement-breakpoint
ALTER TABLE "training_info" DROP CONSTRAINT "training_info_resume_Id_resumes_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "certificate_info" ADD CONSTRAINT "certificate_info_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cv_profile" ADD CONSTRAINT "cv_profile_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "education_info" ADD CONSTRAINT "education_info_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "experience_info" ADD CONSTRAINT "experience_info_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_info" ADD CONSTRAINT "project_info_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skills" ADD CONSTRAINT "skills_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "training_info" ADD CONSTRAINT "training_info_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
