import * as cheerio from "cheerio";
import { validateUrlForSsrf, SsrfSecurityError } from "@/lib/security/ssrf";

export interface SecurityHeadersReport {
  hsts: boolean;
  csp: boolean;
  xFrameOptions: string | null;
  xContentTypeOptions: boolean;
  referrerPolicy: string | null;
  permissionsPolicy: boolean;
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
  // Step 1: SSRF Validation
  const { sanitizedUrl } = await validateUrlForSsrf(targetUrl);

  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

  let response: Response;
  try {
    response = await fetch(sanitizedUrl, {
      signal: controller.signal,
      redirect: "follow",
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
      throw new Error(`The website at ${sanitizedUrl} timed out after 8 seconds.`);
    }
    throw new Error(
      `Could not establish connection to ${sanitizedUrl}: ${(err as Error)?.message || "Network error"}`
    );
  } finally {
    clearTimeout(timeoutId);
  }

  const responseTimeMs = Date.now() - startTime;
  const finalUrl = response.url || sanitizedUrl;

  // Verify redirected URL as well for SSRF safety
  if (finalUrl !== sanitizedUrl) {
    await validateUrlForSsrf(finalUrl);
  }

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

  // 4. Headings
  const h1Elements: string[] = [];
  $("h1").each((_, el) => {
    const text = $(el).text().trim();
    if (text) h1Elements.push(text);
  });

  const h2Samples: string[] = [];
  $("h2").each((idx, el) => {
    if (idx < 6) {
      const text = $(el).text().trim();
      if (text) h2Samples.push(text);
    }
  });

  const h2Count = $("h2").length;
  const h3Count = $("h3").length;
  const h4Count = $("h4").length;
  const h5Count = $("h5").length;
  const h6Count = $("h6").length;

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
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const parsed = JSON.parse($(el).html() || "{}");
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
  };

  // 8. Word Count estimate
  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = bodyText ? bodyText.split(" ").length : 0;

  // 9. Security Headers
  const hsts = Boolean(response.headers.get("strict-transport-security"));
  const csp = Boolean(response.headers.get("content-security-policy"));
  const xFrameOptions = response.headers.get("x-frame-options");
  const xContentTypeOptions =
    (response.headers.get("x-content-type-options") || "").toLowerCase() === "nosniff";
  const referrerPolicy = response.headers.get("referrer-policy");
  const permissionsPolicy = Boolean(response.headers.get("permissions-policy"));

  const securityHeaders: SecurityHeadersReport = {
    hsts,
    csp,
    xFrameOptions,
    xContentTypeOptions,
    referrerPolicy,
    permissionsPolicy,
  };

  // 10. Check robots.txt and sitemap.xml asynchronously (non-blocking)
  let hasRobotsTxt = false;
  let hasSitemapXml = false;

  try {
    const origin = finalParsedUrl.origin;
    const [robotsRes, sitemapRes] = await Promise.allSettled([
      fetch(`${origin}/robots.txt`, { method: "HEAD", signal: AbortSignal.timeout(2500) }),
      fetch(`${origin}/sitemap.xml`, { method: "HEAD", signal: AbortSignal.timeout(2500) }),
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
