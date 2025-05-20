import { z } from "zod";

export const GetNoticeResponse = z.object({
  id: z.string().uuid(),
  title: z.string(),
  adminEmail: z.string().email(),
  content: z.coerce.string(),
  contentHtml: z.coerce.string().optional(),
  isPublished: z.boolean(),
  files: z
    .array(
      z.object({
        filename: z.string(),
        download: z.string(),
        filepath: z.string(),
        filetype: z.string(),
      })
    )
    .default([]),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type TGetNoticeResponse = z.infer<typeof GetNoticeResponse>;

export const NoticeIDPathParams = z.object({
  id: z.string(),
});
export type TNoticeIDPathParams = z.infer<typeof NoticeIDPathParams>;