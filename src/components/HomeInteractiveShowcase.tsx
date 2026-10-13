"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  GitCompare,
  Radar,
  ListChecks,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Globe,
  Terminal,
  Code2,
  TrendingUp,
  Clock,
  Layers,
  Check,
  ExternalLink,
  Lock,
  ChevronRight,
  Activity,
  FileSpreadsheet
} from "lucide-react";

export default function HomeInteractiveShowcase() {
  const [activeTab, setActiveTab] = useState<"audit" | "compare" | "radar" | "batch" | "mcp">("audit");

  const options = [
    {
      id: "audit",
      title: "0–100 Technical Health",
      desc: "Deterministic DOM structure, security headers, metadata & Web Vitals scoring.",
      icon: ShieldCheck,
      badge: "Deterministic",
      accent: "text-emerald-600 bg-emerald-50 border-emerald-200",
      activeRing: "ring-2 ring-emerald-500/30 border-emerald-500",
      barColor: "bg-emerald-500",
    },
    {
      id: "compare",
      title: "Competitor & Content Gap",
      desc: "Cross-domain TF-IDF keyword overlap, missing terms & heading disparities.",
      icon: GitCompare,
      badge: "TF-IDF Matrix",
      accent: "text-purple-600 bg-purple-50 border-purple-200",
      activeRing: "ring-2 ring-purple-500/30 border-purple-500",
      barColor: "bg-purple-500",
    },
    {
      id: "radar",
      title: "Brand Radar AI (AEO)",
      desc: "Measure generative citations in ChatGPT, Gemini, Claude & Perplexity.",
      icon: Radar,
      badge: "LLM Visibility",
      accent: "text-blue-600 bg-blue-50 border-blue-200",
      activeRing: "ring-2 ring-blue-500/30 border-blue-500",
      barColor: "bg-blue-500",
    },
    {
      id: "batch",
      title: "Multi-URL Batch Auditor",
      desc: "Concurrently audit up to 15 URLs in parallel with 1-click CSV export.",
      icon: ListChecks,
      badge: "Up to 15 URLs",
      accent: "text-indigo-600 bg-indigo-50 border-indigo-200",
      activeRing: "ring-2 ring-indigo-500/30 border-indigo-500",
      barColor: "bg-indigo-500",
    },
    {
      id: "mcp",
      title: "Native SEO MCP Server",
      desc: "Connect audits to Claude Desktop, Cursor IDE & autonomous dev loops.",
      icon: Terminal,
      badge: "Claude & Cursor",
      accent: "text-amber-600 bg-amber-50 border-amber-200",
      activeRing: "ring-2 ring-amber-500/30 border-amber-500",
      barColor: "bg-amber-500",
    },
  ] as const;

  return (
    <div className="w-full relative">
      {/* Decorative ambient lighting aura */}
      <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/15 via-indigo-500/10 to-purple-600/15 rounded-3xl blur-2xl -z-10 opacity-70 pointer-events-none" />

      {/* 2-Column Left Sidebar + Right Console Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        
        {/* Left Column (5 Cols): Vertical Stack of 5 Interactive Option Cards */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
            Core Engine Capabilities
          </div>

          {options.map((opt) => {
            const Icon = opt.icon;
            const isActive = activeTab === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setActiveTab(opt.id)}
                className={`w-full text-left p-4 sm:p-4.5 rounded-2xl transition-all cursor-pointer relative overflow-hidden border ${
                  isActive
                    ? `bg-white shadow-lg ${opt.activeRing} scale-[1.01]`
                    : "bg-white/80 hover:bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs hover:translate-x-1"
                }`}
              >
                {/* Active Left Indicator Bar */}
                {isActive && (
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${opt.barColor}`} />
                )}

                <div className="flex items-start gap-3.5">
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-transform ${
                      isActive ? "scale-105 shadow-xs" : ""
                    } ${opt.accent}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4
                        className={`text-sm font-black leading-tight ${
                          isActive ? "text-slate-900" : "text-slate-800"
                        }`}
                      >
                        {opt.title}
                      </h4>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md shrink-0 whitespace-nowrap ${
                          isActive
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {opt.badge}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {opt.desc}
                    </p>
                  </div>

                  {/* Right Arrow Indicator */}
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 mt-2.5 transition-transform ${
                      isActive
                        ? "text-blue-600 translate-x-0.5 font-bold"
                        : "text-slate-300"
                    }`}
                  />
                </div>
              </button>
            );
          })}

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/70 text-xs text-blue-900 mt-4 flex items-center justify-between">
            <span className="font-semibold">All 5 engines include zero hallucinations</span>
            <Link
              href="/tools"
              className="text-blue-700 font-bold hover:underline inline-flex items-center gap-1 shrink-0"
            >
              <span>Explore SEO Suite</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column (7 Cols): Main Studio Console Window Preview */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="bg-slate-950 text-white rounded-3xl border-2 border-slate-800 shadow-2xl overflow-hidden text-left transition-all">
            {/* Studio Window Chrome Header */}
            <div className="px-5 sm:px-6 py-3.5 bg-slate-900 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 pr-3 border-r border-slate-800">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <span className="text-blue-400 font-bold">SeoSeite Studio Engine v2.4</span>
                  <span className="text-slate-600 hidden sm:inline">•</span>
                  <span className="text-slate-400 hidden sm:inline">Live Diagnostic Workbench</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-bold">14 Engines Active</span>
              </div>
            </div>

            {/* Studio Window Body */}
            <div className="p-6 sm:p-7 min-h-[480px] flex flex-col justify-between">
              {/* Tab 1: Technical SEO Health */}
              {activeTab === "audit" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Header Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                          <Lock className="w-3 h-3 text-emerald-400" />
                          https://linear.app
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          200 OK • 68ms Latency
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-white">
                        Deterministic Site Health Audit
                      </h3>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-3xl font-black text-emerald-400 leading-none">
                          92<span className="text-base text-slate-500">/100</span>
                        </div>
                        <div className="text-xs text-slate-400 font-semibold mt-1">
                          Grade A+ • Passing 21/22 Checks
                        </div>
                      </div>
                      <Link
                        href="/analyze?url=https://linear.app"
                        className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors shadow-md inline-flex items-center gap-1.5 shrink-0"
                      >
                        <span>Inspect Live Audit</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* 4 Category Score Gauges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
                      <div className="text-[11px] font-bold text-slate-400 mb-0.5">Metadata &amp; Title</div>
                      <div className="text-xl font-black text-emerald-400">25 / 25</div>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">Title (52 chars), OG set</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
                      <div className="text-[11px] font-bold text-slate-400 mb-0.5">DOM &amp; Hierarchy</div>
                      <div className="text-xl font-black text-emerald-400">24 / 25</div>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">Single H1, 14 H2s, clean</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500" />
                      <div className="text-[11px] font-bold text-slate-400 mb-0.5">Indexability</div>
                      <div className="text-xl font-black text-emerald-400">23 / 25</div>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">Robots OK, canonical</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
                      <div className="text-[11px] font-bold text-slate-400 mb-0.5">Security Headers</div>
                      <div className="text-xl font-black text-emerald-400">20 / 25</div>
                      <div className="text-[10px] text-slate-400 mt-1 font-mono">HSTS enabled, CSP, SSL</div>
                    </div>
                  </div>

                  {/* High-Contrast Live Findings Feed */}
                  <div className="space-y-2.5 text-xs">
                    <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-between text-emerald-100 font-medium">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Canonical link strictly matches requested domain without redirect loops</span>
                      </div>
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                        PASSED (68ms)
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-between text-emerald-100 font-medium">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>JSON-LD Structured Data Schema validated (WebApplication, SoftwareApplication)</span>
                      </div>
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                        PASSED
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-950/70 border border-amber-500/40 flex items-center justify-between text-amber-100 font-medium">
                      <div className="flex items-center gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Add Content-Security-Policy (CSP) header with nonces for strict inline script defense</span>
                      </div>
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                        OPPORTUNITY
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Competitor & Content Gap */}
              {activeTab === "compare" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                    <div>
                      <div className="text-xs font-mono text-purple-400 font-bold mb-1">
                        Comparison: vercel.com vs netlify.com
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-white">
                        Semantic Topic &amp; Keyword Gap Matrix
                      </h3>
                    </div>
                    <Link
                      href="/tools/content-gap"
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-colors shadow-md inline-flex items-center gap-1.5 shrink-0"
                    >
                      <span>Open Content Gap Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500" />
                      <div className="text-2xl font-black text-rose-400">18 Terms</div>
                      <div className="text-xs text-slate-300 font-bold mt-1">Missing on Target Page</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">High-intent competitor keywords</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
                      <div className="text-2xl font-black text-blue-400">34 Terms</div>
                      <div className="text-xs text-slate-300 font-bold mt-1">Shared Industry Topics</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Edge middleware, Next.js, CI/CD</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
                      <div className="text-2xl font-black text-emerald-400">72% Score</div>
                      <div className="text-xs text-slate-300 font-bold mt-1">Topic Coverage Density</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Semantic relevance index</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono space-y-2">
                    <div className="text-slate-400 font-bold mb-2">Detected Competitor Heading Gaps (Uncovered H2s):</div>
                    <div className="text-slate-300 flex items-center gap-2">
                      <span className="text-rose-400 font-bold">+</span> &quot;Serverless GPU functions for AI inference&quot;
                    </div>
                    <div className="text-slate-300 flex items-center gap-2">
                      <span className="text-rose-400 font-bold">+</span> &quot;Instant rollback preview deployments with zero downtime&quot;
                    </div>
                    <div className="text-slate-300 flex items-center gap-2">
                      <span className="text-rose-400 font-bold">+</span> &quot;Automatic SSL certificate renewals across wildcards&quot;
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Brand Radar AI */}
              {activeTab === "radar" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                    <div>
                      <div className="text-xs font-mono text-blue-400 font-bold mb-1">
                        Target Brand: Stripe (stripe.com)
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-white">
                        Brand Radar AI — Prompt Visibility
                      </h3>
                    </div>
                    <Link
                      href="/tools/brand-radar"
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors shadow-md inline-flex items-center gap-1.5 shrink-0"
                    >
                      <span>Launch Brand Radar Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
                      <div className="text-3xl font-black text-blue-400">100%</div>
                      <div className="text-xs text-slate-200 font-bold mt-1">AI Share of Voice</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Cited in 3/3 target buyer prompts</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500" />
                      <div className="text-3xl font-black text-purple-400">#1 Top</div>
                      <div className="text-xs text-slate-200 font-bold mt-1">Dominant Rank</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Leading recommendation in Gemini</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
                      <div className="text-3xl font-black text-emerald-400">4 Engines</div>
                      <div className="text-xs text-slate-200 font-bold mt-1">Multi-LLM Tested</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">ChatGPT, Claude, Gemini, Perplexity</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono space-y-2">
                    <div className="text-slate-400">Prompt: &quot;What are the best payment processors for SaaS startups in 2026?&quot;</div>
                    <div className="text-emerald-400 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                      ✓ Cited in Gemini 2.5 Flash: &quot;Stripe is the industry benchmark for developer-first subscription billing, supporting 135+ currencies with robust fraud prevention...&quot;
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Multi-URL Batch Auditor */}
              {activeTab === "batch" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                    <div>
                      <div className="text-xs font-mono text-indigo-400 font-bold mb-1">
                        Batch Queue • Up to 15 Concurrent Domains
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-white">
                        Multi-URL Batch SEO Auditor
                      </h3>
                    </div>
                    <Link
                      href="/tools/batch-audit"
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-colors shadow-md inline-flex items-center gap-1.5 shrink-0"
                    >
                      <span>Run Multi-URL Batch</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* High-Fidelity Table Preview */}
                  <div className="overflow-x-auto rounded-2xl border border-slate-800">
                    <table className="w-full text-left font-mono text-xs">
                      <thead>
                        <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                          <th className="py-2.5 px-3.5 font-bold">Domain</th>
                          <th className="py-2.5 px-3.5 font-bold">Health Score</th>
                          <th className="py-2.5 px-3.5 font-bold">Latency</th>
                          <th className="py-2.5 px-3.5 font-bold">Open PageRank</th>
                          <th className="py-2.5 px-3.5 font-bold">Stack Fingerprint</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 bg-slate-950 text-slate-300">
                        <tr>
                          <td className="py-2.5 px-3.5 font-bold text-white">stripe.com</td>
                          <td className="py-2.5 px-3.5">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                              98 (A+)
                            </span>
                          </td>
                          <td className="py-2.5 px-3.5 text-slate-300 font-semibold">64 ms</td>
                          <td className="py-2.5 px-3.5 text-cyan-400 font-bold">9.6 / 10</td>
                          <td className="py-2.5 px-3.5 text-slate-400">React, CloudFront</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3.5 font-bold text-white">linear.app</td>
                          <td className="py-2.5 px-3.5">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                              96 (A)
                            </span>
                          </td>
                          <td className="py-2.5 px-3.5 text-slate-300 font-semibold">68 ms</td>
                          <td className="py-2.5 px-3.5 text-cyan-400 font-bold">8.4 / 10</td>
                          <td className="py-2.5 px-3.5 text-slate-400">Next.js, Tailwind</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3.5 font-bold text-white">github.com</td>
                          <td className="py-2.5 px-3.5">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                              94 (A)
                            </span>
                          </td>
                          <td className="py-2.5 px-3.5 text-slate-300 font-semibold">82 ms</td>
                          <td className="py-2.5 px-3.5 text-cyan-400 font-bold">9.8 / 10</td>
                          <td className="py-2.5 px-3.5 text-slate-400">Rails, React</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <span>Concurrent safe scraping with SSRF prevention &amp; timeout safety</span>
                    <span className="text-indigo-400 font-bold flex items-center gap-1">
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      1-Click CSV Export Ready
                    </span>
                  </div>
                </div>
              )}

              {/* Tab 5: Native MCP Server */}
              {activeTab === "mcp" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                    <div>
                      <div className="text-xs font-mono text-emerald-400 font-bold mb-1">
                        Model Context Protocol (JSON-RPC 2.0)
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-white">
                        Native SeoSeite SEO MCP Server
                      </h3>
                    </div>
                    <Link
                      href="/mcp"
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors shadow-md inline-flex items-center gap-1.5 shrink-0"
                    >
                      <span>Open MCP Playground</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Connect SeoSeite directly to <strong>Claude Desktop</strong>, <strong>Cursor IDE</strong>, or autonomous agent workflows. Ask Claude: <code className="bg-slate-900 border border-slate-800 text-emerald-300 px-1.5 py-0.5 rounded">&quot;Audit https://stripe.com and find slow Web Vitals&quot;</code> and receive structured, deterministic JSON.
                  </p>

                  <pre className="p-4 rounded-2xl bg-slate-900 text-slate-300 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
{`# 1. Add to Claude Desktop or Cursor IDE (~/.cursor/mcp.json)
{
  "mcpServers": {
    "seoseite": {
      "command": "node",
      "args": ["scripts/seoseite-mcp.mjs"],
      "env": { "SEOSEITE_API_URL": "http://localhost:3000" }
    }
  }
}`}
                  </pre>

                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <span className="text-emerald-400 font-bold">Supported MCP Tools:</span>
                    <code className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-200 font-mono">seoseite_audit_url</code>
                    <code className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-200 font-mono">seoseite_compare_domains</code>
                    <code className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-200 font-mono">seoseite_check_broken_links</code>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
