import { NextRequest, NextResponse } from "next/server";
import { attachBffSessionHeaders, requireBffSession } from "@/lib/auth";
import { errorMessage } from "@/lib/errors";
import { GatewayRequestError } from "@/lib/gateway";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await requireBffSession(req);
    if (session.role !== "admin") {
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

    return attachBffSessionHeaders(NextResponse.json({
      success: true,
      message: "Consent records retrieved.",
      data: consents,
    }), session);
  } catch (error: unknown) {
    if (error instanceof GatewayRequestError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { success: false, message: errorMessage(error, "Failed to retrieve consent records") },
      { status: 500 },
    );
  }
}
