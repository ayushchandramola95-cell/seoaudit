import { NextRequest, NextResponse } from "next/server";
import { fetchOpenPageRank } from "@/lib/modules/traffic/openPageRank";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("domain") || searchParams.get("url");

  if (!target || target.trim().length === 0) {
    return NextResponse.json({ success: false, error: "Missing required 'domain' or 'url' parameter." }, { status: 400 });
  }

  try {
    let domain = target.trim();
    try {
      if (domain.startsWith("http://") || domain.startsWith("https://")) {
        domain = new URL(domain).hostname;
      }
    } catch {
      // Keep as-is if already domain format
    }

    const openPageRank = await fetchOpenPageRank(domain);
    const decimal = openPageRank.pageRankDecimal ?? 0;
    let tier = openPageRank.tier;
    if (!tier) {
      if (decimal >= 8) tier = "Tier 1 - Global Authority (Top 0.01%)";
      else if (decimal >= 5) tier = "Tier 2 - High Authority (Top 1%)";
      else if (decimal >= 3) tier = "Tier 3 - Established Domain";
      else tier = "Tier 4 - Emerging Site";
    }

    return NextResponse.json({
      success: true,
      domain,
      tier,
      data: openPageRank,
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error)?.message || "Failed to fetch Open PageRank." }, { status: 500 });
  }
}
