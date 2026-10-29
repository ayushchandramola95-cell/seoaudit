"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Cpu,
  Terminal,
  Copy,
  Check,
  Play,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Zap,
  Globe,
  GitCompare,
  Code2,
  FileCode,
  Layers,
  ChevronRight,
  ExternalLink,
  Bot,
  RefreshCw,
  Info,
  Lock,
  ShieldAlert,
  Search,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Network,
  Activity,
  Sliders,
} from "lucide-react";
import { usePlan } from "@/lib/auth/PlanContext";

interface ToolOption {
  id: string;
  name: string;
  category: "crawling" | "performance" | "search" | "security";
  categoryLabel: string;
  description: string;
  icon: any;
  defaultParams: Record<string, any>;
  paramFields: { key: string; label: string; placeholder: string; type: string }[];
}

const MCP_TOOLS: ToolOption[] = [
  {
    id: "seoseite_audit_url",
    name: "seoseite_audit_url",
    category: "crawling",
    categoryLabel: "Auditing & Health",
    description: "Runs full deterministic 0-100 technical SEO health audit, scoring, CWV, and AI developer action items.",
    icon: ShieldCheck,
    defaultParams: { url: "https://example.com" },
    paramFields: [
      { key: "url", label: "Target Website URL", placeholder: "https://example.com", type: "text" },
    ],
  },
  {
    id: "seoseite_compare_domains",
    name: "seoseite_compare_domains",
    category: "crawling",
    categoryLabel: "Auditing & Health",
    description: "Head-to-head comparison of two domains for SEO score, speed, tech stack, and keyword gaps.",
    icon: GitCompare,
    defaultParams: { urlA: "https://stripe.com", urlB: "https://paypal.com" },
    paramFields: [
      { key: "urlA", label: "Primary URL (A)", placeholder: "https://stripe.com", type: "text" },
      { key: "urlB", label: "Competitor URL (B)", placeholder: "https://paypal.com", type: "text" },
    ],
  },
  {
    id: "seoseite_check_broken_links",
    name: "seoseite_check_broken_links",
    category: "crawling",
    categoryLabel: "Auditing & Health",
    description: "Crawls a website to detect internal and external 404 dead links, broken anchors, and redirect status codes.",
    icon: Layers,
    defaultParams: { url: "https://example.com", maxLinks: 20 },
    paramFields: [
      { key: "url", label: "Website URL", placeholder: "https://example.com", type: "text" },
      { key: "maxLinks", label: "Max Links to Crawl", placeholder: "20", type: "number" },
    ],
  },
  {
    id: "seoseite_document_architecture",
    name: "seoseite_document_architecture",
    category: "crawling",
    categoryLabel: "Auditing & Health",
    description: "Extracts full H1-H6 heading hierarchy, detects structural defects (missing H1, skipped levels), and outline score.",
    icon: FileText,
    defaultParams: { url: "https://example.com" },
    paramFields: [
      { key: "url", label: "Target URL", placeholder: "https://example.com", type: "text" },
    ],
  },
  {
    id: "seoseite_speed_lab",
    name: "seoseite_speed_lab",
    category: "performance",
    categoryLabel: "Performance & Tech",
    description: "Evaluates Core Web Vitals (FCP, LCP, CLS) and Google PageSpeed lab diagnostics.",
    icon: Zap,
    defaultParams: { url: "https://example.com" },
    paramFields: [
      { key: "url", label: "Target URL", placeholder: "https://example.com", type: "text" },
    ],
  },
  {
    id: "seoseite_detect_tech",
    name: "seoseite_detect_tech",
    category: "performance",
    categoryLabel: "Performance & Tech",
    description: "Identifies CMS, frontend frameworks, analytics, CDN, server software, and typography signatures.",
    icon: Cpu,
    defaultParams: { url: "https://example.com" },
    paramFields: [
      { key: "url", label: "Target URL", placeholder: "https://example.com", type: "text" },
    ],
  },
  {
    id: "seoseite_security_headers",
    name: "seoseite_security_headers",
    category: "security",
    categoryLabel: "Security & Guard",
    description: "Evaluates 8+ critical HTTP security headers (HSTS, CSP, X-Frame-Options, XCTO, Referrer, Permissions) and SSL.",
    icon: Lock,
    defaultParams: { url: "https://stripe.com" },
    paramFields: [
      { key: "url", label: "Target URL", placeholder: "https://stripe.com", type: "text" },
    ],
  },
  {
    id: "seoseite_validate_schema",
    name: "seoseite_validate_schema",
    category: "search",
    categoryLabel: "Search & Metadata",
    description: "Inspects Schema.org JSON-LD microdata, Open Graph tags, and Twitter Cards.",
    icon: Code2,
    defaultParams: { url: "https://example.com" },
    paramFields: [
      { key: "url", label: "Target URL", placeholder: "https://example.com", type: "text" },
    ],
  },
  {
    id: "seoseite_check_authority",
    name: "seoseite_check_authority",
    category: "search",
    categoryLabel: "Search & Metadata",
    description: "Queries DomCop Open PageRank decimal score (0-10) and global rank index.",
    icon: Globe,
    defaultParams: { domain: "github.com" },
    paramFields: [
      { key: "domain", label: "Domain or Host", placeholder: "github.com", type: "text" },
    ],
  },
  {
    id: "seoseite_serp_preview",
    name: "seoseite_serp_preview",
    category: "search",
    categoryLabel: "Search & Metadata",
    description: "Simulates Google desktop/mobile snippets, calculates title pixel width against 580px limit, and organic CTR score.",
    icon: Search,
    defaultParams: { url: "https://example.com" },
    paramFields: [
      { key: "url", label: "Target URL", placeholder: "https://example.com", type: "text" },
    ],
  },
  {
    id: "seoseite_brand_radar",
    name: "seoseite_brand_radar",
    category: "search",
    categoryLabel: "Search & Metadata",
    description: "Evaluates brand visibility and AEO (Answer Engine Optimization) readiness across LLMs (ChatGPT, Perplexity, Gemini, Claude).",
    icon: Radio,
    defaultParams: { domain: "linear.app" },
    paramFields: [
      { key: "domain", label: "Brand Domain", placeholder: "linear.app", type: "text" },
    ],
  },
];

const PRESET_DOMAINS = [
  { label: "stripe.com", url: "https://stripe.com", domain: "stripe.com" },
  { label: "linear.app", url: "https://linear.app", domain: "linear.app" },
  { label: "github.com", url: "https://github.com", domain: "github.com" },
  { label: "vercel.com", url: "https://vercel.com", domain: "vercel.com" },
  { label: "example.com", url: "https://example.com", domain: "example.com" },
];

const PROMPT_TEMPLATES = [
  {
    title: "Instant Technical Audit",
    prompt: "Audit https://stripe.com using SeoSeite and identify their top 3 critical SEO bottlenecks.",
    toolId: "seoseite_audit_url",
    params: { url: "https://stripe.com" },
  },
  {
    title: "Competitor Benchmark",
    prompt: "Compare vercel.com against netlify.com using SeoSeite. Who has faster Core Web Vitals and higher SEO score?",
    toolId: "seoseite_compare_domains",
    params: { urlA: "https://vercel.com", urlB: "https://netlify.com" },
  },
  {
    title: "Audit Security Headers",
    prompt: "Inspect security headers for https://stripe.com. Is HSTS and Content-Security-Policy configured properly?",
    toolId: "seoseite_security_headers",
    params: { url: "https://stripe.com" },
  },
  {
    title: "Check Heading Architecture",
    prompt: "Extract the heading tree for https://example.com. Are there any missing H1 tags or skipped levels?",
    toolId: "seoseite_document_architecture",
    params: { url: "https://example.com" },
  },
  {
    title: "Google SERP Simulation",
    prompt: "Simulate how https://linear.app looks on Google Search. Will the title get truncated on desktop or mobile?",
    toolId: "seoseite_serp_preview",
    params: { url: "https://linear.app" },
  },
  {
    title: "Brand Radar AI Visibility",
    prompt: "Evaluate linear.app for AEO search visibility. What conversational queries trigger citations in ChatGPT and Perplexity?",
    toolId: "seoseite_brand_radar",
    params: { domain: "linear.app" },
  },
  {
    title: "Find 404 Dead Links",
    prompt: "Crawl https://example.com for broken links with SeoSeite and generate a markdown table of errors.",
    toolId: "seoseite_check_broken_links",
    params: { url: "https://example.com", maxLinks: 20 },
  },
  {
    title: "Inspect Tech Stack",
    prompt: "What CMS, JavaScript frameworks, CDN, and hosting does linear.app use according to SeoSeite?",
    toolId: "seoseite_detect_tech",
    params: { url: "https://linear.app" },
  },
];

export default function McpClient() {
  const { tier } = usePlan();
  const [selectedToolId, setSelectedToolId] = useState<string>("seoseite_audit_url");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [params, setParams] = useState<Record<string, any>>(MCP_TOOLS[0].defaultParams);
  const [activeConfigTab, setActiveConfigTab] = useState<"cursor" | "claude" | "windsurf" | "antigravity" | "http" | "sdk">("cursor");
  const [outputTab, setOutputTab] = useState<"visual" | "json" | "request">("visual");

  const [testing, setTesting] = useState(false);
  const [responseOutput, setResponseOutput] = useState<any | null>(null);
  const [rawTextOutput, setRawTextOutput] = useState<string | null>(null);
  const [parsedToolContent, setParsedToolContent] = useState<any | null>(null);
  const [executionTimingMs, setExecutionTimingMs] = useState<number | null>(null);
  const [executionStatus, setExecutionStatus] = useState<number | null>(null);

  // Health ping state
  const [pinging, setPinging] = useState(false);
  const [pingResult, setPingResult] = useState<{ status: string; latencyMs: number; toolsCount: number } | null>(null);

  // Copy states
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [copiedPromptIdx, setCopiedPromptIdx] = useState<number | null>(null);

  const playgroundRef = useRef<HTMLDivElement>(null);

  const selectedTool = useMemo(
    () => MCP_TOOLS.find((t) => t.id === selectedToolId) || MCP_TOOLS[0],
    [selectedToolId]
  );

  const filteredTools = useMemo(() => {
    if (categoryFilter === "all") return MCP_TOOLS;
    return MCP_TOOLS.filter((t) => t.category === categoryFilter);
  }, [categoryFilter]);

  // Initial health ping on load
  useEffect(() => {
    runHealthPing();
  }, []);

  const runHealthPing = async () => {
    setPinging(true);
    const start = performance.now();
    try {
      const res = await fetch("/api/mcp", { method: "GET" });
      const duration = Math.round(performance.now() - start);
      if (res.ok) {
        const data = await res.json();
        setPingResult({
          status: "healthy",
          latencyMs: duration,
          toolsCount: data.toolsAvailable || MCP_TOOLS.length,
        });
      } else {
        setPingResult({ status: "error", latencyMs: duration, toolsCount: 0 });
      }
    } catch {
      setPingResult({ status: "offline", latencyMs: 0, toolsCount: 0 });
    } finally {
      setPinging(false);
    }
  };

  const handleToolChange = (toolId: string) => {
    setSelectedToolId(toolId);
    const tool = MCP_TOOLS.find((t) => t.id === toolId);
    if (tool) {
      setParams(tool.defaultParams);
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_DOMAINS[0]) => {
    if (selectedTool.paramFields.some((f) => f.key === "url")) {
      setParams((prev) => ({ ...prev, url: preset.url }));
    } else if (selectedTool.paramFields.some((f) => f.key === "domain")) {
      setParams((prev) => ({ ...prev, domain: preset.domain }));
    } else if (selectedTool.paramFields.some((f) => f.key === "urlA")) {
      setParams((prev) => ({ ...prev, urlA: preset.url }));
    }
  };

  const handleExecuteTool = async () => {
    setTesting(true);
    setResponseOutput(null);
    setRawTextOutput(null);
    setParsedToolContent(null);
    setExecutionTimingMs(null);

    const startTime = performance.now();

    try {
      const payload = {
        jsonrpc: "2.0",
        id: Date.now(),
        method: "tools/call",
        params: {
          name: selectedTool.name,
          arguments: params,
        },
      };

      const res = await fetch("/api/mcp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const elapsed = Math.round(performance.now() - startTime);
      setExecutionTimingMs(elapsed);
      setExecutionStatus(res.status);

      const json = await res.json();
      setResponseOutput(json);
      setRawTextOutput(JSON.stringify(json, null, 2));

      // Attempt to parse tool text if structured JSON
      const rawText = json?.result?.content?.[0]?.text;
      if (rawText) {
        try {
          const parsed = JSON.parse(rawText);
          setParsedToolContent(parsed);
          setOutputTab("visual");
        } catch {
          setParsedToolContent(null);
          setOutputTab("json");
        }
      } else {
        setOutputTab("json");
      }
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - startTime);
      setExecutionTimingMs(elapsed);
      setExecutionStatus(500);
      const errObj = { error: err.message };
      setResponseOutput(errObj);
      setRawTextOutput(JSON.stringify(errObj, null, 2));
      setOutputTab("json");
    } finally {
      setTesting(false);
    }
  };

  const handleRunPrompt = (prompt: typeof PROMPT_TEMPLATES[0], idx: number) => {
    handleToolChange(prompt.toolId);
    setParams(prompt.params);
    playgroundRef.current?.scrollIntoView({ behavior: "smooth" });
    setCopiedPromptIdx(idx);
    setTimeout(() => {
      setCopiedPromptIdx(null);
    }, 2000);
  };

  // Configurations
  const originUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

  const cursorJson = JSON.stringify(
    {
      mcpServers: {
        seoseite: {
          command: "node",
          args: ["scripts/seoseite-mcp.mjs"],
          env: {
            SEOSEITE_API_URL: originUrl,
          },
        },
      },
    },
    null,
    2
  );

  const claudeDesktopJson = JSON.stringify(
    {
      mcpServers: {
        seoseite: {
          command: "node",
          args: ["C:/new website creation/seoseite/scripts/seoseite-mcp.mjs"],
          env: {
            SEOSEITE_API_URL: originUrl,
          },
        },
      },
    },
    null,
    2
  );

  const windsurfJson = JSON.stringify(
    {
      mcpServers: {
        seoseite: {
          command: "node",
          args: ["./scripts/seoseite-mcp.mjs"],
          env: {
            SEOSEITE_API_URL: originUrl,
          },
        },
      },
    },
    null,
    2
  );

  const antigravityJson = JSON.stringify(
    {
      mcpServers: {
        seoseite: {
          command: "node",
          args: ["C:/new website creation/seoseite/scripts/seoseite-mcp.mjs"],
          env: {
            SEOSEITE_API_URL: originUrl,
          },
        },
      },
    },
    null,
    2
  );

  const httpJsonRpcDoc = `// Standard JSON-RPC 2.0 HTTP POST Gateway
// Endpoint: ${originUrl}/api/mcp
// Headers: Content-Type: application/json

// 1. Initialize Handshake
curl -X POST ${originUrl}/api/mcp \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc": "2.0", "id": 1, "method": "initialize"}'

// 2. Discover All 11 Tools
curl -X POST ${originUrl}/api/mcp \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc": "2.0", "id": 2, "method": "tools/list"}'

// 3. Execute Tool (e.g. Audit URL)
curl -X POST ${originUrl}/api/mcp \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "seoseite_audit_url", "arguments": {"url": "https://stripe.com"}}}'`;

  const sdkCodeDoc = `import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// Connect to SeoSeite MCP via stdio transport
const transport = new StdioClientTransport({
  command: "node",
  args: ["scripts/seoseite-mcp.mjs"],
  env: { SEOSEITE_API_URL: "${originUrl}" },
});

const client = new Client({ name: "my-ai-agent", version: "1.0.0" }, { capabilities: {} });
await client.connect(transport);

// List all 11 SEO intelligence tools
const { tools } = await client.listTools();
console.log("Registered Tools:", tools.map(t => t.name));

// Call SEO health audit
const result = await client.callTool({
  name: "seoseite_audit_url",
  arguments: { url: "https://stripe.com" },
});
console.log("Audit Output:", result.content[0].text);`;

  const currentConfigSnippet =
    activeConfigTab === "cursor"
      ? cursorJson
      : activeConfigTab === "claude"
      ? claudeDesktopJson
      : activeConfigTab === "windsurf"
      ? windsurfJson
      : activeConfigTab === "antigravity"
      ? antigravityJson
      : activeConfigTab === "http"
      ? httpJsonRpcDoc
      : sdkCodeDoc;

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(currentConfigSnippet);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  const handleCopyResponse = () => {
    if (!rawTextOutput) return;
    navigator.clipboard.writeText(rawTextOutput);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  const handleCopyPrompt = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptIdx(idx);
    setTimeout(() => setCopiedPromptIdx(null), 2000);
  };

  // Generate current request JSON for inspect tab
  const currentRequestJson = JSON.stringify(
    {
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: selectedTool.name,
        arguments: params,
      },
    },
    null,
    2
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* 1. DOCKED STICKY SUBNAVBAR ON SCROLL */}
      <header className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          {/* Left: Engine Identity & Pulse Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-slate-900 font-mono tracking-tight hidden sm:inline">
                MCP Server (JSON-RPC 2.0)
              </span>
            </div>

            <div className="hidden md:flex items-center gap-1.5 pl-3 border-l border-slate-200 text-[11px] font-mono text-slate-600">
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                11 Active Engines
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                Stdio + HTTP
              </span>
              {pingResult && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-600" />
                  {pingResult.latencyMs}ms
                </span>
              )}
            </div>
          </div>

          {/* Right: Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={runHealthPing}
              disabled={pinging}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
              title="Ping endpoint to measure roundtrip latency"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${pinging ? "animate-spin text-blue-600" : "text-slate-500"}`} />
              <span className="hidden sm:inline">Health Ping</span>
            </button>

            <a
              href="#live-tester"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Playground</span>
            </a>

            <button
              onClick={() => {
                setActiveConfigTab("cursor");
                navigator.clipboard.writeText(cursorJson);
                setCopiedConfig(true);
                setTimeout(() => setCopiedConfig(false), 2000);
              }}
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors cursor-pointer"
            >
              {copiedConfig && activeConfigTab === "cursor" ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-500" />
              )}
              <span>Copy Cursor</span>
            </button>

            <a
              href="https://modelcontextprotocol.io"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 text-xs font-medium transition-colors"
            >
              <span>MCP Spec</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* 2. NIGHT-SKY OPERATIONS COCKPIT & HERO */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 text-white p-6 sm:p-10 shadow-xl">
          {/* Background Ambient Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold shadow-inner">
              <Bot className="w-4 h-4 text-blue-400" />
              <span>Model Context Protocol (MCP) Server</span>
              <span className="px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                v1.1.0
              </span>
              <span className="text-[10px] text-blue-300 font-mono">spec: 2024-11-05</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Supercharge AI Assistants with Deterministic SEO Intelligence
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl mx-auto">
              Connect <strong>Claude Desktop</strong>, <strong>Cursor IDE</strong>, <strong>Windsurf</strong>, or <strong>Antigravity</strong> directly to SEO Audit. Empower LLMs to audit websites, compare competitors, verify security headers, and inspect tech stacks without hallucinations.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
              <a
                href="#live-tester"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/30"
              >
                <Play className="w-4 h-4 fill-white" />
                Launch In-Browser Playground
              </a>
              <a
                href="#install-guide"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
              >
                <Terminal className="w-4 h-4 text-slate-300" />
                Client Setup Guide
              </a>
              <button
                onClick={runHealthPing}
                disabled={pinging}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-all cursor-pointer"
              >
                <Activity className={`w-4 h-4 ${pinging ? "animate-spin text-emerald-400" : "text-emerald-400"}`} />
                <span>Verify Handshake</span>
              </button>
            </div>

            {/* Live Telemetry Strip */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-800/80 text-left">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Server Gateway
                </span>
                <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  Active / 200 OK
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Roundtrip Latency
                </span>
                <div className="text-sm font-bold text-white font-mono mt-0.5">
                  {pingResult ? `${pingResult.latencyMs} ms (Localhost)` : "Measuring..."}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  MCP Registered Tools
                </span>
                <div className="text-sm font-bold text-blue-400 font-mono mt-0.5">
                  11 Dedicated Engines
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Data Accuracy
                </span>
                <div className="text-sm font-bold text-purple-400 font-mono mt-0.5">
                  100% Deterministic
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. FOUR CORE ARCHITECTURAL PILLARS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Zero AI Hallucination</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              LLMs cannot browse websites accurately. SeoSeite provides real DOM scraping, deterministic rule algorithms, Google PageSpeed lab scores, and DomCop Open PageRank.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center">
              <Network className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Dual-Transport Support</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Seamlessly supports local <code>stdio</code> communication for desktop IDEs, as well as remote <code>JSON-RPC 2.0 HTTP POST</code> gateways for webhooks and autonomous agents.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Standard MCP Protocol</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strictly compliant with Anthropic&apos;s open Model Context Protocol specification (<code>2024-11-05</code>). Works with Claude Desktop, Cursor, Windsurf, LangChain, and AutoGen.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Ahrefs Alternative</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ahrefs restricts MCP access to enterprise accounts ($999/mo). SeoSeite makes live programmatic SEO tool calling accessible for indie hackers, startups, and developers.
            </p>
          </div>
        </div>

        {/* 4. SECTION: IN-BROWSER MCP TESTER & PLAYGROUND */}
        <div ref={playgroundRef} id="live-tester" className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Play className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Interactive MCP Tool Playground</h2>
                <p className="text-xs text-slate-500">
                  Execute any of the 11 SeoSeite MCP tools in real-time over the JSON-RPC HTTP gateway (<code>POST /api/mcp</code>).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500">Gateway:</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px] border border-slate-200 font-semibold">
                POST /api/mcp
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold border border-emerald-200">
                JSON-RPC 2.0
              </span>
            </div>
          </div>

          {/* Category Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-slate-600 whitespace-nowrap mr-1">Filter Tools:</span>
            {[
              { id: "all", label: "All 11 Engines" },
              { id: "crawling", label: "Auditing & Architecture (4)" },
              { id: "performance", label: "Performance & Tech (2)" },
              { id: "security", label: "Security & Guard (1)" },
              { id: "search", label: "Search, Schema & AEO (4)" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  categoryFilter === cat.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Tool Selector Grid (All 11 Tools) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Select Tool to Test:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {filteredTools.map((t) => {
                const isSelected = t.id === selectedToolId;
                const ToolIcon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleToolChange(t.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-blue-50/80 border-blue-600 text-blue-950 font-bold shadow-xs ring-2 ring-blue-500/20"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <ToolIcon className={`w-4 h-4 ${isSelected ? "text-blue-600" : "text-slate-400"}`} />
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 uppercase">
                          {t.category}
                        </span>
                      </div>
                      <div className="text-xs font-mono font-bold leading-tight break-all">{t.name}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Tool Details & Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/80 p-5 rounded-2xl border border-slate-200">
            <div className="lg:col-span-5 space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                    {selectedTool.categoryLabel}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Method: tools/call</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                  {selectedTool.name}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {selectedTool.description}
                </p>
              </div>

              {/* Quick Preset Domains */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200">
                <span className="text-[11px] font-semibold text-slate-600">Quick Test Presets:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {PRESET_DOMAINS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="px-2 py-0.5 rounded-md bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 text-[11px] font-mono transition-colors cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Inputs */}
              <div className="space-y-3 pt-1">
                {selectedTool.paramFields.map((field) => (
                  <div key={field.key} className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                      <span>{field.label}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({field.key})</span>
                    </label>
                    <input
                      type={field.type}
                      value={params[field.key] ?? ""}
                      onChange={(e) =>
                        setParams({
                          ...params,
                          [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value,
                        })
                      }
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-2xs"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleExecuteTool}
                disabled={testing}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {testing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing Tool Call...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Execute MCP Tool Call</span>
                  </>
                )}
              </button>

              {executionTimingMs !== null && (
                <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] font-mono text-slate-600 flex items-center justify-between">
                  <span>Execution Latency:</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {executionTimingMs} ms ({executionStatus})
                  </span>
                </div>
              )}
            </div>

            {/* Response Payload Viewer (Dual Tab) */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                {/* View Tabs */}
                <div className="flex items-center gap-1 p-0.5 bg-slate-200/70 rounded-lg">
                  <button
                    onClick={() => setOutputTab("visual")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      outputTab === "visual" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Visual Summary
                  </button>
                  <button
                    onClick={() => setOutputTab("json")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      outputTab === "json" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    JSON Response
                  </button>
                  <button
                    onClick={() => setOutputTab("request")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      outputTab === "request" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Wire Request
                  </button>
                </div>

                {rawTextOutput && (
                  <button
                    onClick={handleCopyResponse}
                    className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200 transition-colors cursor-pointer shadow-2xs"
                  >
                    {copiedResponse ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-400" />
                    )}
                    <span>{copiedResponse ? "Copied" : "Copy JSON"}</span>
                  </button>
                )}
              </div>

              {/* View Output Window */}
              <div className="flex-1 bg-slate-950 rounded-xl p-4 text-slate-100 font-mono text-[11px] overflow-auto max-h-[460px] border border-slate-800 shadow-inner">
                {outputTab === "visual" && parsedToolContent && (
                  <div className="space-y-4 text-left">
                    {/* Top KPI Header */}
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase">Target Domain</span>
                        <div className="text-sm font-bold text-white">
                          {parsedToolContent.domain || parsedToolContent.brandDomain || "N/A"}
                        </div>
                      </div>
                      {parsedToolContent.overallScore !== undefined && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">Score:</span>
                          <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-xs">
                            {parsedToolContent.overallScore} / 100 ({parsedToolContent.grade})
                          </span>
                        </div>
                      )}
                      {parsedToolContent.securityScore !== undefined && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">Security:</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-xs">
                            {parsedToolContent.securityScore} / 100 ({parsedToolContent.grade})
                          </span>
                        </div>
                      )}
                      {parsedToolContent.architectureScore !== undefined && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">Headings:</span>
                          <span className="px-2 py-0.5 rounded bg-purple-600 text-white font-bold text-xs">
                            {parsedToolContent.architectureScore} / 100
                          </span>
                        </div>
                      )}
                      {parsedToolContent.aiVisibilityScore !== undefined && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">AI Visibility:</span>
                          <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-bold text-xs">
                            {parsedToolContent.aiVisibilityScore} / 100
                          </span>
                        </div>
                      )}
                      {parsedToolContent.pageRank !== undefined && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">PageRank:</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-xs">
                            {parsedToolContent.pageRank} / 10 ({parsedToolContent.rankFormatted})
                          </span>
                        </div>
                      )}
                    </div>

                    {/* AI Executive Summary if available */}
                    {parsedToolContent.aiExecutiveSummary && (
                      <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-900/60 text-blue-200 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-blue-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-blue-400" /> AI Executive Summary
                        </span>
                        <p className="text-xs leading-relaxed font-sans">{parsedToolContent.aiExecutiveSummary}</p>
                      </div>
                    )}

                    {/* Technologies */}
                    {parsedToolContent.technologies && Array.isArray(parsedToolContent.technologies) && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Detected Technologies:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {parsedToolContent.technologies.slice(0, 10).map((t: any, i: number) => {
                            const label = typeof t === "string" ? t : `${t.name} (${t.category})`;
                            return (
                              <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 text-[10px]">
                                {label}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Critical Issues */}
                    {parsedToolContent.criticalIssues && Array.isArray(parsedToolContent.criticalIssues) && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Detected Issues:</span>
                        <div className="space-y-1">
                          {parsedToolContent.criticalIssues.slice(0, 4).map((issue: any, i: number) => (
                            <div key={i} className="p-2 rounded bg-slate-900 border border-slate-800 flex items-start gap-2 text-[10px]">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-slate-200">{issue.check}</span>
                                <p className="text-slate-400 font-sans mt-0.5">{issue.recommendation}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Security Headers Breakdown */}
                    {parsedToolContent.headers && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Security Header Matrix:</span>
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          {Object.entries(parsedToolContent.headers).map(([key, val]: any) => (
                            <div key={key} className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                              <span className="text-slate-300 font-mono">{key}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${val.present ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-rose-950 text-rose-400 border border-rose-800"}`}>
                                {val.present ? "Configured" : "Missing"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Heading Hierarchy Breakdown */}
                    {parsedToolContent.headingCounts && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Headings Distribution:</span>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-[10px]">
                          {Object.entries(parsedToolContent.headingCounts).map(([tag, count]: any) => (
                            <div key={tag} className="p-2 rounded bg-slate-900 border border-slate-800">
                              <span className="text-slate-400 uppercase">{tag}</span>
                              <div className="text-sm font-bold text-white mt-0.5">{count}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Raw excerpt toggle */}
                    <div className="pt-2 border-t border-slate-800 flex justify-end">
                      <button
                        onClick={() => setOutputTab("json")}
                        className="text-[10px] text-blue-400 hover:text-blue-300 underline cursor-pointer"
                      >
                        Switch to full JSON view &rarr;
                      </button>
                    </div>
                  </div>
                )}

                {outputTab === "visual" && !parsedToolContent && rawTextOutput && (
                  <pre className="whitespace-pre-wrap leading-relaxed">{rawTextOutput}</pre>
                )}

                {outputTab === "json" && (
                  rawTextOutput ? (
                    <pre className="whitespace-pre-wrap leading-relaxed">{rawTextOutput}</pre>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 py-16 text-center">
                      <Terminal className="w-8 h-8 mb-2 opacity-50" />
                      <p className="text-xs font-mono">No execution yet.</p>
                      <p className="text-[11px] text-slate-600 max-w-xs mt-1">
                        Click &ldquo;Execute MCP Tool Call&rdquo; to test the endpoint live and inspect the JSON response.
                      </p>
                    </div>
                  )
                )}

                {outputTab === "request" && (
                  <pre className="whitespace-pre-wrap leading-relaxed text-blue-300">{currentRequestJson}</pre>
                )}

                {!rawTextOutput && outputTab !== "request" && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 py-16 text-center">
                    <Terminal className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-xs font-mono">No execution yet.</p>
                    <p className="text-[11px] text-slate-600 max-w-xs mt-1">
                      Click &ldquo;Execute MCP Tool Call&rdquo; to test the endpoint live and inspect the JSON response.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 5. SECTION: CLIENT INSTALLATION & INTEGRATION GUIDES */}
        <div id="install-guide" className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <Terminal className="w-5 h-5 text-slate-200" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">IDE &amp; Desktop Integration Guide</h2>
                <p className="text-xs text-slate-500">
                  Copy and paste the configuration block directly into your favorite AI developer client.
                </p>
              </div>
            </div>

            {/* Client Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 flex-wrap">
              {[
                { id: "cursor", label: "Cursor IDE" },
                { id: "claude", label: "Claude Desktop" },
                { id: "windsurf", label: "Windsurf" },
                { id: "antigravity", label: "Antigravity IDE" },
                { id: "http", label: "HTTP JSON-RPC" },
                { id: "sdk", label: "SDK / Python / JS" },
              ].map((tab: any) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveConfigTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeConfigTab === tab.id
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Instructions Box */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-1">
            {activeConfigTab === "cursor" && (
              <p>
                <strong>For Cursor IDE:</strong> Open <strong>Settings &gt; Cursor Settings &gt; Features &gt; MCP</strong> and click <strong>Add new MCP server</strong> (Type: <code>command</code>, Command: <code>node scripts/seoseite-mcp.mjs</code>), or save this snippet into <code>.cursor/mcp.json</code> in your project root.
              </p>
            )}
            {activeConfigTab === "claude" && (
              <p>
                <strong>For Claude Desktop:</strong> Open <code>%APPDATA%\Claude\claude_desktop_config.json</code> (Windows) or <code>~/Library/Application Support/Claude/claude_desktop_config.json</code> (Mac) and add this configuration block. Restart Claude Desktop to activate all 11 tools.
              </p>
            )}
            {activeConfigTab === "windsurf" && (
              <p>
                <strong>For Windsurf:</strong> Open <code>mcp_config.json</code> under your Windsurf settings directory and add the <code>seoseite</code> entry.
              </p>
            )}
            {activeConfigTab === "antigravity" && (
              <p>
                <strong>For Antigravity IDE:</strong> Add this entry into <code>~/.gemini/antigravity/mcp_config.json</code>. The agent will automatically detect and register all 11 tools via stdio.
              </p>
            )}
            {activeConfigTab === "http" && (
              <p>
                <strong>For Remote Agents (LangChain, AutoGen, Custom Webhooks):</strong> Send HTTP POST requests with standard JSON-RPC 2.0 payloads to <code>{originUrl}/api/mcp</code>.
              </p>
            )}
            {activeConfigTab === "sdk" && (
              <p>
                <strong>For Custom Scripts &amp; Multi-Agent Systems:</strong> Use Anthropic&apos;s official <code>@modelcontextprotocol/sdk</code> to connect and execute tools programmatically.
              </p>
            )}
          </div>

          {/* Code Snippet Box */}
          <div className="relative">
            <button
              onClick={handleCopyConfig}
              className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 shadow-xs transition-colors cursor-pointer"
            >
              {copiedConfig ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>{copiedConfig ? "Copied to Clipboard!" : "Copy Configuration"}</span>
            </button>

            <pre className="p-5 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
              <code>{currentConfigSnippet}</code>
            </pre>
          </div>
        </div>

        {/* 6. SECTION: CONVERSATIONAL PROMPT SHOWCASE WITH "RUN IN PLAYGROUND" */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Conversational Prompt Ideas</h2>
              <p className="text-xs text-slate-500">
                Natural language prompts to try in Claude Desktop or Cursor. Click <strong>Run in Playground</strong> to test immediately.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PROMPT_TEMPLATES.map((item, idx) => (
              <div
                key={idx}
                className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 transition-all flex flex-col justify-between group shadow-xs"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-blue-500" /> {item.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {item.toolId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 font-medium italic leading-relaxed">
                    &ldquo;{item.prompt}&rdquo;
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleRunPrompt(item, idx)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-blue-600" />
                    <span>Run in Playground</span>
                  </button>

                  <button
                    onClick={() => handleCopyPrompt(item.prompt, idx)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    {copiedPromptIdx === idx ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-400" />
                    )}
                    <span>{copiedPromptIdx === idx ? "Copied" : "Copy Prompt"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. ARCHITECTURAL COMPARISON MATRIX */}
        <div className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200 shadow-xs space-y-5">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">Architecture Comparison: Why SeoSeite MCP?</h2>
            <p className="text-xs text-slate-500">
              How SeoSeite compares to generic LLM browsing and closed enterprise SEO suites.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-3 font-bold text-slate-700">Capability</th>
                  <th className="p-3 font-bold text-blue-700 bg-blue-50/50">SeoSeite MCP</th>
                  <th className="p-3 font-bold text-slate-700">Generic LLM Web Browsing</th>
                  <th className="p-3 font-bold text-slate-700">Ahrefs / Semrush MCP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                <tr>
                  <td className="p-3 font-sans font-semibold text-slate-800">Deterministic Scoring (0-100)</td>
                  <td className="p-3 text-emerald-600 font-bold bg-blue-50/30">Yes (Rule-based Cheerio)</td>
                  <td className="p-3 text-rose-500">No (Hallucinated estimates)</td>
                  <td className="p-3 text-emerald-600">Yes (Proprietary DR)</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-semibold text-slate-800">Google PageSpeed Lab Vitals</td>
                  <td className="p-3 text-emerald-600 font-bold bg-blue-50/30">Yes (Google PSI API)</td>
                  <td className="p-3 text-rose-500">No (Cannot run Lighthouse)</td>
                  <td className="p-3 text-slate-400">Partial</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-semibold text-slate-800">Security Headers &amp; SSL</td>
                  <td className="p-3 text-emerald-600 font-bold bg-blue-50/30">Yes (8+ Vectors Tested)</td>
                  <td className="p-3 text-rose-500">No</td>
                  <td className="p-3 text-slate-400">Basic</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-semibold text-slate-800">Heading Tree &amp; Hierarchy</td>
                  <td className="p-3 text-emerald-600 font-bold bg-blue-50/30">Yes (H1-H6 Tree &amp; Skips)</td>
                  <td className="p-3 text-amber-500">Unreliable text extraction</td>
                  <td className="p-3 text-slate-400">Basic</td>
                </tr>
                <tr>
                  <td className="p-3 font-sans font-semibold text-slate-800">Price &amp; Barrier to Entry</td>
                  <td className="p-3 text-emerald-600 font-bold bg-blue-50/30">Free / Open-Source</td>
                  <td className="p-3 text-slate-600">Included in LLM plan</td>
                  <td className="p-3 text-rose-500 font-bold">$999 / month enterprise</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 8. FOOTER BANNER */}
        <div className="rounded-2xl p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between flex-wrap gap-4 shadow-lg">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-semibold">
              <Sparkles className="w-3 h-3" /> Ready for Autonomous Coding Agents
            </div>
            <h3 className="text-base font-bold">Need custom crawler webhooks or automated CI/CD audits?</h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Integrate SeoSeite into your GitHub Actions pipeline or autonomous agents to prevent broken links and SEO regressions before every deployment.
            </p>
          </div>

          <Link
            href="/pricing"
            className="px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-sm"
          >
            View Enterprise Plans <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
