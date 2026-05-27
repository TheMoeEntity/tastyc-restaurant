import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeToken(token: string): { exp?: number; role?: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(Buffer.from(parts[1], "base64").toString());
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload?.exp) return true;
  return payload.exp * 1000 < Date.now();
}

function getRoleFromToken(token: string): string | null {
  return decodeToken(token)?.role ?? null;
}

function getRequiredRoles(pathname: string): string[] | null {
  if (pathname.startsWith("/dashboard/admin"))
    return ["MANAGER", "SUPERADMIN", "STAFF"];
  if (pathname.startsWith("/dashboard/kitchen"))
    return ["KITCHEN", "MANAGER", "SUPERADMIN"];
  if (pathname.startsWith("/dashboard/user"))
    return ["CUSTOMER", "MANAGER", "SUPERADMIN"];
  return null;
}

function getHomePath(role: string | null): string {
  if (role === "MANAGER" || role === "SUPERADMIN" || role === "STAFF")
    return "/dashboard/admin";
  if (role === "KITCHEN") return "/dashboard/kitchen";
  return "/dashboard/user";
}

async function silentRefreshToken(request: NextRequest) {
  try {
    const apiUrl = process.env.API_URL || "http://localhost:4000";
    const cookieHeader = request.headers.get("cookie") || "";

    const refreshResponse = await fetch(`${apiUrl}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "user-agent": request.headers.get("user-agent") || "",
        cookie: cookieHeader,
      },
    });

    if (!refreshResponse.ok) return null;

    const response = NextResponse.next();
    const setCookieHeaders = refreshResponse.headers.getSetCookie();
    let newAccessToken = "";

    response.cookies.delete({ name: "tastyc_access_token", domain: ".mosesnwigberi.com", path: "/" });
    response.cookies.delete({ name: "tastyc_refresh_token", domain: ".mosesnwigberi.com", path: "/" });
    response.cookies.delete({ name: "tastyc_user_id", domain: ".mosesnwigberi.com", path: "/" });

    setCookieHeaders.forEach((cookieStr) => {
      const parts = cookieStr.split(";").map((p) => p.trim());
      const firstEq = parts[0].indexOf("=");
      const name = parts[0].substring(0, firstEq).trim();
      const value = parts[0].substring(firstEq + 1).trim();

      if (name === "tastyc_access_token") newAccessToken = value;

      const attrs: {
        httpOnly?: boolean;
        secure?: boolean;
        sameSite?: "lax" | "strict" | "none";
        maxAge?: number;
        path?: string;
        domain?: string;
      } = {};

      parts.slice(1).forEach((attr) => {
        const lower = attr.toLowerCase();
        if (lower === "httponly") attrs.httpOnly = true;
        else if (lower === "secure") attrs.secure = true;
        else if (lower.startsWith("samesite="))
          attrs.sameSite = attr.split("=")[1].trim().toLowerCase() as "lax" | "strict" | "none";
        else if (lower.startsWith("max-age="))
          attrs.maxAge = parseInt(attr.split("=")[1].trim(), 10);
        else if (lower.startsWith("path="))
          attrs.path = attr.split("=")[1].trim();
        else if (lower.startsWith("domain="))
          attrs.domain = attr.split("=")[1].trim();
      });

      response.cookies.set({ name, value, ...attrs });
    });

    return { response, accessToken: newAccessToken };
  } catch {
    return null;
  }
}

export default async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("tastyc_access_token")?.value;
  const refreshToken = request.cookies.get("tastyc_refresh_token")?.value;
  const { pathname } = request.nextUrl;

  // ── /setup — onboarding wizard ────────────────────────────
  if (pathname.startsWith("/setup")) {
    // Must be logged in
    if (!accessToken || isTokenExpired(accessToken)) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = getRoleFromToken(accessToken);

    // Must be MANAGER or SUPERADMIN
    if (!role || !["MANAGER", "SUPERADMIN"].includes(role)) {
      return NextResponse.redirect(new URL(getHomePath(role), request.url));
    }

    // Already onboarded — no reason to be here
    const isOnboarded =
      request.cookies.get("tastyc_is_onboarded")?.value === "true";
    if (isOnboarded) {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    }

    return NextResponse.next();
  }

  // ── Dashboard routes ──────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    let effectiveToken: string | null = null;
    let responseToReturn: NextResponse | null = null;

    if (accessToken && !isTokenExpired(accessToken)) {
      effectiveToken = accessToken;
    } else if (refreshToken) {
      const refreshResult = await silentRefreshToken(request);
      if (refreshResult) {
        responseToReturn = refreshResult.response;
        effectiveToken = refreshResult.accessToken || accessToken || null;
      }
    }

    if (!effectiveToken) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("reason", "required");
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = getRoleFromToken(effectiveToken);
    const requiredRoles = getRequiredRoles(pathname);

    if (requiredRoles && (!role || !requiredRoles.includes(role))) {
      return NextResponse.redirect(new URL("/403", request.url));
    }

    // ── Onboarding gate for admin dashboard ───────────────
    // If MANAGER/SUPERADMIN hasn't completed setup, send them there
    if (
      pathname.startsWith("/dashboard/admin") &&
      ["MANAGER", "SUPERADMIN"].includes(role ?? "")
    ) {
      const isOnboarded =
        request.cookies.get("tastyc_is_onboarded")?.value === "true";
      if (!isOnboarded) {
        return NextResponse.redirect(new URL("/setup", request.url));
      }
    }

    return responseToReturn ?? NextResponse.next();
  }

  // ── Auth pages — redirect authenticated users ─────────────
  if (
    accessToken &&
    !isTokenExpired(accessToken) &&
    (pathname.startsWith("/auth/login") ||
      pathname.startsWith("/auth/register"))
  ) {
    const role = getRoleFromToken(accessToken);
    return NextResponse.redirect(new URL(getHomePath(role), request.url));
  }

  // ── Verify page ───────────────────────────────────────────
  if (
    pathname.startsWith("/auth/verify") &&
    accessToken &&
    !isTokenExpired(accessToken)
  ) {
    const isVerified =
      request.cookies.get("tastyc_is_verified")?.value === "true";
    if (isVerified) {
      const role = getRoleFromToken(accessToken);
      return NextResponse.redirect(new URL(getHomePath(role), request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/setup/:path*",
    "/setup",
    "/auth/login",
    "/auth/register",
    "/auth/verify",
  ],
};