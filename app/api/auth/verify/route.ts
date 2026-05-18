import { NextRequest, NextResponse } from "next/server";
import { gatewayVerifyEmail } from "@/lib/gateway";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, code } = body;

    // 1. Verify through the gateway — returns full session on success
    const uhseRes = await gatewayVerifyEmail({ email, code });

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

    // 3. Build response — pass the gateway-issued token to the client
    const response = NextResponse.json({
      success: true,
      message: "Account verified. Logged in.",
      data: {
        access_token,
        vitalUserId: vitalUser.id,
        authId: user.id,
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