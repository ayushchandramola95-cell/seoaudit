"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Link2,
  Search,
  Globe,
  Award,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  PieChart,
  Layers,
  ArrowRight,
  Download,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Sliders,
  TrendingUp,
} from "lucide-react";

interface BacklinkData {
  pageRank: number;
  domainRating: number;
  totalBacklinks: number;
  referringDomains: number;
  dofollowPercent: number;
  nofollowPercent: number;
  spamScore: number;
  anchors: Array<{ anchor: string; type: string; count: number; share: number }>;
  tldDistribution: Array<{ tld: string; share: number; count: number }>;
  rankStatus: string;
}

interface BacklinkApiResponse {
  success: boolean;
  domain: string;
  latencyMs: number;
  data: BacklinkData;
}

const PRESET_DOMAINS = [
  { domain: "stripe.com", label: "Stripe", tag: "Fintech SaaS" },
  { domain: "linear.app", label: "Linear", tag: "Productivity" },
  { domain: "vercel.com", label: "Vercel", tag: "Cloud Edge" },
  { domain: "github.com", label: "GitHub", tag: "Dev Platform" },
];

export default function BacklinkCheckerClient() {
  const [domainInput, setDomainInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BacklinkApiResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"anchors" | "tlds" | "authority">("anchors");
  const [copiedSummary, setCopiedSummary] = useState(false);

  // STRICT REQUIREMENT: NO AUTO-FETCHING!
  // Presets ONLY populate the input box. User MUST explicitly click "Check Backlinks".
  const handleSelectPreset = (domain: string) => {
    setDomainInput(domain);
  };

  const handleCheck = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!domainInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tools/backlink-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domainInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to analyze backlink profile.");
      }

      setResult(data);
    } catch (err: unknown) {
      setError((err as Error)?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const copySummary = () => {
    if (!result) return;
    const text = `Backlink Profile for ${result.domain}:
- Domain Rating (DR): ${result.data.domainRating} / 100
- Open PageRank: ${result.data.pageRank.toFixed(2)} / 10
- Estimated Backlinks: ~${result.data.totalBacklinks.toLocaleString()}
- Referring Domains: ~${result.data.referringDomains.toLocaleString()}
- Dofollow Share: ${result.data.dofollowPercent}% (Nofollow: ${result.data.nofollowPercent}%)
- Spam Score: ${result.data.spamScore}%
Generated via SeoSeite Backlink Intelligence Engine`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const exportCsv = () => {
    if (!result) return;
    const rows = [
      ["Metric", "Value"],
      ["Domain", result.domain],
      ["Domain Rating", result.data.domainRating.toString()],
      ["PageRank (0-10)", result.data.pageRank.toFixed(2)],
      ["Total Backlinks", result.data.totalBacklinks.toString()],
      ["Referring Domains", result.data.referringDomains.toString()],
      ["Dofollow %", `${result.data.dofollowPercent}%`],
      ["Nofollow %", `${result.data.nofollowPercent}%`],
      ["Spam Score", `${result.data.spamScore}%`],
      [],
      ["Anchor Text", "Type", "Estimated Links", "Share %"],
      ...result.data.anchors.map((a) => [a.anchor, a.type, a.count.toString(), `${a.share}%`]),
      [],
      ["TLD Extension", "Share %", "Referring Domains"],
      ...result.data.tldDistribution.map((t) => [t.tld, `${t.share}%`, t.count.toString()]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", `backlinks-${result.domain}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28">
      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-blue-600 transition-colors">Tools</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Backlink Profile &amp; Anchors</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-slate-950 text-white pt-12 pb-16 relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-radial-gradient from-blue-900/20 via-transparent to-transparent opacity-60 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-xs">
              <Link2 className="w-3.5 h-3.5 text-blue-400" />
              Ahrefs &amp; Moz Link Graph Benchmark
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              Open PageRank Calibrated
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              Toxic Link Risk Index
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
            Backlink Profile &amp; Anchor Text Checker
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed mb-8">
            Analyze referring domain volumes, inspect follow vs. nofollow citation ratios, 
            evaluate top anchor text distributions, and monitor backlink spam risk calibrated on global link graphs.
          </p>

          {/* Form */}
          <form onSubmit={handleCheck} className="max-w-3xl">
            <div className="bg-slate-900/90 p-2 sm:p-2.5 rounded-2xl border border-slate-800 shadow-2xl flex flex-col sm:flex-row gap-2 backdrop-blur-md">
              <div className="relative flex-1 flex items-center">
                <Globe className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  placeholder="Enter domain (e.g. stripe.com, linear.app, vercel.com)"
                  className="w-full bg-slate-950/80 text-white placeholder-slate-500 text-sm rounded-xl pl-11 pr-4 py-3 border border-slate-700/80 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-mono transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !domainInput.trim()}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/30 active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Mapping Links...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Check Backlink Profile</span>
                  </>
                )}
              </button>
            </div>

            {/* Presets - STRICTLY populate only, user must click button to audit */}
            <div className="flex flex-wrap items-center gap-2 mt-3.5 text-xs text-slate-400">
              <span className="text-slate-400 font-medium">Quick presets (fills input, click Check to run):</span>
              {PRESET_DOMAINS.map((p) => (
                <button
                  key={p.domain}
                  type="button"
                  onClick={() => handleSelectPreset(p.domain)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                    domainInput === p.domain
                      ? "bg-blue-600/30 text-blue-300 border-blue-500/50 shadow-inner"
                      : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700"
                  }`}
                >
                  <span className="font-semibold">{p.domain}</span>
                  <span className="text-[10px] text-slate-400 px-1 rounded bg-slate-800">
                    {p.tag}
                  </span>
                </button>
              ))}
            </div>
          </form>

          {error && (
            <div className="mt-6 max-w-3xl p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-200">Analysis Failed</p>
                <p className="mt-0.5 text-xs text-rose-300/90">{error}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {!result && !loading && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-sm">
              <Link2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">
              Ready to Inspect Backlink Authority &amp; Anchor Profiles
            </h3>
            <p className="text-sm text-slate-600 max-w-xl mx-auto mb-8">
              Enter any domain above or pick a preset, then click <strong>&quot;Check Backlink Profile&quot;</strong>. 
              Estimations run only when explicitly commanded.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-1">
                  <Award className="w-4 h-4 text-blue-600" />
                  Domain Rating (DR)
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Logarithmic 0-100 scale measuring link equity and backlink strength against all indexed domains.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-1">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  Anchor Text Profile
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Categorizes inbound citations into Branded, Naked URL, Compound, and Generic anchor distributions.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-1">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  Toxic Link Risk Score
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Monitors spam signals to prevent Google link-spam penalties and algorithmic demotions.
                </p>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black">
                  <Link2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-slate-900">{result.domain}</h2>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {result.data.rankStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Authority Anchor • Computed in {result.latencyMs}ms
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={copySummary}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSummary ? "Copied" : "Copy Summary"}</span>
                </button>

                <button
                  type="button"
                  onClick={exportCsv}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-slate-300" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Top 4 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <span>Domain Rating (DR)</span>
                  <Award className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-3xl font-black text-blue-700">
                  {result.data.domainRating} <span className="text-sm font-semibold text-slate-400">/ 100</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  PageRank: {result.data.pageRank.toFixed(2)}/10
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <span>Total Backlinks</span>
                  <Link2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-black text-slate-900">
                  ~{result.data.totalBacklinks.toLocaleString()}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Estimated live inbound citations
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <span>Referring Domains</span>
                  <Globe className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-3xl font-black text-purple-700">
                  ~{result.data.referringDomains.toLocaleString()}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Unique root domains linking in
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <span>Spam Risk Score</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-black ${result.data.spamScore < 10 ? "text-emerald-600" : "text-amber-600"}`}>
                    {result.data.spamScore}%
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                    Low Risk
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Clean link neighborhood index
                </p>
              </div>
            </div>

            {/* Dofollow vs Nofollow Ratio Bar */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-sm font-bold text-slate-900 mb-2">
                <div className="flex items-center gap-2 text-emerald-700">
                  <span>Dofollow Links (Pass Equity): {result.data.dofollowPercent}%</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <span>Nofollow / UGC / Sponsored: {result.data.nofollowPercent}%</span>
                </div>
              </div>
              <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500" style={{ width: `${result.data.dofollowPercent}%` }} />
                <div className="h-full bg-slate-400" style={{ width: `${result.data.nofollowPercent}%` }} />
              </div>
            </div>

            {/* Main Tabs */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="flex border-b border-slate-200 bg-slate-50/60 p-1.5 gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("anchors")}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "anchors" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Anchor Text Profile ({result.data.anchors.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("tlds")}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "tlds" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Referring TLDs ({result.data.tldDistribution.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("authority")}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "authority" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Equity Metrics
                </button>
              </div>

              {/* Tab 1: Anchor Text Table */}
              {activeTab === "anchors" && (
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-slate-900 text-sm">Top Referring Anchor Text Distribution</h3>
                    <p className="text-xs text-slate-500">
                      Distribution of text hyperlinks used across referring domains to point to {result.domain}.
                    </p>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">Anchor Text Phrase</th>
                          <th className="py-3 px-4">Classification</th>
                          <th className="py-3 px-4">Est. Inbound Links</th>
                          <th className="py-3 px-4">Share %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800">
                        {result.data.anchors.map((anc, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-slate-900">
                              &quot;{anc.anchor}&quot;
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                                {anc.type}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-xs">
                              ~{anc.count.toLocaleString()}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-600" style={{ width: `${anc.share}%` }} />
                                </div>
                                <span className="font-mono text-xs">{anc.share}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 2: TLD Distribution */}
              {activeTab === "tlds" && (
                <div className="p-6 space-y-4">
                  <div className="mb-4">
                    <h3 className="font-bold text-slate-900 text-sm">Referring Domain TLD Breakdown</h3>
                    <p className="text-xs text-slate-500">
                      Extension distribution of external root domains linking to {result.domain}.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {result.data.tldDistribution.map((tld, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                        <div className="flex items-center justify-between font-mono font-bold text-slate-900 text-sm">
                          <span>{tld.tld}</span>
                          <span className="text-blue-600">{tld.share}%</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          ~{tld.count.toLocaleString()} referring domains
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Authority Details */}
              {activeTab === "authority" && (
                <div className="p-6 space-y-4">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Link Equity Model
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      SeoSeite Backlink Intelligence correlates web-scale Common Crawl PageRank data, 
                      anchor text entropy, and host authority to project live backlink volumes and Moz DA / Ahrefs DR equivalents.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Cross-Tool Actions Footer */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div>
                <h4 className="text-lg font-bold">Estimate Organic Traffic Volume</h4>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  Evaluate how this backlink authority translates into monthly organic search visits and commercial PPC ad value.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <Link
                  href={`/tools/traffic-estimator?domain=${encodeURIComponent(result.domain)}`}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  <span>Organic Traffic Estimator</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={`/tools/authority-checker?domain=${encodeURIComponent(result.domain)}`}
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors border border-slate-700 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Authority Formula Lab</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

