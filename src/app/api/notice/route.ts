import {
  CreateNoticeRequest,
  TGetAllNoticeResponse,
} from "@/app/api/notice/validate";
import { TNotificationResponse } from "@/components/utils/api.utils";
import { getDb } from "@/server/db";
import { notices } from "@/server/model/notice";
import { count, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

async function createNoticeHandler(request: Request) {
  try {
    const reqData = await request.json();
    const validatedFields = CreateNoticeRequest.safeParse(reqData);
    if (!validatedFields.success) {
      console.error(
        "Invalid fields while validating request:",
        validatedFields.error.message
      );
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid fields",
        } as TNotificationResponse,
        {
          status: 400,
        }
      );
    }

    // create notice in db
    const db = await getDb();
    const savedNotice = await db
      .insert(notices)
      .values({
        id: validatedFields.data.id,
        title: validatedFields.data.title,
        isPublished: validatedFields.data.isPublished,
        content: validatedFields.data.content,
        contentHtml: validatedFields.data.contentHtml,
        adminEmail: validatedFields.data.adminEmail,
      })
      .onConflictDoUpdate({
        set: {
          title: validatedFields.data.title,
          isPublished: validatedFields.data.isPublished,
          content: validatedFields.data.content,
          contentHtml: validatedFields.data.contentHtml,
          adminEmail: validatedFields.data.adminEmail,
          updatedAt: new Date(),
        },
        target: [notices.id],
      })
      .returning();

    return NextResponse.json(
      {
        status: "success",
        message: "notice created successfully",
      } as TNotificationResponse,
      {
        status: 200,
      }
    );
  } catch (e) {
    console.log(e);
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

async function getAllNoticeHandler(request: Request) {
  // page=2&rows=10
  // parse query params using nextjs 14
  const { searchParams } = new URL(request.url);
  const page = ~~(searchParams.get("page") ?? "1"); // Example: /api/notices?id=123
  const rows = 10;

  if (page < 1) {
    return NextResponse.json(
      {
        status: "error",
        message: "wrong page number or rows number",
      } as TNotificationResponse,
      {
        status: 500,
      }
    );
  }
  try {
    const db = await getDb();
    const countData = await db
      .select({ count: count(notices.id) })
      .from(notices);

    if (page > Math.ceil(countData[0].count / rows)) {
      return NextResponse.json(
        {
          status: "error",
          message: "page number exceeds total pages, please try again",
        } as TNotificationResponse,
        {
          status: 500,
        }
      );
    }
    const data = await db
      .select()
      .from(notices)
      .offset((page - 1) * rows)
      .limit(rows)
      .orderBy(desc(notices.createdAt));

    return NextResponse.json(
      {
        notices: data,
        totalCount: countData[0].count,
      } as TGetAllNoticeResponse,
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        status: "error",
        message: `unable to get notices due to server error`,
      } as TNotificationResponse,
      {
        status: 500,
      }
    );
  }
}

export { getAllNoticeHandler as GET, createNoticeHandler as POST };
