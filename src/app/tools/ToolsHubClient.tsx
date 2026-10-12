"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Link2,
  Zap,
  Code2,
  Search,
  Layers,
  Award,
  ArrowRight,
  Sparkles,
  Filter,
  CheckCircle2,
  ExternalLink
} from "lucide-react";

interface ToolCard {
  id: string;
  name: string;
  description: string;
  href: string;
  category: "crawl" | "speed" | "meta" | "stack";
  badge: string;
  icon: any;
  metric: string;
}

export default function ToolsHubClient() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const tools: ToolCard[] = [
    {
      id: "broken-links",
      name: "Broken Link & 404 Checker",
      description: "Crawl website URLs in real-time to detect 404 dead links, broken redirect chains, and missing anchor resources.",
      href: "/tools/broken-links",
      category: "crawl",
      badge: "Free Utility",
      icon: Link2,
      metric: "Sub-2s crawl",
    },
    {
      id: "speed-lab",
      name: "Core Web Vitals & PageSpeed Lab",
      description: "Test synthetic Lighthouse performance, LCP, CLS, INP, FCP, and TTFB directly powered by Google PageSpeed Insights.",
      href: "/tools/speed-lab",
      category: "speed",
      badge: "Google API",
      icon: Zap,
      metric: "LCP, CLS, INP",
    },
    {
      id: "schema-validator",
      name: "Schema JSON-LD & OG Validator",
      description: "Validate Schema.org structured data, rich snippet syntax, OpenGraph tags, and Twitter Cards for AI & search visibility.",
      href: "/tools/schema-validator",
      category: "meta",
      badge: "Code Studio",
      icon: Code2,
      metric: "Live Code Copy",
    },
    {
      id: "serp-preview",
      name: "Google SERP Simulator",
      description: "Simulate pixel-perfect Google desktop and mobile search snippets with real-time character and pixel truncation meters.",
      href: "/tools/serp-preview",
      category: "meta",
      badge: "Pixel Accurate",
      icon: Search,
      metric: "Desktop & Mobile",
    },
    {
      id: "tech-detector",
      name: "Technology Stack Detector",
      description: "Detect frameworks (React, Next.js, Vue), CMSs (WordPress, Shopify), CDNs, and server engines in under 100 milliseconds.",
      href: "/tools/tech-detector",
      category: "stack",
      badge: "50+ Signatures",
      icon: Layers,
      metric: "<100ms detection",
    },
    {
      id: "authority-checker",
      name: "Open PageRank & Authority Lookup",
      description: "Query any domain's global rank, PageRank decimal rating (0–10), and authority percentile from Common Crawl web data.",
      href: "/tools/authority-checker",
      category: "stack",
      badge: "Open Data",
      icon: Award,
      metric: "Common Crawl",
    },
  ];

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Ahrefs-Style Modular Architecture
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Free SEO &amp; Technical Web Tools
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Standalone, focused diagnostic utilities built for developers, founders, and technical SEOs. Run instant checks with zero sign-up friction.
        </p>

        {/* Search bar */}
        <div className="mt-8 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search tools (e.g. 404, speed, schema, tech)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white shadow-sm"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
              activeCategory === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Tools ({tools.length})
          </button>
          <button
            onClick={() => setActiveCategory("crawl")}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
              activeCategory === "crawl" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Crawling &amp; Links
          </button>
          <button
            onClick={() => setActiveCategory("speed")}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
              activeCategory === "speed" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Performance &amp; Speed
          </button>
          <button
            onClick={() => setActiveCategory("meta")}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
              activeCategory === "meta" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Meta &amp; Structured Data
          </button>
          <button
            onClick={() => setActiveCategory("stack")}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
              activeCategory === "stack" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Stack &amp; Authority
          </button>
        </div>
      </div>

      {/* Grid of Micro-Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.id}
              href={tool.href}
              className="flat-card p-6 bg-white border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                    {tool.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {tool.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400 text-[11px]">{tool.metric}</span>
                <span className="font-semibold text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Launch Tool <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Cross-Promotion: Full Audit Suite & Compare */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flat-card p-6 sm:p-8 bg-slate-900 text-white rounded-2xl flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
              Comprehensive Suite
            </div>
            <h3 className="text-xl font-bold mb-2">Need all 14 diagnostic engines at once?</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Run a complete 0–100 deterministic technical health audit, PageSpeed test, security check, and AI developer action plan in one combined scan.
            </p>
          </div>
          <Link
            href="/analyze"
            className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
          >
            Launch Full Website Audit <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flat-card p-6 sm:p-8 bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
              Competitive Intelligence
            </div>
            <h3 className="text-xl font-bold mb-2">Benchmarking against competitors?</h3>
            <p className="text-xs text-blue-100 leading-relaxed mb-6">
              Compare your website head-to-head with competitor URLs to discover content gaps, technology differences, and performance advantages.
            </p>
          </div>
          <Link
            href="/compare"
            className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white text-slate-900 hover:bg-blue-50 text-xs font-bold transition-colors"
          >
            Launch Competitor Benchmark <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
