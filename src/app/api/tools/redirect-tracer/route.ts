import { NextRequest, NextResponse } from "next/server";
import { validateUrlForSsrf, SsrfSecurityError } from "@/lib/security/ssrf";

export interface RedirectHop {
  hopNumber: number;
  url: string;
  statusCode: number;
  statusText: string;
  responseTimeMs: number;
  isHttps: boolean;
  serverHeader?: string;
  locationHeader?: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("url") || searchParams.get("domain");

  if (!target || target.trim().length === 0) {
    return NextResponse.json({ success: false, error: "Missing required 'url' or 'domain' parameter." }, { status: 400 });
  }

  let currentUrl = target.trim();
  if (!currentUrl.startsWith("http://") && !currentUrl.startsWith("https://")) {
    currentUrl = `http://${currentUrl}`;
  }

  const hops: RedirectHop[] = [];
  const maxHops = 10;
  let hopCount = 0;
  const overallStart = Date.now();
  let loopDetected = false;
  const visitedUrls = new Set<string>();

  try {
    while (hopCount < maxHops) {
      await validateUrlForSsrf(currentUrl);

      if (visitedUrls.has(currentUrl)) {
        loopDetected = true;
        break;
      }
      visitedUrls.add(currentUrl);

      const hopStart = Date.now();
      const res = await fetch(currentUrl, {
        method: "HEAD",
        redirect: "manual",
        signal: AbortSignal.timeout(4000),
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        },
      }).catch(async () => {
        // Fallback to GET with manual redirect if HEAD is rejected by server
        return await fetch(currentUrl, {
          method: "GET",
          redirect: "manual",
          signal: AbortSignal.timeout(4000),
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          },
        });
      });

      const hopLatency = Date.now() - hopStart;
      hopCount++;

      const isHttps = currentUrl.startsWith("https://");
      const location = res.headers.get("location");
      const server = res.headers.get("server") || undefined;

      hops.push({
        hopNumber: hopCount,
        url: currentUrl,
        statusCode: res.status,
        statusText: res.statusText || (res.status === 200 ? "OK" : res.status === 301 ? "Moved Permanently" : res.status === 302 ? "Found" : "Redirect"),
        responseTimeMs: hopLatency,
        isHttps,
        serverHeader: server,
        locationHeader: location || undefined,
      });

      // If redirect status code and location header exists, proceed to next hop
      if ([301, 302, 303, 307, 308].includes(res.status) && location) {
        let nextUrl = location;
        try {
          nextUrl = new URL(location, currentUrl).toString();
        } catch {
          // Keep as is
        }
        currentUrl = nextUrl;
      } else {
        // Final destination reached
        break;
      }
    }

    const totalLatencyMs = Date.now() - overallStart;
    const finalHop = hops[hops.length - 1];
    const isSslSafe = hops.every((h, idx) => {
      if (idx === 0) return true;
      // If a previous hop was HTTPS, subsequent hops must also be HTTPS (no SSL downgrade)
      const prev = hops[idx - 1];
      if (prev.isHttps && !h.isHttps) return false;
      return true;
    });

    return NextResponse.json({
      success: true,
      initialUrl: hops[0]?.url || currentUrl,
      finalUrl: finalHop?.url || currentUrl,
      totalHops: hops.length,
      totalLatencyMs,
      loopDetected,
      isSslSafe,
      hops,
    });
  } catch (err: unknown) {
    if (err instanceof SsrfSecurityError) {
      return NextResponse.json({ success: false, error: "Security Exception: Internal or reserved IPs cannot be scanned." }, { status: 403 });
    }
    return NextResponse.json({ success: false, error: (err as Error)?.message || "Failed to trace HTTP redirect hops." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const target = body.url || body.domain || req.nextUrl.searchParams.get("url") || req.nextUrl.searchParams.get("domain");

    if (!target || typeof target !== "string") {
      return NextResponse.json({ success: false, error: "Missing required 'url' or 'domain' parameter in JSON body." }, { status: 400 });
    }

    const urlWithParams = new URL(req.url);
    urlWithParams.searchParams.set("url", target);

    const syntheticGetReq = new NextRequest(urlWithParams, {
      method: "GET",
      headers: req.headers,
    });

    return GET(syntheticGetReq);
  } catch (err: unknown) {
    return NextResponse.json({ success: false, error: (err as Error)?.message || "Invalid JSON payload." }, { status: 400 });
  }
}

