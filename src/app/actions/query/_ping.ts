"use server";
import { initializeDb } from "@/server";
import { usersSchema } from "@/server/model";
import { IUser } from "@/server/model/users";
import { eq } from "drizzle-orm";

export const getPing = async (id: number = 0): Promise<IUser | undefined> => {
  const db = await initializeDb();
  const user = await db
    .select()
    .from(usersSchema)
    .where(eq(usersSchema.id, id));

  if (user.length > 0) return user[0];
};
