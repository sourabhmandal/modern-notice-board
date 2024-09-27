import {
  apiAuthPrefix,
  AUTH_LOGIN,
  authRoutes,
  DASHBOARD,
  publicRoutes,
} from "@/components";
import { ADMIN_DASHBOARD } from "@/components/constants/frontend-routes";
import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authConfig from "./auth.config";

export const { auth } = NextAuth(authConfig);
export default auth(async function middleware(req: NextRequest) {
  const isLoggedIn = !!req;
  const { nextUrl } = req;
  console.log("isLoggedIn: ", isLoggedIn, " Path: ", req.nextUrl.pathname);

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // if (isAdminRoute && !isLoggedIn) {
  //   console.log(
  //     `${nextUrl.basePath}/${AUTH_LOGIN}?callbackUrl=${nextUrl.basePath}${nextUrl.pathname}`
  //   );
  //   return NextResponse.redirect(
  //     `${nextUrl.basePath}/${AUTH_LOGIN}?callbackUrl=${nextUrl.basePath}${nextUrl.pathname}`
  //   );
  // }

  if (isAuthRoute && isLoggedIn) {
    //@ts-ignore
    req.auth.user.role === "ADMIN"
      ? NextResponse.redirect(new URL(ADMIN_DASHBOARD, `${nextUrl.basePath}/`))
      : NextResponse.redirect(new URL(DASHBOARD, `${nextUrl.basePath}/`));
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL(AUTH_LOGIN, `${nextUrl.basePath}/`));
  }

  return;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/((?!,+|.[wl+$|_next).*)",
    "/",
    "/(api|trpc) (*)",
  ],
};
