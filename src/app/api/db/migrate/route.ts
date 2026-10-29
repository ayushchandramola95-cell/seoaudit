import { NextResponse } from "next/server";
import { getDbPool, ensureSchema, getDatabaseTelemetry } from "@/lib/db/client";

export async function POST() {
  try {
    const pool = getDbPool();
    if (!pool) {
      return NextResponse.json(
        {
          success: false,
          error: "No active PostgreSQL connection. Connect a custom database or set DATABASE_URL first.",
        },
        { status: 400 }
      );
    }

    const success = await ensureSchema(pool);
    const telemetry = await getDatabaseTelemetry();

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Database schema migrations executed successfully.",
        tables: telemetry.tables,
        telemetry,
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Failed to apply migrations. Check PostgreSQL permissions." },
        { status: 500 }
      );
    }
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error)?.message || "Migration error." },
      { status: 500 }
    );
  }
}
