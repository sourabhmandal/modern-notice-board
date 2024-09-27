"use server";

import { AUTH_ERROR, DASHBOARD, LANDING, signIn, signOut } from "@/components";
import { env } from "@/server/env";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

type ITppProviders = "google" | "azure-ad" | string;

export async function startLoginWithTpp(provider: ITppProviders) {
  await signIn(provider, {
    redirectTo: DASHBOARD,
  });
}

export async function startLoginWithCredentials(
  email: string,
  password: string
) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DASHBOARD,
    });
  } catch (error) {
    // Signin can fail for a number of reasons, such as the user
    // not existing, or the user not having the correct role.
    // In some cases, you may want to redirect to a custom error
    if (error instanceof AuthError) {
      delete error.stack;
      console.log("AuthError", error);

      return redirect(
        `${env.NEXT_PUBLIC_API_URL}${AUTH_ERROR}?error=${error.type}&message=${error.name}`
      );
    }

    // Otherwise if a redirects happens Next.js can handle it
    // so you can just re-thrown the error and let Next.js handle it.
    // Docs:
    // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
    throw error;
  }
}

export async function startLogout() {
  await signOut({
    redirect: true,
    redirectTo: LANDING,
  });
}