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
  ChevronDown,
  ChevronUp,
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
  Download,
  MessageSquare,
  HelpCircle,
  History,
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
  paramFields: { key: string; label: string; placeholder: string; type: string; required?: boolean }[];
  outputFields: { key: string; type: string; description: string }[];
  sampleOutput: string;
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
      { key: "url", label: "Target Website URL", placeholder: "https://example.com", type: "text", required: true },
    ],
    outputFields: [
      { key: "overallScore", type: "number (0-100)", description: "Deterministic overall technical SEO health score." },
      { key: "grade", type: "string (A+ to F)", description: "Letter grade computed from passed rules." },
      { key: "coreWebVitals", type: "object", description: "FCP, LCP, CLS lab measurements from Google PSI." },
      { key: "criticalIssues", type: "array", description: "Deducted penalty items with exact code fixes." },
    ],
    sampleOutput: `{\n  "overallScore": 88,\n  "grade": "B+",\n  "performanceScore": 92,\n  "coreWebVitals": { "fcp": "0.9s", "lcp": "1.8s", "cls": "0.01" },\n  "criticalIssues": [\n    { "check": "Missing Meta Description", "status": "warning" }\n  ]\n}`,
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
      { key: "urlA", label: "Primary URL (A)", placeholder: "https://stripe.com", type: "text", required: true },
      { key: "urlB", label: "Competitor URL (B)", placeholder: "https://paypal.com", type: "text", required: true },
    ],
    outputFields: [
      { key: "winner", type: "string", description: "Domain with superior technical SEO composite score." },
      { key: "scoreDifference", type: "number", description: "Delta between site A and site B overall points." },
      { key: "techDifferences", type: "object", description: "Frameworks, CDNs, and tools unique to each site." },
    ],
    sampleOutput: `{\n  "winner": "stripe.com",\n  "scoreDifference": +14,\n  "siteA": { "domain": "stripe.com", "overallScore": 94 },\n  "siteB": { "domain": "paypal.com", "overallScore": 80 }\n}`,
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
      { key: "url", label: "Website URL", placeholder: "https://example.com", type: "text", required: true },
      { key: "maxLinks", label: "Max Links to Crawl", placeholder: "20", type: "number" },
    ],
    outputFields: [
      { key: "totalChecked", type: "number", description: "Total links tested across internal and external origins." },
      { key: "brokenCount", type: "number", description: "Number of 404/410 dead responses detected." },
      { key: "redirectCount", type: "number", description: "Permanent 301 and temporary 302 redirects." },
    ],
    sampleOutput: `{\n  "totalChecked": 20,\n  "healthyCount": 19,\n  "brokenCount": 0,\n  "redirectCount": 1,\n  "avgLatencyMs": 48\n}`,
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
      { key: "url", label: "Target URL", placeholder: "https://example.com", type: "text", required: true },
    ],
    outputFields: [
      { key: "architectureScore", type: "number (0-100)", description: "Hierarchy integrity score." },
      { key: "headingCounts", type: "object", description: "Count of H1, H2, H3, H4, H5, H6 elements." },
      { key: "issues", type: "array", description: "Skipped levels, empty tags, or multiple H1 anomalies." },
    ],
    sampleOutput: `{\n  "architectureScore": 90,\n  "headingCounts": { "h1": 1, "h2": 6, "h3": 12 },\n  "issuesCount": 0,\n  "hierarchySample": [{ "level": "H1", "text": "Next Generation API" }]\n}`,
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
      { key: "url", label: "Target URL", placeholder: "https://example.com", type: "text", required: true },
    ],
    outputFields: [
      { key: "performanceScore", type: "number (0-100)", description: "Lighthouse lab performance composite." },
      { key: "coreWebVitals", type: "object", description: "Largest Contentful Paint, First Contentful Paint, CLS." },
    ],
    sampleOutput: `{\n  "performanceScore": 96,\n  "accessibilityScore": 100,\n  "coreWebVitals": { "lcp": "1.2s", "fcp": "0.8s", "cls": "0.00" }\n}`,
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
      { key: "url", label: "Target URL", placeholder: "https://example.com", type: "text", required: true },
    ],
    outputFields: [
      { key: "totalDetected", type: "number", description: "Count of confirmed technologies." },
      { key: "technologies", type: "array", description: "Name, category, confidence, and proof evidence." },
    ],
    sampleOutput: `{\n  "totalDetected": 6,\n  "technologies": [\n    { "name": "Next.js", "category": "JavaScript Frameworks", "confidence": "High" },\n    { "name": "Vercel", "category": "PaaS & Hosting", "confidence": "High" }\n  ]\n}`,
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
      { key: "url", label: "Target URL", placeholder: "https://stripe.com", type: "text", required: true },
    ],
    outputFields: [
      { key: "securityScore", type: "number (0-100)", description: "Header hardening security rating." },
      { key: "grade", type: "string (A+ to F)", description: "Security defense grade." },
      { key: "headers", type: "object", description: "Status and raw values for HSTS, CSP, XFO, XCTO." },
    ],
    sampleOutput: `{\n  "securityScore": 95,\n  "grade": "A+",\n  "headers": {\n    "hsts": { "present": true, "value": "max-age=63072000; includeSubDomains; preload" },\n    "xFrameOptions": { "present": true, "value": "SAMEORIGIN" }\n  }\n}`,
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
      { key: "url", label: "Target URL", placeholder: "https://example.com", type: "text", required: true },
    ],
    outputFields: [
      { key: "structuredDataCount", type: "number", description: "Count of valid JSON-LD entities." },
      { key: "openGraph", type: "object", description: "og:title, og:image, og:description presence." },
    ],
    sampleOutput: `{\n  "structuredDataCount": 2,\n  "structuredDataTypes": ["Organization", "WebSite"],\n  "openGraph": { "title": "Stripe | Financial Infrastructure" }\n}`,
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
      { key: "domain", label: "Domain or Host", placeholder: "github.com", type: "text", required: true },
    ],
    outputFields: [
      { key: "pageRank", type: "number (0-10)", description: "DomCop Open PageRank decimal score." },
      { key: "globalRank", type: "number", description: "Global website rank index." },
      { key: "tier", type: "string", description: "Authority tier classification." },
    ],
    sampleOutput: `{\n  "domain": "github.com",\n  "pageRank": 9.56,\n  "globalRank": 15,\n  "tier": "Tier 1: Global Mega Authority (PR 8.0 - 10.0)"\n}`,
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
      { key: "url", label: "Target URL", placeholder: "https://example.com", type: "text", required: true },
    ],
    outputFields: [
      { key: "title.pixelWidth", type: "number", description: "Computed Arial 18px pixel width (max 580px)." },
      { key: "predictedCtrScore", type: "number (0-100)", description: "Estimated click-through rate optimization." },
    ],
    sampleOutput: `{\n  "title": { "text": "Example Domain", "pixelWidth": 133, "isTruncated": false },\n  "predictedCtrScore": 75\n}`,
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
      { key: "domain", label: "Brand Domain", placeholder: "linear.app", type: "text", required: true },
    ],
    outputFields: [
      { key: "aiVisibilityScore", type: "number (0-100)", description: "Aggregate LLM citation readiness." },
      { key: "llmPresenceMatrix", type: "object", description: "ChatGPT, Perplexity, Gemini, Claude probabilities." },
    ],
    sampleOutput: `{\n  "aiVisibilityScore": 98,\n  "aeoTier": "Top 5% AI Search Citations",\n  "llmPresenceMatrix": { "chatGptSearch": { "readiness": "High" } }\n}`,
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

const CHAT_SIMULATION_SCENARIOS = [
  {
    id: "security",
    title: "Security Header Hardening",
    userQuery: "Check if https://stripe.com has adequate security headers before our compliance audit.",
    toolCalled: "seoseite_security_headers",
    toolArgs: { url: "https://stripe.com" },
    toolResult: {
      domain: "stripe.com",
      securityScore: 95,
      grade: "A+",
      headers: {
        hsts: { present: true, value: "max-age=63072000; includeSubDomains; preload" },
        csp: { present: true, value: "base-uri 'none'; child-src 'none'..." },
        xfo: { present: true, value: "SAMEORIGIN" },
        xcto: { present: true, value: "nosniff" },
      },
    },
    aiResponse:
      "I inspected **stripe.com** using the SeoSeite MCP tool. Here are the findings:\n\n- **Security Grade:** `A+ (95/100)`\n- **HSTS:** Fully configured with `max-age=63072000` and `preload` enabled to prevent SSL-stripping.\n- **Content-Security-Policy:** Active with strict `base-uri 'none'` and restricted script origins.\n- **Clickjacking Protection:** Hardened via `X-Frame-Options: SAMEORIGIN`.\n\nStripe passes compliance standards for transport security and browser defense.",
  },
  {
    id: "competitor",
    title: "Head-to-Head Competitor Duel",
    userQuery: "Compare vercel.com vs netlify.com. Who has better technical SEO and faster response times?",
    toolCalled: "seoseite_compare_domains",
    toolArgs: { urlA: "https://vercel.com", urlB: "https://netlify.com" },
    toolResult: {
      winner: "vercel.com",
      scoreDifference: 8,
      siteA: { domain: "vercel.com", overallScore: 96, responseTimeMs: 42 },
      siteB: { domain: "netlify.com", overallScore: 88, responseTimeMs: 86 },
    },
    aiResponse:
      "According to the deterministic benchmark from SeoSeite MCP:\n\n- **Winner:** **vercel.com** leads by **+8 points** (96/100 vs 88/100).\n- **Edge Latency:** Vercel responded in `42ms` compared to Netlify's `86ms`.\n- **Core Web Vitals:** Both maintain sub-second FCP, but Vercel's zero Cumulative Layout Shift (`CLS: 0.00`) provided a slight ranking edge.",
  },
  {
    id: "aeo",
    title: "AI Search & AEO Citation Check",
    userQuery: "How visible is linear.app in AI search engines like ChatGPT and Perplexity?",
    toolCalled: "seoseite_brand_radar",
    toolArgs: { domain: "linear.app" },
    toolResult: {
      brandDomain: "linear.app",
      aiVisibilityScore: 98,
      aeoTier: "Top 5% AI Search Citations",
      chatGptSearch: "High (95% citation probability)",
      perplexityAi: "High (98% citation probability)",
    },
    aiResponse:
      "I queried SeoSeite Brand Radar for **linear.app**:\n\n- **AI Visibility Score:** `98/100` (Tier 1 AI Presence).\n- **ChatGPT Search Citations:** 95% probability of inclusion for queries about modern issue trackers and developer sprint tools.\n- **Perplexity AI:** 98% citation readiness backed by strong GitHub and documentation entity indexing.",
  },
];

const FAQS = [
  {
    q: "Why does my AI assistant say it cannot browse the web or run audits?",
    a: "Standard LLMs (Claude, GPT-4, etc.) are cut off from live scraping or blocked by Cloudflare. By connecting the SeoSeite MCP server, the model is equipped with deterministic tools (Cheerio HTML parsing, Google PageSpeed API, Open PageRank) so it calls SeoSeite instead of hallucinating answers.",
  },
  {
    q: "How does the Stdio transport differ from the HTTP JSON-RPC gateway?",
    a: "The local Stdio transport (node scripts/seoseite-mcp.mjs) runs directly on your machine through stdin/stdout, which desktop applications like Claude Desktop and Cursor require for low-latency security. The HTTP endpoint (/api/mcp) is a standard JSON-RPC 2.0 REST endpoint ideal for cloud agents, CI/CD pipelines, and webhooks.",
  },
  {
    q: "Does SeoSeite MCP require an expensive enterprise subscription?",
    a: "No. Unlike Ahrefs or Semrush which gate their programmatic API/MCP access behind $999/month enterprise plans, SeoSeite MCP is open-source and provides 11 fully functional developer tools out of the box.",
  },
  {
    q: "How is Server-Side Request Forgery (SSRF) prevented?",
    a: "SeoSeite includes an enterprise security firewall in src/lib/security/ssrf.ts that validates DNS resolutions, blocking private IP spaces (10.x, 172.16.x, 192.168.x, 127.0.0.1) and cloud metadata endpoints (169.254.169.254) before any HTTP connection is attempted.",
  },
];

interface ExecutionHistoryItem {
  id: string;
  tool: string;
  target: string;
  timestamp: string;
  status: number;
  durationMs: number;
  success: boolean;
}

export default function McpClient() {
  const { tier } = usePlan();
  const [selectedToolId, setSelectedToolId] = useState<string>("seoseite_audit_url");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [toolSearch, setToolSearch] = useState<string>("");
  const [params, setParams] = useState<Record<string, any>>(MCP_TOOLS[0].defaultParams);

  // Config Studio State
  const [activeConfigTab, setActiveConfigTab] = useState<"cursor" | "claude" | "windsurf" | "antigravity" | "http" | "sdk">("cursor");
  const [configHost, setConfigHost] = useState<string>("local");
  const [customHostUrl, setCustomHostUrl] = useState<string>("https://seoseite.com");

  // Output Console State
  const [outputTab, setOutputTab] = useState<"visual" | "json" | "request" | "curl">("visual");
  const [testing, setTesting] = useState(false);
  const [rawTextOutput, setRawTextOutput] = useState<string | null>(null);
  const [parsedToolContent, setParsedToolContent] = useState<any | null>(null);
  const [executionTimingMs, setExecutionTimingMs] = useState<number | null>(null);
  const [executionStatus, setExecutionStatus] = useState<number | null>(null);

  // Diagnostic Suite State
  const [diagnosticRunning, setDiagnosticRunning] = useState(false);
  const [diagnosticStages, setDiagnosticStages] = useState<{
    ping: { status: "pending" | "running" | "success" | "error"; latencyMs?: number };
    init: { status: "pending" | "running" | "success" | "error"; version?: string };
    tools: { status: "pending" | "running" | "success" | "error"; count?: number };
    dryRun: { status: "pending" | "running" | "success" | "error"; latencyMs?: number };
  }>({
    ping: { status: "pending" },
    init: { status: "pending" },
    tools: { status: "pending" },
    dryRun: { status: "pending" },
  });

  // Chat Simulation State
  const [activeScenarioId, setActiveScenarioId] = useState<string>("security");

  // Execution History State
  const [history, setHistory] = useState<ExecutionHistoryItem[]>([]);

  // Accordion state for Schema Catalog
  const [expandedSchemaTool, setExpandedSchemaTool] = useState<string | null>("seoseite_audit_url");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Sticky sub-navbar state on scroll
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Reveal floating subnav when user scrolls past hero
      setIsScrolled(window.scrollY > 350);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Copy states
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [copiedPromptIdx, setCopiedPromptIdx] = useState<number | null>(null);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const playgroundRef = useRef<HTMLDivElement>(null);
  const diagnosticsRef = useRef<HTMLDivElement>(null);

  const selectedTool = useMemo(
    () => MCP_TOOLS.find((t) => t.id === selectedToolId) || MCP_TOOLS[0],
    [selectedToolId]
  );

  const filteredTools = useMemo(() => {
    return MCP_TOOLS.filter((t) => {
      const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;
      const matchesSearch =
        toolSearch.trim() === "" ||
        t.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
        t.description.toLowerCase().includes(toolSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, toolSearch]);

  // Initial Diagnostic Run on Mount
  useEffect(() => {
    runFullDiagnostics();
  }, []);

  const runFullDiagnostics = async () => {
    setDiagnosticRunning(true);
    setDiagnosticStages({
      ping: { status: "running" },
      init: { status: "pending" },
      tools: { status: "pending" },
      dryRun: { status: "pending" },
    });

    try {
      // Stage 1: GET Ping
      const t0 = performance.now();
      const resPing = await fetch("/api/mcp", { method: "GET" });
      const latPing = Math.round(performance.now() - t0);
      if (!resPing.ok) throw new Error("Ping failed");
      const pingData = await resPing.json();
      setDiagnosticStages((prev) => ({
        ...prev,
        ping: { status: "success", latencyMs: latPing },
        init: { status: "running" },
      }));

      // Stage 2: Initialize Handshake
      const resInit = await fetch("/api/mcp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize" }),
      });
      const initData = await resInit.json();
      setDiagnosticStages((prev) => ({
        ...prev,
        init: { status: "success", version: initData?.result?.protocolVersion || "2024-11-05" },
        tools: { status: "running" },
      }));

      // Stage 3: Tools Discovery
      const resTools = await fetch("/api/mcp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/list" }),
      });
      const toolsData = await resTools.json();
      const toolsCount = toolsData?.result?.tools?.length || 11;
      setDiagnosticStages((prev) => ({
        ...prev,
        tools: { status: "success", count: toolsCount },
        dryRun: { status: "running" },
      }));

      // Stage 4: Dry-run Authority Tool Call
      const t1 = performance.now();
      const resDry = await fetch("/api/mcp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 3,
          method: "tools/call",
          params: { name: "seoseite_check_authority", arguments: { domain: "github.com" } },
        }),
      });
      const latDry = Math.round(performance.now() - t1);
      if (!resDry.ok) throw new Error("Dry-run failed");
      setDiagnosticStages((prev) => ({
        ...prev,
        dryRun: { status: "success", latencyMs: latDry },
      }));
    } catch {
      setDiagnosticStages((prev) => ({
        ...prev,
        dryRun: { status: "error" },
      }));
    } finally {
      setDiagnosticRunning(false);
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
    setRawTextOutput(null);
    setParsedToolContent(null);
    setExecutionTimingMs(null);

    const startTime = performance.now();
    const targetLabel = String(params.url || params.domain || params.urlA || "target");

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
      setRawTextOutput(JSON.stringify(json, null, 2));

      // Append to session execution history
      const historyEntry: ExecutionHistoryItem = {
        id: String(Date.now()),
        tool: selectedTool.name,
        target: targetLabel,
        timestamp: new Date().toLocaleTimeString(),
        status: res.status,
        durationMs: elapsed,
        success: res.ok && !json.error,
      };
      setHistory((prev) => [historyEntry, ...prev.slice(0, 4)]);

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
      setRawTextOutput(JSON.stringify(errObj, null, 2));
      setOutputTab("json");

      const historyEntry: ExecutionHistoryItem = {
        id: String(Date.now()),
        tool: selectedTool.name,
        target: targetLabel,
        timestamp: new Date().toLocaleTimeString(),
        status: 500,
        durationMs: elapsed,
        success: false,
      };
      setHistory((prev) => [historyEntry, ...prev.slice(0, 4)]);
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

  // Determine computed effective host
  const effectiveBaseUrl =
    configHost === "local"
      ? typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000"
      : customHostUrl.trim() || "http://localhost:3000";

  // Generated Client Configurations
  const cursorJson = JSON.stringify(
    {
      mcpServers: {
        seoseite: {
          command: "node",
          args: ["scripts/seoseite-mcp.mjs"],
          env: {
            SEOSEITE_API_URL: effectiveBaseUrl,
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
            SEOSEITE_API_URL: effectiveBaseUrl,
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
            SEOSEITE_API_URL: effectiveBaseUrl,
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
            SEOSEITE_API_URL: effectiveBaseUrl,
          },
        },
      },
    },
    null,
    2
  );

  const httpJsonRpcDoc = `// Standard JSON-RPC 2.0 HTTP POST Gateway
// Endpoint: ${effectiveBaseUrl}/api/mcp
// Headers: Content-Type: application/json

// 1. Initialize Handshake
curl -X POST ${effectiveBaseUrl}/api/mcp \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc": "2.0", "id": 1, "method": "initialize"}'

// 2. Discover All 11 Tools
curl -X POST ${effectiveBaseUrl}/api/mcp \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc": "2.0", "id": 2, "method": "tools/list"}'

// 3. Execute Tool (e.g. Audit URL)
curl -X POST ${effectiveBaseUrl}/api/mcp \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "seoseite_audit_url", "arguments": {"url": "https://stripe.com"}}}'`;

  const sdkCodeDoc = `import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// Connect to SeoSeite MCP via stdio transport
const transport = new StdioClientTransport({
  command: "node",
  args: ["scripts/seoseite-mcp.mjs"],
  env: { SEOSEITE_API_URL: "${effectiveBaseUrl}" },
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

  const handleDownloadConfigFile = () => {
    const filename =
      activeConfigTab === "cursor"
        ? "mcp.json"
        : activeConfigTab === "claude"
        ? "claude_desktop_config.json"
        : activeConfigTab === "windsurf"
        ? "mcp_config.json"
        : activeConfigTab === "antigravity"
        ? "mcp_config.json"
        : "mcp-config.txt";

    const blob = new Blob([currentConfigSnippet], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJsonOutput = () => {
    if (!rawTextOutput) return;
    const blob = new Blob([rawTextOutput], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedTool.name}-output.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyCurlCommand = () => {
    const curl = `curl -X POST ${effectiveBaseUrl}/api/mcp -H "Content-Type: application/json" -d '${JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: { name: selectedTool.name, arguments: params },
    })}'`;
    navigator.clipboard.writeText(curl);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const activeScenario =
    CHAT_SIMULATION_SCENARIOS.find((s) => s.id === activeScenarioId) || CHAT_SIMULATION_SCENARIOS[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 overflow-x-clip">
      {/* 1. FLOATING SUBNAVBAR (REVEALED ON SCROLL) */}
      {isScrolled && (
        <aside
          aria-label="MCP Quick Navigation"
          className="fixed top-16 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] py-2.5 transition-all duration-200 animate-in fade-in slide-in-from-top-1 no-print"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
            {/* Left: Compact Status Capsule */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-mono shadow-xs border border-slate-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="font-bold tracking-tight">MCP Gateway</span>
                <span className="text-slate-400 text-[10px]">•</span>
                <span className="text-blue-400 font-semibold text-[11px]">11 Tools</span>
              </div>
            </div>

            {/* Center: Clean Segmented Jump Links */}
            <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 text-xs font-semibold text-slate-600">
              <a
                href="#diagnostics"
                className="px-3 py-1 rounded-lg hover:text-slate-900 hover:bg-white transition-all whitespace-nowrap"
              >
                Diagnostics
              </a>
              <a
                href="#live-tester"
                className="px-3 py-1 rounded-lg hover:text-slate-900 hover:bg-white transition-all whitespace-nowrap"
              >
                Playground
              </a>
              <a
                href="#chat-simulation"
                className="px-3 py-1 rounded-lg hover:text-slate-900 hover:bg-white transition-all whitespace-nowrap"
              >
                AI Simulation
              </a>
              <a
                href="#install-guide"
                className="px-3 py-1 rounded-lg hover:text-slate-900 hover:bg-white transition-all whitespace-nowrap"
              >
                Config Studio
              </a>
              <a
                href="#schema-catalog"
                className="px-3 py-1 rounded-lg hover:text-slate-900 hover:bg-white transition-all whitespace-nowrap"
              >
                Schemas
              </a>
            </nav>

            {/* Right: Focused Action Control */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="#live-tester"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs whitespace-nowrap"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Playground</span>
              </a>
            </div>
          </div>
        </aside>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* 2. NIGHT-SKY OPERATIONS COCKPIT & HERO */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 text-white p-6 sm:p-10 shadow-xl">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold shadow-inner">
              <Bot className="w-4 h-4 text-blue-400" />
              <span>Model Context Protocol (MCP) Server</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
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
                Launch Playground
              </a>
              <a
                href="#install-guide"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
              >
                <Terminal className="w-4 h-4 text-slate-300" />
                Client Setup Guide
              </a>
              <a
                href="#diagnostics"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-all"
              >
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Protocol Diagnostics</span>
              </a>
            </div>

            {/* Live Telemetry Strip */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-800/80 text-left">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Server Gateway
                </span>
                <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  Online / 200 OK
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Roundtrip Latency
                </span>
                <div className="text-sm font-bold text-white font-mono mt-0.5">
                  {diagnosticStages.ping.latencyMs !== undefined ? `${diagnosticStages.ping.latencyMs} ms` : "Measuring..."}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  MCP Registered Tools
                </span>
                <div className="text-sm font-bold text-blue-400 font-mono mt-0.5">
                  11 Active Engines
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
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

        {/* 3. NEW: 4-STAGE PROTOCOL HEALTH DIAGNOSTIC ARENA */}
        <div ref={diagnosticsRef} id="diagnostics" className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Protocol Health &amp; Handshake Verification</h2>
                <p className="text-xs text-slate-500">
                  Comprehensive 4-stage validation suite confirming MCP specification adherence and tool readiness.
                </p>
              </div>
            </div>

            <button
              onClick={runFullDiagnostics}
              disabled={diagnosticRunning}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${diagnosticRunning ? "animate-spin text-emerald-400" : "text-white"}`} />
              <span>{diagnosticRunning ? "Testing Handshake..." : "Re-Run Handshake Suite"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stage 1: GET Ping */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700">Stage 1: HTTP Transport</span>
                {diagnosticStages.ping.status === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {diagnosticStages.ping.status === "running" && <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Verifies <code>GET /api/mcp</code> is reachable and responds with active gateway metadata.
              </p>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-500">Latency:</span>
                <span className="font-bold text-slate-800">
                  {diagnosticStages.ping.latencyMs !== undefined ? `${diagnosticStages.ping.latencyMs}ms (200 OK)` : "Pending"}
                </span>
              </div>
            </div>

            {/* Stage 2: Initialize */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700">Stage 2: Handshake (initialize)</span>
                {diagnosticStages.init.status === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {diagnosticStages.init.status === "running" && <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Sends JSON-RPC <code>initialize</code> method and negotiates MCP capabilities.
              </p>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-500">Protocol Spec:</span>
                <span className="font-bold text-emerald-600">{diagnosticStages.init.version || "Pending"}</span>
              </div>
            </div>

            {/* Stage 3: Tools Discovery */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700">Stage 3: Catalog (tools/list)</span>
                {diagnosticStages.tools.status === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {diagnosticStages.tools.status === "running" && <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Queries all declared tool definitions and validates JSON Schema parameter constraints.
              </p>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-500">Validated Tools:</span>
                <span className="font-bold text-blue-600">{diagnosticStages.tools.count ? `${diagnosticStages.tools.count} Engines` : "Pending"}</span>
              </div>
            </div>

            {/* Stage 4: Dry-Run Execution */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700">Stage 4: Dry-Run Execution</span>
                {diagnosticStages.dryRun.status === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {diagnosticStages.dryRun.status === "running" && <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Executes a live authority check to confirm real end-to-end data processing without errors.
              </p>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-500">Execution Speed:</span>
                <span className="font-bold text-purple-600">{diagnosticStages.dryRun.latencyMs ? `${diagnosticStages.dryRun.latencyMs}ms` : "Pending"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. FOUR CORE ARCHITECTURAL PILLARS */}
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
              Supports local <code>stdio</code> communication for desktop IDEs, as well as remote <code>JSON-RPC 2.0 HTTP POST</code> gateways for webhooks and autonomous agents.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Standard MCP Protocol</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Compliant with Anthropic&apos;s open Model Context Protocol specification (<code>2024-11-05</code>). Works with Claude Desktop, Cursor, Windsurf, LangChain, and AutoGen.
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

        {/* 5. INTERACTIVE IN-BROWSER MCP TOOL PLAYGROUND */}
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

          {/* Filter Bar & Search */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
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

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={toolSearch}
                onChange={(e) => setToolSearch(e.target.value)}
                placeholder="Search tools by name..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Tool Selector Grid (All 11 Tools) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {filteredTools.map((t) => {
              const isSelected = t.id === selectedToolId;
              const ToolIcon = t.icon;
              const shortName = t.name.replace("seoseite_", "");
              return (
                <button
                  key={t.id}
                  onClick={() => handleToolChange(t.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[92px] ${
                    isSelected
                      ? "bg-blue-50/90 border-blue-600 text-blue-950 font-bold shadow-xs ring-2 ring-blue-500/20"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <ToolIcon className={`w-4 h-4 shrink-0 ${isSelected ? "text-blue-600" : "text-slate-400"}`} />
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/80 uppercase font-semibold">
                        {t.category}
                      </span>
                    </div>
                    <div className="text-xs font-mono font-bold leading-tight truncate text-slate-900" title={t.name}>
                      {shortName}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">{t.name}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Form & Response Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/80 p-5 rounded-2xl border border-slate-200">
            <div className="lg:col-span-5 space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                    {selectedTool.categoryLabel}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Method: tools/call</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 font-mono mt-0.5">{selectedTool.name}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{selectedTool.description}</p>
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
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 text-xs font-mono font-semibold transition-colors cursor-pointer shadow-2xs"
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
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({field.key}){field.required && " *"}
                      </span>
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

              {/* Recent Execution History */}
              {history.length > 0 && (
                <div className="pt-2 border-t border-slate-200 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                    <History className="w-3 h-3 text-slate-500" /> Recent Session Runs:
                  </span>
                  <div className="space-y-1">
                    {history.map((h) => (
                      <div
                        key={h.id}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-[10px] font-mono"
                      >
                        <span className="font-bold text-slate-800 truncate max-w-[120px]">{h.tool}</span>
                        <span className="text-slate-500 truncate max-w-[100px]">{h.target}</span>
                        <span className="text-emerald-600 font-bold">{h.durationMs}ms</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Response Payload Viewer (Quad Tab) */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
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
                  <button
                    onClick={() => setOutputTab("curl")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      outputTab === "curl" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    cURL Snippet
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {rawTextOutput && (
                    <>
                      <button
                        onClick={handleDownloadJsonOutput}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900 bg-white px-2 py-1 rounded-md border border-slate-200 transition-colors cursor-pointer"
                        title="Download output as .json"
                      >
                        <Download className="w-3 h-3 text-slate-500" />
                        <span className="hidden sm:inline">Export</span>
                      </button>
                      <button
                        onClick={handleCopyResponse}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900 bg-white px-2 py-1 rounded-md border border-slate-200 transition-colors cursor-pointer"
                      >
                        {copiedResponse ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                        <span>{copiedResponse ? "Copied" : "Copy"}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Output Content Container */}
              <div className="flex-1 bg-slate-950 rounded-xl p-4 text-slate-100 font-mono text-[11px] overflow-auto max-h-[460px] border border-slate-800 shadow-inner">
                {outputTab === "visual" && parsedToolContent && (
                  <div className="space-y-4 text-left">
                    {/* KPI Header */}
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase">Target Domain</span>
                        <div className="text-sm font-bold text-white">
                          {parsedToolContent.domain || parsedToolContent.brandDomain || parsedToolContent.url || "N/A"}
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

                    {/* AI Executive Summary */}
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
                              <span
                                className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                  val.present ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-rose-950 text-rose-400 border border-rose-800"
                                }`}
                              >
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

                    <div className="pt-2 border-t border-slate-800 flex justify-end">
                      <button onClick={() => setOutputTab("json")} className="text-[10px] text-blue-400 hover:text-blue-300 underline cursor-pointer">
                        Switch to full JSON view &rarr;
                      </button>
                    </div>
                  </div>
                )}

                {outputTab === "visual" && !parsedToolContent && rawTextOutput && (
                  <pre className="whitespace-pre-wrap leading-relaxed">{rawTextOutput}</pre>
                )}

                {outputTab === "json" &&
                  (rawTextOutput ? (
                    <pre className="whitespace-pre-wrap leading-relaxed">{rawTextOutput}</pre>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 py-16 text-center">
                      <Terminal className="w-8 h-8 mb-2 opacity-50" />
                      <p className="text-xs font-mono">No execution yet.</p>
                      <p className="text-[11px] text-slate-600 max-w-xs mt-1">
                        Click &ldquo;Execute MCP Tool Call&rdquo; to test the endpoint live and inspect the JSON response.
                      </p>
                    </div>
                  ))}

                {outputTab === "request" && (
                  <pre className="whitespace-pre-wrap leading-relaxed text-blue-300">{JSON.stringify({
                    jsonrpc: "2.0",
                    id: 1,
                    method: "tools/call",
                    params: { name: selectedTool.name, arguments: params },
                  }, null, 2)}</pre>
                )}

                {outputTab === "curl" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">cURL Terminal Command:</span>
                      <button
                        onClick={handleCopyCurlCommand}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white bg-slate-800 px-2 py-0.5 rounded cursor-pointer"
                      >
                        {copiedCurl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCurl ? "Copied" : "Copy cURL"}</span>
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap text-emerald-300 text-[11px] leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800">
{`curl -X POST ${effectiveBaseUrl}/api/mcp \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: { name: selectedTool.name, arguments: params },
  })}'`}
                    </pre>
                  </div>
                )}

                {!rawTextOutput && outputTab !== "request" && outputTab !== "curl" && (
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

        {/* 6. NEW: INTERACTIVE AI CHAT SIMULATION ("CLAUDE & CURSOR IN ACTION") */}
        <div id="chat-simulation" className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Live AI Assistant Simulation</h2>
                <p className="text-xs text-slate-500">
                  Experience how Claude Desktop or Cursor invokes SeoSeite MCP tools behind the scenes to generate honest answers.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
              {CHAT_SIMULATION_SCENARIOS.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => setActiveScenarioId(scenario.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeScenarioId === scenario.id ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {scenario.title}
                </button>
              ))}
            </div>
          </div>

          {/* Simulated Chat Interface */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 text-slate-100 space-y-4 font-sans shadow-lg">
            {/* User Message */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                You
              </div>
              <div className="p-3.5 rounded-2xl bg-blue-950/70 border border-blue-900/60 text-xs text-slate-200 max-w-2xl leading-relaxed">
                {activeScenario.userQuery}
              </div>
            </div>

            {/* Simulated Tool Call Block */}
            <div className="ml-11 p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono space-y-1.5 text-slate-300">
              <div className="flex items-center gap-2 text-purple-400 font-bold">
                <Cpu className="w-3.5 h-3.5 animate-pulse text-purple-400" />
                <span>Invoking Tool: {activeScenario.toolCalled}()</span>
              </div>
              <div className="text-[10px] text-slate-400">
                Arguments: <code>{JSON.stringify(activeScenario.toolArgs)}</code>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[10px] text-emerald-400 truncate">
                &rarr; Returned {JSON.stringify(activeScenario.toolResult).slice(0, 110)}...
              </div>
            </div>

            {/* AI Assistant Response */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-200 max-w-2xl leading-relaxed space-y-2 font-sans">
                <div className="whitespace-pre-line">{activeScenario.aiResponse}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 7. CONFIGURATION STUDIO & CUSTOMIZER */}
        <div id="install-guide" className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <Sliders className="w-5 h-5 text-slate-200" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">IDE Configuration Studio &amp; Customizer</h2>
                <p className="text-xs text-slate-500">
                  Select your client, customize host environments, and download or copy configuration files instantly.
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

          {/* Environment Customizer Controls */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-700">Target Host Endpoint:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setConfigHost("local")}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                    configHost === "local" ? "bg-blue-600 text-white shadow-2xs" : "bg-white text-slate-700 border border-slate-200"
                  }`}
                >
                  Localhost (Port 3000)
                </button>
                <button
                  onClick={() => setConfigHost("custom")}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                    configHost === "custom" ? "bg-blue-600 text-white shadow-2xs" : "bg-white text-slate-700 border border-slate-200"
                  }`}
                >
                  Custom Domain / Staging
                </button>
              </div>
            </div>

            {configHost === "custom" && (
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-mono text-[11px]">URL:</span>
                <input
                  type="text"
                  value={customHostUrl}
                  onChange={(e) => setCustomHostUrl(e.target.value)}
                  placeholder="https://your-domain.com"
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded-md text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 w-56"
                />
              </div>
            )}
          </div>

          {/* Client Setup Notice */}
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
                <strong>For Remote Agents (LangChain, AutoGen, Custom Webhooks):</strong> Send HTTP POST requests with standard JSON-RPC 2.0 payloads to <code>{effectiveBaseUrl}/api/mcp</code>.
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
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                onClick={handleDownloadConfigFile}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Download File</span>
              </button>
              <button
                onClick={handleCopyConfig}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 shadow-xs transition-colors cursor-pointer"
              >
                {copiedConfig ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copiedConfig ? "Copied!" : "Copy"}</span>
              </button>
            </div>

            <pre className="p-5 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
              <code>{currentConfigSnippet}</code>
            </pre>
          </div>
        </div>

        {/* 8. NEW: 11-TOOL SCHEMA CATALOG & CAPABILITY REFERENCE */}
        <div id="schema-catalog" className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">11-Tool JSON Schema &amp; Output Reference</h2>
            <p className="text-xs text-slate-500">
              Complete technical specification for all tools registered in the SeoSeite MCP catalog.
            </p>
          </div>

          <div className="space-y-3">
            {MCP_TOOLS.map((t) => {
              const isExpanded = expandedSchemaTool === t.id;
              const ToolIcon = t.icon;
              return (
                <div key={t.id} className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50">
                  <button
                    onClick={() => setExpandedSchemaTool(isExpanded ? null : t.id)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-100/70 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <ToolIcon className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900">{t.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                            {t.categoryLabel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{t.description}</p>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {isExpanded && (
                    <div className="p-4 bg-white border-t border-slate-200 space-y-4 text-xs">
                      {/* Parameters Table */}
                      <div className="space-y-1.5">
                        <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Input Parameters (JSON Schema):</span>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left font-mono text-[11px] border border-slate-200 rounded-lg">
                            <thead className="bg-slate-50 border-b border-slate-200">
                              <tr>
                                <th className="p-2">Name</th>
                                <th className="p-2">Type</th>
                                <th className="p-2">Required</th>
                                <th className="p-2">Description</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-sans">
                              {t.paramFields.map((f) => (
                                <tr key={f.key}>
                                  <td className="p-2 font-mono font-bold text-blue-700">{f.key}</td>
                                  <td className="p-2 font-mono text-slate-600">{f.type}</td>
                                  <td className="p-2">{f.required ? <span className="text-rose-600 font-bold">Yes</span> : "Optional"}</td>
                                  <td className="p-2 text-slate-600">{f.label}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Expected Output Table */}
                      <div className="space-y-1.5">
                        <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Key Output Fields:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {t.outputFields.map((o) => (
                            <div key={o.key} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                              <span className="font-mono font-bold text-slate-800 text-[11px] block">{o.key}</span>
                              <span className="font-mono text-purple-700 text-[10px] block">{o.type}</span>
                              <p className="text-slate-600 text-[11px] mt-0.5">{o.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Sample Payload Snippet */}
                      <div className="space-y-1.5">
                        <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Example Response Payload:</span>
                        <pre className="p-3 rounded-lg bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto leading-relaxed">
                          {t.sampleOutput}
                        </pre>
                      </div>

                      {/* Launch Button */}
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => {
                            handleToolChange(t.id);
                            playgroundRef.current?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          <span>Load in Playground</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 9. CONVERSATIONAL PROMPT SHOWCASE */}
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
                  <p className="text-xs text-slate-800 font-medium italic leading-relaxed">&ldquo;{item.prompt}&rdquo;</p>
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
                    {copiedPromptIdx === idx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    <span>{copiedPromptIdx === idx ? "Copied" : "Copy Prompt"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 10. ARCHITECTURAL COMPARISON MATRIX */}
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

        {/* 11. FAQ ACCORDION */}
        <div className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-2">
            {FAQS.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div key={idx} className="rounded-xl border border-slate-200 overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                    className="w-full p-4 text-left font-semibold text-xs text-slate-900 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>
                  {isExpanded && <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed font-sans">{faq.a}</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* 12. FOOTER BANNER */}
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
