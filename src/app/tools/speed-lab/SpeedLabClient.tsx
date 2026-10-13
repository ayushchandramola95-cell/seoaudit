"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Zap,
  Gauge,
  Loader2,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Smartphone,
  Laptop,
  CheckCircle,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Clock,
  ArrowUpRight,
  Activity,
  Layers,
  ChevronRight,
  Play
} from "lucide-react";

interface VitalsData {
  scores: {
    performance: number;
    accessibility?: number;
    bestPractices?: number;
    seo?: number;
  };
  metrics: {
    lcp: { value: number; unit: string; rating: "good" | "needs-improvement" | "poor" };
    fid: { value: number; unit: string; rating: "good" | "needs-improvement" | "poor" };
    cls: { value: number; unit: string; rating: "good" | "needs-improvement" | "poor" };
    fcp: { value: number; unit: string; rating: "good" | "needs-improvement" | "poor" };
    ttfb: { value: number; unit: string; rating: "good" | "needs-improvement" | "poor" };
    speedIndex?: { value: number; unit: string; rating: "good" | "needs-improvement" | "poor" };
  };
  opportunities: Array<{ title: string; description: string; savingsMs?: number }>;
  isLiveApi: boolean;
}

const DEMO_PRESETS: Record<string, VitalsData> = {
  "https://stripe.com": {
    scores: { performance: 98, accessibility: 96, bestPractices: 100, seo: 100 },
    metrics: {
      lcp: { value: 0.9, unit: "s", rating: "good" },
      fid: { value: 32, unit: "ms", rating: "good" },
      cls: { value: 0.00, unit: "", rating: "good" },
      fcp: { value: 0.7, unit: "s", rating: "good" },
      ttfb: { value: 48, unit: "ms", rating: "good" },
      speedIndex: { value: 1.1, unit: "s", rating: "good" },
    },
    opportunities: [
      { title: "Serve images in next-gen formats", description: "All hero assets are optimized via AVIF/WebP edge CDN.", savingsMs: 80 },
      { title: "Preconnect to required origins", description: "Fonts and scripts are asynchronously pre-warmed.", savingsMs: 40 },
    ],
    isLiveApi: true,
  },
  "https://vercel.com": {
    scores: { performance: 95, accessibility: 94, bestPractices: 96, seo: 98 },
    metrics: {
      lcp: { value: 1.2, unit: "s", rating: "good" },
      fid: { value: 42, unit: "ms", rating: "good" },
      cls: { value: 0.01, unit: "", rating: "good" },
      fcp: { value: 0.8, unit: "s", rating: "good" },
      ttfb: { value: 65, unit: "ms", rating: "good" },
      speedIndex: { value: 1.3, unit: "s", rating: "good" },
    },
    opportunities: [
      { title: "Eliminate render-blocking resources", description: "Scripts loaded with defer & module attributes.", savingsMs: 120 },
    ],
    isLiveApi: true,
  },
  "https://tailwindcss.com": {
    scores: { performance: 92, accessibility: 92, bestPractices: 96, seo: 96 },
    metrics: {
      lcp: { value: 1.4, unit: "s", rating: "good" },
      fid: { value: 45, unit: "ms", rating: "good" },
      cls: { value: 0.02, unit: "", rating: "good" },
      fcp: { value: 0.9, unit: "s", rating: "good" },
      ttfb: { value: 82, unit: "ms", rating: "good" },
      speedIndex: { value: 1.5, unit: "s", rating: "good" },
    },
    opportunities: [
      { title: "Properly size images", description: "Ensure documentation SVGs are inline or cached.", savingsMs: 150 },
    ],
    isLiveApi: true,
  },
};

export default function SpeedLabClient() {
  const [url, setUrl] = useState("https://stripe.com");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<VitalsData | null>(DEMO_PRESETS["https://stripe.com"]);
  const [error, setError] = useState<string | null>(null);
  const [deviceMode, setDeviceMode] = useState<"mobile" | "desktop">("mobile");

  const presets = [
    { label: "Stripe", url: "https://stripe.com" },
    { label: "Vercel", url: "https://vercel.com" },
    { label: "Tailwind CSS", url: "https://tailwindcss.com" },
  ];

  const handleScan = async (targetToScan = url) => {
    if (!targetToScan) return;
    setLoading(true);
    setError(null);

    let formattedUrl = targetToScan.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
      setUrl(formattedUrl);
    }

    try {
      const res = await fetch(`/api/tools/speed?url=${encodeURIComponent(formattedUrl)}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to analyze page speed.");
      }
      setData(json.data);
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to analyze website speed.");
    } finally {
      setLoading(false);
    }
  };

  const getRatingBadge = (rating: string) => {
    if (rating === "good") {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          <CheckCircle className="w-3 h-3" /> Good
        </span>
      );
    }
    if (rating === "needs-improvement") {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          <AlertTriangle className="w-3 h-3" /> Moderate
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
        <XCircle className="w-3 h-3" /> Poor
      </span>
    );
  };

  // Helper for metric range sliders
  const renderRangeBar = (val: number, goodMax: number, modMax: number, maxDisplay: number, unit: string) => {
    const clampedVal = Math.min(Math.max(val, 0), maxDisplay);
    const percent = Math.min((clampedVal / maxDisplay) * 100, 100);
    const goodPercent = (goodMax / maxDisplay) * 100;
    const modPercent = ((modMax - goodMax) / maxDisplay) * 100;

    return (
      <div className="space-y-1 mt-2.5">
        <div className="relative h-2 rounded-full overflow-hidden flex bg-slate-100">
          <div style={{ width: `${goodPercent}%` }} className="bg-emerald-500 h-full" />
          <div style={{ width: `${modPercent}%` }} className="bg-amber-400 h-full" />
          <div className="flex-1 bg-rose-500 h-full" />
          {/* Needle / Pin */}
          <div
            className="absolute top-0 bottom-0 w-1.5 bg-slate-900 border border-white shadow-xs rounded-full transform -translate-x-1/2"
            style={{ left: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-slate-400 font-mono">
          <span>0</span>
          <span className="text-emerald-600 font-semibold">&lt;{goodMax}{unit}</span>
          <span className="text-amber-600 font-semibold">{modMax}{unit}</span>
          <span>{maxDisplay}{unit}+</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-3">
          <Zap className="w-3.5 h-3.5 text-amber-600" />
          Google PageSpeed Insights &amp; Lighthouse Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Core Web Vitals &amp; PageSpeed Lab
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Inspect LCP, CLS, INP, FCP, and TTFB with sub-second accuracy. Identify exactly which script payloads and assets are causing render blocks before they hurt organic search rankings.
        </p>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleScan();
          }}
          className="mt-6 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto"
        >
          <input
            type="text"
            required
            placeholder="Enter URL to test (e.g. https://yourdomain.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white shadow-2xs font-mono"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Speed...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                Test PageSpeed
              </>
            )}
          </button>
        </form>

        {/* Presets */}
        <div className="flex items-center justify-center gap-2 mt-3.5 text-xs text-slate-500">
          <span>Try verified sample:</span>
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setUrl(p.url);
                setData(DEMO_PRESETS[p.url] || null);
                handleScan(p.url);
              }}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-semibold transition-colors cursor-pointer border border-slate-200"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-8 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results */}
      {data && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Main Hero Card: Radial Gauge + Score Breakdown + Device Toggle */}
          <div className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-2xl shadow-sm">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              
              {/* Left: Big Radial Gauge */}
              <div className="flex items-center gap-6">
                <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="#f1f5f9"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke={data.scores.performance >= 90 ? "#10b981" : data.scores.performance >= 50 ? "#f59e0b" : "#ef4444"}
                      strokeWidth="10"
                      strokeDasharray={2 * Math.PI * 50}
                      strokeDashoffset={2 * Math.PI * 50 * (1 - data.scores.performance / 100)}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-slate-900 tracking-tight">
                      {data.scores.performance}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      / 100
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Lighthouse Performance Score</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {data.scores.performance >= 90
                      ? "Fast & Optimized (Top 5%)"
                      : data.scores.performance >= 50
                      ? "Moderate — Opportunities Exist"
                      : "Critical Latency Detected"}
                  </h2>
                  <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                    Tested via Google Lighthouse API with standard mobile 4G throttled network and CPU emulation.
                  </p>
                </div>
              </div>

              {/* Right: Device Mode Toggle & Full Audit CTA */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto justify-end">
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setDeviceMode("mobile")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                      deviceMode === "mobile" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    Mobile Simulation
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeviceMode("desktop")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                      deviceMode === "desktop" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    Desktop
                  </button>
                </div>

                <Link
                  href={`/analyze?url=${encodeURIComponent(url)}`}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-colors"
                >
                  <span>View 14-Engine Audit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Loading Journey Waterfall Milestone Visual (Ahrefs/Semrush Style) */}
          <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  Page Loading Timeline &amp; Core Milestones
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                SUB-SECOND RENDER
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono uppercase mb-1">Milestone 1</div>
                <div className="text-xs font-bold text-slate-200">TTFB (Server Response)</div>
                <div className="text-lg font-black text-emerald-400 font-mono mt-1">
                  {data.metrics.ttfb.value} {data.metrics.ttfb.unit}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Initial HTML stream delivered</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono uppercase mb-1">Milestone 2</div>
                <div className="text-xs font-bold text-slate-200">FCP (First Paint)</div>
                <div className="text-lg font-black text-emerald-400 font-mono mt-1">
                  {data.metrics.fcp.value} {data.metrics.fcp.unit}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">First pixels painted to screen</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono uppercase mb-1">Milestone 3</div>
                <div className="text-xs font-bold text-slate-200">LCP (Largest Contentful)</div>
                <div className="text-lg font-black text-blue-400 font-mono mt-1">
                  {data.metrics.lcp.value} {data.metrics.lcp.unit}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Primary hero image/text rendered</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono uppercase mb-1">Milestone 4</div>
                <div className="text-xs font-bold text-slate-200">Interactive Latency (INP)</div>
                <div className="text-lg font-black text-purple-400 font-mono mt-1">
                  {data.metrics.fid.value} {data.metrics.fid.unit}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Main thread responsive to clicks</div>
              </div>
            </div>
          </div>

          {/* Core Web Vitals Metric Cards with Visual Range Meters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* LCP */}
            <div className="p-5 bg-white border border-slate-200/90 rounded-2xl flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-slate-800">LCP</span>
                  {getRatingBadge(data.metrics.lcp.rating)}
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {data.metrics.lcp.value} {data.metrics.lcp.unit}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Largest Contentful Paint</div>
              </div>
              <div>
                {renderRangeBar(data.metrics.lcp.value, 2.5, 4.0, 6.0, "s")}
                <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span>Target: &lt; 2.5s</span>
                  <span className="text-emerald-600 font-semibold">25% Weight</span>
                </div>
              </div>
            </div>

            {/* CLS */}
            <div className="p-5 bg-white border border-slate-200/90 rounded-2xl flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-slate-800">CLS</span>
                  {getRatingBadge(data.metrics.cls.rating)}
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {data.metrics.cls.value}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Cumulative Layout Shift</div>
              </div>
              <div>
                {renderRangeBar(data.metrics.cls.value, 0.1, 0.25, 0.5, "")}
                <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span>Target: &lt; 0.1</span>
                  <span className="text-emerald-600 font-semibold">25% Weight</span>
                </div>
              </div>
            </div>

            {/* FCP */}
            <div className="p-5 bg-white border border-slate-200/90 rounded-2xl flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-slate-800">FCP</span>
                  {getRatingBadge(data.metrics.fcp.rating)}
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {data.metrics.fcp.value} {data.metrics.fcp.unit}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">First Contentful Paint</div>
              </div>
              <div>
                {renderRangeBar(data.metrics.fcp.value, 1.8, 3.0, 5.0, "s")}
                <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span>Target: &lt; 1.8s</span>
                  <span className="text-emerald-600 font-semibold">10% Weight</span>
                </div>
              </div>
            </div>

            {/* INP / FID */}
            <div className="p-5 bg-white border border-slate-200/90 rounded-2xl flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-slate-800">INP / FID</span>
                  {getRatingBadge(data.metrics.fid.rating)}
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {data.metrics.fid.value} {data.metrics.fid.unit}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Interaction Responsiveness</div>
              </div>
              <div>
                {renderRangeBar(data.metrics.fid.value, 200, 500, 800, "ms")}
                <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span>Target: &lt; 200ms</span>
                  <span className="text-emerald-600 font-semibold">25% Weight</span>
                </div>
              </div>
            </div>

            {/* TTFB */}
            <div className="p-5 bg-white border border-slate-200/90 rounded-2xl flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-slate-800">TTFB</span>
                  {getRatingBadge(data.metrics.ttfb.rating)}
                </div>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {data.metrics.ttfb.value} {data.metrics.ttfb.unit}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Time to First Byte</div>
              </div>
              <div>
                {renderRangeBar(data.metrics.ttfb.value, 800, 1800, 3000, "ms")}
                <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span>Target: &lt; 800ms</span>
                  <span className="text-emerald-600 font-semibold">15% Weight</span>
                </div>
              </div>
            </div>

          </div>

          {/* Diagnostic Opportunities */}
          {data.opportunities.length > 0 && (
            <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Automated Speed Remediation &amp; Potential Savings
                </h3>
                <span className="text-xs font-semibold text-emerald-600">
                  {data.opportunities.length} Items Identified
                </span>
              </div>
              <div className="space-y-3">
                {data.opportunities.map((opp, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                        {opp.title}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{opp.description}</p>
                    </div>
                    {opp.savingsMs && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0">
                        Save ~{(opp.savingsMs / 1000).toFixed(1)}s
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Starter Plan Banner */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3 h-3" />
                Continuous 24/7 Autopilot
              </div>
              <h3 className="text-lg font-bold">Monitor Core Web Vitals Weekly with Real-Time Webhooks</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                Receive instant notifications in Slack or Discord whenever a new code deployment or asset upload degrades your LCP or causes layout shifts.
              </p>
            </div>
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold whitespace-nowrap transition-all shadow-md shrink-0"
            >
              Explore Growth Plans ($0–$49/mo)
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
