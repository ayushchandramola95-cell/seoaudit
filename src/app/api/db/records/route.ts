import { NextRequest, NextResponse } from "next/server";
import { getRecentScans, getRecentComparisons, getDbPool } from "@/lib/db/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "scans";
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);

    const isConnected = Boolean(getDbPool());

    if (type === "comparisons") {
      const records = await getRecentComparisons(limit);
      return NextResponse.json({
        success: true,
        type: "comparisons",
        isConnected,
        count: records.length,
        records,
      });
    }

    const records = await getRecentScans(limit);
    return NextResponse.json({
      success: true,
      type: "scans",
      isConnected,
      count: records.length,
      records,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error)?.message || "Failed to fetch database records." },
      { status: 500 }
    );
  }
}
