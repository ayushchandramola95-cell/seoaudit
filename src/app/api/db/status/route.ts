import { NextResponse } from "next/server";
import { getDatabaseTelemetry } from "@/lib/db/client";

export async function GET() {
  try {
    const telemetry = await getDatabaseTelemetry();
    return NextResponse.json({
      success: true,
      data: telemetry,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    return NextResponse.json({
      success: true,
      data: {
        connected: false,
        mode: "in_memory",
        isCustomPostgres: false,
        isCloudSqlConfigured: false,
        databaseType: "In-Memory Sandbox (Offline / Fallback)",
        maskedUrl: "None (Fallback Active)",
        latencyMs: 0,
        databaseVersion: "Local Storage Array",
        currentDatabase: "in_memory",
        tableCounts: {
          website_scans: 0,
          comparisons: 0,
          workspace_projects: 4,
          monitored_domains: 0,
          users: 1,
        },
        tables: ["website_scans", "comparisons", "workspace_projects"],
        poolStats: { totalCount: 0, idleCount: 0, waitingCount: 0 },
        error: (err as Error)?.message || "Database offline",
      },
      timestamp: new Date().toISOString(),
    });
  }
}
