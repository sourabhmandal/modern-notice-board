import { TNotificationResponse } from "@/components/utils/api.utils";
import { initializeDb } from "@/server";
import { attachments, notices } from "@/server/model/notice";
import { S3Instance } from "@/server/S3";

import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

async function getNoticeByIdHandler(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: noticeId } = params;
    if (noticeId === "undefined" || noticeId === "null") {
      console.log("NOTICE ID :: ", noticeId);
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid notice id",
        } as TNotificationResponse,
        {
          status: 400,
        }
      );
    }
    const db = await initializeDb();
    const data = await db.query.notices.findFirst({
      where: eq(notices.id, noticeId),
      columns: {
        id: true,
        title: true,
        adminEmail: true,
        content: true,
        contentHtml: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const attachmentsData = await db
      .select()
      .from(attachments)
      .where(eq(attachments.noticeid, noticeId));

    const attachmentsResponse = await Promise.allSettled(
      attachmentsData.map(async (attachment) => ({
        filename: attachment.filename,
        download: await S3Instance.getDownloadUrl(attachment.filepath),
        noticeid: attachment.noticeid,
        filetype: attachment.filetype,
      }))
    );

    const attachmentsResponseData = attachmentsResponse
      .filter((attachment) => attachment.status === "fulfilled")
      .map((attachment) => attachment.value);
    return NextResponse.json(
      {
        ...data,
        files: attachmentsResponseData,
      } as TGetNoticeResponse,
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        status: "error",
        message: `notice with id (${params.id}) unsuccessful due to server error`,
      } as TNotificationResponse,
      {
        status: 500,
      }
    );
  }
}

async function deleteNoticeHandler(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: noticeId } = params;
    if (noticeId === "undefined" || noticeId === "null") {
      console.log("NOTICE ID :: ", noticeId);
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid notice id",
        } as TNotificationResponse,
        {
          status: 400,
        }
      );
    }
    const db = await initializeDb();
    await db.delete(notices).where(eq(notices.id, noticeId));

    const allAttachmentsOfNotice = await db
      .select()
      .from(attachments)
      .where(eq(attachments.noticeid, noticeId));

    await S3Instance.DeleteFileByFilePath(
      allAttachmentsOfNotice.map((attachment) => attachment.filepath)
    );

    const deletedAllAttachmentRef = await db
      .delete(attachments)
      .where(eq(attachments.noticeid, noticeId))
      .returning();

    return NextResponse.json(
      {
        status: "success",
        message: "notice deleted successfully",
      } as TNotificationResponse,
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        status: "error",
        message: "notice created unsuccessful due to server error",
      } as TNotificationResponse,
      {
        status: 500,
      }
    );
  }
}

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
        noticeid: z.string(),
        filetype: z.string(),
      })
    )
    .default([]),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type TGetNoticeResponse = z.infer<typeof GetNoticeResponse>;

export { deleteNoticeHandler as DELETE, getNoticeByIdHandler as GET };
