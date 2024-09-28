import { checkAndRegisterNewUserWithAccount } from "@/app/api/auth/register/route";
import { TAvailableIdps } from "@/components/auth/auth";
import db from "@/server";
import { users } from "@/server/model/auth";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { Account, AuthError, NextAuthConfig, Profile, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import AzureAd from "next-auth/providers/azure-ad";
import Credentials, { CredentialInput } from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { object, string, ZodError } from "zod";

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

interface ISignInParams {
  user: User | AdapterUser;
  account: Account | null;
  profile?: Profile;
  email?: {
    verificationRequest?: boolean;
  };
  credentials?: Record<string, CredentialInput>;
}

async function validatePasswordBcrypt(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (err) {
    console.error("Error validating password with bcrypt:", err);
    throw err;
  }
}

/*
 * Config Options
 */
export default {
  debug: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      profile: async (profile: Profile): Promise<User> => {
        let user = await db.query.users.findFirst({
          where: eq(users.email, profile?.email ?? ""),
        });
        return { ...profile, role: user?.role ?? "STUDENT" } as User;
      },
    }),
    AzureAd({
      clientId: process.env.AUTH_AZURE_AD_ID,
      clientSecret: process.env.AUTH_AZURE_AD_SECRET,
      tenantId: process.env.AUTH_AZURE_AD_TENANT_ID,
      profile: async (profile: Profile): Promise<User> => {
        let user = await db.query.users.findFirst({
          where: eq(users.email, profile?.email ?? ""),
        });
        return { ...profile, role: user?.role ?? "STUDENT" } as User;
      },
    }),
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const validatedFields = await signInSchema.safeParseAsync(
            credentials
          );
          if (validatedFields.success) {
            // logic to verify if the user exists
            let user = await db.query.users.findFirst({
              where: eq(users.email, validatedFields.data.email),
            });

            if (!user) {
              throw new AuthError("User not found", {
                name: "UserNotFoundError",
              });
            }
            if (user?.password) {
              const passwordMatch = await validatePasswordBcrypt(
                validatedFields.data.password,
                user.password
              );

              console.log("password check result is matching: ", passwordMatch);

              if (passwordMatch) {
                const loggedInUser = user as unknown as User;
                // return user object with their profile data
                return loggedInUser;
              } else {
                throw new AuthError("Invalid credentials provided", {
                  name: "InvalidCredentialsError",
                });
              }
            } else {
              throw new AuthError("email or password incorrect", {
                name: "InvalidCredentialsError",
              });
            }
          } else {
            throw new AuthError("unable to validate fields in request", {
              name: "InvalidFieldsError",
            });
          }
        } catch (error) {
          if (error instanceof ZodError) {
            console.error("ZodError:", error);
            // Return `null` to indicate that the credentials are invalid
            return null;
          } else {
            console.error("Error authorizing credentials:", error);
            return null;
          }
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      return session;
    },
    signIn: async ({ account, profile }: ISignInParams) => {
      if (profile?.email) {
        // No user found, so this is their first attempt to login
        // meaning this is also the place you could do registration
        checkAndRegisterNewUserWithAccount({
          email: profile.email,
          provider: account?.provider as TAvailableIdps,
          fullName: profile.name ?? "",
          password: "",
          type: "oauth",
        });
      }

      if (account?.provider === "google") {
        return Boolean(
          profile?.email_verified && profile?.email?.endsWith("@gmail.com")
        );
      }
      if (account?.provider === "facebook") {
        return Boolean(profile?.email_verified);
      }
      return true;
    },
  },
  secret: process.env.JWT_SECRET_KEY,
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
    error: "/auth/error",
  },
} as NextAuthConfig;
