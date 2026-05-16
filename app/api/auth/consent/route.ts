import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { authId, accepted } = body;

    // Validate
    if (!authId) {
      return NextResponse.json(
        { success: false, message: "authId is required" },
        { status: 400 },
      );
    }

    if (accepted !== true) {
      return NextResponse.json(
        { success: false, message: "Consent must be explicitly accepted to proceed" },
        { status: 400 },
      );
    }

    // Find VitalPatient
    const vitalPatient = await prisma.vitalPatient.findUnique({
      where: { authId },
    });

    if (!vitalPatient) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 },
      );
    }

    // Check if consent already exists — prevent duplicates
    const existing = await prisma.consentRecord.findFirst({
      where: {
        patientId: vitalPatient.id,
        consentType: "registration",
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Registration consent already recorded" },
        { status: 409 },
      );
    }

    // Create immutable consent record
    const consent = await prisma.consentRecord.create({
      data: {
        patientId: vitalPatient.id,
        consentType: "registration",
        accepted: true,
        consentedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Consent recorded successfully.",
        data: {
          consentId: consent.id,
          consentType: consent.consentType,
          accepted: consent.accepted,
          consentedAt: consent.consentedAt,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message ?? "Failed to record consent" },
      { status: 500 },
    );
  }
}

// GET — Admin retrieves consent records for audit
export async function GET(req: NextRequest) {
  try {
    const vitalRole = req.headers.get("x-vital-role");

    if (vitalRole !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");

    const consents = await prisma.consentRecord.findMany({
      where: {
        consentType: "registration",
        ...(patientId ? { patientId } : {}),
      },
      orderBy: { consentedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      message: "Consent records retrieved.",
      data: consents,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message ?? "Failed to retrieve consent records" },
      { status: 500 },
    );
  }
}