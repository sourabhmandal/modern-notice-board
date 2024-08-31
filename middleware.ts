import {
  apiAuthPrefix,
  AUTH_LOGIN,
  authRoutes,
  DASHBOARD,
  publicRoutes,
} from "@/components";
import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authConfig from "./auth.config";

export const { auth } = NextAuth(authConfig);
export default auth(async function middleware(req: NextRequest) {
  const isLoggedIn = !!req;
  const { nextUrl } = req;
  console.log("isLoggedIn: ", isLoggedIn, " Path: ", req.nextUrl.pathname);

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DASHBOARD, `${nextUrl.basePath}/`));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL(AUTH_LOGIN, `${nextUrl.basePath}/`));
  }

  return;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
