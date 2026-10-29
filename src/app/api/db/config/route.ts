import { NextRequest, NextResponse } from "next/server";
import {
  setCustomDatabaseUrl,
  testPostgresConnection,
  getDbPool,
  ensureSchema,
  getDatabaseTelemetry,
} from "@/lib/db/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const databaseUrl = typeof body.databaseUrl === "string" ? body.databaseUrl.trim() : "";

    if (!databaseUrl) {
      return NextResponse.json(
        { success: false, error: "databaseUrl is required." },
        { status: 400 }
      );
    }

    // 1. Test connection before saving
    const testResult = await testPostgresConnection(databaseUrl);
    if (!testResult.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Connection test failed: ${testResult.error}`,
          details: testResult,
        },
        { status: 400 }
      );
    }

    // 2. Persist custom database URL
    setCustomDatabaseUrl(databaseUrl);

    // 3. Initialize schema on the new database
    const pool = getDbPool();
    let schemaReady = false;
    if (pool) {
      schemaReady = await ensureSchema(pool);
    }

    const telemetry = await getDatabaseTelemetry();

    return NextResponse.json({
      success: true,
      message: "Custom PostgreSQL database connected and initialized successfully.",
      schemaReady,
      telemetry,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error)?.message || "Failed to configure custom database." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    setCustomDatabaseUrl(null);
    const telemetry = await getDatabaseTelemetry();
    return NextResponse.json({
      success: true,
      message: "Custom database disconnected. Reverted to default environment / in-memory fallback.",
      telemetry,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error)?.message || "Failed to reset database configuration." },
      { status: 500 }
    );
  }
}
