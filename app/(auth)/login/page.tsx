"use client"

import Link from "next/link"
import { useState } from "react"

export default function LoginPage() {
	const [role, setRole] = useState("Patient")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [remember, setRemember] = useState(false)

	return (
		<main className="min-h-screen flex bg-bgh-background">
			<aside className="hidden md:flex w-1/2 text-white items-center px-16 justify-center" style={{ backgroundColor: '#142608' }}>
				<div>
					<h1 className="text-5xl font-bold mb-6 font-heading">VITAL</h1>
					<p className="text-xl max-w-lg mb-6 font-sans leading-relaxed">Virtual Interactive Telemedicine & Appointment Log</p>
					<p className="text-sm opacity-80 font-sans">Bernardino General Hospital 1</p>
				</div>
			</aside>

			<section className="flex-1 flex items-center justify-center px-6 bg-white">
				<div className="w-full max-w-lg">
					<h2 className="text-4xl font-bold text-center font-heading mb-2" style={{ color: '#142608' }}>Welcome Back</h2>
					<p className="text-center text-gray-600 mb-8 font-sans">Sign in to access your account</p>

					<form className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Login As</label>
							<select
								aria-label="Login as"
								value={role}
								onChange={(e) => setRole(e.target.value)}
								className="w-full rounded-md border-2 border-gray-200 px-4 py-3 bg-white font-sans focus:border-bgh-green focus:outline-none transition-colors text-black"
								style={{ color: '#000000' }}
							>
								<option style={{ color: '#000000' }}>Patient</option>
								<option style={{ color: '#000000' }}>Doctor</option>
								<option style={{ color: '#000000' }}>Admin</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Email Address</label>
							<input
								type="email"
								placeholder="your.email@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full rounded-md border-2 border-gray-200 px-4 py-3 placeholder-gray-400 text-black font-sans focus:border-bgh-green focus:outline-none transition-colors"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2 font-sans">Password</label>
							<input
								type="password"
								placeholder="Enter your password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full rounded-md border-2 border-gray-200 px-4 py-3 placeholder-gray-400 text-black font-sans focus:border-bgh-green focus:outline-none transition-colors"
							/>
						</div>

						<div className="flex items-center justify-between">
							<label className="flex items-center gap-2 text-sm text-gray-700 font-sans cursor-pointer">
								<input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
								Remember me
							</label>
							<Link href="#" className="text-sm font-sans" style={{ color: '#142608' }}>Forgot password?</Link>
						</div>

						<div>
							<button
								type="button"
								className="w-full py-4 text-white rounded-md text-lg font-medium font-sans hover:opacity-90 transition-opacity"
								style={{ backgroundColor: '#142608' }}
							>
								Sign In
							</button>
						</div>
					</form>

					<p className="text-center text-gray-600 mt-8 font-sans text-sm">Don't have an account? <Link href="/register" className="font-medium" style={{ color: '#142608' }}>Register as Patient</Link></p>
				</div>
			</section>
		</main>
	)
}

