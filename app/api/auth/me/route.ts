import { NextRequest, NextResponse } from "next/server";
import { gatewayGetMe, GatewayRequestError } from "@/lib/gateway";
import { prisma } from "@/lib/prisma";
import { attachBffSessionHeaders, requireBffSession } from "@/lib/auth";
import { errorMessage } from "@/lib/errors";

export async function GET(req: NextRequest) {
  try {
    const session = await requireBffSession(req);

    // 1. Get profile from Gateway
    const gatewayRes = await gatewayGetMe(session.accessToken);

    if (!gatewayRes.success || !gatewayRes.data) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const gatewayUser = gatewayRes.data;

    // 2. Get VITAL-specific data
    const vitalUser = await prisma.vitalUser.findUnique({
      where: { authId: gatewayUser.id },
      include: { patient: true, doctor: true },
    });

    if (!vitalUser) {
      return NextResponse.json(
        { success: false, message: "VITAL user not found" },
        { status: 404 },
      );
    }

    return attachBffSessionHeaders(NextResponse.json({
      success: true,
      message: "Profile retrieved.",
      data: {
        vitalUserId: vitalUser.id,
        role: vitalUser.role,
        email: gatewayUser.email,
        firstName: gatewayUser.first_name,
        middleName: gatewayUser.middle_name,
        lastName: gatewayUser.last_name,
        extensionName: gatewayUser.extension_name,
        profilePictureUrl: gatewayUser.profile_picture_url,
        isVerified: gatewayUser.is_verified,
        isOnboardingComplete: vitalUser.patient?.isOnboardingComplete ?? false,
        isRecordAvailable: vitalUser.patient?.isRecordAvailable ?? false,
        profilePic: vitalUser.patient?.profilePic ?? null,
      },
    }), session);
  } catch (error: unknown) {
    if (error instanceof GatewayRequestError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { success: false, message: errorMessage(error, "Failed to get profile") },
      { status: 500 },
    );
  }
}
