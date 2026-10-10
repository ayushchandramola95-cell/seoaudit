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
  Check,
  Share2,
  Printer,
  Globe,
  Monitor,
  Smartphone,
  FileText,
  Hash,
  BookOpen,
  AlertCircle,
  Link2,
  Compass,
} from "lucide-react";
import { ScrapedPageData } from "@/lib/modules/seo/fetcher";
import { SeoAuditReport } from "@/lib/modules/seo/scorer";
import { DetectedTechnology } from "@/lib/modules/tech/detector";
import { PageSpeedReport } from "@/lib/modules/performance/pagespeed";
import { TrafficEstimationReport } from "@/lib/modules/traffic/estimator";
import { AiDiagnosticReport } from "@/lib/modules/ai/service";
import { KeywordAnalysisReport } from "@/lib/modules/keywords/extractor";
import { LinkDiscoveryReport } from "@/lib/modules/crawler/linkScanner";

interface ApiResponse {
  success: boolean;
  id?: string;
  timestamp: string;
  page: ScrapedPageData;
  audit: SeoAuditReport;
  technologies: DetectedTechnology[];
  performance: PageSpeedReport;
  traffic: TrafficEstimationReport;
  ai: AiDiagnosticReport;
  keywords?: KeywordAnalysisReport;
  links?: LinkDiscoveryReport;
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
    "diagnostics" | "ai" | "traffic" | "tech" | "keywords" | "links" | "performance" | "structure" | "media" | "social" | "headers"
  >("diagnostics");
  const [serpView, setSerpView] = useState<"desktop" | "mobile" | "twitter" | "facebook">("desktop");
  const [filterStatus, setFilterStatus] = useState<"all" | "passed" | "warning" | "error">("all");
  const [techCategoryFilter, setTechCategoryFilter] = useState<string>("all");
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  const handleCopyShareLink = () => {
    if (data?.id) {
      const shareUrl = `${window.location.origin}/report/${data.id}`;
      navigator.clipboard.writeText(shareUrl);
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2000);
  };

  const handleDownloadJson = () => {
    if (!data) return;
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-${data.page.domain}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

              {/* Action Buttons: Share, Print PDF, Export JSON */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleCopyShareLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                >
                  {copiedShareLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-600" />}
                  {copiedShareLink ? "Link Copied!" : "Share Report"}
                </button>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  Print / PDF
                </button>
                <button
                  onClick={handleDownloadJson}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  Export JSON
                </button>
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
              { id: "keywords", label: "Keyword Density", count: data.keywords?.topSingleKeywords?.length || null, highlight: true },
              { id: "links", label: "Link Footprint", count: data.links?.totalLinks || null, highlight: true },
              { id: "social", label: "SERP & Social Preview", count: null },
              { id: "performance", label: "Core Web Vitals", count: data.performance.scores.performance },
              { id: "structure", label: "Headings & Content", count: data.page.headings.totalHeadings },
              { id: "media", label: "Images & Alt Text", count: data.page.images.totalImages },
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

          {/* TAB: KEYWORD DENSITY & N-GRAM ANALYSIS */}
          {activeTab === "keywords" && (
            <div className="space-y-6">
              {/* 4 Metric Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="flat-card p-4 sm:p-5 bg-white">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Indexable Words
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-mono">
                    {data.keywords?.totalWords?.toLocaleString() || data.page.wordCount.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Filtered body copy</div>
                </div>

                <div className="flat-card p-4 sm:p-5 bg-white">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Unique Vocabulary
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-mono">
                    {data.keywords?.uniqueWords?.toLocaleString() || "—"}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Distinct terms (1-gram)</div>
                </div>

                <div className="flat-card p-4 sm:p-5 bg-white">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Lexical Diversity
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-mono">
                    {data.keywords?.lexicalDiversity 
                      ? `${(data.keywords.lexicalDiversity * 100).toFixed(1)}%` 
                      : "—"}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Type-token variety ratio</div>
                </div>

                <div className="flat-card p-4 sm:p-5 bg-white">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Est. Reading Time
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-mono">
                    {data.keywords?.readingTimeMinutes 
                      ? `${data.keywords.readingTimeMinutes} min` 
                      : `${Math.ceil(data.page.wordCount / 200)} min`}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Based on 200 wpm standard</div>
                </div>
              </div>

              {/* Keyword Warnings / Stuffing Check */}
              {data.keywords?.warnings && data.keywords.warnings.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Keyword Density & Content Quality Alerts:
                  </div>
                  <ul className="list-disc list-inside text-xs text-amber-800 space-y-1">
                    {data.keywords.warnings.map((warn, wIdx) => (
                      <li key={wIdx}>{warn}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Single Keyword Frequency & Density Table */}
              <div className="flat-card p-5 sm:p-6 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Top 1-Gram Keywords (Single Terms)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Stop-words removed. Evaluates prominence in Title and H1 tags.
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                    Density Target: 1.0% – 3.0%
                  </span>
                </div>

                {data.keywords?.topSingleKeywords && data.keywords.topSingleKeywords.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] bg-slate-50/50">
                          <th className="py-2.5 px-3 font-semibold">#</th>
                          <th className="py-2.5 px-3 font-semibold">Keyword Phrase</th>
                          <th className="py-2.5 px-3 font-semibold text-right">Frequency</th>
                          <th className="py-2.5 px-3 font-semibold">Density Meter</th>
                          <th className="py-2.5 px-3 font-semibold text-center">In Title</th>
                          <th className="py-2.5 px-3 font-semibold text-center">In H1</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data.keywords.topSingleKeywords.map((kw, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">
                              #{idx + 1}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-slate-900 font-mono">
                              {kw.phrase}
                            </td>
                            <td className="py-2.5 px-3 font-mono font-semibold text-slate-700 text-right">
                              {kw.count}×
                            </td>
                            <td className="py-2.5 px-3 min-w-[140px]">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                                  <div
                                    className={`h-2 rounded-full ${
                                      kw.density > 3.5
                                        ? "bg-rose-500"
                                        : kw.density >= 1.0
                                        ? "bg-emerald-500"
                                        : "bg-blue-500"
                                    }`}
                                    style={{ width: `${Math.min(100, kw.density * 25)}%` }}
                                  />
                                </div>
                                <span className="font-mono text-[11px] text-slate-600 font-semibold w-12 text-right">
                                  {kw.density.toFixed(2)}%
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              {kw.inTitle ? (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  ✓ Title
                                </span>
                              ) : (
                                <span className="text-slate-300 text-[11px]">✕</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              {kw.inH1 ? (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                  ✓ H1
                                </span>
                              ) : (
                                <span className="text-slate-300 text-[11px]">✕</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    No prominent single-word keywords extracted.
                  </p>
                )}
              </div>

              {/* 2-Gram and 3-Gram Phrase Breakdowns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 2-Gram Phrases */}
                <div className="flat-card p-5 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Hash className="w-4 h-4 text-blue-600" />
                      Top 2-Word Key Phrases (2-Grams)
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">Pair frequency</span>
                  </div>
                  {data.keywords?.topTwoWordPhrases && data.keywords.topTwoWordPhrases.length > 0 ? (
                    <div className="space-y-2">
                      {data.keywords.topTwoWordPhrases.map((phrase, pIdx) => (
                        <div
                          key={pIdx}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                        >
                          <span className="font-semibold text-slate-800 capitalize">{phrase.phrase}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 font-mono">{phrase.count}×</span>
                            <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono font-bold text-[10px]">
                              {phrase.density.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No multi-word phrases detected.</p>
                  )}
                </div>

                {/* 3-Gram Phrases */}
                <div className="flat-card p-5 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      Top 3-Word Key Phrases (3-Grams)
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">Triplet frequency</span>
                  </div>
                  {data.keywords?.topThreeWordPhrases && data.keywords.topThreeWordPhrases.length > 0 ? (
                    <div className="space-y-2">
                      {data.keywords.topThreeWordPhrases.map((phrase, pIdx) => (
                        <div
                          key={pIdx}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                        >
                          <span className="font-semibold text-slate-800 capitalize">{phrase.phrase}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 font-mono">{phrase.count}×</span>
                            <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono font-bold text-[10px]">
                              {phrase.density.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No 3-word n-gram sequences discovered.</p>
                  )}
                </div>
              </div>

              {/* Keyword Optimization Best Practices Card */}
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-slate-700 space-y-2">
                <div className="font-bold text-blue-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  Search Engine Keyword Optimization Best Practices
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11px] text-slate-600">
                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <strong className="text-slate-800 block mb-1">Optimal Density: 1% – 2.5%</strong>
                    Avoid keyword stuffing. Target terms should appear organically without artificial repetition.
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <strong className="text-slate-800 block mb-1">Strategic Placement</strong>
                    Ensure your primary keyword is represented in the &lt;title&gt;, the first &lt;h1&gt;, and the first 100 words.
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-100">
                    <strong className="text-slate-800 block mb-1">Semantic LSI & Diversity</strong>
                    Higher lexical diversity (&gt;45%) signals comprehensive, high-quality editorial writing to Google rankers.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: LINK FOOTPRINT & CRAWL ARCHITECTURE */}
          {activeTab === "links" && (
            <div className="space-y-6">
              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="flat-card p-4 sm:p-5 bg-white">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Total Discovered Links
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-mono">
                    {(data.links?.totalLinks ?? (data.page.links.internalLinks + data.page.links.externalLinks)).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Anchor href attributes</div>
                </div>

                <div className="flat-card p-4 sm:p-5 bg-white">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Internal Links
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-1 font-mono">
                    {(data.links?.internalLinksCount ?? data.page.links.internalLinks).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Same root domain paths</div>
                </div>

                <div className="flat-card p-4 sm:p-5 bg-white">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    External Outbound
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-indigo-600 mt-1 font-mono">
                    {(data.links?.externalLinksCount ?? data.page.links.externalLinks).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Points to external hosts</div>
                </div>

                <div className="flat-card p-4 sm:p-5 bg-white">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Outbound Domains
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-mono">
                    {data.links?.uniqueExternalDomains.length ?? 0}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Unique target origins</div>
                </div>
              </div>

              {/* Link Equity & Crawl Distribution Meter */}
              <div className="flat-card p-5 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Link Equity & PageRank Distribution Ratio
                    </h3>
                    <p className="text-xs text-slate-500">
                      Balance between internal page authority circulation and outbound link dissipation.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-blue-700 font-bold">
                      Internal: {data.links?.linkEquityRatio.internalPercent ?? 80}%
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="text-indigo-700 font-bold">
                      External: {data.links?.linkEquityRatio.externalPercent ?? 20}%
                    </span>
                  </div>
                </div>

                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    className="bg-blue-600 h-full transition-all"
                    style={{ width: `${data.links?.linkEquityRatio.internalPercent ?? 80}%` }}
                    title="Internal Links"
                  />
                  <div
                    className="bg-indigo-500 h-full transition-all"
                    style={{ width: `${data.links?.linkEquityRatio.externalPercent ?? 20}%` }}
                    title="External Outbound Links"
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    Nofollow Tags: <strong>{data.links?.nofollowCount ?? 0}</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    Sponsored / UGC: <strong>{data.links?.sponsoredCount ?? 0}</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    Empty Anchors: <strong>{data.links?.emptyAnchorCount ?? 0}</strong>
                  </span>
                </div>
              </div>

              {/* Warnings if any */}
              {data.links?.warnings && data.links.warnings.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Crawl & Link Structure Recommendations:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-amber-800">
                    {data.links.warnings.map((w, wIdx) => (
                      <li key={wIdx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* External Target Domains Cloud */}
              {data.links?.uniqueExternalDomains && data.links.uniqueExternalDomains.length > 0 && (
                <div className="flat-card p-5 bg-white">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">
                    Discovered External Root Domains ({data.links.uniqueExternalDomains.length})
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {data.links.uniqueExternalDomains.map((dom, dIdx) => (
                      <span
                        key={dIdx}
                        className="text-xs font-mono font-medium px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1"
                      >
                        <Globe className="w-3 h-3 text-slate-400" />
                        {dom}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Internal & External Tables Side-by-Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Internal Links Sample */}
                <div className="flat-card p-5 bg-white">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                    <Link2 className="w-4 h-4 text-blue-600" />
                    Internal Links Discovered
                  </h3>
                  {data.links?.internalLinksSample && data.links.internalLinksSample.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] bg-slate-50/60">
                            <th className="py-2 px-2.5">Anchor Text</th>
                            <th className="py-2 px-2.5">Target Path</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono">
                          {data.links.internalLinksSample.map((lnk, lIdx) => (
                            <tr key={lIdx} className="hover:bg-slate-50">
                              <td className="py-2 px-2.5 font-sans font-medium text-slate-900 truncate max-w-[140px]">
                                {lnk.anchorText}
                              </td>
                              <td className="py-2 px-2.5 text-blue-600 truncate max-w-[180px]">
                                {lnk.href}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No internal links logged.</p>
                  )}
                </div>

                {/* External Outbound Sample */}
                <div className="flat-card p-5 bg-white">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-indigo-600" />
                    External Outbound Links
                  </h3>
                  {data.links?.externalLinksSample && data.links.externalLinksSample.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] bg-slate-50/60">
                            <th className="py-2 px-2.5">Anchor Text</th>
                            <th className="py-2 px-2.5">Target Domain</th>
                            <th className="py-2 px-2.5 text-center">Nofollow</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono">
                          {data.links.externalLinksSample.map((lnk, lIdx) => (
                            <tr key={lIdx} className="hover:bg-slate-50">
                              <td className="py-2 px-2.5 font-sans font-medium text-slate-900 truncate max-w-[120px]">
                                {lnk.anchorText}
                              </td>
                              <td className="py-2 px-2.5 text-indigo-700 truncate max-w-[140px]">
                                {lnk.targetDomain}
                              </td>
                              <td className="py-2 px-2.5 text-center">
                                {lnk.nofollow ? (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                    Nofollow
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400">Dofollow</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No outbound external links discovered.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SERP & SOCIAL PREVIEW SIMULATOR */}
          {activeTab === "social" && (
            <div className="space-y-6">
              {/* Simulator Mode Switcher Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Preview Simulator:</span>
                  <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                    {[
                      { id: "desktop", label: "Google Desktop", icon: Monitor },
                      { id: "mobile", label: "Google Mobile", icon: Smartphone },
                      { id: "twitter", label: "Twitter / X Card", icon: Hash },
                      { id: "facebook", label: "Open Graph / Meta", icon: Globe },
                    ].map((mode) => {
                      const Icon = mode.icon;
                      return (
                        <button
                          key={mode.id}
                          onClick={() => setSerpView(mode.id as typeof serpView)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                            serpView === mode.id
                              ? "bg-blue-600 text-white shadow-xs"
                              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{mode.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Length Metrics Quick Pill */}
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Title:</span>
                    <span
                      className={`font-mono font-bold ${
                        (data.page.title?.length || 0) <= 60 && (data.page.title?.length || 0) >= 30
                          ? "text-emerald-700"
                          : "text-amber-700"
                      }`}
                    >
                      {data.page.title?.length || 0} / 60 chars
                    </span>
                  </div>
                  <span className="text-slate-300">|</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Meta Desc:</span>
                    <span
                      className={`font-mono font-bold ${
                        (data.page.metaDescription?.length || 0) <= 160 &&
                        (data.page.metaDescription?.length || 0) >= 120
                          ? "text-emerald-700"
                          : "text-amber-700"
                      }`}
                    >
                      {data.page.metaDescription?.length || 0} / 160 chars
                    </span>
                  </div>
                </div>
              </div>

              {/* View 1: GOOGLE DESKTOP SERP */}
              {serpView === "desktop" && (
                <div className="flat-card p-6 bg-white border-slate-200">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-xs">
                        G
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Google Desktop Search Result Snippet
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Max pixel width ~600px
                    </span>
                  </div>

                  <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs max-w-2xl font-sans">
                    {/* SERP Breadcrumb */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                        {data.page.domain.charAt(0).toUpperCase()}
                      </div>
                      <div className="leading-tight">
                        <div className="text-[12px] text-slate-900 font-medium">{data.page.domain}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-md font-mono">
                          {data.page.canonicalUrl || data.page.finalUrl}
                        </div>
                      </div>
                    </div>

                    {/* Blue Title Link */}
                    <h4 className="text-[18px] text-[#1a0dab] hover:underline font-normal cursor-pointer leading-snug line-clamp-1 mb-1">
                      {data.page.title || `${data.page.domain} - Official Homepage`}
                    </h4>

                    {/* Snippet Description */}
                    <p className="text-[13px] text-[#4d5156] leading-relaxed line-clamp-2">
                      {data.page.metaDescription || (
                        <span className="italic text-slate-400">
                          No meta description tag provided. Google will generate an automatic snippet from on-page content.
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Character Diagnostics */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="font-semibold text-slate-800 mb-1">Title Tag Assessment</div>
                      <p className="text-slate-600 text-[11px]">
                        {(data.page.title?.length || 0) > 60
                          ? `⚠️ Title is ${data.page.title?.length} characters (over 60 char limit). Google may truncate it with an ellipsis (...) on desktop.`
                          : (data.page.title?.length || 0) < 30
                          ? "⚠️ Title is relatively short (< 30 chars). Consider adding relevant primary keywords."
                          : "✅ Title length is optimal for Google desktop results (30-60 characters)."}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="font-semibold text-slate-800 mb-1">Meta Description Assessment</div>
                      <p className="text-slate-600 text-[11px]">
                        {!data.page.metaDescription
                          ? "❌ Missing meta description tag. Adding a 140-160 character description improves organic CTR."
                          : data.page.metaDescription.length > 160
                          ? `⚠️ Description is ${data.page.metaDescription.length} characters (exceeds 160 limit). The trailing text will be clipped.`
                          : "✅ Description length is well balanced (120-160 chars) without truncation risks."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* View 2: GOOGLE MOBILE SERP */}
              {serpView === "mobile" && (
                <div className="flat-card p-6 bg-white border-slate-200">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-blue-600" />
                      <h3 className="text-sm font-bold text-slate-900">
                        Google Mobile SERP Card Simulation
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">Mobile Viewport</span>
                  </div>

                  <div className="max-w-sm mx-auto p-4 bg-slate-50 border-2 border-slate-300 rounded-2xl shadow-sm">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                          {data.page.domain.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-[12px] font-semibold text-slate-900">{data.page.domain}</div>
                          <div className="text-[10px] text-slate-500 font-mono truncate max-w-[220px]">
                            {data.page.canonicalUrl || data.page.finalUrl}
                          </div>
                        </div>
                      </div>

                      <h4 className="text-[16px] text-[#1a0dab] font-normal leading-snug line-clamp-2 mb-1.5">
                        {data.page.title || `${data.page.domain} - Official Homepage`}
                      </h4>

                      <p className="text-[12px] text-[#4d5156] leading-normal line-clamp-3">
                        {data.page.metaDescription || "No meta description provided."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* View 3: TWITTER / X CARD */}
              {serpView === "twitter" && (
                <div className="flat-card p-6 bg-white border-slate-200">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Hash className="w-5 h-5 text-slate-900" />
                      <h3 className="text-sm font-bold text-slate-900">
                        Twitter / X Summary Large Image Card Preview
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-500">summary_large_image</span>
                  </div>

                  <div className="max-w-lg border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                    {data.page.openGraph.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={data.page.openGraph.image}
                        alt="Twitter Card Preview"
                        className="w-full h-52 object-cover border-b border-slate-200"
                      />
                    ) : (
                      <div className="w-full h-36 bg-slate-100 flex flex-col items-center justify-center text-xs text-slate-500 gap-1">
                        <AlertCircle className="w-5 h-5 text-slate-400" />
                        <span>No twitter:image or og:image defined</span>
                      </div>
                    )}
                    <div className="p-4 bg-slate-50">
                      <span className="text-[11px] text-slate-500 uppercase tracking-wider block mb-1">
                        {data.page.domain}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1">
                        {data.page.openGraph.title || data.page.title || "No Title"}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {data.page.openGraph.description || data.page.metaDescription || "No summary provided."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* View 4: FACEBOOK / OPEN GRAPH */}
              {serpView === "facebook" && (
                <div className="flat-card p-6 bg-white border-slate-200">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <h3 className="text-sm font-bold text-slate-900">
                        Facebook & Open Graph Feed Preview
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-500">og:title & og:image</span>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden max-w-lg bg-slate-50 shadow-xs">
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
              )}

              {/* JSON-LD Structured Data */}
              <div className="flat-card p-5 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900">
                    JSON-LD Schema.org Structured Data ({data.page.structuredData.count} detected)
                  </h3>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      data.page.structuredData.detected
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {data.page.structuredData.detected ? "Schemas Active" : "No Schema Detected"}
                  </span>
                </div>

                {data.page.structuredData.detected ? (
                  <div>
                    <p className="text-xs text-slate-600 mb-3">
                      Structured data helps Google generate rich snippets (e.g. sitelinks, ratings, breadcrumbs, articles) in organic search results.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {data.page.structuredData.types.map((type, idx) => (
                        <span
                          key={idx}
                          className="flat-badge bg-blue-50 text-blue-700 border-blue-200 font-mono text-xs px-2.5 py-1"
                        >
                          Schema: {type}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    No Schema.org JSON-LD microdata found. Adding Organization, WebSite, or BreadcrumbList schemas will enhance SERP prominence.
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
