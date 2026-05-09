import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await new Promise((r) => setTimeout(r, 600));
  const { email } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  return NextResponse.json({
    message: "Password reset link sent. Check your inbox.",
  });
}
