"use client";

import { useState } from "react";
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
} from "lucide-react";
import { usePlan } from "@/lib/auth/PlanContext";
import { formatTierName } from "@/lib/auth/tierLimits";

interface ApiEndpoint {
  id: string;
  name: string;
  category: "audit" | "competitive" | "bulk" | "ai" | "mcp" | "webhooks";
  method: "POST" | "GET";
  path: string;
  description: string;
  tierRequired: "free" | "starter" | "pro" | "enterprise";
  requestBody: Record<string, any>;
  responseExample: Record<string, any>;
}

const ENDPOINTS: ApiEndpoint[] = [
  {
    id: "analyze",
    name: "Run Full Technical SEO Audit",
    category: "audit",
    method: "POST",
    path: "/api/analyze",
    description: "Executes a sub-second, deterministic technical SEO health audit across metadata, DOM hierarchy, security headers, tech stack, and PageSpeed.",
    tierRequired: "free",
    requestBody: {
      url: "https://stripe.com",
    },
    responseExample: {
      success: true,
      url: "https://stripe.com",
      overallScore: 92,
      grade: "A",
      responseTimeMs: 64,
      categories: {
        metadata: 24,
        content: 25,
        indexability: 23,
        security: 20,
      },
      diagnosticsCount: 22,
      technologiesCount: 8,
    },
  },
  {
    id: "compare",
    name: "Head-to-Head Competitor Compare",
    category: "competitive",
    method: "POST",
    path: "/api/compare",
    description: "Audits two websites simultaneously to compare SEO health, response latency, tech stacks, and differential score deltas.",
    tierRequired: "pro",
    requestBody: {
      urlA: "https://vercel.com",
      urlB: "https://netlify.com",
    },
    responseExample: {
      success: true,
      siteA: { domain: "vercel.com", score: 88 },
      siteB: { domain: "netlify.com", score: 82 },
      diff: { seoDiff: 6, responseTimeDiffMs: -18 },
      winner: "vercel.com",
    },
  },
  {
    id: "content-gap",
    name: "Semantic Content Gap & Keyword Matrix",
    category: "competitive",
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
        { domain: "stripe.com", seoScore: 92, grade: "A", responseTimeMs: 64 },
        { domain: "vercel.com", seoScore: 88, grade: "B", responseTimeMs: 82 },
      ],
    },
  },
  {
    id: "brand-radar",
    name: "Brand Radar AI (AEO Share of Voice)",
    category: "ai",
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
    name: "Model Context Protocol (JSON-RPC 2.0)",
    category: "mcp",
    method: "POST",
    path: "/api/mcp",
    description: "Standard JSON-RPC 2.0 MCP gateway for Claude Desktop, Cursor IDE, and autonomous agents.",
    tierRequired: "enterprise",
    requestBody: {
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: "seoseite_audit_url",
        arguments: { url: "https://linear.app" },
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
    id: "crawler-links",
    name: "404 Broken Link & Redirect Discovery",
    category: "audit",
    method: "POST",
    path: "/api/crawler/links",
    description: "Extracts all on-page internal and external hyperlinks, crawls status codes, and identifies 404 dead links.",
    tierRequired: "free",
    requestBody: {
      url: "https://example.com",
    },
    responseExample: {
      success: true,
      totalLinks: 34,
      brokenCount: 1,
      links: [{ url: "https://example.com/broken", status: 404, isInternal: true }],
    },
  },
  {
    id: "webhook-test",
    name: "Alert Webhook Dispatcher",
    category: "webhooks",
    method: "POST",
    path: "/api/webhook/test",
    description: "Dispatches formatted SEO drop notification payloads to Slack, Discord, Zapier, or HTTP webhook endpoints.",
    tierRequired: "enterprise",
    requestBody: {
      webhookUrl: "https://hooks.slack.com/services/...",
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

export default function ApiDocsClient() {
  const { tier: activeTier } = usePlan();
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(ENDPOINTS[0]);
  const [requestInput, setRequestInput] = useState<string>(
    JSON.stringify(ENDPOINTS[0].requestBody, null, 2)
  );
  const [activeTab, setActiveTab] = useState<"curl" | "fetch" | "python">("curl");
  const [testing, setTesting] = useState(false);
  const [responseOutput, setResponseOutput] = useState<string | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const handleSelectEndpoint = (ep: ApiEndpoint) => {
    setSelectedEndpoint(ep);
    setRequestInput(JSON.stringify(ep.requestBody, null, 2));
    setResponseOutput(null);
  };

  const handleRunTest = async () => {
    setTesting(true);
    setResponseOutput(null);
    try {
      const parsedBody = JSON.parse(requestInput);
      const res = await fetch(selectedEndpoint.path, {
        method: selectedEndpoint.method,
        headers: { "Content-Type": "application/json" },
        body: selectedEndpoint.method === "POST" ? JSON.stringify(parsedBody) : undefined,
      });
      const data = await res.json();
      setResponseOutput(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setResponseOutput(
        JSON.stringify(
          {
            error: err.message || "Failed to execute request.",
            note: "Ensure valid JSON body is supplied.",
          },
          null,
          2
        )
      );
    } finally {
      setTesting(false);
    }
  };

  const getCurlCode = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://seoseite.com";
    if (selectedEndpoint.method === "GET") {
      return `curl -X GET "${origin}${selectedEndpoint.path}"`;
    }
    return `curl -X POST "${origin}${selectedEndpoint.path}" \\
  -H "Content-Type: application/json" \\
  -d '${requestInput.replace(/\n\s*/g, " ")}'`;
  };

  const getFetchCode = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://seoseite.com";
    return `const response = await fetch("${origin}${selectedEndpoint.path}", {
  method: "${selectedEndpoint.method}",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(${requestInput.replace(/\n/g, "\n  ")})
});
const data = await response.json();
console.log(data);`;
  };

  const getPythonCode = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://seoseite.com";
    return `import requests

url = "${origin}${selectedEndpoint.path}"
payload = ${requestInput.replace(/: true/g, ": True").replace(/: false/g, ": False")}

response = requests.post(url, json=payload)
print(response.json())`;
  };

  const handleCopyCode = () => {
    let snippet = "";
    if (activeTab === "curl") snippet = getCurlCode();
    else if (activeTab === "fetch") snippet = getFetchCode();
    else snippet = getPythonCode();

    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="mb-10 pb-8 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <Terminal className="w-3.5 h-3.5" />
            SeoSeite Developer Platform
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Your Active Tier:</span>
            <span className="font-bold text-slate-900 capitalize px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
              {formatTierName(activeTier)}
            </span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Developer REST API &amp; Webhooks Reference
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed">
          Programmatically query technical SEO health scores, execute competitor benchmarks, run batch audits, and dispatch webhook alerts. Fully typed JSON responses with deterministic guarantees.
        </p>

        {/* Global Architecture Pills */}
        <div className="flex flex-wrap items-center gap-3 mt-6 text-xs text-slate-600">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 font-mono text-[11px]">
            Base URL: <span className="font-bold text-slate-900">/api/*</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 font-mono text-[11px]">
            Format: <span className="font-bold text-slate-900">application/json</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            SSRF &amp; DNS Rebinding Guard Active
          </div>
          <Link
            href="/mcp"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 font-semibold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Explore SEO MCP Server →
          </Link>
        </div>
      </div>

      {/* Main Grid: Endpoint Sidebar + Interactive Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Endpoints Index */}
        <div className="lg:col-span-4 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Endpoint Directory ({ENDPOINTS.length})
          </div>

          <div className="space-y-2">
            {ENDPOINTS.map((ep) => {
              const isSelected = selectedEndpoint.id === ep.id;
              return (
                <button
                  key={ep.id}
                  onClick={() => handleSelectEndpoint(ep)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-50/50 border-blue-600 ring-1 ring-blue-600/20 shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        ep.method === "POST"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      {ep.category}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 mb-1">{ep.name}</div>
                  <div className="text-[11px] font-mono text-slate-500 truncate">{ep.path}</div>
                </button>
              );
            })}
          </div>

          <div className="flat-card p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-600">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-blue-600" />
              Automated CI/CD Integration
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Run <code className="bg-white px-1 py-0.5 rounded border border-slate-200 font-mono">/api/analyze</code> inside GitHub Actions or GitLab pipelines to enforce SEO score thresholds before deploying production releases.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Explorer */}
        <div className="lg:col-span-8 space-y-6">
          {/* Endpoint Details Card */}
          <div className="flat-card p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-black px-2 py-1 rounded bg-blue-600 text-white">
                  {selectedEndpoint.method}
                </span>
                <span className="text-sm sm:text-base font-mono font-bold text-slate-900">
                  {selectedEndpoint.path}
                </span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Tier: <span className="capitalize text-slate-900 font-bold">{selectedEndpoint.tierRequired}</span>
              </span>
            </div>

            <h2 className="text-lg font-bold text-slate-900 mb-2">{selectedEndpoint.name}</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              {selectedEndpoint.description}
            </p>

            {/* Code Snippets & Language Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  {(["curl", "fetch", "python"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveTab(lang)}
                      className={`text-xs font-semibold px-3 py-1 rounded-md transition-all cursor-pointer ${
                        activeTab === lang
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {lang === "curl" && "cURL"}
                      {lang === "fetch" && "JavaScript (fetch)"}
                      {lang === "python" && "Python (requests)"}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
                >
                  {copiedSnippet ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed">
                {activeTab === "curl" && getCurlCode()}
                {activeTab === "fetch" && getFetchCode()}
                {activeTab === "python" && getPythonCode()}
              </pre>
            </div>
          </div>

          {/* Interactive Request Body & Test Runner */}
          <div className="flat-card p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Request JSON Payload
              </div>
              <button
                onClick={handleRunTest}
                disabled={testing}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-colors disabled:opacity-50"
              >
                {testing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Test Endpoint in Browser</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              rows={6}
              value={requestInput}
              onChange={(e) => setRequestInput(e.target.value)}
              className="w-full font-mono text-xs p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50"
            />

            {/* Live Response Output */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Response Payload {responseOutput ? "(Live Response)" : "(Example Schema)"}
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed max-h-96">
                {responseOutput || JSON.stringify(selectedEndpoint.responseExample, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
