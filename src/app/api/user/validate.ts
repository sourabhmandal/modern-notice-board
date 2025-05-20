import { z } from "zod";

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
