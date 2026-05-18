"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { setClientSession } from "@/lib/client-session"

export default function VerifyPage() {
  const router = useRouter()
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [error, setError] = useState("")
  const [email] = useState(() => {
    if (typeof window === "undefined") {
      return ""
    }
    return sessionStorage.getItem("verify_email") || sessionStorage.getItem("mfa_email") || ""
  })
  const [loading, setLoading] = useState(false)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return
    const next = [...code]
    next[index] = value.slice(-1)
    setCode(next)
    if (value && index < 5) {
      inputs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const next = [...code]
    pasted.split("").forEach((char, i) => { next[i] = char })
    setCode(next)
    inputs.current[Math.min(pasted.length, 5)]?.focus()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    const fullCode = code.join("")
    if (fullCode.length < 6) {
      setError("Please enter the complete 6-digit code.")
      return
    }
    if (!email) {
      setError("No email found for verification. Please return to registration.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: fullCode }),
      })

      const data = await res.json()

      if (!res.ok) {
        // handle common cases
        if (res.status === 400 || res.status === 401) {
          setError(data.message ?? "Invalid verification code.")
          return
        }
        setError(data.message ?? "Verification failed. Please try again.")
        return
      }

      // Success — store token and role like login
      const { access_token, role: vitalRole, isOnboardingComplete, vitalUserId, authId } = data.data
      setClientSession({
        access_token,
        role: vitalRole,
        vitalUserId,
        authId,
        isOnboardingComplete,
        isRecordAvailable: data.data.isRecordAvailable,
      })

      if (vitalRole === "admin") {
        router.push("/dashboard")
        return
      }
      if (vitalRole === "doctor") {
        router.push("/doctor/dashboard")
        return
      }
      if (!isOnboardingComplete) {
        router.push("/onboarding")
        return
      }
      router.push("/patient/dashboard")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (!email) {
      setError("No email available to resend to.")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/verify/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 503) router.push("/otp-unavailable")
        else setError(data.message ?? "Could not resend code. Try again later.")
        return
      }
      // Inform user that code was resent
      setError("A new code has been sent to your email.")
    } catch {
      setError("Unable to resend verification code. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex" style={{ backgroundColor: "#F2F2F2" }}>
      <aside
        className="hidden md:flex w-1/2 items-center px-16 justify-center"
        style={{ backgroundColor: "#142608" }}
      >
        <div>
          <h1 className="text-5xl font-bold mb-6 font-heading text-white">VITAL</h1>
          <p className="text-xl max-w-lg mb-6 font-sans leading-relaxed text-white">
            Virtual Interactive Telemedicine & Appointment Log
          </p>
          <p className="text-sm font-sans text-white" style={{ opacity: 0.8 }}>
            Bernardino General Hospital 1
          </p>
        </div>
      </aside>

      <section className="flex-1 flex items-center justify-center px-6 bg-white">
        <div className="w-full max-w-md text-center">

          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "#F0F7F1" }}
          >
            <svg className="w-8 h-8" style={{ color: "#2F813E" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h2
            className="text-3xl font-bold font-heading mb-2"
            style={{ color: "#142608" }}
          >
            Verify your email
          </h2>
          <p className="text-gray-600 font-sans mb-2 text-sm">
            We sent a 6-digit code to your registered email address.
          </p>
          {email && (
            <p className="font-semibold font-sans mb-4 text-sm" style={{ color: "#142608" }}>
              {email}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div
              className="flex gap-3 justify-center mb-6"
              onPaste={handlePaste}
            >
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="h-12 text-center text-sm font-bold rounded border-2 font-sans transition-colors focus:outline-none"
                  style={{
                    width: "45px",
                    borderColor: digit ? "#2F813E" : "#d1d5db",
                    color: "#142608",
                    backgroundColor: digit ? "#F0F7F1" : "#fff",
                  }}
                />
              ))}
            </div>

            {error && (
              <p
                className="text-sm font-sans mb-4"
                style={{ color: "#8C182D" }}
              >
                {error}
              </p>
            )}

            <Button type="submit" fullWidth className="mb-3" disabled={loading}>
              Verify code
            </Button>

            <button
              type="button"
              className="w-full text-sm font-sans underline mb-4"
              style={{ color: "#142608" }}
              onClick={handleResend}
              disabled={loading}
            >
              Didn&apos;t receive a code? Resend
            </button>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="mt-2 text-sm font-sans"
              style={{ color: "#6b7280" }}
            >
              ← Back to login
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}
