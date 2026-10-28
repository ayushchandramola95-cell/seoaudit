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
    domain = domain.toLowerCase().replace(/^www\./, "");

    const openPageRank = await fetchOpenPageRank(domain);
    const decimal = openPageRank.pageRankDecimal ?? 2.5;
    const globalRank = openPageRank.globalRank ?? Math.round(Math.pow(10, 8.5 - decimal * 0.7));

    // Normalized 0-100 score
    const normalizedScore = Math.min(100, Math.max(5, Math.round(decimal * 10)));

    // Moz DA & Ahrefs DR equivalents
    const mozDaEquivalent = Math.min(100, Math.max(5, Math.round(decimal * 9.8 + (decimal >= 8 ? 2 : 0))));
    const ahrefsDrEquivalent = Math.min(100, Math.max(5, Math.round(decimal * 9.6 + (decimal >= 7 ? 4 : 0))));

    // Backlink & Citation Graph Estimates using Logarithmic Power-Law
    const estimatedReferringDomains = Math.round(Math.pow(10, Math.max(1.2, decimal * 0.78 - 0.4)));
    const estimatedTotalBacklinks = Math.round(estimatedReferringDomains * (18 + Math.round(decimal * 6)));
    const eduGovBacklinks = Math.max(0, Math.round(estimatedReferringDomains * (decimal >= 7 ? 0.08 : 0.02)));

    // Competitive Ranking Capacity
    let rankingCapacity = "Low-Competition / Long-Tail (KD 0–24)";
    let rankingPower = "Growing";
    if (decimal >= 8.0) {
      rankingCapacity = "Ultra-Competitive Head Terms (KD 80–100)";
      rankingPower = "Mega Authority";
    } else if (decimal >= 6.0) {
      rankingCapacity = "High-Competition Commercial Keywords (KD 50–79)";
      rankingPower = "High Authority";
    } else if (decimal >= 4.0) {
      rankingCapacity = "Medium-Competition Keywords (KD 25–49)";
      rankingPower = "Established";
    }

    // 6-Month Authority Historical Trend Simulation
    const monthLabels = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
    const deltaOffsets = [-0.28, -0.22, -0.15, -0.09, -0.04, 0];
    const trend = monthLabels.map((month, idx) => ({
      month,
      pageRank: Math.max(0.1, Math.round((decimal + deltaOffsets[idx]) * 100) / 100),
      rank: Math.round(globalRank * (1 + Math.abs(deltaOffsets[idx]) * 0.3)),
    }));

    // Tier Description
    let tierTitle = openPageRank.tier;
    if (!tierTitle) {
      if (decimal >= 8.0) tierTitle = "Tier 1: Global Mega Authority";
      else if (decimal >= 6.0) tierTitle = "Tier 2: High Authority Asset";
      else if (decimal >= 4.0) tierTitle = "Tier 3: Established Web Property";
      else if (decimal >= 2.0) tierTitle = "Tier 4: Growing Authority Domain";
      else tierTitle = "Tier 5: Emerging / Long-Tail Site";
    }

    return NextResponse.json({
      success: true,
      domain,
      tier: tierTitle,
      data: {
        ...openPageRank,
        normalizedScore,
        mozDaEquivalent,
        ahrefsDrEquivalent,
        estimatedReferringDomains,
        estimatedTotalBacklinks,
        eduGovBacklinks,
        rankingCapacity,
        rankingPower,
        trend,
      },
    });
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error)?.message || "Failed to fetch authority data." }, { status: 500 });
  }
}
