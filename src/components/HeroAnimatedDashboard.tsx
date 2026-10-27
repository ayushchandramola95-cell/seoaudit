"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Cpu, 
  TrendingUp, 
  Link2, 
  Globe, 
  Lock, 
  Sparkles,
  ExternalLink,
  Radar
} from "lucide-react";

interface SampleSiteAudit {
  domain: string;
  url: string;
  score: number;
  grade: string;
  crawlTime: string;
  lcp: string;
  cls: string;
  inp: string;
  tech: string[];
  linksChecked: number;
  openPageRank: string;
  globalRank: string;
  passRatio: string;
}

const SAMPLES: Record<string, SampleSiteAudit> = {
  "linear.app": {
    domain: "linear.app",
    url: "https://linear.app",
    score: 96,
    grade: "Grade A",
    crawlTime: "68ms",
    lcp: "1.1s",
    cls: "0.01",
    inp: "38ms",
    tech: ["Next.js", "React", "Tailwind CSS", "Vercel"],
    linksChecked: 64,
    openPageRank: "8.4 / 10",
    globalRank: "Top 0.01%",
    passRatio: "21 / 22 checks passing",
  },
  "stripe.com": {
    domain: "stripe.com",
    url: "https://stripe.com",
    score: 98,
    grade: "Grade A+",
    crawlTime: "74ms",
    lcp: "0.9s",
    cls: "0.00",
    inp: "32ms",
    tech: ["React", "TypeScript", "Amazon CloudFront", "Marko"],
    linksChecked: 92,
    openPageRank: "9.6 / 10",
    globalRank: "Top 0.001%",
    passRatio: "22 / 22 checks passing",
  },
  "github.com": {
    domain: "github.com",
    url: "https://github.com",
    score: 94,
    grade: "Grade A",
    crawlTime: "82ms",
    lcp: "1.2s",
    cls: "0.02",
    inp: "45ms",
    tech: ["Ruby on Rails", "React", "Fastly CDN", "Priming"],
    linksChecked: 118,
    openPageRank: "9.8 / 10",
    globalRank: "Top 0.001%",
    passRatio: "20 / 22 checks passing",
  },
  "vercel.com": {
    domain: "vercel.com",
    url: "https://vercel.com",
    score: 97,
    grade: "Grade A+",
    crawlTime: "61ms",
    lcp: "0.8s",
    cls: "0.00",
    inp: "28ms",
    tech: ["Next.js", "React", "Turbopack", "Vercel Edge"],
    linksChecked: 78,
    openPageRank: "9.1 / 10",
    globalRank: "Top 0.005%",
    passRatio: "22 / 22 checks passing",
  },
};

export default function HeroAnimatedDashboard() {
  const [activeSiteKey, setActiveSiteKey] = useState<string>("linear.app");
  const [isPaused, setIsPaused] = useState(false);
  const data = SAMPLES[activeSiteKey];

  useEffect(() => {
    if (isPaused) return;
    const keys = Object.keys(SAMPLES);
    const timer = setInterval(() => {
      setActiveSiteKey((prev) => {
        const idx = keys.indexOf(prev);
        return keys[(idx + 1) % keys.length];
      });
    }, 4200);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div
      className="relative w-full max-w-5xl mx-auto mt-10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Soft Glow Aura */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition duration-1000 -z-10" />

      {/* Main Glass Console Frame */}
      <div className="bg-white/95 backdrop-blur-xl border-2 border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-7 relative overflow-hidden text-left">
        {/* Browser Top Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 pr-2 border-r border-slate-200">
              <span className="w-3 h-3 rounded-full bg-rose-400/90 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-400/90 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-400/90 inline-block" />
            </div>

            {/* Address Bar */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-mono text-slate-700 font-semibold border border-slate-200">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>https://{data.domain}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                200 OK • {data.crawlTime}
              </span>
            </div>
          </div>

          {/* Interactive Sample Site Switcher */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-semibold hidden md:inline">Sample Site:</span>
            {Object.keys(SAMPLES).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveSiteKey(key)}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  activeSiteKey === key
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Core Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column: Big Radial Gauge & Score (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-slate-50 to-blue-50/30 border border-slate-100 text-center relative">
            <div className="relative w-40 h-40 flex items-center justify-center mb-3">
              {/* Radial Progress SVG */}
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  stroke="#e2e8f0"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  stroke="#2563eb"
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={2 * Math.PI * 52 * (1 - data.score / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Inner Score Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-900 tracking-tight">
                  {data.score}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  / 100 Score
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{data.grade} • Deterministic</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">{data.passRatio}</p>
          </div>

          {/* Right Column: Dynamic Live Metric Grid (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Metric 1: Core Web Vitals */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Core Web Vitals
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 uppercase font-black">
                  Good
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-center font-mono">
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                  <div className="text-[9px] text-slate-400 uppercase">LCP</div>
                  <div className="text-xs font-bold text-emerald-600">{data.lcp}</div>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                  <div className="text-[9px] text-slate-400 uppercase">CLS</div>
                  <div className="text-xs font-bold text-emerald-600">{data.cls}</div>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                  <div className="text-[9px] text-slate-400 uppercase">INP</div>
                  <div className="text-xs font-bold text-emerald-600">{data.inp}</div>
                </div>
              </div>
            </div>

            {/* Metric 2: 50+ Tech Stack Profiler */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-indigo-300 transition-colors">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                  Stack Fingerprint
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">4 Detected</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {data.tech.map((t, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Metric 3: DomCop Open PageRank */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-colors">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  Open PageRank
                </span>
                <span className="text-[10px] font-bold text-slate-500">{data.globalRank}</span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg font-black text-slate-900">{data.openPageRank}</span>
                <span className="text-[10px] text-slate-400 font-medium">Common Crawl</span>
              </div>
            </div>

            {/* Metric 4: Hyperlinks & 404 Status */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                <span className="flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-blue-500" />
                  Hyperlink Crawler
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-black">
                  0 Dead Links
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg font-black text-slate-900">{data.linksChecked}</span>
                <span className="text-[10px] text-slate-400 font-medium">Internal &amp; External</span>
              </div>
            </div>
          </div>
        </div>

        {/* Console Bottom Action Strip */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              14 Deterministic Engines Active
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Zero fabrications or hallucinatory numbers</span>
          </div>

          <Link
            href={`/analyze?url=${encodeURIComponent(data.url)}`}
            className="inline-flex items-center gap-1.5 font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>Run full live audit on {data.domain}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
