import * as cheerio from "cheerio";
import { validateUrlForSsrf, SsrfSecurityError } from "@/lib/security/ssrf";

export interface HeaderEvaluation {
  key: string;
  name: string;
  value: string | null;
  status: "secure" | "warning" | "missing";
  scoreImpact: number;
  description: string;
  recommendation?: string;
  attackMitigation: string;
  directives?: Record<string, string | boolean>;
}

export interface SecurityHeadersReport {
  hsts: boolean;
  csp: boolean;
  xFrameOptions: string | null;
  xContentTypeOptions: boolean;
  referrerPolicy: string | null;
  permissionsPolicy: boolean;
  securityScore?: number;
  grade?: "A+" | "A" | "B" | "C" | "F";
  passedCount?: number;
  warningCount?: number;
  missingCount?: number;
  evaluations?: HeaderEvaluation[];
  rawHeaders?: Record<string, string>;
  serverHeader?: string | null;
  xPoweredBy?: string | null;
  coop?: string | null;
  coep?: string | null;
  corp?: string | null;
}

export interface HeadingNode {
  tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  level: number;
  text: string;
  charCount: number;
  order: number;
  isSkipped?: boolean;
  isEmpty?: boolean;
  isOverLength?: boolean;
}

export interface HeadingIssue {
  type: "missing_h1" | "multiple_h1" | "skipped_level" | "empty_heading" | "long_heading";
  severity: "error" | "warning" | "info";
  message: string;
  tag?: string;
  text?: string;
  order?: number;
}

export interface HeadingsAnalysis {
  h1Count: number;
  h1Items: string[];
  h2Count: number;
  h2Samples: string[];
  h3Count: number;
  h4Count: number;
  h5Count: number;
  h6Count: number;
  totalHeadings: number;
  items?: HeadingNode[];
  issues?: HeadingIssue[];
  hierarchyScore?: number;
  skippedLevelsCount?: number;
  emptyHeadingsCount?: number;
  maxDepth?: number;
}

export interface ImagesAnalysis {
  totalImages: number;
  withAlt: number;
  missingAlt: number;
  missingAltSamples: string[];
}

export interface LinksAnalysis {
  totalLinks: number;
  internalLinks: number;
  externalLinks: number;
  nofollowLinks: number;
}

export interface StructuredDataReport {
  detected: boolean;
  count: number;
  types: string[];
  raw?: string;
  items?: any[];
}

export interface ScrapedPageData {
  requestedUrl: string;
  finalUrl: string;
  domain: string;
  httpStatus: number;
  responseTimeMs: number;
  isHttps: boolean;
  contentType: string;
  contentLengthBytes: number;
  serverHeader: string | null;
  xPoweredBy: string | null;
  rawHtml: string;
  headers: Record<string, string>;

  // Metadata
  title: string | null;
  titleLength: number;
  metaDescription: string | null;
  metaDescriptionLength: number;
  canonicalUrl: string | null;
  robotsMeta: string | null;
  language: string | null;
  charset: string | null;
  viewport: string | null;
  favicon: string | null;

  // Open Graph & Social
  openGraph: {
    title: string | null;
    description: string | null;
    image: string | null;
    url: string | null;
    type: string | null;
  };
  twitterCard: {
    card: string | null;
    title: string | null;
    description: string | null;
    image: string | null;
  };

  // Content & Headings
  headings: HeadingsAnalysis;
  images: ImagesAnalysis;
  links: LinksAnalysis;
  structuredData: StructuredDataReport;
  wordCount: number;

  // Infrastructure files
  hasRobotsTxt: boolean;
  hasSitemapXml: boolean;
  securityHeaders: SecurityHeadersReport;
  clientSideSpa?: {
    isSpa: boolean;
    reason?: string;
  };
}

/**
 * Safely fetches and parses public website HTML & metadata.
 */
export async function scrapeWebsite(targetUrl: string): Promise<ScrapedPageData> {
  const startTime = Date.now();
  let currentUrl = targetUrl;
  let response: Response | null = null;
  let redirectCount = 0;
  const maxRedirects = 5;

  // Execute safe HTTP fetch with manual redirect loop to prevent SSRF bypass via 301/302/307 redirects
  while (redirectCount <= maxRedirects) {
    // Step 1: SSRF Validation on each hop BEFORE initiating HTTP socket
    const { sanitizedUrl } = await validateUrlForSsrf(currentUrl);
    currentUrl = sanitizedUrl;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    try {
      response = await fetch(currentUrl, {
        signal: controller.signal,
        redirect: "manual", // Never blindly auto-follow redirects into private/internal IPs
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 SeoSeiteBot/1.0",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Cache-Control": "no-cache",
        },
      });
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if ((err as Error)?.name === "AbortError") {
        throw new Error(`The website at ${currentUrl} timed out after 8 seconds.`);
      }
      throw new Error(
        `Could not establish connection to ${currentUrl}: ${(err as Error)?.message || "Network error"}`
      );
    } finally {
      clearTimeout(timeoutId);
    }

    // Inspect HTTP redirect status codes (301, 302, 303, 307, 308)
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) {
        // Redirect without Location header; use response as-is
        break;
      }
      redirectCount++;
      if (redirectCount > maxRedirects) {
        throw new Error(`Exceeded maximum redirect limit (${maxRedirects}) for ${targetUrl}`);
      }
      // Resolve relative or protocol-relative redirect URLs against current URL
      currentUrl = new URL(location, currentUrl).toString();
      continue;
    }

    // Terminal non-redirect status received (200, 404, etc.)
    break;
  }

  if (!response) {
    throw new Error(`Failed to retrieve response for ${targetUrl}`);
  }

  const responseTimeMs = Date.now() - startTime;
  const finalUrl = currentUrl;

  const finalParsedUrl = new URL(finalUrl);
  const isHttps = finalParsedUrl.protocol === "https:";
  const domain = finalParsedUrl.hostname;
  const contentType = response.headers.get("content-type") || "unknown";

  // Read response text with size limit (max 5 MB)
  const rawHtml = await response.text();
  const contentLengthBytes = Buffer.byteLength(rawHtml, "utf8");

  const headersRecord: Record<string, string> = {};
  response.headers.forEach((val, key) => {
    headersRecord[key.toLowerCase()] = val;
  });

  // Parse HTML with Cheerio
  const $ = cheerio.load(rawHtml);

  // 1. Metadata
  const title = $("title").first().text().trim() || null;
  const metaDescription =
    $('meta[name="description" i]').attr("content")?.trim() ||
    $('meta[property="og:description" i]').attr("content")?.trim() ||
    null;
  const canonicalUrl = $('link[rel="canonical" i]').attr("href")?.trim() || null;
  const robotsMeta = $('meta[name="robots" i]').attr("content")?.trim() || null;
  const language = $("html").attr("lang")?.trim() || null;
  const charset =
    $('meta[charset]').attr("charset") ||
    $('meta[http-equiv="Content-Type" i]').attr("content") ||
    null;
  const viewport = $('meta[name="viewport" i]').attr("content")?.trim() || null;

  let favicon =
    $('link[rel="icon" i]').attr("href") ||
    $('link[rel="shortcut icon" i]').attr("href") ||
    null;
  if (favicon && !favicon.startsWith("http") && !favicon.startsWith("//")) {
    try {
      favicon = new URL(favicon, finalUrl).toString();
    } catch {
      favicon = null;
    }
  }

  // 2. OpenGraph
  const openGraph = {
    title: $('meta[property="og:title" i]').attr("content")?.trim() || null,
    description: $('meta[property="og:description" i]').attr("content")?.trim() || null,
    image: $('meta[property="og:image" i]').attr("content")?.trim() || null,
    url: $('meta[property="og:url" i]').attr("content")?.trim() || null,
    type: $('meta[property="og:type" i]').attr("content")?.trim() || null,
  };

  // 3. Twitter Card
  const twitterCard = {
    card: $('meta[name="twitter:card" i]').attr("content")?.trim() || null,
    title: $('meta[name="twitter:title" i]').attr("content")?.trim() || null,
    description: $('meta[name="twitter:description" i]').attr("content")?.trim() || null,
    image: $('meta[name="twitter:image" i]').attr("content")?.trim() || null,
  };

  // 4. Headings & DOM Hierarchy Extraction
  const h1Elements: string[] = [];
  const h2Samples: string[] = [];
  const headingItems: HeadingNode[] = [];
  const headingIssues: HeadingIssue[] = [];

  let prevLevel = 0;
  let skippedLevelsCount = 0;
  let emptyHeadingsCount = 0;
  let maxDepth = 0;

  $("h1, h2, h3, h4, h5, h6").each((idx, el) => {
    const rawTag = (el.tagName || "").toLowerCase();
    const tagName = (["h1", "h2", "h3", "h4", "h5", "h6"].includes(rawTag) ? rawTag : "h2") as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    const level = parseInt(tagName.replace("h", ""), 10);
    if (level > maxDepth) maxDepth = level;

    const rawText = $(el).text();
    const text = rawText.replace(/\s+/g, " ").trim();
    const charCount = text.length;
    const isEmpty = charCount === 0;
    const isOverLength = charCount > 70;

    // A skipped level occurs when jumping deeper down hierarchy by more than 1 level (e.g. H1 -> H3 or H2 -> H4)
    const isSkipped = prevLevel > 0 && level > prevLevel + 1;

    if (tagName === "h1" && text) {
      h1Elements.push(text);
    } else if (tagName === "h2" && text && h2Samples.length < 6) {
      h2Samples.push(text);
    }

    if (isEmpty) {
      emptyHeadingsCount++;
      headingIssues.push({
        type: "empty_heading",
        severity: "warning",
        message: `Empty <${tagName.toUpperCase()}> tag found with no text content.`,
        tag: tagName,
        order: idx + 1,
      });
    }

    if (isOverLength) {
      headingIssues.push({
        type: "long_heading",
        severity: "info",
        message: `<${tagName.toUpperCase()}> is ${charCount} chars long (recommended: < 70 chars for optimal snippet extraction).`,
        tag: tagName,
        text,
        order: idx + 1,
      });
    }

    if (isSkipped) {
      skippedLevelsCount++;
      headingIssues.push({
        type: "skipped_level",
        severity: "warning",
        message: `Skipped heading level: jumped from <H${prevLevel}> directly to <H${level}> without intermediate <H${prevLevel + 1}>.`,
        tag: tagName,
        text,
        order: idx + 1,
      });
    }

    headingItems.push({
      tag: tagName,
      level,
      text: isEmpty ? "(Empty Heading Tag)" : text,
      charCount,
      order: idx + 1,
      isSkipped,
      isEmpty,
      isOverLength,
    });

    prevLevel = level;
  });

  const h2Count = $("h2").length;
  const h3Count = $("h3").length;
  const h4Count = $("h4").length;
  const h5Count = $("h5").length;
  const h6Count = $("h6").length;

  if (h1Elements.length === 0) {
    headingIssues.unshift({
      type: "missing_h1",
      severity: "error",
      message: "Missing <H1> heading tag. Every crawlable page must have exactly one root H1 tag to establish main subject authority.",
      tag: "h1",
    });
  } else if (h1Elements.length > 1) {
    headingIssues.unshift({
      type: "multiple_h1",
      severity: "warning",
      message: `Multiple (${h1Elements.length}) <H1> tags detected. Search engines recommend a single H1 to establish primary topic focus.`,
      tag: "h1",
    });
  }

  // Calculate deterministic hierarchy score (0-100)
  let calcScore = 100;
  if (h1Elements.length === 0) calcScore -= 30;
  else if (h1Elements.length > 1) calcScore -= (h1Elements.length - 1) * 10;
  if (h2Count === 0) calcScore -= 20;
  calcScore -= Math.min(30, skippedLevelsCount * 8);
  calcScore -= Math.min(20, emptyHeadingsCount * 10);
  const hierarchyScore = Math.max(15, Math.min(100, calcScore));

  const headings: HeadingsAnalysis = {
    h1Count: h1Elements.length,
    h1Items: h1Elements,
    h2Count,
    h2Samples,
    h3Count,
    h4Count,
    h5Count,
    h6Count,
    totalHeadings: h1Elements.length + h2Count + h3Count + h4Count + h5Count + h6Count,
    items: headingItems,
    issues: headingIssues,
    hierarchyScore,
    skippedLevelsCount,
    emptyHeadingsCount,
    maxDepth,
  };

  // 5. Images & Alt Attributes
  const allImages = $("img");
  let imagesWithAlt = 0;
  const missingAltSamples: string[] = [];

  allImages.each((_, el) => {
    const alt = $(el).attr("alt");
    const src = $(el).attr("src") || "";
    if (alt !== undefined && alt.trim() !== "") {
      imagesWithAlt++;
    } else {
      if (src && missingAltSamples.length < 5) {
        missingAltSamples.push(src);
      }
    }
  });

  const images: ImagesAnalysis = {
    totalImages: allImages.length,
    withAlt: imagesWithAlt,
    missingAlt: Math.max(0, allImages.length - imagesWithAlt),
    missingAltSamples,
  };

  // 6. Links Analysis
  let internalLinks = 0;
  let externalLinks = 0;
  let nofollowLinks = 0;
  const totalLinks = $("a[href]").length;

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href")?.trim() || "";
    const rel = $(el).attr("rel") || "";
    if (rel.toLowerCase().includes("nofollow")) {
      nofollowLinks++;
    }

    if (
      href.startsWith("/") ||
      href.startsWith("#") ||
      href.startsWith("./") ||
      href.includes(domain)
    ) {
      internalLinks++;
    } else if (href.startsWith("http://") || href.startsWith("https://")) {
      externalLinks++;
    }
  });

  const links: LinksAnalysis = {
    totalLinks,
    internalLinks,
    externalLinks,
    nofollowLinks,
  };

  // 7. Structured Data (JSON-LD)
  const schemaTypes: string[] = [];
  const rawSchemas: any[] = [];
  let firstRawScript = "";
  $('script[type="application/ld+json"]').each((_, el) => {
    const scriptContent = ($(el).html() || "").trim();
    if (scriptContent && !firstRawScript) {
      firstRawScript = scriptContent;
    }
    try {
      const parsed = JSON.parse(scriptContent || "{}");
      rawSchemas.push(parsed);
      if (Array.isArray(parsed)) {
        parsed.forEach((item) => {
          if (item["@type"]) schemaTypes.push(String(item["@type"]));
        });
      } else if (parsed["@type"]) {
        schemaTypes.push(String(parsed["@type"]));
      } else if (parsed["@graph"] && Array.isArray(parsed["@graph"])) {
        parsed["@graph"].forEach((item: Record<string, unknown>) => {
          if (item["@type"]) schemaTypes.push(String(item["@type"]));
        });
      }
    } catch {
      // invalid JSON-LD script, ignore
    }
  });

  const structuredData: StructuredDataReport = {
    detected: schemaTypes.length > 0,
    count: schemaTypes.length,
    types: Array.from(new Set(schemaTypes)),
    raw: firstRawScript || (rawSchemas.length > 0 ? JSON.stringify(rawSchemas.length === 1 ? rawSchemas[0] : { "@context": "https://schema.org", "@graph": rawSchemas }, null, 2) : undefined),
    items: rawSchemas,
  };

  // 8. Word Count estimate
  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = bodyText ? bodyText.split(" ").length : 0;

  // 9. Security Headers & Defense Matrix
  const hstsRaw = response.headers.get("strict-transport-security");
  const cspRaw = response.headers.get("content-security-policy");
  const xfoRaw = response.headers.get("x-frame-options");
  const xctoRaw = response.headers.get("x-content-type-options");
  const rpRaw = response.headers.get("referrer-policy");
  const ppRaw = response.headers.get("permissions-policy") || response.headers.get("feature-policy");
  const coopRaw = response.headers.get("cross-origin-opener-policy");
  const coepRaw = response.headers.get("cross-origin-embedder-policy");
  const corpRaw = response.headers.get("cross-origin-resource-policy");
  const serverRaw = response.headers.get("server");
  const xpbRaw = response.headers.get("x-powered-by");

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

  const passedCount = evaluations.filter((e) => e.status === "secure").length;
  const warningCount = evaluations.filter((e) => e.status === "warning").length;
  const missingCount = evaluations.filter((e) => e.status === "missing").length;

  const securityHeaders: SecurityHeadersReport = {
    hsts,
    csp,
    xFrameOptions,
    xContentTypeOptions,
    referrerPolicy,
    permissionsPolicy,
    securityScore,
    grade,
    passedCount,
    warningCount,
    missingCount,
    evaluations,
    rawHeaders: headersRecord,
    serverHeader: serverRaw,
    xPoweredBy: xpbRaw,
    coop: coopRaw,
    coep: coepRaw,
    corp: corpRaw,
  };

  // 10. Check robots.txt and sitemap.xml asynchronously (non-blocking)
  let hasRobotsTxt = false;
  let hasSitemapXml = false;

  try {
    const origin = finalParsedUrl.origin;
    const [robotsRes, sitemapRes] = await Promise.allSettled([
      fetch(`${origin}/robots.txt`, { method: "HEAD", signal: AbortSignal.timeout(2500), redirect: "manual" }),
      fetch(`${origin}/sitemap.xml`, { method: "HEAD", signal: AbortSignal.timeout(2500), redirect: "manual" }),
    ]);

    if (robotsRes.status === "fulfilled" && robotsRes.value.status === 200) {
      hasRobotsTxt = true;
    }
    if (sitemapRes.status === "fulfilled" && sitemapRes.value.status === 200) {
      hasSitemapXml = true;
    }
  } catch {
    // optional checks, fail silently
  }

  // 11. Client-Side SPA Detection (CSR without Server-Side Rendering)
  const isRootEmpty = $("#root:empty, #app:empty").length > 0;
  const hasSpaScripts =
    rawHtml.includes("react-dom") ||
    rawHtml.includes("/static/js/main.") ||
    rawHtml.includes("createRoot") ||
    rawHtml.includes("vite/client") ||
    rawHtml.includes("ng-version");
  const isClientSideSpa = (wordCount < 40 && hasSpaScripts) || isRootEmpty;
  const clientSideSpa = isClientSideSpa
    ? {
        isSpa: true,
        reason:
          "DOM contains minimal server-rendered HTML but loads heavy JavaScript hydration bundles. Crawlers without full Chromium rendering may perceive an empty page.",
      }
    : { isSpa: false };

  return {
    requestedUrl: targetUrl,
    finalUrl,
    domain,
    httpStatus: response.status,
    responseTimeMs,
    isHttps,
    contentType,
    contentLengthBytes,
    serverHeader: response.headers.get("server"),
    xPoweredBy: response.headers.get("x-powered-by"),
    rawHtml,
    headers: headersRecord,

    title,
    titleLength: title ? title.length : 0,
    metaDescription,
    metaDescriptionLength: metaDescription ? metaDescription.length : 0,
    canonicalUrl,
    robotsMeta,
    language,
    charset,
    viewport,
    favicon,

    openGraph,
    twitterCard,
    headings,
    images,
    links,
    structuredData,
    wordCount,

    hasRobotsTxt,
    hasSitemapXml,
    securityHeaders,
    clientSideSpa,
  };
}
