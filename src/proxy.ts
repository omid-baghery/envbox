import { auth } from "@/features/auth/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (
    session &&
    (pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/verify-email")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // لاگین نیست → برو login
  if (!session && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/verify-email"],
};
