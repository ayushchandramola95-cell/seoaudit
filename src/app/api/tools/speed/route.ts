import { NextRequest, NextResponse } from "next/server";
import { fetchPageSpeedAudit } from "@/lib/modules/performance/pagespeed";
import { SsrfSecurityError } from "@/lib/security/ssrf";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl || targetUrl.trim().length === 0) {
    return NextResponse.json({ success: false, error: "Missing required 'url' parameter." }, { status: 400 });
  }

  try {
    const startTime = Date.now();
    const performance = await fetchPageSpeedAudit(targetUrl.trim(), 200, 25000);
    const timingMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      url: targetUrl.trim(),
      timingMs,
      data: performance,
    });
  } catch (err: unknown) {
    if (err instanceof SsrfSecurityError) {
      return NextResponse.json({ success: false, error: "Security Exception: Private/internal IP addresses cannot be audited." }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: (err as Error)?.message || "Failed to analyze page speed." }, { status: 500 });
  }
}
