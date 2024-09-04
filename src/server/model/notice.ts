import { relations } from "drizzle-orm";
import { boolean, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "./auth";

export const attachments = pgTable("attachment", {
  fileid: text("fileid").primaryKey(),
  noticeid: text("noticeid").notNull(),
  filename: text("filename").notNull(),
  filetype: text("filetype").notNull(),
});
export const insertAttachmentSchema = createInsertSchema(attachments);
export const selectAttachmentSchema = createSelectSchema(attachments);

export const notices = pgTable("notices", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  adminEmail: text("adminEmail"),
  isPublished: boolean("isPublished").notNull(),
  title: text("title").notNull(),
  content: jsonb("content").notNull(),
  contentHtml: text("contentHtml"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow(),
});
export const noticesRelations = relations(notices, ({ one }) => ({
  adminEmailFk: one(users, {
    fields: [notices.adminEmail],
    references: [users.email],
  }),
}));
export const insertNoticeSchema = createInsertSchema(notices);
export const selectNoticeSchema = createSelectSchema(notices);
