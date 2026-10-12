import Link from "next/link";
import { Globe, ArrowRight, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Brand Bar & Clean Mission */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-12 border-b border-slate-800/80">
          <div className="space-y-2">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-white tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-none">
                <Globe className="w-4 h-4" />
              </div>
              <span className="flex items-center gap-1.5 font-extrabold">
                SeoSeite
                <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Intel
                </span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Open website intelligence platform for technical SEO health, Core Web Vitals, 50+ technology stack detection, and AI search visibility. Zero fabricated numbers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/analyze"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors inline-flex items-center gap-1.5"
            >
              Analyze Website
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/tools"
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors"
            >
              All 9 Free Tools
            </Link>
          </div>
        </div>

        {/* 5-Column Sitemap */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 py-12 border-b border-slate-800/80 text-xs">
          {/* Column 1: TECHNICAL AUDITS */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Technical Audits
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/analyze" className="hover:text-white transition-colors">
                  Full Website Auditor
                </Link>
              </li>
              <li>
                <Link href="/tools/speed-lab" className="hover:text-white transition-colors">
                  Core Web Vitals Lab
                </Link>
              </li>
              <li>
                <Link href="/tools/broken-links" className="hover:text-white transition-colors">
                  Broken Link &amp; 404 Crawler
                </Link>
              </li>
              <li>
                <Link href="/analyze?tab=structure" className="hover:text-white transition-colors">
                  Document Architecture
                </Link>
              </li>
              <li>
                <Link href="/analyze?tab=headers" className="hover:text-white transition-colors">
                  Security Headers Guard
                </Link>
              </li>
              <li>
                <Link href="/analyze?tab=media" className="hover:text-white transition-colors">
                  Images &amp; Alt Text Audit
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: COMPETITIVE & AI */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Competitive &amp; AI
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/compare" className="hover:text-white transition-colors">
                  Competitor Benchmark
                </Link>
              </li>
              <li>
                <Link href="/tools/content-gap" className="hover:text-white transition-colors">
                  Semantic Content Gap
                </Link>
              </li>
              <li>
                <Link href="/tools/batch-audit" className="hover:text-white transition-colors">
                  Multi-URL Batch Auditor
                </Link>
              </li>
              <li>
                <Link href="/tools/brand-radar" className="hover:text-white transition-colors">
                  Brand Radar AI (AEO)
                </Link>
              </li>
              <li>
                <Link href="/tools/authority-checker" className="hover:text-white transition-colors">
                  DomCop Open PageRank
                </Link>
              </li>
              <li>
                <Link href="/tools/tech-detector" className="hover:text-white transition-colors">
                  50+ Tech Stack Detector
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: FREE MICRO-TOOLS */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-emerald-400">
              Free Standalone Tools
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/tools" className="hover:text-blue-400 font-bold transition-colors flex items-center gap-1 text-slate-200">
                  Tools Directory Hub <ArrowUpRight className="w-3 h-3 text-blue-400" />
                </Link>
              </li>
              <li>
                <Link href="/tools/broken-links" className="hover:text-white transition-colors">
                  Broken Link Checker (404)
                </Link>
              </li>
              <li>
                <Link href="/tools/speed-lab" className="hover:text-white transition-colors">
                  Core Web Vitals &amp; PageSpeed
                </Link>
              </li>
              <li>
                <Link href="/tools/schema-validator" className="hover:text-white transition-colors">
                  JSON-LD Schema Validator
                </Link>
              </li>
              <li>
                <Link href="/tools/serp-preview" className="hover:text-white transition-colors">
                  Google SERP Simulator
                </Link>
              </li>
              <li>
                <Link href="/tools/tech-detector" className="hover:text-white transition-colors">
                  CMS &amp; Framework Lookup
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: DEVELOPER & MCP */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Developer &amp; CI/CD
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/api-docs" className="hover:text-white transition-colors">
                  REST API &amp; Webhooks Docs
                </Link>
              </li>
              <li>
                <Link href="/mcp" className="hover:text-white transition-colors">
                  Model Context Protocol (MCP)
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  SaaS Operations Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard?tab=connected" className="hover:text-white transition-colors">
                  Connected Telemetry (Mode B)
                </Link>
              </li>
              <li>
                <Link href="/dashboard?tab=alerts" className="hover:text-white transition-colors">
                  Automated Webhook Alerts
                </Link>
              </li>
              <li>
                <Link href="/dashboard?tab=watchlist" className="hover:text-white transition-colors">
                  Monitored Watchlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: PLATFORM & SPECS */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Platform &amp; Specs
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing &amp; Plans ($0–$149)
                </Link>
              </li>
              <li>
                <Link href="/project-info" className="hover:text-white transition-colors">
                  Platform Specifications
                </Link>
              </li>
              <li>
                <Link href="/capstone" className="hover:text-white transition-colors">
                  Scoring Methodology Spec
                </Link>
              </li>
              <li>
                <Link href="/worklog" className="hover:text-white transition-colors">
                  Engineering Changelog
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-white transition-colors">
                  Dynamic XML Sitemap
                </Link>
              </li>
              <li>
                <Link href="/robots.txt" className="hover:text-white transition-colors">
                  Robots Crawler Protocol
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Use Cases & Competitor Comparisons */}
        <div className="py-8 border-b border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Use Cases
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-slate-400">
              <Link href="/compare" className="hover:text-white transition-colors">
                Competitive Benchmarking
              </Link>
              <span className="text-slate-700">•</span>
              <Link href="/analyze" className="hover:text-white transition-colors">
                Technical SEO Audits
              </Link>
              <span className="text-slate-700">•</span>
              <Link href="/tools/speed-lab" className="hover:text-white transition-colors">
                Core Web Vitals Lab
              </Link>
              <span className="text-slate-700">•</span>
              <Link href="/tools/brand-radar" className="hover:text-white transition-colors">
                AI Search (GEO) Visibility
              </Link>
              <span className="text-slate-700">•</span>
              <Link href="/pricing" className="hover:text-white transition-colors">
                Agency Client Reporting
              </Link>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Value Comparisons
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-slate-400">
              <Link href="/pricing" className="hover:text-white transition-colors">
                SeoSeite vs Ahrefs (Save $100+/mo &amp; No Seat Penalties)
              </Link>
              <span className="text-slate-700">•</span>
              <Link href="/pricing" className="hover:text-white transition-colors">
                SeoSeite vs Semrush
              </Link>
              <span className="text-slate-700">•</span>
              <Link href="/pricing" className="hover:text-white transition-colors">
                SeoSeite vs BuiltWith (50+ Free Signatures)
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 SeoSeite Intel Platform. Grounded metrics, zero hallucinations. Next.js 16 + TypeScript.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link href="/project-info" className="hover:text-slate-300 transition-colors">
              Platform Spec
            </Link>
            <Link href="/worklog" className="hover:text-slate-300 transition-colors">
              Changelog
            </Link>
            <Link href="/api-docs" className="hover:text-slate-300 transition-colors">
              API Docs
            </Link>
            <Link href="/sitemap.xml" className="hover:text-slate-300 transition-colors">
              Sitemap
            </Link>
            <Link href="/robots.txt" className="hover:text-slate-300 transition-colors">
              Robots.txt
            </Link>
            <Link href="/pricing" className="hover:text-slate-300 transition-colors">
              Pricing Plans
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
