"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Lock, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Step1Fields {
  firstName: string;
  middleName: string;
  lastName: string;
  extensionName: string;
  dateOfBirth: string;
  sex: string;
  contactNumber: string;
  email: string;
}

interface Step2Fields {
  addressStreet: string;
  addressBarangay: string;
  addressCityMunicipality: string;
  addressProvinceRegion: string;
  addressPostalCode: string;
  addressCountry: string;
  bloodType: string;
  philhealthId: string;
  patientType: string;
  religion: string;
}

type Step1Errors = Partial<Record<keyof Step1Fields, string>>;
type Step2Errors = Partial<Record<keyof Step2Fields, string>>;

// ─── Constants ────────────────────────────────────────────────────────────────

const SEX_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const BLOOD_TYPE_OPTIONS = [
  { value: "", label: "Unknown" },
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
];

const PATIENT_TYPE_OPTIONS = [
  { value: "", label: "Select patient type..." },
  { value: "outpatient", label: "Outpatient" },
  { value: "inpatient", label: "Inpatient" },
  { value: "er", label: "Emergency" },
];

const TOTAL_STEPS = 2;

// ─── Step Progress Bar ────────────────────────────────────────────────────────

function StepProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex gap-2 mb-8">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div
          key={i}
          className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
            i < currentStep ? "bg-bgh-green" : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Locked field indicator ───────────────────────────────────────────────────

function LockedInput({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-sans font-semibold text-sm text-gray-800 flex items-center gap-1.5">
        {label}
        <Lock className="w-3 h-3 text-gray-400" />
      </label>
      <div className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 font-sans text-sm text-gray-500 opacity-80">
        {value || "—"}
      </div>
    </div>
  );
}

// ─── BGH Record Banner ───────────────────────────────────────────────────────

function ExistingRecordBanner() {
  return (
    <div className="rounded-lg border border-bgh-soft bg-green-50 px-4 py-3 mb-6">
      <p className="font-sans text-sm font-semibold text-bgh-dark mb-1">
        Existing BGH record detected
      </p>
      <p className="font-sans text-xs text-gray-600 leading-relaxed">
        We found an existing patient record linked to your account at Bernardino General Hospital.
        Your clinical identity (name, date of birth, sex) has been pre-filled and cannot be edited.
        You may update your contact details, address, and other information below.
      </p>
    </div>
  );
}

// ─── Profile Picture Placeholder ─────────────────────────────────────────────

function ProfilePicUpload() {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-sans font-semibold text-sm text-gray-800">
        Profile Picture <span className="font-normal text-gray-400">(Optional)</span>
      </label>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0">
          <ImagePlus className="w-6 h-6 text-gray-400" />
        </div>
        <div>
          <button
            type="button"
            disabled
            className="font-sans text-sm font-semibold text-bgh-green opacity-50 cursor-not-allowed"
          >
            Upload photo
          </button>
          <p className="font-sans text-xs text-gray-400 mt-0.5">
            Photo upload will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Step 1: Personal Information ─────────────────────────────────────────────

function Step1Form({
  fields,
  errors,
  locked,
  onChange,
}: {
  fields: Step1Fields;
  errors: Step1Errors;
  locked: boolean;
  onChange: (key: keyof Step1Fields, value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-heading font-bold text-xl text-bgh-dark mb-1">
          Personal Information
        </h3>
        <p className="font-sans text-sm text-gray-500">
          Tell us about yourself so we can set up your health profile.
        </p>
      </div>

      {locked && <ExistingRecordBanner />}

      <ProfilePicUpload />

      {/* Name fields */}
      <div className="grid grid-cols-2 gap-4">
        {locked ? (
          <>
            <LockedInput label="First Name" value={fields.firstName} />
            <LockedInput label="Last Name" value={fields.lastName} />
          </>
        ) : (
          <>
            <Input
              label="First Name"
              placeholder="Juan"
              value={fields.firstName}
              error={errors.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
            />
            <Input
              label="Last Name"
              placeholder="Dela Cruz"
              value={fields.lastName}
              error={errors.lastName}
              onChange={(e) => onChange("lastName", e.target.value)}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {locked ? (
          <>
            <LockedInput label="Middle Name" value={fields.middleName} />
            <LockedInput label="Extension Name" value={fields.extensionName} />
          </>
        ) : (
          <>
            <Input
              label="Middle Name (Optional)"
              placeholder="Santos"
              value={fields.middleName}
              onChange={(e) => onChange("middleName", e.target.value)}
            />
            <Input
              label="Extension Name (Optional)"
              placeholder="Jr., Sr., III"
              value={fields.extensionName}
              onChange={(e) => onChange("extensionName", e.target.value)}
            />
          </>
        )}
      </div>

      {/* DOB + Sex */}
      <div className="grid grid-cols-2 gap-4">
        {locked ? (
          <>
            <LockedInput label="Date of Birth" value={fields.dateOfBirth} />
            <LockedInput label="Sex" value={fields.sex} />
          </>
        ) : (
          <>
            <Input
              label="Date of Birth"
              type="date"
              value={fields.dateOfBirth}
              error={errors.dateOfBirth}
              onChange={(e) => onChange("dateOfBirth", e.target.value)}
            />
            <Select
              label="Sex"
              value={fields.sex}
              error={errors.sex}
              options={SEX_OPTIONS}
              placeholder="Select..."
              onChange={(e) => onChange("sex", e.target.value)}
            />
          </>
        )}
      </div>

      {/* Contact + Email — always editable */}
      <Input
        label="Contact Number"
        type="tel"
        placeholder="+63 912 345 6789"
        value={fields.contactNumber}
        error={errors.contactNumber}
        onChange={(e) => onChange("contactNumber", e.target.value)}
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="juan.delacruz@email.com"
        value={fields.email}
        error={errors.email}
        onChange={(e) => onChange("email", e.target.value)}
      />
    </div>
  );
}

// ─── Step 2: Address & Medical Details ────────────────────────────────────────

function Step2Form({
  fields,
  errors,
  onChange,
}: {
  fields: Step2Fields;
  errors: Step2Errors;
  onChange: (key: keyof Step2Fields, value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-heading font-bold text-xl text-bgh-dark mb-1">
          Address & Medical Details
        </h3>
        <p className="font-sans text-sm text-gray-500">
          This information helps your doctor provide better care.
        </p>
      </div>

      <Input
        label="Street Address"
        placeholder="123 Rizal St."
        value={fields.addressStreet}
        error={errors.addressStreet}
        onChange={(e) => onChange("addressStreet", e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Barangay"
          placeholder="Brgy. San Jose"
          value={fields.addressBarangay}
          error={errors.addressBarangay}
          onChange={(e) => onChange("addressBarangay", e.target.value)}
        />
        <Input
          label="City / Municipality"
          placeholder="Quezon City"
          value={fields.addressCityMunicipality}
          error={errors.addressCityMunicipality}
          onChange={(e) => onChange("addressCityMunicipality", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Province / Region"
          placeholder="Metro Manila"
          value={fields.addressProvinceRegion}
          error={errors.addressProvinceRegion}
          onChange={(e) => onChange("addressProvinceRegion", e.target.value)}
        />
        <Input
          label="Postal Code"
          placeholder="1100"
          value={fields.addressPostalCode}
          onChange={(e) => onChange("addressPostalCode", e.target.value)}
        />
      </div>

      <Input
        label="Country"
        placeholder="Philippines"
        value={fields.addressCountry}
        onChange={(e) => onChange("addressCountry", e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Blood Type (Optional)"
          value={fields.bloodType}
          options={BLOOD_TYPE_OPTIONS}
          onChange={(e) => onChange("bloodType", e.target.value)}
        />
        <Select
          label="Patient Type (Optional)"
          value={fields.patientType}
          options={PATIENT_TYPE_OPTIONS}
          onChange={(e) => onChange("patientType", e.target.value)}
        />
      </div>

      <Input
        label="PhilHealth ID (Optional)"
        placeholder="12-345678901-2"
        value={fields.philhealthId}
        onChange={(e) => onChange("philhealthId", e.target.value)}
      />

      <Input
        label="Religion (Optional)"
        placeholder="Roman Catholic"
        value={fields.religion}
        onChange={(e) => onChange("religion", e.target.value)}
      />
    </div>
  );
}

// ─── Main Onboarding Page ─────────────────────────────────────────────────────

export default function PatientOnboardingPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [serverError, setServerError] = useState("");
  const [isRecordAvailable, setIsRecordAvailable] = useState(false);

  const [step1, setStep1] = useState<Step1Fields>({
    firstName: "",
    middleName: "",
    lastName: "",
    extensionName: "",
    dateOfBirth: "",
    sex: "",
    contactNumber: "",
    email: "",
  });

  const [step2, setStep2] = useState<Step2Fields>({
    addressStreet: "",
    addressBarangay: "",
    addressCityMunicipality: "",
    addressProvinceRegion: "",
    addressPostalCode: "",
    addressCountry: "Philippines",
    bloodType: "",
    philhealthId: "",
    patientType: "",
    religion: "",
  });

  const [errors1, setErrors1] = useState<Step1Errors>({});
  const [errors2, setErrors2] = useState<Step2Errors>({});

  // ── On mount: check session + pre-fill EHR if available ──────────────────

  useEffect(() => {
    async function bootstrap() {
      const token = sessionStorage.getItem("access_token");
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        // Try to fetch existing EHR record
        const res = await fetch("/api/patient/record", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            const ehr = data.data;
            setIsRecordAvailable(true);
            // Pre-fill step 1 from EHR
            setStep1({
              firstName: ehr.first_name ?? "",
              middleName: ehr.middle_name ?? "",
              lastName: ehr.last_name ?? "",
              extensionName: ehr.extension_name ?? "",
              dateOfBirth: ehr.date_of_birth ?? "",
              sex: ehr.sex ?? "",
              contactNumber: ehr.contact_number ?? "",
              email: ehr.email ?? "",
            });
            // Pre-fill step 2 from EHR
            setStep2({
              addressStreet: ehr.address_street ?? "",
              addressBarangay: ehr.address_barangay ?? "",
              addressCityMunicipality: ehr.address_city_municipality ?? "",
              addressProvinceRegion: ehr.address_province_region ?? "",
              addressPostalCode: ehr.address_postal_code ?? "",
              addressCountry: ehr.address_country ?? "Philippines",
              bloodType: ehr.blood_type ?? "",
              philhealthId: ehr.philhealth_identification_number ?? "",
              patientType: ehr.patient_type ?? "",
              religion: ehr.religion ?? "",
            });
          }
        }
      } catch {
        // No EHR record — new patient, blank form is correct
      } finally {
        setPageLoading(false);
      }
    }

    bootstrap();
  }, [router]);

  // ── Field handlers ────────────────────────────────────────────────────────

  const handleStep1Change = (key: keyof Step1Fields, value: string) => {
    setStep1((prev) => ({ ...prev, [key]: value }));
    if (errors1[key]) setErrors1((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleStep2Change = (key: keyof Step2Fields, value: string) => {
    setStep2((prev) => ({ ...prev, [key]: value }));
    if (errors2[key]) setErrors2((prev) => ({ ...prev, [key]: undefined }));
  };

  // ── Validation ────────────────────────────────────────────────────────────

  const validateStep1 = (): boolean => {
    // BGH holders: identity fields are locked, only validate editable ones
    if (isRecordAvailable) {
      const newErrors: Step1Errors = {};
      if (!step1.contactNumber.trim()) newErrors.contactNumber = "Contact number is required.";
      if (!step1.email.trim()) newErrors.email = "Email is required.";
      setErrors1(newErrors);
      return Object.keys(newErrors).length === 0;
    }

    const newErrors: Step1Errors = {};
    if (!step1.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!step1.lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!step1.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required.";
    if (!step1.sex) newErrors.sex = "Sex is required.";
    if (!step1.contactNumber.trim()) newErrors.contactNumber = "Contact number is required.";
    if (!step1.email.trim()) newErrors.email = "Email is required.";
    setErrors1(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Step2Errors = {};
    if (!step2.addressStreet.trim()) newErrors.addressStreet = "Street address is required.";
    if (!step2.addressBarangay.trim()) newErrors.addressBarangay = "Barangay is required.";
    if (!step2.addressCityMunicipality.trim()) newErrors.addressCityMunicipality = "City / Municipality is required.";
    if (!step2.addressProvinceRegion.trim()) newErrors.addressProvinceRegion = "Province / Region is required.";
    setErrors2(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Navigation ────────────────────────────────────────────────────────────

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setServerError("");
    setLoading(true);

    const token = sessionStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const payload = {
        // Identity (only sent for new patients — backend ignores for BGH holders)
        first_name: step1.firstName,
        middle_name: step1.middleName || undefined,
        last_name: step1.lastName,
        extension_name: step1.extensionName || undefined,
        date_of_birth: step1.dateOfBirth,
        sex: step1.sex,
        // Always sent (editable for all)
        contact_number: step1.contactNumber || undefined,
        email: step1.email || undefined,
        address_street: step2.addressStreet || undefined,
        address_barangay: step2.addressBarangay || undefined,
        address_city_municipality: step2.addressCityMunicipality || undefined,
        address_province_region: step2.addressProvinceRegion || undefined,
        address_postal_code: step2.addressPostalCode || undefined,
        address_country: step2.addressCountry || undefined,
        blood_type: step2.bloodType || undefined,
        philhealth_identification_number: step2.philhealthId || undefined,
        patient_type: step2.patientType || undefined,
        religion: step2.religion || undefined,
      };

      const res = await fetch("/api/patient/profile/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message ?? "Onboarding failed. Please try again.");
        return;
      }

      // Clear onboarding flag and redirect to dashboard
      sessionStorage.setItem("onboarding_complete", "true");
      router.push("/patient/dashboard");
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Page loading state ────────────────────────────────────────────────────

  if (pageLoading) {
    return (
      <main className="min-h-screen bg-bgh-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-bgh-green border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-sans text-sm text-gray-500">Setting up your profile...</p>
        </div>
      </main>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-bgh-bg flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm px-8 py-10">

        {/* Header */}
        <div className="mb-2">
          <span className="inline-block bg-green-50 text-bgh-green font-sans text-xs font-semibold px-3 py-1 rounded-full mb-4">
            Account Setup
          </span>
          <h2 className="font-heading text-3xl font-bold text-bgh-dark mb-1">
            Complete your profile
          </h2>
          <p className="font-sans text-sm text-gray-500">
            Step {step} of {TOTAL_STEPS} — {step === 1 ? "Personal Information" : "Address & Medical Details"}
          </p>
        </div>

        <div className="mt-6">
          <StepProgressBar currentStep={step} />
        </div>

        {/* Step content */}
        {step === 1 ? (
          <Step1Form
            fields={step1}
            errors={errors1}
            locked={isRecordAvailable}
            onChange={handleStep1Change}
          />
        ) : (
          <Step2Form
            fields={step2}
            errors={errors2}
            onChange={handleStep2Change}
          />
        )}

        {serverError && (
          <p className="font-sans text-sm text-bgh-red text-center mt-4">{serverError}</p>
        )}

        {/* Footer navigation */}
        <div className="mt-8 flex gap-3">
          {step === 2 && (
            <Button
              variant="secondary"
              onClick={() => setStep(1)}
              disabled={loading}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          )}

          {step === 1 ? (
            <Button variant="primary" fullWidth onClick={handleNext}>
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="primary" fullWidth onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Complete Setup"}
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}