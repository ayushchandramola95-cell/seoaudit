import { NextRequest, NextResponse } from "next/server";
import { getDomainScanHistory } from "@/lib/db/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain");

  if (!domain || !domain.trim()) {
    return NextResponse.json(
      { success: false, error: "Missing 'domain' query parameter." },
      { status: 400 }
    );
  }

  try {
    const history = await getDomainScanHistory(domain, 12);
    return NextResponse.json({
      success: true,
      domain: domain.trim().toLowerCase(),
      count: history.length,
      history,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: (err as Error)?.message || "Failed to load domain scan history.",
      },
      { status: 500 }
    );
  }
}
