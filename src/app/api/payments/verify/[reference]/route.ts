import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ reference: string }> }
) {
  await new Promise((r) => setTimeout(r, 800));
  const { reference } = await params;

  if (!reference || reference === "FAIL") {
    return NextResponse.json(
      { status: "failed", message: "Payment verification failed" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    status: "success",
    data: {
      reference,
      amount: 250000,
      currency: "NGN",
      paid_at: new Date().toISOString(),
      gateway_response: "Successful",
      channel: "card",
    },
  });
}
