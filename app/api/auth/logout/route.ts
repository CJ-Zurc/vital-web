import { NextRequest, NextResponse } from "next/server";
import { gatewayLogout } from "@/lib/gateway";
import { extractBearerToken } from "@/lib/auth";

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
// Invalidates the session on UHSE via Gateway.
// The client should also clear its stored token on success.

export async function POST(req: NextRequest) {
  try {
    const accessToken = extractBearerToken(req.headers.get("authorization"));

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "No active session." },
        { status: 401 },
      );
    }

    // Gateway logout also needs the refresh token cookie if present
    const refreshToken = req.cookies.get("refresh_token")?.value ?? "";

    try {
      await gatewayLogout(accessToken, refreshToken);
    } catch (err: any) {
      // If Gateway returns 401, the token is already expired/invalid.
      // Treat as a successful logout from VITAL's perspective.
      if (err.status === 401) {
        return NextResponse.json({
          success: true,
          message: "Session already expired. Logged out.",
        });
      }
      throw err;
    }

    return NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message ?? "Logout failed." },
      { status: 500 },
    );
  }
}