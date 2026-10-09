"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import UrlAnalyzerInput from "@/components/UrlAnalyzerInput";
import { 
  Search, 
  ArrowLeft, 
  ShieldCheck, 
  Layers, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Download, 
  RefreshCw, 
  Lock, 
  Clock, 
  HardDrive, 
  ExternalLink,
  Cpu,
  Gauge,
  Sparkles,
  BarChart,
  HelpCircle,
  Info,
  TrendingUp,
  Brain,
  Copy,
  Check
} from "lucide-react";
import { ScrapedPageData } from "@/lib/modules/seo/fetcher";
import { SeoAuditReport } from "@/lib/modules/seo/scorer";
import { DetectedTechnology } from "@/lib/modules/tech/detector";
import { PageSpeedReport } from "@/lib/modules/performance/pagespeed";
import { TrafficEstimationReport } from "@/lib/modules/traffic/estimator";
import { AiDiagnosticReport } from "@/lib/modules/ai/service";

interface ApiResponse {
  success: boolean;
  timestamp: string;
  page: ScrapedPageData;
  audit: SeoAuditReport;
  technologies: DetectedTechnology[];
  performance: PageSpeedReport;
  traffic: TrafficEstimationReport;
  ai: AiDiagnosticReport;
  error?: string;
  errorType?: string;
  details?: string;
}

export default function AnalyzeContent() {
  const searchParams = useSearchParams();
  const targetUrl = searchParams.get("url");

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "diagnostics" | "ai" | "traffic" | "tech" | "performance" | "structure" | "media" | "social" | "headers"
  >("diagnostics");
  const [filterStatus, setFilterStatus] = useState<"all" | "passed" | "warning" | "error">("all");
  const [techCategoryFilter, setTechCategoryFilter] = useState<string>("all");
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  const fetchAnalysis = async (urlToFetch: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`/api/analyze?url=${encodeURIComponent(urlToFetch)}`);
      const result: ApiResponse = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || result.details || "Failed to analyze target website.");
      }

      setData(result);
    } catch (err: unknown) {
      setError((err as Error).message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (targetUrl) {
      fetchAnalysis(targetUrl);
    }
  }, [targetUrl]);

  const handleExportJson = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seoseite-audit-${data.page.domain || "report"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const filteredDiagnostics = data?.audit.diagnostics.filter((item) => {
    if (filterStatus === "all") return true;
    return item.status === filterStatus;
  });

  const availableTechCategories = data?.technologies
    ? Array.from(new Set(data.technologies.map((t) => t.category)))
    : [];

  const filteredTechnologies = data?.technologies.filter((t) => {
    if (techCategoryFilter === "all") return true;
    return t.category === techCategoryFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top action row */}
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
              onClick={() => targetUrl && fetchAnalysis(targetUrl)}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Re-scan
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

      {/* URL search bar header (collapsible if analyzed) */}
      {!data && !loading && (
        <div className="border-b border-slate-200 pb-8 mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Public Website Analyzer
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto mb-6">
            Enter any public website URL to run deterministic SEO diagnostics, traffic estimation, tech detection, and AI recommendations.
          </p>
          <UrlAnalyzerInput />
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flat-card p-12 text-center max-w-xl mx-auto my-12 bg-white">
          <div className="w-12 h-12 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto mb-5" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Auditing {targetUrl}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            Executing SSRF validation, detecting tech stacks, calculating traffic heuristics, and generating AI developer fixes...
          </p>

          <div className="space-y-2 text-left max-w-xs mx-auto text-xs text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              SSRF & DNS safety verified
            </div>
            <div className="flex items-center gap-2 text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Cheerio DOM parsing complete
            </div>
            <div className="flex items-center gap-2 text-blue-700 font-medium">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
              Modeling traffic & AI diagnostics
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
                Analysis Request Failed
              </h3>
              <p className="text-xs text-rose-700 font-mono bg-white/70 p-2.5 rounded border border-rose-200 mb-3">
                {error}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Please make sure the domain is publicly reachable over HTTP/HTTPS and is not a private IP address or local server.
              </p>
              <div className="pt-2">
                <UrlAnalyzerInput />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success data view */}
      {data && !loading && (
        <div className="space-y-8">
          {/* Domain & Vital Specs Header */}
          <div className="flat-card p-6 bg-white">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  <span>Inspected Domain</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Public Target
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                    {data.page.domain}
                  </h1>
                  <a
                    href={data.page.finalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline font-mono"
                  >
                    {data.page.finalUrl}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Quick Status pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{data.page.responseTimeMs} ms</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Est. Visits: {data.traffic.formattedRange.split(" /")[0]}</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 font-semibold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{data.technologies.length} Techs</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5" />
                  <span>{data.ai.prioritizedFixes.length} AI Fixes</span>
                </div>
                <div className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 ${
                  data.page.isHttps 
                    ? "bg-blue-50 text-blue-800 border-blue-200" 
                    : "bg-rose-50 text-rose-800 border-rose-200"
                }`}>
                  <Lock className="w-3 h-3" />
                  <span>{data.page.isHttps ? "HTTPS Valid" : "Insecure HTTP"}</span>
                </div>
              </div>
            </div>

            {/* Score & Category breakdown banner */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Overall Score */}
              <div className="lg:col-span-4 p-5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-5">
                <div className="w-20 h-20 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center shrink-0">
                  <span className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                    {data.audit.overallScore}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">/ 100</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-slate-900">Technical SEO Score</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      Grade {data.audit.grade}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {data.audit.summary}
                  </p>
                </div>
              </div>

              {/* 4 Category Bars */}
              <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(data.audit.categories).map(([key, cat]) => (
                  <div key={key} className="p-3 bg-white rounded-lg border border-slate-200">
                    <div className="text-[11px] font-semibold text-slate-500 truncate mb-1">
                      {cat.name}
                    </div>
                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="text-lg font-bold text-slate-900">{cat.score}</span>
                      <span className="text-xs text-slate-400">/{cat.maxScore}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          cat.percentage >= 80 
                            ? "bg-emerald-500" 
                            : cat.percentage >= 50 
                            ? "bg-amber-500" 
                            : "bg-rose-500"
                        }`}
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
            {[
              { id: "diagnostics", label: "SEO Diagnostics", count: data.audit.diagnostics.length },
              { id: "ai", label: "AI Recommendations", count: data.ai.prioritizedFixes.length, highlight: true },
              { id: "traffic", label: "Traffic Estimator", count: null, highlight: true },
              { id: "tech", label: "Tech Stack", count: data.technologies.length },
              { id: "performance", label: "Core Web Vitals", count: data.performance.scores.performance },
              { id: "structure", label: "Headings & Content", count: data.page.headings.totalHeadings },
              { id: "media", label: "Images & Alt Text", count: data.page.images.totalImages },
              { id: "social", label: "Social & Schema", count: data.page.structuredData.count },
              { id: "headers", label: "Security & Headers", count: null },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === tab.id ? "bg-blue-700 text-white" : "bg-slate-200 text-slate-700"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* TAB 1: SEO DIAGNOSTICS */}
          {activeTab === "diagnostics" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">Filter checks:</span>
                  {[
                    { id: "all", label: "All Checks", count: data.audit.diagnostics.length },
                    { id: "passed", label: "Passed", count: data.audit.passedCount, color: "text-emerald-700" },
                    { id: "warning", label: "Warnings", count: data.audit.warningCount, color: "text-amber-700" },
                    { id: "error", label: "Errors", count: data.audit.errorCount, color: "text-rose-700" },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setFilterStatus(filter.id as typeof filterStatus)}
                      className={`px-2.5 py-1 text-xs rounded-md font-medium border transition-colors cursor-pointer ${
                        filterStatus === filter.id
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <span className={filter.color}>{filter.label}</span> ({filter.count})
                    </button>
                  ))}
                </div>
                <div className="text-xs text-slate-500">
                  Showing {filteredDiagnostics?.length} of {data.audit.diagnostics.length} rules
                </div>
              </div>

              <div className="space-y-3">
                {filteredDiagnostics?.map((item) => (
                  <div key={item.id} className="flat-card p-4 sm:p-5 bg-white">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        {item.status === "passed" && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        )}
                        {item.status === "warning" && (
                          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                        )}
                        {item.status === "error" && (
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        )}
                        <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                      </div>
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {item.pointsEarned} / {item.maxPoints} pts
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-md border border-slate-200 text-xs text-slate-800 font-mono mb-2 break-all">
                      <span className="font-semibold text-slate-500 mr-1.5 font-sans">Observed:</span>
                      {item.evidence}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-1.5">
                      <strong className="text-slate-800 font-medium">Why it matters:</strong> {item.impact}
                    </p>

                    {item.recommendation && (
                      <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-blue-800 bg-blue-50/60 p-2 rounded">
                        <strong className="font-semibold">Recommended Fix:</strong> {item.recommendation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: AI RECOMMENDATIONS & DEVELOPER FIXES */}
          {activeTab === "ai" && (
            <div className="space-y-6">
              {/* Executive Summary Card */}
              <div className="flat-card p-6 bg-white border-blue-200">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <h3 className="text-base font-bold text-slate-900">AI Diagnostic Summary</h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Engine: {data.ai.provider}
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed bg-blue-50/40 p-4 rounded-xl border border-blue-100 mb-4">
                  {data.ai.executiveSummary}
                </p>

                {/* Strengths & Gaps Side-by-Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Key Observed Strengths
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {data.ai.keyStrengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-rose-50/40 rounded-xl border border-rose-200">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      Critical Performance & SEO Gaps
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {data.ai.criticalGaps.map((gap, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-rose-600 font-bold">•</span>
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Prioritized Actionable Fixes */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900">
                    Prioritized Developer Fixes ({data.ai.prioritizedFixes.length})
                  </h3>
                  <span className="text-xs text-slate-500">
                    Ranked by organic search ranking impact
                  </span>
                </div>

                <div className="space-y-4">
                  {data.ai.prioritizedFixes.map((fix) => (
                    <div key={fix.id} className="flat-card p-5 bg-white">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                              fix.priority === "High"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}>
                              {fix.priority} Priority
                            </span>
                            <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              Difficulty: {fix.difficulty}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400">
                              {fix.category}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900">{fix.title}</h4>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 mb-2">
                        <strong className="text-slate-800 font-medium">Actionable Step:</strong> {fix.actionableStep}
                      </p>

                      <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-xs text-slate-600 mb-3">
                        <strong className="text-slate-700 font-medium">Expected Impact:</strong> {fix.expectedImpact}
                      </div>

                      {fix.codeSnippet && (
                        <div className="relative mt-2">
                          <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto">
                            <code>{fix.codeSnippet}</code>
                          </pre>
                          <button
                            onClick={() => handleCopyCode(fix.id, fix.codeSnippet || "")}
                            className="absolute top-2 right-2 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {copiedSnippetId === fix.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TRAFFIC ESTIMATOR */}
          {activeTab === "traffic" && (
            <div className="space-y-6">
              {/* Traffic Range Overview */}
              <div className="flat-card p-6 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-5">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Estimated Monthly Web Visits
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-mono">
                      {data.traffic.formattedRange}
                    </h3>
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-1">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border uppercase ${
                      data.traffic.confidence === "High"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : data.traffic.confidence === "Medium"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}>
                      {data.traffic.confidence} Confidence ({data.traffic.confidenceScore}/100)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Based on verified public signals
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed mb-6">
                  <strong className="text-slate-800 font-medium">Confidence Basis:</strong> {data.traffic.confidenceReason}
                </div>

                {/* Channels Breakdown */}
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                  Estimated Traffic Channel Distribution
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {data.traffic.channels.map((chan) => (
                    <div key={chan.name} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>{chan.name}</span>
                        <span className="font-bold text-slate-900">{chan.percentage}%</span>
                      </div>
                      <div className="text-xl font-bold text-slate-900 font-mono mb-2">
                        {chan.formattedVisits}
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${chan.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTR Model */}
                <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-200 mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2">
                    Search Click-Through Rate (CTR) Distribution Model
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 mb-2">
                    <div className="flex items-center gap-1.5 font-medium">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>{data.traffic.ctrModel.top3Share}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>{data.traffic.ctrModel.top10Share}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500">{data.traffic.ctrModel.modelNotes}</p>
                </div>

                {/* Footprint Signals */}
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                  Observable Public Signals Examined
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {data.traffic.signalsUsed.map((sig, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-900 block">{sig.name}</span>
                        <span className="text-slate-500">{sig.value}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        sig.impact === "Positive"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {sig.impact}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Honesty & Limitations */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Our Data Integrity Commitment
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {data.traffic.limitations.map((lim, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-slate-400">•</span>
                        <span>{lim}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TECH STACK */}
          {activeTab === "tech" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2 pb-2">
                <button
                  onClick={() => setTechCategoryFilter("all")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                    techCategoryFilter === "all"
                      ? "bg-purple-600 text-white border-purple-600 font-semibold"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  All Technologies ({data.technologies.length})
                </button>
                {availableTechCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setTechCategoryFilter(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
                      techCategoryFilter === cat
                        ? "bg-purple-600 text-white border-purple-600 font-semibold"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {filteredTechnologies && filteredTechnologies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTechnologies.map((tech, idx) => (
                    <div key={idx} className="flat-card p-4 bg-white flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-sm font-bold text-slate-900">{tech.name}</h4>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                            tech.confidence === "High"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}>
                            {tech.confidence} Confidence
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            {tech.category}
                          </span>
                          {tech.version && (
                            <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                              v{tech.version}
                            </span>
                          )}
                        </div>

                        <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-xs font-mono text-slate-700 break-all mb-3">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5 font-sans">
                            Detection Evidence
                          </span>
                          {tech.evidence}
                        </div>
                      </div>

                      {tech.website && (
                        <a
                          href={tech.website}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline pt-2 border-t border-slate-100 font-medium"
                        >
                          Technology documentation
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flat-card p-8 text-center bg-white">
                  <Layers className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-slate-900">No Technologies in this Category</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Select &apos;All Technologies&apos; to view all detected stack components.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CORE WEB VITALS */}
          {activeTab === "performance" && (
            <div className="space-y-6">
              {data.performance.providerNotice && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0 text-blue-600" />
                  <span>{data.performance.providerNotice}</span>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Performance", score: data.performance.scores.performance },
                  { label: "Accessibility", score: data.performance.scores.accessibility },
                  { label: "Best Practices", score: data.performance.scores.bestPractices },
                  { label: "SEO Diagnostics", score: data.performance.scores.seo },
                ].map((gauge) => (
                  <div key={gauge.label} className="flat-card p-4 text-center bg-white">
                    <span className="text-xs font-bold text-slate-500 uppercase block mb-2">
                      {gauge.label}
                    </span>
                    <div className="w-16 h-16 rounded-full border-4 mx-auto flex items-center justify-center mb-1 font-black text-xl text-slate-900" style={{
                      borderColor: gauge.score >= 90 ? "#10b981" : gauge.score >= 50 ? "#f59e0b" : "#ef4444"
                    }}>
                      {gauge.score}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {gauge.score >= 90 ? "Fast / Excellent" : gauge.score >= 50 ? "Average" : "Needs Work"}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-blue-600" />
                  Official Core Web Vitals Lab Telemetry
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(data.performance.vitals).map(([key, vital]) => (
                    <div key={key} className="flat-card p-4 bg-white flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-xs font-bold text-slate-900">{vital.name}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                            vital.rating === "good"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : vital.rating === "needs-improvement"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}>
                            {vital.rating.replace("-", " ")}
                          </span>
                        </div>
                        <div className="text-2xl font-black text-slate-900 mb-2 font-mono">
                          {vital.value}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {vital.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {data.performance.opportunities.length > 0 && (
                <div className="flat-card p-5 bg-white">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    Top Performance Opportunities
                  </h3>
                  <div className="space-y-3">
                    {data.performance.opportunities.map((opp, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="text-xs font-bold text-slate-900">{opp.title}</h4>
                          {opp.savings && (
                            <span className="text-[11px] font-semibold text-emerald-700 font-mono">
                              {opp.savings}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{opp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: HEADINGS & STRUCTURE */}
          {activeTab === "structure" && (
            <div className="space-y-6">
              <div className="flat-card p-5 bg-white">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                  <h3 className="text-sm font-bold text-slate-900">
                    H1 Main Heading Analysis ({data.page.headings.h1Count} found)
                  </h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                    data.page.headings.h1Count === 1 
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}>
                    {data.page.headings.h1Count === 1 ? "Ideal: Exactly 1" : "Needs Review"}
                  </span>
                </div>

                {data.page.headings.h1Items.length > 0 ? (
                  <ul className="space-y-2">
                    {data.page.headings.h1Items.map((h1, idx) => (
                      <li key={idx} className="p-3 bg-slate-50 rounded-md font-mono text-xs text-slate-900 border border-slate-200">
                        {h1}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-rose-600 font-medium">
                    No &lt;h1&gt; tags were found on the page.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                {[
                  { tag: "H1", count: data.page.headings.h1Count },
                  { tag: "H2", count: data.page.headings.h2Count },
                  { tag: "H3", count: data.page.headings.h3Count },
                  { tag: "H4", count: data.page.headings.h4Count },
                  { tag: "H5", count: data.page.headings.h5Count },
                  { tag: "H6", count: data.page.headings.h6Count },
                ].map((item) => (
                  <div key={item.tag} className="flat-card p-3 text-center bg-white">
                    <span className="text-xs font-bold text-slate-500 uppercase block mb-1">{item.tag}</span>
                    <span className="text-xl font-bold text-slate-900">{item.count}</span>
                  </div>
                ))}
              </div>

              {data.page.headings.h2Samples.length > 0 && (
                <div className="flat-card p-5 bg-white">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">
                    Sample H2 Subheadings ({data.page.headings.h2Samples.length} sampled)
                  </h3>
                  <ul className="space-y-2">
                    {data.page.headings.h2Samples.map((h2, idx) => (
                      <li key={idx} className="p-2.5 bg-slate-50 rounded text-xs text-slate-700 border border-slate-200">
                        {h2}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flat-card p-4 bg-white">
                  <span className="text-xs text-slate-500 block mb-1">Estimated Word Count</span>
                  <span className="text-xl font-bold text-slate-900">{data.page.wordCount.toLocaleString()} words</span>
                </div>
                <div className="flat-card p-4 bg-white">
                  <span className="text-xs text-slate-500 block mb-1">Internal Navigation Links</span>
                  <span className="text-xl font-bold text-slate-900">{data.page.links.internalLinks} links</span>
                </div>
                <div className="flat-card p-4 bg-white">
                  <span className="text-xs text-slate-500 block mb-1">External Outbound Links</span>
                  <span className="text-xl font-bold text-slate-900">{data.page.links.externalLinks} links</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: IMAGES & ALT TEXT */}
          {activeTab === "media" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flat-card p-4 bg-white">
                  <span className="text-xs text-slate-500 block mb-1">Total Images</span>
                  <span className="text-2xl font-bold text-slate-900">{data.page.images.totalImages}</span>
                </div>
                <div className="flat-card p-4 bg-white">
                  <span className="text-xs text-emerald-700 block mb-1">Images with Alt Text</span>
                  <span className="text-2xl font-bold text-emerald-700">{data.page.images.withAlt}</span>
                </div>
                <div className="flat-card p-4 bg-white">
                  <span className="text-xs text-rose-700 block mb-1">Missing Alt Text</span>
                  <span className="text-2xl font-bold text-rose-700">{data.page.images.missingAlt}</span>
                </div>
              </div>

              {data.page.images.missingAlt > 0 ? (
                <div className="flat-card p-5 bg-white">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">
                    Sample Images Missing Descriptive Alt Attributes
                  </h3>
                  <p className="text-xs text-slate-600 mb-4">
                    The following image sources do not include a descriptive alt attribute:
                  </p>
                  <ul className="space-y-2">
                    {data.page.images.missingAltSamples.map((src, idx) => (
                      <li key={idx} className="p-2.5 bg-rose-50/50 rounded font-mono text-xs text-rose-900 border border-rose-200 truncate">
                        {src}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="flat-card p-6 text-center bg-white">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-slate-900">100% Image Accessibility Compliance</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    All images discovered on this page have descriptive alt text tags.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 8: SOCIAL & SCHEMA */}
          {activeTab === "social" && (
            <div className="space-y-6">
              <div className="flat-card p-5 bg-white">
                <h3 className="text-sm font-bold text-slate-900 mb-4">
                  Open Graph Social Card Preview
                </h3>
                <div className="border border-slate-200 rounded-xl overflow-hidden max-w-lg bg-slate-50">
                  {data.page.openGraph.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={data.page.openGraph.image}
                      alt="OG Preview"
                      className="w-full h-48 object-cover border-b border-slate-200"
                    />
                  ) : (
                    <div className="w-full h-32 bg-slate-200 flex items-center justify-center text-xs text-slate-500">
                      No og:image specified
                    </div>
                  )}
                  <div className="p-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      {data.page.domain}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                      {data.page.openGraph.title || data.page.title || "No Title Specified"}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {data.page.openGraph.description || data.page.metaDescription || "No description provided."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flat-card p-5 bg-white">
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  JSON-LD Structured Data ({data.page.structuredData.count} found)
                </h3>
                {data.page.structuredData.detected ? (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {data.page.structuredData.types.map((type, idx) => (
                      <span key={idx} className="flat-badge bg-blue-50 text-blue-700 border-blue-200 font-mono">
                        Schema: {type}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    No Schema.org JSON-LD structured data detected.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 9: SECURITY & HEADERS */}
          {activeTab === "headers" && (
            <div className="space-y-6">
              <div className="flat-card p-5 bg-white">
                <h3 className="text-sm font-bold text-slate-900 mb-4">
                  HTTP Security Headers Evaluation
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="font-mono text-slate-700">Strict-Transport-Security (HSTS)</span>
                    <span className={`font-semibold px-2 py-0.5 rounded ${
                      data.page.securityHeaders.hsts ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                    }`}>
                      {data.page.securityHeaders.hsts ? "Active" : "Missing"}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="font-mono text-slate-700">Content-Security-Policy (CSP)</span>
                    <span className={`font-semibold px-2 py-0.5 rounded ${
                      data.page.securityHeaders.csp ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                    }`}>
                      {data.page.securityHeaders.csp ? "Active" : "Not Set"}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="font-mono text-slate-700">X-Frame-Options</span>
                    <span className="font-semibold text-slate-800">
                      {data.page.securityHeaders.xFrameOptions || "Not Set"}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="font-mono text-slate-700">X-Content-Type-Options</span>
                    <span className={`font-semibold px-2 py-0.5 rounded ${
                      data.page.securityHeaders.xContentTypeOptions ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                    }`}>
                      {data.page.securityHeaders.xContentTypeOptions ? "nosniff" : "Not Set"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flat-card p-5 bg-white">
                <h3 className="text-sm font-bold text-slate-900 mb-3">
                  Crawler Files & Server Headers
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="font-mono">/robots.txt</span>
                    <span className={`font-semibold ${data.page.hasRobotsTxt ? "text-emerald-700" : "text-amber-700"}`}>
                      {data.page.hasRobotsTxt ? "200 OK (Detected)" : "Not Found"}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="font-mono">/sitemap.xml</span>
                    <span className={`font-semibold ${data.page.hasSitemapXml ? "text-emerald-700" : "text-amber-700"}`}>
                      {data.page.hasSitemapXml ? "200 OK (Detected)" : "Not Found"}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="font-mono">Server Header</span>
                    <span className="font-semibold text-slate-800">{data.page.serverHeader || "Hidden"}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="font-mono">X-Powered-By</span>
                    <span className="font-semibold text-slate-800">{data.page.xPoweredBy || "Hidden"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
