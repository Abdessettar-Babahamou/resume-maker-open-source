CREATE TABLE IF NOT EXISTS "experinece_info" (
	"id" varchar PRIMARY KEY NOT NULL,
	"jobTitle" text,
	"employer" text,
	"startDate" date,
	"endDate" date,
	"countriy" text,
	"State" text,
	"description" text,
	"resum_Id" varchar
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "experinece_info" ADD CONSTRAINT "experinece_info_resum_Id_resumes_id_fk" FOREIGN KEY ("resum_Id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
