import { NextResponse } from "next/server";
import { syncMemoryToPostgres, getDatabaseTelemetry } from "@/lib/db/client";

export async function POST() {
  try {
    const result = await syncMemoryToPostgres();
    const telemetry = await getDatabaseTelemetry();

    return NextResponse.json({
      success: true,
      message: `Successfully synchronized ${result.syncedScans} scan(s) and ${result.syncedComparisons} comparison(s) to PostgreSQL.`,
      result,
      telemetry,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error)?.message || "Failed to sync memory records to database." },
      { status: 500 }
    );
  }
}
