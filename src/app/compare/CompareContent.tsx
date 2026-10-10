"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  GitCompare, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Download, 
  Layers, 
  Zap, 
  TrendingUp, 
  ExternalLink,
  Brain,
  Gauge,
  Sparkles,
  Trophy,
  Scale,
  Share2,
  Printer,
  Copy,
  Check,
  Hash,
  BookOpen,
} from "lucide-react";
import { ComparisonReport } from "@/lib/modules/compare/comparator";

interface ApiResponse {
  success: boolean;
  id?: string;
  timestamp: string;
  comparison: ComparisonReport;
  error?: string;
  errorType?: string;
  details?: string;
}

export default function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paramSiteA = searchParams.get("siteA") || "";
  const paramSiteB = searchParams.get("siteB") || "";

  const [inputA, setInputA] = useState(paramSiteA);
  const [inputB, setInputB] = useState(paramSiteB);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ComparisonReport | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const samplePairs = [
    { a: "github.com", b: "gitlab.com" },
    { a: "vercel.com", b: "netlify.com" },
    { a: "stripe.com", b: "paypal.com" },
  ];

  const handleCopyShare = () => {
    if (reportId) {
      const shareUrl = `${window.location.origin}/report/${reportId}`;
      navigator.clipboard.writeText(shareUrl);
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const fetchComparison = async (urlA: string, urlB: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(
        `/api/compare?siteA=${encodeURIComponent(urlA)}&siteB=${encodeURIComponent(urlB)}`
      );
      const result: ApiResponse = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || result.details || "Failed to compare target websites.");
      }

      setData(result.comparison);
      if (result.id) setReportId(result.id);
    } catch (err: unknown) {
      setError((err as Error).message || "An unexpected error occurred during comparison.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paramSiteA && paramSiteB) {
      setInputA(paramSiteA);
      setInputB(paramSiteB);
      fetchComparison(paramSiteA, paramSiteB);
    }
  }, [paramSiteA, paramSiteB]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputA.trim() || !inputB.trim()) {
      setError("Please specify both Website A and Website B.");
      return;
    }
    router.push(`/compare?siteA=${encodeURIComponent(inputA.trim())}&siteB=${encodeURIComponent(inputB.trim())}`);
  };

  const handleSwap = () => {
    const temp = inputA;
    setInputA(inputB);
    setInputB(temp);
    if (inputA && inputB) {
      router.push(`/compare?siteA=${encodeURIComponent(inputB)}&siteB=${encodeURIComponent(inputA)}`);
    }
  };

  const handleExportJson = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seoseite-comparison-${data.siteA.page.domain}-vs-${data.siteB.page.domain}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top back button & action header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Homepage
        </Link>

        {data && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleSwap}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" />
              Swap Sites
            </button>
            <button
              onClick={() => fetchComparison(inputA, inputB)}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Re-run
            </button>
            <button
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export JSON
            </button>
          </div>
        )}
      </div>

      {/* Comparison Input Form Header */}
      <div className="border-b border-slate-200 pb-8 mb-8 text-center max-w-3xl mx-auto">
        <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center mx-auto mb-3">
          <GitCompare className="w-5 h-5" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          Competitor Website Comparison
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          Benchmark two domains side-by-side across technical SEO health, Core Web Vitals speed, technology stacks, and traffic models.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div className="p-2 bg-white border-2 border-slate-300 rounded-xl focus-within:border-blue-600 transition-colors">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-2">
                Website A (Primary)
              </span>
              <input
                type="text"
                value={inputA}
                onChange={(e) => setInputA(e.target.value)}
                placeholder="e.g. github.com"
                className="w-full px-2 py-1 bg-transparent text-sm font-semibold text-slate-900 outline-none font-mono"
              />
            </div>

            <div className="p-2 bg-white border-2 border-slate-300 rounded-xl focus-within:border-purple-600 transition-colors">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-2">
                Website B (Competitor)
              </span>
              <input
                type="text"
                value={inputB}
                onChange={(e) => setInputB(e.target.value)}
                placeholder="e.g. gitlab.com"
                className="w-full px-2 py-1 bg-transparent text-sm font-semibold text-slate-900 outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-8 py-3 rounded-xl transition-colors cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Comparing Both Sites...
                </>
              ) : (
                <>
                  Compare Websites
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick sample comparison buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-500">
          <span className="font-medium text-slate-400">Quick test:</span>
          {samplePairs.map((pair, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInputA(pair.a);
                setInputB(pair.b);
                router.push(`/compare?siteA=${encodeURIComponent(pair.a)}&siteB=${encodeURIComponent(pair.b)}`);
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-mono text-[11px] transition-colors border border-slate-200 cursor-pointer"
            >
              {pair.a} vs {pair.b}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flat-card p-12 text-center max-w-xl mx-auto my-12 bg-white">
          <div className="w-12 h-12 rounded-full border-2 border-purple-600 border-t-transparent animate-spin mx-auto mb-5" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Running Dual Real-Time Scans
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            Executing parallel Cheerio DOM scraping, SSRF validation, stack fingerprinting, and Google PageSpeed audits for both targets...
          </p>

          <div className="space-y-2 text-left max-w-xs mx-auto text-xs text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Scanning {inputA || "Site A"}
            </div>
            <div className="flex items-center gap-2 text-purple-700 font-medium">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-600" />
              Scanning {inputB || "Site B"}
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block" />
              Calculating comparative deltas
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="flat-card p-8 border-rose-200 bg-rose-50/40 max-w-2xl mx-auto my-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Comparison Failed
              </h3>
              <p className="text-xs text-rose-700 font-mono bg-white/70 p-2.5 rounded border border-rose-200 mb-3">
                {error}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ensure both URLs point to publicly accessible websites and do not resolve to internal or private subnets.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Active comparison view */}
      {data && !loading && (
        <div className="space-y-8">
          {/* Action Bar */}
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex-wrap gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Head-to-Head Comparative Snapshot</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
              >
                {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-600" />}
                {copiedShare ? "Link Copied!" : "Share Benchmark"}
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                Print / PDF
              </button>
            </div>
          </div>

          {/* Executive AI Comparison Summary Banner */}
          <div className="flat-card p-6 bg-white border-purple-200">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  {data.aiComparativeSummary.headline}
                </h2>
              </div>
              <span className="flat-badge bg-purple-50 text-purple-700 border-purple-200 font-semibold">
                Evidence-Based Analysis
              </span>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed bg-purple-50/40 p-4 rounded-xl border border-purple-100 mb-6">
              {data.aiComparativeSummary.overview}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5 font-mono">
                  <span>{data.siteA.page.domain}</span>
                  <span className="text-blue-600 font-sans font-semibold">Advantages</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {data.aiComparativeSummary.strengthsSiteA.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5 font-mono">
                  <span>{data.siteB.page.domain}</span>
                  <span className="text-purple-600 font-sans font-semibold">Advantages</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {data.aiComparativeSummary.strengthsSiteB.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-xs text-slate-500 italic">
              {data.aiComparativeSummary.conclusion}
            </p>
          </div>

          {/* Head-to-Head Top Scoreboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* SEO Score Head-to-Head */}
            <div className="flat-card p-5 bg-white">
              <div className="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                <span>Technical SEO Score</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                  data.deltas.seoScoreDiff > 0
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : data.deltas.seoScoreDiff < 0
                    ? "bg-purple-50 text-purple-700 border-purple-200"
                    : "bg-slate-100 text-slate-700 border-slate-200"
                }`}>
                  {data.deltas.seoScoreDiff > 0
                    ? `+${data.deltas.seoScoreDiff} to Site A`
                    : data.deltas.seoScoreDiff < 0
                    ? `+${Math.abs(data.deltas.seoScoreDiff)} to Site B`
                    : "Equal Score"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                  <span className="text-[11px] font-mono text-slate-500 truncate block mb-1">
                    {data.siteA.page.domain}
                  </span>
                  <span className="text-2xl font-black text-slate-900 block leading-tight">
                    {data.siteA.audit.overallScore}
                  </span>
                  <span className="text-[10px] text-slate-400">Grade {data.siteA.audit.grade}</span>
                </div>

                <div className="p-3 bg-purple-50/50 rounded-lg border border-purple-100">
                  <span className="text-[11px] font-mono text-slate-500 truncate block mb-1">
                    {data.siteB.page.domain}
                  </span>
                  <span className="text-2xl font-black text-slate-900 block leading-tight">
                    {data.siteB.audit.overallScore}
                  </span>
                  <span className="text-[10px] text-slate-400">Grade {data.siteB.audit.grade}</span>
                </div>
              </div>
            </div>

            {/* Performance Score Head-to-Head */}
            <div className="flat-card p-5 bg-white">
              <div className="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                <span>PageSpeed Rating</span>
                <span className="text-[10px] text-slate-400">Lighthouse Mobile</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[11px] font-mono text-slate-500 truncate block mb-1">
                    {data.siteA.page.domain}
                  </span>
                  <span className="text-2xl font-black text-slate-900 block leading-tight">
                    {data.siteA.performance.scores.performance}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    LCP {data.siteA.performance.vitals.lcp.value}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[11px] font-mono text-slate-500 truncate block mb-1">
                    {data.siteB.page.domain}
                  </span>
                  <span className="text-2xl font-black text-slate-900 block leading-tight">
                    {data.siteB.performance.scores.performance}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    LCP {data.siteB.performance.vitals.lcp.value}
                  </span>
                </div>
              </div>
            </div>

            {/* Estimated Traffic Head-to-Head */}
            <div className="flat-card p-5 bg-white">
              <div className="flex items-center justify-between mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                <span>Est. Monthly Reach</span>
                <span className="text-[10px] text-slate-400">Statistical Model</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[11px] font-mono text-slate-500 truncate block mb-1">
                    {data.siteA.page.domain}
                  </span>
                  <span className="text-base font-black text-slate-900 block leading-tight font-mono">
                    {data.siteA.traffic.formattedRange.split(" /")[0]}
                  </span>
                  <span className="text-[10px] text-slate-500">{data.siteA.traffic.confidence} Conf.</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[11px] font-mono text-slate-500 truncate block mb-1">
                    {data.siteB.page.domain}
                  </span>
                  <span className="text-base font-black text-slate-900 block leading-tight font-mono">
                    {data.siteB.traffic.formattedRange.split(" /")[0]}
                  </span>
                  <span className="text-[10px] text-slate-500">{data.siteB.traffic.confidence} Conf.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category Breakdown Comparison Table */}
          <div className="flat-card overflow-hidden bg-white">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Diagnostic Category Breakdown Matrix
              </h3>
              <span className="text-xs text-slate-500">Scores out of 25 maximum per category</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5 font-mono">{data.siteA.page.domain}</th>
                    <th className="px-5 py-3.5 font-mono">{data.siteB.page.domain}</th>
                    <th className="px-5 py-3.5">Category Leader</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  <tr>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">Metadata & Tags</td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {data.siteA.audit.categories.metadata.score} / 25
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {data.siteB.audit.categories.metadata.score} / 25
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded font-semibold ${
                        data.categoryWinners.metadata === "siteA"
                          ? "bg-blue-50 text-blue-700"
                          : data.categoryWinners.metadata === "siteB"
                          ? "bg-purple-50 text-purple-700"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {data.categoryWinners.metadata === "siteA"
                          ? data.siteA.page.domain
                          : data.categoryWinners.metadata === "siteB"
                          ? data.siteB.page.domain
                          : "Tied"}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">Content & Structure</td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {data.siteA.audit.categories.content.score} / 25
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {data.siteB.audit.categories.content.score} / 25
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded font-semibold ${
                        data.categoryWinners.content === "siteA"
                          ? "bg-blue-50 text-blue-700"
                          : data.categoryWinners.content === "siteB"
                          ? "bg-purple-50 text-purple-700"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {data.categoryWinners.content === "siteA"
                          ? data.siteA.page.domain
                          : data.categoryWinners.content === "siteB"
                          ? data.siteB.page.domain
                          : "Tied"}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">Indexability Signals</td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {data.siteA.audit.categories.indexability.score} / 25
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {data.siteB.audit.categories.indexability.score} / 25
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded font-semibold ${
                        data.categoryWinners.indexability === "siteA"
                          ? "bg-blue-50 text-blue-700"
                          : data.categoryWinners.indexability === "siteB"
                          ? "bg-purple-50 text-purple-700"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {data.categoryWinners.indexability === "siteA"
                          ? data.siteA.page.domain
                          : data.categoryWinners.indexability === "siteB"
                          ? data.siteB.page.domain
                          : "Tied"}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">Security & Standards</td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {data.siteA.audit.categories.security.score} / 25
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {data.siteB.audit.categories.security.score} / 25
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded font-semibold ${
                        data.categoryWinners.security === "siteA"
                          ? "bg-blue-50 text-blue-700"
                          : data.categoryWinners.security === "siteB"
                          ? "bg-purple-50 text-purple-700"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {data.categoryWinners.security === "siteA"
                          ? data.siteA.page.domain
                          : data.categoryWinners.security === "siteB"
                          ? data.siteB.page.domain
                          : "Tied"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Technology Stack Comparison Matrix */}
          <div className="flat-card p-6 bg-white">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-purple-600" />
              Technology Stack Cross-Comparison
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Shared Tech */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Shared Stack Components ({data.techComparison.shared.length})
                </span>
                {data.techComparison.shared.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {data.techComparison.shared.map((t, idx) => (
                      <span key={idx} className="flat-badge bg-emerald-50 text-emerald-700 border-emerald-200">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">No shared frameworks or CDNs detected.</span>
                )}
              </div>

              {/* Unique to Site A */}
              <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 block mb-2 font-mono">
                  Only on {data.siteA.page.domain} ({data.techComparison.uniqueToA.length})
                </span>
                {data.techComparison.uniqueToA.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {data.techComparison.uniqueToA.map((t, idx) => (
                      <span key={idx} className="flat-badge bg-blue-50 text-blue-700 border-blue-200">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">None unique.</span>
                )}
              </div>

              {/* Unique to Site B */}
              <div className="p-4 bg-purple-50/40 rounded-xl border border-purple-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900 block mb-2 font-mono">
                  Only on {data.siteB.page.domain} ({data.techComparison.uniqueToB.length})
                </span>
                {data.techComparison.uniqueToB.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {data.techComparison.uniqueToB.map((t, idx) => (
                      <span key={idx} className="flat-badge bg-purple-50 text-purple-700 border-purple-200">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">None unique.</span>
                )}
              </div>
            </div>
          </div>

          {/* Keyword Content Gap Matrix */}
          {data.keywordGap && (
            <div className="flat-card p-6 bg-white space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Hash className="w-4 h-4 text-purple-600" />
                    Competitor Keyword Content Gap Matrix
                  </h3>
                  <p className="text-xs text-slate-500">
                    Reveals shared keyword territory and exclusive topical keywords each competitor owns.
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-purple-50 text-purple-700 border border-purple-200">
                  {data.keywordGap.sharedKeywords.length} Overlapping Terms
                </span>
              </div>

              {/* 3 Columns: Unique to A, Overlap, Unique to B */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Column 1: Unique to Site A */}
                <div className="p-4 bg-blue-50/30 rounded-xl border border-blue-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 font-mono truncate max-w-[150px]">
                      {data.siteA.page.domain} Exclusives
                    </span>
                    <span className="text-[10px] font-mono text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                      +{data.keywordGap.uniqueToA.length} terms
                    </span>
                  </div>

                  {data.keywordGap.uniqueToA.length > 0 ? (
                    <div className="space-y-1.5">
                      {data.keywordGap.uniqueToA.map((kw, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded bg-white border border-blue-100 text-xs font-mono"
                        >
                          <span className="font-semibold text-slate-800">{kw.phrase}</span>
                          <span className="text-blue-700 font-bold">{kw.density.toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No exclusive keywords detected.</p>
                  )}
                </div>

                {/* Column 2: Direct Shared Overlap */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                      Head-to-Head Overlap
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">
                      {data.keywordGap.topOverlapKeywords.length} matched
                    </span>
                  </div>

                  {data.keywordGap.topOverlapKeywords.length > 0 ? (
                    <div className="space-y-1.5">
                      {data.keywordGap.topOverlapKeywords.map((kw, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded bg-white border border-slate-200 text-xs font-mono"
                        >
                          <span className="font-semibold text-slate-900">{kw.phrase}</span>
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <span className="text-blue-700 font-bold">{kw.countA}×</span>
                            <span className="text-slate-300">vs</span>
                            <span className="text-purple-700 font-bold">{kw.countB}×</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Zero keyword overlap between sites.</p>
                  )}
                </div>

                {/* Column 3: Unique to Site B */}
                <div className="p-4 bg-purple-50/30 rounded-xl border border-purple-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900 font-mono truncate max-w-[150px]">
                      {data.siteB.page.domain} Exclusives
                    </span>
                    <span className="text-[10px] font-mono text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded">
                      +{data.keywordGap.uniqueToB.length} terms
                    </span>
                  </div>

                  {data.keywordGap.uniqueToB.length > 0 ? (
                    <div className="space-y-1.5">
                      {data.keywordGap.uniqueToB.map((kw, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded bg-white border border-purple-100 text-xs font-mono"
                        >
                          <span className="font-semibold text-slate-800">{kw.phrase}</span>
                          <span className="text-purple-700 font-bold">{kw.density.toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No exclusive keywords detected.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
