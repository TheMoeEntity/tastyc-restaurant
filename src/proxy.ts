import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ── JWT helpers ───────────────────────────────────────────────
// Decode without verification — we only need expiry + role for routing.
// Signature verification happens on the API for every protected request.
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

// ── Route → role rules ────────────────────────────────────────
// Roles match the Prisma enum exactly: CUSTOMER, KITCHEN, MANAGER,
// SUPERADMIN, STAFF. The JWT stores user.role verbatim from Prisma.

function getRequiredRoles(pathname: string): string[] | null {
  if (pathname.startsWith("/dashboard/admin"))
    return ["MANAGER", "SUPERADMIN", "STAFF"];
  if (pathname.startsWith("/dashboard/kitchen"))
    return ["KITCHEN", "MANAGER", "SUPERADMIN", "STAFF"];
  if (pathname.startsWith("/dashboard/user"))
    return ["CUSTOMER", "MANAGER", "SUPERADMIN"];
  return null; // any authenticated role passes
}

// Role → default dashboard path (used when redirecting from auth pages)
function getHomePath(role: string | null): string {
  if (role === "MANAGER" || role === "SUPERADMIN" || role === "STAFF")
    return "/dashboard/admin";
  if (role === "KITCHEN") return "/dashboard/kitchen";
  return "/dashboard/user";
}

// ── Silent refresh ────────────────────────────────────────────
async function silentRefreshToken(
  request: NextRequest,
): Promise<{ response: NextResponse; accessToken: string } | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
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
      } = {};

      parts.slice(1).forEach((attr) => {
        const lower = attr.toLowerCase();
        if (lower === "httponly") {
          attrs.httpOnly = true;
        } else if (lower === "secure") {
          attrs.secure = true;
        } else if (lower.startsWith("samesite=")) {
          attrs.sameSite = attr.split("=")[1].trim().toLowerCase() as
            | "lax"
            | "strict"
            | "none";
        } else if (lower.startsWith("max-age=")) {
          attrs.maxAge = parseInt(attr.split("=")[1].trim(), 10);
        } else if (lower.startsWith("path=")) {
          attrs.path = attr.split("=")[1].trim();
        }
      });

      response.cookies.set({ name, value, ...attrs });
    });

    return { response, accessToken: newAccessToken };
  } catch {
    return null;
  }
}

// ── Middleware ────────────────────────────────────────────────
export default async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("tastyc_access_token")?.value;
  const refreshToken = request.cookies.get("tastyc_refresh_token")?.value;
  const { pathname } = request.nextUrl;

  // ── Dashboard routes ──────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    let effectiveToken: string | null = null;
    let responseToReturn: NextResponse | null = null;

    if (accessToken && !isTokenExpired(accessToken)) {
      // Valid token — use it directly
      effectiveToken = accessToken;
    } else if (refreshToken) {
      // Token missing or expired — attempt silent refresh
      const refreshResult = await silentRefreshToken(request);
      if (refreshResult) {
        responseToReturn = refreshResult.response;
        // Prefer the new token for role decoding; fall back to the old
        // (expired) token — role doesn't change between refreshes.
        effectiveToken = refreshResult.accessToken || accessToken || null;
      }
    }

    // No valid session at all → login
    if (!effectiveToken) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      loginUrl.searchParams.set("unauthenticated", "true");
      return NextResponse.redirect(loginUrl);
    }

    // Authenticated — now check role authorisation
    const role = getRoleFromToken(effectiveToken);
    const requiredRoles = getRequiredRoles(pathname);

    if (requiredRoles && (!role || !requiredRoles.includes(role))) {
      return NextResponse.redirect(new URL("/403", request.url));
    }

    return responseToReturn ?? NextResponse.next();
  }

  // ── Auth pages — redirect authenticated users to their dashboard ──
  if (
    accessToken &&
    !isTokenExpired(accessToken) &&
    (pathname.startsWith("/auth/login") ||
      pathname.startsWith("/auth/register"))
  ) {
    const role = getRoleFromToken(accessToken);
    return NextResponse.redirect(new URL(getHomePath(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/login", "/auth/register"],
};
