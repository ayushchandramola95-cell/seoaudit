import { NextRequest, NextResponse } from "next/server";
import { scrapeWebsite } from "@/lib/modules/seo/fetcher";
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

const MCP_TOOLS = [
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
];

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
  return NextResponse.json({
    status: "active",
    name: "seoseite-seo-mcp",
    version: "1.0.0",
    protocolVersion: "2024-11-05",
    description: "SeoSeite Model Context Protocol (MCP) HTTP Endpoint",
    toolsAvailable: MCP_TOOLS.length,
    tools: MCP_TOOLS.map((t) => ({ name: t.name, description: t.description })),
    usage: {
      jsonRpcEndpoint: "/api/mcp",
      stdioScript: "scripts/seoseite-mcp.mjs",
      docs: "/mcp",
    },
  });
}

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } },
      { status: 400 }
    );
  }

  const { id = 1, method, params } = body || {};

  // 1. Initialize
  if (method === "initialize") {
    return NextResponse.json({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: {
          name: "seoseite-seo-mcp",
          version: "1.0.0",
        },
      },
    });
  }

  // 2. List tools
  if (method === "tools/list") {
    return NextResponse.json({
      jsonrpc: "2.0",
      id,
      result: {
        tools: MCP_TOOLS,
      },
    });
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

        default:
          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            error: { code: -32601, message: `Method or tool '${toolName}' not found.` },
          });
      }

      return NextResponse.json({
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
      });
    } catch (err: any) {
      if (err instanceof SsrfSecurityError) {
        return NextResponse.json({
          jsonrpc: "2.0",
          id,
          result: {
            isError: true,
            content: [{ type: "text", text: `SSRF Security Violation: ${err.message}` }],
          },
        });
      }

      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: {
          isError: true,
          content: [{ type: "text", text: `Tool Execution Error: ${err.message}` }],
        },
      });
    }
  }

  return NextResponse.json(
    { jsonrpc: "2.0", id, error: { code: -32601, message: `Unsupported method '${method}'` } },
    { status: 400 }
  );
}
