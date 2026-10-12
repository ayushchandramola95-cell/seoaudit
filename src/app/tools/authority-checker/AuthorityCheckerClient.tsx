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
  ExternalLink
} from "lucide-react";

export default function AuthorityCheckerClient() {
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const presets = [
    { label: "Wikipedia", domain: "wikipedia.org" },
    { label: "Stripe", domain: "stripe.com" },
    { label: "GitHub", domain: "github.com" },
  ];

  const handleScan = async (domainToScan = target) => {
    if (!domainToScan) return;
    setLoading(true);
    setError(null);
    setResult(null);

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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
          <Award className="w-3.5 h-3.5 text-blue-600" />
          DomCop Open PageRank
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
        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-500">
          <span>Try quick demo:</span>
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setTarget(p.domain);
                handleScan(p.domain);
              }}
              className="text-blue-600 hover:underline font-medium cursor-pointer"
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
          {/* Main Authority Card */}
          <div className="flat-card p-6 bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white flex flex-col items-center justify-center font-black text-3xl shadow-sm">
                {result.data?.pageRankDecimal ?? "—"}
                <span className="text-[10px] font-semibold uppercase tracking-wider opacity-90">/ 10</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{result.domain}</h3>
                <p className="text-xs font-semibold text-blue-600 mt-0.5">{result.tier}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                  <span>Global Rank: #{result.data?.globalRank?.toLocaleString() || result.data?.rankFormatted || "Unranked"}</span>
                  <span>•</span>
                  <span>Status: {result.data?.status || "Live"}</span>
                </div>
              </div>
            </div>

            <Link
              href={`/compare?urlA=${encodeURIComponent(result.domain)}&urlB=competitor.com`}
              className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 whitespace-nowrap"
            >
              Compare Against Competitor <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Details breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flat-card p-4 bg-white border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">Open PageRank (Decimal)</div>
              <div className="text-2xl font-black text-slate-900">
                {result.data?.pageRankDecimal ?? 0}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Calculated via Open PageRank algorithm</div>
            </div>

            <div className="flat-card p-4 bg-white border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">Page Rank Integer</div>
              <div className="text-2xl font-black text-emerald-600">
                {result.data?.pageRankInteger ?? 0}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Root URL citation weight</div>
            </div>

            <div className="flat-card p-4 bg-white border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">Data Source</div>
              <div className="text-base font-bold text-slate-800 mt-1">
                Common Crawl Web Index
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Free open-source web graph data</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
