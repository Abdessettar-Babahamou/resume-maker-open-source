CREATE TABLE IF NOT EXISTS "cv_profile" (
	"id" varchar PRIMARY KEY NOT NULL,
	"fullName" text,
	"emailAddress" text,
	"phoneNumber" text,
	"linkdenUrl" text,
	"personalWeb" text,
	"countriy" text,
	"State" text,
	"City" text,
	"resum_Id" varchar NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cv_profile" ADD CONSTRAINT "cv_profile_resum_Id_resumes_id_fk" FOREIGN KEY ("resum_Id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
