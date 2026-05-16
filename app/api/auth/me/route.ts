import { NextRequest, NextResponse } from "next/server";
import { uhseGetMe } from "@/lib/uhse";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // 1. Get profile from UHSE
    const uhseRes = await uhseGetMe(accessToken);

    if (!uhseRes.success || !uhseRes.data) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const uhseUser = uhseRes.data;

    // 2. Get VITAL-specific data
    const vitalUser = await prisma.vitalUser.findUnique({
      where: { authId: uhseUser.id },
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
        // From UHSE
        email: uhseUser.email,
        firstName: uhseUser.first_name,
        middleName: uhseUser.middle_name,
        lastName: uhseUser.last_name,
        extensionName: uhseUser.extension_name,
        profilePictureUrl: uhseUser.profile_picture_url,
        isVerified: uhseUser.is_verified,
        // VITAL-specific
        isOnboardingComplete: vitalUser.patient?.isOnboardingComplete ?? false,
        isRecordAvailable: vitalUser.patient?.isRecordAvailable ?? false,
        profilePic: vitalUser.patient?.profilePic ?? null,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message ?? "Failed to get profile" },
      { status: 500 },
    );
  }
}