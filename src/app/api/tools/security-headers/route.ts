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

    // Bulletproof safeguard: If cached fetcher didn't populate evaluations, evaluate directly from headers
    if (!sec.evaluations || sec.evaluations.length === 0) {
      const headers = pageData.headers || {};
      const hstsRaw = headers["strict-transport-security"] || null;
      const cspRaw = headers["content-security-policy"] || null;
      const xfoRaw = headers["x-frame-options"] || null;
      const xctoRaw = headers["x-content-type-options"] || null;
      const rpRaw = headers["referrer-policy"] || null;
      const ppRaw = headers["permissions-policy"] || headers["feature-policy"] || null;

      const hsts = Boolean(hstsRaw);
      const csp = Boolean(cspRaw);
      const xFrameOptions = xfoRaw;
      const xContentTypeOptions = (xctoRaw || "").toLowerCase().includes("nosniff");
      const referrerPolicy = rpRaw;
      const permissionsPolicy = Boolean(ppRaw);

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
      };
    }

    return NextResponse.json({
      success: true,
      url: pageData.finalUrl,
      domain: pageData.domain,
      httpStatus: pageData.httpStatus,
      responseTimeMs: pageData.responseTimeMs,
      isHttps: pageData.isHttps,
      securityHeaders: sec,
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
