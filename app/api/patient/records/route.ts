import { NextRequest, NextResponse } from "next/server";
import {
  gatewayCreatePatientSelf,
  GatewayRequestError,
  gatewayGetEHRPatientMe,
} from "@/lib/gateway";
import { attachBffSessionHeaders, requireBffSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireBffSession(req);

    // Fetch from the gateway, which forwards the request to the EHR service.
    const ehrResponse = await gatewayGetEHRPatientMe(session.accessToken);

    if (!ehrResponse.success) {
      return NextResponse.json(
        { success: false, message: "No patient record found" },
        { status: 404 }
      );
    }

    // Update vital-web database if record exists
    const vitalUser = await prisma.vitalUser.findUnique({
      where: { authId: ehrResponse.data?.auth_id ?? "" },
      include: { patient: true },
    });

    if (vitalUser?.patient) {
      await prisma.vitalPatient.update({
        where: { userId: vitalUser.id },
        data: { isRecordAvailable: true },
      });
    }

    return attachBffSessionHeaders(NextResponse.json({
      success: true,
      message: "Patient record retrieved",
      data: ehrResponse.data,
    }), session);
  } catch (error: unknown) {
    // Missing records and missing EHR patient role both mean onboarding
    // should proceed as a new patient setup.
    if (
      error instanceof GatewayRequestError &&
      (error.status === 404 ||
        error.status === 401 ||
        (error.status === 403 && error.message.includes("EHR patient role is required")))
    ) {
      return NextResponse.json(
        { success: false, message: error.status === 401 ? "Unauthorized" : "Patient record not found" },
        { status: error.status === 401 ? 401 : 404 }
      );
    }

    // Log unexpected failures for debugging
    console.error("GET patient records error:", error);

    if (
      errorMessage(error, "").includes("404") ||
      errorMessage(error, "").includes("not found")
    ) {
      return NextResponse.json(
        { success: false, message: "Patient record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, message: errorMessage(error, "Failed to retrieve patient record") },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireBffSession(req);

    const body = await req.json() as Record<string, unknown>;

    // Validate required fields
    const requiredFields = [
      "first_name",
      "last_name",
      "date_of_birth",
      "sex",
      "address_street",
      "address_barangay",
      "address_city_municipality",
      "address_province_region",
      "patient_type",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create the caller's own patient profile through the Gateway-safe self route.
    const ehrResponse = await gatewayCreatePatientSelf(
      body as Parameters<typeof gatewayCreatePatientSelf>[0],
      session.accessToken,
    );

    if (!ehrResponse.success) {
      return NextResponse.json(
        { success: false, message: ehrResponse.message },
        { status: 400 }
      );
    }

    // Update vital-web database
    const vitalUser = await prisma.vitalUser.findUnique({
      where: { authId: ehrResponse.data?.auth_id ?? "" },
      include: { patient: true },
    });

    if (vitalUser?.patient) {
      await prisma.vitalPatient.update({
        where: { userId: vitalUser.id },
        data: { isRecordAvailable: true },
      });
    }

    return attachBffSessionHeaders(NextResponse.json(
      {
        success: true,
        message: "Patient record created successfully",
        data: ehrResponse.data,
      },
      { status: 201 }
    ), session);
  } catch (error: unknown) {
    if (error instanceof GatewayRequestError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status },
      );
    }
    console.error("POST patient records error:", error);

    return NextResponse.json(
      { success: false, message: errorMessage(error, "Failed to create patient record") },
      { status: 500 }
    );
  }
}
