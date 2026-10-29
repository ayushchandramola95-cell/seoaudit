#!/usr/bin/env node

/**
 * SeoSeite / SEO Audit Model Context Protocol (MCP) Server
 * Compatible with Anthropic Claude Desktop, Cursor IDE, Windsurf, and custom AI agents.
 * 
 * Provides 11 conversational tools to query technical SEO health audits, Core Web Vitals,
 * competitor domain comparisons, dead link detection, security headers, document architecture,
 * SERP simulations, brand radar, and technology stacks.
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
    version: "1.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 1. Tool Definitions (All 11 Dedicated Engines)
const TOOLS_DEFINITION = [
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

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS_DEFINITION };
});

// 2. Tool Execution via JSON-RPC Endpoint
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const res = await fetch(`${SEOSEITE_BASE_URL}/api/mcp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method: "tools/call",
        params: {
          name,
          arguments: args,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`SeoSeite API returned HTTP ${res.status}: ${errText}`);
    }

    const json = await res.json();
    if (json.error) {
      throw new Error(json.error.message || "Unknown JSON-RPC error");
    }

    return json.result;
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
  console.error(`11 MCP Tools registered and ready for Claude Desktop / Cursor.`);
}

main().catch((err) => {
  console.error("Fatal error starting SeoSeite MCP Server:", err);
  process.exit(1);
});
