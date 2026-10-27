import { NextRequest, NextResponse } from "next/server";
import { getRecentScans, getRecentComparisons, getDatabaseStatus } from "@/lib/db/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || request.headers.get("x-user-id") || null;
  const userEmail = searchParams.get("userEmail") || request.headers.get("x-user-email") || null;

  const scans = await getRecentScans(25, userId, userEmail);
  const comparisons = await getRecentComparisons(10);
  const status = getDatabaseStatus();

  return NextResponse.json({
    success: true,
    status,
    scans,
    comparisons,
    userId,
    userEmail,
    timestamp: new Date().toISOString(),
  });
}
