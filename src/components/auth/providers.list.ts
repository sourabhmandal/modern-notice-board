import { initializeDb } from "@/server";
import { users } from "@/server/model/auth";
import { eq } from "drizzle-orm";
import { Profile, User } from "next-auth";
import { Provider } from "next-auth/providers";
import Google from "next-auth/providers/google";
import Microsoft from "next-auth/providers/microsoft-entra-id";
import { z } from "zod";

export const providers: Array<Provider> = [
  Google({
    clientId: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
    profile: async (profile: Profile): Promise<User> => {
      const db = await initializeDb();
      let user = await db.query.users.findFirst({
        where: eq(users.email, profile?.email ?? ""),
      });
      return { ...profile, role: user?.role ?? "STUDENT" } as User;
    },
  }),
  Microsoft({
    clientId: process.env.AUTH_AZURE_AD_ID,
    clientSecret: process.env.AUTH_AZURE_AD_SECRET,
    profile: async (profile: Profile): Promise<User> => {
      const db = await initializeDb();
      let user = await db.query.users.findFirst({
        where: eq(users.email, profile?.email ?? ""),
      });
      return { ...profile, role: user?.role ?? "STUDENT" } as User;
    },
  }),
];

// ------------------------------ HELPER FUNCTIONS ------------------------------
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
