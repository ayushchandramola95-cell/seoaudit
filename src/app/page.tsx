import Link from "next/link";
import UrlAnalyzerInput from "@/components/UrlAnalyzerInput";
import HomeInteractiveShowcase from "@/components/HomeInteractiveShowcase";
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
} from "lucide-react";

export default function Home() {
  const standaloneTools = [
    {
      title: "Broken Link & 404 Checker",
      category: "Site Health",
      desc: "Deep-crawls internal and external hyperlinks, detecting dead 404 errors, broken redirects, and anchor issues.",
      href: "/tools/broken-links",
      badge: "Free Utility",
      icon: Link2,
      color: "text-red-600 bg-red-50 border-red-200",
    },
    {
      title: "Core Web Vitals & PageSpeed Lab",
      category: "Performance",
      desc: "Direct Google Lighthouse API telemetry measuring real LCP, FCP, CLS, INP, and TTFB lab scores.",
      href: "/tools/speed-lab",
      badge: "Lighthouse API",
      icon: Zap,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      title: "Schema JSON-LD & OG Validator",
      category: "Structured Data",
      desc: "Validates Schema.org JSON-LD syntax, entity types, and OpenGraph social previews with copy-paste code snippets.",
      href: "/tools/schema-validator",
      badge: "Code Studio",
      icon: Code2,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      title: "Google Desktop & Mobile SERP Preview",
      category: "Search Simulator",
      desc: "Pixel-accurate Google SERP preview simulator with real-time title and meta description truncation warnings.",
      href: "/tools/serp-preview",
      badge: "SERP Studio",
      icon: Search,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      title: "50+ Tech Stack Profiler",
      category: "Infrastructure",
      desc: "Fingerprints React, Next.js, Vue, Tailwind, Cloudflare, Shopify, WordPress, and 45+ other technologies instantly.",
      href: "/tools/tech-detector",
      badge: "Signature Engine",
      icon: Cpu,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    },
    {
      title: "DomCop Open PageRank Lookup",
      category: "Authority & Reach",
      desc: "Live Common Crawl Open PageRank lookup (0–10 rank, status, global percentile) without fabricated metrics.",
      href: "/tools/authority-checker",
      badge: "Open Data",
      icon: TrendingUp,
      color: "text-cyan-600 bg-cyan-50 border-cyan-200",
    },
    {
      title: "Brand Radar AI (AEO Visibility)",
      category: "AI Search",
      desc: "Measures brand recommendation citations across ChatGPT, Google Gemini, Claude, and Perplexity for buyer prompts.",
      href: "/tools/brand-radar",
      badge: "AI Share of Voice",
      icon: Radar,
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
    {
      title: "Semantic Content Gap & Keywords",
      category: "Competitive Intel",
      desc: "Cross-domain TF-IDF keyword overlap, missing competitor terms, and heading topic disparities.",
      href: "/tools/content-gap",
      badge: "Keyword Matrix",
      icon: GitCompare,
      color: "text-pink-600 bg-pink-50 border-pink-200",
    },
    {
      title: "Multi-URL Batch SEO Auditor",
      category: "Bulk Engine",
      desc: "Concurrently audits up to 15 URLs in parallel with master spreadsheet matrix, score sorting, and CSV export.",
      href: "/tools/batch-audit",
      badge: "Up to 15 URLs",
      icon: ListChecks,
      color: "text-slate-800 bg-slate-100 border-slate-300",
    },
  ];

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
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-8 shadow-sm">
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

        {/* URL Input Form */}
        <div className="max-w-3xl mx-auto mb-6">
          <UrlAnalyzerInput />
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium pt-4">
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
      </section>

      {/* 9 Standalone Free Micro-Tools Grid (Ahrefs-Inspired Modular Hub) */}
      <section className="py-16 sm:py-20 bg-slate-50/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {standaloneTools.map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={idx}
                  href={tool.href}
                  className="flat-card p-5 bg-white hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${tool.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {tool.badge}
                      </span>
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      {tool.category}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                    <span>Launch Tool</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </Link>
              );
            })}
          </div>
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

          <div className="flat-card p-6 bg-slate-950 text-slate-200 rounded-2xl border border-slate-800 font-mono text-xs shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                claude-desktop-config.json
              </span>
              <span className="text-[11px] text-blue-400">MCP JSON-RPC 2.0</span>
            </div>

            <pre className="text-slate-300 leading-relaxed overflow-x-auto">
{`{
  "mcpServers": {
    "seoseite": {
      "command": "node",
      "args": ["scripts/seoseite-mcp.mjs"],
      "env": {
        "SEOSEITE_API_URL": "https://seoseite.com"
      }
    }
  }
}`}
            </pre>

            <div className="p-3.5 bg-slate-900 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <div className="text-amber-400 font-bold">User prompt to Claude:</div>
              <div className="text-slate-400">&quot;Run seoseite_audit_url on https://example.com and tell me what critical tags are missing.&quot;</div>
              <div className="text-emerald-400 pt-1">Claude executes tool → Receives verified deterministic JSON audit in 85ms.</div>
            </div>
          </div>
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
