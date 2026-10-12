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
  Code2,
  Bell,
  Menu,
  X,
  Sparkles,
  Search,
  FileText,
  Server,
  Lock,
  Radar,
  ListChecks,
  Terminal,
  ExternalLink,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { usePlan } from "@/lib/auth/PlanContext";
import { formatTierName, PlanTier } from "@/lib/auth/tierLimits";

export default function Header() {
  const pathname = usePathname();
  const { tier, setTier } = usePlan();
  const [productOpen, setProductOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tierMenuOpen, setTierMenuOpen] = useState(false);

  const productRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const tierRef = useRef<HTMLDivElement>(null);

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (productRef.current && !productRef.current.contains(event.target as Node)) {
        setProductOpen(false);
      }
      if (resourcesRef.current && !resourcesRef.current.contains(event.target as Node)) {
        setResourcesOpen(false);
      }
      if (tierRef.current && !tierRef.current.contains(event.target as Node)) {
        setTierMenuOpen(false);
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-slate-900 tracking-tight shrink-0">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-none">
                <Globe className="w-4 h-4" />
              </div>
              <span className="flex items-center gap-1.5 font-extrabold">
                SeoSeite
                <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Intel
                </span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {/* Product Mega Menu (Clickable Only) */}
              <div className="relative" ref={productRef}>
                <button
                  type="button"
                  onClick={() => {
                    setProductOpen((prev) => !prev);
                    setResourcesOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                    productOpen || pathname.startsWith("/analyze")
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                  aria-expanded={productOpen}
                >
                  Product
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${productOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Expanded, Spacious Product Mega Dropdown */}
                {productOpen && (
                  <div className="absolute left-0 mt-3 w-[1040px] -translate-x-12 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 z-50">
                    <div className="p-7 grid grid-cols-12 gap-8">
                      {/* Column 1: Core Audits & Health */}
                      <div className="col-span-3 space-y-4">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
                          Technical Health
                        </div>
                        <div className="space-y-1">
                          <Link href="/analyze" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2.5 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                                  Full Website Auditor
                                </div>
                                <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                                  0–100 deterministic scoring across 14 engines.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/speed-lab" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2.5 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                                <Zap className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-900 group-hover:text-amber-600">
                                  Core Web Vitals Lab
                                </div>
                                <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                                  Lighthouse LCP, CLS, FCP &amp; TTFB metrics.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/broken-links" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2.5 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                <Link2 className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-900 group-hover:text-purple-600">
                                  Broken Link &amp; 404 Crawler
                                </div>
                                <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                                  Deep internal &amp; outbound link validation.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/analyze?tab=structure" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2.5 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                                <Layers className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                                  Document Architecture
                                </div>
                                <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                                  H1–H6 heading hierarchy &amp; DOM tree.
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>

                      {/* Column 2: Competitive & Intelligence */}
                      <div className="col-span-3 space-y-4">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
                          Competitive Suite
                        </div>
                        <div className="space-y-1">
                          <Link href="/compare" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2.5 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                <GitCompare className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">
                                  Competitor Benchmark
                                </div>
                                <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                                  Side-by-side URL scoring &amp; framework diffs.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/content-gap" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2.5 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                                <Search className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-900 group-hover:text-pink-600">
                                  Semantic Content Gap
                                </div>
                                <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                                  Missing keywords &amp; competitor heading topics.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/batch-audit" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2.5 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                                <ListChecks className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-900 group-hover:text-slate-700">
                                  Multi-URL Batch Audit
                                </div>
                                <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                                  Concurrent audit for up to 15 URLs in bulk.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/brand-radar" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2.5 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <Radar className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                                  Brand Radar AI (AEO)
                                </div>
                                <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                                  Track brand citations in ChatGPT &amp; Gemini.
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>

                      {/* Column 3: Standalone Micro-Tools */}
                      <div className="col-span-3 space-y-4">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Micro-Tools
                          </span>
                          <Link href="/tools" onClick={() => setProductOpen(false)} className="text-[11px] font-bold text-blue-600 hover:underline">
                            Directory Hub →
                          </Link>
                        </div>
                        <div className="space-y-1">
                          <Link href="/tools/tech-detector" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2.5 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                <Cpu className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">
                                  50+ Tech Stack Profiler
                                </div>
                                <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                                  Identifies frameworks, CMS &amp; CDNs.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/authority-checker" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2.5 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                <TrendingUp className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-600">
                                  Open PageRank Lookup
                                </div>
                                <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                                  Common Crawl PageRank data.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/schema-validator" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2.5 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <Code2 className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                                  JSON-LD Schema Validator
                                </div>
                                <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                                  Validates structured data &amp; OpenGraph.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/serp-preview" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2.5 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                                <Search className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-900 group-hover:text-teal-600">
                                  SERP Snippet Simulator
                                </div>
                                <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                                  Desktop &amp; mobile Google preview.
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>

                      {/* Column 4: Platform Spotlights (Right Rail) */}
                      <div className="col-span-3 space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                            Featured Spotlight
                          </div>

                          <Link
                            href="/mcp"
                            onClick={() => setProductOpen(false)}
                            className="block p-3 rounded-lg bg-white border border-slate-200 hover:border-blue-300 transition-all mb-2.5 group"
                          >
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-blue-600 mb-1">
                              <Terminal className="w-3.5 h-3.5 text-blue-600" />
                              <span>SEO MCP Server</span>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700">New</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-snug">
                              Connect Claude Desktop &amp; Cursor IDE to run audits conversationally.
                            </p>
                          </Link>

                          <Link
                            href="/api-docs"
                            onClick={() => setProductOpen(false)}
                            className="block p-3 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 transition-all group"
                          >
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-indigo-600 mb-1">
                              <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                              <span>REST API Reference</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-snug">
                              Interactive endpoints, testing runner &amp; cURL snippets.
                            </p>
                          </Link>
                        </div>

                        <Link
                          href="/tools"
                          onClick={() => setProductOpen(false)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-between pt-2 border-t border-slate-200"
                        >
                          <span>Explore all 9 tools</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="bg-slate-50/80 px-7 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">
                        Deterministic 0–100 scoring with sub-100ms latency. Zero fabricated metrics.
                      </span>
                      <Link
                        href="/pricing"
                        onClick={() => setProductOpen(false)}
                        className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        Compare all plan features &amp; quotas
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Resources Mega Menu (Clickable Only) */}
              <div className="relative" ref={resourcesRef}>
                <button
                  type="button"
                  onClick={() => {
                    setResourcesOpen((prev) => !prev);
                    setProductOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                    resourcesOpen || pathname === "/capstone" || pathname === "/project-info"
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                  aria-expanded={resourcesOpen}
                >
                  Resources
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${resourcesOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Expanded, Spacious Resources Dropdown */}
                {resourcesOpen && (
                  <div className="absolute left-0 mt-3 w-[840px] -translate-x-24 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 z-50">
                    <div className="p-7 grid grid-cols-3 gap-8">
                      {/* Column 1: Specifications */}
                      <div className="space-y-4">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
                          Architecture &amp; Specs
                        </div>
                        <ul className="space-y-1">
                          <li>
                            <Link href="/capstone" onClick={() => setResourcesOpen(false)} className="p-2.5 -mx-2.5 rounded-xl hover:bg-slate-50 transition-colors block group">
                              <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                                Scoring Methodology
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                Mathematical formulas &amp; deterministic rules.
                              </p>
                            </Link>
                          </li>
                          <li>
                            <Link href="/project-info" onClick={() => setResourcesOpen(false)} className="p-2.5 -mx-2.5 rounded-xl hover:bg-slate-50 transition-colors block group">
                              <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                                Platform Specifications
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                Complete multi-phase engineering specs.
                              </p>
                            </Link>
                          </li>
                          <li>
                            <Link href="/worklog" onClick={() => setResourcesOpen(false)} className="p-2.5 -mx-2.5 rounded-xl hover:bg-slate-50 transition-colors block group">
                              <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                                Engineering Changelog
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                Day-by-day development timeline.
                              </p>
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {/* Column 2: Developer & Automation */}
                      <div className="space-y-4">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
                          Developer &amp; CI/CD
                        </div>
                        <ul className="space-y-1">
                          <li>
                            <Link href="/api-docs" onClick={() => setResourcesOpen(false)} className="p-2.5 -mx-2.5 rounded-xl hover:bg-slate-50 transition-colors block group">
                              <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 flex items-center gap-1">
                                REST API &amp; Webhooks
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700">v1.0</span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                Interactive endpoints &amp; testing runner.
                              </p>
                            </Link>
                          </li>
                          <li>
                            <Link href="/mcp" onClick={() => setResourcesOpen(false)} className="p-2.5 -mx-2.5 rounded-xl hover:bg-slate-50 transition-colors block group">
                              <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 flex items-center gap-1">
                                SEO MCP Server
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700">New</span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                Claude Desktop &amp; Cursor IDE integration.
                              </p>
                            </Link>
                          </li>
                          <li>
                            <Link href="/dashboard?tab=connected" onClick={() => setResourcesOpen(false)} className="p-2.5 -mx-2.5 rounded-xl hover:bg-slate-50 transition-colors block group">
                              <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                                Mode A vs Mode B
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                Public crawl vs owner GSC telemetry.
                              </p>
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {/* Column 3: Quick Spotlight Cards */}
                      <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                            Quick Access
                          </div>
                          <Link
                            href="/pricing"
                            onClick={() => setResourcesOpen(false)}
                            className="block p-3 rounded-lg bg-white border border-slate-200 hover:border-blue-300 transition-all mb-2.5 group"
                          >
                            <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 mb-1">
                              Transparent Plans
                            </div>
                            <p className="text-[11px] text-slate-500 leading-snug">
                              Free forever, $19 Starter, $49 Pro, $149 Agency.
                            </p>
                          </Link>

                          <Link
                            href="/capstone"
                            onClick={() => setResourcesOpen(false)}
                            className="block p-3 rounded-lg bg-white border border-slate-200 hover:border-blue-300 transition-all group"
                          >
                            <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 mb-1">
                              Viva Voce Cheatsheet
                            </div>
                            <p className="text-[11px] text-slate-500 leading-snug">
                              25 college viva defense questions with answers.
                            </p>
                          </Link>
                        </div>

                        <Link
                          href="/tools"
                          onClick={() => setResourcesOpen(false)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-between pt-2 border-t border-slate-200"
                        >
                          <span>Explore Tools Hub</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Navigation Links */}
              <Link
                href="/tools"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  pathname?.startsWith("/tools")
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Tools
              </Link>

              <Link
                href="/compare"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  pathname === "/compare"
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Compare
              </Link>

              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  pathname === "/dashboard"
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Dashboard
              </Link>

              <Link
                href="/pricing"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  pathname === "/pricing"
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Pricing
              </Link>
            </nav>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            {/* Plan Tier Simulator (Cleaner, more stylish) */}
            <div className="relative" ref={tierRef}>
              <button
                onClick={() => setTierMenuOpen(!tierMenuOpen)}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors border border-slate-200/90 cursor-pointer"
                title="Switch active testing tier"
              >
                <Sliders className="w-3.5 h-3.5 text-blue-600" />
                <span>Tier:</span>
                <span className="capitalize font-bold text-blue-700">{formatTierName(tier)}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {tierMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 text-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 tracking-wider border-b border-slate-100 mb-1">
                    Simulate Plan Tier
                  </div>
                  {(["free", "starter", "pro", "enterprise"] as PlanTier[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setTier(t);
                        setTierMenuOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg capitalize font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                        tier === t
                          ? "bg-blue-50 text-blue-700 font-bold"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{formatTierName(t)}</span>
                      {tier === t && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                  <div className="mt-1 pt-1 border-t border-slate-100">
                    <Link
                      href="/pricing"
                      onClick={() => setTierMenuOpen(false)}
                      className="block text-[11px] text-blue-600 hover:underline px-2 py-1 font-semibold"
                    >
                      View All Tier Quotas →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <Link
              href="/analyze"
              className="inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
            >
              Analyze Site
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-3">
          <div className="space-y-1">
            <Link
              href="/analyze"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold rounded-lg text-slate-900 hover:bg-slate-50"
            >
              Site Health Auditor
            </Link>
            <Link
              href="/tools"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold rounded-lg text-slate-900 hover:bg-slate-50"
            >
              9 Standalone Free Tools
            </Link>
            <Link
              href="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold rounded-lg text-slate-900 hover:bg-slate-50"
            >
              Competitor Benchmark
            </Link>
            <Link
              href="/tools/content-gap"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold rounded-lg text-slate-900 hover:bg-slate-50"
            >
              Semantic Content Gap
            </Link>
            <Link
              href="/tools/batch-audit"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold rounded-lg text-slate-900 hover:bg-slate-50"
            >
              Multi-URL Batch Audit
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold rounded-lg text-slate-900 hover:bg-slate-50"
            >
              Dashboard
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold rounded-lg text-slate-900 hover:bg-slate-50"
            >
              Pricing &amp; Plans
            </Link>
            <Link
              href="/api-docs"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold rounded-lg text-slate-900 hover:bg-slate-50"
            >
              REST API Reference
            </Link>
            <Link
              href="/mcp"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold rounded-lg text-slate-900 hover:bg-slate-50"
            >
              Model Context Protocol (MCP)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
