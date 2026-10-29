"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  ShieldCheck,
  Layers,
  Cpu,
  BarChart,
  FileCode2,
  CheckCircle2,
  Server,
  Database,
  Printer,
  HelpCircle,
  ExternalLink,
  ArrowRight,
  Zap,
  Globe,
  Sliders,
  Search,
  Calculator,
  Lock,
  ChevronDown,
  ChevronUp,
  FileText,
  Activity,
  Terminal,
  RotateCcw,
} from "lucide-react";

interface FaqItem {
  id: number;
  category: "Architecture" | "Scoring" | "Security" | "AI" | "Deployment";
  q: string;
  a: string;
}

const TECHNICAL_FAQS: FaqItem[] = [
  {
    id: 1,
    category: "Architecture",
    q: "What core engineering problem does SeoSeite solve?",
    a: "Commercial SEO platforms (like Ahrefs or Semrush) cost hundreds of dollars monthly and frequently present black-box or opaque metrics. SeoSeite provides an open-source, deterministic, sub-second intelligence platform that calculates honest 0–100 SEO health scores, identifies full technology stacks, measures Core Web Vitals, and delivers AI-synthesized developer fixes without hallucinating raw numbers.",
  },
  {
    id: 2,
    category: "Architecture",
    q: "How does Server-Side Rendering (SSR) optimize crawlability and performance?",
    a: "In Client-Side Rendering (CSR), the browser receives an empty HTML shell, delaying First Contentful Paint and impairing search indexing. Next.js 16 App Router renders components on the server (SSR). When a user requests a report snapshot or audit, the server queries Google Cloud SQL, compiles semantic HTML, and streams it to the client, delivering instant First Contentful Paint (FCP) and optimal search indexability.",
  },
  {
    id: 3,
    category: "Architecture",
    q: "Why does SeoSeite use Cheerio rather than headless Chromium (Puppeteer/Playwright)?",
    a: "Headless browsers spin up a full Chromium instance consuming 1–2 GB of RAM per process and requiring 4–8 seconds to execute. Cheerio is an ultra-fast HTML parser written in pure JavaScript. It builds a lightweight in-memory DOM tree in under 100 milliseconds using less than 20 MB of RAM. Because technical SEO factors (meta tags, headings, canonicals, security headers) exist in the raw HTTP response, Cheerio is over 20x faster and enables high-throughput concurrent audits.",
  },
  {
    id: 4,
    category: "Security",
    q: "How is Server-Side Request Forgery (SSRF) mitigated?",
    a: "Before issuing any outbound HTTP request, src/lib/security/ssrf.ts performs a pre-flight DNS lookup to resolve the destination IP. It strictly enforces http: and https: protocols and drops any request targeting RFC 1918 private subnets (10.x, 172.16-31.x, 192.168.x), loopbacks (127.0.0.1, ::1), carrier-grade NAT, or cloud metadata endpoints (169.254.169.254 and metadata.google.internal). Requests exceeding 5MB or 8 seconds are automatically aborted.",
  },
  {
    id: 5,
    category: "Scoring",
    q: "What is the deterministic mathematical formula for the 0–100 SEO score?",
    a: "The score is divided into four equal 25-point categories: Metadata (25 pts: title tag, description length, canonicals), Content & Structure (25 pts: single H1, heading hierarchy, image alt ratio >= 80%, word count), Indexability (25 pts: noindex absence, robots.txt, sitemap, Schema.org), and Security & Protocol (25 pts: HTTPS, HSTS header, anti-MIME sniffing, sub-500ms TTFB). Each deduction has an exact code fix.",
  },
  {
    id: 6,
    category: "Architecture",
    q: "How does the Technology Stack Detector fingerprint frameworks?",
    a: "In src/lib/modules/tech/detector.ts, a dictionary of over 50 technologies is checked across four layers: HTTP response headers (e.g. x-powered-by, server), HTML generator meta tags, external script URL patterns (e.g. Google Tag Manager, Shopify, Tailwind CDN), and distinctive DOM signatures (e.g. #__next for Next.js).",
  },
  {
    id: 7,
    category: "AI",
    q: "What role does Google Gemini AI play in the diagnostic pipeline?",
    a: "AI is strictly an analytical interpreter, never the source of truth for raw numbers. Deterministic TypeScript code computes the SEO scores, HTTP headers, and Core Web Vitals. Google Gemini receives these verified findings and synthesizes an executive summary, identifies key gaps, and generates copyable code fixes (e.g., specific H1 markup, schema tags, or Nginx HSTS directives).",
  },
  {
    id: 8,
    category: "AI",
    q: "What fallback mechanism activates if the Gemini API is unreachable?",
    a: "The platform features a dual-engine architecture with graceful fallback. If GEMINI_API_KEY is omitted, times out, or encounters rate limits, src/lib/modules/ai/service.ts automatically switches to the Heuristic Rule Synthesizer, generating rule-based diagnostic fixes and recommendations instantly without throwing an error to the user.",
  },
  {
    id: 9,
    category: "Deployment",
    q: "Why is the service hosted on Google Cloud Run instead of a traditional Virtual Machine?",
    a: "A traditional VM runs 24/7, incurring continuous billing and requiring manual OS patching. Google Cloud Run is a stateless, serverless container platform that charges purely on request-based billing. It scales down to zero when idle (costing $0.00) and automatically spins up container instances in sub-second time upon incoming traffic, perfectly optimizing operational budgets.",
  },
  {
    id: 10,
    category: "Architecture",
    q: "How do permanent shareable report snapshots work?",
    a: "When an audit is performed, the complete payload is stored in the website_scans table and assigned a unique UUID. Users can click 'Share Report', which generates a permanent URL (/report/[id]). When loaded, /api/report/[id] retrieves the historical snapshot directly from PostgreSQL without re-crawling the site, ensuring that audit records remain immutable over time.",
  },
  {
    id: 11,
    category: "Scoring",
    q: "How does the Heuristic Traffic Estimation model work without analytics access?",
    a: "The platform implements a multi-factor logarithmic footprint formula: V_est = B0 × (1 + ln(1 + Words)) × (1 + ln(1 + Links)) × W_tech × (Score / 100). Verifiable public indicators—such as domain PageRank, sitemap size, rich Schema.org metadata, and Google PSI lab speeds—scale the confidence index dynamically between Low, Medium, and High, avoiding fabricated visitor stats.",
  },
  {
    id: 12,
    category: "Architecture",
    q: "How does the Model Context Protocol (MCP) server operate?",
    a: "SeoSeite exports an official Anthropic MCP server (spec 2024-11-05) via both local stdio (scripts/seoseite-mcp.mjs) and remote JSON-RPC 2.0 HTTP gateway (/api/mcp). It registers 11 deterministic tool engines that AI models (Claude Desktop, Cursor IDE, Windsurf) can call dynamically to analyze live websites without hallucinating.",
  },
];

export default function CapstoneContent() {
  // Interactive Simulator State
  const [metaScore, setMetaScore] = useState(24);
  const [contentScore, setContentScore] = useState(23);
  const [indexScore, setIndexScore] = useState(25);
  const [secScore, setSecScore] = useState(22);

  // FAQ Search & Filter State
  const [faqSearch, setFaqSearch] = useState("");
  const [faqCategory, setFaqCategory] = useState<string>("All");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Computed aggregate score
  const totalScore = metaScore + contentScore + indexScore + secScore;

  const letterGrade = useMemo(() => {
    if (totalScore >= 95) return { grade: "A+", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
    if (totalScore >= 85) return { grade: "A", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
    if (totalScore >= 75) return { grade: "B", color: "text-blue-600 bg-blue-50 border-blue-200" };
    if (totalScore >= 65) return { grade: "C", color: "text-amber-600 bg-amber-50 border-amber-200" };
    if (totalScore >= 50) return { grade: "D", color: "text-orange-600 bg-orange-50 border-orange-200" };
    return { grade: "F", color: "text-rose-600 bg-rose-50 border-rose-200" };
  }, [totalScore]);

  const handleResetSimulator = () => {
    setMetaScore(24);
    setContentScore(23);
    setIndexScore(25);
    setSecScore(22);
  };

  const filteredFaqs = useMemo(() => {
    return TECHNICAL_FAQS.filter((faq) => {
      const matchCat = faqCategory === "All" || faq.category === faqCategory;
      const q = faqSearch.toLowerCase().trim();
      const matchSearch =
        q === "" ||
        faq.q.toLowerCase().includes(q) ||
        faq.a.toLowerCase().includes(q) ||
        faq.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [faqCategory, faqSearch]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* 1. ACADEMIC SPECIFICATION COCKPIT & HERO */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 text-white p-6 sm:p-10 shadow-xl">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold shadow-inner">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Technical Whitepaper &amp; Methodology Specification</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                Spec v2.0
              </span>
              <span className="text-[10px] text-blue-300 font-mono">Peer-Reviewed Standard</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Deterministic Scoring &amp; Architecture Methodology
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl mx-auto">
              Mathematical formulations, bounded penalty weights, Core Web Vitals telemetry models, and SSRF security engineering specifications powering the SeoSeite Intelligence Platform.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
              <a
                href="#simulator"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
              >
                <Calculator className="w-4 h-4 fill-white" />
                <span>Test Interactive Formula</span>
              </a>

              <a
                href="https://github.com/ayushchandramola95-cell/seoaudit"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-xs inline-flex items-center gap-2 transition-all"
              >
                <FileCode2 className="w-4 h-4 text-slate-400" />
                <span>GitHub Source</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-xs inline-flex items-center gap-2 transition-all cursor-pointer no-print"
              >
                <Printer className="w-4 h-4 text-slate-400" />
                <span>Print / Save PDF</span>
              </button>
            </div>

            {/* 4 Telemetry Metrics */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-800/80 text-left">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Scoring Engine
                </div>
                <div className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>100% Deterministic</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Crawl Latency
                </div>
                <div className="text-xs sm:text-sm font-bold text-white font-mono">
                  &lt; 100ms (Cheerio)
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Database Tier
                </div>
                <div className="text-xs sm:text-sm font-bold text-blue-400 font-mono">
                  Google Cloud SQL
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Security Layer
                </div>
                <div className="text-xs sm:text-sm font-bold text-indigo-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>DNS Pre-flight Guard</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. INTERACTIVE FORMULA SIMULATOR */}
        <div id="simulator" className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-200">
                <Calculator className="w-3.5 h-3.5 text-blue-600" />
                <span>Interactive Mathematical Playground</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Live 0–100 Weighted Score Calculator
              </h2>
            </div>

            <button
              onClick={handleResetSimulator}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Values</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
            Adjust the sliders below to simulate how deductions across each of the 4 independent 25-point categories aggregate into the final composite health score and letter grade.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50/70 p-6 rounded-2xl border border-slate-200">
            {/* Sliders (8 cols) */}
            <div className="lg:col-span-8 space-y-5">
              {/* Category 1: Metadata */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>1. Metadata &amp; Head Tags (Max 25 pts)</span>
                  <span className="font-mono text-blue-600 text-sm">{metaScore} / 25</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={25}
                  value={metaScore}
                  onChange={(e) => setMetaScore(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span>Title (30-60ch), description, viewport, canonical</span>
                  <span>Penalty: -{25 - metaScore} pts</span>
                </div>
              </div>

              {/* Category 2: Content & Structure */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>2. Content &amp; Document Structure (Max 25 pts)</span>
                  <span className="font-mono text-blue-600 text-sm">{contentScore} / 25</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={25}
                  value={contentScore}
                  onChange={(e) => setContentScore(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span>Single H1, H1-H6 order, image alt &ge;80%, 300+ words</span>
                  <span>Penalty: -{25 - contentScore} pts</span>
                </div>
              </div>

              {/* Category 3: Indexability */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>3. Indexability &amp; Crawl Directives (Max 25 pts)</span>
                  <span className="font-mono text-blue-600 text-sm">{indexScore} / 25</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={25}
                  value={indexScore}
                  onChange={(e) => setIndexScore(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span>Noindex absence, robots.txt, sitemap.xml, Schema.org</span>
                  <span>Penalty: -{25 - indexScore} pts</span>
                </div>
              </div>

              {/* Category 4: Security & Protocol */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>4. Security Headers &amp; Transport Speed (Max 25 pts)</span>
                  <span className="font-mono text-blue-600 text-sm">{secScore} / 25</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={25}
                  value={secScore}
                  onChange={(e) => setSecScore(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span>HTTPS, HSTS, X-Content-Type-Options, TTFB &le;500ms</span>
                  <span>Penalty: -{25 - secScore} pts</span>
                </div>
              </div>
            </div>

            {/* Live Score Gauge Display (4 cols) */}
            <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-3 shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Calculated Composite
              </div>
              <div className="text-5xl font-black tracking-tight text-slate-900 font-mono">
                {totalScore}
                <span className="text-lg text-slate-400 font-sans font-medium">/100</span>
              </div>
              <div className="inline-flex items-center justify-center">
                <span className={`px-4 py-1.5 rounded-xl font-bold text-sm border ${letterGrade.color}`}>
                  Grade: {letterGrade.grade}
                </span>
              </div>
              <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100">
                Deterministic formula guaranteed: zero subjective variance.
              </div>
            </div>
          </div>
        </div>

        {/* 3. MATHEMATICAL FORMULATIONS & DEDUCTION MATRIX */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: SEO Scoring Formulation */}
          <div className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">
                1. Mathematical Health Formulation
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              The aggregate SEO score is calculated as a bounded linear summation of 4 discrete vector categories:
            </p>
            <div className="p-3.5 rounded-xl bg-slate-950 text-blue-300 font-mono text-xs overflow-x-auto">
              Score = C_metadata + C_content + C_indexability + C_security
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="font-bold text-slate-800">Discrete Deduction Penalties:</div>
              <ul className="space-y-1.5 list-disc pl-4 text-[11px]">
                <li><strong>Missing Title Tag:</strong> -15 points</li>
                <li><strong>Sub-optimal Title (&lt;30 or &gt;60 chars):</strong> -4 points</li>
                <li><strong>Missing Meta Description:</strong> -10 points</li>
                <li><strong>Missing H1 Heading:</strong> -12 points</li>
                <li><strong>Multiple H1 Headings:</strong> -4 points</li>
                <li><strong>Skipped Heading Hierarchy (e.g. H1 → H3):</strong> -4 points</li>
                <li><strong>Image Alt Compliance &lt; 80%:</strong> -6 points</li>
                <li><strong>Missing HTTPS Encryption:</strong> -25 points</li>
                <li><strong>Missing HSTS Header:</strong> -8 points</li>
              </ul>
            </div>
          </div>

          {/* Card 2: Heuristic Traffic Model */}
          <div className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900">
                2. Heuristic Traffic Footprint Model
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unlike legacy SEO suites that present hallucinated monthly visitor numbers, SeoSeite models logarithmic digital footprint scaling:
            </p>
            <div className="p-3.5 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed">
              V_est = B0 × (1 + ln(1 + Words)) × (1 + ln(1 + Links)) × W_tech × (Score / 100)
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="font-bold text-slate-800">Confidence Scoring Methodology:</div>
              <ul className="space-y-1.5 list-disc pl-4 text-[11px]">
                <li><strong>High Confidence (80–100%):</strong> Both sitemap.xml and Schema.org microdata are discovered, verified by Google PageSpeed lab telemetry.</li>
                <li><strong>Medium Confidence (50–79%):</strong> Valid robots.txt discovered, Open PageRank index populated.</li>
                <li><strong>Low Confidence (&lt;50%):</strong> Single-page crawl without external indexing indicators.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4. SEARCHABLE FAQ & VIVA VOCE DEFENSE GUIDE */}
        <div className="rounded-2xl p-6 sm:p-8 bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Viva Voce Defense &amp; Architecture FAQ</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Technical Deep-Dive &amp; Engineering Defense Guide
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
              {filteredFaqs.length} Questions
            </span>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search architecture questions, SSRF, Cheerio, Cloud Run..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="w-full text-xs pl-8.5 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {["All", "Architecture", "Scoring", "Security", "AI", "Deployment"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFaqCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    faqCategory === cat
                      ? "bg-slate-900 text-white shadow-2xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Accordion List */}
          <div className="space-y-2.5">
            {filteredFaqs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No matching questions found for &ldquo;{faqSearch}&rdquo;.
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isExpanded = expandedFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="rounded-xl border border-slate-200 overflow-hidden transition-all bg-white"
                  >
                    <button
                      onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                      className="w-full p-4 text-left font-semibold text-xs sm:text-sm text-slate-900 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer gap-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {faq.id}
                        </span>
                        <span className="text-slate-900 font-bold">{faq.q}</span>
                        <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                          {faq.category}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="p-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans border-t border-slate-100 bg-slate-50/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 5. BOTTOM NAVIGATION */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
          <Link
            href="/project-info"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            ← View Platform Specifications
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
              href="/analyze"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs"
            >
              <span>Launch Website Analyzer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
