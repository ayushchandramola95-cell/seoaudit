"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Globe,
  GitCompare,
  ArrowRight,
  LayoutDashboard,
  BookOpen,
  ChevronDown,
  ShieldCheck,
  Zap,
  TrendingUp,
  Cpu,
  Layers,
  Link2,
  Code,
  Bell,
  Menu,
  X,
  Sparkles,
  Search,
  FileText,
  Server,
  Lock,
  ExternalLink,
} from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [productOpen, setProductOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const productRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (productRef.current && !productRef.current.contains(event.target as Node)) {
        setProductOpen(false);
      }
      if (resourcesRef.current && !resourcesRef.current.contains(event.target as Node)) {
        setResourcesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on route change
  useEffect(() => {
    setProductOpen(false);
    setResourcesOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-slate-900 tracking-tight shrink-0">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-none">
                <Globe className="w-4 h-4" />
              </div>
              <span className="flex items-center gap-1.5">
                SeoSeite
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Intel
                </span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {/* Product Mega Menu (Ahrefs Style) */}
              <div className="relative" ref={productRef}>
                <button
                  type="button"
                  onClick={() => {
                    setProductOpen(!productOpen);
                    setResourcesOpen(false);
                  }}
                  onMouseEnter={() => {
                    setProductOpen(true);
                    setResourcesOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    productOpen || pathname.startsWith("/analyze")
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  Product
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${productOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Product Mega Dropdown */}
                {productOpen && (
                  <div
                    onMouseLeave={() => setProductOpen(false)}
                    className="absolute left-0 mt-2 w-[920px] -translate-x-8 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 z-50"
                  >
                    <div className="p-6 grid grid-cols-12 gap-6">
                      {/* Column 1: SEARCH & AUDIT */}
                      <div className="col-span-3 space-y-4">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Search &amp; Audit
                        </div>
                        <div className="space-y-3">
                          <Link href="/analyze" className="group block">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                                Site Health Auditor
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 pl-6 leading-tight">
                              0–100 deterministic scoring &amp; diagnostics.
                            </p>
                          </Link>

                          <Link href="/analyze?tab=deadlinks" className="group block">
                            <div className="flex items-center gap-2">
                              <Link2 className="w-4 h-4 text-purple-600 shrink-0" />
                              <span className="text-xs font-bold text-slate-900 group-hover:text-purple-600">
                                Broken Link Crawler
                              </span>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                                New
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 pl-6 leading-tight">
                              Recursive 404 &amp; redirect chain inspection.
                            </p>
                          </Link>

                          <Link href="/analyze?tab=structure" className="group block">
                            <div className="flex items-center gap-2">
                              <Layers className="w-4 h-4 text-slate-500 shrink-0" />
                              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                                Document Architecture
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 pl-6 leading-tight">
                              H1-H6 heading hierarchy &amp; word counts.
                            </p>
                          </Link>

                          <Link href="/analyze?tab=headers" className="group block">
                            <div className="flex items-center gap-2">
                              <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                                Security Headers Guard
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 pl-6 leading-tight">
                              HSTS, CSP, X-Frame-Options verification.
                            </p>
                          </Link>
                        </div>
                      </div>

                      {/* Column 2: PERFORMANCE & STACK */}
                      <div className="col-span-3 space-y-4">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Performance &amp; Stack
                        </div>
                        <div className="space-y-3">
                          <Link href="/analyze?tab=performance" className="group block">
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                              <span className="text-xs font-bold text-slate-900 group-hover:text-amber-600">
                                Core Web Vitals Lab
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 pl-6 leading-tight">
                              Lighthouse LCP, FCP, CLS &amp; TTFB metrics.
                            </p>
                          </Link>

                          <Link href="/analyze?tab=traffic" className="group block">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-600">
                                Open PageRank &amp; Reach
                              </span>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                                Live
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 pl-6 leading-tight">
                              DomCop Common Crawl authority tier.
                            </p>
                          </Link>

                          <Link href="/analyze?tab=tech" className="group block">
                            <div className="flex items-center gap-2">
                              <Cpu className="w-4 h-4 text-indigo-600 shrink-0" />
                              <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">
                                Tech Stack Detector
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 pl-6 leading-tight">
                              Fingerprints 50+ CMS, frameworks &amp; CDNs.
                            </p>
                          </Link>

                          <Link href="/analyze?tab=geo" className="group block">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
                              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                                AI Search &amp; GEO Bots
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 pl-6 leading-tight">
                              GPTBot, ClaudeBot &amp; Perplexity readiness.
                            </p>
                          </Link>
                        </div>
                      </div>

                      {/* Column 3: COMPETITIVE & AGENCY */}
                      <div className="col-span-3 space-y-4">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Competitive &amp; Agency
                        </div>
                        <div className="space-y-3">
                          <Link href="/compare" className="group block">
                            <div className="flex items-center gap-2">
                              <GitCompare className="w-4 h-4 text-purple-600 shrink-0" />
                              <span className="text-xs font-bold text-slate-900 group-hover:text-purple-600">
                                Competitor Benchmark
                              </span>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">
                                Pro
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 pl-6 leading-tight">
                              Side-by-side Site A vs B winner metrics.
                            </p>
                          </Link>

                          <Link href="/compare" className="group block">
                            <div className="flex items-center gap-2">
                              <Search className="w-4 h-4 text-blue-600 shrink-0" />
                              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                                Semantic Topic Gap
                              </span>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">
                                Pro
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 pl-6 leading-tight">
                              DOM TF-IDF cross-domain content gaps.
                            </p>
                          </Link>

                          <Link href="/dashboard?tab=connected" className="group block">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-600">
                                Connected Telemetry
                              </span>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-900 text-white">
                                Mode B
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 pl-6 leading-tight">
                              Google Search Console &amp; GA4 read-only.
                            </p>
                          </Link>

                          <Link href="/dashboard?tab=alerts" className="group block">
                            <div className="flex items-center gap-2">
                              <Bell className="w-4 h-4 text-rose-500 shrink-0" />
                              <span className="text-xs font-bold text-slate-900 group-hover:text-rose-600">
                                Automated Alerts
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 pl-6 leading-tight">
                              Slack, Discord &amp; Zapier webhooks.
                            </p>
                          </Link>
                        </div>
                      </div>

                      {/* Column 4: USE CASES & FREE TOOLS (Right Rail) */}
                      <div className="col-span-3 bg-slate-50/90 rounded-lg p-4 border border-slate-200/80 space-y-4">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                            Use Cases
                          </div>
                          <ul className="space-y-1.5 text-xs text-slate-600">
                            <li>
                              <Link href="/compare" className="hover:text-blue-600 transition-colors">
                                • Competitive Intelligence
                              </Link>
                            </li>
                            <li>
                              <Link href="/analyze" className="hover:text-blue-600 transition-colors">
                                • Technical SEO Auditing
                              </Link>
                            </li>
                            <li>
                              <Link href="/analyze?tab=performance" className="hover:text-blue-600 transition-colors">
                                • Core Web Vitals Optimization
                              </Link>
                            </li>
                            <li>
                              <Link href="/analyze?tab=geo" className="hover:text-blue-600 transition-colors">
                                • GEO AI Search Readiness
                              </Link>
                            </li>
                            <li>
                              <Link href="/pricing" className="hover:text-blue-600 transition-colors">
                                • Agency Client Reporting
                              </Link>
                            </li>
                          </ul>
                        </div>

                        <div className="pt-3 border-t border-slate-200">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                            Free Utilities
                          </div>
                          <ul className="space-y-1.5 text-xs text-slate-600">
                            <li>
                              <Link href="/analyze?tab=schema" className="hover:text-blue-600 font-medium">
                                • JSON-LD Schema Studio
                              </Link>
                            </li>
                            <li>
                              <Link href="/analyze?tab=social" className="hover:text-blue-600 font-medium">
                                • SERP &amp; Social Simulator
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        140+ automated audits across metadata, security, performance, and authority.
                      </span>
                      <Link
                        href="/analyze"
                        onClick={() => setProductOpen(false)}
                        className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        Discover all tools &amp; audit engine
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Resources Mega Menu (Ahrefs Style) */}
              <div className="relative" ref={resourcesRef}>
                <button
                  type="button"
                  onClick={() => {
                    setResourcesOpen(!resourcesOpen);
                    setProductOpen(false);
                  }}
                  onMouseEnter={() => {
                    setResourcesOpen(true);
                    setProductOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    resourcesOpen || pathname === "/capstone" || pathname === "/project-info"
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  Resources
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${resourcesOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Resources Dropdown */}
                {resourcesOpen && (
                  <div
                    onMouseLeave={() => setResourcesOpen(false)}
                    className="absolute left-0 mt-2 w-[720px] -translate-x-16 bg-white rounded-xl shadow-2xl border border-slate-200 p-6 grid grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-1 duration-150 z-50"
                  >
                    {/* Learn SeoSeite */}
                    <div className="space-y-3">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
                        Learn SeoSeite
                      </div>
                      <ul className="space-y-2">
                        <li>
                          <Link href="/capstone" className="group block">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                              Methodology &amp; Architecture
                            </span>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Mathematical formulas &amp; deterministic scoring rules.
                            </p>
                          </Link>
                        </li>
                        <li>
                          <Link href="/project-info" className="group block">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                              Platform Specifications
                            </span>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Phase 1–10 engineering roadmap.
                            </p>
                          </Link>
                        </li>
                        <li>
                          <Link href="/worklog" className="group block">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                              Engineering Changelog
                            </span>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Day-by-day technical development log.
                            </p>
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* Infrastructure & Security */}
                    <div className="space-y-3">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
                        Enterprise Specs
                      </div>
                      <ul className="space-y-2">
                        <li>
                          <Link href="/dashboard?tab=infra" className="group block">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                              Google Cloud Run &amp; SQL
                            </span>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Containerized microservices &amp; PostgreSQL.
                            </p>
                          </Link>
                        </li>
                        <li>
                          <Link href="/capstone" className="group block">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                              Zero-Trust SSRF Defense
                            </span>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Subnet blacklisting &amp; redirect pinning.
                            </p>
                          </Link>
                        </li>
                        <li>
                          <Link href="/dashboard?tab=connected" className="group block">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                              Mode A vs Mode B
                            </span>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Public diagnostics vs verified owner telemetry.
                            </p>
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* Free SEO Tools */}
                    <div className="space-y-3 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-200">
                        Free SEO Tools
                      </div>
                      <ul className="space-y-2 text-xs">
                        <li>
                          <Link href="/analyze" className="text-slate-700 hover:text-blue-600 font-medium block">
                            • Free Website Auditor
                          </Link>
                        </li>
                        <li>
                          <Link href="/analyze?tab=traffic" className="text-slate-700 hover:text-blue-600 font-medium block">
                            • Open PageRank Lookup
                          </Link>
                        </li>
                        <li>
                          <Link href="/analyze?tab=deadlinks" className="text-slate-700 hover:text-blue-600 font-medium block">
                            • Broken Link Checker (404)
                          </Link>
                        </li>
                        <li>
                          <Link href="/analyze?tab=schema" className="text-slate-700 hover:text-blue-600 font-medium block">
                            • Schema JSON-LD Generator
                          </Link>
                        </li>
                        <li>
                          <Link href="/analyze?tab=social" className="text-slate-700 hover:text-blue-600 font-medium block">
                            • Google SERP Simulator
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/compare"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  pathname === "/compare"
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <GitCompare className="w-3.5 h-3.5 text-slate-500" />
                Compare
              </Link>

              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  pathname === "/dashboard"
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
                Dashboard
              </Link>

              <Link
                href="/pricing"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  pathname === "/pricing"
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Pricing
              </Link>
            </nav>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Cloud Engine
            </div>

            <Link
              href="/analyze"
              className="hidden sm:inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium px-3.5 sm:px-4 py-2 rounded-lg transition-colors"
            >
              Start Analysis
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/analyze"
            className="block px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
          >
            Technical SEO Analyzer
          </Link>
          <Link
            href="/compare"
            className="block px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
          >
            Competitor Benchmark
          </Link>
          <Link
            href="/dashboard"
            className="block px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
          >
            SaaS Dashboard &amp; Integrations
          </Link>
          <Link
            href="/pricing"
            className="block px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
          >
            Pricing &amp; Plans
          </Link>
          <Link
            href="/capstone"
            className="block px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 rounded-lg"
          >
            Methodology &amp; Architecture
          </Link>
          <div className="pt-2">
            <Link
              href="/analyze"
              className="w-full inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg"
            >
              Start Analysis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
