ALTER TABLE "users_table" DROP CONSTRAINT "users_table_id_unique";--> statement-breakpoint
ALTER TABLE "resume_table" ALTER COLUMN "id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "users_table" ALTER COLUMN "id" SET DATA TYPE serial;