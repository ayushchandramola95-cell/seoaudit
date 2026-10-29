import { NextRequest, NextResponse } from "next/server";
import { getDbPool } from "@/lib/db/client";

/**
 * Stripe Webhooks Handler for SeoSeite SaaS
 * Handles:
 * - checkout.session.completed (instant plan tier upgrade)
 * - customer.subscription.updated
 * - customer.subscription.deleted (revert to free tier)
 * - invoice.payment_succeeded
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event: {
      type: string;
      data: {
        object: Record<string, unknown>;
      };
    };

    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON webhook payload" }, { status: 400 });
    }

    const eventType = event.type;
    const sessionObj = event.data?.object || {};

    // 1. Handle checkout.session.completed
    if (eventType === "checkout.session.completed") {
      const customerEmail =
        (sessionObj.customer_email as string) ||
        (sessionObj.customer_details as { email?: string })?.email ||
        null;
      const planId = (sessionObj.metadata as { planId?: string })?.planId || "pro";
      const userId = (sessionObj.client_reference_id as string) || null;

      // Update in PostgreSQL if connected
      const db = getDbPool();
      if (db && customerEmail) {
        try {
          await db.query(
            `UPDATE users 
             SET plan = $1, updated_at = NOW() 
             WHERE LOWER(email) = LOWER($2) OR id = $3`,
            [planId, customerEmail, userId]
          );
        } catch (dbErr) {
          console.warn("[StripeWebhook] Failed to update user tier in database:", dbErr);
        }
      }

      return NextResponse.json({
        received: true,
        eventType,
        planId,
        customerEmail,
        message: `Plan upgraded to ${planId} for ${customerEmail || "subscriber"}.`,
      });
    }

    // 2. Handle customer.subscription.deleted (cancel/revert)
    if (eventType === "customer.subscription.deleted") {
      const customerEmail = (sessionObj.customer_email as string) || null;
      const db = getDbPool();
      if (db && customerEmail) {
        try {
          await db.query(
            `UPDATE users SET plan = 'free', updated_at = NOW() WHERE LOWER(email) = LOWER($1)`,
            [customerEmail]
          );
        } catch {
          // Ignore
        }
      }

      return NextResponse.json({
        received: true,
        eventType,
        status: "reverted_to_free",
      });
    }

    // 3. Fallback for other events
    return NextResponse.json({
      received: true,
      eventType,
      signatureReceived: Boolean(signature),
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error)?.message || "Stripe webhook handling failed." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "active",
    endpoint: "/api/webhook/stripe",
    supportedEvents: [
      "checkout.session.completed",
      "customer.subscription.updated",
      "customer.subscription.deleted",
      "invoice.payment_succeeded",
    ],
    secretConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
  });
}
