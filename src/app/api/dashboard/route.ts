import { NextResponse } from "next/server";
import { getRecentScans, getRecentComparisons, getDatabaseStatus } from "@/lib/db/client";

export async function GET() {
  const scans = await getRecentScans(15);
  const comparisons = await getRecentComparisons(10);
  const status = getDatabaseStatus();

  return NextResponse.json({
    success: true,
    status,
    scans,
    comparisons,
    timestamp: new Date().toISOString(),
  });
}
