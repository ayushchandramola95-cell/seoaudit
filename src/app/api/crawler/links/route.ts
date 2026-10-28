import { NextRequest, NextResponse } from "next/server";
import { auditLinksHealth } from "@/lib/modules/crawler/linkCrawler";
import { scrapeWebsite } from "@/lib/modules/seo/fetcher";
import { extractLinkAnalysis } from "@/lib/modules/crawler/linkScanner";
import { SsrfSecurityError } from "@/lib/security/ssrf";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetUrl, links, maxLinks = 35 } = body;

    if (!targetUrl || typeof targetUrl !== "string") {
      return NextResponse.json({ success: false, error: "targetUrl is required." }, { status: 400 });
    }

    let formatted = targetUrl.trim();
    if (!formatted.startsWith("http://") && !formatted.startsWith("https://")) {
      formatted = `https://${formatted}`;
    }

    let linkList = links;
    let pageDiscovery = null;

    // If links not supplied in payload, scrape the page to collect links
    if (!Array.isArray(linkList) || linkList.length === 0) {
      const scraped = await scrapeWebsite(formatted);
      const linkReport = extractLinkAnalysis(scraped.rawHtml, scraped.domain, formatted);

      pageDiscovery = {
        totalLinksOnPage: linkReport.totalLinks,
        internalLinksCount: linkReport.internalLinksCount,
        externalLinksCount: linkReport.externalLinksCount,
        nofollowCount: linkReport.nofollowCount,
        sponsoredCount: linkReport.sponsoredCount,
        emptyAnchorCount: linkReport.emptyAnchorCount,
        uniqueExternalDomains: linkReport.uniqueExternalDomains,
        linkEquityRatio: linkReport.linkEquityRatio,
        warnings: linkReport.warnings,
      };

      linkList = [
        ...linkReport.internalLinksSample.map((l) => ({ href: l.href, text: l.anchorText, isInternal: true })),
        ...linkReport.externalLinksSample.map((l) => ({ href: l.href, text: l.anchorText, isInternal: false })),
      ];
    }

    const report = await auditLinksHealth(formatted, linkList, Math.min(50, Math.max(10, maxLinks)));

    return NextResponse.json({
      success: true,
      data: {
        ...report,
        pageDiscovery,
      },
    });
  } catch (err: unknown) {
    if (err instanceof SsrfSecurityError) {
      return NextResponse.json(
        { success: false, error: "Security Exception: Private/internal IP addresses cannot be crawled." },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { success: false, error: (err as Error)?.message || "Failed to audit link health." },
      { status: 500 }
    );
  }
}
