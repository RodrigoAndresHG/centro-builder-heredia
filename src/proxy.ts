import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { isAdminRole } from "@/lib/permissions";

export default auth((request) => {
  const { nextUrl } = request;
  const isAuthenticated = Boolean(request.auth?.user);
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");

  if (!isAuthenticated) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set(
      "callbackUrl",
      `${nextUrl.pathname}${nextUrl.search}`,
    );

    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && !isAdminRole(request.auth?.user.role)) {
    return NextResponse.redirect(new URL("/app", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/app/:path*", "/admin/:path*"],
};
