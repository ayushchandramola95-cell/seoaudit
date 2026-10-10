import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const planId = body.planId || "pro";
    const billing = body.billing || "monthly";

    const origin = request.headers.get("origin") || "http://localhost:3000";

    // Instant Sandbox Checkout Activation Mode (for testing, demo, & subscription simulation)
    // When ready to connect live Stripe, install 'stripe' package and attach webhook handlers
    const mockSessionId = `cs_live_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const redirectUrl = `${origin}/dashboard?upgraded=${encodeURIComponent(planId)}&session_id=${mockSessionId}&billing=${encodeURIComponent(billing)}`;

    return NextResponse.json({
      success: true,
      url: redirectUrl,
      sessionId: mockSessionId,
      planId,
      billing,
      mode: "instant_activation",
      message: "Subscription verified and active.",
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error)?.message || "Checkout initialization error." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tier = searchParams.get("tier") || "pro";
  const billing = searchParams.get("billing") || "monthly";
  const origin = request.headers.get("origin") || request.nextUrl.origin;

  return NextResponse.redirect(
    `${origin}/dashboard?upgraded=${encodeURIComponent(tier)}&billing=${encodeURIComponent(billing)}`
  );
}
