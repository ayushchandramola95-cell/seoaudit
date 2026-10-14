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
  BookOpen
} from "lucide-react";

export const metadata = {
  title: "Project Quick Info — SEO Audit Platform",
  description: "Complete architectural specification, core principles, and technical roadmap for the SEO Audit Intelligence SaaS platform.",
};

export default function ProjectInfoPage() {
  const pillars = [
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

  const features = [
    { id: 1, name: "Public Website Analysis", desc: "Inspect HTTP headers, meta tags, canonicals, robots.txt, and sitemaps." },
    { id: 2, name: "Technical SEO Scoring", desc: "Transparent 0-100 category breakdown with clear deduction reasons." },
    { id: 3, name: "Performance Audit", desc: "Core Web Vitals (LCP, FID/INP, CLS) powered by Google PageSpeed API." },
    { id: 4, name: "Tech Stack Detector", desc: "Detects CMS, frontend frameworks, CDNs, analytics, and payment gateways." },
    { id: 5, name: "Traffic Heuristic Engine", desc: "Transparent traffic estimations with High/Medium/Low confidence tiers." },
    { id: 6, name: "Competitor Comparison", desc: "Side-by-side URL benchmarking with difference highlights." },
    { id: 7, name: "AI Recommendations", desc: "LLM-synthesized action items prioritized by impact and difficulty." },
    { id: 8, name: "Visual UX & Screenshots", desc: "Desktop/mobile page capture with optional UI hierarchy evaluation." },
    { id: 9, name: "Connected GA4 & GSC", desc: "Optional OAuth connection for verified first-party traffic comparison." },
    { id: 10, name: "Website Monitoring", desc: "Tracks uptime, title changes, robots.txt edits, and Core Web Vitals." },
    { id: 11, name: "User Dashboard", desc: "Saved reports, comparison history, and audit exports." },
    { id: 12, name: "SaaS Usage Limits", desc: "Server-side rate limiting and tiered subscription accounting." },
    { id: 13, name: "Report Exports", desc: "Export audit reports to structured JSON and formatted PDF." },
    { id: 14, name: "Public Report URLs", desc: "Crawlable, SEO-friendly SSR public audit pages (/site/[domain])." },
  ];

  const techStack = [
    { layer: "Framework", tool: "Next.js 16 (App Router)", note: "Full-stack SSR, API routes & React 19 server components" },
    { layer: "Language", tool: "TypeScript 5", note: "End-to-end type safety for scrapers, metrics, and models" },
    { layer: "Styling", tool: "Tailwind CSS v4", note: "Clean, flat modern design tokens with light-mode priority" },
    { layer: "Iconography", tool: "Lucide React", note: "Crisp, flat SVG icons with zero visual clutter" },
    { layer: "HTML Parsing", tool: "Cheerio + Fetch", note: "High-speed sub-second DOM parser with low memory usage" },
    { layer: "Performance API", tool: "Google PageSpeed Insights", note: "Cloud-hosted Lighthouse execution without local Chrome overhead" },
    { layer: "AI Reasoning", tool: "Google Gemini API", note: "Structured diagnosis, zero metric hallucination" },
    { layer: "Security Guard", tool: "SSRF Protection Layer", note: "Blocks private IPs, metadata endpoints, and non-HTTP schemes" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb / Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="flat-badge text-blue-700 bg-blue-50 border-blue-200">
          Platform Architecture Specification
        </span>
        <span className="text-xs text-slate-400">•</span>
        <span className="text-xs text-slate-500 font-medium">Enterprise Intelligence & Deterministic Auditing</span>
      </div>

      {/* Main Title Banner */}
      <div className="border-b border-slate-200 pb-8 mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Platform Architecture & Technical Specification
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
          SEO Audit is an enterprise-grade website intelligence and competitive benchmarking SaaS platform. 
          It gives users verifiable, public domain diagnostics with high transparency, sub-second crawling, and grounded metrics.
        </p>

        <div className="flex flex-wrap gap-3 mt-6">
          <Link
            href="/capstone"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Architecture & Scoring Methodology
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            View Subscription Plans
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Open Website Analyzer
          </Link>
        </div>
      </div>

      {/* Core Principles */}
      <section className="mb-14">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          Core Architectural Principles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 flat-card">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-sm mb-3">
              01
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-2">Zero Fabricated Metrics</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We never invent visitor counts, backlinks, or rankings. Every metric has a documented source or statistical estimation method. If data is absent, we display "Data unavailable".
            </p>
          </div>

          <div className="p-5 flat-card">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-bold text-sm mb-3">
              02
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-2">AI is an Interpreter, Not Truth</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Deterministic code, verified APIs, and statistical heuristics calculate all raw data. The AI engine is strictly used to interpret findings, summarize issues, and suggest code fixes.
            </p>
          </div>

          <div className="p-5 flat-card">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center font-bold text-sm mb-3">
              03
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-2">SSRF Protection & Safe Crawling</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              All submitted URLs pass through strict server-side validation. Loopback addresses (`127.0.0.1`), cloud metadata (`169.254.169.254`), and private LAN subnets are blocked before any network socket is opened.
            </p>
          </div>
        </div>
      </section>

      {/* Six Pillars of Analysis */}
      <section className="mb-14">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600" />
          The 6 Pillars of Website Intelligence
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="p-5 flat-card flex flex-col justify-between">
                <div>
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-4 ${pillar.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">{pillar.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{pillar.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Technical Stack Table */}
      <section className="mb-14">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Server className="w-5 h-5 text-blue-600" />
          Engineering Stack & Tooling
        </h2>

        <div className="flat-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-600">
                <tr>
                  <th className="px-5 py-3.5">Layer</th>
                  <th className="px-5 py-3.5">Technology Selected</th>
                  <th className="px-5 py-3.5">Architectural Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {techStack.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3.5 font-medium text-slate-900">{row.layer}</td>
                    <td className="px-5 py-3.5 font-semibold text-blue-600">{row.tool}</td>
                    <td className="px-5 py-3.5 text-slate-600">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Complete Feature Matrix */}
      <section className="mb-14">
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <FileCode2 className="w-5 h-5 text-blue-600" />
          Planned Product Features (1 to 14)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <div key={feature.id} className="p-4 flat-card flex items-start gap-3.5">
              <div className="w-6 h-6 rounded bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {feature.id}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{feature.name}</h3>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Repository File Reference */}
      <section className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Need the full raw documentation?</h3>
            <p className="text-sm text-slate-600 mt-1">
              You can also inspect <code className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-xs text-slate-800">PROJECT_INFO.md</code> and <code className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-xs text-slate-800">WORKLOG.md</code> in the repository root.
            </p>
          </div>
          <Link
            href="/worklog"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shrink-0 transition-colors"
          >
            Go to Dev Worklog
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
