import { checkAndRegisterNewUserWithAccount } from "@/app/actions/mutation/auth";
import authConfig from "@/components/auth/auth.config";
import { getDb } from "@/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/server/model/auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { Account, Profile, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { CredentialInput } from "next-auth/providers/credentials";
import { ADMIN_DASHBOARD, DASHBOARD } from "../constants/frontend-routes";
import { TAvailableIdps } from "./providers.list";

interface ISignInParams {
  user: User | AdapterUser;
  account: Account | null;
  profile?: Profile;
  email?: {
    verificationRequest?: boolean;
  };
  credentials?: Record<string, CredentialInput>;
}

const dbInst = await getDb();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(dbInst, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
  ...authConfig,
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
    signIn: async ({ account, profile, user }: ISignInParams) => {
      if (account) {
        console.log("profile", profile);
        account.providerAccountId =
          (profile?.iss as string) ?? `random-${crypto.randomUUID()}`;
      }
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

      // if (account?.provider === "google") {
      //   return Boolean(
      //     profile?.email_verified && profile?.email?.endsWith("@gmail.com")
      //   );
      // }
      // if (account?.provider === "facebook") {
      //   return Boolean(profile?.email_verified);
      // }
      return true;
      return user.role === "ADMIN" ? ADMIN_DASHBOARD : DASHBOARD;
    },
  },
  secret: process.env.JWT_SECRET_KEY,
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
    error: "/auth/error",
  },
});
