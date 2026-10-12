import { NextRequest, NextResponse } from "next/server";
import { scrapeWebsite } from "@/lib/modules/seo/fetcher";
import { SsrfSecurityError } from "@/lib/security/ssrf";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl || targetUrl.trim().length === 0) {
    return NextResponse.json({ success: false, error: "Missing required 'url' parameter." }, { status: 400 });
  }

  try {
    const pageData = await scrapeWebsite(targetUrl.trim());

    return NextResponse.json({
      success: true,
      url: pageData.finalUrl,
      domain: pageData.domain,
      structuredData: pageData.structuredData,
      openGraph: pageData.openGraph,
      twitterCard: pageData.twitterCard,
      canonicalUrl: pageData.canonicalUrl,
    });
  } catch (err: unknown) {
    if (err instanceof SsrfSecurityError) {
      return NextResponse.json({ success: false, error: "Security Exception: Internal or reserved IPs cannot be scanned." }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: (err as Error)?.message || "Failed to validate schema markup." }, { status: 500 });
  }
}
