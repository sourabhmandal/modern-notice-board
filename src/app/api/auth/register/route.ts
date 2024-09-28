import db from "@/server";
import { accounts, users } from "@/server/model/auth";
import { availableIdps } from "@/server/model/common";
import bcrypt from "bcryptjs";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const RegisterRequest = z.object({
  fullName: z.string().nullable(),
  email: z.string().email().min(1, {
    message: "email is required",
  }),
  password: z
    .string()
    .max(14, {
      message: "password too long",
    })
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/\d/, { message: "Password must contain at least one digit" })
    .regex(/[@$!%*?&]/, {
      message: "Password must contain at least one special character",
    })
    .nullable(),
  provider: z.enum([availableIdps[0], ...availableIdps.slice(1)]),
  type: z.enum(["email", "oidc", "oauth", "webauthn"]),
});
export type TRegisterRequest = z.infer<typeof RegisterRequest>;

async function registerHandler(req: NextRequest) {
  const reqData = await req.json();
  const validatedFields = RegisterRequest.safeParse(reqData);
  if (!validatedFields.success) {
    console.error(
      "Invalid fields while validating request:",
      validatedFields.error.message
    );
    return NextResponse.json(
      {
        status: "error",
        message: "Invalid fields",
      } as TRegisterResponse,
      {
        status: 400,
      }
    );
  }
  try {
    const data = await checkAndRegisterNewUserWithAccount(validatedFields.data);
    if (data.status === "error")
      return NextResponse.json(data, {
        status: 400,
      });
    else if (data.status === "success")
      return NextResponse.json(data, {
        status: 201,
      });
  } catch (err) {
    console.error("Error registering user:", err);
    return NextResponse.json(
      {
        status: "error",
        message: "Error registering user",
      } as TRegisterResponse,
      {
        status: 500,
      }
    );
  }
}

export async function checkAndRegisterNewUserWithAccount(
  data: TRegisterRequest
): Promise<TRegisterResponse> {
  try {
    let user = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });
    let shouldCreateAccount = false;

    console.log("User query:");

    if (user) {
      // check if user account exists
      const userAccount = await db.query.accounts.findFirst({
        where: and(
          eq(accounts.userId, user.id),
          eq(accounts.provider, data.provider)
        ),
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
          emailVerifiedAt: users.emailVerifiedAt,
          role: users.role,
        });

      if (newUser.length > 0) {
        user = newUser[0];
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

export { registerHandler as POST };

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

export const registerResponse = z.object({
  status: z.enum(["success", "error"]),
  message: z.string(),
});
type TRegisterResponse = z.infer<typeof registerResponse>;
