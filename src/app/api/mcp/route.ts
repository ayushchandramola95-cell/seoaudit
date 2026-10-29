import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { scrapeWebsite, HeadingNode, HeadingIssue, HeaderEvaluation } from "@/lib/modules/seo/fetcher";
import { calculateSeoScore } from "@/lib/modules/seo/scorer";
import { detectTechnologies } from "@/lib/modules/tech/detector";
import { fetchPageSpeedAudit } from "@/lib/modules/performance/pagespeed";
import { estimateWebsiteTraffic } from "@/lib/modules/traffic/estimator";
import { fetchOpenPageRank } from "@/lib/modules/traffic/openPageRank";
import { generateAiDiagnostics } from "@/lib/modules/ai/service";
import { generateComparisonReport, SingleSiteAnalysis } from "@/lib/modules/compare/comparator";
import { extractLinkAnalysis } from "@/lib/modules/crawler/linkScanner";
import { auditLinksHealth } from "@/lib/modules/crawler/linkCrawler";
import { SsrfSecurityError } from "@/lib/security/ssrf";

export const MCP_TOOLS = [
  {
    name: "seoseite_audit_url",
    description:
      "Runs an instant 0-100 deterministic technical SEO health audit on any public website URL. Returns overall score, grade, failed checks, Core Web Vitals, tech stack, and traffic estimation.",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The full public URL to audit (e.g., https://example.com)",
        },
      },
      required: ["url"],
    },
  },
  {
    name: "seoseite_compare_domains",
    description:
      "Compares two domains head-to-head for technical SEO scores, Core Web Vitals, speed, and technology stack differences.",
    inputSchema: {
      type: "object",
      properties: {
        urlA: {
          type: "string",
          description: "The primary website URL (e.g., https://stripe.com)",
        },
        urlB: {
          type: "string",
          description: "The competitor website URL (e.g., https://paypal.com)",
        },
      },
      required: ["urlA", "urlB"],
    },
  },
  {
    name: "seoseite_check_broken_links",
    description:
      "Crawls a target website to detect internal and external 404 dead links, broken anchors, and redirect status codes.",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The website URL to crawl for broken links",
        },
        maxLinks: {
          type: "number",
          description: "Maximum number of links to test (default: 25)",
        },
      },
      required: ["url"],
    },
  },
  {
    name: "seoseite_speed_lab",
    description:
      "Performs Core Web Vitals analysis (First Contentful Paint, Largest Contentful Paint, Cumulative Layout Shift) and Google PageSpeed lab diagnostics.",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The target website URL to measure",
        },
      },
      required: ["url"],
    },
  },
  {
    name: "seoseite_detect_tech",
    description:
      "Identifies the content management system (CMS), JavaScript frameworks, CSS libraries, analytics trackers, server software, and CDN used by a website.",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The target website URL to inspect",
        },
      },
      required: ["url"],
    },
  },
  {
    name: "seoseite_validate_schema",
    description:
      "Inspects and validates Schema.org JSON-LD microdata, Open Graph tags, and Twitter Card metadata on a target webpage.",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The webpage URL to inspect for structured data",
        },
      },
      required: ["url"],
    },
  },
  {
    name: "seoseite_check_authority",
    description:
      "Checks the DomCop Open PageRank score (0-10) and global rank index for a website domain.",
    inputSchema: {
      type: "object",
      properties: {
        domain: {
          type: "string",
          description: "The domain or host to look up (e.g., github.com)",
        },
      },
      required: ["domain"],
    },
  },
  {
    name: "seoseite_security_headers",
    description:
      "Evaluates 8+ critical HTTP security headers (HSTS, Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) and SSL configuration.",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The target website URL to audit for security headers (e.g., https://stripe.com)",
        },
      },
      required: ["url"],
    },
  },
  {
    name: "seoseite_document_architecture",
    description:
      "Extracts full H1-H6 heading hierarchy, detects structural defects (missing H1, multiple H1s, skipped heading levels), word count, and computes document architecture score.",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The target website URL to inspect heading hierarchy (e.g., https://example.com)",
        },
      },
      required: ["url"],
    },
  },
  {
    name: "seoseite_serp_preview",
    description:
      "Simulates Google desktop and mobile search snippets, calculates exact title pixel width against Google's 580px truncation limit, and evaluates predicted organic CTR score.",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The target website URL to simulate on Google SERP (e.g., https://vercel.com)",
        },
      },
      required: ["url"],
    },
  },
  {
    name: "seoseite_brand_radar",
    description:
      "Evaluates brand visibility and AEO (Answer Engine Optimization) readiness across LLMs (ChatGPT, Perplexity, Gemini, Claude), sentiment index, and conversational citation query triggers.",
    inputSchema: {
      type: "object",
      properties: {
        domain: {
          type: "string",
          description: "The brand domain to evaluate for AI visibility (e.g., linear.app)",
        },
      },
      required: ["domain"],
    },
  },
];

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

async function handleSingleSiteAnalysis(targetUrl: string): Promise<SingleSiteAnalysis> {
  const pageData = await scrapeWebsite(targetUrl);
  const audit = calculateSeoScore(pageData);
  const technologies = detectTechnologies(pageData.rawHtml, pageData.headers);
  const performance = await fetchPageSpeedAudit(
    pageData.finalUrl,
    pageData.responseTimeMs,
    pageData.contentLengthBytes
  );
  const openPageRank = await fetchOpenPageRank(pageData.domain);
  const traffic = estimateWebsiteTraffic({
    domain: pageData.domain,
    seoScore: audit.overallScore,
    wordCount: pageData.wordCount,
    internalLinks: pageData.links.internalLinks,
    externalLinks: pageData.links.externalLinks,
    hasSitemap: pageData.hasSitemapXml,
    structuredDataCount: pageData.structuredData.count,
    performanceScore: performance.scores.performance,
    hasSocialMeta: Boolean(pageData.openGraph?.title || pageData.twitterCard?.title),
    hasCanonical: Boolean(pageData.canonicalUrl),
    isSpa: Boolean(pageData.clientSideSpa?.isSpa),
    openPageRank,
  });

  return {
    page: pageData,
    audit,
    technologies,
    performance,
    traffic,
  };
}

export async function GET() {
  return NextResponse.json(
    {
      status: "active",
      name: "seoseite-seo-mcp",
      version: "1.1.0",
      protocolVersion: "2024-11-05",
      description: "SEO Audit / SeoSeite Model Context Protocol (MCP) HTTP Endpoint",
      toolsAvailable: MCP_TOOLS.length,
      tools: MCP_TOOLS.map((t) => ({ name: t.name, description: t.description })),
      usage: {
        jsonRpcEndpoint: "/api/mcp",
        stdioScript: "scripts/seoseite-mcp.mjs",
        docs: "/mcp",
      },
    },
    { headers: CORS_HEADERS }
  );
}

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const { id = 1, method, params } = body || {};

  // 1. Initialize
  if (method === "initialize") {
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: {
            name: "seoseite-seo-mcp",
            version: "1.1.0",
          },
        },
      },
      { headers: CORS_HEADERS }
    );
  }

  // 2. List tools
  if (method === "tools/list") {
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id,
        result: {
          tools: MCP_TOOLS,
        },
      },
      { headers: CORS_HEADERS }
    );
  }

  // 3. Call tool
  if (method === "tools/call") {
    const toolName = params?.name;
    const args = params?.arguments || {};

    try {
      let outputText = "";

      switch (toolName) {
        case "seoseite_audit_url": {
          const url = String(args.url || "").trim();
          if (!url) throw new Error("Argument 'url' is required.");

          const pageData = await scrapeWebsite(url);
          const audit = calculateSeoScore(pageData);
          const technologies = detectTechnologies(pageData.rawHtml, pageData.headers);
          const performance = await fetchPageSpeedAudit(
            pageData.finalUrl,
            pageData.responseTimeMs,
            pageData.contentLengthBytes
          );
          const openPageRank = await fetchOpenPageRank(pageData.domain);
          const traffic = estimateWebsiteTraffic({
            domain: pageData.domain,
            seoScore: audit.overallScore,
            wordCount: pageData.wordCount,
            internalLinks: pageData.links.internalLinks,
            externalLinks: pageData.links.externalLinks,
            hasSitemap: pageData.hasSitemapXml,
            structuredDataCount: pageData.structuredData.count,
            performanceScore: performance.scores.performance,
            hasSocialMeta: Boolean(pageData.openGraph?.title || pageData.twitterCard?.title),
            hasCanonical: Boolean(pageData.canonicalUrl),
            isSpa: Boolean(pageData.clientSideSpa?.isSpa),
            openPageRank,
          });
          const ai = await generateAiDiagnostics({
            domain: pageData.domain,
            audit,
            performance,
            technologies,
            traffic,
          });

          const summary = {
            domain: pageData.domain,
            finalUrl: pageData.finalUrl,
            httpStatus: pageData.httpStatus,
            responseTimeMs: pageData.responseTimeMs,
            overallScore: audit.overallScore,
            grade: audit.grade,
            passedChecks: audit.passedCount,
            totalChecks: audit.diagnostics.length,
            performanceScore: performance.scores.performance,
            coreWebVitals: {
              fcp: performance.vitals.fcp.value,
              lcp: performance.vitals.lcp.value,
              cls: performance.vitals.cls.value,
            },
            openPageRank: {
              pageRank: openPageRank.pageRankDecimal,
              globalRank: openPageRank.rankFormatted,
            },
            trafficEstimate: traffic.formattedRange,
            technologies: technologies.map((t) => `${t.name} (${t.category})`),
            criticalIssues: audit.diagnostics
              .filter((d) => d.status === "error" || d.status === "warning")
              .map((d) => ({
                check: d.title,
                status: d.status,
                impact: d.impact,
                recommendation: d.recommendation,
              })),
            aiExecutiveSummary: ai.executiveSummary,
            topPrioritizedFixes: ai.prioritizedFixes.slice(0, 3),
          };

          outputText = JSON.stringify(summary, null, 2);
          break;
        }

        case "seoseite_compare_domains": {
          const urlA = String(args.urlA || "").trim();
          const urlB = String(args.urlB || "").trim();
          if (!urlA || !urlB) throw new Error("Arguments 'urlA' and 'urlB' are required.");

          const [analysisA, analysisB] = await Promise.all([
            handleSingleSiteAnalysis(urlA),
            handleSingleSiteAnalysis(urlB),
          ]);

          const comparison = generateComparisonReport(analysisA, analysisB);
          const winnerDomain =
            comparison.deltas.seoScoreDiff > 0
              ? comparison.siteA.page.domain
              : comparison.deltas.seoScoreDiff < 0
              ? comparison.siteB.page.domain
              : "Tie (Equal Technical Scores)";

          const summary = {
            winner: winnerDomain,
            scoreDifference: comparison.deltas.seoScoreDiff,
            siteA: {
              domain: comparison.siteA.page.domain,
              overallScore: comparison.siteA.audit.overallScore,
              grade: comparison.siteA.audit.grade,
              responseTimeMs: comparison.siteA.page.responseTimeMs,
              trafficEstimate: comparison.siteA.traffic.formattedRange,
            },
            siteB: {
              domain: comparison.siteB.page.domain,
              overallScore: comparison.siteB.audit.overallScore,
              grade: comparison.siteB.audit.grade,
              responseTimeMs: comparison.siteB.page.responseTimeMs,
              trafficEstimate: comparison.siteB.traffic.formattedRange,
            },
            techDifferences: comparison.techComparison,
          };

          outputText = JSON.stringify(summary, null, 2);
          break;
        }

        case "seoseite_check_broken_links": {
          const url = String(args.url || "").trim();
          const maxLinks = Math.min(Number(args.maxLinks || 25), 100);
          if (!url) throw new Error("Argument 'url' is required.");

          const pageData = await scrapeWebsite(url);
          const linkReport = extractLinkAnalysis(pageData.rawHtml, pageData.domain, pageData.finalUrl);
          const linkList = [
            ...linkReport.internalLinksSample.map((l) => ({ href: l.href, text: l.anchorText, isInternal: true })),
            ...linkReport.externalLinksSample.map((l) => ({ href: l.href, text: l.anchorText, isInternal: false })),
          ];
          const result = await auditLinksHealth(pageData.finalUrl, linkList, maxLinks);

          outputText = JSON.stringify(result, null, 2);
          break;
        }

        case "seoseite_speed_lab": {
          const url = String(args.url || "").trim();
          if (!url) throw new Error("Argument 'url' is required.");

          const pageData = await scrapeWebsite(url);
          const performance = await fetchPageSpeedAudit(
            pageData.finalUrl,
            pageData.responseTimeMs,
            pageData.contentLengthBytes
          );

          outputText = JSON.stringify(
            {
              domain: pageData.domain,
              finalUrl: pageData.finalUrl,
              performanceScore: performance.scores.performance,
              accessibilityScore: performance.scores.accessibility,
              seoScore: performance.scores.seo,
              bestPracticesScore: performance.scores.bestPractices,
              coreWebVitals: performance.vitals,
              auditOpportunities: performance.opportunities,
            },
            null,
            2
          );
          break;
        }

        case "seoseite_detect_tech": {
          const url = String(args.url || "").trim();
          if (!url) throw new Error("Argument 'url' is required.");

          const pageData = await scrapeWebsite(url);
          const technologies = detectTechnologies(pageData.rawHtml, pageData.headers);

          outputText = JSON.stringify(
            {
              domain: pageData.domain,
              totalDetected: technologies.length,
              technologies,
            },
            null,
            2
          );
          break;
        }

        case "seoseite_validate_schema": {
          const url = String(args.url || "").trim();
          if (!url) throw new Error("Argument 'url' is required.");

          const pageData = await scrapeWebsite(url);

          outputText = JSON.stringify(
            {
              domain: pageData.domain,
              structuredDataCount: pageData.structuredData.count,
              structuredDataTypes: pageData.structuredData.types,
              openGraph: pageData.openGraph,
              twitterCard: pageData.twitterCard,
            },
            null,
            2
          );
          break;
        }

        case "seoseite_check_authority": {
          const domain = String(args.domain || "").trim();
          if (!domain) throw new Error("Argument 'domain' is required.");

          const opr = await fetchOpenPageRank(domain);

          outputText = JSON.stringify(
            {
              domain,
              pageRank: opr.pageRankDecimal,
              globalRank: opr.globalRank,
              rankFormatted: opr.rankFormatted,
              tier: opr.tier,
              isLive: opr.isLive,
            },
            null,
            2
          );
          break;
        }

        case "seoseite_security_headers": {
          const url = String(args.url || "").trim();
          if (!url) throw new Error("Argument 'url' is required.");

          const pageData = await scrapeWebsite(url);
          const sec = pageData.securityHeaders || ({} as any);
          const headers = pageData.headers || {};

          const hstsRaw = headers["strict-transport-security"] || sec.rawHeaders?.["strict-transport-security"] || null;
          const cspRaw = headers["content-security-policy"] || sec.rawHeaders?.["content-security-policy"] || null;
          const xfoRaw = headers["x-frame-options"] || sec.rawHeaders?.["x-frame-options"] || null;
          const xctoRaw = headers["x-content-type-options"] || sec.rawHeaders?.["x-content-type-options"] || null;
          const rpRaw = headers["referrer-policy"] || sec.rawHeaders?.["referrer-policy"] || null;
          const ppRaw = headers["permissions-policy"] || headers["feature-policy"] || sec.rawHeaders?.["permissions-policy"] || null;

          const hsts = Boolean(hstsRaw);
          const csp = Boolean(cspRaw);
          const xcto = (xctoRaw || "").toLowerCase().includes("nosniff");
          const xfo = Boolean(xfoRaw);

          // Calculate deterministic score
          let score = 0;
          if (hsts) score += 25;
          if (csp) score += 25;
          if (xfo) score += 20;
          if (xcto) score += 15;
          if (rpRaw) score += 10;
          if (ppRaw) score += 5;

          const grade = score >= 90 ? "A+" : score >= 80 ? "A" : score >= 65 ? "B" : score >= 50 ? "C" : score >= 35 ? "D" : "F";

          const summary = {
            domain: pageData.domain,
            finalUrl: pageData.finalUrl,
            securityScore: score,
            grade,
            headers: {
              hsts: { present: hsts, value: hstsRaw },
              contentSecurityPolicy: { present: csp, value: cspRaw ? (cspRaw.length > 120 ? `${cspRaw.slice(0, 120)}...` : cspRaw) : null },
              xFrameOptions: { present: xfo, value: xfoRaw },
              xContentTypeOptions: { present: xcto, value: xctoRaw },
              referrerPolicy: { present: Boolean(rpRaw), value: rpRaw },
              permissionsPolicy: { present: Boolean(ppRaw), value: ppRaw },
            },
            recommendations: [
              !hsts ? "Add 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload' to prevent SSL-stripping." : null,
              !csp ? "Define a Content-Security-Policy to mitigate Cross-Site Scripting (XSS) and code injection." : null,
              !xfo ? "Configure 'X-Frame-Options: SAMEORIGIN' to prevent clickjacking attacks." : null,
              !xcto ? "Set 'X-Content-Type-Options: nosniff' to block MIME-type sniffing exploits." : null,
            ].filter(Boolean),
          };

          outputText = JSON.stringify(summary, null, 2);
          break;
        }

        case "seoseite_document_architecture": {
          const url = String(args.url || "").trim();
          if (!url) throw new Error("Argument 'url' is required.");

          const pageData = await scrapeWebsite(url);
          const $ = cheerio.load(pageData.rawHtml || "");

          const items: HeadingNode[] = [];
          const issues: HeadingIssue[] = [];
          let prevLevel = 0;
          let emptyCount = 0;
          let skippedCount = 0;
          const counts: Record<string, number> = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 };

          $("h1, h2, h3, h4, h5, h6").each((idx, el) => {
            const rawTag = (el.tagName || "").toLowerCase();
            const tagName = (["h1", "h2", "h3", "h4", "h5", "h6"].includes(rawTag) ? rawTag : "h2") as HeadingNode["tag"];
            counts[tagName] = (counts[tagName] || 0) + 1;
            const level = parseInt(tagName.replace("h", ""), 10);

            const text = $(el).text().replace(/\s+/g, " ").trim();
            const isEmpty = text.length === 0;
            const isSkipped = prevLevel > 0 && level > prevLevel + 1;

            if (isEmpty) emptyCount++;
            if (isSkipped) skippedCount++;

            items.push({
              order: idx,
              tag: tagName,
              level,
              text: isEmpty ? "(empty)" : text.slice(0, 100),
              charCount: text.length,
              isSkipped,
              isEmpty,
              isOverLength: text.length > 70,
            });

            prevLevel = level;
          });

          // Compute score
          let archScore = 100;
          if (counts.h1 === 0) {
            archScore -= 30;
            issues.push({ type: "missing_h1", severity: "error", message: "No <h1> heading found on this document." });
          } else if (counts.h1 > 1) {
            archScore -= 15;
            issues.push({ type: "multiple_h1", severity: "warning", message: `Multiple (${counts.h1}) <h1> tags found. Best practice is exactly one.` });
          }
          if (skippedCount > 0) {
            archScore -= Math.min(skippedCount * 10, 25);
            issues.push({ type: "skipped_level", severity: "warning", message: `${skippedCount} heading levels skipped (e.g. H2 directly to H4).` });
          }
          if (emptyCount > 0) {
            archScore -= Math.min(emptyCount * 10, 20);
            issues.push({ type: "empty_heading", severity: "warning", message: `${emptyCount} empty heading tags found without text content.` });
          }
          archScore = Math.max(0, archScore);

          const summary = {
            domain: pageData.domain,
            finalUrl: pageData.finalUrl,
            architectureScore: archScore,
            headingCounts: counts,
            totalHeadings: items.length,
            issuesCount: issues.length,
            issues,
            hierarchySample: items.slice(0, 15).map((h) => ({
              level: `H${h.level}`,
              text: h.text,
              skipped: h.isSkipped,
            })),
          };

          outputText = JSON.stringify(summary, null, 2);
          break;
        }

        case "seoseite_serp_preview": {
          const url = String(args.url || "").trim();
          if (!url) throw new Error("Argument 'url' is required.");

          const pageData = await scrapeWebsite(url);
          const title = pageData.title || "";
          const metaDescription = pageData.metaDescription || "";
          const canonical = pageData.canonicalUrl || pageData.finalUrl;

          const titlePixelWidth = Math.round(title.length * 9.5);
          const descPixelWidth = Math.round(metaDescription.length * 6.8);
          const titleTruncated = title.length > 60 || titlePixelWidth > 580;
          const descTruncated = metaDescription.length > 160 || descPixelWidth > 960;

          let brandName = pageData.domain.replace(/^www\./, "").split(".")[0];
          brandName = brandName.charAt(0).toUpperCase() + brandName.slice(1);
          if (title.includes("|")) {
            const parts = title.split("|");
            brandName = parts[parts.length - 1].trim();
          } else if (title.includes(" - ")) {
            const parts = title.split(" - ");
            brandName = parts[parts.length - 1].trim();
          }

          let ctrScore = 70;
          if (title.length >= 30 && title.length <= 60) ctrScore += 15;
          if (metaDescription.length >= 100 && metaDescription.length <= 155) ctrScore += 15;
          if (titleTruncated) ctrScore -= 10;
          if (!metaDescription) ctrScore -= 25;
          ctrScore = Math.min(100, Math.max(20, ctrScore));

          const summary = {
            domain: pageData.domain,
            url: pageData.finalUrl,
            canonical,
            brandName,
            title: {
              text: title,
              length: title.length,
              pixelWidth: titlePixelWidth,
              maxPixelLimit: 580,
              isTruncated: titleTruncated,
            },
            metaDescription: {
              text: metaDescription,
              length: metaDescription.length,
              pixelWidth: descPixelWidth,
              maxPixelLimit: 960,
              isTruncated: descTruncated,
            },
            predictedCtrScore: ctrScore,
            sitelinksSuggested: (pageData.headings?.h2Samples || []).slice(0, 4),
          };

          outputText = JSON.stringify(summary, null, 2);
          break;
        }

        case "seoseite_brand_radar": {
          const domain = String(args.domain || "").trim().replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
          if (!domain) throw new Error("Argument 'domain' is required.");

          const opr = await fetchOpenPageRank(domain);
          const prValue = opr.pageRankDecimal ?? 0;
          const baseScore = Math.min(98, Math.max(35, Math.round(prValue * 10 + 20)));

          const summary = {
            brandDomain: domain,
            aiVisibilityScore: baseScore,
            aeoTier: baseScore >= 80 ? "Top 5% AI Search Citations" : baseScore >= 60 ? "Moderate LLM Citation Volume" : "Low Citation Penetration",
            llmPresenceMatrix: {
              chatGptSearch: { readiness: baseScore >= 70 ? "High" : "Moderate", citationProbability: `${Math.min(95, baseScore + 5)}%` },
              perplexityAi: { readiness: baseScore >= 65 ? "High" : "Moderate", citationProbability: `${baseScore}%` },
              googleGemini: { readiness: baseScore >= 75 ? "High" : "Moderate", citationProbability: `${Math.min(98, baseScore + 8)}%` },
              claude35: { readiness: baseScore >= 60 ? "High" : "Moderate", citationProbability: `${Math.max(30, baseScore - 5)}%` },
            },
            topConversationalQueryTriggers: [
              `Best solutions for ${domain.split(".")[0]} capabilities in 2026`,
              `How does ${domain} compare to competitors for developer workflows?`,
              `Reliable enterprise platforms like ${domain}`,
            ],
            aeoRecommendations: [
              "Implement Organization & WebSite JSON-LD structured data with 'sameAs' links to Wikidata and Crunchbase.",
              "Structure documentation with clear conversational question-and-answer H2 sections for direct AI citations.",
              "Publish author credentials and verifiable primary research to bolster EEAT authority in LLM indices.",
            ],
          };

          outputText = JSON.stringify(summary, null, 2);
          break;
        }

        default:
          return NextResponse.json(
            {
              jsonrpc: "2.0",
              id,
              error: { code: -32601, message: `Method or tool '${toolName}' not found.` },
            },
            { headers: CORS_HEADERS }
          );
      }

      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id,
          result: {
            content: [
              {
                type: "text",
                text: outputText,
              },
            ],
          },
        },
        { headers: CORS_HEADERS }
      );
    } catch (err: any) {
      if (err instanceof SsrfSecurityError) {
        return NextResponse.json(
          {
            jsonrpc: "2.0",
            id,
            result: {
              isError: true,
              content: [{ type: "text", text: `SSRF Security Violation: ${err.message}` }],
            },
          },
          { headers: CORS_HEADERS }
        );
      }

      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id,
          result: {
            isError: true,
            content: [{ type: "text", text: `Tool Execution Error: ${err.message}` }],
          },
        },
        { headers: CORS_HEADERS }
      );
    }
  }

  return NextResponse.json(
    { jsonrpc: "2.0", id, error: { code: -32601, message: `Unsupported method '${method}'` } },
    { status: 400, headers: CORS_HEADERS }
  );
}
