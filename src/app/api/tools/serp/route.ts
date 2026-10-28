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

    // Detect site brand name from title separator or domain
    let brandName = pageData.domain.replace(/^www\./, "").split(".")[0];
    brandName = brandName.charAt(0).toUpperCase() + brandName.slice(1);
    if (title.includes("|")) {
      const parts = title.split("|");
      brandName = parts[parts.length - 1].trim();
    } else if (title.includes(" - ")) {
      const parts = title.split(" - ");
      brandName = parts[parts.length - 1].trim();
    }

    // Extract potential sitelinks from H2 headings or structured data
    const suggestedSitelinks = (pageData.headings?.h2Samples || [])
      .filter((h) => h && h.length > 3 && h.length < 35)
      .slice(0, 4)
      .map((h, idx) => ({
        title: h,
        url: `${canonical.replace(/\/$/, "")}/${h.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        description: `Explore ${h} details and documentation on ${pageData.domain}.`,
      }));

    return NextResponse.json({
      success: true,
      url: pageData.finalUrl,
      domain: pageData.domain,
      brandName,
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
        favicon: pageData.favicon || `https://www.google.com/s2/favicons?domain=${encodeURIComponent(pageData.domain)}&sz=64`,
        openGraphImage: pageData.openGraph?.image || null,
        schemaTypes: pageData.structuredData?.types || [],
        hasSchema: pageData.structuredData?.detected || false,
        suggestedSitelinks,
      },
    });
  } catch (err: unknown) {
    if (err instanceof SsrfSecurityError) {
      return NextResponse.json({ success: false, error: "Security Exception: Internal or reserved IPs cannot be scanned." }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: (err as Error)?.message || "Failed to generate SERP preview." }, { status: 500 });
  }
}

