import { providers, TAvailableIdps } from "@/components/auth/providers.list";
import { Account, NextAuthConfig, Profile, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";

interface ISignInParams {
  user: User | AdapterUser;
  account: Account | null;
  profile?: Profile;
  email?: {
    verificationRequest?: boolean;
  };
}

/*
 * Config Options
 */
export default {
  debug: true,
  providers: providers,
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
      if (profile?.email && account?.provider === "google") {
        return Boolean(
          profile?.email_verified && profile?.email?.endsWith("@gmail.com")
        );
      }
      if (profile?.email && account?.provider === "facebook") {
        return Boolean(profile?.email_verified);
      }
      if (profile?.email) {
        // No user found, so this is their first attempt to login
        // meaning this is also the place you could do registration
        checkAndRegisterNewUserWithAccount({
          email: profile.email,
          provider: account?.provider as TAvailableIdps,
          fullName: profile.name ?? "",
        });
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

function checkAndRegisterNewUserWithAccount({
  email,
  provider,
  fullName,
}: {
  email: string;
  provider: TAvailableIdps;
  fullName: string;
}) {}
