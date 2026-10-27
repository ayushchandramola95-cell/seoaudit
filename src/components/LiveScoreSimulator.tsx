"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  Circle,
  TrendingUp,
  Zap,
  ShieldCheck,
  Code2,
  Link2,
  Search,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

interface FixToggle {
  id: string;
  title: string;
  category: string;
  points: number;
  aiBoost: number;
  trafficLift: number;
  codePreview: string;
  icon: React.ComponentType<{ className?: string }>;
}

const FIXES: FixToggle[] = [
  {
    id: "lcp",
    title: "Optimize Hero LCP Image & Preload Critical Fonts",
    category: "Core Web Vitals",
    points: 11,
    aiBoost: 8,
    trafficLift: 14,
    codePreview: `<link rel="preload" as="image" href="/hero.webp" fetchpriority="high" />`,
    icon: Zap,
  },
  {
    id: "schema",
    title: "Inject Validated Organization & FAQPage JSON-LD Schema",
    category: "AI & Rich Snippets",
    points: 9,
    aiBoost: 24,
    trafficLift: 18,
    codePreview: `{ "@context": "https://schema.org", "@type": "SoftwareApplication", "name": "SEO Audit" }`,
    icon: Code2,
  },
  {
    id: "deadlinks",
    title: "Resolve 4 Broken 404 Internal Anchor Links & Redirect Chains",
    category: "Crawlability",
    points: 8,
    aiBoost: 10,
    trafficLift: 11,
    codePreview: `HTTP/1.1 301 Moved Permanently -> /tools/broken-links (0 dead links)`,
    icon: Link2,
  },
  {
    id: "headers",
    title: "Enforce Strict-Transport-Security (HSTS) & CSP Headers",
    category: "Security & Trust",
    points: 6,
    aiBoost: 6,
    trafficLift: 5,
    codePreview: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`,
    icon: ShieldCheck,
  },
  {
    id: "semantics",
    title: "Align H1/H2 Semantic Entities with Competitor Content Gaps",
    category: "On-Page Content",
    points: 5,
    aiBoost: 16,
    trafficLift: 19,
    codePreview: `<h1>Deterministic Technical SEO & AI Search Visibility Platform</h1>`,
    icon: Search,
  },
];

export default function LiveScoreSimulator() {
  const [enabledIds, setEnabledIds] = useState<string[]>(["lcp", "schema"]);

  const toggleFix = (id: string) => {
    setEnabledIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const applyAll = () => setEnabledIds(FIXES.map((f) => f.id));
  const resetAll = () => setEnabledIds([]);

  const baseScore = 59;
  const baseAiVisibility = 32;

  const { score, grade, aiVisibility, trafficLift, lastActiveCode } = useMemo(() => {
    const active = FIXES.filter((f) => enabledIds.includes(f.id));
    const addedPoints = active.reduce((sum, f) => sum + f.points, 0);
    const totalScore = Math.min(100, baseScore + addedPoints);
    const totalAi = Math.min(96, baseAiVisibility + active.reduce((s, f) => s + f.aiBoost, 0));
    const totalLift = active.reduce((s, f) => s + f.trafficLift, 0);

    const computedGrade =
      totalScore >= 95 ? "A+" : totalScore >= 88 ? "A" : totalScore >= 78 ? "B+" : totalScore >= 68 ? "B" : "C";

    const code =
      active.length > 0
        ? active[active.length - 1].codePreview
        : "/* Toggle any remediation item on the left to preview the developer fix */";

    return { score: totalScore, grade: computedGrade, aiVisibility: totalAi, trafficLift: totalLift, lastActiveCode: code };
  }, [enabledIds]);

  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference * (1 - score / 100);

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Score &amp; Growth Simulator</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              See How Technical Fixes Compound Your SEO Score
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
              Toggle real-world engineering remediations below to see how deterministic health points, AI citation visibility, and organic traffic uplift scale together.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={applyAll}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Apply All 5 Fixes (+39 pts)
            </button>
            <button
              type="button"
              onClick={resetAll}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Baseline
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 space-y-3">
            {FIXES.map((fix) => {
              const isChecked = enabledIds.includes(fix.id);
              const Icon = fix.icon;
              return (
                <button
                  key={fix.id}
                  type="button"
                  onClick={() => toggleFix(fix.id)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isChecked
                      ? "bg-blue-50/40 border-blue-600 shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isChecked ? "text-blue-600" : "text-slate-300"}`}>
                      {isChecked ? <CheckCircle2 className="w-6 h-6 fill-blue-600 text-white" /> : <Circle className="w-6 h-6" />}
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        {fix.category}
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {fix.title}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-extrabold border shrink-0 ${
                      isChecked
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}
                  >
                    +{fix.points} pts
                  </span>
                </button>
              );
            })}
          </div>
          <div className="lg:col-span-5 bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block">
                    Real-Time Score Projection
                  </span>
                  <h3 className="text-lg font-bold text-white">Simulated Audit Telemetry</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                  {enabledIds.length} / {FIXES.length} Fixes Active
                </span>
              </div>

              <div className="flex items-center gap-6 mb-6">
                <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
                  <svg className="w-32 h-32 -rotate-90 transform" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" stroke="#1e293b" strokeWidth="10" fill="transparent" />
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      stroke={score >= 88 ? "#10b981" : score >= 70 ? "#38bdf8" : "#f59e0b"}
                      strokeWidth="10"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-500 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white font-mono leading-none">{score}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase mt-1">/ 100</span>
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Health Grade</span>
                    <span className="text-sm font-black text-emerald-400 font-mono">Grade {grade}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">AI Citation Share</span>
                    <span className="text-sm font-black text-blue-400 font-mono">{aiVisibility}% SoV</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Est. Organic Lift</span>
                    <span className="text-sm font-black text-amber-400 font-mono flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> +{trafficLift}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                  <span>Generated Remediation Snippet:</span>
                  <span className="text-[10px] text-emerald-400">Auto-Formatted</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-300 whitespace-pre-wrap break-words leading-relaxed">
                  {lastActiveCode}
                </div>
              </div>
            </div>

            <Link
              href="/analyze"
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Run Live Audit on Your Own Domain</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
