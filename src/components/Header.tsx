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
  User as UserIcon,
  LogOut,
  Bot,
  BarChart3,
  Repeat,
  Languages,
  FileImage,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { usePlan } from "@/lib/auth/PlanContext";
import { formatTierName, PlanTier } from "@/lib/auth/tierLimits";
import ProjectSwitcher from "@/components/ProjectSwitcher";

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { tier, setTier, scansUsed, limits } = usePlan();
  const [productOpen, setProductOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tierMenuOpen, setTierMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const productRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const tierRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

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
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
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
    setUserMenuOpen(false);
  }, [pathname]);

  // Hide global navigation on the presentation deck route
  if (pathname?.startsWith("/presentation")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90">
      <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16 gap-3 lg:gap-6">
          {/* Logo & Brand & Active Project Workspace */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-lg sm:text-xl text-slate-900 tracking-tight shrink-0 whitespace-nowrap">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <span className="flex items-center gap-1.5 font-extrabold whitespace-nowrap">
                SEO Audit
                <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Intel
                </span>
              </span>
            </Link>

            <span className="text-slate-300 font-light text-base hidden sm:inline select-none">/</span>

            {/* Active Workspace Site Switcher (Vercel/Linear style next to brand) */}
            <div className="hidden sm:block shrink-0">
              <ProjectSwitcher />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0">
              {/* Product Mega Menu (Clickable Only) */}
              <div ref={productRef} className="static">
                <button
                  type="button"
                  onClick={() => {
                    setProductOpen((prev) => !prev);
                    setResourcesOpen(false);
                  }}
                  className={`flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    productOpen || pathname.startsWith("/analyze")
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                  aria-expanded={productOpen}
                >
                  Product
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${productOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Expansive, Full-Width Product Mega Dropdown (Modeled on Ahrefs & Semrush) */}
                {productOpen && (
                  <div className="absolute left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 max-w-[1360px] mx-auto top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 z-50">
                    <div className="grid grid-cols-12 divide-x divide-slate-100">
                      {/* Column 1: Core Technical Health (Ahrefs Style) */}
                      <div className="col-span-3 p-6 lg:p-7 space-y-4">
                        <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
                          Technical Health
                        </div>
                        <div className="space-y-1">
                          <Link href="/analyze" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                                <ShieldCheck className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                  Full Website Auditor
                                </div>
                                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                                  0–100 deterministic scoring across 14 engines.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/speed-lab" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                                <Zap className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                                  Core Web Vitals Lab
                                </div>
                                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                                  Lighthouse LCP, CLS, FCP &amp; TTFB metrics.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/broken-links" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                                <Link2 className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                                  Broken Link &amp; 404 Crawler
                                </div>
                                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                                  Deep internal &amp; outbound link validation.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/document-architecture" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                                <Layers className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                  Document Architecture
                                </div>
                                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                                  H1–H6 heading hierarchy &amp; DOM tree inspection.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/security-headers" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                <Lock className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                                  Security Headers Guard
                                </div>
                                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                                  HSTS, CSP, X-Frame-Options validation.
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>

                      {/* Column 2: Competitive & Bulk Intelligence */}
                      <div className="col-span-3 p-6 lg:p-7 space-y-4">
                        <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
                          Competitive Suite
                        </div>
                        <div className="space-y-1">
                          <Link href="/compare" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                                <GitCompare className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                  Competitor Benchmark
                                </div>
                                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                                  Side-by-side URL scoring &amp; framework diffs.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/content-gap" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 mt-0.5">
                                <Search className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                                  Semantic Content Gap
                                </div>
                                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                                  Missing keywords &amp; competitor heading topics.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/batch-audit" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                                <ListChecks className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                                  Multi-URL Batch Audit
                                </div>
                                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                                  Concurrent audit for up to 15 URLs in bulk.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/brand-radar" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                                <Radar className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                  Brand Radar AI (AEO)
                                </div>
                                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                                  Track brand citations in ChatGPT &amp; Gemini.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/google-hub" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                                <Globe className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                  Google Search &amp; GA4 Hub
                                </div>
                                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                                  Multi-site GSC clicks, rankings &amp; GA4 traffic.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/dashboard?tab=connected" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 mt-0.5">
                                <Server className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                                  Connected Telemetry
                                </div>
                                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                                  Mode B webhooks &amp; automated domain alerts.
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>

                      {/* Column 3: Specialized SEO Engines (Scrollable Vertical List) */}
                      <div className="col-span-3 p-6 lg:p-7 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                            Specialized SEO Engines
                          </span>
                          <Link href="/tools" onClick={() => setProductOpen(false)} className="text-[11px] font-bold text-blue-600 hover:underline">
                            All 21 Engines →
                          </Link>
                        </div>
                        <div className="space-y-1 max-h-[380px] overflow-y-auto pr-1.5 custom-scrollbar">
                          <Link href="/tools/traffic-estimator" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                                <TrendingUp className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                  Organic Traffic Estimator
                                </div>
                                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                                  Predict monthly reach, countries &amp; PPC value.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/keyword-research" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                                  Keyword Density Matrix
                                </div>
                                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                                  1/2/3-gram frequencies, KD% &amp; search intent.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/robots-sitemap" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                                <Bot className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                                  Robots.txt &amp; XML Sitemap
                                </div>
                                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                                  Live path tester, AI bot firewall &amp; GEO score.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/backlink-checker" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                                <Link2 className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                  Backlink Profile &amp; Anchors
                                </div>
                                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                                  Referring domains, follow ratio &amp; anchor text.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/redirect-tracer" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                                <Repeat className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                                  HTTP Redirect Chain Tracer
                                </div>
                                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                                  Trace 301/302 hops, loops &amp; SSL downgrades.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/google-hub" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                                <Globe className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                                  Google Search &amp; GA4 Hub
                                </div>
                                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                                  Multi-site GSC clicks, rankings &amp; GA4 traffic.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/geo-readiness" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                                <Bot className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                                  AI Search &amp; GEO Readiness
                                </div>
                                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                                  ChatGPT, Perplexity, Gemini &amp; /llms.txt.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/canonical-inspector" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                                <Link2 className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                  Canonical &amp; Duplicate Guard
                                </div>
                                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                                  Verify rel=canonical, HTTP vs HTTPS &amp; slashes.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/hreflang-auditor" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                                <Languages className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                                  Hreflang &amp; International SEO
                                </div>
                                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                                  Multilingual tags, return links &amp; ISO codes.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/image-optimizer" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                                <FileImage className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                                  Image SEO &amp; Next-Gen Formats
                                </div>
                                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                                  Alt text coverage, WebP/AVIF &amp; CLS dimensions.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/tech-detector" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                                <Cpu className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                  50+ Tech Stack Profiler
                                </div>
                                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                                  Identifies frameworks, CMS, CDNs &amp; servers.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/authority-checker" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                <TrendingUp className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                                  Open PageRank Lookup
                                </div>
                                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                                  Common Crawl PageRank decimal (0–10).
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/schema-validator" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                                <Code2 className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                  JSON-LD Schema Validator
                                </div>
                                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                                  Validates structured data &amp; OpenGraph.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/serp-preview" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                                <Search className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                                  SERP Snippet Simulator
                                </div>
                                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                                  Desktop &amp; mobile Google preview.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/speed-lab" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                                <Zap className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                                  Core Web Vitals Lab
                                </div>
                                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                                  Lighthouse LCP, CLS, FCP &amp; TTFB metrics.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/broken-links" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                                <Link2 className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                                  Broken Link &amp; 404 Crawler
                                </div>
                                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                                  Deep internal &amp; outbound link validation.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/document-architecture" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                                <Layers className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                  Document Architecture
                                </div>
                                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                                  H1–H6 heading hierarchy &amp; DOM tree inspection.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools/security-headers" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                <Lock className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                                  Security Headers Guard
                                </div>
                                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                                  HSTS, CSP, X-Frame-Options validation.
                                </div>
                              </div>
                            </div>
                          </Link>

                          <Link href="/tools" onClick={() => setProductOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 mt-0.5">
                                <LayoutDashboard className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                                  Full SEO Suite Hub
                                </div>
                                <div className="text-xs text-slate-500 leading-snug mt-0.5">
                                  Complete suite of 17 specialized SEO engines.
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>

                      {/* Column 4: Semrush-Style Spotlight Rail */}
                      <div className="col-span-3 p-6 lg:p-7 bg-slate-50/70 flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-200/80">
                            Inside Your AI Assistants
                          </div>

                          {/* Semrush-Style Spotlight Card */}
                          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm space-y-2.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">Claude</span>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">Cursor</span>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">OpenAI</span>
                            </div>
                            <div className="text-sm font-bold text-slate-900 flex items-center justify-between">
                              <span>SEO FastMCP Server</span>
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">Live</span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                              Run deep deterministic audits &amp; tech stack profiling conversationally directly inside Claude Desktop and Cursor IDE.
                            </p>
                            <Link
                              href="/mcp"
                              onClick={() => setProductOpen(false)}
                              className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 pt-1"
                            >
                              <span>Connect SEO Audit MCP to AI</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>

                          {/* Secondary REST API Card */}
                          <Link
                            href="/api-docs"
                            onClick={() => setProductOpen(false)}
                            className="block p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-indigo-300 transition-all group"
                          >
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 group-hover:text-indigo-600 mb-1">
                              <Code2 className="w-4 h-4 text-indigo-600" />
                              <span>REST API Reference</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-snug">
                              Interactive Swagger-style testing runner and cURL endpoints.
                            </p>
                          </Link>
                        </div>

                        <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500">
                          <div className="font-bold text-slate-700 mb-1">Popular Use Cases:</div>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-slate-500">
                            <Link href="/compare" onClick={() => setProductOpen(false)} className="hover:text-blue-600">Benchmarking</Link>
                            <span>•</span>
                            <Link href="/analyze" onClick={() => setProductOpen(false)} className="hover:text-blue-600">Technical Audits</Link>
                            <span>•</span>
                            <Link href="/tools/brand-radar" onClick={() => setProductOpen(false)} className="hover:text-blue-600">GEO AI Search</Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Bar Across Entire Mega Menu (Modeled on Ahrefs "Discover all tools →") */}
                    <div className="bg-slate-50 px-7 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs">
                      <Link
                        href="/tools"
                        onClick={() => setProductOpen(false)}
                        className="font-bold text-sm text-slate-900 hover:text-blue-600 flex items-center gap-2 transition-colors"
                      >
                        <span>Discover All SEO Engines &amp; Suite</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <span className="text-slate-500 font-medium hidden md:inline">
                        Deterministic 0–100 scoring with sub-100ms latency. Zero fabricated metrics.
                      </span>
                      <Link
                        href="/pricing"
                        onClick={() => setProductOpen(false)}
                        className="font-bold text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors"
                      >
                        <span>Compare all plans &amp; quotas</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Resources Mega Menu (Clickable Only) */}
              <div ref={resourcesRef} className="static">
                <button
                  type="button"
                  onClick={() => {
                    setResourcesOpen((prev) => !prev);
                    setProductOpen(false);
                  }}
                  className={`flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    resourcesOpen || pathname === "/capstone" || pathname === "/project-info"
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                  aria-expanded={resourcesOpen}
                >
                  Resources
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${resourcesOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Expansive Resources Mega Dropdown */}
                {resourcesOpen && (
                  <div className="absolute left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 max-w-[1280px] mx-auto top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 z-50">
                    <div className="grid grid-cols-12 divide-x divide-slate-100">
                      {/* Column 1: Specifications & Architecture */}
                      <div className="col-span-3 p-6 lg:p-7 space-y-4">
                        <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
                          Architecture &amp; Specs
                        </div>
                        <ul className="space-y-1">
                          <li>
                            <Link href="/capstone" onClick={() => setResourcesOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                              <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                Scoring Methodology Spec
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                                Mathematical formulas &amp; deterministic rules.
                              </p>
                            </Link>
                          </li>
                          <li>
                            <Link href="/project-info" onClick={() => setResourcesOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                              <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                Platform Specifications
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                                Complete multi-phase engineering specs.
                              </p>
                            </Link>
                          </li>
                          <li>
                            <Link href="/worklog" onClick={() => setResourcesOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                              <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                Engineering Changelog
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                                Day-by-day development timeline &amp; viva log.
                              </p>
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {/* Column 2: Developer & Automation */}
                      <div className="col-span-3 p-6 lg:p-7 space-y-4">
                        <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
                          Developer &amp; CI/CD
                        </div>
                        <ul className="space-y-1">
                          <li>
                            <Link href="/api-docs" onClick={() => setResourcesOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                              <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                                REST API &amp; Webhooks
                                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700">v1.0</span>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                                Interactive endpoints &amp; testing runner.
                              </p>
                            </Link>
                          </li>
                          <li>
                            <Link href="/mcp" onClick={() => setResourcesOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                              <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                                SEO MCP Server
                                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700">New</span>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                                Claude Desktop &amp; Cursor IDE integration.
                              </p>
                            </Link>
                          </li>
                          <li>
                            <Link href="/tools/database-manager" onClick={() => setResourcesOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                              <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                                Custom PostgreSQL
                                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700">Live</span>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                                In-site database engine &amp; DDL migrations.
                              </p>
                            </Link>
                          </li>
                          <li>
                            <Link href="/dashboard?tab=connected" onClick={() => setResourcesOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                              <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                Mode A vs Mode B
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                                Public crawl vs owner GSC telemetry.
                              </p>
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {/* Column 3: Use Cases & Comparisons */}
                      <div className="col-span-3 p-6 lg:p-7 space-y-4">
                        <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
                          Use Cases &amp; Insights
                        </div>
                        <ul className="space-y-1">
                          <li>
                            <Link href="/compare" onClick={() => setResourcesOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                              <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                Competitive Benchmarking
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                                Compare 2 URLs with live score differentials.
                              </p>
                            </Link>
                          </li>
                          <li>
                            <Link href="/tools/brand-radar" onClick={() => setResourcesOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                              <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                AI Search (GEO) Visibility
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                                Monitor presence in ChatGPT &amp; Gemini answers.
                              </p>
                            </Link>
                          </li>
                          <li>
                            <Link href="/pricing" onClick={() => setResourcesOpen(false)} className="p-2.5 -mx-2 rounded-xl hover:bg-slate-50 transition-colors block group">
                              <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                SEO Audit vs Ahrefs &amp; Semrush
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                                Transparent tier pricing with zero credit burn traps.
                              </p>
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {/* Column 4: Viva Defense Spotlight */}
                      <div className="col-span-3 p-6 lg:p-7 bg-slate-50/70 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-200/80">
                            Viva Defense Spotlight
                          </div>

                          <Link
                            href="/capstone"
                            onClick={() => setResourcesOpen(false)}
                            className="block p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-blue-300 transition-all group"
                          >
                            <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 mb-1">
                              Viva Voce Cheatsheet
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                              25 college viva defense questions with complete architectural answers.
                            </p>
                          </Link>

                          <Link
                            href="/pricing"
                            onClick={() => setResourcesOpen(false)}
                            className="block p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-blue-300 transition-all group"
                          >
                            <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 mb-1">
                              Transparent Plans
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                              Free forever, $19 Starter, $49 Pro, $149 Agency.
                            </p>
                          </Link>
                        </div>

                        <Link
                          href="/tools"
                          onClick={() => setResourcesOpen(false)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-between pt-3 border-t border-slate-200"
                        >
                          <span>Explore All 17 Standalone Tools</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    {/* Bottom Bar Across Entire Mega Menu */}
                    <div className="bg-slate-50 px-7 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">
                        Complete technical specifications, methodology formulas, and academic defense documentation.
                      </span>
                      <Link
                        href="/capstone"
                        onClick={() => setResourcesOpen(false)}
                        className="font-bold text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors"
                      >
                        <span>View Scoring Methodology Spec</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Navigation Links */}
              <Link
                href="/tools"
                className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors whitespace-nowrap ${
                  pathname?.startsWith("/tools")
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Tools
              </Link>

              <Link
                href="/compare"
                className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors whitespace-nowrap ${
                  pathname === "/compare"
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Compare
              </Link>

              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors whitespace-nowrap ${
                  pathname === "/dashboard"
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Dashboard
              </Link>

              <Link
                href="/pricing"
                className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors whitespace-nowrap ${
                  pathname === "/pricing"
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Pricing
              </Link>
            </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">

            {/* Global Ctrl+K Command Palette Trigger */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("seoseite:open-command-palette"))}
              className="hidden sm:inline-flex items-center gap-2 h-9 px-2.5 text-xs font-medium rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200/90 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title="Quick Search & Command Palette (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="hidden xl:inline">Search</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-white text-slate-600 rounded border border-slate-200 shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Plan Tier Simulator (Compact single-line pill) */}
            <div className="relative shrink-0" ref={tierRef}>
              <button
                type="button"
                onClick={() => setTierMenuOpen(!tierMenuOpen)}
                className="hidden md:inline-flex items-center gap-1.5 h-9 px-2.5 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-800 transition-colors border border-slate-200/90 cursor-pointer whitespace-nowrap shrink-0"
                title="Switch active testing tier"
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    tier === "enterprise"
                      ? "bg-purple-600"
                      : tier === "pro"
                      ? "bg-blue-600"
                      : tier === "starter"
                      ? "bg-emerald-500"
                      : "bg-slate-400"
                  }`}
                />
                <span className="text-slate-400 font-medium hidden 2xl:inline">Plan:</span>
                <span className="font-bold text-blue-700">
                  {tier === "free"
                    ? "Free"
                    : tier === "starter"
                    ? "Starter"
                    : tier === "pro"
                    ? "Pro"
                    : "Agency"}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
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

            <div className="hidden md:block h-5 w-px bg-slate-200 mx-0.5 shrink-0" />

            {/* Authentication States */}
            {!isAuthenticated ? (
              <div className="hidden md:flex items-center gap-1.5 shrink-0">
                <Link
                  href="/login"
                  className="inline-flex items-center h-9 px-2.5 text-[13px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  Sign In
                </Link>
                <Link
                  href="/pricing"
                  className="hidden xl:inline-flex items-center justify-center h-9 px-3 text-xs font-bold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 transition-all whitespace-nowrap shrink-0"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="relative shrink-0" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  aria-expanded={userMenuOpen}
                  title={`${user?.name} (${formatTierName(tier)})`}
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-2xs">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <ChevronDown className={`w-3 h-3 text-slate-400 mr-1 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="p-3 bg-slate-50 rounded-xl mb-1 border border-slate-100">
                      <div className="font-bold text-slate-900 truncate">{user?.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
                      <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-200/80">
                        <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                          {formatTierName(tier)}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {scansUsed} / {limits.dailyScans === Infinity ? "∞" : limits.dailyScans} scans
                        </span>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-500" />
                        <span>Operations Dashboard</span>
                      </Link>
                      <Link
                        href="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-slate-500" />
                        <span>Account &amp; Subscription</span>
                      </Link>
                      <Link
                        href="/pricing"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-lg text-blue-700 hover:bg-blue-50 font-bold transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-blue-600" />
                          <span>Upgrade Plan</span>
                        </div>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    <div className="mt-1 pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 font-medium transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Analyze Site Button */}
            <Link
              href="/analyze"
              className="hidden sm:inline-flex items-center justify-center gap-1.5 h-9 px-3.5 text-xs font-bold rounded-lg bg-slate-900 hover:bg-blue-600 text-white transition-colors shadow-xs whitespace-nowrap shrink-0"
            >
              <span>Analyze</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-4">
          {/* Active Project Switcher for Mobile */}
          <div className="sm:hidden p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Active Project Site
            </div>
            <ProjectSwitcher />
          </div>
          {/* User Status Bar in Mobile */}
          {isAuthenticated ? (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">{user?.name}</div>
                <div className="text-[11px] text-blue-600 font-semibold">{formatTierName(tier)}</div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-bold text-slate-700 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200"
                >
                  Account
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-rose-600 px-2 py-1.5"
                >
                  Log out
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2 rounded-xl border border-slate-200 text-center font-bold text-xs text-slate-800 hover:bg-slate-50"
              >
                Sign In
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2 rounded-xl bg-blue-600 text-center font-bold text-xs text-white hover:bg-blue-500"
              >
                Sign Up
              </Link>
            </div>
          )}

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
              17 Standalone SEO Tools
            </Link>
            <Link
              href="/tools/google-hub"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold rounded-lg text-blue-600 hover:bg-blue-50"
            >
              Google GSC &amp; GA4 Hub
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
