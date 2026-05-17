import { NextRequest, NextResponse } from "next/server";
import { decodeToken, isTokenExpired } from "@/lib/jwt";

const routeRoles: Record<string, string[]> = {
  "/api/patient": ["patient"],
  "/api/doctor": ["doctor"],
  "/api/admin": ["admin"],
};

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

function resolveVitalRole(decoded: ReturnType<typeof decodeToken>): string {
  if (decoded.isAdmin) return "admin";

  const roles = decoded.systemRoles?.["vital"];
  if (Array.isArray(roles)) return roles[0] ?? "patient";

  return "patient";
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (!pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "").replace("bearer ", "");

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  if (isTokenExpired(token)) {
    return NextResponse.json(
      { success: false, message: "Token expired" },
      { status: 401 },
    );
  }

  let decoded;
  try {
    decoded = decodeToken(token);
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 401 },
    );
  }

  const vitalRole = resolveVitalRole(decoded);

  for (const [route, allowedRoles] of Object.entries(routeRoles)) {
    if (pathname.startsWith(route) && !allowedRoles.includes(vitalRole)) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }
  }

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
