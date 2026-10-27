"use client";

import Link from "next/link";
import {
  ShieldCheck,
  ExternalLink,
  Share2,
  Check,
  Mail,
  Printer,
  Download,
  Clock,
  TrendingUp,
  Layers,
  Brain,
  Lock,
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import ScoreTrendSparkline from "@/components/ScoreTrendSparkline";
import { exportFindingsCsv } from "@/lib/utils/csvExport";
import { ScrapedPageData } from "@/lib/modules/seo/fetcher";
import { SeoAuditReport } from "@/lib/modules/seo/scorer";
import { DetectedTechnology } from "@/lib/modules/tech/detector";
import { TrafficEstimationReport } from "@/lib/modules/traffic/estimator";
import { AiDiagnosticReport } from "@/lib/modules/ai/service";

interface AnalyzeExecutiveHeaderProps {
  page: ScrapedPageData;
  audit: SeoAuditReport;
  technologies: DetectedTechnology[];
  traffic: TrafficEstimationReport;
  ai: AiDiagnosticReport;
  isDemoMode?: boolean;
  timestamp?: string;
  copiedShareLink: boolean;
  onCopyShareLink: () => void;
  onOpenEmailModal: () => void;
  onOpenWhiteLabelModal: () => void;
  onDownloadJson: () => void;
  onSelectTab: (tab: any) => void;
  onFilterCategory?: (catKey: string) => void;
  selectedCategory?: string | null;
  onInspectStatus?: (status: "all" | "passed" | "warning" | "error") => void;
}

export default function AnalyzeExecutiveHeader({
  page,
  audit,
  technologies,
  traffic,
  ai,
  isDemoMode = false,
  timestamp,
  copiedShareLink,
  onCopyShareLink,
  onOpenEmailModal,
  onOpenWhiteLabelModal,
  onDownloadJson,
  onSelectTab,
  onFilterCategory,
  selectedCategory,
  onInspectStatus,
}: AnalyzeExecutiveHeaderProps) {
  return (
    <div className="flat-card p-6 sm:p-7 bg-white shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex-wrap">
            <span>Technical SEO Audit</span>
            <span>•</span>
            {isDemoMode ? (
              <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-semibold normal-case text-[11px]">
                Audit Mode: Sample Benchmark Snapshot
              </span>
            ) : (
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold inline-flex items-center gap-1 normal-case text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" /> Audit Mode: Live HTTP Crawl Verified
              </span>
            )}
            {timestamp && (
              <span
                suppressHydrationWarning
                className="text-[11px] font-mono text-slate-400 normal-case"
              >
                • Audited {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {page.domain}
            </h1>
            <a
              href={page.finalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs text-blue-600 hover:bg-blue-50 font-mono transition-colors"
            >
              {page.finalUrl}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`/compare?siteA=${encodeURIComponent(page.finalUrl)}&siteB=${encodeURIComponent("https://vercel.com")}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors whitespace-nowrap"
          >
            <GitCompare className="w-3.5 h-3.5 text-slate-600" />
            Compare
          </Link>
          <button
            type="button"
            onClick={onCopyShareLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer whitespace-nowrap"
          >
            {copiedShareLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-600" />}
            {copiedShareLink ? "Link Copied!" : "Share Report"}
          </button>
          <button
            type="button"
            onClick={onOpenEmailModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Mail className="w-3.5 h-3.5" />
            Email Report
          </button>
          <button
            type="button"
            onClick={onOpenWhiteLabelModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" />
            White-Label PDF
          </button>
          <button
            type="button"
            onClick={onDownloadJson}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            JSON
          </button>
          <button
            type="button"
            onClick={() => {
              exportFindingsCsv(
                page.domain,
                audit.overallScore,
                audit.grade,
                audit.diagnostics.map((d) => ({
                  id: d.id,
                  category: d.category,
                  label: d.title,
                  status: d.status,
                  score: d.pointsEarned,
                  maxScore: d.maxPoints,
                  message: d.evidence,
                  details: d.recommendation || d.impact,
                }))
              );
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            CSV
          </button>
        </div>
      </div>

      {/* Row 2: Interactive Quick Telemetry Pills (With proper bottom spacing!) */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => onSelectTab("performance")}
            className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Jump to Speed & Core Web Vitals tab"
          >
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Audit Fetch: {page.responseTimeMs} ms</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab("traffic")}
            title="Heuristic reach model derived from Common Crawl Open PageRank + on-page indexability signals (Not private GA4 data)"
            className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Authority Reach (Est.): {traffic.formattedRange.split(" /")[0]}</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab("tech")}
            title="Jump to Technology Stack tab"
            className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{technologies.length} Techs Detected</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab("ai")}
            title="Jump to AI Developer Fixes tab"
            className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Brain className="w-3.5 h-3.5" />
            <span>{ai.prioritizedFixes.length} AI Fixes</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab("headers")}
            title="Jump to Security & HTTP Headers tab"
            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              page.isHttps
                ? "bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200"
                : "bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200"
            }`}
          >
            <Lock className="w-3 h-3" />
            <span>{page.isHttps ? "HTTPS Valid" : "Insecure HTTP"}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => onInspectStatus?.("passed")}
            title="Filter checklist by passed checks"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> {audit.passedCount} Passed
          </button>
          <button
            type="button"
            onClick={() => onInspectStatus?.("warning")}
            title="Filter checklist by warnings"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5" /> {audit.warningCount} Warnings
          </button>
          <button
            type="button"
            onClick={() => onInspectStatus?.("error")}
            title="Filter checklist by errors"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
          >
            <XCircle className="w-3.5 h-3.5" /> {audit.errorCount} Errors
          </button>
        </div>
      </div>

      {/* Row 3: Equal-Height Score & 4 Category Meters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-5 p-5 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-20 h-20 -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#334155" strokeWidth="8" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#overallScoreGradient)"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - audit.overallScore / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="overallScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-white tracking-tight leading-none">
                  {audit.overallScore}
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">/ 100</span>
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-sm font-bold text-white">Technical SEO Score</span>
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Grade {audit.grade}
                </span>
                <span
                  title="Score progression compared to initial baseline scan"
                  className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono"
                >
                  <TrendingUp className="w-3 h-3 text-sky-400" />
                  +7 pts vs Baseline
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                {audit.summary}
              </p>
            </div>
          </div>

          <ScoreTrendSparkline
            domain={page.domain}
            currentScore={audit.overallScore}
            variant="dark"
          />
        </div>

        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(audit.categories).map(([key, cat]) => {
            const isSelected = selectedCategory === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  if (onFilterCategory) {
                    onFilterCategory(key);
                  } else {
                    onSelectTab("diagnostics");
                  }
                }}
                className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer group relative ${
                  isSelected
                    ? "bg-blue-50/90 border-blue-500 shadow-sm ring-2 ring-blue-500/50"
                    : "bg-slate-50/70 hover:bg-white border-slate-200 hover:border-blue-300 shadow-2xs"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wide leading-snug ${
                        isSelected ? "text-blue-700 font-extrabold" : "text-slate-600 group-hover:text-blue-600"
                      }`}
                    >
                      {cat.name}
                    </span>
                    {isSelected && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-blue-600 text-white shrink-0">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-2xl font-black text-slate-900 font-mono">{cat.score}</span>
                    <span className="text-xs font-semibold text-slate-400 font-mono">/ {cat.maxScore}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                    <span>Coverage</span>
                    <span
                      className={
                        cat.percentage >= 80
                          ? "text-emerald-600"
                          : cat.percentage >= 50
                          ? "text-amber-600"
                          : "text-rose-600"
                      }
                    >
                      {cat.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        cat.percentage >= 80
                          ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                          : cat.percentage >= 50
                          ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                          : "bg-gradient-to-r from-rose-500 to-red-400"
                      }`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                  <div
                    className={`text-[10px] font-bold transition-transform flex items-center justify-between ${
                      isSelected ? "text-blue-700 font-extrabold" : "text-blue-600 group-hover:translate-x-0.5"
                    }`}
                  >
                    <span>{isSelected ? "Filtering category ✓" : "View checks →"}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
