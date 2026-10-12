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
  HelpCircle
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

export default function SpeedLabClient() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<VitalsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const presets = [
    { label: "Stripe", url: "https://stripe.com" },
    { label: "Vercel", url: "https://vercel.com" },
    { label: "Tailwind CSS", url: "https://tailwindcss.com" },
  ];

  const handleScan = async (targetToScan = url) => {
    if (!targetToScan) return;
    setLoading(true);
    setError(null);
    setData(null);

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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-3">
          <Zap className="w-3.5 h-3.5 text-amber-600" />
          Google PageSpeed Insights Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Core Web Vitals &amp; PageSpeed Lab
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Inspect LCP, CLS, INP, FCP, and TTFB with sub-second accuracy. Identify exactly which script payloads and assets are causing render blocks.
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
            className="flex-1 px-4 py-3 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Speed...
              </>
            ) : (
              "Test PageSpeed"
            )}
          </button>
        </form>

        {/* Presets */}
        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-500">
          <span>Try quick demo:</span>
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setUrl(p.url);
                handleScan(p.url);
              }}
              className="text-blue-600 hover:underline font-medium cursor-pointer"
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
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Main Score Hero Card */}
          <div className="flat-card p-6 bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div
                className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-black text-3xl shadow-sm ${
                  data.scores.performance >= 90
                    ? "bg-emerald-500 text-white"
                    : data.scores.performance >= 50
                    ? "bg-amber-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {data.scores.performance}
                <span className="text-[10px] font-semibold uppercase tracking-wider opacity-90">/ 100</span>
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900">Overall Performance Score</div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Google Lighthouse synthetic test run with standard 4G mobile throttling.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] font-medium text-slate-400">
                    Engine: {data.isLiveApi ? "Google PSI Cloud API (Live)" : "Deterministic Heuristic Emulation"}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href={`/analyze?url=${encodeURIComponent(url)}`}
              className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 whitespace-nowrap"
            >
              View Full 14-Tab Audit <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Core Web Vitals 5 Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="flat-card p-4 bg-white border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">LCP</span>
                  {getRatingBadge(data.metrics.lcp.rating)}
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {data.metrics.lcp.value} {data.metrics.lcp.unit}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Largest Contentful Paint</div>
              </div>
              <div className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100">Target: &lt; 2.5s</div>
            </div>

            <div className="flat-card p-4 bg-white border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">CLS</span>
                  {getRatingBadge(data.metrics.cls.rating)}
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {data.metrics.cls.value}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Cumulative Layout Shift</div>
              </div>
              <div className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100">Target: &lt; 0.1</div>
            </div>

            <div className="flat-card p-4 bg-white border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">FCP</span>
                  {getRatingBadge(data.metrics.fcp.rating)}
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {data.metrics.fcp.value} {data.metrics.fcp.unit}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">First Contentful Paint</div>
              </div>
              <div className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100">Target: &lt; 1.8s</div>
            </div>

            <div className="flat-card p-4 bg-white border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">INP / FID</span>
                  {getRatingBadge(data.metrics.fid.rating)}
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {data.metrics.fid.value} {data.metrics.fid.unit}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Interaction Responsiveness</div>
              </div>
              <div className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100">Target: &lt; 200ms</div>
            </div>

            <div className="flat-card p-4 bg-white border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">TTFB</span>
                  {getRatingBadge(data.metrics.ttfb.rating)}
                </div>
                <div className="text-2xl font-black text-slate-900">
                  {data.metrics.ttfb.value} {data.metrics.ttfb.unit}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Time to First Byte (Server)</div>
              </div>
              <div className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100">Target: &lt; 800ms</div>
            </div>
          </div>

          {/* Diagnostic Opportunities */}
          {data.opportunities.length > 0 && (
            <div className="flat-card p-5 bg-white border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                Optimization Recommendations &amp; Savings
              </h3>
              <div className="space-y-3">
                {data.opportunities.map((opp, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{opp.title}</div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{opp.description}</p>
                    </div>
                    {opp.savingsMs && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                        Save ~{(opp.savingsMs / 1000).toFixed(1)}s
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Starter Plan Banner */}
          <div className="flat-card p-6 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-semibold mb-1">
                <Sparkles className="w-3 h-3" />
                Continuous Monitoring
              </div>
              <h3 className="text-base font-bold">Monitor Core Web Vitals 24/7 with Alerts</h3>
              <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
                Get alerted on Slack or Discord if a deployment degrades your LCP or causes layout shifts.
              </p>
            </div>
            <Link
              href="/pricing"
              className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold whitespace-nowrap transition-colors"
            >
              Upgrade to Starter ($15/mo)
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
