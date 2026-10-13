"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ListChecks,
  ArrowLeft,
  Sparkles,
  Download,
  Play,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSpreadsheet,
  Clock,
  Globe,
  Layers,
  Search,
} from "lucide-react";
import { usePlan } from "@/lib/auth/PlanContext";
import { formatTierName } from "@/lib/auth/tierLimits";

interface BatchItemResult {
  success: boolean;
  url: string;
  domain: string;
  httpStatus: number;
  seoScore: number;
  grade: string;
  responseTimeMs: number;
  wordCount: number;
  techCount: number;
  pageRank: number | null;
  globalRank: string;
  isHttps: boolean;
  criticalIssue: string | null;
  passedChecks: number;
  totalChecks: number;
}

const PRESET_BATCHES = [
  {
    name: "Developer Cloud",
    urls: "https://stripe.com\nhttps://vercel.com\nhttps://supabase.com",
  },
  {
    name: "Modern Productivity",
    urls: "https://linear.app\nhttps://notion.so\nhttps://figma.com",
  },
  {
    name: "E-Commerce Leaders",
    urls: "https://shopify.com\nhttps://woocommerce.com\nhttps://bigcommerce.com",
  },
];

const DEMO_BATCH_RESULTS: BatchItemResult[] = [
  {
    success: true,
    url: "https://stripe.com",
    domain: "stripe.com",
    httpStatus: 200,
    seoScore: 98,
    grade: "Grade A+",
    responseTimeMs: 68,
    wordCount: 2480,
    techCount: 14,
    pageRank: 9.6,
    globalRank: "Top 0.001%",
    isHttps: true,
    criticalIssue: null,
    passedChecks: 22,
    totalChecks: 22,
  },
  {
    success: true,
    url: "https://vercel.com",
    domain: "vercel.com",
    httpStatus: 200,
    seoScore: 96,
    grade: "Grade A",
    responseTimeMs: 74,
    wordCount: 1950,
    techCount: 12,
    pageRank: 8.8,
    globalRank: "Top 0.01%",
    isHttps: true,
    criticalIssue: null,
    passedChecks: 21,
    totalChecks: 22,
  },
  {
    success: true,
    url: "https://supabase.com",
    domain: "supabase.com",
    httpStatus: 200,
    seoScore: 94,
    grade: "Grade A",
    responseTimeMs: 82,
    wordCount: 2210,
    techCount: 11,
    pageRank: 8.2,
    globalRank: "Top 0.01%",
    isHttps: true,
    criticalIssue: null,
    passedChecks: 20,
    totalChecks: 22,
  },
];

export default function BatchAuditClient() {
  const { tier, triggerUpgradeModal } = usePlan();
  const [urlsInput, setUrlsInput] = useState(PRESET_BATCHES[0].urls);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BatchItemResult[] | null>(DEMO_BATCH_RESULTS);
  const [error, setError] = useState<string | null>(null);
  const [scoreFilter, setScoreFilter] = useState<"all" | "high" | "low">("all");

  const parsedUrlCount = urlsInput
    .split("\n")
    .map((u) => u.trim())
    .filter((u) => u.length > 0).length;

  const handleRunBatch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUrls = urlsInput
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (cleanUrls.length === 0) {
      setError("Please enter at least one URL to audit.");
      return;
    }

    if (cleanUrls.length > 3 && tier === "free") {
      triggerUpgradeModal({
        requiredTier: "pro",
        featureTitle: "Multi-URL Batch Audit (Up to 15 URLs)",
        description:
          "Free tier allows testing up to 3 URLs concurrently. Upgrade to Pro Analyst to run up to 15 bulk audits at once and export master spreadsheets.",
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tools/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: cleanUrls }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to execute batch audit.");
      }

      setResults(json.results);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = () => {
    if (!results) return;
    const headers = [
      "Domain",
      "URL",
      "HTTP Status",
      "SEO Score",
      "Grade",
      "Response Time (ms)",
      "Word Count",
      "Tech Count",
      "Open PageRank",
      "Global Rank",
      "Top Issue",
    ];

    const rows = results.map((r) => [
      r.domain,
      r.url,
      r.httpStatus,
      r.seoScore,
      r.grade,
      r.responseTimeMs,
      r.wordCount,
      r.techCount,
      r.pageRank !== null ? r.pageRank : "N/A",
      r.globalRank,
      r.criticalIssue || "None",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.map((val) => `"${val}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `seoseite-batch-audit-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredResults = results
    ? results.filter((r) => {
        if (scoreFilter === "high") return r.seoScore >= 80;
        if (scoreFilter === "low") return r.seoScore < 80;
        return true;
      })
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Status */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Tools Hub
        </Link>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-700">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="font-bold">{formatTierName(tier)}</span>
          </div>
          {tier === "free" && (
            <button
              onClick={() =>
                triggerUpgradeModal({
                  requiredTier: "pro",
                  featureTitle: "Unlimited Bulk Batch Audits",
                  description:
                    "Audit up to 15 domains simultaneously, export spreadsheet reports, and automate client crawls.",
                })
              }
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[11px] font-bold shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3 h-3" /> Upgrade
            </button>
          )}
        </div>
      </div>

      {/* Hero Header */}
      <div className="flat-card p-6 sm:p-8 bg-white border-blue-200 text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-xs">
          <ListChecks className="w-3.5 h-3.5" />
          <span>Ahrefs Batch Analysis Alternative</span>
          <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-bold">
            Bulk Engine
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Multi-URL Batch SEO Auditor
        </h1>

        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Audit multiple websites simultaneously. Compare 0–100 technical SEO scores, response times, technology stack counts, and Open PageRank in a single unified table.
        </p>

        {/* Preset Samples */}
        <div className="pt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Load Preset URL Batches:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {PRESET_BATCHES.map((b, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setUrlsInput(b.urls)}
                className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleRunBatch} className="flat-card p-6 sm:p-8 bg-white border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <span>Target URLs (One per line)</span>
            <span className="text-rose-500">*</span>
          </label>
          <span className="text-xs font-mono text-slate-500">
            {parsedUrlCount} {parsedUrlCount === 1 ? "URL" : "URLs"} entered (Max 15)
          </span>
        </div>

        <textarea
          rows={5}
          value={urlsInput}
          onChange={(e) => setUrlsInput(e.target.value)}
          placeholder="https://example1.com&#10;https://example2.com&#10;https://example3.com"
          required
          className="w-full p-4 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all leading-relaxed"
        />

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
            <XCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Auditing URLs Concurrently...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                Run Batch Analysis ({parsedUrlCount})
              </>
            )}
          </button>

          {results && (
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              Export Batch CSV
            </button>
          )}
        </div>
      </form>

      {/* RESULTS TABLE */}
      {results && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          {/* Batch Summary KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-2xs text-left">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Average Health</div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                {Math.round(results.reduce((acc, r) => acc + r.seoScore, 0) / (results.length || 1))} / 100
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1">Grade A Batch Average</div>
            </div>

            <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-2xs text-left">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Fastest Latency</div>
              <div className="text-2xl font-black text-emerald-600 font-mono">
                {Math.min(...results.map((r) => r.responseTimeMs))} ms
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Sub-second response</div>
            </div>

            <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-2xs text-left">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Stacks Detected</div>
              <div className="text-2xl font-black text-purple-600 font-mono">
                {results.reduce((acc, r) => acc + r.techCount, 0)}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Frameworks &amp; CDNs</div>
            </div>

            <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-2xs text-left">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Top-Tier Passing</div>
              <div className="text-2xl font-black text-blue-600 font-mono">
                {results.filter((r) => r.seoScore >= 90).length} / {results.length}
              </div>
              <div className="text-[10px] text-blue-600 font-semibold mt-1">Score ≥ 90/100</div>
            </div>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Batch Audit Results ({results.length} Domains)
              </h3>
              <p className="text-xs text-slate-500">
                Deterministic technical metrics and Open PageRank comparison.
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setScoreFilter("all")}
                className={`px-3 py-1 rounded font-bold transition-colors cursor-pointer ${
                  scoreFilter === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All ({results.length})
              </button>
              <button
                onClick={() => setScoreFilter("high")}
                className={`px-3 py-1 rounded font-bold transition-colors cursor-pointer ${
                  scoreFilter === "high" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Score ≥ 80
              </button>
              <button
                onClick={() => setScoreFilter("low")}
                className={`px-3 py-1 rounded font-bold transition-colors cursor-pointer ${
                  scoreFilter === "low" ? "bg-white text-rose-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Score &lt; 80
              </button>
            </div>
          </div>

          <div className="flat-card bg-white border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Domain</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-center">SEO Score</th>
                    <th className="py-3 px-3 text-center">Grade</th>
                    <th className="py-3 px-3 text-center">Latency</th>
                    <th className="py-3 px-3 text-center">Techs</th>
                    <th className="py-3 px-3 text-center">Open PageRank</th>
                    <th className="py-3 px-4">Top Audit Finding</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredResults.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 font-mono text-xs">{item.domain}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[180px] font-mono">
                          {item.url}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            item.httpStatus === 200
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {item.httpStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono">
                        <span
                          className={`text-sm font-black ${
                            item.seoScore >= 80
                              ? "text-emerald-600"
                              : item.seoScore >= 60
                              ? "text-blue-600"
                              : "text-amber-600"
                          }`}
                        >
                          {item.seoScore}
                        </span>
                        <span className="text-[10px] text-slate-400">/100</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded ${
                            item.grade === "A+" || item.grade === "A"
                              ? "bg-emerald-50 text-emerald-700"
                              : item.grade === "B"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {item.grade}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-600 text-[11px]">
                        {item.responseTimeMs} ms
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-700">
                        {item.techCount}
                      </td>
                      <td className="py-3 px-3 text-center font-mono">
                        <span className="font-bold text-blue-600">
                          {item.pageRank !== null ? item.pageRank : "—"}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-normal">
                          {item.globalRank}
                        </span>
                      </td>
                      <td className="py-3 px-4 max-w-xs text-[11px] text-slate-600 truncate">
                        {item.criticalIssue ? (
                          <span className="text-amber-700 flex items-center gap-1 truncate">
                            <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
                            {item.criticalIssue}
                          </span>
                        ) : (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                            No Critical Violations
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href={`/analyze?url=${encodeURIComponent(item.url)}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] font-bold transition-colors"
                        >
                          Audit <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
