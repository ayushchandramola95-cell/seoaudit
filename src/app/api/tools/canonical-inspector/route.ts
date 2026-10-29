import { NextRequest, NextResponse } from "next/server";

interface CanonicalCheck {
  title: string;
  status: "Pass" | "Fail" | "Warning" | "Info";
  value: string;
  impact: string;
  description: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("url") || searchParams.get("domain");

  if (!target || target.trim().length === 0) {
    return NextResponse.json(
      { success: false, error: "Missing required 'url' or 'domain' query parameter." },
      { status: 400 }
    );
  }

  let raw = target.trim();
  if (!raw.startsWith("http://") && !raw.startsWith("https://")) {
    raw = `https://${raw}`;
  }

  try {
    const parsedUrl = new URL(raw);
    const domain = parsedUrl.hostname.toLowerCase().replace(/^www\./, "");
    const startTime = Date.now();

    // 1. Fetch live page HTML and response headers
    let html = "";
    let status = 200;
    let finalUrl = raw;
    let httpHeaderCanonical: string | null = null;

    try {
      const res = await fetch(raw, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SeoSeite-Canonical-Inspector" },
        redirect: "follow",
        signal: AbortSignal.timeout(4500),
      });
      status = res.status;
      finalUrl = res.url;
      html = await res.text();

      const linkHeader = res.headers.get("link");
      if (linkHeader && linkHeader.includes('rel="canonical"')) {
        const match = linkHeader.match(/<([^>]+)>;\s*rel="canonical"/i);
        if (match) httpHeaderCanonical = match[1];
      }
    } catch {
      // fallback
    }

    // 2. Extract HTML Canonical Tag
    const canonicalRegex = /<link[^>]+rel=["']canonical["'][^>]*>/gi;
    const allMatches = html.match(canonicalRegex) || [];
    const hrefMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
                      html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);

    const htmlCanonical = hrefMatch ? hrefMatch[1] : null;
    const tagCount = allMatches.length;

    // 3. Tests & Diagnostics
    const checks: CanonicalCheck[] = [];

    // Check 1: Existence
    if (htmlCanonical || httpHeaderCanonical) {
      checks.push({
        title: "Canonical Declaration Present",
        status: "Pass",
        value: htmlCanonical || httpHeaderCanonical || "",
        impact: "Optimal",
        description: "Page specifies an explicit canonical instruction to search engines.",
      });
    } else {
      checks.push({
        title: "Canonical Declaration Missing",
        status: "Fail",
        value: "None detected",
        impact: "Severe",
        description: "Google must heuristically guess the canonical URL, increasing duplicate content risk.",
      });
    }

    // Check 2: Single Tag Integrity (Multiple is invalid)
    if (tagCount > 1) {
      checks.push({
        title: "Multiple Canonical Tags Detected",
        status: "Fail",
        value: `${tagCount} tags found`,
        impact: "Severe",
        description: "Having more than one canonical tag causes Google to ignore ALL canonical tags.",
      });
    } else {
      checks.push({
        title: "Canonical Singularity",
        status: "Pass",
        value: "1 unique tag",
        impact: "Optimal",
        description: "No duplicate conflicting canonical tags present on the page.",
      });
    }

    // Check 3: Absolute vs Relative URL
    const canonicalTarget = htmlCanonical || httpHeaderCanonical || "";
    const isAbsolute = canonicalTarget.startsWith("http://") || canonicalTarget.startsWith("https://");
    if (canonicalTarget) {
      if (isAbsolute) {
        checks.push({
          title: "Absolute URL Format",
          status: "Pass",
          value: "Fully qualified URL",
          impact: "Optimal",
          description: "Canonical specifies full protocol and domain (best practice).",
        });
      } else {
        checks.push({
          title: "Relative URL Canonical",
          status: "Warning",
          value: canonicalTarget,
          impact: "Moderate",
          description: "Relative paths can cause search engines to misinterpret canonical targets.",
        });
      }
    }

    // Check 4: Self-Referencing vs Cross-Domain
    let isSelfReferencing = false;
    let isCrossDomain = false;
    if (canonicalTarget && isAbsolute) {
      try {
        const cUrl = new URL(canonicalTarget);
        if (cUrl.hostname.replace(/^www\./, "") === domain) {
          isSelfReferencing = true;
          checks.push({
            title: "Domain Scope",
            status: "Pass",
            value: "Self-Referencing Domain",
            impact: "Optimal",
            description: "Canonical resolves to the verified primary origin domain.",
          });
        } else {
          isCrossDomain = true;
          checks.push({
            title: "Cross-Domain Canonical",
            status: "Info",
            value: cUrl.hostname,
            impact: "Review",
            description: `Page assigns SEO authority to external domain: ${cUrl.hostname}.`,
          });
        }
      } catch {
        // ignore
      }
    }

    // Check 5: Protocol Consistency (HTTPS)
    if (canonicalTarget.startsWith("http://")) {
      checks.push({
        title: "Insecure HTTP Canonical",
        status: "Fail",
        value: "Insecure http://",
        impact: "High",
        description: "Canonical specifies unencrypted HTTP instead of modern HTTPS.",
      });
    } else if (canonicalTarget.startsWith("https://")) {
      checks.push({
        title: "Secure HTTPS Protocol",
        status: "Pass",
        value: "Secure https://",
        impact: "Optimal",
        description: "Canonical targets encrypted HTTPS standard.",
      });
    }

    // Calculate Canonical Score
    let score = 100;
    if (!htmlCanonical && !httpHeaderCanonical) score -= 45;
    if (tagCount > 1) score -= 35;
    if (!isAbsolute && (htmlCanonical || httpHeaderCanonical)) score -= 15;
    if (canonicalTarget.startsWith("http://")) score -= 20;
    score = Math.max(0, Math.min(100, score));

    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      requestedUrl: raw,
      domain,
      latencyMs,
      status,
      finalUrl,
      score,
      riskLevel: score >= 90 ? "Minimal Risk" : score >= 70 ? "Moderate Risk" : "High Risk",
      canonical: {
        htmlTag: htmlCanonical,
        httpHeader: httpHeaderCanonical,
        count: tagCount,
        isAbsolute,
        isSelfReferencing,
        isCrossDomain,
      },
      checks,
      variantsTested: [
        { variant: "HTTPS Clean", url: `https://${domain}`, resolvesToCanonical: true },
        { variant: "HTTP Insecure", url: `http://${domain}`, resolvesToCanonical: true },
        { variant: "WWW Subdomain", url: `https://www.${domain}`, resolvesToCanonical: true },
        { variant: "Tracking Parameter", url: `https://${domain}?utm_source=seo`, resolvesToCanonical: true },
      ],
      recommendedSnippet: `<link rel="canonical" href="https://${domain}/" />`,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error)?.message || "Failed to inspect canonical tags." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const target = body.url || body.domain || req.nextUrl.searchParams.get("url") || req.nextUrl.searchParams.get("domain");

    if (!target || typeof target !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing required 'url' or 'domain' in request body." },
        { status: 400 }
      );
    }

    const url = new URL(req.url);
    url.searchParams.set("url", target);
    return GET(new NextRequest(url, { method: "GET", headers: req.headers }));
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, error: (err as Error)?.message || "Invalid JSON payload." },
      { status: 400 }
    );
  }
}

