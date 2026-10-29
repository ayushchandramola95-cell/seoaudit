import { NextRequest, NextResponse } from "next/server";
import { estimateWebsiteTraffic } from "@/lib/modules/traffic/estimator";
import { fetchOpenPageRank } from "@/lib/modules/traffic/openPageRank";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("domain") || searchParams.get("url");

  if (!target || target.trim().length === 0) {
    return NextResponse.json({ success: false, error: "Missing required 'domain' or 'url' parameter." }, { status: 400 });
  }

  let domain = target.trim();
  try {
    if (domain.startsWith("http://") || domain.startsWith("https://")) {
      domain = new URL(domain).hostname;
    }
  } catch {
    // Keep as-is
  }
  domain = domain.toLowerCase().replace(/^www\./, "");

  try {
    const startTime = Date.now();
    const openPageRank = await fetchOpenPageRank(domain);
    const seoScoreEstimate = Math.min(100, Math.max(50, Math.round((openPageRank.pageRankDecimal ?? 3.5) * 10)));
    
    const traffic = estimateWebsiteTraffic({
      domain,
      seoScore: seoScoreEstimate,
      openPageRank: openPageRank,
      wordCount: 1500,
      internalLinks: 35,
      externalLinks: 10,
      hasSitemap: true,
      structuredDataCount: 2,
      performanceScore: 88,
      hasSocialMeta: true,
      hasCanonical: true,
      isSpa: false,
    });

    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      domain,
      latencyMs,
      pageRank: openPageRank.pageRankDecimal ?? 3.5,
      data: traffic,
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error)?.message || "Failed to calculate traffic estimation." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const target = body.domain || body.url || req.nextUrl.searchParams.get("domain") || req.nextUrl.searchParams.get("url");

    if (!target || typeof target !== "string") {
      return NextResponse.json({ success: false, error: "Missing required 'domain' or 'url' parameter in JSON request body." }, { status: 400 });
    }

    const urlWithParams = new URL(req.url);
    urlWithParams.searchParams.set("domain", target);

    const syntheticGetReq = new NextRequest(urlWithParams, {
      method: "GET",
      headers: req.headers,
    });

    return GET(syntheticGetReq);
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error)?.message || "Invalid JSON payload." }, { status: 400 });
  }
}
