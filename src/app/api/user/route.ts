import { TNotificationResponse } from "@/components/utils/api.utils";
import { getDb } from "@/server/db";
import { usersSchema } from "@/server/model";
import { users } from "@/server/model/auth";
import { and, count, desc, eq, gt, inArray, SQL, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

type TUserTableName = "active" | "pending" | "rejected" | "old" | "none";

async function getAllUserHandler(request: Request) {
  // page=2&rows=10
  // parse query params using nextjs 14
  const { searchParams } = new URL(request.url);
  const page = ~~(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";
  const filter =
    (searchParams.get("filter")?.toString() as TUserTableName) ?? "none";
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
    // filters
    let filterArr = [];
    if (search.toString().length > 0) {
      console.log(search.toString(), search.toString().length > 0);

      filterArr.push(
        sql`to_tsvector('english', ${usersSchema.name}) @@ to_tsquery('english', ${search})`
      );
    }
    if (filter.toUpperCase() !== "NONE") {
      let filterSanitized;
      if (filter.toUpperCase() === "OLD") {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        filterArr.push(gt(usersSchema.emailVerified, oneYearAgo));
      } else {
        filterSanitized = filter.toUpperCase() as
          | "ACTIVE"
          | "PENDING"
          | "REJECTED";
        filterArr.push(eq(usersSchema.status, filterSanitized));
      }
    }

    const filterQuery =
      filterArr.length > 0
        ? filterArr.reduce<SQL<unknown>>(
            (acc: SQL<unknown>, curr: SQL<unknown>) =>
              and(acc, curr) as SQL<unknown>,
            sql`TRUE` as SQL<unknown>
          )
        : (sql`TRUE` as SQL<unknown>);

    const countResponse = await await db
      .select({ count: count(usersSchema.id) })
      .from(usersSchema)
      .where(filterQuery);

    if (countResponse[0].count === 0) {
      return NextResponse.json(
        {
          status: "warning",
          message: "no users match the search criteria",
        } as TNotificationResponse,
        {
          status: 500,
        }
      );
    }

    if (
      countResponse[0].count !== 0 &&
      page > Math.ceil(countResponse[0].count / rows)
    ) {
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

    const usersResponse = await db
      .select()
      .from(usersSchema)
      .where(filterQuery)
      .offset((page - 1) * rows)
      .limit(rows)
      .orderBy(desc(usersSchema.email));

    const usrList = usersResponse.map((usr) => {
      delete (usr as any).password;
      return usr;
    });

    return NextResponse.json(
      {
        users: usrList as Array<TUser>,
        totalCount: countResponse[0].count,
      } as TGetAllUsersResponse,
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

async function deleteUserHandler(req: Request) {
  try {
    const reqData = await req.json();

    const parsedData = DeleteUsersRequest.safeParse(reqData);
    if (!parsedData.success) {
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid request data",
        } as TNotificationResponse,
        {
          status: 400,
        }
      );
    }
    const db = await getDb();

    const { userIds } = parsedData.data;
    if (userIds.length !== 0) {
      const deletedUser = await db
        .delete(users)
        .where(inArray(users.id, userIds))
        .returning();

      console.log(`${deletedUser.length} users deleted`);
    }

    return NextResponse.json(
      {
        status: "success",
        message: `users deleted successfully`,
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

export const User = z.object({
  id: z.string().uuid(),
  name: z.string().optional().nullable(),
  email: z.string().email(),
  emailVerifiedAt: z.coerce.date().optional(),
  status: z.enum(["ACTIVE", "PENDING", "REJECTED"]).default("PENDING"),
  image: z.string().optional().nullable(),
  role: z.enum(["ADMIN", "STUDENT"]).default("STUDENT"),
});
export type TUser = z.infer<typeof User>;

export const GetAllUsersResponse = z.object({
  users: z.array(User),
  totalCount: z.number().default(0),
});
export type TGetAllUsersResponse = z.infer<typeof GetAllUsersResponse>;

export const DeleteUsersRequest = z.object({
  userIds: z.array(z.string().uuid()),
});
export type TDeleteUsersRequest = z.infer<typeof DeleteUsersRequest>;

export { deleteUserHandler as DELETE, getAllUserHandler as GET };
