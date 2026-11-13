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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Aceternity Dot-Grid Texture, Radial Vignette Mask & Kinetic Console */}
      <section className="relative overflow-hidden pt-14 sm:pt-20 pb-20 px-4 sm:px-6 lg:px-8 text-center border-b border-slate-200/90 bg-white">
        {/* Subtle Aceternity Dot Grid with Radial Vignette Mask */}
        <div className="absolute inset-0 hero-dot-grid hero-vignette-mask pointer-events-none opacity-75" />

        {/* Ambient Top Lighting Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[480px] bg-gradient-to-b from-blue-100/50 via-indigo-50/25 to-transparent blur-3xl pointer-events-none -z-1" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Release Announcement Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-blue-200 text-blue-700 text-xs font-bold mb-6 shadow-xs hover:border-blue-300 transition-colors">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
            </span>
            <span>All-in-One SEO Platform • Sub-Second Crawls • AI Search Visibility • Zero Hallucinations</span>
          </div>

          {/* Hero Headline (Authoritative Typography) */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight max-w-5xl mx-auto leading-[1.12] sm:leading-[1.12] mb-6">
            The Modern AI SEO &amp; Website Intelligence <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Platform for High-Growth Teams.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            Audit technical health in sub-seconds, outrank competitors with semantic content gaps, benchmark Core Web Vitals, and dominate brand visibility across AI search engines — with 100% deterministic transparency.
          </p>

          {/* Interactive Multi-Mode Live URL Analyzer Input */}
          <div className="mb-10">
            <UrlAnalyzerInput />
          </div>

          {/* Interactive Hero Console & Floating Micro-Telemetry Badges */}
          <div className="relative mt-6">
            {/* Floating Widget Left: Cheerio AST */}
            <div className="hidden xl:flex items-center gap-3 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl absolute -left-8 top-16 z-20 animate-float text-left max-w-[220px]">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Cheerio AST</div>
                <div className="text-xs font-bold text-slate-900">68ms Crawl Speed</div>
                <div className="text-[10px] text-emerald-600 font-semibold">Sub-second latency</div>
              </div>
            </div>

            {/* Floating Widget Right: Zero-Trust Defense */}
            <div className="hidden xl:flex items-center gap-3 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl absolute -right-8 top-28 z-20 animate-float-reverse text-left max-w-[220px]">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Defense Engine</div>
                <div className="text-xs font-bold text-slate-900">Zero-Trust SSRF</div>
                <div className="text-[10px] text-blue-600 font-semibold">DNS Pinning Active</div>
              </div>
            </div>

            {/* Main Interactive Audit Console Component */}
            <HeroAnimatedDashboard />
          </div>
        </div>
      </section>

      {/* Enterprise Metrics High-Density Bento Ribbon (Dark Mode Contrast) */}
      <section className="py-12 bg-slate-950 text-white border-y border-slate-800/90 relative overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(37,99,235,0.1),transparent)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Metric 1 */}
            <div className="p-5 rounded-2xl bg-slate-900/70 backdrop-blur-sm border border-slate-800/90 hover:border-blue-500/40 transition-colors group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Deterministic Scans</span>
                <span className="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-125 transition-transform" />
              </div>
              <div className="text-3xl font-black text-blue-400 tracking-tight font-mono">14 Engines</div>
              <div className="text-xs font-semibold text-slate-300 mt-1">Rule-Based DOM Scans</div>
              <div className="text-[11px] text-slate-500 mt-0.5">DOM, Security, Headers, Schema</div>
            </div>

            {/* Metric 2 */}
            <div className="p-5 rounded-2xl bg-slate-900/70 backdrop-blur-sm border border-slate-800/90 hover:border-emerald-500/40 transition-colors group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Crawl Latency</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
              </div>
              <div className="text-3xl font-black text-emerald-400 tracking-tight font-mono">&lt; 100 ms</div>
              <div className="text-xs font-semibold text-slate-300 mt-1">Average Crawl Time</div>
              <div className="text-[11px] text-slate-500 mt-0.5">High-speed Cheerio stream</div>
            </div>

            {/* Metric 3 */}
            <div className="p-5 rounded-2xl bg-slate-900/70 backdrop-blur-sm border border-slate-800/90 hover:border-purple-500/40 transition-colors group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fingerprinting</span>
                <span className="w-2 h-2 rounded-full bg-purple-500 group-hover:scale-125 transition-transform" />
              </div>
              <div className="text-3xl font-black text-purple-400 tracking-tight font-mono">50+ Stacks</div>
              <div className="text-xs font-semibold text-slate-300 mt-1">Tech Stack Signatures</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Next.js, React, Cloudflare, Vue</div>
            </div>

            {/* Metric 4 */}
            <div className="p-5 rounded-2xl bg-slate-900/70 backdrop-blur-sm border border-slate-800/90 hover:border-amber-500/40 transition-colors group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fair Pricing</span>
                <span className="w-2 h-2 rounded-full bg-amber-500 group-hover:scale-125 transition-transform" />
              </div>
              <div className="text-3xl font-black text-amber-400 tracking-tight font-mono">$0 Forever</div>
              <div className="text-xs font-semibold text-slate-300 mt-1">No Per-Seat Fee</div>
              <div className="text-[11px] text-slate-500 mt-0.5">No $80/seat legacy penalties</div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Live Feature Studio Workbench */}
      <section id="workbench" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Interactive Product Workbench</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Experience the Complete SEO Engine Before You Run It
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Click through our 5 core growth and diagnostic pillars with real-world live telemetry previews across technical health, competitive intelligence, AI brand radar, and MCP protocols.
          </p>
        </div>

        <HomeInteractiveShowcase />
      </section>

      {/* The Complete Modular SEO Suite: 9 Specialized Growth & Technical Engines */}
      <section className="py-16 sm:py-24 bg-slate-50/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
                Complete Modular SEO Suite
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                9 Specialized Growth &amp; Technical Engines
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                From hyperlink crawl forensics to generative AI brand radar, deploy dedicated sub-second diagnostic engines tailored for modern web engineering and organic search.
              </p>
            </div>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs hover:shadow-sm transition-all shrink-0 active:scale-95"
            >
              <span>Explore All 9 SEO Engines</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <ToolsAnimatedGrid />
        </div>
      </section>

      {/* Interactive Before & After SEO Remediation Simulator */}
      <LiveScoreSimulator />

      {/* AI Search & Modern Visibility Suite Bento Grid */}
      <AiBentoGrid />

      {/* Integration Marquee & 24/7 Autopilot */}
      <IntegrationTicker />

      {/* The 4-Step Strategic SEO Growth Operating System */}
      <StrategicWorkflowSection />

      {/* SEO Audit vs Traditional Tools Comparison Table */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-2">
              Why We Built SEO Audit
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              SEO Audit vs Traditional SEO Platforms
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              See why modern engineering and growth teams switch from expensive, black-box legacy suites.
            </p>
          </div>

          <div className="overflow-hidden bg-white shadow-md rounded-2xl border border-slate-200/90">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-900 font-bold">
                    <th className="py-4 px-6">Capability / Dimension</th>
                    <th className="py-4 px-6 text-blue-700 bg-blue-50/70 border-x border-blue-100">
                      SEO Audit Platform
                    </th>
                    <th className="py-4 px-6 text-slate-600">Legacy Platforms (Ahrefs / Semrush)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-900">{row.feature}</td>
                      <td className="py-4 px-6 font-bold text-blue-700 bg-blue-50/30 border-x border-blue-100/60 flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span>{row.seoseite}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-600">{row.traditional}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* "Skip the digging. Just ask." AI Assistant Console */}
      <AskAiShowcase />

      {/* Developer Platform & MCP Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-4 shadow-2xs">
              <Terminal className="w-3.5 h-3.5" />
              <span>Agentic AI &amp; Developer Integration</span>
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
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
              >
                <Terminal className="w-4 h-4" />
                <span>Explore SEO MCP Server</span>
              </Link>
              <Link
                href="/api-docs"
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl border border-slate-300 transition-all active:scale-95"
              >
                <Code2 className="w-4 h-4" />
                <span>REST API Reference</span>
              </Link>
            </div>
          </div>

          <McpTerminalCard />
        </div>
      </section>

      {/* Frequently Asked Questions Accordion */}
      <HomeFaqAccordion />
    </div>
  );
}
