import { NextRequest, NextResponse } from "next/server";
import { attachBffSessionHeaders, requireBffSession } from "@/lib/auth";
import { GatewayRequestError } from "@/lib/gateway";

export async function GET(req: NextRequest) {
  try {
    const session = await requireBffSession(req);

    return attachBffSessionHeaders(NextResponse.json({
      success: true,
      message: "Welcome to the Patient Portal",
      data: { role: session.role, userId: session.authId, email: session.email },
    }), session);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized.";
    const status = error instanceof GatewayRequestError ? error.status : 500;
    return NextResponse.json({ success: false, message }, { status });
  }
}
