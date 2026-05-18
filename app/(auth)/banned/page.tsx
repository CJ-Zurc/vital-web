"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"

export default function BannedPage() {
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold font-heading mb-3 text-bgh-dark">
            Account suspended
          </h2>
          <p className="text-gray-600 font-sans text-sm leading-relaxed mb-2">
            Your account has been suspended and you are unable to access VITAL.
          </p>
          <p className="text-gray-600 font-sans text-sm leading-relaxed mb-8">
            If you believe this is a mistake, please contact{" "}
            <span className="font-semibold text-bgh-dark">Bernardino General Hospital</span>{" "}
            for assistance.
          </p>

          <Button fullWidth onClick={() => router.push("/login")}>
            Back to login
          </Button>
        </div>
      </section>
    </main>
  )
}