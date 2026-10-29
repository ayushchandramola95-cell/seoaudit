"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Terminal,
  Code2,
  Copy,
  Check,
  Play,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers,
  Globe,
  Database,
  Cpu,
  RefreshCw,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Hash,
  Send,
  Zap,
  Lock,
  Search,
  Download,
  Activity,
  Sliders,
  Filter,
  Eye,
  GitCompare,
  FileCode,
  FileText,
  Radio,
  Clock,
  RotateCcw,
} from "lucide-react";
import { usePlan } from "@/lib/auth/PlanContext";
import { formatTierName } from "@/lib/auth/tierLimits";

export type ApiCategory =
  | "all"
  | "audit"
  | "performance"
  | "security"
  | "search"
  | "competitive"
  | "bulk"
  | "ai"
  | "mcp"
  | "webhooks";

export interface ApiEndpoint {
  id: string;
  name: string;
  category: ApiCategory;
  categoryLabel: string;
  method: "POST" | "GET";
  path: string;
  description: string;
  tierRequired: "free" | "starter" | "pro" | "enterprise";
  requestBody: Record<string, any>;
  responseExample: Record<string, any>;
  queryParams?: Record<string, string>;
}

const ENDPOINTS: ApiEndpoint[] = [
  {
    id: "analyze",
    name: "Run Full Technical SEO Audit",
    category: "audit",
    categoryLabel: "Core Audits",
    method: "POST",
    path: "/api/analyze",
    description: "Executes a deterministic 0-100 technical SEO health audit across metadata, DOM hierarchy, security headers, tech stack, and Google PageSpeed lab vitals.",
    tierRequired: "free",
    requestBody: {
      url: "https://stripe.com",
    },
    responseExample: {
      success: true,
      id: "scan_1793257109523_d3mcu",
      timestamp: "2026-10-29T06:58:31.043Z",
      page: {
        domain: "stripe.com",
        finalUrl: "https://stripe.com/",
        title: "Stripe | Financial Infrastructure for the Internet",
        responseTimeMs: 64,
        isHttps: true,
      },
      audit: {
        overallScore: 94,
        grade: "A+",
        passedCount: 22,
        failedCount: 2,
      },
      performance: {
        scores: { performance: 92, accessibility: 98, bestPractices: 100, seo: 100 },
        vitals: { fcp: "0.9s", lcp: "1.4s", cls: "0.00", tbt: "45ms" },
      },
      technologiesCount: 12,
    },
  },
  {
    id: "compare",
    name: "Head-to-Head Competitor Compare",
    category: "competitive",
    categoryLabel: "Competitive",
    method: "POST",
    path: "/api/compare",
    description: "Audits two websites simultaneously to compare SEO health, response latency, tech stacks, and differential score deltas.",
    tierRequired: "pro",
    requestBody: {
      siteA: "https://vercel.com",
      siteB: "https://netlify.com",
    },
    responseExample: {
      success: true,
      report: {
        winner: "vercel.com",
        deltas: { seoScoreDiff: 6, responseTimeDiffMs: -18 },
        siteA: { domain: "vercel.com", score: 88, grade: "B+" },
        siteB: { domain: "netlify.com", score: 82, grade: "B" },
      },
    },
  },
  {
    id: "speed",
    name: "Core Web Vitals & PageSpeed Lab",
    category: "performance",
    categoryLabel: "Performance",
    method: "POST",
    path: "/api/tools/speed",
    description: "Evaluates Google Core Web Vitals (FCP, LCP, CLS, TBT, TTFB) with performance optimization opportunities and asset weight breakdown.",
    tierRequired: "free",
    requestBody: {
      url: "https://stripe.com",
      strategy: "mobile",
    },
    responseExample: {
      success: true,
      url: "https://stripe.com",
      timingMs: 142,
      data: {
        strategy: "mobile",
        scores: { performance: 91, accessibility: 98, seo: 100 },
        metrics: {
          lcp: { value: 1.4, unit: "s", rating: "good" },
          cls: { value: 0.01, unit: "", rating: "good" },
          fcp: { value: 0.9, unit: "s", rating: "good" },
          ttfb: { value: 112, unit: "ms", rating: "good" },
        },
        assetsSummary: { htmlKb: 42.1, estimatedTotalKb: 410 },
      },
    },
  },
  {
    id: "security-headers",
    name: "HTTP Security Headers & SSL Guard",
    category: "security",
    categoryLabel: "Security",
    method: "POST",
    path: "/api/tools/security-headers",
    description: "Analyzes 8+ HTTP security headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer, Permissions, COOP/COEP) and SSL transport encryption.",
    tierRequired: "free",
    requestBody: {
      url: "https://stripe.com",
    },
    responseExample: {
      success: true,
      domain: "stripe.com",
      isHttps: true,
      overallScore: 95,
      grade: "A+",
      securityHeaders: {
        hsts: true,
        csp: true,
        xFrameOptions: "DENY",
        xContentTypeOptions: true,
        referrerPolicy: "strict-origin-when-cross-origin",
        serverHeader: "cloudflare",
      },
      threatDefense: { protectedCount: 7, totalVectors: 7, coveragePercent: 100 },
    },
  },
  {
    id: "tech-detector",
    name: "Technology Stack & Infrastructure Profiler",
    category: "performance",
    categoryLabel: "Performance",
    method: "POST",
    path: "/api/tools/tech",
    description: "Fingerprints frontend frameworks (React, Next.js, Vue), CMS, analytics, CDN providers, server software, and DNS architecture.",
    tierRequired: "free",
    requestBody: {
      url: "https://stripe.com",
    },
    responseExample: {
      success: true,
      domain: "stripe.com",
      totalTechnologies: 14,
      architecture: {
        renderingStrategy: "Static / Edge Hydrated",
        frameworks: ["React", "Next.js"],
        cdn: "Cloudflare",
        security: ["HSTS", "CSP"],
      },
      data: [
        { name: "Next.js", category: "Framework", confidence: 100 },
        { name: "Cloudflare", category: "CDN / Proxy", confidence: 100 },
      ],
    },
  },
  {
    id: "schema-validator",
    name: "Schema.org JSON-LD & Social Card Inspector",
    category: "search",
    categoryLabel: "Search & Metadata",
    method: "POST",
    path: "/api/tools/schema",
    description: "Extracts and validates Schema.org JSON-LD microdata, Open Graph social cards, and Twitter Cards from any live URL or custom JSON payload.",
    tierRequired: "free",
    requestBody: {
      url: "https://stripe.com",
    },
    responseExample: {
      success: true,
      domain: "stripe.com",
      structuredData: {
        detected: true,
        count: 3,
        types: ["Organization", "WebSite", "SoftwareApplication"],
      },
      openGraph: {
        title: "Stripe | Financial Infrastructure for the Internet",
        type: "website",
        image: "https://stripe.com/img/og-preview.png",
      },
    },
  },
  {
    id: "authority-checker",
    name: "Open PageRank & Domain Authority Index",
    category: "search",
    categoryLabel: "Search & Metadata",
    method: "POST",
    path: "/api/tools/authority",
    description: "Retrieves DomCop Open PageRank score (0-10), global rank, Moz DA/Ahrefs DR equivalents, and logarithmic backlink estimates.",
    tierRequired: "free",
    requestBody: {
      domain: "stripe.com",
    },
    responseExample: {
      success: true,
      domain: "stripe.com",
      tier: "Enterprise Tier 1",
      data: {
        pageRankDecimal: 8.84,
        globalRank: 142,
        normalizedScore: 88,
        mozDaEquivalent: 92,
        ahrefsDrEquivalent: 94,
        rankingPower: "Mega Authority",
      },
    },
  },
  {
    id: "document-architecture",
    name: "Document Architecture & Heading Tree",
    category: "audit",
    categoryLabel: "Core Audits",
    method: "POST",
    path: "/api/tools/document-architecture",
    description: "Builds full H1-H6 outline hierarchy, detects structural defects (skipped heading levels, missing H1, empty tags), and calculates architecture score.",
    tierRequired: "free",
    requestBody: {
      url: "https://stripe.com",
    },
    responseExample: {
      success: true,
      domain: "stripe.com",
      wordCount: 1480,
      readingTimeMinutes: 7,
      headings: {
        score: 95,
        h1Count: 1,
        h2Count: 6,
        skippedLevelsCount: 0,
        emptyHeadingsCount: 0,
      },
    },
  },
  {
    id: "serp-preview",
    name: "Google SERP Snippet & Pixel Simulator",
    category: "search",
    categoryLabel: "Search & Metadata",
    method: "POST",
    path: "/api/tools/serp",
    description: "Simulates Google desktop/mobile snippet appearances, calculates pixel width against Google's 580px truncation limit, and suggests sitelinks.",
    tierRequired: "free",
    requestBody: {
      url: "https://stripe.com",
    },
    responseExample: {
      success: true,
      domain: "stripe.com",
      brandName: "Stripe",
      serp: {
        title: "Stripe | Financial Infrastructure for the Internet",
        titleLength: 51,
        titlePixelWidth: 484,
        titleTruncated: false,
        descPixelWidth: 812,
        descTruncated: false,
      },
    },
  },
  {
    id: "crawler-links",
    name: "404 Broken Link & Redirect Discovery",
    category: "audit",
    categoryLabel: "Core Audits",
    method: "POST",
    path: "/api/crawler/links",
    description: "Extracts all on-page internal and external hyperlinks, crawls status codes, and identifies 404 dead links and redirect chains.",
    tierRequired: "free",
    requestBody: {
      url: "https://example.com",
    },
    responseExample: {
      success: true,
      totalLinks: 34,
      brokenCount: 0,
      redirectCount: 1,
      links: [
        { url: "https://example.com/pricing", status: 200, isInternal: true },
        { url: "https://example.com/old-page", status: 301, redirectLocation: "/new-page" },
      ],
    },
  },
  {
    id: "content-gap",
    name: "Semantic Content Gap & Keyword Matrix",
    category: "competitive",
    categoryLabel: "Competitive",
    method: "POST",
    path: "/api/tools/content-gap",
    description: "Extracts keyword frequencies and heading topic disparities between target URL and competitor URL to identify content gaps.",
    tierRequired: "pro",
    requestBody: {
      targetUrl: "https://stripe.com",
      competitorUrl: "https://paypal.com",
    },
    responseExample: {
      success: true,
      gapSummary: {
        missingKeywordsCount: 14,
        sharedKeywordsCount: 28,
        topicCoverageScore: 67,
      },
      missingTopics: ["Merchant processing fees", "Fraud protection API"],
    },
  },
  {
    id: "batch",
    name: "Multi-URL Batch SEO Auditor",
    category: "bulk",
    categoryLabel: "Bulk & Scale",
    method: "POST",
    path: "/api/tools/batch",
    description: "Concurrently audits up to 15 website URLs in parallel, returning scores, HTTP status, PageRank, and critical diagnostics in one call.",
    tierRequired: "pro",
    requestBody: {
      urls: [
        "https://stripe.com",
        "https://vercel.com",
        "https://supabase.com",
      ],
    },
    responseExample: {
      success: true,
      totalUrls: 3,
      successful: 3,
      results: [
        { domain: "stripe.com", seoScore: 94, grade: "A+", responseTimeMs: 64 },
        { domain: "vercel.com", seoScore: 88, grade: "B+", responseTimeMs: 82 },
        { domain: "supabase.com", seoScore: 90, grade: "A", responseTimeMs: 71 },
      ],
    },
  },
  {
    id: "brand-radar",
    name: "Brand Radar AI (AEO Share of Voice)",
    category: "ai",
    categoryLabel: "AI & Intelligence",
    method: "POST",
    path: "/api/ai/brand-radar",
    description: "Tests brand recommendation citations across LLMs (ChatGPT, Gemini, Perplexity, Claude) for buyer intent prompt queries.",
    tierRequired: "pro",
    requestBody: {
      brandName: "Stripe",
      targetDomain: "stripe.com",
      prompts: [
        "What are the best payment processors for SaaS startups in 2026?",
        "Top developer-friendly checkout APIs",
      ],
    },
    responseExample: {
      brandName: "Stripe",
      shareOfVoice: 100,
      totalChecks: 2,
      citedCount: 2,
      results: [{ prompt: "...", isMentioned: true }],
    },
  },
  {
    id: "mcp",
    name: "Model Context Protocol (JSON-RPC 2.0 Gateway)",
    category: "mcp",
    categoryLabel: "AI & Intelligence",
    method: "POST",
    path: "/api/mcp",
    description: "Standard JSON-RPC 2.0 MCP gateway for Claude Desktop, Cursor IDE, Windsurf, and custom autonomous agents.",
    tierRequired: "free",
    requestBody: {
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: "seoseite_audit_url",
        arguments: { url: "https://stripe.com" },
      },
    },
    responseExample: {
      jsonrpc: "2.0",
      id: 1,
      result: {
        content: [{ type: "text", text: "..." }],
      },
    },
  },
  {
    id: "webhook-test",
    name: "Alert Webhook Dispatcher",
    category: "webhooks",
    categoryLabel: "Webhooks",
    method: "POST",
    path: "/api/webhook/test",
    description: "Dispatches formatted SEO drop notification payloads to Slack, Discord, Zapier, or HTTP webhook endpoints.",
    tierRequired: "enterprise",
    requestBody: {
      webhookUrl: "https://httpbin.org/post",
      domain: "example.com",
      threshold: 75,
    },
    responseExample: {
      success: true,
      message: "Webhook delivered successfully.",
      mode: "delivered",
    },
  },
];

const CATEGORIES: { id: ApiCategory; label: string }[] = [
  { id: "all", label: "All Endpoints" },
  { id: "audit", label: "Core Audits" },
  { id: "performance", label: "Performance" },
  { id: "security", label: "Security" },
  { id: "search", label: "Search & Metadata" },
  { id: "competitive", label: "Competitive" },
  { id: "bulk", label: "Bulk & Scale" },
  { id: "ai", label: "AI & Intelligence" },
  { id: "webhooks", label: "Webhooks" },
];

export default function ApiDocsClient() {
  const { tier: activeTier } = usePlan();
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>("analyze");
  const [activeCategory, setActiveCategory] = useState<ApiCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"curl" | "fetch" | "typescript" | "python">("curl");

  const [requestInput, setRequestInput] = useState<string>(
    JSON.stringify(ENDPOINTS[0].requestBody, null, 2)
  );
  const [testing, setTesting] = useState(false);
  const [responseOutput, setResponseOutput] = useState<string | null>(null);
  const [executionStats, setExecutionStats] = useState<{ status: number; timeMs: number; sizeKb: number } | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);

  const playgroundRef = useRef<HTMLDivElement>(null);

  const selectedEndpoint = useMemo(
    () => ENDPOINTS.find((e) => e.id === selectedEndpointId) || ENDPOINTS[0],
    [selectedEndpointId]
  );

  const filteredEndpoints = useMemo(() => {
    return ENDPOINTS.filter((ep) => {
      const matchCategory = activeCategory === "all" || ep.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        q === "" ||
        ep.name.toLowerCase().includes(q) ||
        ep.path.toLowerCase().includes(q) ||
        ep.description.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleSelectEndpoint = (ep: ApiEndpoint) => {
    setSelectedEndpointId(ep.id);
    setRequestInput(JSON.stringify(ep.requestBody, null, 2));
    setResponseOutput(null);
    setExecutionStats(null);
  };

  const handleResetPayload = () => {
    setRequestInput(JSON.stringify(selectedEndpoint.requestBody, null, 2));
  };

  const handleRunTest = async () => {
    setTesting(true);
    setResponseOutput(null);
    setExecutionStats(null);
    const start = performance.now();

    try {
      const parsedBody = JSON.parse(requestInput);
      const isPost = selectedEndpoint.method === "POST";

      const res = await fetch(selectedEndpoint.path, {
        method: selectedEndpoint.method,
        headers: { "Content-Type": "application/json" },
        body: isPost ? JSON.stringify(parsedBody) : undefined,
      });

      const elapsed = Math.round(performance.now() - start);
      const data = await res.json();
      const formatted = JSON.stringify(data, null, 2);
      const sizeKb = Number((new Blob([formatted]).size / 1024).toFixed(1));

      setExecutionStats({
        status: res.status,
        timeMs: elapsed,
        sizeKb,
      });
      setResponseOutput(formatted);
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - start);
      const errorJson = JSON.stringify(
        {
          success: false,
          error: err.message || "Failed to execute request.",
          hint: "Ensure the JSON request payload has valid syntax.",
        },
        null,
        2
      );
      setExecutionStats({
        status: 500,
        timeMs: elapsed,
        sizeKb: Number((new Blob([errorJson]).size / 1024).toFixed(1)),
      });
      setResponseOutput(errorJson);
    } finally {
      setTesting(false);
    }
  };

  const originUrl = typeof window !== "undefined" ? window.location.origin : "https://seoseite.com";

  const getCurlCode = () => {
    if (selectedEndpoint.method === "GET") {
      const params = new URLSearchParams(selectedEndpoint.requestBody).toString();
      const query = params ? `?${params}` : "";
      return `curl -X GET "${originUrl}${selectedEndpoint.path}${query}" \\
  -H "Accept: application/json"`;
    }
    const cleanPayload = requestInput.replace(/\n\s*/g, " ");
    return `curl -X POST "${originUrl}${selectedEndpoint.path}" \\
  -H "Content-Type: application/json" \\
  -d '${cleanPayload}'`;
  };

  const getFetchCode = () => {
    return `// JavaScript (ESM Fetch)
const response = await fetch("${originUrl}${selectedEndpoint.path}", {
  method: "${selectedEndpoint.method}",
  headers: {
    "Content-Type": "application/json",
    // "Authorization": "Bearer YOUR_API_KEY",
  },
  body: JSON.stringify(${requestInput.replace(/\n/g, "\n  ")})
});

const data = await response.json();
console.log(data);`;
  };

  const getTypeScriptCode = () => {
    return `// TypeScript SDK / Axios
import axios from "axios";

interface ApiResponse {
  success: boolean;
  [key: string]: unknown;
}

const client = axios.create({
  baseURL: "${originUrl}",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

async function runAudit() {
  const payload = ${requestInput.replace(/\n/g, "\n  ")};
  const { data } = await client.${selectedEndpoint.method.toLowerCase()}<ApiResponse>(
    "${selectedEndpoint.path}",
    payload
  );
  return data;
}

runAudit().then(console.log).catch(console.error);`;
  };

  const getPythonCode = () => {
    const pyPayload = requestInput
      .replace(/: true/g, ": True")
      .replace(/: false/g, ": False")
      .replace(/: null/g, ": None");

    return `# Python 3.10+ (requests)
import requests

url = "${originUrl}${selectedEndpoint.path}"
payload = ${pyPayload}

headers = {
    "Content-Type": "application/json",
    # "Authorization": "Bearer YOUR_API_KEY",
}

response = requests.${selectedEndpoint.method.toLowerCase()}(url, json=payload, headers=headers, timeout=15)
print(response.status_code)
print(response.json())`;
  };

  const handleCopyCode = () => {
    let snippet = "";
    if (activeTab === "curl") snippet = getCurlCode();
    else if (activeTab === "fetch") snippet = getFetchCode();
    else if (activeTab === "typescript") snippet = getTypeScriptCode();
    else snippet = getPythonCode();

    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleCopyResponse = () => {
    if (!responseOutput) return;
    navigator.clipboard.writeText(responseOutput);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  // Generate and download standard OpenAPI 3.1.0 JSON file in browser
  const handleDownloadOpenApi = () => {
    const pathsObj: Record<string, any> = {};

    ENDPOINTS.forEach((ep) => {
      pathsObj[ep.path] = {
        [ep.method.toLowerCase()]: {
          summary: ep.name,
          description: ep.description,
          tags: [ep.categoryLabel],
          operationId: ep.id,
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { type: "object", example: ep.requestBody },
              },
            },
          },
          responses: {
            "200": {
              description: "Successful deterministic execution response",
              content: {
                "application/json": {
                  schema: { type: "object", example: ep.responseExample },
                },
              },
            },
            "400": { description: "Invalid request parameters or payload" },
            "403": { description: "SSRF security exception or tier restriction" },
          },
        },
      };
    });

    const openApiSpec = {
      openapi: "3.1.0",
      info: {
        title: "SeoSeite Developer Intelligence API",
        version: "2.1.0",
        description:
          "Deterministic technical SEO health audits, Core Web Vitals, competitor benchmarks, tech stack detection, and Model Context Protocol integrations.",
      },
      servers: [{ url: originUrl, description: "Active Gateway Environment" }],
      paths: pathsObj,
    };

    const blob = new Blob([JSON.stringify(openApiSpec, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "seoseite-openapi.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* 1. DEVELOPER PLATFORM COCKPIT & HERO */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 text-white p-6 sm:p-10 shadow-xl">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold shadow-inner">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span>SeoSeite Developer REST &amp; Webhooks Platform</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                v2.1
              </span>
              <span className="text-[10px] text-blue-300 font-mono">OpenAPI 3.1</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Deterministic SEO Intelligence via REST API
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl mx-auto">
              Programmatically query 0-100 technical SEO scores, benchmark competitors, audit Core Web Vitals, discover broken links, and dispatch real-time webhook alerts. Built with SSRF shields and sub-100ms response guarantees.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
              <button
                onClick={() => playgroundRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Launch Interactive Explorer</span>
              </button>

              <button
                onClick={handleDownloadOpenApi}
                className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-xs inline-flex items-center gap-2 transition-all cursor-pointer"
                title="Download OpenAPI 3.1 JSON for Postman or Swagger"
              >
                <Download className="w-4 h-4 text-slate-400" />
                <span>Download OpenAPI Spec</span>
              </button>

              <Link
                href="/mcp"
                className="px-4 py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 font-semibold text-xs inline-flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Explore MCP AI Server â†’</span>
              </Link>
            </div>

            {/* 4 Telemetry Metrics */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-800/80 text-left">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Server Gateway
                </div>
                <div className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online / 200 OK</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Active Services
                </div>
                <div className="text-xs sm:text-sm font-bold text-white font-mono">
                  {ENDPOINTS.length} Endpoints
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Your Account Tier
                </div>
                <div className="text-xs sm:text-sm font-bold text-blue-400 capitalize">
                  {formatTierName(activeTier)}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Security Guard
                </div>
                <div className="text-xs sm:text-sm font-bold text-indigo-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>SSRF Hardened</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. MAIN WORKSPACE: ENDPOINT CATALOG & INTERACTIVE STUDIO */}
        <div ref={playgroundRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Endpoints Directory (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl p-5 bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Endpoints ({filteredEndpoints.length})
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                  Base: /api/*
                </span>
              </div>

              {/* Live Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter by endpoint, route, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-8.5 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {CATEGORIES.map((cat) => {
                  const isSelected = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        isSelected
                          ? "bg-slate-900 text-white shadow-2xs"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Endpoint List */}
              <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1">
                {filteredEndpoints.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    No matching endpoints found for &ldquo;{searchQuery}&rdquo;.
                  </div>
                ) : (
                  filteredEndpoints.map((ep) => {
                    const isSelected = selectedEndpoint.id === ep.id;
                    return (
                      <button
                        key={ep.id}
                        onClick={() => handleSelectEndpoint(ep)}
                        className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer group ${
                          isSelected
                            ? "bg-blue-50/70 border-blue-500 ring-1 ring-blue-500/20 shadow-xs"
                            : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-md ${
                                ep.method === "POST"
                                  ? "bg-blue-600 text-white"
                                  : "bg-emerald-600 text-white"
                              }`}
                            >
                              {ep.method}
                            </span>
                            <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {ep.path}
                            </span>
                          </div>

                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                            {ep.category}
                          </span>
                        </div>

                        <div className="text-xs text-slate-700 font-semibold line-clamp-1">
                          {ep.name}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {ep.description}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Quick Authentication Card */}
            <div className="rounded-2xl p-5 bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wide">
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                <span>API Authentication &amp; Headers</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Requests are authenticated via HTTP Bearer token or account session cookie. Pass your key in the header:
              </p>
              <pre className="p-2.5 rounded-lg bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto">
                Authorization: Bearer sec_live_99f3...
              </pre>
            </div>
          </div>

          {/* Right Column: Code Snippet & Live Interactive Explorer (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Endpoint Header Card */}
            <div className="rounded-2xl p-6 bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-xs font-mono font-black px-2.5 py-1 rounded-lg ${
                      selectedEndpoint.method === "POST"
                        ? "bg-blue-600 text-white"
                        : "bg-emerald-600 text-white"
                    }`}
                  >
                    {selectedEndpoint.method}
                  </span>
                  <span className="text-base sm:text-lg font-mono font-bold text-slate-900">
                    {selectedEndpoint.path}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    Tier:{" "}
                    <strong className="capitalize text-slate-900">
                      {selectedEndpoint.tierRequired}
                    </strong>
                  </span>
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Verified
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {selectedEndpoint.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedEndpoint.description}
                </p>
              </div>

              {/* Code Snippet Tabs */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    {(["curl", "fetch", "typescript", "python"] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setActiveTab(lang)}
                        className={`text-xs font-semibold px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          activeTab === lang
                            ? "bg-white text-slate-900 shadow-2xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {lang === "curl" && "cURL"}
                        {lang === "fetch" && "JavaScript"}
                        {lang === "typescript" && "TypeScript"}
                        {lang === "python" && "Python"}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
                  >
                    {copiedSnippet ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Snippet</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
                  {activeTab === "curl" && getCurlCode()}
                  {activeTab === "fetch" && getFetchCode()}
                  {activeTab === "typescript" && getTypeScriptCode()}
                  {activeTab === "python" && getPythonCode()}
                </pre>
              </div>
            </div>

            {/* 2. Interactive Request Tester & Live Response */}
            <div className="rounded-2xl p-6 bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Request JSON Body
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetPayload}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-900 px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                    title="Reset to sample payload"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>

                  <button
                    onClick={handleRunTest}
                    disabled={testing}
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-all shadow-xs disabled:opacity-50"
                  >
                    {testing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Executing...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Send Request Live</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <textarea
                rows={5}
                value={requestInput}
                onChange={(e) => setRequestInput(e.target.value)}
                className="w-full font-mono text-xs p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 text-slate-900 leading-relaxed"
                placeholder="{ ... }"
              />

              {/* Response Inspector */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Response Console
                    </span>
                    {executionStats && (
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            executionStats.status >= 200 && executionStats.status < 300
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          HTTP {executionStats.status}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{executionStats.timeMs}ms</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                          {executionStats.sizeKb} KB
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleCopyResponse}
                    disabled={!responseOutput && !selectedEndpoint.responseExample}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    {copiedResponse ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-400" />
                        <span>Copy Output</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed max-h-96 border border-slate-800 shadow-inner">
                  {responseOutput ||
                    JSON.stringify(selectedEndpoint.responseExample, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* 3. PRODUCTION RATE LIMITS & SECURITY COMPLIANCE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-2xl p-6 bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Deterministic Throughput</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">Tier Concurrency Limits</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Free:</strong> 10 calls/min. <strong>Pro Analyst:</strong> 60 calls/min. <strong>Enterprise:</strong> 500+ calls/min with dedicated IP pools and uncapped batch bursts.
            </p>
          </div>

          <div className="rounded-2xl p-6 bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>SSRF &amp; Rebinding Shield</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">Enterprise Network Safety</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              All target URLs pass DNS resolution validation to block RFC 1918 private subnets, loopbacks, AWS/GCP metadata endpoints (169.254.169.254), and port spoofing.
            </p>
          </div>

          <div className="rounded-2xl p-6 bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Native AI &amp; MCP Integration</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">Standard MCP Protocol</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every REST capability is mirrored to our Model Context Protocol JSON-RPC gateway at <code>/api/mcp</code> for Anthropic Claude Desktop, Cursor, and autonomous agents.
            </p>
          </div>
        </div>

        {/* 4. FOOTER BANNER */}
        <div className="rounded-2xl p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between flex-wrap gap-4 shadow-lg">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-semibold">
              <Sparkles className="w-3 h-3" /> Ready for High-Volume Ingestion
            </div>
            <h3 className="text-base font-bold">Need custom rate limits or private webhook integrations?</h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Integrate SeoSeite into your enterprise CI/CD pipeline or custom microservices to catch technical SEO regressions automatically before every production release.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadOpenApi}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-sm cursor-pointer border border-slate-700"
            >
              <Download className="w-3.5 h-3.5 text-slate-300" />
              <span>OpenAPI 3.1 JSON</span>
            </button>

            <Link
              href="/pricing"
              className="px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span>View Enterprise Plans</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
