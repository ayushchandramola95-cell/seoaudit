import { NextRequest, NextResponse } from "next/server";
import { scrapeWebsite } from "@/lib/modules/seo/fetcher";
import { calculateSeoScore } from "@/lib/modules/seo/scorer";
import { detectTechnologies } from "@/lib/modules/tech/detector";
import { fetchPageSpeedAudit } from "@/lib/modules/performance/pagespeed";
import { estimateWebsiteTraffic } from "@/lib/modules/traffic/estimator";
import { generateAiDiagnostics } from "@/lib/modules/ai/service";
import { SsrfSecurityError } from "@/lib/security/ssrf";
import { saveScanRecord } from "@/lib/db/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl || targetUrl.trim().length === 0) {
    return NextResponse.json(
      { success: false, error: "Missing required 'url' query parameter." },
      { status: 400 }
    );
  }

  try {
    // 1. Run real-time fetcher and HTML parser
    const pageData = await scrapeWebsite(targetUrl);

    // 2. Run deterministic rule-based SEO scorer
    const auditReport = calculateSeoScore(pageData);

    // 3. Detect technology stack from headers, DOM, scripts, and meta tags
    const technologies = detectTechnologies(pageData.rawHtml, pageData.headers);

    // 4. Fetch Google PageSpeed Core Web Vitals audit
    const performance = await fetchPageSpeedAudit(
      pageData.finalUrl,
      pageData.responseTimeMs,
      pageData.contentLengthBytes
    );

    // 5. Compute transparent heuristic traffic estimation
    const traffic = estimateWebsiteTraffic({
      domain: pageData.domain,
      seoScore: auditReport.overallScore,
      wordCount: pageData.wordCount,
      internalLinks: pageData.links.internalLinks,
      externalLinks: pageData.links.externalLinks,
      hasSitemap: pageData.hasSitemapXml,
      structuredDataCount: pageData.structuredData.count,
      performanceScore: performance.scores.performance,
    });

    // 6. Generate AI Diagnostic & Prioritized Recommendations Layer
    const aiReport = await generateAiDiagnostics({
      domain: pageData.domain,
      audit: auditReport,
      performance,
      technologies,
      traffic,
    });

    // Don't send megabytes of rawHtml to the client browser
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rawHtml, ...clientPageData } = pageData;

    // Persist scan record for Dashboard & History
    const savedRecord = await saveScanRecord({
      domain: pageData.domain,
      targetUrl: pageData.finalUrl,
      seoScore: auditReport.overallScore,
      grade: auditReport.grade,
      responseTimeMs: pageData.responseTimeMs,
      perfScore: performance.scores.performance,
      techCount: technologies.length,
      trafficRange: traffic.formattedRange,
      fullReportJson: {
        page: clientPageData,
        audit: auditReport,
        technologies,
        performance,
        traffic,
        ai: aiReport,
      },
    });

    return NextResponse.json({
      success: true,
      id: savedRecord.id,
      timestamp: new Date().toISOString(),
      page: clientPageData,
      audit: auditReport,
      technologies,
      performance,
      traffic,
      ai: aiReport,
    });
  } catch (err: unknown) {
    const errorMsg = (err as Error)?.message || "Failed to analyze target website.";

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

    if (errorMsg.includes("timed out")) {
      return NextResponse.json(
        {
          success: false,
          errorType: "TIMEOUT",
          error: errorMsg,
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        errorType: "FETCH_FAILED",
        error: errorMsg,
      },
      { status: 502 }
    );
  }
}
