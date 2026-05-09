import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await new Promise((r) => setTimeout(r, 600));
  const { token, password } = await req.json();

  if (!token) {
    return NextResponse.json(
      { error: "Invalid or expired reset token" },
      { status: 400 }
    );
  }

  if (!password || password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  return NextResponse.json({ message: "Password reset successfully" });
}
