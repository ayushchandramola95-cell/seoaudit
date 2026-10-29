import { NextRequest, NextResponse } from "next/server";
import { scrapeWebsite, HeaderEvaluation, SecurityHeadersReport } from "@/lib/modules/seo/fetcher";
import { SsrfSecurityError } from "@/lib/security/ssrf";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl || targetUrl.trim().length === 0) {
    return NextResponse.json(
      { success: false, error: "Missing required 'url' parameter." },
      { status: 400 }
    );
  }

  try {
    const pageData = await scrapeWebsite(targetUrl.trim());
    let sec = pageData.securityHeaders;

    const headers = pageData.headers || {};
    const hstsRaw = headers["strict-transport-security"] || sec.rawHeaders?.["strict-transport-security"] || null;
    const cspRaw = headers["content-security-policy"] || sec.rawHeaders?.["content-security-policy"] || null;
    const xfoRaw = headers["x-frame-options"] || sec.rawHeaders?.["x-frame-options"] || null;
    const xctoRaw = headers["x-content-type-options"] || sec.rawHeaders?.["x-content-type-options"] || null;
    const rpRaw = headers["referrer-policy"] || sec.rawHeaders?.["referrer-policy"] || null;
    const ppRaw = headers["permissions-policy"] || headers["feature-policy"] || sec.rawHeaders?.["permissions-policy"] || null;
    const coopRaw = headers["cross-origin-opener-policy"] || sec.rawHeaders?.["cross-origin-opener-policy"] || null;
    const coepRaw = headers["cross-origin-embedder-policy"] || sec.rawHeaders?.["cross-origin-embedder-policy"] || null;
    const corpRaw = headers["cross-origin-resource-policy"] || sec.rawHeaders?.["cross-origin-resource-policy"] || null;

    const hsts = Boolean(hstsRaw);
    const csp = Boolean(cspRaw);
    const xFrameOptions = xfoRaw;
    const xContentTypeOptions = (xctoRaw || "").toLowerCase().includes("nosniff");
    const referrerPolicy = rpRaw;
    const permissionsPolicy = Boolean(ppRaw);

    // Bulletproof safeguard: If cached fetcher didn't populate evaluations, evaluate directly
    if (!sec.evaluations || sec.evaluations.length === 0) {
      const evaluations: HeaderEvaluation[] = [
        {
          key: "strict-transport-security",
          name: "HTTP Strict Transport Security (HSTS)",
          value: hstsRaw,
          status: hsts ? (hstsRaw?.includes("includeSubDomains") ? "secure" : "warning") : "missing",
          scoreImpact: 25,
          description: "Forces user agents to communicate exclusively over encrypted HTTPS, preventing SSL stripping.",
          recommendation: hsts ? undefined : "Add 'Strict-Transport-Security: max-age=63072000; includeSubDomains; preload'.",
          attackMitigation: "SSL Stripping, Man-in-the-Middle (MITM) Interception",
        },
        {
          key: "content-security-policy",
          name: "Content Security Policy (CSP)",
          value: cspRaw,
          status: csp ? (cspRaw?.includes("unsafe-inline") ? "warning" : "secure") : "missing",
          scoreImpact: 25,
          description: "Restricts origins of executable scripts, stylesheets, and iframes to neutralize code injection exploits.",
          recommendation: csp ? undefined : "Configure a Content-Security-Policy restricting script-src, frame-ancestors, and object-src.",
          attackMitigation: "Cross-Site Scripting (XSS), Clickjacking, Code Injection",
        },
        {
          key: "x-frame-options",
          name: "X-Frame-Options (Clickjacking Guard)",
          value: xfoRaw,
          status: xfoRaw ? "secure" : "missing",
          scoreImpact: 15,
          description: "Instructs browsers whether this page is permitted to be rendered inside an <iframe> or <embed>.",
          recommendation: xfoRaw ? undefined : "Set 'X-Frame-Options: DENY' or 'SAMEORIGIN' to prevent framing attacks.",
          attackMitigation: "Clickjacking, Hidden Overlay Attacks, UI Redress Exploits",
        },
        {
          key: "x-content-type-options",
          name: "X-Content-Type-Options (MIME Sniffing)",
          value: xctoRaw,
          status: xContentTypeOptions ? "secure" : "missing",
          scoreImpact: 15,
          description: "Prevents browsers from MIME-sniffing a response away from the declared content-type.",
          recommendation: xContentTypeOptions ? undefined : "Set 'X-Content-Type-Options: nosniff'.",
          attackMitigation: "MIME Confusion, Drive-By Executable Downloads",
        },
        {
          key: "referrer-policy",
          name: "Referrer-Policy (Privacy Isolation)",
          value: rpRaw,
          status: referrerPolicy ? "secure" : "warning",
          scoreImpact: 10,
          description: "Governs which referrer information should be sent when following links to external destinations.",
          recommendation: referrerPolicy ? undefined : "Set 'Referrer-Policy: strict-origin-when-cross-origin'.",
          attackMitigation: "Private URL Query Leaks, Auth Token Exfiltration",
        },
        {
          key: "permissions-policy",
          name: "Permissions-Policy (Hardware Sensor Sandbox)",
          value: ppRaw,
          status: permissionsPolicy ? "secure" : "warning",
          scoreImpact: 10,
          description: "Restricts embedded third-party frames from accessing device sensors like camera, microphone, or geolocation.",
          recommendation: permissionsPolicy ? undefined : "Set 'Permissions-Policy: camera=(), microphone=(), geolocation=()'.",
          attackMitigation: "Unauthorized Camera/Mic Hijacking, Location Fingerprinting",
        },
      ];

      let calcSecScore = 0;
      evaluations.forEach((e) => {
        if (e.status === "secure") calcSecScore += e.scoreImpact;
        else if (e.status === "warning") calcSecScore += Math.round(e.scoreImpact * 0.6);
      });
      const securityScore = Math.min(100, Math.max(10, calcSecScore));
      const grade: SecurityHeadersReport["grade"] =
        securityScore >= 95 ? "A+" : securityScore >= 85 ? "A" : securityScore >= 70 ? "B" : securityScore >= 50 ? "C" : "F";

      sec = {
        hsts,
        csp,
        xFrameOptions,
        xContentTypeOptions,
        referrerPolicy,
        permissionsPolicy,
        securityScore,
        grade,
        passedCount: evaluations.filter((e) => e.status === "secure").length,
        warningCount: evaluations.filter((e) => e.status === "warning").length,
        missingCount: evaluations.filter((e) => e.status === "missing").length,
        evaluations,
        rawHeaders: pageData.headers,
        serverHeader: pageData.serverHeader,
        xPoweredBy: pageData.xPoweredBy,
        coop: coopRaw,
        coep: coepRaw,
        corp: corpRaw,
      };
    }

    // 1. Parse HSTS Details & Preload Readiness
    const hstsHeader = hstsRaw || "";
    const maxAgeMatch = hstsHeader.match(/max-age=(\d+)/i);
    const maxAgeSeconds = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) : null;
    const hasSubDomains = /includeSubDomains/i.test(hstsHeader);
    const hasPreload = /preload/i.test(hstsHeader);
    const isHstsPreloadEligible = Boolean(
      pageData.isHttps &&
      maxAgeSeconds !== null &&
      maxAgeSeconds >= 31536000 &&
      hasSubDomains &&
      hasPreload
    );

    const hstsDetails = {
      headerValue: hstsHeader || null,
      maxAgeSeconds,
      durationDays: maxAgeSeconds ? Math.round(maxAgeSeconds / 86400) : 0,
      durationYears: maxAgeSeconds ? (maxAgeSeconds / (86400 * 365)).toFixed(1) : "0",
      includeSubDomains: hasSubDomains,
      preload: hasPreload,
      preloadEligible: isHstsPreloadEligible,
      minRequirementMet: maxAgeSeconds !== null && maxAgeSeconds >= 31536000,
    };

    // 2. Parse CSP Directives & Directive Analysis
    const cspHeader = cspRaw || "";
    const cspDirectives: Array<{ name: string; sources: string[]; hasWarning: boolean; warningMsg?: string }> = [];
    let cspHasUnsafeInline = false;
    let cspHasUnsafeEval = false;

    if (cspHeader) {
      const parts = cspHeader.split(";").map((p) => p.trim()).filter(Boolean);
      parts.forEach((part) => {
        const tokens = part.split(/\s+/);
        const name = tokens[0];
        const sources = tokens.slice(1);
        const hasUnsafe = sources.some((s) => s.includes("unsafe-inline") || s.includes("unsafe-eval"));
        if (sources.includes("'unsafe-inline'")) cspHasUnsafeInline = true;
        if (sources.includes("'unsafe-eval'")) cspHasUnsafeEval = true;

        cspDirectives.push({
          name,
          sources,
          hasWarning: hasUnsafe,
          warningMsg: hasUnsafe ? "Allows unhashed inline scripts or eval execution" : undefined,
        });
      });
    }

    // 3. Threat Defense Surface (8 Threat Vectors)
    const threatDefense = [
      {
        id: "ssl-strip",
        name: "SSL Stripping & Downgrade Prevention",
        header: "Strict-Transport-Security",
        protected: sec.hsts,
        severity: "critical",
        description: "Prevents attackers on shared Wi-Fi / networks from intercepting traffic before HTTPS upgrade.",
      },
      {
        id: "xss-inject",
        name: "Cross-Site Scripting (XSS)",
        header: "Content-Security-Policy",
        protected: sec.csp,
        severity: "critical",
        description: "Restricts script execution origins to neutralize injected malicious JavaScript.",
      },
      {
        id: "clickjacking",
        name: "Clickjacking & UI Redress Attacks",
        header: "X-Frame-Options",
        protected: Boolean(sec.xFrameOptions),
        severity: "high",
        description: "Stops malicious actors from embedding your site inside invisible iframes to capture clicks.",
      },
      {
        id: "mime-sniff",
        name: "MIME-Type Sniffing Confusion",
        header: "X-Content-Type-Options",
        protected: sec.xContentTypeOptions,
        severity: "high",
        description: "Prevents browsers from executing non-executable media files (e.g. user avatar uploads) as scripts.",
      },
      {
        id: "referrer-leak",
        name: "Private URL & Session Query Leakage",
        header: "Referrer-Policy",
        protected: Boolean(sec.referrerPolicy),
        severity: "medium",
        description: "Prevents sensitive URL tokens and internal paths from leaking to third-party domains.",
      },
      {
        id: "sensor-theft",
        name: "Hardware Sensor & Mic Hijacking",
        header: "Permissions-Policy",
        protected: sec.permissionsPolicy,
        severity: "medium",
        description: "Blocks embedded advertising iframes from turning on user cameras, microphones, or location.",
      },
      {
        id: "context-iso",
        name: "Cross-Origin Context Isolation (COOP)",
        header: "Cross-Origin-Opener-Policy",
        protected: Boolean(coopRaw),
        severity: "medium",
        description: "Mitigates Spectre-like side-channel attacks by separating window browsing contexts.",
      },
      {
        id: "stack-fingerprint",
        name: "Server Technology Fingerprinting",
        header: "X-Powered-By Cloaking",
        protected: !pageData.xPoweredBy,
        severity: "medium",
        description: "Stops automated vulnerability bots from identifying exact web server and framework versions.",
      },
    ];

    const protectedCount = threatDefense.filter((t) => t.protected).length;
    const defenseCoveragePercent = Math.round((protectedCount / threatDefense.length) * 100);

    // 4. Cookie Security Audit
    const rawSetCookie = pageData.headers["set-cookie"] || "";
    const cookieAudits: Array<{ name: string; isSecure: boolean; isHttpOnly: boolean; sameSite: string | null; issues: string[] }> = [];

    if (rawSetCookie) {
      const cookieStrings = rawSetCookie.split(/,(?=[^;]+=[^;]+)/g);
      cookieStrings.forEach((cStr) => {
        const parts = cStr.split(";").map((p) => p.trim());
        const [nameVal] = parts;
        const eqIdx = nameVal.indexOf("=");
        const name = eqIdx > -1 ? nameVal.slice(0, eqIdx) : nameVal;

        const isSecure = parts.some((p) => p.toLowerCase() === "secure");
        const isHttpOnly = parts.some((p) => p.toLowerCase() === "httponly");
        const sameSitePart = parts.find((p) => p.toLowerCase().startsWith("samesite="));
        const sameSite = sameSitePart ? sameSitePart.split("=")[1] : null;

        const issues: string[] = [];
        if (!isSecure && pageData.isHttps) issues.push("Missing 'Secure' flag");
        if (!isHttpOnly) issues.push("Missing 'HttpOnly' flag (XSS session hijacking risk)");
        if (!sameSite) issues.push("Missing 'SameSite' attribute (CSRF risk)");

        cookieAudits.push({
          name,
          isSecure,
          isHttpOnly,
          sameSite,
          issues,
        });
      });
    }

    return NextResponse.json({
      success: true,
      url: pageData.finalUrl,
      domain: pageData.domain,
      httpStatus: pageData.httpStatus,
      responseTimeMs: pageData.responseTimeMs,
      isHttps: pageData.isHttps,
      securityHeaders: sec,
      hstsDetails,
      cspDetails: {
        raw: cspHeader || null,
        directives: cspDirectives,
        hasUnsafeInline: cspHasUnsafeInline,
        hasUnsafeEval: cspHasUnsafeEval,
      },
      threatDefense: {
        vectors: threatDefense,
        protectedCount,
        totalVectors: threatDefense.length,
        coveragePercent: defenseCoveragePercent,
      },
      cookieAudits,
      hasRobotsTxt: pageData.hasRobotsTxt,
      hasSitemapXml: pageData.hasSitemapXml,
    });
  } catch (err: unknown) {
    if (err instanceof SsrfSecurityError) {
      return NextResponse.json(
        { success: false, error: "Security Exception: Internal or reserved addresses cannot be audited." },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { success: false, error: (err as Error)?.message || "Failed to inspect security headers." },
      { status: 500 }
    );
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
