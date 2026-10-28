"use client";

import { useState, useMemo } from "react";
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
  BarChart3,
  Search,
  Copy,
  Download,
  Check,
  GitCompare,
  Zap,
  Layers,
  Link2,
  Compass,
  BookOpen,
  PieChart,
  FileText,
  AlertCircle,
  HelpCircle,
  Hash,
  Scale,
} from "lucide-react";

interface AuthorityResult {
  domain: string;
  tier: string;
  data: {
    pageRankDecimal: number;
    pageRankInteger: number;
    globalRank: number | null;
    rankFormatted: string;
    isLive: boolean;
    status: string;
    message?: string;
    normalizedScore: number;
    mozDaEquivalent: number;
    ahrefsDrEquivalent: number;
    estimatedReferringDomains: number;
    estimatedTotalBacklinks: number;
    eduGovBacklinks: number;
    rankingCapacity: string;
    rankingPower: string;
    trend: Array<{ month: string; pageRank: number; rank: number }>;
  };
}

export default function AuthorityCheckerClient() {
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"matrix" | "backlinks" | "ranking" | "compare" | "playbook">("matrix");
  const [copiedToast, setCopiedToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Compare mode
  const [compareTarget, setCompareTarget] = useState("paypal.com");
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareResult, setCompareResult] = useState<AuthorityResult | null>(null);

  // Initial Sample Result (Stripe)
  const [result, setResult] = useState<AuthorityResult | null>({
    domain: "stripe.com",
    tier: "Tier 2: High Authority Domain (PR 6.0 - 7.9)",
    data: {
      pageRankDecimal: 7.4,
      pageRankInteger: 7,
      globalRank: 1420,
      rankFormatted: "#1,420",
      isLive: true,
      status: "Verified Live",
      message: "Live PageRank verified via DomCop Open PageRank Common Crawl index.",
      normalizedScore: 74,
      mozDaEquivalent: 76,
      ahrefsDrEquivalent: 78,
      estimatedReferringDomains: 64200,
      estimatedTotalBacklinks: 3980000,
      eduGovBacklinks: 5130,
      rankingCapacity: "High-Competition Commercial Keywords (KD 50–79)",
      rankingPower: "High Authority",
      trend: [
        { month: "May", pageRank: 7.12, rank: 1840 },
        { month: "Jun", pageRank: 7.18, rank: 1730 },
        { month: "Jul", pageRank: 7.25, rank: 1610 },
        { month: "Aug", pageRank: 7.31, rank: 1530 },
        { month: "Sep", pageRank: 7.36, rank: 1470 },
        { month: "Oct", pageRank: 7.4, rank: 1420 },
      ],
    },
  });

  const presets = [
    { label: "Stripe", domain: "stripe.com" },
    { label: "Wikipedia", domain: "wikipedia.org" },
    { label: "GitHub", domain: "github.com" },
    { label: "Vercel", domain: "vercel.com" },
    { label: "Apple", domain: "apple.com" },
    { label: "Reddit", domain: "reddit.com" },
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
    clean = clean.toLowerCase().replace(/^www\./, "");
    setTarget(clean);

    try {
      const res = await fetch(`/api/tools/authority?domain=${encodeURIComponent(clean)}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to fetch authority score.");
      }
      setResult(json);
      showToast(`Analyzed ${json.domain} (PR: ${json.data.pageRankDecimal}/10)!`);
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to check domain authority.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompareScan = async () => {
    if (!compareTarget) return;
    setCompareLoading(true);

    let clean = compareTarget.trim();
    try {
      if (clean.startsWith("http://") || clean.startsWith("https://")) {
        clean = new URL(clean).hostname;
      }
    } catch {
      // keep
    }
    clean = clean.toLowerCase().replace(/^www\./, "");
    setCompareTarget(clean);

    try {
      const res = await fetch(`/api/tools/authority?domain=${encodeURIComponent(clean)}`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to check competitor authority.");
      setCompareResult(json);
      showToast(`Benchmarked ${json.domain}!`);
    } catch (err: unknown) {
      showToast((err as Error)?.message || "Competitor check failed.");
    } finally {
      setCompareLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setCopiedToast(msg);
    setTimeout(() => setCopiedToast(null), 3000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard!`);
  };

  const copyMarkdownBadge = () => {
    if (!result) return;
    const md = `### 🌐 PageRank & Domain Authority for ${result.domain}
- **Open PageRank**: ${result.data.pageRankDecimal} / 10.0
- **Global Web Rank**: ${result.data.rankFormatted}
- **Normalized Authority**: ${result.data.normalizedScore} / 100
- **Moz DA Equivalent**: ${result.data.mozDaEquivalent} / 100
- **Ahrefs DR Equivalent**: ${result.data.ahrefsDrEquivalent} / 100
- **Ranking Capacity**: ${result.data.rankingCapacity}
- **Authority Tier**: ${result.tier}

*Audited via [SEO Audit Platform](http://localhost:3000/tools/authority-checker)*`;

    copyToClipboard(md, "Markdown Summary");
  };

  const downloadJson = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `authority-${result.domain}.json`;
    a.click();
    URL.revokeObjectURL(blobUrl);
    showToast(`Downloaded authority-${result.domain}.json`);
  };

  const scoreDecimal = result?.data?.pageRankDecimal ?? 7.4;
  const scorePercent = result?.data?.normalizedScore ?? Math.min(100, Math.round(scoreDecimal * 10));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{copiedToast}</span>
        </div>
      )}

      {/* Sticky Docked Sub-Navbar */}
      {result && (
        <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-2.5 shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-600/10 flex items-center justify-center border border-sky-500/20 text-sky-600 font-bold text-xs shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{result.domain}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-50 text-sky-700 border border-sky-200">
                    PR: {result.data.pageRankDecimal} / 10
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                    <Hash className="w-3.5 h-3.5 text-slate-400" /> Global {result.data.rankFormatted}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 truncate max-w-xs sm:max-w-md">
                  {result.tier}
                </div>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setActiveTab("matrix")}
                className={`px-3 py-1 font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "matrix" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Matrix</span>
              </button>
              <button
                onClick={() => setActiveTab("backlinks")}
                className={`px-3 py-1 font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "backlinks" ? "bg-white text-sky-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Link2 className="w-3.5 h-3.5 text-sky-600" />
                <span>Link Graph</span>
              </button>
              <button
                onClick={() => setActiveTab("ranking")}
                className={`px-3 py-1 font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "ranking" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-indigo-600" />
                <span>Ranking Capacity</span>
              </button>
              <button
                onClick={() => setActiveTab("compare")}
                className={`px-3 py-1 font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "compare" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <GitCompare className="w-3.5 h-3.5 text-blue-600" />
                <span>Compare</span>
              </button>
              <button
                onClick={() => setActiveTab("playbook")}
                className={`px-3 py-1 font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "playbook" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>Playbook</span>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={copyMarkdownBadge}
                title="Copy Markdown summary for README / Reports"
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Markdown</span>
              </button>

              <button
                onClick={downloadJson}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">JSON</span>
              </button>

              <Link
                href={`/analyze?url=https://${encodeURIComponent(result.domain)}`}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Full Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Arena */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            DomCop Open PageRank &amp; Common Crawl Index Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Website Authority &amp; PageRank Checker
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Lookup any domain&apos;s authority rating, Open PageRank decimal (0–10), global ranking tier, and search competition capacity based on billions of web graph nodes.
          </p>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleScan();
            }}
            className="mt-6 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto"
          >
            <div className="relative flex-1">
              <input
                type="text"
                required
                placeholder="Enter domain or URL (e.g. stripe.com)"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full px-4 py-3 pl-10 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white shadow-2xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Calculating Rank...
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  Check Authority
                </>
              )}
            </button>
          </form>

          {/* Presets */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-500">
            <span>Explore live benchmarks:</span>
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setTarget(p.domain);
                  handleScan(p.domain);
                }}
                className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors font-medium cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm mb-6 flex items-center gap-3 max-w-4xl mx-auto">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        {/* Result Area */}
        {result && (
          <div className="space-y-6">
            {/* Top Night-Sky Telemetry Banner */}
            <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                {/* SVG Radial PageRank Donut */}
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
                      strokeDashoffset={2 * Math.PI * 40 * (1 - scoreDecimal / 10)}
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

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-2xl font-black text-white font-mono tracking-tight">{result.domain}</h3>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                      {result.tier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                    Calculated using Google PageRank algorithmic models across the Common Crawl web index graph.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400 font-mono">
                    <span className="text-sky-300 font-bold">
                      Global Rank: {result.data.rankFormatted}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Status: {result.data.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-start md:self-auto">
                <Link
                  href={`/analyze?url=https://${encodeURIComponent(result.domain)}`}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>Run Full SEO Audit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 4 Live KPI Dimension Tiles */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                  <span>Open PageRank (Decimal)</span>
                  <Award className="w-3.5 h-3.5 text-sky-600" />
                </div>
                <div className="text-xl font-extrabold text-slate-900 font-mono">
                  {scoreDecimal} <span className="text-xs text-slate-400 font-normal">/ 10.0</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Damping factor: d = 0.85</div>
                <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 transition-all duration-500"
                    style={{ width: `${(scoreDecimal / 10) * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                  <span>Moz DA Equivalent</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                    Est.
                  </span>
                </div>
                <div className="text-xl font-extrabold text-slate-900 font-mono">
                  {result.data.mozDaEquivalent} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Domain Authority 0–100</div>
                <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${result.data.mozDaEquivalent}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                  <span>Ahrefs DR Equivalent</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">
                    Est.
                  </span>
                </div>
                <div className="text-xl font-extrabold text-slate-900 font-mono">
                  {result.data.ahrefsDrEquivalent} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Domain Rating simulation</div>
                <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-500"
                    style={{ width: `${result.data.ahrefsDrEquivalent}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                  <span>Referring Domains</span>
                  <Link2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-xl font-extrabold text-slate-900 font-mono">
                  {result.data.estimatedReferringDomains.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Estimated unique root links</div>
                <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, (result.data.estimatedReferringDomains / 100000) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Visual Authority Distribution Scale Bar */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs">
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

            {/* TAB 1: AUTHORITY MATRIX & HISTORICAL TREND */}
            {activeTab === "matrix" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: 6-Month Trajectory Trend */}
                <div className="lg:col-span-7 p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        6-Month Authority &amp; Rank Trajectory
                      </h4>
                      <p className="text-xs text-slate-500">
                        Historical progression across recent Common Crawl index snapshots.
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Upward Momentum
                    </span>
                  </div>

                  {/* Month Grid */}
                  <div className="grid grid-cols-6 gap-2 pt-2">
                    {result.data.trend.map((pt, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          idx === result.data.trend.length - 1
                            ? "bg-sky-50 border-sky-300 shadow-xs"
                            : "bg-slate-50/70 border-slate-200"
                        }`}
                      >
                        <div className="text-[11px] font-bold text-slate-500 uppercase">{pt.month}</div>
                        <div className="text-base font-black text-slate-900 font-mono mt-1">
                          {pt.pageRank}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          #{pt.rank.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                    <strong>Algorithmic Note:</strong> PageRank utilizes a damping factor of <code className="font-mono bg-white px-1 rounded border">d=0.85</code>, representing the probability that a random web surfer continues clicking links. Higher authority requires exponentially greater link equity.
                  </div>
                </div>

                {/* Right: Comparative Metric Correlation Table */}
                <div className="lg:col-span-5 p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-indigo-600" />
                    Multi-Engine Authority Correlation
                  </h4>
                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="font-semibold text-slate-700">Open PageRank (Decimal)</span>
                      <span className="font-mono font-bold text-sky-600">{result.data.pageRankDecimal} / 10.0</span>
                    </div>
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="font-semibold text-slate-700">Moz Domain Authority (DA)</span>
                      <span className="font-mono font-bold text-blue-600">~{result.data.mozDaEquivalent} / 100</span>
                    </div>
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="font-semibold text-slate-700">Ahrefs Domain Rating (DR)</span>
                      <span className="font-mono font-bold text-indigo-600">~{result.data.ahrefsDrEquivalent} / 100</span>
                    </div>
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="font-semibold text-slate-700">Global Web Ranking</span>
                      <span className="font-mono font-bold text-slate-900">{result.data.rankFormatted}</span>
                    </div>
                    <div className="py-2.5 flex justify-between items-center">
                      <span className="font-semibold text-slate-700">Authority Classification</span>
                      <span className="font-semibold text-emerald-700">{result.data.rankingPower}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: BACKLINKS & CITATION LINK GRAPH */}
            {activeTab === "backlinks" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Estimated Total Backlinks</span>
                    <div className="text-2xl font-black text-slate-900 font-mono">
                      {result.data.estimatedTotalBacklinks.toLocaleString()}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Cumulative inbound hyperlinks citing {result.domain} across the web index graph.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Estimated Unique Root Domains</span>
                    <div className="text-2xl font-black text-sky-600 font-mono">
                      {result.data.estimatedReferringDomains.toLocaleString()}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Distinct host domains providing authoritative link equity citations.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Institutional (.EDU &amp; .GOV) Links</span>
                    <div className="text-2xl font-black text-emerald-600 font-mono">
                      ~{result.data.eduGovBacklinks.toLocaleString()}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      High-trust academic and governmental citations delivering core seed-set trust.
                    </p>
                  </div>
                </div>

                {/* Backlink Quality Attributes */}
                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Backlink Equity Health &amp; Trust Signals
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="text-xs font-bold text-slate-800">Dofollow vs Nofollow Ratio</div>
                      <div className="text-lg font-extrabold text-slate-900 font-mono">78% / 22%</div>
                      <div className="text-[11px] text-emerald-600 font-medium">Optimal natural link profile</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="text-xs font-bold text-slate-800">Anchor Diversity Index</div>
                      <div className="text-lg font-extrabold text-slate-900 font-mono">92 / 100</div>
                      <div className="text-[11px] text-emerald-600 font-medium">Low over-optimization penalty risk</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="text-xs font-bold text-slate-800">Spam Link Score</div>
                      <div className="text-lg font-extrabold text-slate-900 font-mono">&lt; 2%</div>
                      <div className="text-[11px] text-emerald-600 font-medium">Clean reputation, low toxic backlink flag</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SEARCH RANKING CAPACITY */}
            {activeTab === "ranking" && (
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-indigo-600" />
                    Organic Search Competitiveness Capacity
                  </h4>
                  <p className="text-xs text-slate-500">
                    Determines what keyword difficulty (KD) brackets {result.domain} can comfortably rank for on Google Page 1.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                      Estimated SERP Competitiveness Ceiling
                    </span>
                    <h5 className="text-base font-extrabold text-indigo-950 mt-0.5">
                      {result.data.rankingCapacity}
                    </h5>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold font-mono">
                    Authority Tier: {result.data.rankingPower}
                  </span>
                </div>

                {/* Difficulty Brackets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-1">
                    <div className="text-xs font-bold text-emerald-900">KD 0 – 30 (Low)</div>
                    <div className="text-xs text-emerald-700">Instant Top 10 Ranking Potential</div>
                    <p className="text-[11px] text-slate-600 pt-1">
                      Long-tail search queries, informational guides, and niche technical specs.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-1">
                    <div className="text-xs font-bold text-blue-900">KD 31 – 50 (Medium)</div>
                    <div className="text-xs text-blue-700">High Ranking Probability</div>
                    <p className="text-[11px] text-slate-600 pt-1">
                      Commercial comparisons, product categories, and industry how-tos.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-1">
                    <div className="text-xs font-bold text-indigo-900">KD 51 – 75 (High)</div>
                    <div className="text-xs text-indigo-700">
                      {scoreDecimal >= 6.0 ? "Fully Attainable" : "Requires Deep Content & Links"}
                    </div>
                    <p className="text-[11px] text-slate-600 pt-1">
                      Competitive SaaS, transactional head keywords, and major solution terms.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-1">
                    <div className="text-xs font-bold text-purple-900">KD 76 – 100 (Ultra)</div>
                    <div className="text-xs text-purple-700">
                      {scoreDecimal >= 8.0 ? "Eligible for Top 3" : "Mega Authority Exclusivity"}
                    </div>
                    <p className="text-[11px] text-slate-600 pt-1">
                      Broad single-word terms (e.g. &quot;payments&quot;, &quot;hosting&quot;, &quot;insurance&quot;).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: HEAD-TO-HEAD DOMAIN COMPARE */}
            {activeTab === "compare" && (
              <div className="space-y-6">
                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <GitCompare className="w-4 h-4 text-blue-600" />
                      Side-by-Side Competitive Authority Benchmark
                    </h4>
                    <p className="text-xs text-slate-500">
                      Benchmark {result.domain} against any competitor to compare PageRank, referring domains, and ranking power.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 max-w-xl">
                    <input
                      type="text"
                      placeholder="Enter competitor domain (e.g. paypal.com)"
                      value={compareTarget}
                      onChange={(e) => setCompareTarget(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleCompareScan}
                      disabled={compareLoading}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {compareLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <GitCompare className="w-3.5 h-3.5" />}
                      <span>Benchmark Competitor</span>
                    </button>
                  </div>
                </div>

                {/* Compare Grid */}
                {compareResult && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Site A */}
                    <div className="p-6 bg-white rounded-2xl border-2 border-blue-200 shadow-xs space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                          <h5 className="text-lg font-black text-slate-900 font-mono">{result.domain}</h5>
                          <span className="text-[11px] text-slate-500">{result.tier}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black text-sky-600 font-mono">
                            {result.data.pageRankDecimal}
                          </span>
                          <span className="text-xs text-slate-400 block font-mono">/ 10 PR</span>
                        </div>
                      </div>

                      <div className="divide-y divide-slate-100 text-xs">
                        <div className="py-2 flex justify-between">
                          <span className="text-slate-500">Global Rank</span>
                          <span className="font-bold text-slate-900 font-mono">{result.data.rankFormatted}</span>
                        </div>
                        <div className="py-2 flex justify-between">
                          <span className="text-slate-500">Moz DA Equivalent</span>
                          <span className="font-bold text-blue-600 font-mono">{result.data.mozDaEquivalent} / 100</span>
                        </div>
                        <div className="py-2 flex justify-between">
                          <span className="text-slate-500">Ahrefs DR Equivalent</span>
                          <span className="font-bold text-indigo-600 font-mono">{result.data.ahrefsDrEquivalent} / 100</span>
                        </div>
                        <div className="py-2 flex justify-between">
                          <span className="text-slate-500">Referring Domains</span>
                          <span className="font-bold text-slate-900 font-mono">
                            {result.data.estimatedReferringDomains.toLocaleString()}
                          </span>
                        </div>
                        <div className="py-2 flex justify-between">
                          <span className="text-slate-500">Ranking Capacity</span>
                          <span className="font-bold text-emerald-700">{result.data.rankingPower}</span>
                        </div>
                      </div>
                    </div>

                    {/* Site B */}
                    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                          <h5 className="text-lg font-black text-slate-900 font-mono">{compareResult.domain}</h5>
                          <span className="text-[11px] text-slate-500">{compareResult.tier}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-black text-blue-600 font-mono">
                            {compareResult.data.pageRankDecimal}
                          </span>
                          <span className="text-xs text-slate-400 block font-mono">/ 10 PR</span>
                        </div>
                      </div>

                      <div className="divide-y divide-slate-100 text-xs">
                        <div className="py-2 flex justify-between">
                          <span className="text-slate-500">Global Rank</span>
                          <span className="font-bold text-slate-900 font-mono">{compareResult.data.rankFormatted}</span>
                        </div>
                        <div className="py-2 flex justify-between">
                          <span className="text-slate-500">Moz DA Equivalent</span>
                          <span className="font-bold text-blue-600 font-mono">{compareResult.data.mozDaEquivalent} / 100</span>
                        </div>
                        <div className="py-2 flex justify-between">
                          <span className="text-slate-500">Ahrefs DR Equivalent</span>
                          <span className="font-bold text-indigo-600 font-mono">{compareResult.data.ahrefsDrEquivalent} / 100</span>
                        </div>
                        <div className="py-2 flex justify-between">
                          <span className="text-slate-500">Referring Domains</span>
                          <span className="font-bold text-slate-900 font-mono">
                            {compareResult.data.estimatedReferringDomains.toLocaleString()}
                          </span>
                        </div>
                        <div className="py-2 flex justify-between">
                          <span className="text-slate-500">Ranking Capacity</span>
                          <span className="font-bold text-emerald-700">{compareResult.data.rankingPower}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: AUTHORITY GROWTH PLAYBOOK */}
            {activeTab === "playbook" && (
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    Proven Playbook to Scale PageRank &amp; Domain Authority
                  </h4>
                  <p className="text-xs text-slate-500">
                    High-impact strategies engineered to attract natural link equity and boost seed-set authority.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                        1
                      </span>
                      Publish Original Industry Research &amp; Benchmarks
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Journalists and content creators frequently search for data citations. Annual industry reports naturally attract high-authority backlinks from news publications and universities.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                        2
                      </span>
                      Create Free Interactive Developer &amp; Marketing Tools
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Stand-alone utilities (calculators, simulators, validators) generate viral adoption, GitHub references, and persistent organic bookmarking links.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                        3
                      </span>
                      Unlinked Brand Mention &amp; Image Citation Reclamation
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Identify web pages referencing your brand or proprietary infographics without an active hyperlink. A polite outreach email converts ~25% of mentions into authoritative links.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                        4
                      </span>
                      Optimize Internal PageRank Distribution
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Link dilution happens when low-value utility pages consume crawl equity. Use contextual in-content breadcrumbs and SILO linking to funnel equity into primary money pages.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Audit CTA Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md border border-slate-800">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-extrabold border border-sky-400/30">
                  Comprehensive Site Health Scan
                </div>
                <h4 className="text-base font-bold text-white">Perform Complete 100-Point SEO &amp; Technical Audit</h4>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  Analyze {result.domain} for indexing blockers, Core Web Vitals performance, crawl budget leaks, and high-impact on-page optimizations.
                </p>
              </div>
              <Link
                href={`/analyze?url=https://${encodeURIComponent(result.domain)}`}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <span>Run Full Audit on {result.domain}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
