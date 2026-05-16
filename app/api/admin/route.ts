import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const role = req.headers.get("x-vital-role");
  const userId = req.headers.get("x-vital-user-id");
  const email = req.headers.get("x-user-email");

  return NextResponse.json({
    success: true,
    message: "Welcome to the Admin Panel",
    data: { role, userId, email },
  });
}