import { relations } from "drizzle-orm";
import { boolean, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./auth";

export const attachments = pgTable("attachment", {
  filepath: text("filepath").notNull().primaryKey(),
  filename: text("filename").notNull(),
  noticeid: text("noticeid").notNull(),
  filetype: text("filetype").notNull(),
});
export const insertAttachmentSchema = createInsertSchema(attachments);
export type TInsertAttachmentSchema = z.infer<typeof insertAttachmentSchema>;
export const selectAttachmentSchema = createSelectSchema(attachments);
export type TSelectAttachmentSchema = z.infer<typeof selectAttachmentSchema>;

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
