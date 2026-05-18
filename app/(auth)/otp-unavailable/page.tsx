"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"

export default function OtpUnavailablePage() {
  const router = useRouter()

  return (
    <main className="min-h-screen flex bg-bgh-bg">
      <aside className="hidden md:flex w-1/2 items-center px-16 justify-center bg-bgh-dark">
        <div>
          <h1 className="text-5xl font-bold mb-6 font-heading text-white">VITAL</h1>
          <p className="text-xl max-w-lg mb-6 font-sans leading-relaxed text-white">
            Virtual Interactive Telemedicine & Appointment Log
          </p>
          <p className="text-sm font-sans text-white opacity-80">
            Bernardino General Hospital 1
          </p>
        </div>
      </aside>

      <section className="flex-1 flex items-center justify-center px-6 bg-white">
        <div className="w-full max-w-md text-center">

          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-bgh-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold font-heading mb-3 text-bgh-dark">
            Email service unavailable
          </h2>
          <p className="text-gray-600 font-sans text-sm leading-relaxed mb-2">
            Your credentials are valid, but we couldn't send your verification code right now.
          </p>
          <p className="text-gray-600 font-sans text-sm leading-relaxed mb-8">
            This is a temporary issue on our end. Please try again in a few minutes.
          </p>

          <Button fullWidth onClick={() => router.push("/login")}>
            Try again
          </Button>
        </div>
      </section>
    </main>
  )
}