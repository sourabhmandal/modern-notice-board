import NextAuth from "next-auth";
import { z } from "zod";
import authConfig from "../../../auth.config";

export const providerMap = authConfig.providers
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


export const { handlers, auth, signIn, signOut } = NextAuth({
  // adapter: DrizzleAdapter(db, {
  //   usersTable: users,
  //   accountsTable: accounts,
  //   sessionsTable: sessions,
  //   verificationTokensTable: verificationTokens,
  // }),
  session: {
    strategy: "jwt",
  },
  ...authConfig,
});
