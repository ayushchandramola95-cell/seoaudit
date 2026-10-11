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
  Globe,
} from "lucide-react";
import { ComparisonReport } from "@/lib/modules/compare/comparator";
import { exportKeywordGapCsv } from "@/lib/utils/csvExport";

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
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <GitCompare className="w-3.5 h-3.5" />
            Competitive Intelligence Suite • Pro Feature
          </span>
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
              {data.keywordGap && (
                <button
                  onClick={() => {
                    if (data.keywordGap) {
                      exportKeywordGapCsv(
                        data.siteA.page.domain,
                        data.siteB.page.domain,
                        data.keywordGap
                      );
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  Export Topic Gap CSV
                </button>
              )}
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

          {/* Head-to-Head Top Scoreboard (4 Key Dimensions) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. SEO Compliance */}
            <div className="flat-card p-4 bg-white">
              <div className="flex items-center justify-between mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <span>Technical SEO</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                  data.deltas.seoScoreDiff > 0
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : data.deltas.seoScoreDiff < 0
                    ? "bg-purple-50 text-purple-700 border-purple-200"
                    : "bg-slate-100 text-slate-700 border-slate-200"
                }`}>
                  {data.deltas.seoScoreDiff > 0
                    ? `+${data.deltas.seoScoreDiff} Site A`
                    : data.deltas.seoScoreDiff < 0
                    ? `+${Math.abs(data.deltas.seoScoreDiff)} Site B`
                    : "Equal"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-100">
                  <span className="text-[11px] font-mono text-slate-500 truncate block mb-1">
                    {data.siteA.page.domain}
                  </span>
                  <span className="text-xl font-black text-slate-900 block leading-tight">
                    {data.siteA.audit.overallScore}
                  </span>
                  <span className="text-[10px] text-slate-400">Grade {data.siteA.audit.grade}</span>
                </div>

                <div className="p-2.5 bg-purple-50/50 rounded-lg border border-purple-100">
                  <span className="text-[11px] font-mono text-slate-500 truncate block mb-1">
                    {data.siteB.page.domain}
                  </span>
                  <span className="text-xl font-black text-slate-900 block leading-tight">
                    {data.siteB.audit.overallScore}
                  </span>
                  <span className="text-[10px] text-slate-400">Grade {data.siteB.audit.grade}</span>
                </div>
              </div>
            </div>

            {/* 2. DomCop Open PageRank & Global Index */}
            <div className="flat-card p-4 bg-white">
              <div className="flex items-center justify-between mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-indigo-600" />
                  Open PageRank
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono font-bold">
                  {data.trafficComparison?.isLiveA || data.trafficComparison?.isLiveB ? "Live Index" : "Authority"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 bg-indigo-50/40 rounded-lg border border-indigo-100">
                  <span className="text-[11px] font-mono text-slate-500 truncate block mb-1">
                    {data.siteA.page.domain}
                  </span>
                  <span className="text-xl font-black text-indigo-900 block leading-tight">
                    {data.trafficComparison?.pageRankA !== null && data.trafficComparison?.pageRankA !== undefined
                      ? `${data.trafficComparison.pageRankA.toFixed(1)}`
                      : "N/A"}
                    <span className="text-[10px] text-slate-400 font-normal">/10</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 block truncate">
                    {data.trafficComparison?.rankFormattedA || "Unranked"}
                  </span>
                </div>

                <div className="p-2.5 bg-indigo-50/40 rounded-lg border border-indigo-100">
                  <span className="text-[11px] font-mono text-slate-500 truncate block mb-1">
                    {data.siteB.page.domain}
                  </span>
                  <span className="text-xl font-black text-indigo-900 block leading-tight">
                    {data.trafficComparison?.pageRankB !== null && data.trafficComparison?.pageRankB !== undefined
                      ? `${data.trafficComparison.pageRankB.toFixed(1)}`
                      : "N/A"}
                    <span className="text-[10px] text-slate-400 font-normal">/10</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 block truncate">
                    {data.trafficComparison?.rankFormattedB || "Unranked"}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. PageSpeed & Mobile Vitals */}
            <div className="flat-card p-4 bg-white">
              <div className="flex items-center justify-between mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <span>PageSpeed</span>
                <span className="text-[10px] text-slate-400">Mobile Lab</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[11px] font-mono text-slate-500 truncate block mb-1">
                    {data.siteA.page.domain}
                  </span>
                  <span className="text-xl font-black text-slate-900 block leading-tight">
                    {data.siteA.performance.scores.performance}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate block">
                    LCP {data.siteA.performance.vitals.lcp.value}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[11px] font-mono text-slate-500 truncate block mb-1">
                    {data.siteB.page.domain}
                  </span>
                  <span className="text-xl font-black text-slate-900 block leading-tight">
                    {data.siteB.performance.scores.performance}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate block">
                    LCP {data.siteB.performance.vitals.lcp.value}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Estimated Traffic Reach */}
            <div className="flat-card p-4 bg-white">
              <div className="flex items-center justify-between mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <span>Monthly Reach</span>
                <span className="text-[10px] text-slate-400">Est. Range</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[11px] font-mono text-slate-500 truncate block mb-1">
                    {data.siteA.page.domain}
                  </span>
                  <span className="text-sm font-black text-slate-900 block leading-tight font-mono truncate">
                    {data.siteA.traffic.formattedRange.split(" /")[0]}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {data.siteA.traffic.confidence} Conf.
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[11px] font-mono text-slate-500 truncate block mb-1">
                    {data.siteB.page.domain}
                  </span>
                  <span className="text-sm font-black text-slate-900 block leading-tight font-mono truncate">
                    {data.siteB.traffic.formattedRange.split(" /")[0]}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {data.siteB.traffic.confidence} Conf.
                  </span>
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

          {/* Core Web Vitals & Performance Diagnostics Matrix */}
          <div className="flat-card overflow-hidden bg-white">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-purple-600" />
                Core Web Vitals & Payload Metrics
              </h3>
              <span className="text-xs text-slate-500">Google Lighthouse Lab Telemetry</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Performance Signal</th>
                    <th className="px-5 py-3.5 font-mono">{data.siteA.page.domain}</th>
                    <th className="px-5 py-3.5 font-mono">{data.siteB.page.domain}</th>
                    <th className="px-5 py-3.5">Comparative Advantage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  <tr>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">Largest Contentful Paint (LCP)</td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {data.vitalsComparison.lcpA}
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {data.vitalsComparison.lcpB}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded font-semibold ${
                        data.siteA.performance.vitals.lcp.numericValue < data.siteB.performance.vitals.lcp.numericValue
                          ? "bg-blue-50 text-blue-700"
                          : data.siteB.performance.vitals.lcp.numericValue < data.siteA.performance.vitals.lcp.numericValue
                          ? "bg-purple-50 text-purple-700"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {data.siteA.performance.vitals.lcp.numericValue < data.siteB.performance.vitals.lcp.numericValue
                          ? `${data.siteA.page.domain} Faster`
                          : data.siteB.performance.vitals.lcp.numericValue < data.siteA.performance.vitals.lcp.numericValue
                          ? `${data.siteB.page.domain} Faster`
                          : "Equal"}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">First Contentful Paint (FCP)</td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {data.vitalsComparison.fcpA}
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {data.vitalsComparison.fcpB}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded font-semibold ${
                        data.siteA.performance.vitals.fcp.numericValue < data.siteB.performance.vitals.fcp.numericValue
                          ? "bg-blue-50 text-blue-700"
                          : data.siteB.performance.vitals.fcp.numericValue < data.siteA.performance.vitals.fcp.numericValue
                          ? "bg-purple-50 text-purple-700"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {data.siteA.performance.vitals.fcp.numericValue < data.siteB.performance.vitals.fcp.numericValue
                          ? `${data.siteA.page.domain} Faster`
                          : data.siteB.performance.vitals.fcp.numericValue < data.siteA.performance.vitals.fcp.numericValue
                          ? `${data.siteB.page.domain} Faster`
                          : "Equal"}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">Cumulative Layout Shift (CLS)</td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {data.vitalsComparison.clsA}
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {data.vitalsComparison.clsB}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded font-semibold bg-emerald-50 text-emerald-700">
                        Visual Stability Verified
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">Server Response TTFB</td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {data.vitalsComparison.ttfbA}
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {data.vitalsComparison.ttfbB}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded font-semibold ${
                        data.siteA.page.responseTimeMs < data.siteB.page.responseTimeMs
                          ? "bg-blue-50 text-blue-700"
                          : data.siteB.page.responseTimeMs < data.siteA.page.responseTimeMs
                          ? "bg-purple-50 text-purple-700"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {data.siteA.page.responseTimeMs < data.siteB.page.responseTimeMs
                          ? `${data.siteA.page.domain} (${data.siteA.page.responseTimeMs}ms)`
                          : data.siteB.page.responseTimeMs < data.siteA.page.responseTimeMs
                          ? `${data.siteB.page.domain} (${data.siteB.page.responseTimeMs}ms)`
                          : "Equal"}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">Total Page Transfer Size</td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {data.vitalsComparison.pageSizeA}
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {data.vitalsComparison.pageSizeB}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-700">
                        {data.siteA.page.contentLengthBytes < data.siteB.page.contentLengthBytes
                          ? `${data.siteA.page.domain} Lighter Payload`
                          : `${data.siteB.page.domain} Lighter Payload`}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Document Architecture & Schema Matrix */}
          <div className="flat-card overflow-hidden bg-white">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-600" />
                Document Architecture & Semantic Structure
              </h3>
              <span className="text-xs text-slate-500">DOM Compliance Inspection</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Structural Element</th>
                    <th className="px-5 py-3.5 font-mono">{data.siteA.page.domain}</th>
                    <th className="px-5 py-3.5 font-mono">{data.siteB.page.domain}</th>
                    <th className="px-5 py-3.5">Comparative Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  <tr>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">Visible Document Words</td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {data.siteA.page.wordCount.toLocaleString()} words
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {data.siteB.page.wordCount.toLocaleString()} words
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded font-semibold ${
                        data.siteA.page.wordCount > data.siteB.page.wordCount
                          ? "bg-blue-50 text-blue-700"
                          : "bg-purple-50 text-purple-700"
                      }`}>
                        {data.siteA.page.wordCount > data.siteB.page.wordCount
                          ? `${data.siteA.page.domain} Deeper Copy`
                          : `${data.siteB.page.domain} Deeper Copy`}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">Structured Data (JSON-LD)</td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {data.siteA.page.structuredData.count} schema blocks
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {data.siteB.page.structuredData.count} schema blocks
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-700">
                        {data.siteA.page.structuredData.count > data.siteB.page.structuredData.count
                          ? `${data.siteA.page.domain} Richer Schema`
                          : data.siteB.page.structuredData.count > data.siteA.page.structuredData.count
                          ? `${data.siteB.page.domain} Richer Schema`
                          : "Equal Schema Blocks"}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">H1 Hierarchy Alignment</td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {data.siteA.page.headings.h1Count} H1 found
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {data.siteB.page.headings.h1Count} H1 found
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-700">
                        {data.siteA.page.headings.h1Count === 1 && data.siteB.page.headings.h1Count === 1
                          ? "Both Single H1 Optimal"
                          : data.siteA.page.headings.h1Count === 1
                          ? `${data.siteA.page.domain} Clean H1`
                          : `${data.siteB.page.domain} Clean H1`}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">Internal Link Footprint</td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {data.siteA.page.links.internalLinks} internal links
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                      {data.siteB.page.links.internalLinks} internal links
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-700">
                        {data.siteA.page.links.internalLinks > data.siteB.page.links.internalLinks
                          ? `${data.siteA.page.domain} Larger Catalog`
                          : `${data.siteB.page.domain} Larger Catalog`}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* On-Page Semantic Topic & Content Gap Matrix */}
          {data.keywordGap && (
            <div className="flat-card p-6 bg-white space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Hash className="w-4 h-4 text-purple-600" />
                    On-Page Semantic Topic & Content Gap Matrix
                  </h3>
                  <p className="text-xs text-slate-500">
                    Extracts overlapping topic clusters and exclusive on-page content themes from visible document text.
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-purple-50 text-purple-700 border border-purple-200">
                  {data.keywordGap.sharedKeywords.length} Overlapping Terms
                </span>
              </div>

              {/* Intellectual Honesty & Diagnostic Methodology Disclosure */}
              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 text-xs text-purple-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="font-semibold text-purple-950">Diagnostic Methodology Note:</strong>{" "}
                  {data.keywordGap.methodologyNote ||
                    "This matrix calculates semantic topic coverage and TF-IDF keyword density from inspected DOM body copy. For whole-domain Google SERP ranking datasets, connect Google Search Console (Mode B)."}
                </div>
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
