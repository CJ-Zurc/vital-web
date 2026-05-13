"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Step1Fields {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface Step2Fields {
  dateOfBirth: string;
  sex: string;
  philHealthId: string;
  phoneNumber: string;
  address: string;
  medicalHistory: string;
}

type FormErrors<T> = Partial<Record<keyof T, string>>;

// ─── Constants ────────────────────────────────────────────────────────────────

const SEX_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
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

// ─── Step 1: Account Creation ─────────────────────────────────────────────────

function Step1({
  fields,
  errors,
  onChange,
}: {
  fields: Step1Fields;
  errors: FormErrors<Step1Fields>;
  onChange: (key: keyof Step1Fields, value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <h3 className="font-heading font-bold text-xl text-gray-800 mb-1">
        Account Creation
      </h3>

      {/* First Name + Last Name row */}
      <div className="grid grid-cols-2 gap-4">
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
      </div>

      <Input
        label="Email Address"
        type="email"
        placeholder="juan.delacruz@email.com"
        value={fields.email}
        error={errors.email}
        onChange={(e) => onChange("email", e.target.value)}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Create a strong password"
        value={fields.password}
        error={errors.password}
        onChange={(e) => onChange("password", e.target.value)}
      />

      <Input
        label="Confirm Password"
        type="password"
        placeholder="Re-enter your password"
        value={fields.confirmPassword}
        error={errors.confirmPassword}
        onChange={(e) => onChange("confirmPassword", e.target.value)}
      />
    </div>
  );
}

// ─── Step 2: Profile Completion ───────────────────────────────────────────────

function Step2({
  fields,
  errors,
  onChange,
}: {
  fields: Step2Fields;
  errors: FormErrors<Step2Fields>;
  onChange: (key: keyof Step2Fields, value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <h3 className="font-heading font-bold text-xl text-gray-800 mb-1">
        Profile Completion
      </h3>

      {/* Date of Birth + Sex row */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Date of Birth"
          type="date"
          placeholder="mm/dd/yyyy"
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
      </div>

      <Input
        label="PhilHealth ID (Optional)"
        placeholder="12-345678901-2"
        value={fields.philHealthId}
        onChange={(e) => onChange("philHealthId", e.target.value)}
      />

      <Input
        label="Phone Number"
        type="tel"
        placeholder="+63 912 345 6789"
        value={fields.phoneNumber}
        error={errors.phoneNumber}
        onChange={(e) => onChange("phoneNumber", e.target.value)}
      />

      <Textarea
        label="Complete Address"
        placeholder="Street, Barangay, City, Province"
        value={fields.address}
        error={errors.address}
        onChange={(e) => onChange("address", e.target.value)}
      />

      <Textarea
        label="Basic Medical History (Optional)"
        placeholder="Any allergies, chronic conditions, or important medical information..."
        value={fields.medicalHistory}
        onChange={(e) => onChange("medicalHistory", e.target.value)}
        rows={4}
      />
    </div>
  );
}

// ─── Main Registration Page ───────────────────────────────────────────────────

export default function RegisterPage() {
  const [step, setStep] = useState(1);

  const [step1, setStep1] = useState<Step1Fields>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [step2, setStep2] = useState<Step2Fields>({
    dateOfBirth: "",
    sex: "",
    philHealthId: "",
    phoneNumber: "",
    address: "",
    medicalHistory: "",
  });

  const [errors1, setErrors1] = useState<FormErrors<Step1Fields>>({});
  const [errors2, setErrors2] = useState<FormErrors<Step2Fields>>({});

  // ── Handlers ──────────────────────────────────────────────────────────────

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
    const newErrors: FormErrors<Step1Fields> = {};

    if (!step1.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!step1.lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!step1.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(step1.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!step1.password) {
      newErrors.password = "Password is required.";
    } else if (step1.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }
    if (!step1.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (step1.password !== step1.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors1(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors<Step2Fields> = {};

    if (!step2.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required.";
    if (!step2.sex) newErrors.sex = "Please select your sex.";
    if (!step2.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required.";
    if (!step2.address.trim()) newErrors.address = "Complete address is required.";

    setErrors2(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Navigation ────────────────────────────────────────────────────────────

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handlePrevious = () => {
    setStep(1);
  };

  const handleSubmit = () => {
    if (!validateStep2()) return;
    // TODO: call registration API
    console.log("Registration payload:", { ...step1, ...step2 });
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-bgh-bg flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm px-8 py-10">
        {/* Back to Login */}
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-sm font-sans text-bgh-green hover:text-bgh-dark transition-colors mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Login
        </Link>

        {/* Title */}
        <h2 className="font-heading text-3xl font-bold text-gray-900 mb-1">
          Patient Registration
        </h2>
        <p className="font-sans text-sm text-gray-500 mb-6">
          Step {step} of {TOTAL_STEPS}
        </p>

        {/* Progress bar */}
        <StepProgressBar currentStep={step} />

        {/* Step content */}
        {step === 1 ? (
          <Step1 fields={step1} errors={errors1} onChange={handleStep1Change} />
        ) : (
          <Step2 fields={step2} errors={errors2} onChange={handleStep2Change} />
        )}

        {/* Footer actions */}
        <div className="mt-8 flex gap-3">
          {step === 2 && (
            <Button variant="secondary" onClick={handlePrevious} className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
          )}

          {step === 1 ? (
            <Button variant="primary" fullWidth onClick={handleNext} className="gap-1">
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="primary" fullWidth onClick={handleSubmit}>
              Complete Registration
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}