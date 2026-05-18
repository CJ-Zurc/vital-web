import { NextRequest, NextResponse } from "next/server";
import { gatewayBootstrapSessionWithHeaders, GatewayRequestError } from "@/lib/gateway";

export async function GET(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refresh_token")?.value;
    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "No active refresh session found." },
        { status: 401 },
      );
    }

    const gatewayResponse = await gatewayBootstrapSessionWithHeaders(refreshToken);
    const response = NextResponse.json(gatewayResponse.data, {
      status: gatewayResponse.data.success ? 200 : 401,
      headers: { "Cache-Control": "no-store" },
    });

    const refreshCookie = gatewayResponse.headers.get("set-cookie");
    if (refreshCookie) {
      response.headers.append("Set-Cookie", refreshCookie);
    }

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Session bootstrap failed.";
    const status = error instanceof GatewayRequestError ? error.status : 500;
    return NextResponse.json(
      { success: false, message },
      { status },
    );
  }
}
