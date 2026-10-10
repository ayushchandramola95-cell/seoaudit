import * as cheerio from "cheerio";

export interface BotPermission {
  botName: string;
  category: "ai" | "search";
  status: "allowed" | "blocked" | "default_allowed";
  description: string;
}

export interface SitemapAnalysis {
  detected: boolean;
  url: string;
  urlCount: number;
  sampleUrls: string[];
  hasLastMod: boolean;
  isSitemapIndex: boolean;
  errors: string[];
}

export interface GeoReadinessReport {
  score: number; // 0 - 100
  grade: "A" | "B" | "C" | "D" | "F";
  aiBotAccessibilityScore: number; // max 35
  schemaRichnessScore: number; // max 25
  headingClarityScore: number; // max 20
  contentDepthScore: number; // max 20
  strengths: string[];
  recommendations: string[];
  botPermissions: BotPermission[];
}

export interface DeepRobotsSitemapReport {
  hasRobotsTxt: boolean;
  robotsUrl: string;
  rawRobotsSnippet: string;
  sitemapsInRobots: string[];
  disallowedPaths: string[];
  crawlDelay?: number;
  sitemap: SitemapAnalysis;
  geo: GeoReadinessReport;
  warnings: string[];
}

const AI_BOTS = [
  { bot: "GPTBot", desc: "OpenAI ChatGPT web crawler & dataset collector" },
  { bot: "ChatGPT-User", desc: "OpenAI live ChatGPT Search browsing agent" },
  { bot: "ClaudeBot", desc: "Anthropic Claude training & research crawler" },
  { bot: "PerplexityBot", desc: "Perplexity AI real-time search engine crawler" },
  { bot: "Google-Extended", desc: "Google Gemini training & multimodal crawler" },
  { bot: "Bytespider", desc: "ByteDance / TikTok LLM & search scraper" },
  { bot: "Applebot-Extended", desc: "Apple Intelligence training scraper" },
];

const SEARCH_BOTS = [
  { bot: "Googlebot", desc: "Primary Google Search indexing crawler" },
  { bot: "Bingbot", desc: "Microsoft Bing and Copilot search crawler" },
];

/**
 * Deeply inspects and parses /robots.txt and /sitemap.xml and computes GEO AI readiness.
 */
export async function analyzeRobotsAndSitemap(
  origin: string,
  structuredDataCount: number,
  h1Count: number,
  h2Count: number,
  wordCount: number
): Promise<DeepRobotsSitemapReport> {
  const robotsUrl = `${origin}/robots.txt`;
  let sitemapUrl = `${origin}/sitemap.xml`;

  let hasRobotsTxt = false;
  let rawRobotsText = "";
  const sitemapsInRobots: string[] = [];
  const disallowedPaths: string[] = [];
  let crawlDelay: number | undefined;

  // 1. Fetch robots.txt
  try {
    const res = await fetch(robotsUrl, {
      signal: AbortSignal.timeout(3500),
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SeoSeiteBot/1.0; +https://seoseite.com)",
      },
    });

    if (res.ok) {
      hasRobotsTxt = true;
      rawRobotsText = await res.text();
      // Cap at 64KB
      if (rawRobotsText.length > 65536) {
        rawRobotsText = rawRobotsText.substring(0, 65536);
      }
    }
  } catch {
    hasRobotsTxt = false;
  }

  // Parse robots.txt lines
  const botPermissionsMap = new Map<string, "allowed" | "blocked" | "default_allowed">();
  let currentAgents: string[] = [];

  if (hasRobotsTxt && rawRobotsText) {
    const lines = rawRobotsText.split(/\r?\n/);
    let wildcardBlocksRoot = false;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;

      const [directive, ...rest] = line.split(":");
      const key = directive.trim().toLowerCase();
      const val = rest.join(":").trim();

      if (key === "user-agent") {
        currentAgents = [val.toLowerCase()];
      } else if (key === "sitemap") {
        if (val && !sitemapsInRobots.includes(val)) {
          sitemapsInRobots.push(val);
        }
      } else if (key === "crawl-delay") {
        const num = parseFloat(val);
        if (!isNaN(num)) crawlDelay = num;
      } else if (key === "disallow") {
        if (val) {
          disallowedPaths.push(val);
        }
        for (const agent of currentAgents) {
          if (agent === "*") {
            if (val === "/" || val === "/*") {
              wildcardBlocksRoot = true;
            }
          } else {
            if (val === "/" || val === "/*") {
              botPermissionsMap.set(agent, "blocked");
            } else if (val === "") {
              botPermissionsMap.set(agent, "allowed");
            }
          }
        }
      } else if (key === "allow") {
        for (const agent of currentAgents) {
          if (agent !== "*") {
            botPermissionsMap.set(agent, "allowed");
          }
        }
      }
    }

    // Set defaults if not explicitly blocked
    if (wildcardBlocksRoot) {
      for (const b of [...AI_BOTS, ...SEARCH_BOTS]) {
        const lower = b.bot.toLowerCase();
        if (!botPermissionsMap.has(lower)) {
          botPermissionsMap.set(lower, "blocked");
        }
      }
    }
  }

  // Build Bot Permissions List
  const allBotResults: BotPermission[] = [];
  let aiBlockedCount = 0;

  for (const item of AI_BOTS) {
    const lower = item.bot.toLowerCase();
    const explicit = botPermissionsMap.get(lower);
    const status = explicit || "default_allowed";
    if (status === "blocked") aiBlockedCount++;

    allBotResults.push({
      botName: item.bot,
      category: "ai",
      status,
      description: item.desc,
    });
  }

  for (const item of SEARCH_BOTS) {
    const lower = item.bot.toLowerCase();
    const explicit = botPermissionsMap.get(lower);
    const status = explicit || "default_allowed";

    allBotResults.push({
      botName: item.bot,
      category: "search",
      status,
      description: item.desc,
    });
  }

  // 2. Fetch and Analyze Sitemap
  if (sitemapsInRobots.length > 0) {
    sitemapUrl = sitemapsInRobots[0];
  }

  let sitemapDetected = false;
  let sitemapUrlCount = 0;
  const sampleUrls: string[] = [];
  let hasLastMod = false;
  let isSitemapIndex = false;
  const sitemapErrors: string[] = [];

  try {
    const sitemapRes = await fetch(sitemapUrl, {
      signal: AbortSignal.timeout(3500),
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SeoSeiteBot/1.0; +https://seoseite.com)",
      },
    });

    if (sitemapRes.ok) {
      sitemapDetected = true;
      const xmlText = await sitemapRes.text();

      if (xmlText.includes("<sitemapindex")) {
        isSitemapIndex = true;
      }

      const $xml = cheerio.load(xmlText, { xmlMode: true });
      const locTags = $xml("loc");
      sitemapUrlCount = locTags.length;

      locTags.slice(0, 10).each((_, el) => {
        const u = $xml(el).text().trim();
        if (u) sampleUrls.push(u);
      });

      if ($xml("lastmod").length > 0) {
        hasLastMod = true;
      }
    } else {
      sitemapErrors.push(`Sitemap responded with HTTP status ${sitemapRes.status}`);
    }
  } catch (err: unknown) {
    sitemapErrors.push(`Could not fetch sitemap.xml: ${(err as Error)?.message || "Timeout"}`);
  }

  // 3. Compute GEO (Generative Engine Optimization) Score
  // Max 35 points: AI bot accessibility
  const aiBotAccessibilityScore = Math.max(0, Math.round(35 * ((AI_BOTS.length - aiBlockedCount) / AI_BOTS.length)));

  // Max 25 points: Schema richness
  const schemaRichnessScore = structuredDataCount >= 3 ? 25 : structuredDataCount >= 1 ? 18 : 0;

  // Max 20 points: Heading clarity
  const headingClarityScore = h1Count === 1 && h2Count >= 2 ? 20 : h1Count >= 1 ? 14 : 5;

  // Max 20 points: Content depth
  const contentDepthScore = wordCount >= 800 ? 20 : wordCount >= 300 ? 15 : wordCount >= 100 ? 8 : 2;

  const totalGeoScore = Math.min(100, aiBotAccessibilityScore + schemaRichnessScore + headingClarityScore + contentDepthScore);
  const geoGrade: "A" | "B" | "C" | "D" | "F" =
    totalGeoScore >= 85 ? "A" : totalGeoScore >= 70 ? "B" : totalGeoScore >= 55 ? "C" : totalGeoScore >= 40 ? "D" : "F";

  const geoStrengths: string[] = [];
  const geoRecommendations: string[] = [];

  if (aiBlockedCount === 0) {
    geoStrengths.push("100% of premier AI crawlers (ChatGPT, Claude, Perplexity) are permitted to discover your domain.");
  } else {
    geoRecommendations.push(
      `${aiBlockedCount} AI bot(s) are blocked in robots.txt. Unblocking GPTBot and PerplexityBot will allow AI Search engines to cite your brand.`
    );
  }

  if (structuredDataCount > 0) {
    geoStrengths.push(`${structuredDataCount} JSON-LD Schema.org entities detected, providing explicit factual entities for LLM knowledge graphs.`);
  } else {
    geoRecommendations.push("Add JSON-LD Organization and WebSite schema microdata so AI engines understand your core business entities.");
  }

  if (h1Count === 1 && h2Count >= 2) {
    geoStrengths.push("Clear hierarchical heading structure allows LLMs to extract section-by-section answers cleanly.");
  } else {
    geoRecommendations.push("Structure key answers under descriptive H2 subheadings to increase chances of being cited in Google AI Overviews.");
  }

  if (wordCount >= 500) {
    geoStrengths.push(`Rich topical body copy (${wordCount.toLocaleString()} words) provides sufficient contextual depth for generative citations.`);
  } else {
    geoRecommendations.push("Expand thin content into comprehensive, authoritative editorial copy (>500 words).");
  }

  // Warnings
  const warnings: string[] = [];
  if (!hasRobotsTxt) {
    warnings.push("Missing /robots.txt file. Search engines and AI scrapers will crawl without guidance.");
  }
  if (!sitemapDetected) {
    warnings.push("Missing /sitemap.xml or sitemap responded with error. Sitemaps accelerate discovery of deep content.");
  }
  if (disallowedPaths.length > 15) {
    warnings.push(`Over ${disallowedPaths.length} Disallow directives in robots.txt may accidentally block vital CSS/JS assets or landing pages.`);
  }

  return {
    hasRobotsTxt,
    robotsUrl,
    rawRobotsSnippet: rawRobotsText.length > 500 ? rawRobotsText.substring(0, 500) + "\n... (truncated)" : rawRobotsText,
    sitemapsInRobots,
    disallowedPaths: disallowedPaths.slice(0, 15),
    crawlDelay,
    sitemap: {
      detected: sitemapDetected,
      url: sitemapUrl,
      urlCount: sitemapUrlCount,
      sampleUrls: sampleUrls.slice(0, 8),
      hasLastMod,
      isSitemapIndex,
      errors: sitemapErrors,
    },
    geo: {
      score: totalGeoScore,
      grade: geoGrade,
      aiBotAccessibilityScore,
      schemaRichnessScore,
      headingClarityScore,
      contentDepthScore,
      strengths: geoStrengths,
      recommendations: geoRecommendations,
      botPermissions: allBotResults,
    },
    warnings,
  };
}
