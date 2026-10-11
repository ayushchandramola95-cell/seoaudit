import { NextRequest, NextResponse } from "next/server";
import { scrapeWebsite } from "@/lib/modules/seo/fetcher";
import { calculateSeoScore } from "@/lib/modules/seo/scorer";
import { detectTechnologies } from "@/lib/modules/tech/detector";
import { fetchPageSpeedAudit } from "@/lib/modules/performance/pagespeed";
import { estimateWebsiteTraffic } from "@/lib/modules/traffic/estimator";
import { extractKeywordAnalysis } from "@/lib/modules/keywords/extractor";
import { generateComparisonReport, SingleSiteAnalysis } from "@/lib/modules/compare/comparator";
import { SsrfSecurityError } from "@/lib/security/ssrf";
import { saveComparisonRecord } from "@/lib/db/client";

async function analyzeSingleSite(targetUrl: string): Promise<SingleSiteAnalysis> {
  const pageData = await scrapeWebsite(targetUrl);
  const audit = calculateSeoScore(pageData);
  const technologies = detectTechnologies(pageData.rawHtml, pageData.headers);
  const performance = await fetchPageSpeedAudit(
    pageData.finalUrl,
    pageData.responseTimeMs,
    pageData.contentLengthBytes
  );
  const traffic = estimateWebsiteTraffic({
    domain: pageData.domain,
    seoScore: audit.overallScore,
    wordCount: pageData.wordCount,
    internalLinks: pageData.links.internalLinks,
    externalLinks: pageData.links.externalLinks,
    hasSitemap: pageData.hasSitemapXml,
    structuredDataCount: pageData.structuredData.count,
    performanceScore: performance.scores.performance,
    hasSocialMeta: Boolean(pageData.openGraph?.title || pageData.twitterCard?.title),
    hasCanonical: Boolean(pageData.canonicalUrl),
    isSpa: Boolean(pageData.clientSideSpa?.isSpa),
  });

  const keywords = extractKeywordAnalysis(
    pageData.rawHtml,
    pageData.title,
    pageData.headings.h1Items
  );

  // Omit rawHtml to keep payload compact
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { rawHtml, ...clientPageData } = pageData;

  return {
    page: clientPageData as typeof pageData,
    audit,
    technologies,
    performance,
    traffic,
    keywords,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const siteA = searchParams.get("siteA");
  const siteB = searchParams.get("siteB");

  if (!siteA || !siteB) {
    return NextResponse.json(
      { success: false, error: "Missing required 'siteA' and 'siteB' query parameters." },
      { status: 400 }
    );
  }

  try {
    // Run both audits in parallel for ultra-fast response
    const [analysisA, analysisB] = await Promise.all([
      analyzeSingleSite(siteA),
      analyzeSingleSite(siteB),
    ]);

    const report = generateComparisonReport(analysisA, analysisB);

    // Persist comparison record for Dashboard & History
    const savedComp = await saveComparisonRecord({
      siteADomain: report.siteA.page.domain,
      siteBDomain: report.siteB.page.domain,
      siteAScore: report.siteA.audit.overallScore,
      siteBScore: report.siteB.audit.overallScore,
      seoDiff: report.deltas.seoScoreDiff,
      fullReportJson: report as unknown as Record<string, unknown>,
    });

    return NextResponse.json({
      success: true,
      id: savedComp.id,
      timestamp: new Date().toISOString(),
      comparison: report,
    });
  } catch (err: unknown) {
    const errorMsg = (err as Error)?.message || "Failed to compare websites.";

    if (err instanceof SsrfSecurityError) {
      return NextResponse.json(
        {
          success: false,
          errorType: "SSRF_BLOCKED",
          error: errorMsg,
          details: "Requests to private, loopback, or internal cloud networks are prohibited.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        errorType: "COMPARISON_FAILED",
        error: errorMsg,
      },
      { status: 502 }
    );
  }
}
