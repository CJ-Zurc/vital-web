import { NextRequest, NextResponse } from "next/server";
import { uhseVerifyEmail } from "@/lib/uhse";
import { prisma } from "@/lib/prisma";
import { getVitalRole } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, code } = body;

    // 1. Verify with UHSE — returns full session on success
    const uhseRes = await uhseVerifyEmail({ email, code });

    if (!uhseRes.success || !uhseRes.data) {
      return NextResponse.json(
        { success: false, message: uhseRes.message },
        { status: 400 },
      );
    }

    const { access_token, user } = uhseRes.data;

    // 2. Find or create VitalUser
    let vitalUser = await prisma.vitalUser.findUnique({
      where: { authId: user.id },
    });

    if (!vitalUser) {
      vitalUser = await prisma.vitalUser.create({
        data: {
          authId: user.id,
          role: "patient",
          patient: {
            create: {
              authId: user.id,
              isRecordAvailable: false,
              isOnboardingComplete: false,
            },
          },
        },
      });
    }

    // 3. Build response — pass UHSE token to client
    const response = NextResponse.json({
      success: true,
      message: "Account verified. Logged in.",
      data: {
        access_token,
        vitalUserId: vitalUser.id,
        role: vitalUser.role,
      },
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message ?? "Verification failed" },
      { status: 500 },
    );
  }
}