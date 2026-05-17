import { NextRequest, NextResponse } from "next/server";
import { uhseRegister } from "@/lib/uhse";
import { prisma } from "@/lib/prisma";

// ─── Validators ───────────────────────────────────────────────────────────────

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password: string): {
  valid: boolean;
  message?: string;
} {
  if (password.length < 8)
    return { valid: false, message: "Password must be at least 8 characters." };
  if (!/[A-Z]/.test(password))
    return { valid: false, message: "Password must contain at least 1 uppercase letter." };
  if (!/[a-z]/.test(password))
    return { valid: false, message: "Password must contain at least 1 lowercase letter." };
  if (!/[0-9]/.test(password))
    return { valid: false, message: "Password must contain at least 1 number." };
  if (!/[^A-Za-z0-9]/.test(password))
    return { valid: false, message: "Password must contain at least 1 special character." };
  return { valid: true };
}

// ─── POST /api/auth/register ──────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      password,
      first_name,
      middle_name,
      last_name,
      extension_name,
    } = body;

    // ── Required field checks ──
    if (!email || !password || !first_name || !last_name) {
      return NextResponse.json(
        { success: false, message: "Email, password, first name, and last name are required." },
        { status: 400 },
      );
    }

    // ── Email format validation ──
    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format." },
        { status: 400 },
      );
    }

    // ── Password complexity validation ──
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      return NextResponse.json(
        { success: false, message: passwordCheck.message },
        { status: 400 },
      );
    }

    // ── Call UHSE register ──
    let uhseRes;
    try {
      uhseRes = await uhseRegister({
        email,
        password,
        first_name,
        middle_name,
        last_name,
        extension_name,
      });
    } catch (err: any) {
      // ── Duplicate email — UHSE returns an error ──
      const msg: string = err.message ?? "";
      if (
        msg.toLowerCase().includes("already exists") ||
        msg.toLowerCase().includes("duplicate") ||
        msg.toLowerCase().includes("already registered")
      ) {
        return NextResponse.json(
          { success: false, message: "An account with this email already exists." },
          { status: 409 },
        );
      }
      throw err;
    }

    if (!uhseRes.success || !uhseRes.data) {
      return NextResponse.json(
        { success: false, message: uhseRes.message },
        { status: 400 },
      );
    }

    const uhseUser = uhseRes.data;

    // ── Create VitalUser + VitalPatient ──
    const vitalUser = await prisma.vitalUser.create({
      data: {
        authId: uhseUser.id,
        role: "patient",
        patient: {
          create: {
            authId: uhseUser.id,
            isRecordAvailable: false,
            isOnboardingComplete: false,
          },
        },
      },
      include: { patient: true },
    });

    // ── Auto-create registration consent record ──
    await prisma.consentRecord.create({
      data: {
        patientId: vitalUser.patient!.userId,
        consentType: "registration",
        accepted: true,
        consentedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful. Please check your email for the verification code.",
        data: {
          vitalUserId: vitalUser.id,
          authId: uhseUser.id,
          email: uhseUser.email,
          isVerified: uhseUser.is_verified,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message ?? "Registration failed." },
      { status: 500 },
    );
  }
}
