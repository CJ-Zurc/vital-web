import { NextRequest, NextResponse } from "next/server";
import { decodeToken, isTokenExpired } from "@/lib/jwt";

// ─── Route access rules ───────────────────────────────────────────────────────

const routeRoles: Record<string, string[]> = {
  "/api/patient": ["patient"],
  "/api/doctor": ["doctor"],
  "/api/admin": ["admin"],
};

// ─── Public routes — no token needed ─────────────────────────────────────────

const publicRoutes = [
  "/api/auth/register",
  "/api/auth/login",
  "/api/auth/verify",
  "/api/auth/refresh",
  "/api/auth/resend",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/auth/consent",
];

// ─── Middleware ───────────────────────────────────────────────────────────────

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes through
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Only apply to /api routes
  if (!pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Extract token
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "").replace("bearer ", "");

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  // Verify token is not expired
  if (isTokenExpired(token)) {
    return NextResponse.json(
      { success: false, message: "Token expired" },
      { status: 401 },
    );
  }

  // Decode token
  let decoded;
  try {
    decoded = decodeToken(token);
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 401 },
    );
  }

  // Get VITAL role from systemRoles
  const vitalRole = decoded.systemRoles?.["vital"] ?? "patient";

  // Check route role access
  for (const [route, allowedRoles] of Object.entries(routeRoles)) {
    if (pathname.startsWith(route)) {
      if (!allowedRoles.includes(vitalRole)) {
        return NextResponse.json(
          { success: false, message: "Forbidden" },
          { status: 403 },
        );
      }
    }
  }

  // Attach user info to request headers for route handlers to use
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", decoded.sub);
  requestHeaders.set("x-user-role", vitalRole);
  requestHeaders.set("x-user-email", decoded.email);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/api/:path*"],
};