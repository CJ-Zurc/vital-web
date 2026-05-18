import { NextRequest, NextResponse } from "next/server";
import { gatewayLogin, gatewayGetEHRPatientByAuthId, GatewayRequestError } from "@/lib/gateway";
import { prisma } from "@/lib/prisma";

// ─── UHSE / Gateway error codes ───────────────────────────────────────────────
// Reference: Auth API error codes + Gateway error codes
const ERROR_CODES = {
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  INVALID_CLIENT: "INVALID_CLIENT",
  ACCOUNT_INACTIVE: "ACCOUNT_INACTIVE",       // unverified or inactive account
  USER_BANNED: "USER_BANNED",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  OTP_DELIVERY_UNAVAILABLE: "OTP_DELIVERY_UNAVAILABLE",
  NO_SYSTEM_ACCESS: "NO_SYSTEM_ACCESS",
  TOKEN_INVALID: "TOKEN_INVALID",
} as const;

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
// Starts an email/password login session.
//
// OTP challenge handling:
//   UHSE always requires OTP verification after valid credentials.
//   TODO: confirm exact status code + response shape from Gateway when OTP is
//   triggered. Currently handled as 202, but may be a 200 with a flag.
//   Update the `isOtpChallenge` check once confirmed against a live Gateway.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 },
      );
    }

    let uhseRes;
    try {
      uhseRes = await gatewayLogin({ email, password });
    } catch (err: any) {
      if (err instanceof GatewayRequestError) {
        // ── Extract UHSE error_code from message if present ──
        const code = err.message;

        // ── OTP challenge — TODO: confirm actual status/shape from Gateway ──
        // Some auth services return 202 to signal "credentials valid, OTP sent".
        // Others return 200 with a requires_otp flag in the body.
        // Update this condition once tested against the live Gateway.
        if (err.status === 202) {
          return NextResponse.json(
            {
              success: false,
              requiresOtp: true,
              message: "A verification code has been sent to your email.",
              data: { email },
            },
            { status: 202 },
          );
        }

        if (code === ERROR_CODES.USER_BANNED) {
          return NextResponse.json(
            { success: false, message: "Your account has been banned.", errorCode: "USER_BANNED" },
            { status: 403 },
          );
        }

        if (code === ERROR_CODES.ACCOUNT_INACTIVE) {
          return NextResponse.json(
            {
              success: false,
              message: "Your account is inactive or not yet verified.",
              errorCode: "ACCOUNT_INACTIVE",
            },
            { status: 403 },
          );
        }

        if (code === ERROR_CODES.RATE_LIMIT_EXCEEDED) {
          return NextResponse.json(
            {
              success: false,
              message: "Too many attempts. Please wait before trying again.",
              errorCode: "RATE_LIMIT_EXCEEDED",
            },
            { status: 429 },
          );
        }

        if (code === ERROR_CODES.OTP_DELIVERY_UNAVAILABLE) {
          return NextResponse.json(
            {
              success: false,
              message: "We couldn't deliver your verification code. Please try again later.",
              errorCode: "OTP_DELIVERY_UNAVAILABLE",
            },
            { status: 503 },
          );
        }

        if (code === ERROR_CODES.NO_SYSTEM_ACCESS) {
          return NextResponse.json(
            {
              success: false,
              message: "Your account does not have access to VITAL.",
              errorCode: "NO_SYSTEM_ACCESS",
            },
            { status: 403 },
          );
        }

        // ── Invalid credentials — generic message, don't reveal which field ──
        if (
          code === ERROR_CODES.INVALID_CREDENTIALS ||
          code === ERROR_CODES.INVALID_CLIENT ||
          err.status === 401
        ) {
          return NextResponse.json(
            { success: false, message: "Invalid email or password." },
            { status: 401 },
          );
        }
      }

      // ── Unhandled Gateway error — rethrow to outer catch ──
      throw err;
    }

    // ── Handle 200 with OTP flag (alternative Gateway shape) ──
    // TODO: remove whichever branch doesn't match the actual Gateway response.
    if (
      uhseRes.success === false &&
      (uhseRes as any).requiresOtp === true
    ) {
      return NextResponse.json(
        {
          success: false,
          requiresOtp: true,
          message: "A verification code has been sent to your email.",
          data: { email },
        },
        { status: 202 },
      );
    }

    if (!uhseRes.success || !uhseRes.data) {
      return NextResponse.json(
        { success: false, message: uhseRes.message },
        { status: 401 },
      );
    }

    const { access_token, user } = uhseRes.data;

    // ── Determine role ──
    const vitalSystemRoles = user.system_roles?.["vital"] ?? [];
    let role = "patient";
    if (user.is_admin) role = "admin";
    else if (vitalSystemRoles.includes("doctor")) role = "doctor";

    // ── Find or create VitalUser ──
    let vitalUser = await prisma.vitalUser.findUnique({
      where: { authId: user.id },
      include: { patient: true, doctor: true, admin: true },
    });

    if (!vitalUser) {
      if (role === "admin") {
        vitalUser = await prisma.vitalUser.create({
          data: {
            authId: user.id,
            role: "admin",
            admin: { create: { authId: user.id } },
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

    // ── Check EHR record for patients ──
    let isRecordAvailable = vitalUser.patient?.isRecordAvailable ?? false;
    if (role === "patient" && !isRecordAvailable) {
      try {
        const ehrRecord = await gatewayGetEHRPatientByAuthId(user.id, access_token);
        if (ehrRecord.success && ehrRecord.data) {
          isRecordAvailable = true;
          await prisma.vitalPatient.update({
            where: { userId: vitalUser.id },
            data: { isRecordAvailable: true },
          });
        }
      } catch {
        // EHR record not found — not an error, patient just has no BGH record
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
          isRecordAvailable,
        }),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message ?? "Login failed." },
      { status: 500 },
    );
  }
}