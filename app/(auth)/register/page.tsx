"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormFields {
  firstName: string;
  middleName: string;
  lastName: string;
  extensionName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type FormErrors = Partial<Record<keyof FormFields, string>>;

// ─── Terms of Agreement Modal ─────────────────────────────────────────────────

function TermsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl max-h-[80vh] bg-white rounded-2xl shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h3 className="font-heading font-bold text-lg text-bgh-dark">
            Terms of Agreement
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-bgh-dark transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-6 py-5 flex-1 space-y-4 font-sans text-sm text-gray-700 leading-relaxed">
          {/* Skeleton — replace with actual ToS content when available */}
          <p className="font-semibold text-bgh-dark">
            VITAL Patient Portal — Terms and Conditions of Use
          </p>
          <p>
            By registering for and using the VITAL Patient Portal operated by Bernardino General
            Hospital 1, you agree to the following terms and conditions. Please read them carefully
            before proceeding.
          </p>

          <div className="space-y-3">
            {[
              {
                title: "1. Acceptance of Terms",
                body: "Your access to and use of the VITAL portal is conditioned upon your acceptance of and compliance with these terms. These terms apply to all users of the service.",
              },
              {
                title: "2. Patient Data and Privacy",
                body: "By registering, you consent to the collection, storage, and processing of your personal and medical information in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173). Your information will only be used for healthcare delivery, appointment management, and clinical documentation purposes.",
              },
              {
                title: "3. Health Records",
                body: "Information submitted through this portal may be integrated with your electronic health records at Bernardino General Hospital 1. You acknowledge that clinical data recorded by healthcare professionals is immutable and cannot be edited by patients.",
              },
              {
                title: "4. Account Responsibility",
                body: "You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.",
              },
              {
                title: "5. Telemedicine Consent",
                body: "Use of virtual consultation features constitutes your consent to participate in telemedicine services. Virtual consultations are subject to the availability of licensed physicians and are not a substitute for emergency medical care.",
              },
              {
                title: "6. Appointment and Payment Policies",
                body: "Appointment bookings are subject to doctor availability and hospital scheduling policies. Payment obligations for consultations must be fulfilled in accordance with the fee schedule displayed at the time of booking.",
              },
              {
                title: "7. Modifications",
                body: "Bernardino General Hospital 1 reserves the right to update these terms at any time. Continued use of the portal following any changes constitutes acceptance of the revised terms.",
              },
              {
                title: "8. Limitation of Liability",
                body: "The hospital shall not be liable for any indirect, incidental, or consequential damages arising from your use of the portal or reliance on information provided through the service.",
              },
            ].map((section) => (
              <div key={section.title}>
                <p className="font-semibold text-gray-800">{section.title}</p>
                <p>{section.body}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 pt-2">
            Last updated: January 2026. For questions, contact the hospital's Data Privacy Officer.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100">
          <Button fullWidth onClick={onClose}>
            I understand
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Password strength hint ───────────────────────────────────────────────────

function PasswordHint({ password }: { password: string }) {
  const checks = [
    { label: "At least 8 characters", pass: password.length >= 8 },
    { label: "One uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "One lowercase letter", pass: /[a-z]/.test(password) },
    { label: "One number", pass: /[0-9]/.test(password) },
    { label: "One special character", pass: /[^A-Za-z0-9]/.test(password) },
  ];

  if (!password) return null;

  return (
    <ul className="mt-2 space-y-1">
      {checks.map((c) => (
        <li
          key={c.label}
          className={`flex items-center gap-2 text-xs font-sans ${
            c.pass ? "text-bgh-green" : "text-gray-400"
          }`}
        >
          <span>{c.pass ? "✓" : "○"}</span>
          {c.label}
        </li>
      ))}
    </ul>
  );
}

// ─── Main Register Page ───────────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter();

  const [fields, setFields] = useState<FormFields>({
    firstName: "",
    middleName: "",
    lastName: "",
    extensionName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [tosAccepted, setTosAccepted] = useState(false);
  const [tosError, setTosError] = useState("");
  const [showTos, setShowTos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // ── Field handler ─────────────────────────────────────────────────────────

  const handleChange = (key: keyof FormFields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  // ── Validation ────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!fields.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!fields.lastName.trim()) newErrors.lastName = "Last name is required.";

    if (!fields.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!fields.password) {
      newErrors.password = "Password is required.";
    } else {
      const p = fields.password;
      if (
        p.length < 8 ||
        !/[A-Z]/.test(p) ||
        !/[a-z]/.test(p) ||
        !/[0-9]/.test(p) ||
        !/[^A-Za-z0-9]/.test(p)
      ) {
        newErrors.password = "Password does not meet the requirements.";
      }
    }

    if (!fields.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (fields.password !== fields.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    setTosError("");

    if (!validate()) return;

    if (!tosAccepted) {
      setTosError("You must agree to the Terms of Agreement to continue.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: fields.firstName,
          middle_name: fields.middleName || undefined,
          last_name: fields.lastName,
          extension_name: fields.extensionName || undefined,
          email: fields.email,
          password: fields.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setErrors((prev) => ({
            ...prev,
            email: "An account with this email already exists.",
          }));
          return;
        }
        setServerError(data.message ?? "Registration failed. Please try again.");
        return;
      }

      // Store email so the verify page can use it
      sessionStorage.setItem("verify_email", fields.email);
      router.push("/verify");
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      {showTos && <TermsModal onClose={() => setShowTos(false)} />}

      <main className="min-h-screen bg-bgh-bg flex items-start justify-center py-10 px-4">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm px-8 py-10">

          {/* Back to Login */}
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-sm font-sans text-bgh-green hover:text-bgh-dark transition-colors mb-6"
          >
            ← Back to Login
          </Link>

          {/* Title */}
          <h2 className="font-heading text-3xl font-bold text-bgh-dark mb-1">
            Patient Registration
          </h2>
          <p className="font-sans text-sm text-gray-500 mb-8">
            Create your VITAL account to get started.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="Juan"
                value={fields.firstName}
                error={errors.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
              <Input
                label="Last Name"
                placeholder="Dela Cruz"
                value={fields.lastName}
                error={errors.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
            </div>

            {/* Optional name fields */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Middle Name (Optional)"
                placeholder="Santos"
                value={fields.middleName}
                onChange={(e) => handleChange("middleName", e.target.value)}
              />
              <Input
                label="Extension Name (Optional)"
                placeholder="Jr., Sr., III"
                value={fields.extensionName}
                onChange={(e) => handleChange("extensionName", e.target.value)}
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="juan.delacruz@email.com"
              value={fields.email}
              error={errors.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Create a strong password"
                value={fields.password}
                error={errors.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
              <PasswordHint password={fields.password} />
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              value={fields.confirmPassword}
              error={errors.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
            />

            {/* Terms of Agreement */}
            <div className="space-y-1">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tosAccepted}
                  onChange={(e) => {
                    setTosAccepted(e.target.checked);
                    if (e.target.checked) setTosError("");
                  }}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-bgh-green flex-shrink-0"
                />
                <span className="font-sans text-sm text-gray-700 leading-relaxed">
                  I have read and agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setShowTos(true)}
                    className="font-semibold text-bgh-green underline underline-offset-2 hover:text-bgh-dark transition-colors"
                  >
                    Terms of Agreement
                  </button>
                  {" "}and consent to the collection and use of my personal and medical data
                  in accordance with the Data Privacy Act of 2012.
                </span>
              </label>
              {tosError && (
                <p className="font-sans text-xs text-bgh-red pl-7">{tosError}</p>
              )}
            </div>

            {serverError && (
              <p className="text-sm font-sans text-bgh-red text-center">{serverError}</p>
            )}

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-gray-600 mt-6 font-sans text-sm">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-bgh-dark hover:text-bgh-green transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}