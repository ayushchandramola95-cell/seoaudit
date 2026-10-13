import { NextRequest, NextResponse } from "next/server";
import { getScanById, getComparisonById } from "@/lib/db/client";
import { STRIPE_SAMPLE_AUDIT } from "@/lib/data/sampleAudits";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Report ID is required." },
      { status: 400 }
    );
  }

  // 1. Try finding in website_scans
  const scan = await getScanById(id);
  if (scan) {
    return NextResponse.json({
      success: true,
      type: "scan",
      data: scan,
    });
  }

  // 2. Try finding in comparisons
  const comparison = await getComparisonById(id);
  if (comparison) {
    return NextResponse.json({
      success: true,
      type: "comparison",
      data: comparison,
    });
  }

  // 3. Fallback for sample/demo audit reference
  if (
    id === "sample-stripe-enterprise" ||
    id === "demo" ||
    id.toLowerCase().includes("stripe") ||
    id.toLowerCase().includes("sample")
  ) {
    return NextResponse.json({
      success: true,
      type: "scan",
      data: {
        id: "sample-stripe-enterprise",
        domain: STRIPE_SAMPLE_AUDIT.page.domain,
        targetUrl: STRIPE_SAMPLE_AUDIT.page.requestedUrl,
        seoScore: STRIPE_SAMPLE_AUDIT.audit.overallScore,
        grade: STRIPE_SAMPLE_AUDIT.audit.grade,
        responseTimeMs: STRIPE_SAMPLE_AUDIT.page.responseTimeMs,
        perfScore: STRIPE_SAMPLE_AUDIT.performance.scores.performance,
        techCount: STRIPE_SAMPLE_AUDIT.technologies.length,
        trafficRange: STRIPE_SAMPLE_AUDIT.traffic.formattedRange,
        createdAt: STRIPE_SAMPLE_AUDIT.timestamp,
        fullReportJson: STRIPE_SAMPLE_AUDIT,
      },
    });
  }

  return NextResponse.json(
    { success: false, error: `Report '${id}' not found.` },
    { status: 404 }
  );
}
