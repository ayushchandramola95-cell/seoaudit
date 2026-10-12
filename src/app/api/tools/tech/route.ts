import { NextRequest, NextResponse } from "next/server";
import { scrapeWebsite } from "@/lib/modules/seo/fetcher";
import { detectTechnologies } from "@/lib/modules/tech/detector";
import { SsrfSecurityError } from "@/lib/security/ssrf";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl || targetUrl.trim().length === 0) {
    return NextResponse.json({ success: false, error: "Missing required 'url' parameter." }, { status: 400 });
  }

  try {
    const pageData = await scrapeWebsite(targetUrl.trim());
    const technologies = detectTechnologies(pageData.rawHtml, pageData.headers);

    return NextResponse.json({
      success: true,
      url: pageData.finalUrl,
      domain: pageData.domain,
      statusCode: pageData.httpStatus,
      responseTimeMs: pageData.responseTimeMs,
      data: technologies,
    });
  } catch (err: unknown) {
    if (err instanceof SsrfSecurityError) {
      return NextResponse.json({ success: false, error: "Security Exception: Internal or reserved IPs cannot be scanned." }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: (err as Error)?.message || "Failed to inspect technology stack." }, { status: 500 });
  }
}
