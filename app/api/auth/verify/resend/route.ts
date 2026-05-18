import { NextRequest, NextResponse } from "next/server";
import { gatewayResendVerification } from "@/lib/gateway";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required." }, { status: 400 });
    }

    const uhseRes = await gatewayResendVerification(email);

    if (!uhseRes.success) {
      // Map common gateway failures
      return NextResponse.json({ success: false, message: uhseRes.message ?? "Failed to resend verification." }, { status: 503 });
    }

    return NextResponse.json({ success: true, message: "Verification code resent." });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message ?? "Resend failed." }, { status: 500 });
  }
}
