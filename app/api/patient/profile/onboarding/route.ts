import { NextRequest, NextResponse } from "next/server";
import {
  gatewayCreateEHRPatient,
  gatewayGetEHRPatientByAuthId,
  gatewayUpdateEHRPatient,
} from "@/lib/gateway";
import { extractBearerToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─── POST /api/patient/profile/onboarding ─────────────────────────────────────
//
// Two paths depending on isRecordAvailable:
//
// A) New patient (isRecordAvailable = false):
//    → Validate all required fields
//    → gatewayCreateEHRPatient with full payload
//    → Mark isRecordAvailable + isOnboardingComplete in VITAL DB
//
// B) BGH account holder (isRecordAvailable = true):
//    → Fetch existing EHR record to get patient_id
//    → gatewayUpdateEHRPatient with only editable fields
//    → Mark isOnboardingComplete in VITAL DB
//    → Clinical identity fields (name, DOB, sex) are NOT sent — EHR owns them
//
// RBAC middleware guarantees x-vital-user-id and x-auth-id headers are injected.

// Editable fields for BGH holders — clinical identity is excluded
const EDITABLE_EHR_FIELDS = [
  "contact_number",
  "email",
  "religion",
  "address_street",
  "address_barangay",
  "address_city_municipality",
  "address_province_region",
  "address_postal_code",
  "address_country",
  "blood_type",
  "philhealth_identification_number",
  "patient_type",
] as const;

type EditableEHRField = (typeof EDITABLE_EHR_FIELDS)[number];

export async function POST(req: NextRequest) {
  try {
    const accessToken = extractBearerToken(req.headers.get("authorization"));
    const vitalUserId = req.headers.get("x-vital-user-id");
    const authId = req.headers.get("x-auth-id");

    if (!accessToken || !vitalUserId || !authId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 },
      );
    }

    // ── Load VitalPatient ──
    const vitalPatient = await prisma.vitalPatient.findUnique({
      where: { userId: vitalUserId },
    });

    if (!vitalPatient) {
      return NextResponse.json(
        { success: false, message: "Patient record not found." },
        { status: 404 },
      );
    }

    if (vitalPatient.isOnboardingComplete) {
      return NextResponse.json(
        { success: false, message: "Onboarding already completed." },
        { status: 409 },
      );
    }

    const body = await req.json();

    // ─────────────────────────────────────────────────────────────────────────
    // PATH A — New patient: no EHR record yet
    // ─────────────────────────────────────────────────────────────────────────
    if (!vitalPatient.isRecordAvailable) {
      const {
        first_name,
        last_name,
        date_of_birth,
        sex,
        middle_name,
        extension_name,
        contact_number,
        email,
        religion,
        address_street,
        address_barangay,
        address_city_municipality,
        address_province_region,
        address_postal_code,
        address_country,
        blood_type,
        philhealth_identification_number,
        patient_type,
      } = body;

      // Required fields for new patients
      if (!first_name || !last_name || !date_of_birth || !sex) {
        return NextResponse.json(
          {
            success: false,
            message: "First name, last name, date of birth, and sex are required.",
          },
          { status: 400 },
        );
      }

      if (!["male", "female"].includes(sex.toLowerCase())) {
        return NextResponse.json(
          { success: false, message: "Sex must be 'male' or 'female'." },
          { status: 400 },
        );
      }

      const dob = new Date(date_of_birth);
      if (isNaN(dob.getTime()) || dob >= new Date()) {
        return NextResponse.json(
          { success: false, message: "Invalid date of birth." },
          { status: 400 },
        );
      }

      try {
        const ehrRes = await gatewayCreateEHRPatient(
          {
            first_name,
            last_name,
            date_of_birth,
            sex: sex.toLowerCase(),
            middle_name,
            extension_name,
            contact_number,
            email,
            religion,
            address_street,
            address_barangay,
            address_city_municipality,
            address_province_region,
            address_postal_code,
            address_country,
            blood_type,
            philhealth_identification_number,
            patient_type,
          },
          accessToken,
        );

        if (!ehrRes.success || !ehrRes.data) {
          return NextResponse.json(
            {
              success: false,
              message: ehrRes.message ?? "Failed to create health record. Please try again.",
            },
            { status: 502 },
          );
        }
      } catch (err: any) {
        return NextResponse.json(
          { success: false, message: err.message ?? "Failed to create health record." },
          { status: err.status ?? 502 },
        );
      }

      await prisma.vitalPatient.update({
        where: { userId: vitalUserId },
        data: { isOnboardingComplete: true, isRecordAvailable: true },
      });

      return NextResponse.json({
        success: true,
        message: "Onboarding complete.",
        data: { isOnboardingComplete: true, isRecordAvailable: true },
      });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PATH B — BGH account holder: EHR record exists, patch editable fields
    // ─────────────────────────────────────────────────────────────────────────

    // Fetch existing EHR record to get the patient_id needed for PATCH
    let patientId: string;
    try {
      const ehrRes = await gatewayGetEHRPatientByAuthId(authId, accessToken);
      if (!ehrRes.success || !ehrRes.data) {
        return NextResponse.json(
          { success: false, message: "Could not retrieve your existing health record." },
          { status: 502 },
        );
      }
      patientId = ehrRes.data.patient_id;
    } catch (err: any) {
      return NextResponse.json(
        { success: false, message: err.message ?? "Failed to retrieve health record." },
        { status: err.status ?? 502 },
      );
    }

    // Only pick editable fields from the request body — never touch clinical identity
    const editablePayload = EDITABLE_EHR_FIELDS.reduce(
      (acc, field: EditableEHRField) => {
        if (body[field] !== undefined && body[field] !== "") {
          acc[field] = body[field];
        }
        return acc;
      },
      {} as Record<EditableEHRField, string>,
    );

    if (Object.keys(editablePayload).length > 0) {
      try {
        const patchRes = await gatewayUpdateEHRPatient(
          patientId,
          editablePayload,
          accessToken,
        );

        if (!patchRes.success) {
          return NextResponse.json(
            {
              success: false,
              message: patchRes.message ?? "Failed to update health record.",
            },
            { status: 502 },
          );
        }
      } catch (err: any) {
        return NextResponse.json(
          { success: false, message: err.message ?? "Failed to update health record." },
          { status: err.status ?? 502 },
        );
      }
    }

    // Mark onboarding complete
    await prisma.vitalPatient.update({
      where: { userId: vitalUserId },
      data: { isOnboardingComplete: true },
    });

    return NextResponse.json({
      success: true,
      message: "Onboarding complete.",
      data: { isOnboardingComplete: true, isRecordAvailable: true },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message ?? "Onboarding failed." },
      { status: 500 },
    );
  }
}