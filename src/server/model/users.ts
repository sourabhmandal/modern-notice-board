import { pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoleEnum = pgEnum("role", ["ADMIN", "STUDENT"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role", { enum: userRoleEnum.enumValues })
    .default("STUDENT")
    .notNull(),
});

const userSchema = createSelectSchema(users);
const createUserSchema = createInsertSchema(users);

export type IUser = z.infer<typeof userSchema>;

const CreateUser = createUserSchema.pick({
  id: true,
  name: true,
  role: true,
});

export type ICreateUser = z.infer<typeof CreateUser>;
