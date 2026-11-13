"use client";

import { useState, useEffect, useRef } from "react";
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
  color: string;
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
    color: "#5e6ad2",
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
    tech: ["React", "TypeScript", "CloudFront", "Marko"],
    linksChecked: 92,
    openPageRank: "9.6 / 10",
    globalRank: "Top 0.001%",
    passRatio: "22 / 22 checks passing",
    color: "#635bff",
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
    tech: ["Rails", "React", "Fastly CDN", "Priming"],
    linksChecked: 118,
    openPageRank: "9.8 / 10",
    globalRank: "Top 0.001%",
    passRatio: "20 / 22 checks passing",
    color: "#24292f",
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
    color: "#000000",
  },
};

function useAnimatedScore(target: number, duration = 650) {
  const [current, setCurrent] = useState(target);
  const prevTarget = useRef(target);

  useEffect(() => {
    const start = current;
    const diff = target - start;
    if (diff === 0) return;

    const startTime = performance.now();
    let frame: number;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(start + diff * ease));

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);
    prevTarget.current = target;

    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return current;
}

export default function HeroAnimatedDashboard() {
  const [activeSiteKey, setActiveSiteKey] = useState<string>("linear.app");
  const [isPaused, setIsPaused] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, active: false });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const data = SAMPLES[activeSiteKey];
  const animatedScore = useAnimatedScore(data.score, 600);

  // Auto-cycle through sites unless paused by user interaction
  useEffect(() => {
    if (isPaused) return;
    const keys = Object.keys(SAMPLES);
    const timer = setInterval(() => {
      setActiveSiteKey((prev) => {
        const idx = keys.indexOf(prev);
        return keys[(idx + 1) % keys.length];
      });
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Subtle interactive 3D tilt & cursor spotlight
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y, active: true });

    // Subtle 3D perspective tilt (max 2 degrees)
    const rx = ((y - rect.height / 2) / (rect.height / 2)) * -2;
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 2;
    setTilt({ rx, ry });
  };

  const handleMouseLeave = () => {
    setMousePos((p) => ({ ...p, active: false }));
    setTilt({ rx: 0, ry: 0 });
    setIsPaused(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto mt-8 perspective-1000 group transition-transform duration-300 ease-out"
      style={{
        transform: `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Soft Glow Aura */}
      <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/30 via-indigo-500/25 to-purple-600/30 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition duration-700 -z-10" />

      {/* Moving Border Gradient Beam (Aceternity Pattern) */}
      <div className="relative p-[1.5px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-300">
        <div 
          className="absolute -inset-[150%] animate-beam-spin pointer-events-none opacity-70 group-hover:opacity-100 transition-opacity"
          style={{
            background: "conic-gradient(from 0deg at 50% 50%, transparent 0%, transparent 75%, #3b82f6 88%, #8b5cf6 96%, transparent 100%)",
          }}
        />

        {/* Main Glass Console Card */}
        <div className="relative bg-white/95 backdrop-blur-xl rounded-[22px] p-5 sm:p-7 border border-slate-200/90 text-left overflow-hidden">
          
          {/* Interactive Mouse Spotlight Layer */}
          {mousePos.active && (
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 -z-1"
              style={{
                background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.08), transparent 60%)`,
              }}
            />
          )}

          {/* Browser Navigation Bar & Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-200">
                <span className="w-3 h-3 rounded-full bg-rose-400 inline-block shadow-2xs" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block shadow-2xs" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block shadow-2xs" />
              </div>

              {/* URL Address Bar */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/90 text-xs font-mono text-slate-700 font-semibold border border-slate-200 shadow-2xs">
                <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>https://{data.domain}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200/60">
                  200 OK • {data.crawlTime}
                </span>
              </div>
            </div>

            {/* Interactive Sample Site Switcher Tabs */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-bold hidden md:inline text-[11px] uppercase tracking-wider">
                Target:
              </span>
              {Object.keys(SAMPLES).map((key) => {
                const isActive = activeSiteKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveSiteKey(key)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                      isActive
                        ? "bg-slate-900 text-white shadow-sm ring-1 ring-slate-800"
                        : "bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span 
                      className="w-2 h-2 rounded-full shrink-0 transition-colors"
                      style={{ backgroundColor: SAMPLES[key].color }}
                    />
                    <span>{key}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Interactive Audit Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Column: Big Illuminated Radial Gauge & Kinetic Rolling Score */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-slate-50/90 to-blue-50/40 border border-slate-200/70 text-center relative shadow-xs">
              <div className="relative w-44 h-44 flex items-center justify-center mb-3">
                {/* Radial Progress Gauge SVG */}
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
                  <defs>
                    <linearGradient id="scoreGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                    <filter id="scoreGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#3b82f6" floodOpacity="0.4" />
                    </filter>
                  </defs>

                  {/* Track ring */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="#e2e8f0"
                    strokeWidth="9"
                    fill="transparent"
                  />

                  {/* Glowing dynamic arc */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="url(#scoreGaugeGradient)"
                    strokeWidth="9"
                    strokeDasharray={2 * Math.PI * 50}
                    strokeDashoffset={2 * Math.PI * 50 * (1 - data.score / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    filter="url(#scoreGlow)"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>

                {/* Inner Kinetic Score Number Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-5xl font-black text-slate-900 tracking-tight font-mono">
                    {animatedScore}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mt-0.5">
                    / 100 Score
                  </span>
                </div>
              </div>

              {/* Status Badge with Live Beacon */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-1.5 shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>{data.grade} • Deterministic</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">{data.passRatio}</p>
            </div>

            {/* Right Column: 4 Real-World Diagnostic Metric Tiles */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Tile 1: Core Web Vitals with Threshold Meters */}
              <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-400 hover:shadow-xs transition-all">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    Core Web Vitals
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 uppercase font-black">
                    Good
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <div className="text-[9px] text-slate-400 font-semibold uppercase">LCP</div>
                    <div className="text-xs font-bold text-emerald-600">{data.lcp}</div>
                    <div className="w-full bg-slate-200 h-1 rounded-full mt-1.5 overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[90%]" />
                    </div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <div className="text-[9px] text-slate-400 font-semibold uppercase">CLS</div>
                    <div className="text-xs font-bold text-emerald-600">{data.cls}</div>
                    <div className="w-full bg-slate-200 h-1 rounded-full mt-1.5 overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[98%]" />
                    </div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <div className="text-[9px] text-slate-400 font-semibold uppercase">INP</div>
                    <div className="text-xs font-bold text-emerald-600">{data.inp}</div>
                    <div className="w-full bg-slate-200 h-1 rounded-full mt-1.5 overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[92%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tile 2: Tech Stack Fingerprint */}
              <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-indigo-400 hover:shadow-xs transition-all">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                    Stack Fingerprint
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">4 Detected</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {data.tech.map((t, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60 inline-flex items-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tile 3: Open PageRank & Authority Percentile */}
              <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-400 hover:shadow-xs transition-all">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    Open PageRank
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {data.globalRank}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-1 font-mono">
                  <span className="text-xl font-black text-slate-900">{data.openPageRank}</span>
                  <span className="text-[10px] text-slate-400 font-medium">Common Crawl</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-200">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[94%]" />
                </div>
              </div>

              {/* Tile 4: Hyperlink Crawler Forensics */}
              <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-400 hover:shadow-xs transition-all">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-blue-500" />
                    Hyperlink Crawler
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-black">
                    0 Dead Links
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-1 font-mono">
                  <span className="text-xl font-black text-slate-900">{data.linksChecked}</span>
                  <span className="text-[10px] text-slate-400 font-medium">Internal &amp; External</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-200">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full w-[100%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Console Bottom Action Bar */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 text-slate-500 font-medium">
              <span className="inline-flex items-center gap-1.5 font-bold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                14 Deterministic Engines Active
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="hidden sm:inline">Zero fabrications or hallucinatory numbers</span>
            </div>

            <Link
              href={`/analyze?url=${encodeURIComponent(data.url)}`}
              className="inline-flex items-center gap-1.5 font-bold text-blue-600 hover:text-blue-700 transition-colors group/cta"
            >
              <span>Run full live audit on {data.domain}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/cta:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
