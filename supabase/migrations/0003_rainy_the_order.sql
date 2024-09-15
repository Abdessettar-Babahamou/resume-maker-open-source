ALTER TABLE "resume_table" ALTER COLUMN "user_id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "resume_table" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users_table" ALTER COLUMN "id" SET DATA TYPE varchar;