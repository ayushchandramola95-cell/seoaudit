#!/usr/bin/env node

/**
 * SeoSeite Model Context Protocol (MCP) Server
 * Compatible with Anthropic Claude Desktop, Cursor IDE, Windsurf, and custom AI agents.
 * 
 * Provides conversational tools to query technical SEO health audits, Core Web Vitals,
 * competitor domain comparisons, dead link detection, and technology stacks.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const SEOSEITE_BASE_URL = process.env.SEOSEITE_API_URL || "http://localhost:3000";

const server = new Server(
  {
    name: "seoseite-seo-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 1. Tool Definitions
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
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
    ],
  };
});

// Helper for HTTP requests to SeoSeite API
async function apiGet(endpoint) {
  const url = `${SEOSEITE_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`SeoSeite API returned HTTP ${res.status}: ${errText}`);
    }
    return await res.json();
  } catch (err) {
    throw new Error(
      `Failed to connect to SeoSeite API at ${url}. Ensure the SeoSeite dev server is running (npm run dev). Error: ${err.message}`
    );
  }
}

// 2. Tool Execution Handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "seoseite_audit_url": {
        const targetUrl = String(args?.url || "").trim();
        if (!targetUrl) throw new Error("Argument 'url' is required.");

        const data = await apiGet(`/api/analyze?url=${encodeURIComponent(targetUrl)}`);
        
        // Compact LLM-friendly summary to save context window tokens
        const summary = {
          domain: data.page?.domain,
          finalUrl: data.page?.finalUrl,
          httpStatus: data.page?.httpStatus,
          responseTimeMs: data.page?.responseTimeMs,
          overallScore: data.audit?.overallScore,
          grade: data.audit?.grade,
          passedChecks: data.audit?.passedCount,
          totalChecks: data.audit?.totalCount,
          performanceScore: data.performance?.scores?.performance,
          coreWebVitals: {
            fcp: data.performance?.vitals?.fcp?.formatted,
            lcp: data.performance?.vitals?.lcp?.formatted,
            cls: data.performance?.vitals?.cls?.formatted,
          },
          openPageRank: {
            pageRank: data.traffic?.openPageRank?.pageRankDecimal,
            globalRank: data.traffic?.openPageRank?.rankFormatted,
          },
          trafficEstimate: data.traffic?.formattedRange,
          technologies: data.technologies?.map((t) => `${t.name} (${t.category})`),
          criticalIssues: data.audit?.diagnostics
            ?.filter((d) => d.status === "error" || d.status === "warning")
            ?.map((d) => ({
              check: d.title,
              status: d.status,
              pointsDeducted: d.maxPoints - d.pointsEarned,
              impact: d.impact,
              recommendation: d.recommendation,
            })),
          aiExecutiveSummary: data.ai?.executiveSummary,
          topPrioritizedFixes: data.ai?.prioritizedFixes?.slice(0, 3),
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(summary, null, 2),
            },
          ],
        };
      }

      case "seoseite_compare_domains": {
        const urlA = String(args?.urlA || "").trim();
        const urlB = String(args?.urlB || "").trim();
        if (!urlA || !urlB) throw new Error("Arguments 'urlA' and 'urlB' are required.");

        const data = await apiGet(
          `/api/compare?siteA=${encodeURIComponent(urlA)}&siteB=${encodeURIComponent(urlB)}`
        );

        const comparison = data.comparison;
        const summary = {
          winner: comparison?.winnerDomain,
          scoreDifference: comparison?.deltas?.seoScoreDiff,
          siteA: {
            domain: comparison?.siteA?.page?.domain,
            overallScore: comparison?.siteA?.audit?.overallScore,
            grade: comparison?.siteA?.audit?.grade,
            responseTimeMs: comparison?.siteA?.page?.responseTimeMs,
            trafficEstimate: comparison?.siteA?.traffic?.formattedRange,
          },
          siteB: {
            domain: comparison?.siteB?.page?.domain,
            overallScore: comparison?.siteB?.audit?.overallScore,
            grade: comparison?.siteB?.audit?.grade,
            responseTimeMs: comparison?.siteB?.page?.responseTimeMs,
            trafficEstimate: comparison?.siteB?.traffic?.formattedRange,
          },
          keywordGap: {
            sharedCount: comparison?.keywordGap?.shared?.length,
            uniqueToACount: comparison?.keywordGap?.uniqueToA?.length,
            uniqueToBCount: comparison?.keywordGap?.uniqueToB?.length,
            topSharedKeywords: comparison?.keywordGap?.shared?.slice(0, 8),
          },
          techDifferences: {
            uniqueToA: comparison?.techComparison?.uniqueToA,
            uniqueToB: comparison?.techComparison?.uniqueToB,
          },
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(summary, null, 2),
            },
          ],
        };
      }

      case "seoseite_check_broken_links": {
        const targetUrl = String(args?.url || "").trim();
        const maxLinks = Number(args?.maxLinks || 25);
        if (!targetUrl) throw new Error("Argument 'url' is required.");

        const data = await apiGet(
          `/api/crawler/links?url=${encodeURIComponent(targetUrl)}&maxLinks=${maxLinks}`
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case "seoseite_speed_lab": {
        const targetUrl = String(args?.url || "").trim();
        if (!targetUrl) throw new Error("Argument 'url' is required.");

        const data = await apiGet(`/api/tools/speed?url=${encodeURIComponent(targetUrl)}`);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case "seoseite_detect_tech": {
        const targetUrl = String(args?.url || "").trim();
        if (!targetUrl) throw new Error("Argument 'url' is required.");

        const data = await apiGet(`/api/tools/tech?url=${encodeURIComponent(targetUrl)}`);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case "seoseite_validate_schema": {
        const targetUrl = String(args?.url || "").trim();
        if (!targetUrl) throw new Error("Argument 'url' is required.");

        const data = await apiGet(`/api/tools/schema?url=${encodeURIComponent(targetUrl)}`);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case "seoseite_check_authority": {
        const domain = String(args?.domain || "").trim();
        if (!domain) throw new Error("Argument 'domain' is required.");

        const data = await apiGet(`/api/tools/authority?domain=${encodeURIComponent(domain)}`);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unsupported SeoSeite MCP tool: "${name}".`);
    }
  } catch (err) {
    return {
      content: [
        {
          type: "text",
          text: `[SeoSeite MCP Error] ${err.message}`,
        },
      ],
      isError: true,
    };
  }
});

// 3. Connect to Standard Input / Output (stdio)
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🚀 SeoSeite SEO MCP Server listening on stdio.");
  console.error(`Connected to backend API: ${SEOSEITE_BASE_URL}`);
}

main().catch((err) => {
  console.error("Fatal error starting SeoSeite MCP Server:", err);
  process.exit(1);
});
