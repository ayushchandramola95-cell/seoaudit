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
} from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setFeaturesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setFeaturesOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const featureSuites = [
    {
      title: "Audits & Health",
      tier: "Free",
      items: [
        {
          name: "Technical SEO Audit",
          desc: "0-100 deterministic scoring, metadata, headings & headers",
          href: "/analyze",
          icon: ShieldCheck,
          badge: "Free",
        },
        {
          name: "404 Broken Link Crawler",
          desc: "Recursive link health, redirect hops & broken hrefs",
          href: "/analyze?tab=deadlinks",
          icon: Link2,
          badge: "Pro",
        },
      ],
    },
    {
      title: "Speed & Authority",
      tier: "Starter",
      items: [
        {
          name: "Core Web Vitals Lab",
          desc: "Lighthouse LCP, FCP, CLS, TTFB & transfer weights",
          href: "/analyze?tab=performance",
          icon: Zap,
          badge: "Starter",
        },
        {
          name: "Open PageRank & Traffic",
          desc: "DomCop PageRank, global rank & Common Crawl tier",
          href: "/analyze?tab=traffic",
          icon: TrendingUp,
          badge: "Starter",
        },
        {
          name: "Technology Stack Detector",
          desc: "Fingerprints CMS, frameworks, CDNs & analytics",
          href: "/analyze?tab=tech",
          icon: Cpu,
          badge: "Starter",
        },
      ],
    },
    {
      title: "Competitor Intelligence",
      tier: "Pro",
      items: [
        {
          name: "Head-to-Head Benchmark",
          desc: "Side-by-side technical score & vitals comparison",
          href: "/compare",
          icon: GitCompare,
          badge: "Pro",
        },
        {
          name: "Semantic Topic Gap Matrix",
          desc: "DOM TF-IDF cross-domain content opportunities",
          href: "/compare",
          icon: Layers,
          badge: "Pro",
        },
      ],
    },
    {
      title: "Agency & Telemetry",
      tier: "Agency",
      items: [
        {
          name: "Connected Telemetry (Mode B)",
          desc: "Google Search Console & GA4 read-only OAuth",
          href: "/dashboard?tab=connected",
          icon: Sparkles,
          badge: "Agency",
        },
        {
          name: "Health Alerts & Webhooks",
          desc: "Automated Slack, Discord & Zapier notifications",
          href: "/dashboard?tab=alerts",
          icon: Bell,
          badge: "Agency",
        },
        {
          name: "JSON-LD Schema Studio",
          desc: "Structured data generator with live validator",
          href: "/analyze?tab=schema",
          icon: Code,
          badge: "Free",
        },
      ],
    },
  ];

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
              {/* Features Mega Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setFeaturesOpen(!featuresOpen)}
                  onMouseEnter={() => setFeaturesOpen(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    featuresOpen || pathname.startsWith("/analyze")
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  Features &amp; Tools
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${featuresOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Mega Menu Flyout */}
                {featuresOpen && (
                  <div
                    onMouseLeave={() => setFeaturesOpen(false)}
                    className="absolute left-0 mt-2 w-[840px] -translate-x-12 bg-white rounded-xl shadow-xl border border-slate-200 p-6 grid grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-1 duration-150 z-50"
                  >
                    {featureSuites.map((suite, idx) => (
                      <div key={idx} className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            {suite.title}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              suite.tier === "Free"
                                ? "bg-slate-100 text-slate-700"
                                : suite.tier === "Starter"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : suite.tier === "Pro"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "bg-purple-50 text-purple-700 border border-purple-200"
                            }`}
                          >
                            {suite.tier}
                          </span>
                        </div>
                        <ul className="space-y-2">
                          {suite.items.map((item, itemIdx) => {
                            const ItemIcon = item.icon;
                            return (
                              <li key={itemIdx}>
                                <Link
                                  href={item.href}
                                  onClick={() => setFeaturesOpen(false)}
                                  className="group block p-2 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                    <ItemIcon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                                    <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600">
                                      {item.name}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 pl-6">
                                    {item.desc}
                                  </p>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
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

              <Link
                href="/capstone"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  pathname === "/capstone"
                    ? "bg-slate-100 text-slate-900 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                Methodology
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
            Platform Methodology
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
