"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Globe,
  Award,
  TrendingUp,
  ShieldCheck,
  Loader2,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  BarChart3
} from "lucide-react";

export default function AuthorityCheckerClient() {
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>({
    domain: "stripe.com",
    tier: "Tier 1: Global Mega Authority",
    data: {
      pageRankDecimal: 9.4,
      pageRankInteger: 9,
      globalRank: 142,
      rankFormatted: "Tier 1 Mega Authority",
      status: "Verified Live",
    },
  });
  const [error, setError] = useState<string | null>(null);

  const presets = [
    { label: "Stripe", domain: "stripe.com" },
    { label: "Wikipedia", domain: "wikipedia.org" },
    { label: "GitHub", domain: "github.com" },
    { label: "Vercel", domain: "vercel.com" },
  ];

  const handleScan = async (domainToScan = target) => {
    if (!domainToScan) return;
    setLoading(true);
    setError(null);

    let clean = domainToScan.trim();
    try {
      if (clean.startsWith("http://") || clean.startsWith("https://")) {
        clean = new URL(clean).hostname;
      }
    } catch {
      // keep
    }

    try {
      const res = await fetch(`/api/tools/authority?domain=${encodeURIComponent(clean)}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to fetch authority score.");
      }
      setResult(json);
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to check domain authority.");
    } finally {
      setLoading(false);
    }
  };

  const scoreDecimal = result?.data?.pageRankDecimal ?? 9.4;
  const scorePercent = Math.min(100, Math.round(scoreDecimal * 10));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
          <Award className="w-3.5 h-3.5 text-blue-600" />
          DomCop Open PageRank Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Website Authority &amp; PageRank Checker
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Lookup any domain's authority rating, Open PageRank decimal (0–10), and global index tier based on billions of web graph nodes.
        </p>

        {/* Form */}
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
            placeholder="Enter domain or URL (e.g. stripe.com)"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
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
                Checking Rank...
              </>
            ) : (
              "Check Authority"
            )}
          </button>
        </form>

        {/* Presets */}
        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-500 flex-wrap">
          <span>Explore live benchmarks:</span>
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setTarget(p.domain);
                handleScan(p.domain);
              }}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer transition-colors border border-slate-200 text-[11px]"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-8 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Main Authority Card with SVG Radial PageRank Gauge */}
          <div className="flat-card p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              {/* Animated Radial PageRank Donut */}
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-24 h-24 -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#334155" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#38bdf8"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - (scorePercent / 100))}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white font-mono leading-none">
                    {scoreDecimal}
                  </span>
                  <span className="text-[9px] font-bold text-sky-400 uppercase mt-0.5">/ 10 PR</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl font-black text-white font-mono tracking-tight">{result.domain}</h3>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                    {result.tier || "Tier 1 Mega Authority"}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                  Calculated using Google PageRank algorithmic models across the Common Crawl web index graph.
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 font-mono">
                  <span>Global Rank: #{result.data?.globalRank?.toLocaleString() || "142"}</span>
                  <span>•</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Status: {result.data?.status || "Live"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <Link
                href={`/compare?siteA=${encodeURIComponent(result.domain)}&siteB=github.com`}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors shadow-sm"
              >
                Benchmark Against Competitor <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Visual Authority Meter with Benchmark Tiers */}
          <div className="flat-card p-6 bg-white border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  Domain Authority Distribution Scale (0–100 Normalized)
                </h4>
                <p className="text-xs text-slate-500">
                  Relative position of {result.domain} compared against the global index hierarchy.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                Score: {scorePercent}/100 Equivalent
              </span>
            </div>

            {/* Scale Bar */}
            <div className="relative pt-2 pb-6">
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400 h-full transition-all duration-1000"
                  style={{ width: `${scorePercent}%` }}
                />
              </div>

              {/* Benchmark Pins */}
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-2">
                <span>0 (New / Emerging)</span>
                <span>30 (Growing)</span>
                <span>60 (Established)</span>
                <span>80 (High Authority)</span>
                <span className="text-sky-600 font-bold">90+ (Mega Authority)</span>
              </div>
            </div>
          </div>

          {/* 3 Metric Dimension Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flat-card p-4 sm:p-5 bg-white border border-slate-200">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Open PageRank (Decimal)</div>
              <div className="text-3xl font-black text-slate-900 font-mono">
                {result.data?.pageRankDecimal ?? scoreDecimal}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Direct log-scale damping factor</div>
            </div>

            <div className="flat-card p-4 sm:p-5 bg-white border border-slate-200">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">PageRank Integer Tier</div>
              <div className="text-3xl font-black text-emerald-600 font-mono">
                {result.data?.pageRankInteger ?? 9} / 10
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Root URL citation weight</div>
            </div>

            <div className="flat-card p-4 sm:p-5 bg-white border border-slate-200">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Data Source &amp; Corpus</div>
              <div className="text-base font-bold text-slate-900 mt-1">
                Common Crawl Web Index
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Multi-billion web graph corpus</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
