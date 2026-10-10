import { NextRequest, NextResponse } from "next/server";
import { auditLinksHealth } from "@/lib/modules/crawler/linkCrawler";
import { scrapeWebsite } from "@/lib/modules/seo/fetcher";
import { extractLinkAnalysis } from "@/lib/modules/crawler/linkScanner";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetUrl, links } = body;

    if (!targetUrl || typeof targetUrl !== "string") {
      return NextResponse.json({ success: false, error: "targetUrl is required." }, { status: 400 });
    }

    let linkList = links;

    // If links not supplied in payload, scrape the page to collect links
    if (!Array.isArray(linkList) || linkList.length === 0) {
      const scraped = await scrapeWebsite(targetUrl);
      const linkReport = extractLinkAnalysis(scraped.rawHtml, scraped.domain, targetUrl);
      linkList = [
        ...linkReport.internalLinksSample.map((l) => ({ href: l.href, text: l.anchorText, isInternal: true })),
        ...linkReport.externalLinksSample.map((l) => ({ href: l.href, text: l.anchorText, isInternal: false })),
      ];
    }

    const report = await auditLinksHealth(targetUrl, linkList, 25);

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error)?.message || "Failed to audit link health." },
      { status: 500 }
    );
  }
}
