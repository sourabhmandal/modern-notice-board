import { NoticeIDPathParams } from "@/app/api/notice/[id]/validate";
import { TNotificationResponse } from "@/components/utils/api.utils";
import { getDb } from "@/server/db";
import { users } from "@/server/model/auth";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

async function updateUserStatusHandler(request: Request, context: any) {
  try {
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
    const { id: userId } = result.data;

    const reqBody = await request.json();

    if (
      reqBody.status === undefined ||
      reqBody.status === null ||
      reqBody.status === ""
    ) {
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid status",
        } as TNotificationResponse,
        {
          status: 400,
        }
      );
    }

    const status = reqBody.status?.toString().toUpperCase() as
      | "ACTIVE"
      | "PENDING"
      | "REJECTED";

    if (userId === "undefined" || userId === "null") {
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

    const db = await getDb();
    const updatedUser = await db
      .update(users)
      .set({ status: status })
      .where(eq(users.id, userId))
      .returning();

    console.log(updatedUser);
    return NextResponse.json(
      {
        status: "success",
        message: `user (${updatedUser[0].email}) updated successfully`,
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

export { updateUserStatusHandler as PUT };
