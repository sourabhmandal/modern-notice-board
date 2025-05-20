import { GetNoticeResponse } from "@/app/api/notice/[id]/validate";
import { z } from "zod";

export const CreateNoticeRequest = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  contentHtml: z.string().optional(),
  isPublished: z.boolean(),
  adminEmail: z.string().email(),
});
export type TCreateNoticeRequest = z.infer<typeof CreateNoticeRequest>;

export const GetAllNoticeResponse = z.object({
  notices: z.array(GetNoticeResponse),
  totalCount: z.number().default(0),
});
export type TGetAllNoticeResponse = z.infer<typeof GetAllNoticeResponse>;
