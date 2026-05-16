import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
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