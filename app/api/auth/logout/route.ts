import { NextRequest, NextResponse } from "next/server";
import { gatewayLogout } from "@/lib/gateway";
import { requireBffSession } from "@/lib/auth";
import { errorMessage, errorStatus } from "@/lib/errors";

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
// Invalidates the session on UHSE via Gateway.
// The client should also clear its stored token on success.

export async function POST(req: NextRequest) {
  try {
    const session = await requireBffSession(req);

    // Gateway logout also needs the refresh token cookie if present
    const refreshToken = req.cookies.get("refresh_token")?.value ?? "";

    try {
      await gatewayLogout(session.accessToken, refreshToken);
    } catch (err: unknown) {
      // If Gateway returns 401, the token is already expired/invalid.
      // Treat as a successful logout from VITAL's perspective.
      if (errorStatus(err) === 401) {
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
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: errorMessage(error, "Logout failed.") },
      { status: 500 },
    );
  }
}
