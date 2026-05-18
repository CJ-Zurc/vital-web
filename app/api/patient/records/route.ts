import { NextRequest, NextResponse } from "next/server";
import {
  gatewayCreateEHRPatient,
  GatewayRequestError,
  gatewayGetEHRPatientMe,
} from "@/lib/gateway";
import { extractBearerToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = extractBearerToken(authHeader);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch from the gateway, which forwards the request to the EHR service.
    const ehrResponse = await gatewayGetEHRPatientMe(token);

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

    return NextResponse.json({
      success: true,
      message: "Patient record retrieved",
      data: ehrResponse.data,
    });
  } catch (error: any) {
    // Missing records and missing EHR patient role both mean onboarding
    // should proceed as a new patient setup.
    if (
      error instanceof GatewayRequestError &&
      (error.status === 404 ||
        (error.status === 403 && error.message.includes("EHR patient role is required")))
    ) {
      return NextResponse.json(
        { success: false, message: "Patient record not found" },
        { status: 404 }
      );
    }

    // Log unexpected failures for debugging
    console.error("GET patient records error:", error);

    if (
      error.message.includes("404") ||
      error.message.includes("not found")
    ) {
      return NextResponse.json(
        { success: false, message: "Patient record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message ?? "Failed to retrieve patient record" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = extractBearerToken(authHeader);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

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

    // Create patient through the gateway, which forwards the request to EHR.
    const ehrResponse = await gatewayCreateEHRPatient(body, token);

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

    return NextResponse.json(
      {
        success: true,
        message: "Patient record created successfully",
        data: ehrResponse.data,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST patient records error:", error);

    return NextResponse.json(
      { success: false, message: error.message ?? "Failed to create patient record" },
      { status: 500 }
    );
  }
}
