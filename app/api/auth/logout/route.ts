import { NextRequest, NextResponse } from "next/server";
import { uhseLogout } from "@/lib/uhse";

export async function POST(req: NextRequest) {
  try {
    const accessToken = req.headers.get("authorization")?.replace("Bearer ", "") ?? "";
    const refreshToken = req.cookies.get("refresh_token")?.value ?? "";

    await uhseLogout(accessToken, refreshToken);

    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });

    // Clear refresh token cookie
    response.cookies.delete("refresh_token");

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message ?? "Logout failed" },
      { status: 500 },
    );
  }
}