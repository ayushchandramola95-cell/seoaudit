"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Link2, 
  Zap, 
  Code2, 
  Search, 
  Cpu, 
  TrendingUp, 
  Radar, 
  GitCompare, 
  ListChecks, 
  ArrowRight, 
  ChevronRight, 
  Check, 
  Sparkles,
  CheckCircle2,
  ExternalLink
} from "lucide-react";

export default function ToolsAnimatedGrid() {
  const [activeFilter, setActiveFilter] = useState<"all" | "technical" | "speed" | "ai">("all");

  const tools = [
    {
      title: "Broken Link & 404 Checker",
      group: "technical" as const,
      category: "Site Health & Crawl",
      desc: "Deep-crawls internal and external hyperlinks, identifying dead 404 links, redirect loops, and broken anchor tags.",
      href: "/tools/broken-links",
      badge: "Instant Crawler",
      icon: Link2,
      color: "text-rose-600 bg-rose-50 border-rose-200",
      accent: "group-hover:border-rose-400",
      preview: (
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-mono space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span>Indexed: 64 URLs</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <Check className="w-3 h-3 stroke-[3]" /> 0 Broken 404s
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <div className="h-full bg-emerald-500 w-full" />
          </div>
        </div>
      ),
    },
    {
      title: "Core Web Vitals & PageSpeed Lab",
      category: "Performance Telemetry",
      desc: "Direct Google Lighthouse API telemetry measuring real LCP, FCP, CLS, INP, and TTFB laboratory metrics.",
      href: "/tools/speed-lab",
      badge: "Lighthouse Telemetry",
      icon: Zap,
      color: "text-amber-600 bg-amber-50 border-amber-200",
      accent: "group-hover:border-amber-400",
      preview: (
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-mono grid grid-cols-3 gap-1.5 text-center">
          <div className="bg-white p-1 rounded border border-slate-200/80">
            <div className="text-[9px] text-slate-400 uppercase">LCP</div>
            <div className="font-bold text-emerald-600">1.1s</div>
          </div>
          <div className="bg-white p-1 rounded border border-slate-200/80">
            <div className="text-[9px] text-slate-400 uppercase">CLS</div>
            <div className="font-bold text-emerald-600">0.01</div>
          </div>
          <div className="bg-white p-1 rounded border border-slate-200/80">
            <div className="text-[9px] text-slate-400 uppercase">Score</div>
            <div className="font-bold text-emerald-600">98/100</div>
          </div>
        </div>
      ),
    },
    {
      title: "Schema JSON-LD & OG Validator",
      category: "Structured Data Studio",
      desc: "Validates Schema.org JSON-LD syntax, entity types, and OpenGraph social previews with copy-paste remediations.",
      href: "/tools/schema-validator",
      badge: "Syntax Validator",
      icon: Code2,
      color: "text-blue-600 bg-blue-50 border-blue-200",
      accent: "group-hover:border-blue-400",
      preview: (
        <div className="p-2.5 rounded-xl bg-slate-900 text-slate-300 text-[10px] font-mono space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span>@type: Organization</span>
            <span className="text-emerald-400 font-bold">✓ Valid Syntax</span>
          </div>
          <div className="text-slate-500 truncate">{`{ "@context": "https://schema.org" }`}</div>
        </div>
      ),
    },
    {
      title: "Google Desktop & Mobile SERP Preview",
      category: "Snippet Simulator",
      desc: "Pixel-accurate Google SERP preview simulator with real-time title and meta description truncation warnings.",
      href: "/tools/serp-preview",
      badge: "Pixel Accurate",
      icon: Search,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      accent: "group-hover:border-emerald-400",
      preview: (
        <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 text-left space-y-0.5">
          <div className="text-[10px] text-slate-500 font-sans truncate">https://seoaudit.cloud.run › tools</div>
          <div className="text-xs font-bold text-blue-700 font-sans truncate">SEO Audit — Sub-Second SEO Audits</div>
          <div className="text-[10px] text-slate-500 line-clamp-1">Deterministic health score across 14 engines...</div>
        </div>
      ),
    },
    {
      title: "50+ Tech Stack Profiler",
      category: "Infrastructure Fingerprint",
      desc: "Fingerprints React, Next.js, Vue, Tailwind, Cloudflare, Shopify, WordPress, and 45+ other technologies instantly.",
      href: "/tools/tech-detector",
      badge: "Signature Engine",
      icon: Cpu,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
      accent: "group-hover:border-indigo-400",
      preview: (
        <div className="flex flex-wrap gap-1 p-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-bold">
          <span className="px-1.5 py-0.5 rounded bg-white text-slate-800 border border-slate-200">Next.js 16</span>
          <span className="px-1.5 py-0.5 rounded bg-white text-slate-800 border border-slate-200">React 19</span>
          <span className="px-1.5 py-0.5 rounded bg-white text-slate-800 border border-slate-200">Tailwind</span>
          <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">Cloudflare</span>
        </div>
      ),
    },
    {
      title: "DomCop Open PageRank Lookup",
      category: "Authority & Reach",
      desc: "Live Common Crawl Open PageRank lookup (0–10 rank, status, global percentile) without fabricated metrics.",
      href: "/tools/authority-checker",
      badge: "Open Data",
      icon: TrendingUp,
      color: "text-cyan-600 bg-cyan-50 border-cyan-200",
      accent: "group-hover:border-cyan-400",
      preview: (
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-mono flex items-center justify-between">
          <div>
            <div className="text-[9px] text-slate-400">PageRank</div>
            <div className="font-black text-slate-900 text-sm">8.4 / 10</div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
            Top 0.01% Global
          </span>
        </div>
      ),
    },
    {
      title: "Brand Radar AI (AEO Visibility)",
      category: "Generative Engine Visibility",
      desc: "Measures brand recommendation citations across ChatGPT, Google Gemini, Claude, and Perplexity for buyer prompts.",
      href: "/tools/brand-radar",
      badge: "AEO Studio",
      icon: Radar,
      color: "text-purple-600 bg-purple-50 border-purple-200",
      accent: "group-hover:border-purple-400",
      preview: (
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[10px] space-y-1">
          <div className="flex justify-between font-bold text-slate-600">
            <span>ChatGPT Citation: 84%</span>
            <span className="text-purple-600">Leader</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <div className="h-full bg-purple-600 w-4/5" />
          </div>
        </div>
      ),
    },
    {
      title: "Semantic Content Gap & Keywords",
      category: "Competitive Intelligence",
      desc: "Cross-domain TF-IDF keyword overlap, missing competitor terms, and heading topic disparities.",
      href: "/tools/content-gap",
      badge: "TF-IDF Matrix",
      icon: GitCompare,
      color: "text-pink-600 bg-pink-50 border-pink-200",
      accent: "group-hover:border-pink-400",
      preview: (
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-mono flex items-center justify-between">
          <span className="text-slate-600">Keyword Overlap: 72%</span>
          <span className="text-rose-600 font-bold">+14 Missing Gaps</span>
        </div>
      ),
    },
    {
      title: "Multi-URL Batch SEO Auditor",
      category: "Bulk Parallel Engine",
      desc: "Concurrently audits up to 15 URLs in parallel with master spreadsheet matrix, score sorting, and CSV export.",
      href: "/tools/batch-audit",
      badge: "Up to 15 URLs",
      icon: ListChecks,
      color: "text-slate-800 bg-slate-100 border-slate-300",
      accent: "group-hover:border-slate-400",
      preview: (
        <div className="p-2.5 rounded-xl bg-slate-900 text-slate-300 text-[10px] font-mono space-y-1">
          <div className="flex justify-between">
            <span className="truncate max-w-[120px]">stripe.com</span>
            <span className="text-emerald-400 font-bold">98/100</span>
          </div>
          <div className="flex justify-between">
            <span className="truncate max-w-[120px]">linear.app</span>
            <span className="text-emerald-400 font-bold">96/100</span>
          </div>
        </div>
      ),
    },
  ];

  const filteredTools =
    activeFilter === "all"
      ? tools
      : tools.filter((t) => {
          if (activeFilter === "technical") {
            return ["/tools/broken-links", "/tools/schema-validator", "/tools/serp-preview"].includes(t.href);
          }
          if (activeFilter === "speed") {
            return ["/tools/speed-lab", "/tools/tech-detector", "/tools/authority-checker"].includes(t.href);
          }
          return ["/tools/brand-radar", "/tools/content-gap", "/tools/batch-audit"].includes(t.href);
        });

  return (
    <div className="space-y-8">
      {/* Interactive Category Filter Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {[
          { id: "all", label: "All 9 Engines", count: 9 },
          { id: "technical", label: "Crawl, Schema & SERP", count: 3 },
          { id: "speed", label: "Core Web Vitals & Stack", count: 3 },
          { id: "ai", label: "AI Radar, Content Gap & Bulk", count: 3 },
        ].map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isActive
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:border-slate-300"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool, idx) => {
        const Icon = tool.icon;
        return (
          <Link
            key={idx}
            href={tool.href}
            className={`interactive-card p-6 bg-white border border-slate-200/90 rounded-2xl flex flex-col justify-between group cursor-pointer ${tool.accent} relative overflow-hidden`}
          >
            {/* Top Row: Icon & Badge */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-110 duration-200 ${tool.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {tool.badge}
                </span>
              </div>

              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                {tool.category}
              </div>

              <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                {tool.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {tool.desc}
              </p>
            </div>

            {/* Bottom Row: Live Micro-Preview & CTA */}
            <div className="space-y-3 pt-2">
              {tool.preview}

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-bold text-blue-600 group-hover:text-blue-700">
                <span>Launch SEO Engine</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        );
      })}
      </div>
    </div>
  );
}
