import * as cheerio from "cheerio";

export interface DiscoveredLink {
  href: string;
  anchorText: string;
  isInternal: boolean;
  targetDomain?: string;
  isNofollow: boolean;
  isSponsored: boolean;
  isUgc: boolean;
  isEmptyAnchor: boolean;
}

export interface LinkDiscoveryReport {
  totalLinks: number;
  internalLinksCount: number;
  externalLinksCount: number;
  nofollowCount: number;
  sponsoredCount: number;
  emptyAnchorCount: number;
  uniqueExternalDomains: string[];
  internalLinksSample: Array<{ href: string; anchorText: string }>;
  externalLinksSample: Array<{ href: string; targetDomain: string; anchorText: string; nofollow: boolean }>;
  linkEquityRatio: {
    internalPercent: number;
    externalPercent: number;
  };
  warnings: string[];
}

/**
 * Extracts and classifies all hyperlinks discovered on the page.
 */
export function extractLinkAnalysis(
  rawHtml: string,
  baseDomain: string,
  pageUrl: string
): LinkDiscoveryReport {
  if (!rawHtml || rawHtml.trim() === "") {
    return {
      totalLinks: 0,
      internalLinksCount: 0,
      externalLinksCount: 0,
      nofollowCount: 0,
      sponsoredCount: 0,
      emptyAnchorCount: 0,
      uniqueExternalDomains: [],
      internalLinksSample: [],
      externalLinksSample: [],
      linkEquityRatio: { internalPercent: 0, externalPercent: 0 },
      warnings: ["No indexable HTML discovered to extract links from."],
    };
  }

  const $ = cheerio.load(rawHtml);
  const cleanBaseDomain = baseDomain.replace(/^(https?:\/\/)?(www\.)?/, "").toLowerCase();

  const internalLinks: Array<{ href: string; anchorText: string }> = [];
  const externalLinks: Array<{ href: string; targetDomain: string; anchorText: string; nofollow: boolean }> = [];
  const externalDomainsSet = new Set<string>();

  let nofollowCount = 0;
  let sponsoredCount = 0;
  let emptyAnchorCount = 0;

  $("a[href]").each((_, el) => {
    const rawHref = $(el).attr("href")?.trim();
    if (!rawHref) return;

    // Ignore mailto, tel, javascript, pure fragments
    if (rawHref.startsWith("mailto:") || rawHref.startsWith("tel:") || rawHref.startsWith("javascript:")) {
      return;
    }

    const anchorText = $(el).text().replace(/\s+/g, " ").trim();
    if (!anchorText && !$(el).find("img").length) {
      emptyAnchorCount++;
    }

    const relAttr = ($(el).attr("rel") || "").toLowerCase();
    const isNofollow = relAttr.includes("nofollow");
    const isSponsored = relAttr.includes("sponsored");
    const isUgc = relAttr.includes("ugc");

    if (isNofollow) nofollowCount++;
    if (isSponsored) sponsoredCount++;

    // Classify Internal vs External
    let isInternal = false;
    let targetDomain = cleanBaseDomain;

    if (rawHref.startsWith("/") || rawHref.startsWith("./") || rawHref.startsWith("../") || rawHref.startsWith("#")) {
      isInternal = true;
    } else {
      try {
        const parsed = new URL(rawHref, pageUrl);
        const parsedHost = parsed.hostname.replace(/^(www\.)?/, "").toLowerCase();
        if (parsedHost === cleanBaseDomain || parsedHost.endsWith(`.${cleanBaseDomain}`)) {
          isInternal = true;
        } else {
          isInternal = false;
          targetDomain = parsedHost;
        }
      } catch {
        // Relative or unparseable treated as internal
        isInternal = true;
      }
    }

    if (isInternal) {
      if (internalLinks.length < 30) {
        internalLinks.push({
          href: rawHref,
          anchorText: anchorText || "(No Anchor Text)",
        });
      }
    } else {
      externalDomainsSet.add(targetDomain);
      if (externalLinks.length < 30) {
        externalLinks.push({
          href: rawHref,
          targetDomain,
          anchorText: anchorText || "(No Anchor Text)",
          nofollow: isNofollow,
        });
      }
    }
  });

  const totalDiscovered = internalLinks.length + externalLinks.length;
  const internalRatio = totalDiscovered > 0 ? (internalLinks.length / totalDiscovered) * 100 : 0;
  const externalRatio = totalDiscovered > 0 ? (externalLinks.length / totalDiscovered) * 100 : 0;

  const warnings: string[] = [];
  if (totalDiscovered > 250) {
    warnings.push(
      `High outbound link count (${totalDiscovered} links). Search engines may dilute PageRank distribution across pages with over 200 outbound links.`
    );
  }
  if (emptyAnchorCount > 5) {
    warnings.push(
      `${emptyAnchorCount} links missing descriptive anchor text. Screen readers and search engine spiders rely on meaningful anchor copy for link context.`
    );
  }
  if (externalLinks.length > 0 && nofollowCount === 0 && externalLinks.length > 20) {
    warnings.push(
      `All ${externalLinks.length} external outbound links pass PageRank (dofollow). Consider applying rel="nofollow" to sponsored, affiliate, or unvetted external sites.`
    );
  }

  return {
    totalLinks: totalDiscovered,
    internalLinksCount: internalLinks.length,
    externalLinksCount: externalLinks.length,
    nofollowCount,
    sponsoredCount,
    emptyAnchorCount,
    uniqueExternalDomains: Array.from(externalDomainsSet),
    internalLinksSample: internalLinks.slice(0, 30),
    externalLinksSample: externalLinks.slice(0, 30),
    linkEquityRatio: {
      internalPercent: Math.round(internalRatio),
      externalPercent: Math.round(externalRatio),
    },
    warnings,
  };
}
