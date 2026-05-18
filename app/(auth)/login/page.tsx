"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { setClientSession } from "@/lib/client-session"

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState("patient")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        // ── Locked account ──
        if (
          data.message?.toLowerCase().includes("locked") ||
          data.message?.toLowerCase().includes("too many")
        ) {
          router.push("/login/locked")
          return
        }

        // ── Unverified account — redirect to verify page ──
        if (
          data.errorCode === "ACCOUNT_INACTIVE" ||
          (res.status === 403 && /inactive|not yet verified|not verified|unverified/i.test(data.message || ""))
        ) {
          sessionStorage.setItem("verify_email", email)
          router.push("/verify")
          return
        }

        setError(data.message ?? "Login failed. Please try again.")
        return
      }

      
      // ── 2FA required ──
      if (!data.data?.access_token && data.data?.email) {
        sessionStorage.setItem("mfa_email", data.data.email)
        router.push("/login/verify-2fa")
        return
      }

      // ── Success — store token in memory ──
      const { access_token, role: vitalRole, isOnboardingComplete, vitalUserId, authId } = data.data
      setClientSession({
        access_token,
        role: vitalRole,
        vitalUserId,
        authId,
        isOnboardingComplete,
        isRecordAvailable: data.data.isRecordAvailable,
      })

      // ── Route based on role ──
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

  return (
    <main className="min-h-screen flex bg-bgh-bg">
      <aside
        className="hidden md:flex w-1/2 text-white items-center px-16 justify-center"
        style={{ backgroundColor: "#142608" }}
      >
        <div>
          <h1 className="text-5xl font-bold mb-6 font-heading">VITAL</h1>
          <p className="text-xl max-w-lg mb-6 font-sans leading-relaxed">
            Virtual Interactive Telemedicine & Appointment Log
          </p>
          <p className="text-sm opacity-80 font-sans">Bernardino General Hospital 1</p>
        </div>
      </aside>

      <section className="flex-1 flex items-center justify-center px-6 bg-white">
        <div className="w-full max-w-lg">
          <h2
            className="text-4xl font-bold text-center font-heading mb-2"
            style={{ color: "#142608" }}
          >
            Welcome Back
          </h2>
          <p className="text-center text-gray-600 mb-8 font-sans">
            Sign in to access your account
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <Select
              label="Login As"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              options={[
                { value: "patient", label: "Patient" },
                { value: "doctor", label: "Doctor" },
                { value: "admin", label: "Admin" },
              ]}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="text-sm font-sans text-bgh-red text-center">{error}</p>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-700 font-sans cursor-pointer">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                Remember me
              </label>
              <Link
                href="/password/forgot"
                className="text-sm font-sans"
                style={{ color: "#142608" }}
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-gray-600 mt-8 font-sans text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium" style={{ color: "#142608" }}>
              Register as Patient
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
