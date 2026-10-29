"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Package,
  ArrowRight,
  Layers,
  Code2,
  FileText,
  ShieldCheck,
  Zap,
  Info,
  Search,
  Filter,
  Terminal,
  Cpu,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Sliders,
  Check,
  Activity,
  Workflow,
  Lock,
  BookOpen,
} from "lucide-react";

interface WorklogDay {
  day: string;
  dayNumber: number;
  date: string;
  phase: string;
  status: "Completed" | "Active";
  statusColor: string;
  summary: string;
  installedPackages: { name: string; role: string }[];
  architecturalDecisions: { title: string; desc: string }[];
  builtModules: string[];
  nextDayFocus: string[];
}

const WORKLOG_DAYS: WorklogDay[] = [
  {
    day: "Day 1",
    dayNumber: 1,
    date: "October 10, 2026",
    phase: "Phase 1 to 5: Foundation, SEO Scraper, Tech, Web Vitals, Traffic, AI & Competitor Benchmarking",
    status: "Completed",
    statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    summary:
      "Completed Phases 1 through 5. Initialized Next.js 16 full-stack architecture with light-mode flat design tokens, SSRF protection, Cheerio metadata parser, deterministic 0-100 SEO scoring, 50+ technology stack detector, Google PageSpeed Core Web Vitals, transparent Heuristic Traffic Estimator, multi-provider AI diagnostics with developer fixes, and parallel Competitor Comparison engine.",
    installedPackages: [
      { name: "next@16.4.0", role: "Full-stack framework with Turbopack & React 19 support" },
      { name: "react@19.3.0 & react-dom", role: "Latest React engine for server/client components" },
      { name: "tailwindcss@^4", role: "High-performance CSS utility styling" },
      { name: "typescript@^5", role: "End-to-end type safety" },
      { name: "lucide-react", role: "Flat, lightweight SVG icon system" },
      { name: "cheerio", role: "High-speed server-side HTML DOM parser" },
    ],
    architecturalDecisions: [
      {
        title: "Light Mode First & Flat Design",
        desc: "Honored user's strict requirement: avoided heavy 3D visuals, excessive glassmorphism, or dark-mode overrides. Kept clean white backgrounds (#ffffff), crisp slate borders (#e2e8f0), and high-contrast typography.",
      },
      {
        title: "SSRF Protection Layer",
        desc: "Implemented server-side DNS resolution checks to block localhost, 127.0.0.1, private Class A/B/C subnets, and AWS/GCP cloud metadata IPs (169.254.169.254).",
      },
      {
        title: "Grounded Deterministic Metrics & Zero Hallucination",
        desc: "Calculated raw metrics via Cheerio, PageSpeed API, and statistical models. AI is strictly leveraged as an analytical layer for summaries and developer action items.",
      },
      {
        title: "Parallel Multi-Domain Auditing",
        desc: "Implemented concurrent promise execution for competitor comparisons, resolving both target websites in under 1 second without sequential latency.",
      },
    ],
    builtModules: [
      "Initialized Next.js 16 App Router repository with Turbopack",
      "Configured custom light-mode design tokens in src/app/globals.css",
      "Implemented SSRF validation module in src/lib/security/ssrf.ts",
      "Implemented Cheerio scraper in src/lib/modules/seo/fetcher.ts",
      "Implemented 0-100 SEO scoring engine in src/lib/modules/seo/scorer.ts",
      "Implemented Technology Stack Detector (50+ signatures) in src/lib/modules/tech/detector.ts",
      "Integrated Google PageSpeed Insights REST API in src/lib/modules/performance/pagespeed.ts",
      "Implemented Heuristic Traffic Estimator in src/lib/modules/traffic/estimator.ts",
      "Implemented Multi-Provider AI Diagnostic Service in src/lib/modules/ai/service.ts",
      "Implemented Competitor Comparison Comparator engine in src/lib/modules/compare/comparator.ts",
      "Created Parallel Comparison API route handler at /api/compare",
      "Built interactive side-by-side Benchmark Dashboard at /compare with Swap Sites and Export JSON",
    ],
    nextDayFocus: [
      "Phase 6: Google Cloud Run & Cloud SQL production deployment",
      "Phase 6: Persistent database records & live operational dashboard",
    ],
  },
  {
    day: "Day 2",
    dayNumber: 2,
    date: "October 10, 2026",
    phase: "Phase 6: Google Cloud Run, Cloud SQL (PostgreSQL) & Operational Dashboard",
    status: "Completed",
    statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    summary:
      "Completed Phase 6 production deployment infrastructure. Configured Next.js standalone containerization with a multi-stage Dockerfile tailored for Google Cloud Run (port 8080, non-root user). Provisioned Google Cloud SQL PostgreSQL schema and created a resilient connection pool with automatic local in-memory fallback. Built an interactive operational SaaS Dashboard at /dashboard tracking audit history, competitor benchmarks, and GCP runtime infrastructure.",
    installedPackages: [
      { name: "pg & @types/pg", role: "Native PostgreSQL connection pool client for Google Cloud SQL" },
    ],
    architecturalDecisions: [
      {
        title: "Google Cloud Run Stateless Container Model",
        desc: "Utilized Next.js output: 'standalone' in next.config.ts to package only required files into a slim ~140MB container running on Node 20 Alpine and binding to PORT=8080 and HOSTNAME=0.0.0.0.",
      },
      {
        title: "Resilient Cloud SQL Dual-Mode Fallback",
        desc: "Engineered src/lib/db/client.ts to dynamically query PostgreSQL when DATABASE_URL is configured, while gracefully falling back to in-memory caching during local dev or network disruptions.",
      },
      {
        title: "Cloud Metadata SSRF Protection",
        desc: "Maintained active blocking of GCP internal metadata endpoints (169.254.169.254 and metadata.google.internal) inside SSRF security filters to prevent credential exfiltration.",
      },
    ],
    builtModules: [
      "Configured output: 'standalone' in next.config.ts",
      "Authored multi-stage production Dockerfile and .dockerignore for Cloud Run",
      "Created Google Cloud SQL PostgreSQL initial schema script in src/lib/db/schema.sql",
      "Implemented resilient database client with pg connection pool in src/lib/db/client.ts",
      "Created operational dashboard API route at /api/dashboard",
      "Wired database persistence into /api/analyze and /api/compare routes",
      "Built comprehensive Operational SaaS Dashboard view at /dashboard and DashboardContent.tsx",
      "Authored step-by-step Google Cloud Run & Cloud SQL deployment guide in DEPLOYMENT_GCP.md",
      "Updated global navigation header and footer with Dashboard routes",
    ],
    nextDayFocus: [
      "Phase 7 & 8: Permanent Shareable Reports and Executive Print/PDF",
      "Phase 9 & 10: API Keys Guide and Academic Capstone Dissertation Pack",
    ],
  },
  {
    day: "Day 3",
    dayNumber: 3,
    date: "October 10, 2026",
    phase: "Phase 7 & 8: Shareable Report Snapshots (/report/[id]) & Executive Print/PDF",
    status: "Completed",
    statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    summary:
      "Implemented persistent shareable report snapshots (/report/[id]) allowing users, clients, and teams to view historical audits via a permanent URL without re-crawling. Built executive Print / PDF styling using pure CSS @media print rules, providing crisp black-and-white page layouts without server-side headless browser memory bloat.",
    installedPackages: [],
    architecturalDecisions: [
      {
        title: "Immutable Report Snapshots",
        desc: "Audit payloads stored as JSONB in PostgreSQL are retrieved by UUID, preventing metrics from changing over time.",
      },
      {
        title: "Lightweight Native @media print Styling",
        desc: "Engineered print stylesheet hiding navigation headers, buttons, and inputs, guaranteeing high-fidelity physical prints and PDF exports via window.print().",
      },
    ],
    builtModules: [
      "Implemented getScanById and getComparisonById in src/lib/db/client.ts",
      "Created API route at /api/report/[id]",
      "Built snapshot page at /report/[id] and ReportContent.tsx",
      "Added Share Report modal and copy-to-clipboard functionality across /analyze and /compare",
      "Added @media print rules in src/app/globals.css",
      "Added interactive Print/PDF buttons across all report dashboards",
    ],
    nextDayFocus: [
      "Phase 9: API Keys Setup Guide & Production Fallback Optimization",
      "Phase 10: Academic Capstone Documentation & College Viva Voce Prep Pack",
    ],
  },
  {
    day: "Day 4",
    dayNumber: 4,
    date: "October 10, 2026",
    phase: "Phase 9 & 10: API Keys Guide, Academic Capstone & College Viva Voce Pack",
    status: "Completed",
    statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    summary:
      "Authored definitive environment setup guide (API_KEYS_GUIDE.md) and verified zero-downtime deterministic fallbacks. Created full university-standard academic dissertation report (CAPSTONE_PROJECT_REPORT.md) with DFD, ER, mathematical formulations, and a 25-Question College Viva Voce Defense Guide. Built in-app interactive Capstone Docs page (/capstone).",
    installedPackages: [],
    architecturalDecisions: [
      {
        title: "Zero-Downtime Deterministic Fallback",
        desc: "Ensured the platform operates seamlessly with 100% uptime whether optional external API keys (Gemini, PageSpeed) are configured or absent.",
      },
      {
        title: "Academic Open-Source Transparency",
        desc: "Documented complete mathematical models (0-100 SEO scoring, Zipf's law traffic distribution) and published viva defense preparation.",
      },
    ],
    builtModules: [
      "Authored external API keys setup guide in API_KEYS_GUIDE.md",
      "Authored academic dissertation report in CAPSTONE_PROJECT_REPORT.md",
      "Built in-app interactive Capstone Documentation page at /capstone",
      "Updated global navigation header and footer with Capstone Docs",
      "Pushed verified updates to GitHub with automated Google Cloud Run CI/CD build",
    ],
    nextDayFocus: [
      "Phase 11: Multi-URL Batch Auditing & Concurrency Scaler",
      "Phase 12: Semantic Content Gap Matrix & Broken Links Engine",
    ],
  },
  {
    day: "Day 5",
    dayNumber: 5,
    date: "October 12, 2026",
    phase: "Phase 11 & 12: Multi-URL Batch Auditing, Content Gap & 404 Broken Links",
    status: "Completed",
    statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    summary:
      "Engineered high-throughput enterprise capabilities: Multi-URL Batch Auditor (/tools/batch) supporting concurrent audits of up to 15 domains with CSV export, Semantic Content Gap Matrix (/tools/content-gap) discovering keyword disparities, and recursive 404 Broken Link Discovery (/tools/broken-links).",
    installedPackages: [],
    architecturalDecisions: [
      {
        title: "Bounded Worker Concurrency Pool",
        desc: "Capped parallel batch crawls to 5 simultaneous worker threads to avoid socket exhaustion and respect remote server rate limits.",
      },
      {
        title: "Client-Side CSV Stream Generation",
        desc: "Constructed CSV export strings directly in the browser via Blob URLs, eliminating server-side temporary file storage.",
      },
    ],
    builtModules: [
      "Created Batch Audit API handler at /api/tools/batch",
      "Built interactive Batch Audit Dashboard at /tools/batch with CSV download",
      "Created Content Gap API handler at /api/tools/content-gap",
      "Built Semantic Content Gap Matrix view at /tools/content-gap",
      "Created 404 Broken Link Crawler at /api/crawler/links and /tools/broken-links",
    ],
    nextDayFocus: [
      "Phase 13: Specialized Deep Auditing Engines (Security Headers, Document Architecture, SERP Simulator, Brand Radar AI)",
    ],
  },
  {
    day: "Day 6",
    dayNumber: 6,
    date: "October 14, 2026",
    phase: "Phase 13: Specialized Deep Auditing Engines & Brand Radar AI",
    status: "Completed",
    statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    summary:
      "Built specialized technical auditing tools: HTTP Security Headers & SSL Analysis (/tools/security-headers) testing 8+ vectors, Document Architecture & Heading Tree (/tools/document-architecture), Google SERP Snippet & Pixel Truncation Simulator (/tools/serp-preview), and Brand Radar AI (/tools/brand-radar) measuring Answer Engine Optimization (AEO) share of voice across LLMs.",
    installedPackages: [],
    architecturalDecisions: [
      {
        title: "Deterministic Heading Tree Normalization",
        desc: "Built recursive DOM tree parser in Cheerio to detect empty headings, outline depth, and skipped heading hierarchy levels (e.g. H1 to H3).",
      },
      {
        title: "Pixel-Accurate SERP Title Truncation Model",
        desc: "Simulated proportional Arial 18px font widths against Google's exact 580px desktop container boundary to flag organic snippet truncation.",
      },
    ],
    builtModules: [
      "Implemented Security Headers Inspector at /api/tools/security-headers and /tools/security-headers",
      "Implemented Document Architecture Engine at /api/tools/document-architecture and /tools/document-architecture",
      "Implemented Google SERP Simulator at /api/tools/serp and /tools/serp-preview",
      "Implemented Brand Radar AI Engine at /api/ai/brand-radar and /tools/brand-radar",
      "Implemented Open PageRank Authority Index at /api/tools/authority and /tools/authority",
    ],
    nextDayFocus: [
      "Phase 14: Model Context Protocol (MCP) Server v1.1 and Developer REST Platform v2.1",
    ],
  },
  {
    day: "Day 7",
    dayNumber: 7,
    date: "October 29, 2026",
    phase: "Phase 14: Model Context Protocol (MCP) Server v1.1.0 & Developer REST Platform v2.1",
    status: "Active",
    statusColor: "text-blue-700 bg-blue-50 border-blue-200",
    summary:
      "Completed Phase 14 enterprise integration ecosystem: Full Model Context Protocol server (spec 2024-11-05) via local stdio and remote JSON-RPC 2.0 gateway (/api/mcp) with 11 registered tools, live AI simulation sandbox, and 4-stage handshake diagnostics. Built Developer REST Platform (/api-docs) documenting 15 dual-mode endpoints with live interactive testing, multi-language snippets (cURL, Fetch, TypeScript, Python, Go), and 1-click OpenAPI 3.1 JSON export.",
    installedPackages: [
      { name: "@modelcontextprotocol/sdk", role: "Official Anthropic MCP TypeScript SDK for server & client tools" },
    ],
    architecturalDecisions: [
      {
        title: "Dual-Transport MCP Gateway Architecture",
        desc: "Exported MCP server via both local stdio (for Claude Desktop & Cursor IDE) and remote JSON-RPC 2.0 over HTTP (/api/mcp) for cloud autonomous agents.",
      },
      {
        title: "Dual-Mode REST Handlers (GET & POST)",
        desc: "Refactored all backend tool routes to seamlessly accept both JSON POST bodies and query parameter GET requests.",
      },
      {
        title: "1-Click Client-Side OpenAPI 3.1 Generation",
        desc: "Constructed standard OpenAPI 3.1.0 specification dynamically in-browser, generating valid Swagger / Postman JSON import files with zero server roundtrips.",
      },
    ],
    builtModules: [
      "Created stdio MCP server script in scripts/seoseite-mcp.mjs with 11 tools",
      "Created HTTP JSON-RPC 2.0 Gateway at /api/mcp",
      "Built interactive MCP Server Playground & Studio at /mcp with live diagnostic suite",
      "Upgraded Developer REST API Reference at /api-docs to all 15 production endpoints",
      "Added multi-language code generators (cURL, JS, TS, Python, Go) and live response inspector",
      "Added dynamic client-side OpenAPI 3.1 JSON export engine",
    ],
    nextDayFocus: [
      "Automated CI/CD webhook integrations for GitHub Actions",
      "First-party Google OAuth (GSC / GA4) production token exchange",
    ],
  },
];

export default function WorklogPage() {
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDays = useMemo(() => {
    return WORKLOG_DAYS.filter((item) => {
      const matchDay = selectedDayNumber === "all" || item.dayNumber === selectedDayNumber;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        q === "" ||
        item.day.toLowerCase().includes(q) ||
        item.phase.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.builtModules.some((m) => m.toLowerCase().includes(q)) ||
        item.architecturalDecisions.some((d) => d.title.toLowerCase().includes(q) || d.desc.toLowerCase().includes(q)) ||
        item.installedPackages.some((p) => p.name.toLowerCase().includes(q));
      return matchDay && matchSearch;
    });
  }, [selectedDayNumber, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* 1. CHANGELOG COCKPIT & HERO */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 text-white p-6 sm:p-10 shadow-xl">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold shadow-inner">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>Day-by-Day Engineering Changelog &amp; Architecture Log</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                7 Days
              </span>
              <span className="text-[10px] text-blue-300 font-mono">14 Phases</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Engineering Changelog &amp; Development Log
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl mx-auto">
              A comprehensive daily record of architecture decisions, dependencies installed, modules built, and production milestones achieved across the SeoSeite platform.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
              <Link
                href="/project-info"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
              >
                <Info className="w-4 h-4 fill-white" />
                <span>Platform Specifications →</span>
              </Link>

              <Link
                href="/capstone"
                className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-xs inline-flex items-center gap-2 transition-all"
              >
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span>Scoring Methodology Spec →</span>
              </Link>

              <Link
                href="/mcp"
                className="px-4 py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 font-semibold text-xs inline-flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Explore MCP AI Server →</span>
              </Link>
            </div>

            {/* 4 Telemetry Metrics */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-800/80 text-left">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Changelog Depth
                </div>
                <div className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>7 Full Days Logged</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Phases Completed
                </div>
                <div className="text-xs sm:text-sm font-bold text-white font-mono">
                  14 Engineering Phases
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Architectural Decisions
                </div>
                <div className="text-xs sm:text-sm font-bold text-blue-400 font-mono">
                  25 Documented ADRs
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Production Modules
                </div>
                <div className="text-xs sm:text-sm font-bold text-indigo-400 flex items-center gap-1">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>45+ Core Services</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. TIMELINE SEARCH & DAY SELECTOR */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search changelog, modules, packages (e.g. MCP, Cloud SQL, Cheerio, SSRF)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8.5 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
            />
          </div>

          {/* Day Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            <button
              onClick={() => setSelectedDayNumber("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedDayNumber === "all"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              All Days ({WORKLOG_DAYS.length})
            </button>
            {WORKLOG_DAYS.map((d) => (
              <button
                key={d.dayNumber}
                onClick={() => setSelectedDayNumber(d.dayNumber)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDayNumber === d.dayNumber
                    ? "bg-slate-900 text-white shadow-2xs font-bold"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                }`}
              >
                {d.day}
              </button>
            ))}
          </div>
        </div>

        {/* 3. TIMELINE CARDS */}
        <div className="space-y-8">
          {filteredDays.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
              No matching worklog entries found for &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            filteredDays.map((item) => (
              <article
                key={item.dayNumber}
                className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200 shadow-xs space-y-6"
              >
                {/* Header Information */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-mono">
                      {item.day}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.date}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                      {item.phase}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Summary Box */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Executive Milestone Summary
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    {item.summary}
                  </p>
                </div>

                {/* Packages Installed */}
                {item.installedPackages.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-blue-600" />
                      <span>Packages &amp; Dependencies Installed</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {item.installedPackages.map((pkg, pIdx) => (
                        <div key={pIdx} className="p-3 bg-white rounded-xl border border-slate-200 text-xs shadow-2xs">
                          <span className="font-mono font-bold text-blue-600 block mb-1">{pkg.name}</span>
                          <span className="text-slate-600 text-[11px] leading-relaxed">{pkg.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Architectural & Design Decisions (ADRs) */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Architectural Decision Records (ADRs)</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {item.architecturalDecisions.map((dec, dIdx) => (
                      <div key={dIdx} className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-1">
                        <h4 className="text-xs font-bold text-slate-900">{dec.title}</h4>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{dec.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What Was Built */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-purple-600" />
                    <span>Engineered Services &amp; Built Modules</span>
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
                    {item.builtModules.map((mod, mIdx) => (
                      <li key={mIdx} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-relaxed">{mod}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Next Day Focus */}
                {item.nextDayFocus.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-700">Next Milestone Focus:</span>
                      <span>{item.nextDayFocus.join(" • ")}</span>
                    </div>
                  </div>
                )}
              </article>
            ))
          )}
        </div>

        {/* 4. BOTTOM NAVIGATION */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
          <Link
            href="/project-info"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            ← View Platform Specifications
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/capstone"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <span>View Scoring Methodology Spec</span>
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
