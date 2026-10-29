import { NextRequest, NextResponse } from "next/server";
import { testPostgresConnection } from "@/lib/db/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetUrl = typeof body.databaseUrl === "string" ? body.databaseUrl.trim() : undefined;

    const result = await testPostgresConnection(targetUrl);

    if (result.ok) {
      return NextResponse.json({
        success: true,
        message: "Successfully connected to PostgreSQL database.",
        details: result,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Connection failed.",
          details: result,
        },
        { status: 400 }
      );
    }
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error)?.message || "Internal error testing database." },
      { status: 500 }
    );
  }
}
