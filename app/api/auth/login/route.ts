import { NextRequest, NextResponse } from "next/server";
import { uhseLogin } from "@/lib/uhse";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const uhseRes = await uhseLogin({ email, password });

    if (!uhseRes.success || !uhseRes.data) {
      return NextResponse.json(
        { success: false, message: uhseRes.message },
        { status: 401 },
      );
    }

    const { access_token, user } = uhseRes.data;

    // Determine role from UHSE response
    const vitalSystemRoles = user.system_roles?.["vital"] ?? [];
    let role = "patient";
    if (user.is_admin) role = "admin";
    else if (vitalSystemRoles.includes("doctor")) role = "doctor";

    // Find or create VitalUser
    let vitalUser = await prisma.vitalUser.findUnique({
      where: { authId: user.id },
      include: { patient: true, doctor: true, admin: true },
    });

    if (!vitalUser) {
      // Auto-create based on role
      if (role === "admin") {
        vitalUser = await prisma.vitalUser.create({
          data: {
            authId: user.id,
            role: "admin",
            admin: {
              create: { authId: user.id },
            },
          },
          include: { patient: true, doctor: true, admin: true },
        });
      } else {
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
          include: { patient: true, doctor: true, admin: true },
        });
      }
    }

  return NextResponse.json({
    success: true,
    message: "Login successful.",
    data: {
      access_token,
      expires_in: uhseRes.data.expires_in,
      vitalUserId: vitalUser.id,
      role: vitalUser.role,
      ...(vitalUser.role === "patient" && {
        isOnboardingComplete: vitalUser.patient?.isOnboardingComplete ?? false,
      }),
    },
  });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message ?? "Login failed" },
      { status: 500 },
    );
  }
}