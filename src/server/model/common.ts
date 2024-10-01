import { pgEnum, pgSchema } from "drizzle-orm/pg-core";

export const projectSchema = pgSchema("template");
export const userRoleEnum = pgEnum("role", ["ADMIN", "STUDENT"]);
export type IUserRoleEnum = (typeof userRoleEnum.enumValues)[number];

export const userStatusEnum = pgEnum("userStatus", [
  "ACTIVE",
  "PENDING",
  "REJECTED",
]);
export const availableIdps = [
  "credentials",
  "google",
  "facebook",
  "github",
  "azure-ad",
];
