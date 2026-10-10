import { NextRequest, NextResponse } from "next/server";
import { getScanById, getComparisonById } from "@/lib/db/client";

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

  return NextResponse.json(
    { success: false, error: `Report '${id}' not found.` },
    { status: 404 }
  );
}
