import { NextRequest, NextResponse } from "next/server";
import { gatewayVerify2FAWithHeaders } from "@/lib/gateway";
import { prisma } from "@/lib/prisma";

// ─── POST /api/auth/verify-2fa ────────────────────────────────────────────────
// Called after login when UHSE returns a 2FA challenge.
// The frontend passes the email (stored in state/sessionStorage after the
// challenge) and the 6-digit code the user typed.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: "Email and code are required." },
        { status: 400 },
      );
    }

    // ── Forward to UHSE via Gateway ──
    let uhseRes;
    let refreshCookie: string | null = null;
    try {
      const gatewayResponse = await gatewayVerify2FAWithHeaders({ email, code });
      uhseRes = gatewayResponse.data;
      refreshCookie = gatewayResponse.headers.get("set-cookie");
    } catch (err: any) {
      // Gateway returns 4xx on bad/expired code
      return NextResponse.json(
        { success: false, message: err.message ?? "Invalid or expired code." },
        { status: err.status ?? 400 },
      );
    }

    if (!uhseRes.success || !uhseRes.data) {
      return NextResponse.json(
        { success: false, message: uhseRes.message },
        { status: 400 },
      );
    }

    const { access_token, user } = uhseRes.data;

    // ── Find VitalUser (must already exist from login/register) ──
    const vitalUser = await prisma.vitalUser.findUnique({
      where: { authId: user.id },
      include: { patient: true },
    });

    if (!vitalUser) {
      return NextResponse.json(
        { success: false, message: "User account not found in VITAL." },
        { status: 404 },
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "2FA verified. Login successful.",
      data: {
        access_token,
        expires_in: uhseRes.data.expires_in,
        vitalUserId: vitalUser.id,
        authId: user.id,
        role: vitalUser.role,
        ...(vitalUser.role === "patient" && {
          isOnboardingComplete: vitalUser.patient?.isOnboardingComplete ?? false,
          isRecordAvailable: vitalUser.patient?.isRecordAvailable ?? false,
        }),
      },
    });
    if (refreshCookie) {
      response.headers.append("Set-Cookie", refreshCookie);
    }
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message ?? "2FA verification failed." },
      { status: 500 },
    );
  }
}
