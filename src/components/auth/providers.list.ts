import { getDb } from "@/server/db";
import { users } from "@/server/model/auth";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { AuthError, Profile, User } from "next-auth";
import { Provider } from "next-auth/providers";
import AzureAd from "next-auth/providers/azure-ad";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z, ZodError } from "zod";

const signInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const providers: Array<Provider> = [
  Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
    allowDangerousEmailAccountLinking: true,
    profile: async (profile: Profile): Promise<User> => {
      const db = await getDb();
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
    allowDangerousEmailAccountLinking: true,
    profile: async (profile: Profile): Promise<User> => {
      const db = await getDb();
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
        const validatedFields = await signInSchema.safeParseAsync(credentials);
        if (validatedFields.success) {
          const db = await getDb();
          // logic to verify if the user exists
          let user = await db
            .select()
            .from(users)
            .where(eq(users.email, validatedFields.data.email))
            .then((res) => res[0]);
          const { password: _userpasswordhash, ...userWithoutPassword } = user;

          if (user) {
            const isMatch = await validatePasswordBcrypt(
              validatedFields.data.password,
              _userpasswordhash ?? ""
            );
            if (!isMatch) {
              throw new AuthError("email or password incorrect", {
                name: "InvalidCredentialsError",
              });
            }
            // return user object with their profile data
            return userWithoutPassword;
          }
          return null;
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
];

// ------------------------------ HELPER FUNCTIONS ------------------------------

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

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "credentials");

export const availableIdps = z.enum([
  ...providerMap.map((provider) => provider.id),
] as [string, ...string[]]);
export type TAvailableIdps = z.infer<typeof availableIdps>;
