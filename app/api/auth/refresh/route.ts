import { NextRequest, NextResponse } from "next/server";
import { gatewayRefreshWithHeaders } from "@/lib/gateway";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "No refresh session available." },
        { status: 401 },
      );
    }

    const gatewayResponse = await gatewayRefreshWithHeaders(refreshToken);
    const uhseRes = gatewayResponse.data;

    if (!uhseRes.success || !uhseRes.data) {
      return NextResponse.json(
        { success: false, message: uhseRes.message },
        { status: 401 },
      );
    }

    const { access_token, user } = uhseRes.data;
    const vitalUser = await prisma.vitalUser.findUnique({
      where: { authId: user.id },
      include: { patient: true, doctor: true, admin: true },
    });

    if (!vitalUser) {
      return NextResponse.json(
        { success: false, message: "VITAL user not found." },
        { status: 404 },
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Session refreshed.",
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

    const refreshCookie = gatewayResponse.headers.get("set-cookie");
    if (refreshCookie) {
      response.headers.append("Set-Cookie", refreshCookie);
    }

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Session refresh failed.";
    const status =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof error.status === "number"
        ? error.status
        : 500;

    return NextResponse.json(
      { success: false, message },
      { status },
    );
  }
}
