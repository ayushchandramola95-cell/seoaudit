import { NextRequest, NextResponse } from "next/server";
import { scrapeWebsite } from "@/lib/modules/seo/fetcher";
import { calculateSeoScore } from "@/lib/modules/seo/scorer";
import { detectTechnologies } from "@/lib/modules/tech/detector";
import { fetchOpenPageRank } from "@/lib/modules/traffic/openPageRank";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { urls } = body;

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { success: false, error: "Argument 'urls' must be a non-empty array of website URLs." },
        { status: 400 }
      );
    }

    // Limit batch to 15 concurrent URLs for performance safety
    const cleanUrls = urls
      .filter((u) => typeof u === "string" && u.trim().length > 0)
      .slice(0, 15)
      .map((u) => u.trim());

    const settled = await Promise.allSettled(
      cleanUrls.map(async (rawUrl) => {
        let url = rawUrl;
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
          url = `https://${url}`;
        }

        const pageData = await scrapeWebsite(url);
        const audit = calculateSeoScore(pageData);
        const technologies = detectTechnologies(pageData.rawHtml, pageData.headers);
        const opr = await fetchOpenPageRank(pageData.domain);

        const criticalError = audit.diagnostics.find((d) => d.status === "error");

        return {
          url: pageData.finalUrl,
          domain: pageData.domain,
          title: pageData.title || null,
          httpStatus: pageData.httpStatus,
          seoScore: audit.overallScore,
          grade: audit.grade,
          responseTimeMs: pageData.responseTimeMs,
          wordCount: pageData.wordCount,
          techCount: technologies.length,
          topTech: technologies.slice(0, 6).map((t) => t.name),
          pageRank: opr.pageRankDecimal,
          globalRank: opr.rankFormatted,
          isHttps: pageData.isHttps,
          criticalIssue: criticalError ? criticalError.title : null,
          passedChecks: audit.passedCount,
          warningCount: audit.warningCount,
          errorCount: audit.errorCount,
          totalChecks: audit.diagnostics.length,
          imagesWithoutAlt: pageData.images?.missingAlt || 0,
          totalImages: pageData.images?.totalImages || 0,
          internalLinksCount: pageData.links?.internalLinks || 0,
          externalLinksCount: pageData.links?.externalLinks || 0,
          h1Count: pageData.headings?.h1Count || 0,
          h2Count: pageData.headings?.h2Count || 0,
          hasRobotsTxt: pageData.hasRobotsTxt,
          hasSitemapXml: pageData.hasSitemapXml,
          categories: {
            metadata: Math.round(audit.categories.metadata.percentage),
            content: Math.round(audit.categories.content.percentage),
            indexability: Math.round(audit.categories.indexability.percentage),
            security: Math.round(audit.categories.security.percentage),
          },
        };
      })
    );

    const results = settled.map((item, idx) => {
      if (item.status === "fulfilled") {
        return {
          success: true,
          ...item.value,
        };
      } else {
        const raw = cleanUrls[idx];
        const domain = raw.replace(/https?:\/\//, "").split("/")[0];
        return {
          success: false,
          url: raw.startsWith("http") ? raw : `https://${raw}`,
          domain,
          title: null,
          httpStatus: 500,
          seoScore: 0,
          grade: "F",
          responseTimeMs: 0,
          wordCount: 0,
          techCount: 0,
          topTech: [],
          pageRank: null,
          globalRank: "Unranked",
          isHttps: false,
          criticalIssue: item.reason?.message || "Failed to audit URL",
          passedChecks: 0,
          warningCount: 0,
          errorCount: 1,
          totalChecks: 0,
          imagesWithoutAlt: 0,
          totalImages: 0,
          internalLinksCount: 0,
          externalLinksCount: 0,
          h1Count: 0,
          h2Count: 0,
          hasRobotsTxt: false,
          hasSitemapXml: false,
          categories: {
            metadata: 0,
            content: 0,
            indexability: 0,
            security: 0,
          },
        };
      }
    });

    const successful = results.filter((r) => r.success).length;

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      totalUrls: cleanUrls.length,
      successful,
      results,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error)?.message || "Failed to process batch audit." },
      { status: 500 }
    );
  }
}
