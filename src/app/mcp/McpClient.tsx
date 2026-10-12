"use client";

import { useState } from "react";
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
} from "lucide-react";
import { usePlan } from "@/lib/auth/PlanContext";
import { formatTierName } from "@/lib/auth/tierLimits";

interface ToolOption {
  id: string;
  name: string;
  description: string;
  icon: any;
  defaultParams: Record<string, any>;
  paramFields: { key: string; label: string; placeholder: string; type: string }[];
}

const MCP_TOOLS: ToolOption[] = [
  {
    id: "seoseite_audit_url",
    name: "seoseite_audit_url",
    description: "Runs full deterministic technical SEO health audit, scoring, CWV, and AI developer fixes.",
    icon: ShieldCheck,
    defaultParams: { url: "https://example.com" },
    paramFields: [
      { key: "url", label: "Target Website URL", placeholder: "https://example.com", type: "text" },
    ],
  },
  {
    id: "seoseite_compare_domains",
    name: "seoseite_compare_domains",
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
    description: "Crawls a website to detect broken internal and external 404 links and redirects.",
    icon: Layers,
    defaultParams: { url: "https://example.com", maxLinks: 20 },
    paramFields: [
      { key: "url", label: "Website URL", placeholder: "https://example.com", type: "text" },
      { key: "maxLinks", label: "Max Links to Crawl", placeholder: "20", type: "number" },
    ],
  },
  {
    id: "seoseite_speed_lab",
    name: "seoseite_speed_lab",
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
    description: "Identifies CMS, frontend frameworks, analytics, CDN, server software, and typography.",
    icon: Cpu,
    defaultParams: { url: "https://example.com" },
    paramFields: [
      { key: "url", label: "Target URL", placeholder: "https://example.com", type: "text" },
    ],
  },
  {
    id: "seoseite_validate_schema",
    name: "seoseite_validate_schema",
    description: "Inspects Schema.org JSON-LD microdata, Open Graph, and Twitter Cards.",
    icon: Code2,
    defaultParams: { url: "https://example.com" },
    paramFields: [
      { key: "url", label: "Target URL", placeholder: "https://example.com", type: "text" },
    ],
  },
  {
    id: "seoseite_check_authority",
    name: "seoseite_check_authority",
    description: "Queries DomCop Open PageRank decimal score (0-10) and global rank index.",
    icon: Globe,
    defaultParams: { domain: "github.com" },
    paramFields: [
      { key: "domain", label: "Domain or Host", placeholder: "github.com", type: "text" },
    ],
  },
];

const PROMPT_TEMPLATES = [
  {
    title: "Instant Technical Audit",
    prompt: "Audit https://stripe.com using SeoSeite and identify their top 3 critical SEO bottlenecks.",
    tool: "seoseite_audit_url",
  },
  {
    title: "Competitor Benchmark",
    prompt: "Compare vercel.com against netlify.com using SeoSeite. Who has faster Core Web Vitals?",
    tool: "seoseite_compare_domains",
  },
  {
    title: "Find 404 Dead Links",
    prompt: "Crawl https://example.com for broken links with SeoSeite and generate a markdown table of errors.",
    tool: "seoseite_check_broken_links",
  },
  {
    title: "Inspect Tech Stack",
    prompt: "What CMS, JavaScript frameworks, and hosting does linear.app use according to SeoSeite?",
    tool: "seoseite_detect_tech",
  },
];

export default function McpClient() {
  const { tier, triggerUpgradeModal } = usePlan();
  const [selectedToolId, setSelectedToolId] = useState<string>("seoseite_audit_url");
  const [params, setParams] = useState<Record<string, any>>(MCP_TOOLS[0].defaultParams);
  const [activeConfigTab, setActiveConfigTab] = useState<"cursor" | "claude" | "windsurf" | "http">("cursor");
  const [testing, setTesting] = useState(false);
  const [responseOutput, setResponseOutput] = useState<string | null>(null);
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [copiedPromptIdx, setCopiedPromptIdx] = useState<number | null>(null);

  const selectedTool = MCP_TOOLS.find((t) => t.id === selectedToolId) || MCP_TOOLS[0];

  const handleToolChange = (toolId: string) => {
    setSelectedToolId(toolId);
    const tool = MCP_TOOLS.find((t) => t.id === toolId);
    if (tool) {
      setParams(tool.defaultParams);
    }
  };

  const handleExecuteTool = async () => {
    setTesting(true);
    setResponseOutput(null);

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

      const json = await res.json();
      setResponseOutput(JSON.stringify(json, null, 2));
    } catch (err: any) {
      setResponseOutput(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setTesting(false);
    }
  };

  const cursorJson = JSON.stringify(
    {
      mcpServers: {
        seoseite: {
          command: "node",
          args: ["scripts/seoseite-mcp.mjs"],
          env: {
            SEOSEITE_API_URL: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
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
            SEOSEITE_API_URL: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
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
            SEOSEITE_API_URL: "http://localhost:3000",
          },
        },
      },
    },
    null,
    2
  );

  const httpJsonRpcDoc = `// Standard JSON-RPC 2.0 HTTP POST Endpoint
// POST /api/mcp
// Headers: Content-Type: application/json

// 1. Initialize Handshake
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {}
}

// 2. Discover Tools
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list"
}

// 3. Execute Tool
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "seoseite_audit_url",
    "arguments": { "url": "https://stripe.com" }
  }
}`;

  const currentConfigSnippet =
    activeConfigTab === "cursor"
      ? cursorJson
      : activeConfigTab === "claude"
      ? claudeDesktopJson
      : activeConfigTab === "windsurf"
      ? windsurfJson
      : httpJsonRpcDoc;

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(currentConfigSnippet);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  const handleCopyResponse = () => {
    if (!responseOutput) return;
    navigator.clipboard.writeText(responseOutput);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  const handleCopyPrompt = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptIdx(idx);
    setTimeout(() => setCopiedPromptIdx(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-xs">
          <Bot className="w-3.5 h-3.5" />
          <span>Model Context Protocol (MCP) Server</span>
          <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-bold">
            v1.0.0
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          Supercharge AI Assistants with Deterministic SEO Intelligence
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Connect <strong>Claude Desktop</strong>, <strong>Cursor IDE</strong>, <strong>Windsurf</strong>, or autonomous AI agents directly to SeoSeite. Empower LLMs to audit websites, compare competitors, and inspect tech stacks without hallucinations.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <a
            href="#live-tester"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            <Play className="w-3.5 h-3.5" />
            Launch In-Browser Playground
          </a>
          <a
            href="#install-guide"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-300 transition-all"
          >
            <Terminal className="w-3.5 h-3.5" />
            Setup Guide
          </a>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flat-card p-6 bg-white border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Zero AI Hallucination</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            LLMs cannot browse websites accurately. SeoSeite provides real DOM scraping, deterministic rule algorithms, and Google PageSpeed lab scores.
          </p>
        </div>

        <div className="flat-card p-6 bg-white border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Standard MCP Protocol</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Built on Anthropic&apos;s open Model Context Protocol specification (`2024-11-05`), supporting both local <code>stdio</code> and remote <code>JSON-RPC 2.0 HTTP</code> transports.
          </p>
        </div>

        <div className="flat-card p-6 bg-white border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Ahrefs Alternative</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Ahrefs restricts MCP access to enterprise accounts ($999/mo). SeoSeite makes live SEO tool calling accessible for indie hackers and developers.
          </p>
        </div>
      </div>

      {/* SECTION 1: IN-BROWSER MCP TESTER */}
      <div id="live-tester" className="flat-card p-6 sm:p-8 bg-white border-blue-200 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Play className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Interactive MCP Tool Playground</h2>
              <p className="text-xs text-slate-500">
                Execute SeoSeite MCP tools in real-time over the JSON-RPC HTTP gateway (`POST /api/mcp`).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500">Protocol:</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px] border border-slate-200">
              JSON-RPC 2.0
            </span>
          </div>
        </div>

        {/* Tool Selector Buttons */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Select Tool to Test:</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {MCP_TOOLS.map((t) => {
              const isSelected = t.id === selectedToolId;
              const ToolIcon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => handleToolChange(t.id)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-xs ring-1 ring-blue-500/20"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  <ToolIcon
                    className={`w-4 h-4 mb-2 ${isSelected ? "text-blue-600" : "text-slate-400"}`}
                  />
                  <div className="text-[11px] font-mono leading-tight truncate">{t.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Tool Details & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <div className="lg:col-span-5 space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                Tool Description
              </span>
              <h3 className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                {selectedTool.name}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {selectedTool.description}
              </p>
            </div>

            {/* Dynamic Inputs */}
            <div className="space-y-3 pt-2 border-t border-slate-200">
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
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleExecuteTool}
              disabled={testing}
              className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {testing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Executing Tool Call...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  Execute MCP Tool Call
                </>
              )}
            </button>
          </div>

          {/* Response Payload Viewer */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-slate-500" />
                Live Tool Output (JSON-RPC)
              </span>
              {responseOutput && (
                <button
                  onClick={handleCopyResponse}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 transition-colors cursor-pointer"
                >
                  {copiedResponse ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-400" />
                  )}
                  {copiedResponse ? "Copied" : "Copy JSON"}
                </button>
              )}
            </div>

            <div className="flex-1 bg-slate-900 rounded-xl p-4 text-slate-100 font-mono text-[11px] overflow-auto max-h-[380px] border border-slate-800 shadow-inner">
              {responseOutput ? (
                <pre className="whitespace-pre-wrap leading-relaxed">{responseOutput}</pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12 text-center">
                  <Terminal className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-xs font-mono">No execution yet.</p>
                  <p className="text-[11px] text-slate-600 max-w-xs mt-1">
                    Click &ldquo;Execute MCP Tool Call&rdquo; above to query the running engine and observe the raw JSON result.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: CLIENT INSTALLATION GUIDES */}
      <div id="install-guide" className="flat-card p-6 sm:p-8 bg-white border-slate-200 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Terminal className="w-4 h-4 text-slate-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">IDE &amp; Desktop Integration Guide</h2>
              <p className="text-xs text-slate-500">
                Copy and paste the configuration snippet directly into your local AI client.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveConfigTab("cursor")}
              className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                activeConfigTab === "cursor" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Cursor IDE
            </button>
            <button
              onClick={() => setActiveConfigTab("claude")}
              className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                activeConfigTab === "claude" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Claude Desktop
            </button>
            <button
              onClick={() => setActiveConfigTab("windsurf")}
              className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                activeConfigTab === "windsurf" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Windsurf
            </button>
            <button
              onClick={() => setActiveConfigTab("http")}
              className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                activeConfigTab === "http" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              HTTP JSON-RPC
            </button>
          </div>
        </div>

        {/* Instructions box */}
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-1">
          {activeConfigTab === "cursor" && (
            <p>
              <strong>For Cursor IDE:</strong> Open <strong>Settings &gt; Cursor Settings &gt; Features &gt; MCP</strong> and add a new Server, or add this block to <code>.cursor/mcp.json</code> in your project root.
            </p>
          )}
          {activeConfigTab === "claude" && (
            <p>
              <strong>For Claude Desktop:</strong> Open <code>%APPDATA%/Claude/claude_desktop_config.json</code> (Windows) or <code>~/Library/Application Support/Claude/claude_desktop_config.json</code> (Mac) and insert this config.
            </p>
          )}
          {activeConfigTab === "windsurf" && (
            <p>
              <strong>For Windsurf:</strong> Add this block to your <code>mcp_config.json</code> under the project workspace or global settings.
            </p>
          )}
          {activeConfigTab === "http" && (
            <p>
              <strong>For Remote Agents (LangChain, AutoGen, Custom Scripts):</strong> Send HTTP POST requests with standard JSON-RPC 2.0 payloads to <code>/api/mcp</code>.
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
            {copiedConfig ? "Copied to Clipboard!" : "Copy Configuration"}
          </button>

          <pre className="p-5 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
            <code>{currentConfigSnippet}</code>
          </pre>
        </div>
      </div>

      {/* SECTION 3: CONVERSATIONAL PROMPT SHOWCASE */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Conversational Prompt Ideas</h2>
          <p className="text-xs text-slate-500">
            Once connected to Claude Desktop or Cursor, try typing these natural language instructions:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROMPT_TEMPLATES.map((item, idx) => (
            <div
              key={idx}
              className="p-5 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-all flex flex-col justify-between group shadow-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                    {item.title}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {item.tool}
                  </span>
                </div>
                <p className="text-xs text-slate-800 font-medium italic leading-relaxed">
                  &ldquo;{item.prompt}&rdquo;
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={() => handleCopyPrompt(item.prompt, idx)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {copiedPromptIdx === idx ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-400" />
                  )}
                  {copiedPromptIdx === idx ? "Copied" : "Copy Prompt"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Banner */}
      <div className="flat-card p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-semibold">
            <Sparkles className="w-3 h-3" /> Ready for Automation
          </div>
          <h3 className="text-base font-bold">Need unlimited MCP calls or private webhook monitoring?</h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Upgrade to the Agency &amp; Enterprise tier to unlock dedicated rate limits, custom crawler scrapers, and team access.
          </p>
        </div>

        <Link
          href="/pricing"
          className="px-4 py-2.5 rounded-lg bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-sm"
        >
          View Enterprise Plans <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
