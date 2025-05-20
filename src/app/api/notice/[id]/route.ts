import {
  NoticeIDPathParams,
  TGetNoticeResponse,
} from "@/app/api/notice/[id]/validate";
import { TNotificationResponse } from "@/components/utils/api.utils";
import { getDb } from "@/server/db";
import { attachments, notices } from "@/server/model/notice";
import { S3Instance } from "@/server/S3";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

async function getNoticeByIdHandler(req: Request, context: any) {
  try {
    const db = await getDb();
    const result = NoticeIDPathParams.safeParse(context.params);
    if (!result.success) {
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid ID param",
          errors: result.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { id: noticeId } = result.data;

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
        filepath: attachment.filepath,
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
        message: `notice with id (${context.params.id}) unsuccessful due to server error`,
      } as TNotificationResponse,
      {
        status: 500,
      }
    );
  }
}

async function deleteNoticeHandler(req: Request, context: any) {
  try {
    const db = await getDb();
    const result = NoticeIDPathParams.safeParse(context.params);
    if (!result.success) {
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid ID param",
          errors: result.error.flatten(),
        },
        { status: 400 }
      );
    }
    const { id: noticeId } = result.data;
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
    await db.delete(notices).where(eq(notices.id, noticeId));

    const deletedAllAttachmentRef = await db
      .delete(attachments)
      .where(eq(attachments.noticeid, noticeId))
      .returning();

    if (deletedAllAttachmentRef.length > 0) {
      await S3Instance.DeleteFilesByFilePath(
        deletedAllAttachmentRef.map((attachment) => attachment.filepath)
      );
    }

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

export { deleteNoticeHandler as DELETE, getNoticeByIdHandler as GET };
