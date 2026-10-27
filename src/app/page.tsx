import Link from "next/link";
import UrlAnalyzerInput from "@/components/UrlAnalyzerInput";
import HomeInteractiveShowcase from "@/components/HomeInteractiveShowcase";
import HeroAnimatedDashboard from "@/components/HeroAnimatedDashboard";
import ToolsAnimatedGrid from "@/components/ToolsAnimatedGrid";
import LiveScoreSimulator from "@/components/LiveScoreSimulator";
import AskAiShowcase from "@/components/AskAiShowcase";
import AiBentoGrid from "@/components/AiBentoGrid";
import IntegrationTicker from "@/components/IntegrationTicker";
import McpTerminalCard from "@/components/McpTerminalCard";
import StrategicWorkflowSection from "@/components/StrategicWorkflowSection";
import HomeFaqAccordion from "@/components/HomeFaqAccordion";
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
      q: "What makes SEO Audit different from Ahrefs or Semrush?",
      a: "Commercial SEO giants cost $129 to $449 every month and heavily penalize teams by charging $40–$80 for every single extra user seat. SEO Audit provides an all-in-one SEO and website intelligence platform with sub-second deterministic audits, 9 specialized growth engines, Content Gap, Brand Radar AI, and native MCP automation at an accessible price ($0 to $49/mo) with zero seat penalties.",
    },
    {
      q: "Can I use the standalone engines without an account?",
      a: "Yes! All 9 specialized engines (Broken Links, Core Web Vitals, Schema Validator, SERP Preview, Tech Detector, Open PageRank, Brand Radar, Content Gap, Batch Auditor) can be used freely without entering a credit card or creating an account.",
    },
    {
      q: "What is the SEO Audit SEO Model Context Protocol (MCP)?",
      a: "The Model Context Protocol (MCP) lets developers query SEO Audit conversationally inside Claude Desktop, Cursor IDE, or custom autonomous agents. Ask Claude 'Audit https://stripe.com' and it automatically calls SEO Audit's engine for verified JSON diagnostic data.",
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
      {/* Hero Section with Radial Grid Backdrop, Multi-Mode Live Domain Input & Auto-Cycling Console */}
      <section className="relative overflow-hidden pt-12 sm:pt-16 pb-16 px-4 sm:px-6 lg:px-8 text-center border-b border-slate-200 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px]">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 via-white/85 to-white pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blue-200 text-blue-700 text-xs font-bold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>All-in-One SEO Platform • Sub-Second Crawls • AI Search Visibility • Zero Hallucinations</span>
          </div>

          {/* Hero Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-5xl mx-auto leading-tight sm:leading-tight mb-5">
            The Modern AI SEO &amp; Website Intelligence <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Platform for High-Growth Teams.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Audit technical health in sub-seconds, outrank competitors with semantic content gaps, benchmark Core Web Vitals, and dominate brand visibility across AI search engines — with 100% deterministic transparency.
          </p>

          {/* Interactive Multi-Mode Live URL Analyzer Input */}
          <div className="mb-8">
            <UrlAnalyzerInput />
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

      {/* Interactive Live Feature Studio Workbench (Moved Up for Maximum Impact) */}
      <section id="workbench" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-2">
            Interactive Product Workbench
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Experience the Complete SEO Engine Before You Run It
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Click through our 5 core growth and diagnostic pillars with real-world live telemetry previews across technical health, competitive intelligence, AI brand radar, and MCP protocols.
          </p>
        </div>

        <HomeInteractiveShowcase />
      </section>

      {/* The Complete SEO Suite: 9 Specialized Growth & Technical Engines (With Category Filter Tabs) */}
      <section className="py-16 sm:py-20 bg-slate-50/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
                Complete Modular SEO Suite
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                9 Specialized Growth &amp; Technical Engines
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                From hyperlink crawl forensics to generative AI brand radar, deploy dedicated sub-second diagnostic engines tailored for modern web engineering and organic search.
              </p>
            </div>
            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs transition-colors shrink-0"
            >
              Explore All 9 SEO Engines
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <ToolsAnimatedGrid />
        </div>
      </section>

      {/* Interactive Before & After SEO Remediation Simulator (Light) */}
      <LiveScoreSimulator />

      {/* AI Search & Modern Visibility Suite Bento Grid (Dark) */}
      <AiBentoGrid />

      {/* Integration Marquee & 24/7 Autopilot (Light) */}
      <IntegrationTicker />

      {/* The 4-Step Strategic SEO Growth Operating System (Dark) */}
      <StrategicWorkflowSection />

      {/* SEO Audit vs Traditional Tools Comparison Table (Light) */}
      <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-2">
              Why We Built SEO Audit
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
              SEO Audit vs Traditional SEO Platforms
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
                    <th className="py-3.5 px-5 text-blue-700 bg-blue-50/50">SEO Audit Platform</th>
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

      {/* "Skip the digging. Just ask." AI Assistant Console (Blue/Indigo Gradient) */}
      <AskAiShowcase />

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
              Modern engineering teams don&apos;t just look at dashboards—they automate them. With SEO Audit&apos;s native Model Context Protocol (MCP) server and REST API, your AI coding assistants can audit URLs and diagnose regressions conversationally.
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

      {/* Interactive Frequently Asked Questions Accordion */}
      <HomeFaqAccordion />
    </div>
  );
}
