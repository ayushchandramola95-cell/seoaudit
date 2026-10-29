"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Search,
  Globe,
  BarChart,
  BarChart3,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Users,
  Compass,
  RefreshCw,
  ExternalLink,
  PieChart,
  Sliders,
  Award,
} from "lucide-react";
import { TrafficEstimationReport } from "@/lib/modules/traffic/estimator";

interface TrafficApiResponse {
  success: boolean;
  domain: string;
  latencyMs: number;
  pageRank: number;
  data: TrafficEstimationReport;
}

const PRESET_DOMAINS = [
  { domain: "stripe.com", label: "Stripe" },
  { domain: "linear.app", label: "Linear" },
  { domain: "vercel.com", label: "Vercel" },
  { domain: "github.com", label: "GitHub" },
];

export default function TrafficEstimatorClient() {
  const [domainInput, setDomainInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrafficApiResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"channels" | "ctr" | "signals" | "methodology">("channels");

  // STRICT REQUIREMENT: NO AUTO-FETCHING!
  // Presets ONLY populate the input box. User MUST explicitly click "Estimate Traffic".
  const handleSelectPreset = (domain: string) => {
    setDomainInput(domain);
  };

  const handleEstimate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!domainInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tools/traffic-estimator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domainInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to calculate organic traffic estimate.");
      }

      setResult(data);
    } catch (err: unknown) {
      setError((err as Error)?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-indigo-600 transition-colors">Tools</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Organic Traffic Estimator</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-slate-950 text-white pt-12 pb-16 relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-radial-gradient from-indigo-900/20 via-transparent to-transparent opacity-50 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <TrendingUp className="w-3.5 h-3.5" />
              Heuristic Footprint Engine v2.0
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Award className="w-3.5 h-3.5" />
              Open PageRank Integrated
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <PieChart className="w-3.5 h-3.5" />
              Multi-Channel Attribution
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
            Organic Traffic &amp; Reach Estimator
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed mb-8">
            Predict monthly search traffic volumes, model SERP click-through rates (CTR), and estimate channel distributions 
            (Organic, Direct, Referral, Social) powered by Open PageRank and global statistical benchmarks.
          </p>

          {/* Form */}
          <form onSubmit={handleEstimate} className="max-w-3xl">
            <div className="bg-slate-900/90 p-2 sm:p-2.5 rounded-2xl border border-slate-800 shadow-2xl flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 flex items-center">
                <Globe className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  placeholder="Enter domain (e.g., stripe.com, linear.app, vercel.com)"
                  className="w-full bg-slate-950/80 text-white placeholder-slate-500 text-sm rounded-xl pl-11 pr-4 py-3 border border-slate-700/80 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-mono transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !domainInput.trim()}
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/30 active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Calculating Footprint...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Estimate Organic Traffic</span>
                  </>
                )}
              </button>
            </div>

            {/* Presets - STRICTLY populate only, user must click button to audit */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-400">
              <span className="text-slate-400 font-medium">Quick presets (fills input, click Estimate to run):</span>
              {PRESET_DOMAINS.map((p) => (
                <button
                  key={p.domain}
                  type="button"
                  onClick={() => handleSelectPreset(p.domain)}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition-colors ${
                    domainInput === p.domain
                      ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/40"
                      : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700"
                  }`}
                >
                  {p.domain}
                </button>
              ))}
            </div>
          </form>

          {error && (
            <div className="mt-6 max-w-3xl p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-200">Estimation Failed</p>
                <p className="mt-0.5 text-xs text-rose-300/90">{error}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {!result && !loading && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100 shadow-inner">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Ready to Model Organic Traffic &amp; Reach
            </h3>
            <p className="text-sm text-slate-600 max-w-xl mx-auto mb-6">
              Enter any domain above or pick a preset, then click <strong>&quot;Estimate Organic Traffic&quot;</strong>. 
              Estimations run only when explicitly commanded.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm mb-1">
                  <Award className="w-4 h-4 text-indigo-600" />
                  Open PageRank Authority
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Integrates algorithmic PageRank (0-10 scale) computed over web-scale link graphs.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm mb-1">
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  Channel Segmentation
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Breaks down visitors across Organic Search, Direct Navigation, Referrals, and Social.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm mb-1">
                  <Sliders className="w-4 h-4 text-purple-600" />
                  SERP Click Curves
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Applies empirical top-3 and top-10 click distributions to project potential conversion reach.
                </p>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  <span>Monthly Visits Range</span>
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-2xl font-black text-indigo-700">
                  {result.data.formattedRange}
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  Midpoint: ~{result.data.monthlyVisitsMidpoint.toLocaleString()} visits/mo
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  <span>Model Confidence</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-black ${
                    result.data.confidence === "High" ? "text-emerald-600" : "text-amber-600"
                  }`}>
                    {result.data.confidence}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {result.data.confidenceScore}% index
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-2 truncate" title={result.data.confidenceReason}>
                  {result.data.confidenceReason}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  <span>Open PageRank Score</span>
                  <Award className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-3xl font-black text-purple-700">
                  {result.pageRank.toFixed(2)} <span className="text-sm font-semibold text-slate-600">/ 10</span>
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  Web-scale algorithmic backlink authority
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  <span>Organic Search Share</span>
                  <PieChart className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-3xl font-black text-blue-700">
                  {result.data.organicSearchShare}%
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  Of total traffic driven by search queries
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setActiveTab("channels")}
                  className={`px-6 py-3.5 text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === "channels"
                      ? "border-indigo-600 text-indigo-600 bg-white"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Traffic Channels ({result.data.channels.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("ctr")}
                  className={`px-6 py-3.5 text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === "ctr"
                      ? "border-indigo-600 text-indigo-600 bg-white"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  SERP CTR Click Model
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("signals")}
                  className={`px-6 py-3.5 text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === "signals"
                      ? "border-indigo-600 text-indigo-600 bg-white"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                  Signal Factors ({result.data.signalsUsed.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("methodology")}
                  className={`px-6 py-3.5 text-sm font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === "methodology"
                      ? "border-indigo-600 text-indigo-600 bg-white"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Engine Methodology &amp; Transparency
                </button>
              </div>

              {/* Tab 1: Channels */}
              {activeTab === "channels" && (
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-slate-900 text-base">Channel Distribution Breakdown</h3>
                    <p className="text-xs text-slate-600">
                      Estimated visitor inflow segmented by digital acquisition medium.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {result.data.channels.map((chan, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between text-sm font-bold text-slate-900 mb-2">
                          <div className="flex items-center gap-2">
                            <span>{chan.name}</span>
                            <span className="text-xs font-normal text-slate-600">
                              (~{chan.formattedVisits} visits/mo)
                            </span>
                          </div>
                          <span className="text-indigo-600 font-mono">{chan.percentage}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              chan.name.includes("Organic")
                                ? "bg-indigo-600"
                                : chan.name.includes("Direct")
                                ? "bg-blue-600"
                                : chan.name.includes("Referral")
                                ? "bg-emerald-600"
                                : "bg-purple-600"
                            }`}
                            style={{ width: `${chan.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: CTR */}
              {activeTab === "ctr" && (
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-slate-900 text-base">Empirical Click-Through Distribution</h3>
                    <p className="text-xs text-slate-600">
                      Standard search click models applied to organic keyword impressions.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="p-5 bg-indigo-50 border border-indigo-200 rounded-xl">
                      <p className="text-xs font-semibold text-indigo-900">Top 3 Positions CTR Share</p>
                      <p className="text-3xl font-black text-indigo-700 mt-1">{result.data.ctrModel.top3Share}</p>
                      <p className="text-xs text-indigo-800 mt-1">Average capture of all clicks on first-page SERP</p>
                    </div>

                    <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl">
                      <p className="text-xs font-semibold text-blue-900">Top 10 Positions CTR Share</p>
                      <p className="text-3xl font-black text-blue-700 mt-1">{result.data.ctrModel.top10Share}</p>
                      <p className="text-xs text-blue-800 mt-1">Total page-one organic search click consolidation</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                    <span className="font-bold text-slate-900">Model Notes: </span>
                    {result.data.ctrModel.modelNotes}
                  </div>
                </div>
              )}

              {/* Tab 3: Signals */}
              {activeTab === "signals" && (
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-slate-900 text-base">Signals Factored in Estimation</h3>
                    <p className="text-xs text-slate-600">
                      Evaluated technical and algorithmic indicators used to construct the volume projection.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {result.data.signalsUsed.map((sig, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-900">{sig.name}</p>
                          <p className="text-xs text-slate-600 font-mono mt-0.5">{sig.value}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded text-xs font-semibold uppercase ${
                          sig.impact === "Positive"
                            ? "bg-emerald-100 text-emerald-800"
                            : sig.impact === "Neutral"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-slate-200 text-slate-700"
                        }`}>
                          {sig.impact}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Methodology */}
              {activeTab === "methodology" && (
                <div className="p-6 space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                      Engine Architecture
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {result.data.modelEngine || "Statistical Footprint Engine v2.0"} combines curated seed domain anchors, top-level domain (TLD) classification, indexability factors, and Open PageRank metrics to construct deterministic range estimates.
                    </p>
                  </div>

                  {result.data.limitations.length > 0 && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        Model Limitations &amp; Caveats:
                      </h4>
                      <ul className="space-y-1.5 text-xs text-amber-800">
                        {result.data.limitations.map((lim, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="font-bold text-amber-600">•</span>
                            <span>{lim}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cross-Tool Actions Footer */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-lg font-bold">Verify Real Performance in Google Intelligence Hub</h4>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  Connect {result.domain} to compare heuristic traffic estimates against actual Google Search Console clicks and GA4 active users.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <Link
                  href={`/tools/google-hub`}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md"
                >
                  <span>Launch Google Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={`/analyze?url=https://${result.domain}`}
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors border border-slate-700"
                >
                  <Globe className="w-4 h-4" />
                  <span>Run Full Technical Audit</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
