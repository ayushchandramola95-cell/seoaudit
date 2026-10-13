import Link from "next/link";
import HomeInteractiveShowcase from "@/components/HomeInteractiveShowcase";
import HeroAnimatedDashboard from "@/components/HeroAnimatedDashboard";
import ToolsAnimatedGrid from "@/components/ToolsAnimatedGrid";
import AskAiShowcase from "@/components/AskAiShowcase";
import AiBentoGrid from "@/components/AiBentoGrid";
import IntegrationTicker from "@/components/IntegrationTicker";
import McpTerminalCard from "@/components/McpTerminalCard";
import { 
  Search, 
  Layers, 
  BarChart3, 
  Zap, 
  ShieldCheck, 
  GitCompare, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Lock, 
  Globe2, 
  Activity, 
  Cpu, 
  Share2, 
  Check, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Code2,
  Link2,
  Terminal,
  Radar,
  ListChecks,
  FileSearch,
  Sliders,
  Users,
  Bell,
  Gauge,
  Database,
  Workflow
} from "lucide-react";

export default function Home() {
  const comparisonRows = [
    {
      feature: "Monthly Cost",
      seoseite: "$0 Free Forever / $49 Pro",
      traditional: "$129 – $449 / mo (Ahrefs / Semrush)",
      win: true,
    },
    {
      feature: "Team Member Seats",
      seoseite: "3 Seats on Pro ($0 extra) • Unlimited on Agency",
      traditional: "1 Seat only (+$40 to $80/mo per extra seat!)",
      win: true,
    },
    {
      feature: "Crawl Latency",
      seoseite: "< 100 ms (High-Speed Cheerio Stream)",
      traditional: "4–8 seconds (Heavy Headless Browser)",
      win: true,
    },
    {
      feature: "Model Context Protocol (MCP)",
      seoseite: "Native stdio & HTTP MCP for Claude/Cursor",
      traditional: "Proprietary locked-down API add-on",
      win: true,
    },
    {
      feature: "Data Integrity & Honesty",
      seoseite: "100% Deterministic + Explicit Confidence",
      traditional: "Opaque, black-box traffic estimates",
      win: true,
    },
    {
      feature: "Tech Stack Fingerprinting",
      seoseite: "Included Free (50+ Deep Signatures)",
      traditional: "Requires separate tool (BuiltWith $295/mo)",
      win: true,
    },
    {
      feature: "AI Developer Action Items",
      seoseite: "Google Gemini + Copyable Code Snippets",
      traditional: "Generic, non-actionable text tips",
      win: true,
    },
    {
      feature: "Infrastructure Defense",
      seoseite: "Zero-Trust SSRF & DNS Pinning Shield",
      traditional: "Proprietary / Unknown",
      win: true,
    },
  ];

  const faqs = [
    {
      q: "What makes SeoSeite different from Ahrefs or Semrush?",
      a: "Commercial SEO giants cost $129 to $449 every month and heavily penalize teams by charging $40–$80 for every single extra user seat. SeoSeite provides sub-second deterministic audits, 9 focused standalone micro-tools, Content Gap, and native AI MCP integration at an accessible price ($0 to $49/mo) with zero per-user seat penalties.",
    },
    {
      q: "Can I use the standalone tools without an account?",
      a: "Yes! All 9 standalone tools (Broken Links, Core Web Vitals, Schema Validator, SERP Preview, Tech Detector, Open PageRank, etc.) can be used freely without entering a credit card or creating an account.",
    },
    {
      q: "What is the SeoSeite SEO Model Context Protocol (MCP)?",
      a: "The Model Context Protocol (MCP) lets developers query SeoSeite conversationally inside Claude Desktop, Cursor IDE, or custom autonomous agents. Ask Claude 'Audit https://stripe.com' and it automatically calls SeoSeite's engine for verified JSON diagnostic data.",
    },
    {
      q: "Are the SEO scores and traffic numbers trustworthy?",
      a: "Our 0–100 SEO health score is 100% deterministic and rule-based, calculated directly from your page's live HTML, DOM structure, and HTTP security headers. We never fabricate exact visitor counts and transparently indicate heuristic confidence ratings.",
    },
    {
      q: "How does 24/7 automated monitoring work?",
      a: "Our background cron worker crawls your monitored domains weekly. If your SEO score drops by more than 5 points or dead links are detected, an instant notification is dispatched to your registered Slack or Discord webhook.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-16 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-8 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Sub-Second Crawling • 50+ Frameworks • 9 Standalone Micro-Tools • Zero Hallucinations
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-5xl mx-auto leading-tight sm:leading-tight mb-6">
          Inspect, Benchmark &amp; Optimize <br className="hidden sm:inline" />
          <span className="text-blue-600">Any Website in Sub-Second Time.</span>
        </h1>

        <p className="text-base sm:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
          The deterministic website intelligence platform for modern developers, agencies, and SEO consultants. 
          Uncover technical health, detect 50+ technology stacks, measure real Core Web Vitals, and track AI search visibility with absolute transparency.
        </p>

        {/* Primary Call-to-Actions (Services & Tools Showcase - Replaced Search Box) */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <Link
            href="/tools"
            className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Explore 9 Standalone SEO Tools</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/pricing"
            className="px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800 font-bold text-sm sm:text-base transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Start Free ($0 Forever)</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium pt-1 pb-6">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>&lt; 100ms Crawl Latency</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>No Credit Card Required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Native Claude &amp; Cursor MCP</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Zero-Trust SSRF Defense</span>
          </div>
        </div>

        {/* Interactive Hero Console & Floating Micro-Widgets */}
        <div className="relative mt-4">
          {/* Floating Widget Left (Semrush / SE Ranking style) */}
          <div className="hidden xl:flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xl absolute -left-8 top-16 z-20 animate-float text-left max-w-[210px]">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Cheerio AST</div>
              <div className="text-xs font-bold text-slate-900">68ms Crawl Speed</div>
              <div className="text-[10px] text-emerald-600 font-semibold">Sub-second latency</div>
            </div>
          </div>

          {/* Floating Widget Right (Semrush / SE Ranking style) */}
          <div className="hidden xl:flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xl absolute -right-8 top-28 z-20 animate-float-reverse text-left max-w-[210px]">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Defense Engine</div>
              <div className="text-xs font-bold text-slate-900">Zero-Trust SSRF</div>
              <div className="text-[10px] text-blue-600 font-semibold">DNS Pinning Active</div>
            </div>
          </div>

          {/* Main Hero Interactive Audit Console */}
          <HeroAnimatedDashboard />
        </div>
      </section>

      {/* Live Enterprise Metrics Ribbon (Semrush/SE Ranking Social Proof Bar) */}
      <section className="py-10 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="pt-4 md:pt-0">
              <div className="text-2xl sm:text-3xl font-black text-blue-400 tracking-tight">14 Engines</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-300 mt-1">Deterministic Scans</div>
              <div className="text-[11px] text-slate-500 mt-0.5">DOM, Security, Headers, Schema</div>
            </div>
            <div className="pt-4 md:pt-0 md:pl-6">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">&lt; 100 ms</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-300 mt-1">Average Crawl Time</div>
              <div className="text-[11px] text-slate-500 mt-0.5">High-speed Cheerio stream</div>
            </div>
            <div className="pt-4 md:pt-0 md:pl-6">
              <div className="text-2xl sm:text-3xl font-black text-purple-400 tracking-tight">50+ Stacks</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-300 mt-1">Tech Fingerprinting</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Next.js, React, Cloudflare, Vue</div>
            </div>
            <div className="pt-4 md:pt-0 md:pl-6">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight">$0 Forever</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-300 mt-1">No Per-Seat Fee</div>
              <div className="text-[11px] text-slate-500 mt-0.5">No $80/seat legacy penalties</div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Marquee & 24/7 Autopilot (Inspired by User Image 2 & 3) */}
      <IntegrationTicker />

      {/* "Skip the digging. Just ask." AI Assistant Console (Directly from User Image 4) */}
      <AskAiShowcase />

      {/* AI Search & Modern Visibility Suite Bento Grid (Directly from User Image 5) */}
      <AiBentoGrid />

      {/* Why Engineering & Growth Teams Choose SeoSeite (3 Pillars) */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-2">
            The Modern Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Engineered for Speed, Clarity &amp; Transparency
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Legacy suites charge enterprise rates for bloated dashboards and opaque metrics. SeoSeite gives you fast, verifiable diagnostics built for today&apos;s web workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="interactive-card p-7 bg-white rounded-2xl border border-slate-200/90 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-5">
                <Gauge className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Deterministic Scoring</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Zero fabricated traffic curves or mystery algorithms. Every health grade is mathematically calculated from live DOM elements, HTTP security headers, and Core Web Vitals.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-bold text-blue-600">
              <span>Rule-Based Integrity</span>
              <Check className="w-3.5 h-3.5 ml-1 text-emerald-600" />
            </div>
          </div>

          <div className="interactive-card p-7 bg-white rounded-2xl border border-slate-200/90 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 mb-5">
                <Radar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Brand Radar AI Visibility</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Track how generative AI engines like ChatGPT, Claude, Perplexity, and Google Gemini cite and recommend your brand when customers query buying prompts.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-bold text-purple-600">
              <span>AEO Share of Voice</span>
              <Check className="w-3.5 h-3.5 ml-1 text-emerald-600" />
            </div>
          </div>

          <div className="interactive-card p-7 bg-white rounded-2xl border border-slate-200/90 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-5">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Native Agentic MCP Server</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Run live audits directly inside Claude Desktop and Cursor IDE using our native Model Context Protocol server. Automate SEO checks directly into your dev loop.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-600">
              <span>Claude &amp; Cursor Ready</span>
              <Check className="w-3.5 h-3.5 ml-1 text-emerald-600" />
            </div>
          </div>
        </div>
      </section>

      {/* 9 Standalone Free Micro-Tools Grid (Ahrefs & Semrush Modular Hub) */}
      <section className="py-16 sm:py-20 bg-slate-50/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
                Modular SEO Ecosystem
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                9 Standalone Tools for Focused Jobs
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                No need to wade through a monolithic scan when you only need a quick 404 check or a PageSpeed score. Use each tool individually with zero clutter.
              </p>
            </div>
            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-white px-3.5 py-2.5 rounded-lg border border-slate-200 shadow-sm transition-colors shrink-0"
            >
              Explore Tools Directory Hub
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <ToolsAnimatedGrid />
        </div>
      </section>

      {/* Interactive Live Feature Studio Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-2">
            Interactive Product Studio
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Experience the Engine Before You Run It
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Click through our 5 core capabilities below to see real-world diagnostic previews across technical health, competitive intelligence, AI brand radar, and MCP protocols.
          </p>
        </div>

        <HomeInteractiveShowcase />
      </section>

      {/* SeoSeite vs Traditional Tools Comparison Table */}
      <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-2">
              Why We Built SeoSeite
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
              SeoSeite vs Traditional SEO Platforms
            </h2>
            <p className="text-sm text-slate-600">
              See why modern engineering and growth teams switch from expensive, black-box legacy suites.
            </p>
          </div>

          <div className="flat-card overflow-hidden bg-white shadow-sm border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-900 font-bold">
                    <th className="py-3.5 px-5">Capability / Dimension</th>
                    <th className="py-3.5 px-5 text-blue-700 bg-blue-50/50">SeoSeite Platform</th>
                    <th className="py-3.5 px-5 text-slate-600">Legacy Platforms (Ahrefs / Semrush)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-5 font-semibold text-slate-900">{row.feature}</td>
                      <td className="py-3.5 px-5 font-bold text-blue-700 bg-blue-50/30 flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        {row.seoseite}
                      </td>
                      <td className="py-3.5 px-5 text-slate-600">{row.traditional}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Platform & MCP Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-4">
              <Terminal className="w-3.5 h-3.5" />
              Agentic AI &amp; Developer Integration
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Connect SEO Audits to Claude Desktop, Cursor &amp; CI/CD
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              Modern engineering teams don&apos;t just look at dashboards—they automate them. With SeoSeite&apos;s native Model Context Protocol (MCP) server and REST API, your AI coding assistants can audit URLs and diagnose regressions conversationally.
            </p>

            <div className="space-y-3.5 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Claude Desktop &amp; Cursor IDE:</strong> Audit target domains directly from your coding prompt.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>GitHub Actions CI/CD:</strong> Enforce SEO health thresholds before merging pull requests.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>24/7 Automated Webhooks:</strong> Receive real-time alerts in Slack or Discord if a score drops &gt;5 points.</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Link
                href="/mcp"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-lg transition-colors"
              >
                <Terminal className="w-4 h-4" />
                Explore SEO MCP Server
              </Link>
              <Link
                href="/api-docs"
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-lg border border-slate-300 transition-colors"
              >
                <Code2 className="w-4 h-4" />
                REST API Reference
              </Link>
            </div>
          </div>

          <McpTerminalCard />
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-600">
              Everything you need to know about our deterministic architecture, tools, and pricing.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="flat-card p-5 sm:p-6 bg-white border border-slate-200 rounded-xl">
                <h3 className="text-base font-bold text-slate-900 mb-2 flex items-start gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  {faq.q}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed pl-7">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
