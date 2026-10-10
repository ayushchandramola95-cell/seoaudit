import Link from "next/link";
import UrlAnalyzerInput from "@/components/UrlAnalyzerInput";
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
  Info,
  FileText,
  Lock,
  Globe2,
  Terminal,
  Activity
} from "lucide-react";

export default function Home() {
  const auditCards = [
    {
      title: "Rule-Based SEO Score",
      score: "92/100",
      category: "Technical Health",
      desc: "Deterministic evaluation of title tags, meta descriptions, canonical URLs, robots directives, image alt attributes, and heading hierarchy.",
      badge: "Deterministic",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      title: "Core Web Vitals",
      score: "LCP 1.4s",
      category: "Real Performance",
      desc: "Measured via Google PageSpeed Insights REST API. Pinpoints render-blocking resources, payload size, and Largest Contentful Paint.",
      badge: "PageSpeed API",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      title: "Technology Detection",
      score: "14 Techs Found",
      category: "Stack Fingerprint",
      desc: "Identifies CMS, frontend frameworks (Next.js, React), CDN providers (Cloudflare), analytics scripts, and payment gateways from page signatures.",
      badge: "Signature Engine",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      title: "Traffic Heuristic Engine",
      score: "Confidence: Medium",
      category: "Traffic Estimation",
      desc: "Statistical click-through rate models and public ranking signals. Transparently reports uncertainty ranges rather than fabricated visitor counts.",
      badge: "Transparent Model",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Notification Bar for Project Info & Dev Worklog */}
      <div className="bg-slate-50 border-b border-slate-200 py-2.5 px-4 text-center text-xs text-slate-600">
        <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mr-1.5">
          Production Live on Google Cloud Run & SQL
        </span>
        Read our{" "}
        <Link href="/capstone" className="font-semibold text-purple-700 hover:underline mx-1">
          BCA Capstone Dissertation & Viva Guide
        </Link>
        , the{" "}
        <Link href="/project-info" className="font-semibold text-blue-600 hover:underline mx-1">
          Project Quick Info
        </Link>
        , or the daily{" "}
        <Link href="/worklog" className="font-semibold text-indigo-600 hover:underline mx-1">
          Dev Worklog
        </Link>
        .
      </div>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Subtle Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Production SaaS & BCA Final-Year Capstone
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight mb-6">
          Understand Any Website. <br className="hidden sm:inline" />
          <span className="text-blue-600">Discover What Drives Its Growth.</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Inspect technical SEO health, detect full technology stacks, measure real Core Web Vitals, and estimate traffic using transparent, grounded data.
        </p>

        {/* URL Input Form */}
        <UrlAnalyzerInput />
      </section>

      {/* Live Sample Audit Card Showcase (Flat & Modern) */}
      <section className="py-12 bg-slate-50/60 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Deterministic Intelligence Architecture
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Every metric is grounded in verifiable code and open web standards. No fabricated visitor counts.
              </p>
            </div>
            <Link
              href="/project-info"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Read full architecture spec
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {auditCards.map((card, idx) => (
              <div key={idx} className="flat-card p-5 bg-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      {card.category}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
                    {card.score}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1.5">{card.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison & Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flat-badge text-blue-700 bg-blue-50 border-blue-200 mb-4">
              Dual-Mode Operation
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
              Designed for Public Inspection and Private Analytics
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              Unlike tools that demand mandatory Google Analytics connections, SeoSeite works right out of the box for any public URL. Website owners can optionally authenticate their first-party GA4 and Google Search Console accounts to compare estimated metrics with reality.
            </p>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">100% Usable Without Third-Party Logins</h4>
                  <p className="text-xs text-slate-600">Inspect any competitor or client website without OAuth tokens.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Protected Against SSRF & Vulnerabilities</h4>
                  <p className="text-xs text-slate-600">Server-side request filters prevent intranet access and metadata exploitation.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">AI as Interpreter, Not Source of Truth</h4>
                  <p className="text-xs text-slate-600">LLMs formulate recommendations based strictly on verified diagnostic findings.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Clean Flat Mock Card */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-slate-600" />
                <span className="font-mono text-xs font-semibold text-slate-800">example-saas.com</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Live Audit Preview
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">Overall Technical SEO</div>
                  <div className="text-sm font-bold text-slate-900">88/100 (Good)</div>
                </div>
                <div className="text-xs text-slate-500 font-mono">18 / 20 Checks Passed</div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">Detected Technologies</div>
                  <div className="text-sm font-bold text-slate-900">Next.js, Tailwind CSS, Cloudflare</div>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium border border-slate-200">
                  3 Identified
                </span>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">PageSpeed Performance</div>
                  <div className="text-sm font-bold text-slate-900">Score 94 • LCP 1.1s</div>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium border border-emerald-200">
                  Fast
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Ready for Phase 2 Live Testing</span>
              <span className="font-mono text-[11px]">JSON / PDF Export Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action for Documentation */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Want to see how this project is built day-by-day?
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto mb-6">
            We document every architecture decision, package installed, and module created in our live engineering log.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/project-info"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              <Info className="w-4 h-4" />
              Explore Project Quick Info
            </Link>
            <Link
              href="/worklog"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              <FileText className="w-4 h-4" />
              Read Development Worklog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
