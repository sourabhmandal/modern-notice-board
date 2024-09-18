import { TNotificationResponse } from "@/components/utils/api.utils";
import { initializeDb } from "@/server";
import { attachments, notices } from "@/server/model/notice";
import {
  DeleteObjectsCommand,
  DeleteObjectsCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";

import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

const s3Client = new S3Client({
  region: process.env.AIT_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AIT_AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AIT_AWS_SECRET_ACCESS_KEY!,
  },
});

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

    return NextResponse.json(
      {
        ...data,
        files: attachmentsData,
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

    const deleteParams: DeleteObjectsCommandInput = {
      Bucket: process.env.AIT_AWS_BUCKET_ID,
      Delete: {
        Objects: allAttachmentsOfNotice.map((key) => ({
          Key: key.filepath,
        })),
      },
    };

    const command = new DeleteObjectsCommand(deleteParams);

    await s3Client.send(command);

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
        filepath: z.string(),
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
