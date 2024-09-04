import { TNotificationResponse } from "@/components/utils/api.utils";
import { initializeDb } from "@/server";
import { notices } from "@/server/model/notice";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

async function getAllNoticeHandler(
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
    return NextResponse.json(data as TGetNoticeResponse, {
      status: 200,
    });
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
  content: z.string(),
  contentHtml: z.string().optional(),
  isPublished: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
export type TGetNoticeResponse = z.infer<typeof GetNoticeResponse>;

export { deleteNoticeHandler as DELETE, getAllNoticeHandler as GET };
