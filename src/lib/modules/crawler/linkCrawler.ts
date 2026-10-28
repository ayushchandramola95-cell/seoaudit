/**
 * Recursive Link Health & Broken Link (404) Crawler Engine v2
 * Audits discovered links for HTTP status, redirect hops, anchor text quality, and crawl latency.
 */
import { validateUrlForSsrf } from "@/lib/security/ssrf";

export interface LinkAuditItem {
  url: string;
  originalHref: string;
  anchorText: string;
  isInternal: boolean;
  statusCode: number;
  statusText: string;
  timingMs: number;
  health: "healthy" | "redirect" | "broken" | "timeout";
  redirectUrl?: string;
  isHttps: boolean;
  isAnchorEmpty: boolean;
  isGenericAnchor: boolean;
}

export interface LinkCrawlerReport {
  summary: {
    totalChecked: number;
    healthyCount: number;
    redirectCount: number;
    brokenCount: number;
    timeoutCount: number;
    linkHealthScore: number;
    internalCount: number;
    externalCount: number;
    insecureHttpCount: number;
    emptyAnchorCount: number;
    genericAnchorCount: number;
    avgLatencyMs: number;
  };
  items: LinkAuditItem[];
}

export async function auditLinksHealth(
  baseUrl: string,
  rawLinks: Array<{ href: string; text?: string; isInternal?: boolean }>,
  maxLinksToCheck = 25
): Promise<LinkCrawlerReport> {
  let baseHostname = "";
  try {
    baseHostname = new URL(baseUrl).hostname.toLowerCase();
  } catch {
    baseHostname = "";
  }

  // Deduplicate and normalize
  const validLinks: Array<{ url: string; originalHref: string; anchorText: string; isInternal: boolean }> = [];
  const seenUrls = new Set<string>();

  for (const item of rawLinks) {
    if (!item.href || typeof item.href !== "string") continue;
    const trimmed = item.href.trim();
    if (
      trimmed.startsWith("#") ||
      trimmed.startsWith("javascript:") ||
      trimmed.startsWith("mailto:") ||
      trimmed.startsWith("tel:")
    ) {
      continue;
    }

    try {
      const resolved = new URL(trimmed, baseUrl);
      if (!["http:", "https:"].includes(resolved.protocol)) continue;

      const normUrl = resolved.href;
      if (seenUrls.has(normUrl)) continue;
      seenUrls.add(normUrl);

      const isInternal = resolved.hostname.toLowerCase() === baseHostname;
      validLinks.push({
        url: normUrl,
        originalHref: trimmed,
        anchorText: (item.text || "").trim().slice(0, 100) || "(No anchor text)",
        isInternal,
      });

      if (validLinks.length >= maxLinksToCheck) break;
    } catch {
      // ignore invalid URLs
    }
  }

  // Check link health with concurrency limit
  const items: LinkAuditItem[] = [];

  const checkPromises = validLinks.map(async (link) => {
    const startTime = Date.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    try {
      // Enforce Zero-Trust SSRF validation before dispatching outbound link check
      await validateUrlForSsrf(link.url);

      // First try HEAD request for efficiency
      let res = await fetch(link.url, {
        method: "HEAD",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SeoSeite-LinkCrawler/2.0",
        },
        signal: controller.signal,
        redirect: "manual",
      });

      // If HEAD is rejected with 405 Method Not Allowed, fallback to GET
      if (res.status === 405) {
        res = await fetch(link.url, {
          method: "GET",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) SeoSeite-LinkCrawler/2.0",
          },
          signal: controller.signal,
          redirect: "manual",
        });
      }

      clearTimeout(timeout);
      const timingMs = Date.now() - startTime;
      const code = res.status;

      let health: "healthy" | "redirect" | "broken" | "timeout" = "healthy";
      if (code >= 200 && code < 300) {
        health = "healthy";
      } else if (code >= 300 && code < 400) {
        health = "redirect";
      } else if (code === 404 || code >= 400) {
        health = "broken";
      }

      const rawLocation = res.headers.get("location");
      let resolvedRedirectUrl: string | undefined = undefined;
      if (rawLocation) {
        try {
          resolvedRedirectUrl = new URL(rawLocation, link.url).href;
        } catch {
          resolvedRedirectUrl = rawLocation;
        }
      }

      const isHttps = link.url.startsWith("https://");
      const cleanAnchor = (link.anchorText || "").trim();
      const isAnchorEmpty = !cleanAnchor || cleanAnchor.toLowerCase() === "(no anchor text)";
      const isGenericAnchor = ["click here", "read more", "here", "learn more", "link", "more", "details", "website"].includes(cleanAnchor.toLowerCase());

      items.push({
        url: link.url,
        originalHref: link.originalHref,
        anchorText: cleanAnchor || "(No anchor text)",
        isInternal: link.isInternal,
        statusCode: code,
        statusText: res.statusText || `${code}`,
        timingMs,
        health,
        redirectUrl: resolvedRedirectUrl,
        isHttps,
        isAnchorEmpty,
        isGenericAnchor,
      });
    } catch (err: unknown) {
      clearTimeout(timeout);
      const isTimeout = (err as Error)?.name === "AbortError";
      const isHttps = link.url.startsWith("https://");
      const cleanAnchor = (link.anchorText || "").trim();
      const isAnchorEmpty = !cleanAnchor || cleanAnchor.toLowerCase() === "(no anchor text)";
      const isGenericAnchor = ["click here", "read more", "here", "learn more", "link", "more", "details", "website"].includes(cleanAnchor.toLowerCase());

      items.push({
        url: link.url,
        originalHref: link.originalHref,
        anchorText: cleanAnchor || "(No anchor text)",
        isInternal: link.isInternal,
        statusCode: isTimeout ? 408 : 0,
        statusText: isTimeout ? "Request Timeout" : "Connection Refused / Failed",
        timingMs: Date.now() - startTime,
        health: isTimeout ? "timeout" : "broken",
        isHttps,
        isAnchorEmpty,
        isGenericAnchor,
      });
    }
  });

  await Promise.all(checkPromises);

  // Compute summary aggregates
  const totalChecked = items.length;
  const healthyCount = items.filter((i) => i.health === "healthy").length;
  const redirectCount = items.filter((i) => i.health === "redirect").length;
  const brokenCount = items.filter((i) => i.health === "broken").length;
  const timeoutCount = items.filter((i) => i.health === "timeout").length;
  const internalCount = items.filter((i) => i.isInternal).length;
  const externalCount = items.filter((i) => !i.isInternal).length;

  const insecureHttpCount = items.filter((i) => !i.isHttps).length;
  const emptyAnchorCount = items.filter((i) => i.isAnchorEmpty).length;
  const genericAnchorCount = items.filter((i) => i.isGenericAnchor).length;
  const avgLatencyMs = totalChecked > 0 ? Math.round(items.reduce((acc, i) => acc + i.timingMs, 0) / totalChecked) : 0;

  const linkHealthScore =
    totalChecked > 0 ? Math.round(((healthyCount + redirectCount * 0.8) / totalChecked) * 100) : 100;

  return {
    summary: {
      totalChecked,
      healthyCount,
      redirectCount,
      brokenCount,
      timeoutCount,
      linkHealthScore,
      internalCount,
      externalCount,
      insecureHttpCount,
      emptyAnchorCount,
      genericAnchorCount,
      avgLatencyMs,
    },
    items,
  };
}
