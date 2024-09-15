ALTER TABLE "resume_table" RENAME TO "resumes";--> statement-breakpoint
ALTER TABLE "users_table" RENAME TO "users";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_table_email_unique";--> statement-breakpoint
ALTER TABLE "resumes" DROP CONSTRAINT "resume_table_user_id_users_table_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");