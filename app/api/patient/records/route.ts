import { NextRequest, NextResponse } from "next/server";
import { ehrGetPatientByAuthId, ehrCreatePatient } from "@/lib/uhse";
import { prisma } from "@/lib/prisma";
import { decodeToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "").replace("bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch from EHR by auth_id (GET /patients/me)
    const ehrResponse = await ehrGetPatientByAuthId(token);

    if (!ehrResponse.success) {
      return NextResponse.json(
        { success: false, message: "No patient record found" },
        { status: 404 }
      );
    }

    // Update vital-web database if record exists
    const decoded = decodeToken(token);
    const vitalUser = await prisma.vitalUser.findUnique({
      where: { authId: decoded.sub },
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
    // Log for debugging
    console.error("GET patient records error:", error);

    // Check if it's a 404 from EHR (patient not found)
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
    const token = authHeader?.replace("Bearer ", "").replace("bearer ", "");

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

    // Create patient in EHR
    const ehrResponse = await ehrCreatePatient(body, token);

    if (!ehrResponse.success) {
      return NextResponse.json(
        { success: false, message: ehrResponse.message },
        { status: 400 }
      );
    }

    // Update vital-web database
    const decoded = decodeToken(token);
    const vitalUser = await prisma.vitalUser.findUnique({
      where: { authId: decoded.sub },
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
