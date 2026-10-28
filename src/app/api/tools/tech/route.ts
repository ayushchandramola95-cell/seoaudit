import { NextRequest, NextResponse } from "next/server";
import { scrapeWebsite } from "@/lib/modules/seo/fetcher";
import {
  detectTechnologies,
  inspectDnsInfrastructure,
  analyzeArchitecture,
  generateStackInsights,
  DetectedTechnology,
} from "@/lib/modules/tech/detector";
import { validateUrlForSsrf, SsrfSecurityError } from "@/lib/security/ssrf";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl || targetUrl.trim().length === 0) {
    return NextResponse.json({ success: false, error: "Missing required 'url' parameter." }, { status: 400 });
  }

  let formattedUrl = targetUrl.trim();
  if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
    formattedUrl = `https://${formattedUrl}`;
  }

  let domain = "";
  try {
    domain = new URL(formattedUrl).hostname;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid URL format." }, { status: 400 });
  }

  try {
    // SSRF verification
    await validateUrlForSsrf(formattedUrl);
  } catch (err: unknown) {
    if (err instanceof SsrfSecurityError) {
      return NextResponse.json({ success: false, error: err.message }, { status: 403 });
    }
  }

  const startTime = Date.now();
  let rawHtml = "";
  let headersRecord: Record<string, string> = {};
  let statusCode = 200;
  let finalUrl = formattedUrl;

  // 1. Primary Scraping Attempt
  try {
    const pageData = await scrapeWebsite(formattedUrl);
    rawHtml = pageData.rawHtml;
    headersRecord = pageData.headers;
    statusCode = pageData.httpStatus;
    finalUrl = pageData.finalUrl;
    domain = pageData.domain;
  } catch {
    // 2. Resilient Fallback: Direct Fetch (even on 403/503 Cloudflare/WAF responses)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const resp = await fetch(formattedUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });
      clearTimeout(timeoutId);

      statusCode = resp.status;
      finalUrl = resp.url || formattedUrl;
      resp.headers.forEach((v, k) => {
        headersRecord[k.toLowerCase()] = v;
      });
      rawHtml = await resp.text();
    } catch {
      // Direct HTTP fetch failed; will still proceed with DNS-based discovery
    }
  }

  const responseTimeMs = Date.now() - startTime;

  // 3. Run HTML & Header Technology Detection
  const pageTechs = detectTechnologies(rawHtml, headersRecord);

  // 4. Run DNS Infrastructure Discovery (Cloudflare DNS, AWS Route53, Google Workspace, Microsoft 365, etc.)
  const dnsResult = await inspectDnsInfrastructure(domain);

  // Merge and deduplicate technologies by name
  const techMap = new Map<string, DetectedTechnology>();
  for (const t of [...pageTechs, ...dnsResult.detected]) {
    if (!techMap.has(t.name)) {
      techMap.set(t.name, t);
    } else {
      const existing = techMap.get(t.name)!;
      if (t.confidence === "High") existing.confidence = "High";
      if (t.version && !existing.version) existing.version = t.version;
    }
  }

  const allTechnologies = Array.from(techMap.values()).sort((a, b) => {
    if (a.confidence === "High" && b.confidence !== "High") return -1;
    if (b.confidence === "High" && a.confidence !== "High") return 1;
    return a.name.localeCompare(b.name);
  });

  // 5. Analyze Stack Architecture, Modernness Score & Performance Tier
  const architecture = analyzeArchitecture(allTechnologies, headersRecord, statusCode);

  // 6. Generate Security Risks, Header Checks & Optimization Opportunities
  const insights = generateStackInsights(allTechnologies, headersRecord);

  return NextResponse.json({
    success: true,
    url: finalUrl,
    domain,
    statusCode,
    responseTimeMs,
    totalTechnologies: allTechnologies.length,
    architecture,
    data: allTechnologies,
    rawHeaders: headersRecord,
    rawHeadersCount: Object.keys(headersRecord).length,
    dnsRecords: dnsResult.rawRecords,
    insights,
  });
}
