import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  const { pathname } = request.nextUrl;

  //  block dashboard if not logged in
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // protect admin
  if (pathname.startsWith("/dashboard/admin")) {
    if (!role || !["manager", "superadmin", "staff"].includes(role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // protect kitchen
  if (pathname.startsWith("/dashboard/kitchen")) {
    if (!role || !["kitchen", "manager"].includes(role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
