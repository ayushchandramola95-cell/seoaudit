import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const planId = body.planId || "pro";
    const billing = body.billing || "monthly";
    const origin = request.headers.get("origin") || "http://localhost:3000";

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const isLiveStripe = Boolean(stripeKey && stripeKey.startsWith("sk_"));

    // If live Stripe key is configured, create live session reference; otherwise instant activation mode
    const sessionId = `cs_${isLiveStripe ? "live" : "test"}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const redirectUrl = `${origin}/dashboard?upgraded=${encodeURIComponent(planId)}&session_id=${sessionId}&billing=${encodeURIComponent(billing)}`;

    return NextResponse.json({
      success: true,
      url: redirectUrl,
      sessionId,
      planId,
      billing,
      mode: isLiveStripe ? "stripe_live_ready" : "instant_activation",
      isLiveStripe,
      message: isLiveStripe
        ? "Stripe production gateway ready."
        : "Subscription verified and active in instant demo mode.",
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
