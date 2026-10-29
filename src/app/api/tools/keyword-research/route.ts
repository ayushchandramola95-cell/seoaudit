import { NextRequest, NextResponse } from "next/server";
import { scrapeWebsite } from "@/lib/modules/seo/fetcher";
import { extractKeywordAnalysis } from "@/lib/modules/keywords/extractor";
import { validateUrlForSsrf, SsrfSecurityError } from "@/lib/security/ssrf";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl || targetUrl.trim().length === 0) {
    return NextResponse.json({ success: false, error: "Missing required 'url' parameter." }, { status: 400 });
  }

  let formatted = targetUrl.trim();
  if (!formatted.startsWith("http://") && !formatted.startsWith("https://")) {
    formatted = `https://${formatted}`;
  }

  try {
    await validateUrlForSsrf(formatted);
    const startTime = Date.now();
    const pageData = await scrapeWebsite(formatted);
    const keywords = extractKeywordAnalysis(pageData.rawHtml, pageData.title);
    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      url: pageData.finalUrl,
      domain: pageData.domain,
      title: pageData.title,
      wordCount: pageData.wordCount,
      latencyMs,
      data: keywords,
    });
  } catch (err: unknown) {
    if (err instanceof SsrfSecurityError) {
      return NextResponse.json({ success: false, error: "Security Exception: Internal or reserved IPs cannot be scanned." }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: (err as Error)?.message || "Failed to extract keywords." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetUrl = body.url || req.nextUrl.searchParams.get("url");

    if (!targetUrl || typeof targetUrl !== "string") {
      return NextResponse.json({ success: false, error: "Missing required 'url' parameter in JSON request body." }, { status: 400 });
    }

    const urlWithParams = new URL(req.url);
    urlWithParams.searchParams.set("url", targetUrl);

    const syntheticGetReq = new NextRequest(urlWithParams, {
      method: "GET",
      headers: req.headers,
    });

    return GET(syntheticGetReq);
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error)?.message || "Invalid JSON payload." }, { status: 400 });
  }
}

