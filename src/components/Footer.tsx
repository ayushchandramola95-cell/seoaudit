import Link from "next/link";
import { Globe, ShieldCheck, Cpu, Database, Sparkles, BookOpen, ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Brand Bar & Mission */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-12 border-b border-slate-800/80">
          <div className="space-y-2">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-white tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-none">
                <Globe className="w-4 h-4" />
              </div>
              <span className="flex items-center gap-1.5">
                SeoSeite
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Intel
                </span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Open enterprise website intelligence platform for technical SEO, Core Web Vitals, technology stack detection, and Common Crawl authority tiers. Zero fabricated metrics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              SSRF &amp; Safe Crawling Protected
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Cpu className="w-3.5 h-3.5" />
              Google Cloud Run Native
            </div>
          </div>
        </div>

        {/* 5-Column Sitemap (Modeled directly on Ahrefs) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 py-12 border-b border-slate-800/80 text-xs">
          {/* Column 1: CORE TOOLS */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Core Tools
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/analyze" className="hover:text-white transition-colors">
                  Website SEO Analyzer
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-white transition-colors">
                  Competitor Comparison
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  SaaS Operational Dashboard
                </Link>
              </li>
              <li>
                <Link href="/analyze?tab=performance" className="hover:text-white transition-colors">
                  Core Web Vitals Lab
                </Link>
              </li>
              <li>
                <Link href="/analyze?tab=traffic" className="hover:text-white transition-colors">
                  Open PageRank Estimator
                </Link>
              </li>
              <li>
                <Link href="/analyze?tab=tech" className="hover:text-white transition-colors">
                  Tech Stack Fingerprint
                </Link>
              </li>
              <li>
                <Link href="/analyze?tab=deadlinks" className="hover:text-white transition-colors">
                  404 Broken Link Crawler
                </Link>
              </li>
              <li>
                <Link href="/dashboard?tab=connected" className="hover:text-white transition-colors flex items-center gap-1">
                  Connected Telemetry
                  <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400">
                    Mode B
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard?tab=watchlist" className="hover:text-white transition-colors">
                  Monitored Domain Watchlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: EXTRA TOOLS & FEATURES */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Extra Tools &amp; Features
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/compare" className="hover:text-white transition-colors">
                  Semantic Topic Gap Matrix
                </Link>
              </li>
              <li>
                <Link href="/analyze?tab=ai" className="hover:text-white transition-colors">
                  AI Diagnostic Synthesizer
                </Link>
              </li>
              <li>
                <Link href="/analyze?tab=geo" className="hover:text-white transition-colors flex items-center gap-1">
                  AI Search &amp; GEO Bots
                  <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-blue-500/20 text-blue-400">
                    New
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/analyze?tab=schema" className="hover:text-white transition-colors">
                  Fix-It &amp; Schema Studio
                </Link>
              </li>
              <li>
                <Link href="/analyze?tab=social" className="hover:text-white transition-colors">
                  SERP &amp; Social Simulator
                </Link>
              </li>
              <li>
                <Link href="/analyze?tab=structure" className="hover:text-white transition-colors">
                  Document DOM Hierarchy
                </Link>
              </li>
              <li>
                <Link href="/analyze?tab=headers" className="hover:text-white transition-colors">
                  HTTP Security Headers Guard
                </Link>
              </li>
              <li>
                <Link href="/analyze?tab=media" className="hover:text-white transition-colors">
                  Images &amp; Alt Text Audit
                </Link>
              </li>
              <li>
                <Link href="/dashboard?tab=alerts" className="hover:text-white transition-colors">
                  Automated Webhook Alerts
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: FREE SEO TOOLS */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1 text-emerald-400">
              <span>Free SEO Tools</span>
              <ArrowRight className="w-3 h-3" />
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/tools" className="hover:text-blue-400 font-semibold transition-colors flex items-center gap-1">
                  Free Tools Directory <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/tools/brand-radar" className="hover:text-white transition-colors text-blue-300 font-medium">
                  Brand Radar AI (AEO)
                </Link>
              </li>
              <li>
                <Link href="/tools/content-gap" className="hover:text-white transition-colors text-emerald-300 font-medium">
                  Content Gap &amp; Keyword Studio
                </Link>
              </li>
              <li>
                <Link href="/tools/batch-audit" className="hover:text-white transition-colors text-purple-300 font-medium">
                  Multi-URL Batch SEO Auditor
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
                  JSON-LD Schema Generator
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
              <li>
                <Link href="/tools/authority-checker" className="hover:text-white transition-colors">
                  DomCop PageRank Checker
                </Link>
              </li>
              <li>
                <Link href="/analyze" className="hover:text-white transition-colors">
                  Free Full Website Auditor
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-white transition-colors">
                  Competitor Benchmark Tool
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: PRODUCT & COMPANY */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Product &amp; Company
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing &amp; Subscriptions
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Turnkey Stripe Billing
                </Link>
              </li>
              <li>
                <Link href="/dashboard?tab=infra" className="hover:text-white transition-colors">
                  Google Cloud Run Status
                </Link>
              </li>
              <li>
                <Link href="/dashboard?tab=infra" className="hover:text-white transition-colors">
                  Cloud SQL PostgreSQL
                </Link>
              </li>
              <li>
                <Link href="/capstone" className="hover:text-white transition-colors">
                  Zero-Hallucination Data
                </Link>
              </li>
              <li>
                <Link href="/capstone" className="hover:text-white transition-colors">
                  SSRF Defense Architecture
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  White-Label Client Reports
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  API &amp; Webhook Integration
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: RESOURCES & METHODOLOGY */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Resources &amp; Docs
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/capstone" className="hover:text-white transition-colors font-medium text-slate-200">
                  Platform Methodology
                </Link>
              </li>
              <li>
                <Link href="/project-info" className="hover:text-white transition-colors font-medium text-slate-200">
                  Platform Specifications
                </Link>
              </li>
              <li>
                <Link href="/worklog" className="hover:text-white transition-colors">
                  Engineering Changelog
                </Link>
              </li>
              <li>
                <Link href="/mcp" className="hover:text-blue-400 text-blue-300 font-semibold transition-colors flex items-center gap-1">
                  Model Context Protocol (MCP)
                  <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-blue-500/20 text-blue-300">
                    New
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="hover:text-indigo-400 text-indigo-300 font-semibold transition-colors flex items-center gap-1">
                  REST API &amp; Webhooks Docs
                  <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                    v1.0
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard?tab=connected" className="hover:text-white transition-colors">
                  Mode A vs Mode B Guide
                </Link>
              </li>
              <li>
                <Link href="/capstone" className="hover:text-white transition-colors">
                  Deterministic Scorer Rules
                </Link>
              </li>
              <li>
                <Link href="/dashboard?tab=alerts" className="hover:text-white transition-colors">
                  Webhook Payload Specs
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Agency White-Label Specs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Use Cases & Alternatives (Modeled on Ahrefs Bottom Footer) */}
        <div className="py-8 border-b border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Use Cases
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-slate-400">
              <Link href="/compare" className="hover:text-white transition-colors">
                Competitive Intelligence
              </Link>
              <span className="text-slate-700">•</span>
              <Link href="/analyze" className="hover:text-white transition-colors">
                Technical SEO Auditing
              </Link>
              <span className="text-slate-700">•</span>
              <Link href="/analyze?tab=performance" className="hover:text-white transition-colors">
                Core Web Vitals Optimization
              </Link>
              <span className="text-slate-700">•</span>
              <Link href="/analyze?tab=geo" className="hover:text-white transition-colors">
                AI Search (GEO) Readiness
              </Link>
              <span className="text-slate-700">•</span>
              <Link href="/pricing" className="hover:text-white transition-colors">
                Agency Client Reporting
              </Link>
              <span className="text-slate-700">•</span>
              <Link href="/dashboard?tab=watchlist" className="hover:text-white transition-colors">
                Continuous Site Monitoring
              </Link>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Platform Alternatives &amp; Comparisons
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-slate-400">
              <Link href="/pricing" className="hover:text-white transition-colors">
                SeoSeite vs Ahrefs
              </Link>
              <span className="text-slate-700">•</span>
              <Link href="/pricing" className="hover:text-white transition-colors">
                SeoSeite vs Semrush
              </Link>
              <span className="text-slate-700">•</span>
              <Link href="/pricing" className="hover:text-white transition-colors">
                SeoSeite vs Sitechecker Pro
              </Link>
              <span className="text-slate-700">•</span>
              <Link href="/pricing" className="hover:text-white transition-colors">
                SeoSeite vs Screaming Frog
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 SeoSeite Intel Platform. Grounded metrics, zero hallucinations. Built on Next.js 16, TypeScript &amp; Google Cloud Platform.</p>
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
              Pricing
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
