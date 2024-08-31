CREATE TABLE IF NOT EXISTS "attachment" (
	"fileid" text PRIMARY KEY NOT NULL,
	"noticeid" text NOT NULL,
	"filename" text NOT NULL,
	"filetype" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notices" (
	"id" text PRIMARY KEY NOT NULL,
	"adminEmail" text,
	"isPublished" boolean NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
