"use server";
import { initializeDb } from "@/server";
import { ICreateUser, IUser, users } from "@/server/model/users";

export const postPing = async (
  data: ICreateUser
): Promise<IUser | undefined> => {
  const db = await initializeDb();
  const user = await db.insert(users).values(data).returning();
  if (user.length > 0) return user[0];
};
