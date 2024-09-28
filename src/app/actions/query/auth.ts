"use server";

import { auth, signIn, signOut } from "@/components/auth/auth";
import { LANDING } from "@/components/constants/frontend-routes";
import { TNotificationResponse } from "@/components/utils/api.utils";
import { getDb } from "@/server/db";
import { users } from "@/server/model/auth";
import { eq } from "drizzle-orm";
import { AuthError } from "next-auth";
type ITppProviders = "google" | "azure-ad" | string;

export async function startLoginWithTpp(provider: ITppProviders) {
  const data = await signIn(provider, {
    redirect: true,
  });

  const session = await auth();
  console.log("session", session);
}

export async function startLoginWithCredentials(
  email: string,
  password: string
): Promise<TNotificationResponse & { user?: typeof users.$inferSelect }> {
  try {
    if (!email || !password) {
      throw new AuthError("Invalid credentials provided", {
        name: "InvalidCredentialsError",
      });
    }
    const db = await getDb();
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .then((res) => res[0])
      .catch((err) => {
        throw err;
      });
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    let userWithoutPassword = user;
    userWithoutPassword.password = "";
    return {
      status: "success",
      message: "User signed in successfully",
      user: userWithoutPassword,
    };
  } catch (error) {
    // Signin can fail for a number of reasons, such as the user
    // not existing, or the user not having the correct role.
    // In some cases, you may want to redirect to a custom error
    if (error instanceof AuthError) {
      delete error.stack;
      console.log("AuthError", error);

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
    return {
      status: "error",
      message: "Oops! unhandled server exception in signin",
    };
  }
}

export async function startLogout() {
  await signOut({
    redirect: true,
    redirectTo: LANDING,
  });
}