"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ShieldCheck,
  Layers,
  Cpu,
  BarChart,
  Eye,
  Globe,
  Search,
  Zap,
  FileCode2,
  Lock,
  ArrowRight,
  Database,
  Terminal,
  Server,
  BookOpen,
  Sparkles,
  ExternalLink,
  Sliders,
  Filter,
  Activity,
  Play,
  Network,
  Workflow,
  Radio,
} from "lucide-react";

export type FeatureCategory =
  | "all"
  | "audit"
  | "competitive"
  | "performance"
  | "security"
  | "ai"
  | "automation";

interface ProductFeature {
  id: number;
  name: string;
  category: FeatureCategory;
  categoryLabel: string;
  desc: string;
  route: string;
  status: "Live in Production" | "Core Engine";
  badgeColor: string;
}

const PRODUCT_FEATURES: ProductFeature[] = [
  {
    id: 1,
    name: "Full Technical SEO Health Audit",
    category: "audit",
    categoryLabel: "Audit & Health",
    desc: "Deterministic 0-100 scoring across metadata, single H1, heading hierarchy, image alt ratio, and indexability rules.",
    route: "/analyze",
    status: "Live in Production",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: 2,
    name: "Head-to-Head Competitor Compare",
    category: "competitive",
    categoryLabel: "Competitive",
    desc: "Parallel side-by-side URL benchmarking computing score deltas, latency gaps, and unique technology differences.",
    route: "/compare",
    status: "Live in Production",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    id: 3,
    name: "Core Web Vitals & PageSpeed Lab",
    category: "performance",
    categoryLabel: "Performance",
    desc: "Google PageSpeed Insights REST integration measuring FCP, LCP, CLS, and TBT without server Chromium bloat.",
    route: "/tools/speed",
    status: "Live in Production",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    id: 4,
    name: "50+ Technology Stack Detector",
    category: "performance",
    categoryLabel: "Performance",
    desc: "Fingerprints CMS (WordPress, Shopify), frameworks (React, Next.js), CDNs (Cloudflare), and analytics scripts.",
    route: "/tools/tech",
    status: "Live in Production",
    badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  {
    id: 5,
    name: "HTTP Security Headers & SSL Guard",
    category: "security",
    categoryLabel: "Security",
    desc: "Evaluates 8+ critical HTTP security headers (HSTS, CSP, X-Frame-Options, XCTO, Referrer) and SSL transport encryption.",
    route: "/tools/security-headers",
    status: "Live in Production",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    id: 6,
    name: "Document Architecture & Heading Tree",
    category: "audit",
    categoryLabel: "Audit & Health",
    desc: "Builds full H1-H6 outline hierarchy, detects structural defects (skipped levels, missing H1), and computes outline score.",
    route: "/tools/document-architecture",
    status: "Live in Production",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: 7,
    name: "Google SERP Snippet & Pixel Simulator",
    category: "audit",
    categoryLabel: "Audit & Health",
    desc: "Simulates Google desktop/mobile snippets, calculates title pixel width against Google's 580px truncation limit.",
    route: "/tools/serp-preview",
    status: "Live in Production",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: 8,
    name: "Schema.org JSON-LD & Social Card Inspector",
    category: "audit",
    categoryLabel: "Audit & Health",
    desc: "Extracts and validates Schema.org JSON-LD microdata, Open Graph social cards, and Twitter Cards from live HTML.",
    route: "/tools/schema-validator",
    status: "Live in Production",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: 9,
    name: "Open PageRank & Authority Index",
    category: "audit",
    categoryLabel: "Audit & Health",
    desc: "DomCop Open PageRank index query returning 0-10 score, global rank, Moz DA/Ahrefs DR equivalents, and backlink models.",
    route: "/tools/authority",
    status: "Live in Production",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: 10,
    name: "Multi-URL Batch SEO Auditor",
    category: "competitive",
    categoryLabel: "Competitive",
    desc: "Concurrently crawls and audits up to 15 website URLs in parallel with live status, PageRank, and CSV export.",
    route: "/tools/batch",
    status: "Live in Production",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    id: 11,
    name: "Semantic Content Gap & Keyword Matrix",
    category: "competitive",
    categoryLabel: "Competitive",
    desc: "Extracts keyword frequencies and heading topic disparities between target URL and competitor to identify gaps.",
    route: "/tools/content-gap",
    status: "Live in Production",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    id: 12,
    name: "404 Broken Link & Redirect Discovery",
    category: "audit",
    categoryLabel: "Audit & Health",
    desc: "Extracts all internal and external hyperlinks, crawls HTTP status codes, and flags dead 404 links and loops.",
    route: "/tools/broken-links",
    status: "Live in Production",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: 13,
    name: "Brand Radar AI (AEO Share of Voice)",
    category: "ai",
    categoryLabel: "AI & MCP",
    desc: "Simulates buyer intent prompts across ChatGPT, Gemini, Perplexity, and Claude to calculate conversational share of voice.",
    route: "/tools/brand-radar",
    status: "Live in Production",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    id: 14,
    name: "Model Context Protocol (MCP) Server v1.1",
    category: "ai",
    categoryLabel: "AI & MCP",
    desc: "Anthropic MCP server (stdio + HTTP JSON-RPC 2.0) exposing 11 deterministic tool engines to Claude, Cursor, and agents.",
    route: "/mcp",
    status: "Live in Production",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
  },
  {
    id: 15,
    name: "Developer REST Platform & OpenAPI 3.1",
    category: "automation",
    categoryLabel: "Automation",
    desc: "Full developer API documentation, 15 dual-mode endpoints, dynamic code generator, and 1-click OpenAPI 3.1 export.",
    route: "/api-docs",
    status: "Live in Production",
    badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
  },
  {
    id: 16,
    name: "Operational SaaS Dashboard",
    category: "automation",
    categoryLabel: "Automation",
    desc: "Unified analytics dashboard tracking saved website audits, competitor benchmarks, scan history, and system uptime.",
    route: "/dashboard",
    status: "Live in Production",
    badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
  },
  {
    id: 17,
    name: "Permanent Shareable Reports (/report/[id])",
    category: "automation",
    categoryLabel: "Automation",
    desc: "Immutable JSONB PostgreSQL snapshots generating permanent public URLs for clients and team sharing.",
    route: "/report/demo",
    status: "Core Engine",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: 18,
    name: "Executive Print / PDF Export Engine",
    category: "automation",
    categoryLabel: "Automation",
    desc: "Lightweight CSS @media print rules creating black-and-white executive summaries without server headless Chromium memory overhead.",
    route: "/analyze",
    status: "Core Engine",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
];

const PILLARS = [
  {
    title: "Public Website Intelligence",
    description: "Analyze any accessible website without needing credentials or external integrations. Inspects headers, HTML, meta tags, and infrastructure.",
    icon: Globe,
    color: "text-blue-600 bg-blue-50 border-blue-200",
  },
  {
    title: "Rule-Based Technical SEO",
    description: "Deterministic 0-100 scoring based on documented rules (metadata, headings, canonicals, robots.txt, structured data, image alt attributes).",
    icon: Search,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  {
    title: "Core Web Vitals & Performance",
    description: "Integration with Google PageSpeed Insights REST API to measure FCP, LCP, CLS, and TBT without burdening server memory.",
    icon: Zap,
    color: "text-amber-600 bg-amber-50 border-amber-200",
  },
  {
    title: "Heuristic Traffic Estimator",
    description: "Transparent statistical estimation model with confidence intervals. Never fabricates exact visitor numbers or fake historical charts.",
    icon: BarChart,
    color: "text-purple-600 bg-purple-50 border-purple-200",
  },
  {
    title: "Technology Stack Detection",
    description: "Fingerprint scanner checking CMS (WordPress, Shopify), frameworks (Next.js, React, Vue), CDNs (Cloudflare), and analytics scripts.",
    icon: Layers,
    color: "text-cyan-600 bg-cyan-50 border-cyan-200",
  },
  {
    title: "AI Analysis & Actionable Fixes",
    description: "Uses Google Gemini to synthesize deterministic findings, prioritize fixes, and explain technical recommendations for non-technical users.",
    icon: Cpu,
    color: "text-indigo-600 bg-indigo-50 border-indigo-200",
  },
];

const TECH_STACK = [
  { layer: "Framework", tool: "Next.js 16 (App Router)", note: "Full-stack SSR, API routes & React 19 server components" },
  { layer: "Language", tool: "TypeScript 5", note: "End-to-end type safety for scrapers, metrics, and models" },
  { layer: "Styling", tool: "Tailwind CSS v4", note: "Clean, flat modern design tokens with light-mode priority" },
  { layer: "Iconography", tool: "Lucide React", note: "Crisp, flat SVG icons with zero visual clutter" },
  { layer: "HTML Parsing", tool: "Cheerio + Fetch", note: "High-speed sub-second DOM parser with low memory usage (<20MB)" },
  { layer: "Performance API", tool: "Google PageSpeed Insights v5", note: "Cloud-hosted Lighthouse execution without local Chrome overhead" },
  { layer: "AI Reasoning", tool: "Google Gemini 2.5 Flash / Dual Heuristic", note: "Structured diagnosis, zero metric hallucination with offline fallback" },
  { layer: "AI Agent Protocol", tool: "Anthropic Model Context Protocol (MCP)", note: "Official MCP specification (2024-11-05) via stdio + HTTP JSON-RPC 2.0" },
  { layer: "Database Engine", tool: "Google Cloud SQL (PostgreSQL 16)", note: "Persistent relational storage with connection pool and local in-memory fallback" },
  { layer: "Cloud Hosting", tool: "Google Cloud Run (Serverless Container)", note: "Stateless containerization (Docker Node 20 Alpine) with automatic autoscaling" },
  { layer: "Security Guard", tool: "Kernel DNS Pre-flight SSRF Guard", note: "Blocks RFC 1918 private subnets, loopbacks, and cloud metadata (169.254.169.254)" },
];

export default function ProjectInfoPage() {
  const [featureCategory, setFeatureCategory] = useState<FeatureCategory>("all");
  const [featureSearch, setFeatureSearch] = useState("");

  const filteredFeatures = useMemo(() => {
    return PRODUCT_FEATURES.filter((f) => {
      const matchCat = featureCategory === "all" || f.category === featureCategory;
      const q = featureSearch.toLowerCase().trim();
      const matchSearch =
        q === "" ||
        f.name.toLowerCase().includes(q) ||
        f.desc.toLowerCase().includes(q) ||
        f.categoryLabel.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [featureCategory, featureSearch]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* 1. DEVELOPER PLATFORM COCKPIT & HERO */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 text-white p-6 sm:p-10 shadow-xl">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold shadow-inner">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Platform Specifications &amp; Architectural Blueprints</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                18 Tools
              </span>
              <span className="text-[10px] text-blue-300 font-mono">Next.js 16 + React 19</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Full Platform Specifications &amp; Tool Registry
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl mx-auto">
              Complete engineering blueprints, architectural pillars, tech stack, and end-to-end capabilities powering the SeoSeite Intelligence Platform.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
              <a
                href="#features-matrix"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
              >
                <Sliders className="w-4 h-4 fill-white" />
                <span>Explore 18 Live Tools</span>
              </a>

              <Link
                href="/capstone"
                className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-xs inline-flex items-center gap-2 transition-all"
              >
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span>Scoring Methodology Spec →</span>
              </Link>

              <Link
                href="/worklog"
                className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-xs inline-flex items-center gap-2 transition-all"
              >
                <Terminal className="w-4 h-4 text-slate-400" />
                <span>Engineering Changelog →</span>
              </Link>
            </div>

            {/* 4 Telemetry Metrics */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-800/80 text-left">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Active Capabilities
                </div>
                <div className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>18 Production Engines</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Crawl Latency
                </div>
                <div className="text-xs sm:text-sm font-bold text-white font-mono">
                  &lt; 100ms Cheerio DOM
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Cloud Infrastructure
                </div>
                <div className="text-xs sm:text-sm font-bold text-blue-400 font-mono">
                  Cloud Run + Cloud SQL
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  AI Protocol
                </div>
                <div className="text-xs sm:text-sm font-bold text-indigo-400 flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Anthropic MCP Server</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. CORE ARCHITECTURAL PRINCIPLES */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Core Architectural Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900">Zero Fabricated Metrics</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We never invent visitor counts, backlinks, or search rankings. Every metric has a documented mathematical formulation or statistical estimation method. If verifiable public data is absent, we explicitly show &ldquo;Data unavailable&rdquo;.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900">AI is an Interpreter, Not Truth</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Deterministic TypeScript code and verified cloud APIs calculate all raw data. Google Gemini is strictly used as an analytical reasoning layer to summarize issues and generate actionable, copyable code fixes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900">Kernel SSRF &amp; Safe Crawling</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                All submitted URLs pass through pre-flight DNS validation. Loopback addresses (<code>127.0.0.1</code>), cloud metadata (<code>169.254.169.254</code>), and private LAN subnets (RFC 1918) are permanently blocked before sockets open.
              </p>
            </div>
          </div>
        </div>

        {/* 3. THE 6 PILLARS OF WEBSITE INTELLIGENCE */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              The 6 Pillars of Website Intelligence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
                  <div>
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${pillar.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1.5">{pillar.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{pillar.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. COMPLETE INTERACTIVE FEATURE MATRIX (ALL 18 TOOLS) */}
        <div id="features-matrix" className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-200">
                <FileCode2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Production Tool Directory</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Live Capabilities &amp; Feature Matrix ({filteredFeatures.length} / {PRODUCT_FEATURES.length})
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
              100% Operational
            </span>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search features, tools, security headers, MCP, batch..."
                value={featureSearch}
                onChange={(e) => setFeatureSearch(e.target.value)}
                className="w-full text-xs pl-8.5 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {[
                { id: "all", label: "All Tools" },
                { id: "audit", label: "Audits" },
                { id: "competitive", label: "Competitive" },
                { id: "performance", label: "Performance" },
                { id: "security", label: "Security" },
                { id: "ai", label: "AI & MCP" },
                { id: "automation", label: "Automation" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFeatureCategory(cat.id as FeatureCategory)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    featureCategory === cat.id
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFeatures.map((feature) => (
              <div
                key={feature.id}
                className="p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-all bg-white flex flex-col justify-between gap-3 shadow-2xs group"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                      {feature.categoryLabel}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${feature.badgeColor}`}>
                      {feature.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {feature.id}. {feature.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-slate-400 truncate max-w-[180px]">
                    {feature.route}
                  </span>
                  <Link
                    href={feature.route}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <span>Launch Engine</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. ENGINEERING STACK & TOOLING REGISTRY */}
        <div className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Engineering Stack &amp; Tooling Registry
            </h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                  <th className="p-3 font-bold uppercase tracking-wider text-[11px]">Layer</th>
                  <th className="p-3 font-bold uppercase tracking-wider text-[11px]">Technology Selected</th>
                  <th className="p-3 font-bold uppercase tracking-wider text-[11px]">Architectural Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {TECH_STACK.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-900">{row.layer}</td>
                    <td className="p-3 font-mono font-bold text-blue-600 text-[11px]">{row.tool}</td>
                    <td className="p-3 text-slate-600 text-[11px] leading-relaxed">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. BOTTOM NAVIGATION */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
          <Link
            href="/capstone"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            ← View Scoring Methodology Spec
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/worklog"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <span>View Engineering Changelog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/mcp"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explore MCP Server</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
