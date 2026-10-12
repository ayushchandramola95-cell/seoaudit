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
          httpStatus: pageData.httpStatus,
          seoScore: audit.overallScore,
          grade: audit.grade,
          responseTimeMs: pageData.responseTimeMs,
          wordCount: pageData.wordCount,
          techCount: technologies.length,
          pageRank: opr.pageRankDecimal,
          globalRank: opr.rankFormatted,
          isHttps: pageData.isHttps,
          criticalIssue: criticalError ? criticalError.title : null,
          passedChecks: audit.passedCount,
          totalChecks: audit.diagnostics.length,
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
        return {
          success: false,
          url: cleanUrls[idx],
          domain: cleanUrls[idx].replace(/https?:\/\//, "").split("/")[0],
          httpStatus: 500,
          seoScore: 0,
          grade: "F",
          responseTimeMs: 0,
          wordCount: 0,
          techCount: 0,
          pageRank: null,
          globalRank: "Unranked",
          isHttps: false,
          criticalIssue: item.reason?.message || "Failed to audit URL",
          passedChecks: 0,
          totalChecks: 0,
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
