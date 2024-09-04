ALTER TABLE "notices" ADD COLUMN "content" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "notices" ADD COLUMN "contentHtml" text;--> statement-breakpoint
ALTER TABLE "notices" DROP COLUMN IF EXISTS "body";