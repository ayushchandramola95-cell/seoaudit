import { NextRequest, NextResponse } from "next/server";
import { analyzeRobotsAndSitemap } from "@/lib/modules/crawler/robotsSitemap";
import { validateUrlForSsrf, SsrfSecurityError } from "@/lib/security/ssrf";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("url") || searchParams.get("domain");

  if (!target || target.trim().length === 0) {
    return NextResponse.json({ success: false, error: "Missing required 'url' or 'domain' parameter." }, { status: 400 });
  }

  let formatted = target.trim();
  if (!formatted.startsWith("http://") && !formatted.startsWith("https://")) {
    formatted = `https://${formatted}`;
  }

  try {
    await validateUrlForSsrf(formatted);
    const domain = new URL(formatted).hostname.replace(/^www\./, "");
    const startTime = Date.now();
    const report = await analyzeRobotsAndSitemap(domain);
    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      domain,
      url: formatted,
      latencyMs,
      data: report,
    });
  } catch (err: unknown) {
    if (err instanceof SsrfSecurityError) {
      return NextResponse.json({ success: false, error: "Security Exception: Internal or reserved IPs cannot be scanned." }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: (err as Error)?.message || "Failed to inspect robots and sitemap." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const target = body.url || body.domain || req.nextUrl.searchParams.get("url") || req.nextUrl.searchParams.get("domain");

    if (!target || typeof target !== "string") {
      return NextResponse.json({ success: false, error: "Missing required 'url' or 'domain' parameter in JSON request body." }, { status: 400 });
    }

    const urlWithParams = new URL(req.url);
    urlWithParams.searchParams.set("url", target);

    const syntheticGetReq = new NextRequest(urlWithParams, {
      method: "GET",
      headers: req.headers,
    });

    return GET(syntheticGetReq);
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error)?.message || "Invalid JSON payload." }, { status: 400 });
  }
}
