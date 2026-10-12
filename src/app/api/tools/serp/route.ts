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
    const title = pageData.title || "";
    const metaDescription = pageData.metaDescription || "";
    const canonical = pageData.canonicalUrl || pageData.finalUrl;

    // Approximate Google desktop pixel widths (Average ~9.5px per character for Arial 18px title)
    const titlePixelWidth = Math.round(title.length * 9.5);
    const descPixelWidth = Math.round(metaDescription.length * 6.8);

    const titleTruncated = title.length > 60 || titlePixelWidth > 580;
    const descTruncated = metaDescription.length > 160 || descPixelWidth > 960;

    return NextResponse.json({
      success: true,
      url: pageData.finalUrl,
      domain: pageData.domain,
      serp: {
        title,
        titleLength: title.length,
        titlePixelWidth,
        titleTruncated,
        metaDescription,
        descLength: metaDescription.length,
        descPixelWidth,
        descTruncated,
        canonical,
        favicon: `https://www.google.com/s2/favicons?domain=${encodeURIComponent(pageData.domain)}&sz=32`,
      },
    });
  } catch (err: unknown) {
    if (err instanceof SsrfSecurityError) {
      return NextResponse.json({ success: false, error: "Security Exception: Internal or reserved IPs cannot be scanned." }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: (err as Error)?.message || "Failed to generate SERP preview." }, { status: 500 });
  }
}
