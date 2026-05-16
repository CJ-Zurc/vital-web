"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"

export default function VerifyMFAPage() {
  const router = useRouter()
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [error, setError] = useState("")
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fullCode = code.join("")
    if (fullCode.length < 6) {
      setError("Please enter the complete 6-digit code.")
      return
    }
    // Backend wiring will be added once UHSE email service is ready
    setError("MFA verification is not yet available. Please try again later.")
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
            Verify your identity
          </h2>
          <p className="text-gray-600 font-sans mb-2 text-sm">
            We sent a 6-digit code to your registered email address.
          </p>
          <p className="font-semibold font-sans mb-8 text-sm" style={{ color: "#142608" }}>
            Check your inbox and enter the code below.
          </p>

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
                  className="w-12 h-14 text-center text-xl font-bold rounded-lg border-2 font-sans transition-colors focus:outline-none"
                  style={{
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

            <Button type="submit" fullWidth className="mb-3">
              Verify code
            </Button>

            <button
              type="button"
              className="w-full text-sm font-sans underline"
              style={{ color: "#142608" }}
              onClick={() => alert("Resend functionality coming soon.")}
            >
              Didn't receive a code? Resend
            </button>
          </form>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="mt-6 text-sm font-sans"
            style={{ color: "#6b7280" }}
          >
            ← Back to login
          </button>
        </div>
      </section>
    </main>
  )
}