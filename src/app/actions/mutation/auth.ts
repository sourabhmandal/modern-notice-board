"use server";

import { getDb } from "@/server/db";
import { accounts, users } from "@/server/model/auth";
import { availableIdps } from "@/server/model/common";
import bcrypt from "bcryptjs";
import { and, eq } from "drizzle-orm";
import { AuthError } from "next-auth";
import { z } from "zod";

const RegisterRequest = z.object({
  fullName: z.string(),
  email: z.string(),
  password: z.string(),
  provider: z.enum([availableIdps[0], ...availableIdps.slice(1)]),
  type: z.enum(["email", "oidc", "oauth", "webauthn"]),
});
type TRegisterRequest = z.infer<typeof RegisterRequest>;

export async function registerUser(
  newuser: TRegisterRequest
): Promise<TRegisterResponse | undefined> {
  try {
    const validatedFields = RegisterRequest.safeParse(newuser);
    if (!validatedFields.success) {
      console.error(
        "Invalid fields while validating request:",
        validatedFields.error.message
      );
      throw new Error("Invalid fields");
    }

    const data = await checkAndRegisterNewUserWithAccount(validatedFields.data);
    if (data.status === "error") {
      return data as TRegisterResponse;
    } else if (data.status === "success") {
      return {
        status: "success",
        message: "User account created successfully",
      } as TRegisterResponse;
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          console.error("CredentialsSignin:", error);
          return {
            status: "error",
            message: "Invalid credentials",
          };
        default:
          console.error("AuthError:", error);
          return {
            status: "error",
            message: "Oops! something went wrong in signin",
          };
      }
    }
    console.error("Error registering user:", error);
    return {
      status: "error",
      message: "Error registering user",
    } as TRegisterResponse;
  }
}

export async function checkAndRegisterNewUserWithAccount(
  data: TRegisterRequest
): Promise<TRegisterResponse> {
  try {
    const db = await getDb();
    let user = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .then((res) => res[0]);
    let shouldCreateUser = user ? false : true;
    let shouldCreateAccount = false;

    if (!shouldCreateUser) {
      // check if user account exists
      const userAccount = await db.query.accounts.findFirst({
        where: and(eq(accounts.userId, user.id)),
      });
      console.log("User account:");

      if (userAccount) {
        console.log("User account found:");

        return {
          status: "error",
          message: "User account already exists",
        } as TRegisterResponse;
      } else {
        shouldCreateAccount = true;
      }
    } else {
      // No user found, so this is their first attempt to login
      // meaning this is also the place you could do registration
      const newUser = await db
        .insert(users)
        .values({
          email: data.email,
          password: data.password
            ? await saltAndHashPassword(data.password)
            : null,
          status: "PENDING",
        })
        .returning({
          id: users.id,
          email: users.email,
          status: users.status,
          password: users.password,
          name: users.name,
          image: users.image,
          emailVerified: users.emailVerified,
          role: users.role,
        })
        .then((res) => res[0]);

      if (newUser) {
        user = newUser;
        shouldCreateAccount = true;
      }
    }

    if (shouldCreateAccount && user) {
      // create a new account for the user
      await db
        .insert(accounts)
        .values({
          userId: user.id,
          provider: data.provider,
          providerAccountId: user.id,
          type: data.type,
        })
        .returning({
          userId: accounts.userId,
          type: accounts.type,
          provider: accounts.provider,
          providerAccountId: accounts.providerAccountId,
          refresh_token: accounts.refresh_token,
          access_token: accounts.access_token,
          expires_at: accounts.expires_at,
          token_type: accounts.token_type,
          scope: accounts.scope,
          id_token: accounts.id_token,
          session_state: accounts.session_state,
        });
    }

    return {
      status: "success",
      message: "User account created successfully",
    } as TRegisterResponse;
  } catch (err) {
    throw err;
  }
}

// helpers
const saltAndHashPassword = async (password: string): Promise<string> => {
  try {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  } catch (err) {
    console.error("Error hashing password:", err);
    throw err;
  }
};

const registerResponse = z.object({
  status: z.enum(["success", "error"]),
  message: z.string(),
});
type TRegisterResponse = z.infer<typeof registerResponse>;
