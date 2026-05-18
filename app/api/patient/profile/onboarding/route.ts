import { NextRequest, NextResponse } from "next/server";
import {
  gatewayCreatePatientSelf,
  GatewayRequestError,
  gatewayGetEHRPatientMe,
  gatewayUpdateEHRPatient,
  gatewayGetMe,
} from "@/lib/gateway";
import { attachBffSessionHeaders, requireBffSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─── POST /api/patient/profile/onboarding ─────────────────────────────────────
//
// Two paths depending on isRecordAvailable:
//
// A) New patient (isRecordAvailable = false):
//    → Validate all required fields
//    → gatewayCreatePatientSelf (POST /ehr/patients/me) with full payload
//    → Mark isRecordAvailable + isOnboardingComplete in VITAL DB
//
// B) BGH account holder (isRecordAvailable = true):
//    → Fetch existing EHR record to get patient_id
//    → gatewayUpdateEHRPatient with only editable fields
//    → Mark isOnboardingComplete in VITAL DB
//    → Clinical identity fields (name, DOB, sex) are NOT sent — EHR owns them
//
// The BFF session helper resolves the caller from Authorization or Gateway session bootstrap.

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

function text(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function errorStatus(error: unknown, fallback: number): number {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number"
  ) {
    return error.status;
  }
  return fallback;
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireBffSession(req);
    const { accessToken, authId } = session;

    // ── Load VitalPatient ──
    let vitalPatient = await prisma.vitalPatient.findUnique({
      where: { authId },
    });

    if (!vitalPatient) {
      const vitalUser = await prisma.vitalUser.findUnique({ where: { authId } });
      vitalPatient = await prisma.vitalPatient.create({
        data: {
          userId: vitalUser?.id ?? authId,
          authId,
          isRecordAvailable: false,
          isOnboardingComplete: false,
        },
      });
    }

    if (vitalPatient.isOnboardingComplete) {
      return NextResponse.json(
        { success: false, message: "Onboarding already completed." },
        { status: 409 },
      );
    }

    const body = await req.json() as Record<string, unknown>;

    // ─────────────────────────────────────────────────────────────────────────
    // PATH A — New patient: no EHR record yet
    // ─────────────────────────────────────────────────────────────────────────
    if (!vitalPatient.isRecordAvailable) {
      // For new patients, try to use identity fields from the request. If
      // they're missing (we already collected them at registration), fetch
      // the authenticated user's profile from the gateway and use those.
      let first_name = text(body.first_name);
      let last_name = text(body.last_name);
      let middle_name = text(body.middle_name);
      let extension_name = text(body.extension_name);
      let email = text(body.email);
      const date_of_birth = text(body.date_of_birth);
      const sex = text(body.sex);
      const contact_number = text(body.contact_number);
      const religion = text(body.religion);
      const address_street = text(body.address_street);
      const address_barangay = text(body.address_barangay);
      const address_city_municipality = text(body.address_city_municipality);
      const address_province_region = text(body.address_province_region);
      const address_postal_code = text(body.address_postal_code);
      const address_country = text(body.address_country);
      const blood_type = text(body.blood_type);
      const philhealth_identification_number = text(body.philhealth_identification_number);
      const patient_type = text(body.patient_type);

      // If the client didn't include identity fields, try to fetch them
      // from the auth gateway (registration step should have them).
      if (!first_name || !last_name) {
        try {
          const meRes = await gatewayGetMe(accessToken);
          if (meRes.success && meRes.data) {
            first_name = first_name || meRes.data.first_name;
            last_name = last_name || meRes.data.last_name;
            email = email || meRes.data.email;
            middle_name = middle_name || meRes.data.middle_name;
            extension_name = extension_name || meRes.data.extension_name;
          }
        } catch {
          // ignore — we'll validate below and return an error if still missing
        }
      }

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

      if (!["male", "female"].includes((sex || "").toLowerCase())) {
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
        const ehrRes = await gatewayCreatePatientSelf(
          {
            first_name,
            last_name,
            date_of_birth,
            sex: (sex || "").toLowerCase(),
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
      } catch (err: unknown) {
        console.error("EHR self-registration failed:", {
          status: errorStatus(err, 502),
          message: errorMessage(err, "Failed to create health record."),
        });
        return NextResponse.json(
          {
            success: false,
            message: errorMessage(err, "Failed to create health record."),
            upstreamStatus: errorStatus(err, 502),
          },
          { status: errorStatus(err, 502) },
        );
      }

      await prisma.vitalPatient.update({
        where: { userId: vitalPatient.userId },
        data: { isOnboardingComplete: true, isRecordAvailable: true },
      });

      return attachBffSessionHeaders(NextResponse.json({
        success: true,
        message: "Onboarding complete.",
        data: { isOnboardingComplete: true, isRecordAvailable: true },
      }), session);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PATH B — BGH account holder: EHR record exists, patch editable fields
    // ─────────────────────────────────────────────────────────────────────────

    // Fetch existing EHR record to get the patient_id needed for PATCH
    let patientId: string;
    try {
      const ehrRes = await gatewayGetEHRPatientMe(accessToken);
      if (!ehrRes.success || !ehrRes.data) {
        return NextResponse.json(
          { success: false, message: "Could not retrieve your existing health record." },
          { status: 502 },
        );
      }
      patientId = ehrRes.data.patient_id;
    } catch (err: unknown) {
      return NextResponse.json(
        { success: false, message: errorMessage(err, "Failed to retrieve health record.") },
        { status: errorStatus(err, 502) },
      );
    }

    // Only pick editable fields from the request body — never touch clinical identity
    const editablePayload = EDITABLE_EHR_FIELDS.reduce(
      (acc, field: EditableEHRField) => {
        const value = text(body[field]);
        if (value !== undefined && value !== "") {
          acc[field] = value;
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
      } catch (err: unknown) {
        return NextResponse.json(
          { success: false, message: errorMessage(err, "Failed to update health record.") },
          { status: errorStatus(err, 502) },
        );
      }
    }

    // Mark onboarding complete
    await prisma.vitalPatient.update({
      where: { userId: vitalPatient.userId },
      data: { isOnboardingComplete: true },
    });

    return attachBffSessionHeaders(NextResponse.json({
      success: true,
      message: "Onboarding complete.",
      data: { isOnboardingComplete: true, isRecordAvailable: true },
    }), session);
  } catch (error: unknown) {
    if (error instanceof GatewayRequestError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status },
      );
    }
    return NextResponse.json(
      { success: false, message: errorMessage(error, "Onboarding failed.") },
      { status: 500 },
    );
  }
}
