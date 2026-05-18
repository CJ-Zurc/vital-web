import { NextRequest, NextResponse } from "next/server";
import { gatewayGetMe, GatewayRequestError } from "@/lib/gateway";
import { prisma } from "@/lib/prisma";
import { extractBearerToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const accessToken = extractBearerToken(req.headers.get("authorization"));

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "Authorization header must be `Bearer <token>`" },
        { status: 401 },
      );
    }

    // 1. Get profile from Gateway
    const gatewayRes = await gatewayGetMe(accessToken);

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

    return NextResponse.json({
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
    });
  } catch (error: any) {
    if (error instanceof GatewayRequestError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { success: false, message: error.message ?? "Failed to get profile" },
      { status: 500 },
    );
  }
}