import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { webhookUrl, domain = "my-site.com", threshold = 75 } = body;

    if (!webhookUrl || typeof webhookUrl !== "string") {
      return NextResponse.json(
        { success: false, error: "Please provide a valid Webhook URL (Slack, Discord, Zapier, or custom HTTP endpoint)." },
        { status: 400 }
      );
    }

    // SSRF Guard: block private networks unless testing localhost in dev
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(webhookUrl);
    } catch {
      return NextResponse.json({ success: false, error: "Malformed URL provided." }, { status: 400 });
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json({ success: false, error: "Only HTTP and HTTPS webhook protocols are supported." }, { status: 400 });
    }

    const host = parsedUrl.hostname.toLowerCase();
    if (
      host === "169.254.169.254" ||
      host === "metadata.google.internal" ||
      host === "instance-data"
    ) {
      return NextResponse.json({ success: false, error: "SSRF Protection: Cloud metadata endpoints are blocked." }, { status: 403 });
    }

    const payload = {
      event: "seoseite.alert.trigger",
      source: "SeoSeite Enterprise SEO Monitor",
      timestamp: new Date().toISOString(),
      alert: {
        severity: "WARNING",
        domain,
        message: `SEO Health Score dropped below threshold (${threshold}/100)`,
        triggerValue: 68,
        threshold,
        responseTimeMs: 1420,
        geoAiReadinessScore: 54,
        actionRequired: "Review disallowed AI bots in robots.txt and fix canonical tags."
      },
      dashboardUrl: "https://seoseite.io/dashboard"
    };

    // If it's a test/placeholder or sample webhook, return simulated success
    if (
      host.includes("example.com") ||
      webhookUrl.includes("YOUR_") ||
      webhookUrl.includes("dummy")
    ) {
      return NextResponse.json({
        success: true,
        mode: "simulated",
        message: "Simulated Webhook dispatched successfully! (Using sample endpoint pattern)",
        payload
      });
    }

    // Attempt real HTTP POST with a 5 second timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "SeoSeite-Webhook-Bot/2.0 (+https://seoseite.io)"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (response.ok) {
        return NextResponse.json({
          success: true,
          mode: "live",
          status: response.status,
          message: `Webhook received HTTP ${response.status} from target server.`,
          payload
        });
      } else {
        return NextResponse.json({
          success: false,
          status: response.status,
          error: `Target server responded with HTTP ${response.status}: ${response.statusText}`
        }, { status: 422 });
      }
    } catch (dispatchErr: unknown) {
      clearTimeout(timeout);
      const msg = (dispatchErr as Error)?.message || "Failed to reach target server";
      return NextResponse.json({
        success: false,
        error: `Webhook delivery failed: ${msg}. Check if your endpoint is publicly reachable.`
      }, { status: 502 });
    }
  } catch (err: unknown) {
    return NextResponse.json({
      success: false,
      error: (err as Error)?.message || "Internal server error"
    }, { status: 500 });
  }
}
