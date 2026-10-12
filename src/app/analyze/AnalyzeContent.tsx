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
  Bot,
} from "lucide-react";
import { ScrapedPageData } from "@/lib/modules/seo/fetcher";
import { SeoAuditReport } from "@/lib/modules/seo/scorer";
import { DetectedTechnology } from "@/lib/modules/tech/detector";
import { PageSpeedReport } from "@/lib/modules/performance/pagespeed";
import { TrafficEstimationReport } from "@/lib/modules/traffic/estimator";
import { AiDiagnosticReport } from "@/lib/modules/ai/service";
import { KeywordAnalysisReport } from "@/lib/modules/keywords/extractor";
import { LinkDiscoveryReport } from "@/lib/modules/crawler/linkScanner";
import { DeepRobotsSitemapReport } from "@/lib/modules/crawler/robotsSitemap";
import WhiteLabelPdfModal from "@/components/WhiteLabelPdfModal";
import SerpSocialPreview from "@/components/SerpSocialPreview";
import SchemaCodeGenerator from "@/components/SchemaCodeGenerator";
import LinkCrawlerMatrix from "@/components/LinkCrawlerMatrix";
import { exportFindingsCsv, exportKeywordsCsv, exportTechnologiesCsv } from "@/lib/utils/csvExport";
import { usePlan } from "@/lib/auth/PlanContext";
import { formatTierName } from "@/lib/auth/tierLimits";

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
  crawlers?: DeepRobotsSitemapReport;
  error?: string;
  errorType?: string;
  details?: string;
}

export default function AnalyzeContent() {
  const searchParams = useSearchParams();
  const targetUrl = searchParams.get("url");
  const { tier, remainingScans, limits, recordScan, triggerUpgradeModal, canAccess } = usePlan();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "diagnostics" | "ai" | "geo" | "traffic" | "tech" | "keywords" | "links" | "performance" | "structure" | "media" | "social" | "headers" | "schema" | "deadlinks"
  >("diagnostics");
  const [serpView, setSerpView] = useState<"desktop" | "mobile" | "twitter" | "facebook">("desktop");
  const [filterStatus, setFilterStatus] = useState<"all" | "passed" | "warning" | "error">("all");
  const [techCategoryFilter, setTechCategoryFilter] = useState<string>("all");
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [isWhiteLabelOpen, setIsWhiteLabelOpen] = useState(false);

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
    if (!recordScan()) {
      setError(`Daily scan limit reached (${limits.dailyScans}/${limits.dailyScans} scans). Please switch or upgrade your plan to run additional audits.`);
      setLoading(false);
      return;
    }

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

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (
      tabParam &&
      [
        "diagnostics",
        "ai",
        "geo",
        "traffic",
        "tech",
        "keywords",
        "links",
        "performance",
        "structure",
        "media",
        "social",
        "headers",
        "schema",
        "deadlinks",
      ].includes(tabParam)
    ) {
      setActiveTab(tabParam as typeof activeTab);
    }
  }, [searchParams]);

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
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Homepage
        </Link>

        {/* Current Plan Tier & Scans Status Indicator */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-700">
            <span
              className={`w-2 h-2 rounded-full ${
                tier === "enterprise"
                  ? "bg-amber-500"
                  : tier === "pro"
                  ? "bg-purple-600"
                  : tier === "starter"
                  ? "bg-blue-600"
                  : "bg-emerald-500"
              }`}
            />
            <span className="font-bold">{formatTierName(tier)}</span>
            {limits.dailyScans !== Infinity ? (
              <span className="text-slate-500 font-mono text-[11px] border-l border-slate-300 pl-1.5">
                {remainingScans} / {limits.dailyScans} daily scans left
              </span>
            ) : (
              <span className="text-emerald-700 font-semibold text-[11px] border-l border-slate-300 pl-1.5">
                Unlimited scans
              </span>
            )}
          </div>
          {tier === "free" && (
            <button
              onClick={() =>
                triggerUpgradeModal({
                  requiredTier: "pro",
                  featureTitle: "Upgrade to Pro Analyst",
                  description:
                    "Get unlimited daily scans, competitor benchmarking, AI code fixes, and deeper crawl capacities.",
                })
              }
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[11px] font-bold shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3 h-3" /> Upgrade
            </button>
          )}
        </div>

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
                  onClick={() => setIsWhiteLabelOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  White-Label Client PDF
                </button>
                <button
                  onClick={handleDownloadJson}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  Export JSON
                </button>
                <button
                  onClick={() => {
                    exportFindingsCsv(
                      data.page.domain,
                      data.audit.overallScore,
                      data.audit.grade,
                      data.audit.diagnostics.map((d) => ({
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  Export CSV
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

          {/* Suite & Feature Navigation System */}
          {(() => {
            type SuiteKey = "technical" | "speed" | "search" | "links";

            const tabToSuite: Record<string, SuiteKey> = {
              diagnostics: "technical",
              structure: "technical",
              headers: "technical",
              media: "technical",
              performance: "speed",
              traffic: "speed",
              tech: "speed",
              ai: "search",
              geo: "search",
              keywords: "search",
              social: "search",
              schema: "search",
              deadlinks: "links",
              links: "links",
            };

            const currentSuite: SuiteKey = tabToSuite[activeTab] || "technical";

            const suites: Array<{
              id: SuiteKey;
              label: string;
              badge: string;
              badgeStyle: string;
              icon: typeof ShieldCheck;
              defaultTab: typeof activeTab;
              description: string;
            }> = [
              {
                id: "technical",
                label: "Technical SEO & Structure",
                badge: "Free Tier",
                badgeStyle: "bg-slate-100 text-slate-700 border-slate-200",
                icon: ShieldCheck,
                defaultTab: "diagnostics",
                description: "0-100 health audit, document architecture, security headers & media",
              },
              {
                id: "speed",
                label: "Speed & Stack Lab",
                badge: "Starter Plan",
                badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200",
                icon: Zap,
                defaultTab: "performance",
                description: "Core Web Vitals, DomCop Open PageRank & detected technologies",
              },
              {
                id: "search",
                label: "Search & Content Studio",
                badge: "Pro Plan",
                badgeStyle: "bg-blue-50 text-blue-700 border-blue-200",
                icon: Sparkles,
                defaultTab: "ai",
                description: "AI recommendations, GEO AI readiness, keywords, SERP preview & schema",
              },
              {
                id: "links",
                label: "Deep Link Crawler",
                badge: "Pro Plan",
                badgeStyle: "bg-purple-50 text-purple-700 border-purple-200",
                icon: Link2,
                defaultTab: "deadlinks",
                description: "Broken link 404 detector, redirect chain inspection & anchor footprints",
              },
            ];

            const subTabsBySuite: Record<
              SuiteKey,
              Array<{ id: typeof activeTab; label: string; count?: string | number | null }>
            > = {
              technical: [
                { id: "diagnostics", label: "SEO Diagnostics Checklist", count: data.audit.diagnostics.length },
                { id: "structure", label: "Headings & Document Hierarchy", count: data.page.headings.totalHeadings },
                { id: "headers", label: "Security & HTTP Headers", count: null },
                { id: "media", label: "Images & Alt Text Audit", count: data.page.images.totalImages },
              ],
              speed: [
                { id: "performance", label: "Core Web Vitals (Lighthouse)", count: data.performance.scores.performance },
                { id: "traffic", label: "Open PageRank & Traffic Estimator", count: null },
                { id: "tech", label: "Detected Technology Stack", count: data.technologies.length },
              ],
              search: [
                { id: "ai", label: "AI Diagnostic Recommendations", count: data.ai.prioritizedFixes.length },
                { id: "geo", label: "AI Search Readiness (GEO)", count: data.crawlers ? `${data.crawlers.geo.score}/100` : "GEO" },
                { id: "keywords", label: "On-Page Keyword Density", count: data.keywords?.topSingleKeywords?.length || null },
                { id: "social", label: "SERP & Social Preview", count: null },
                { id: "schema", label: "JSON-LD Schema Studio", count: null },
              ],
              links: [
                { id: "deadlinks", label: "Broken Links (404) & Redirect Engine", count: null },
                { id: "links", label: "Discovered Link Footprint Graph", count: data.links?.totalLinks || null },
              ],
            };

            return (
              <div className="space-y-3.5">
                {/* Level 1: 4 Categorized Product Suites */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {suites.map((s) => {
                    const isActiveSuite = currentSuite === s.id;
                    const SuiteIcon = s.icon;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          if (currentSuite !== s.id) {
                            setActiveTab(s.defaultTab);
                          }
                        }}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative group ${
                          isActiveSuite
                            ? "bg-white border-blue-600 shadow-sm ring-1 ring-blue-600/20"
                            : "bg-slate-50/75 border-slate-200 hover:bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1.5 mb-1.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <SuiteIcon
                              className={`w-4 h-4 shrink-0 ${
                                isActiveSuite ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                              }`}
                            />
                            <span
                              className={`text-xs font-bold truncate ${
                                isActiveSuite ? "text-blue-900 font-extrabold" : "text-slate-800"
                              }`}
                            >
                              {s.label}
                            </span>
                          </div>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${s.badgeStyle}`}
                          >
                            {s.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 leading-snug">
                          {s.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Level 2: Sub-Feature Action Bar for Active Suite */}
                <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-lg border border-slate-200/80">
                  {subTabsBySuite[currentSuite].map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                          isActive
                            ? "bg-white text-slate-900 shadow-sm font-bold border border-slate-200/60"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
                        }`}
                      >
                        <span>{tab.label}</span>
                        {tab.count !== null && tab.count !== undefined && (
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                              isActive
                                ? "bg-blue-100 text-blue-700"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {tab.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

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

          {/* TAB: AI SEARCH READINESS (GEO) & CRAWLERS */}
          {activeTab === "geo" && (
            <div className="space-y-6">
              {/* GEO Readiness Score Banner */}
              <div className="flat-card p-6 bg-white border-indigo-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Generative Engine Optimization (GEO)
                      </span>
                      <span className="text-xs text-slate-500">• 2026 AI Search Standard</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      AI Search Citation & Discovery Readiness
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                      Evaluates whether OpenAI ChatGPT, Perplexity AI, Claude, and Google AI Overviews can discover, crawl, and cite your brand.
                    </p>
                  </div>

                  <div className="flex items-baseline gap-2 bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 self-start sm:self-auto">
                    <span className="text-4xl font-black text-indigo-700 font-mono">
                      {data.crawlers?.geo.score ?? 85}
                    </span>
                    <span className="text-xs font-bold text-slate-500">/ 100</span>
                    <span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-indigo-600 text-white ml-1">
                      Grade {data.crawlers?.geo.grade ?? "A"}
                    </span>
                  </div>
                </div>

                {/* 4 GEO Scoring Pillars */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-slate-500 font-semibold uppercase text-[10px]">AI Bot Access</div>
                    <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                      {data.crawlers?.geo.aiBotAccessibilityScore ?? 35} / 35 pts
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Robots.txt permissions</div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-slate-500 font-semibold uppercase text-[10px]">Schema Microdata</div>
                    <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                      {data.crawlers?.geo.schemaRichnessScore ?? 25} / 25 pts
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">JSON-LD Knowledge Graph</div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-slate-500 font-semibold uppercase text-[10px]">Heading Hierarchy</div>
                    <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                      {data.crawlers?.geo.headingClarityScore ?? 20} / 20 pts
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Section answer extraction</div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-slate-500 font-semibold uppercase text-[10px]">Contextual Depth</div>
                    <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                      {data.crawlers?.geo.contentDepthScore ?? 20} / 20 pts
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Indexable editorial copy</div>
                  </div>
                </div>
              </div>

              {/* AI Bots Permission Matrix */}
              <div className="flat-card p-5 sm:p-6 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Bot className="w-4 h-4 text-indigo-600" />
                      AI Crawlers & LLM Scrapers Access Matrix
                    </h3>
                    <p className="text-xs text-slate-500">
                      Discovered permissions across leading artificial intelligence search agents.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Audited via /robots.txt
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] bg-slate-50/70">
                        <th className="py-2.5 px-3">Crawler Agent</th>
                        <th className="py-2.5 px-3">Engine & Organization</th>
                        <th className="py-2.5 px-3 text-center">Crawler Permission</th>
                        <th className="py-2.5 px-3">AI Search Impact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(data.crawlers?.geo.botPermissions || [
                        { botName: "GPTBot", category: "ai", status: "allowed", description: "OpenAI ChatGPT web crawler & dataset collector" },
                        { botName: "ChatGPT-User", category: "ai", status: "allowed", description: "OpenAI live ChatGPT Search browsing agent" },
                        { botName: "ClaudeBot", category: "ai", status: "allowed", description: "Anthropic Claude training & research crawler" },
                        { botName: "PerplexityBot", category: "ai", status: "allowed", description: "Perplexity AI real-time search engine crawler" },
                        { botName: "Google-Extended", category: "ai", status: "allowed", description: "Google Gemini training & multimodal crawler" },
                        { botName: "Bytespider", category: "ai", status: "allowed", description: "ByteDance / TikTok LLM & search scraper" },
                        { botName: "Googlebot", category: "search", status: "allowed", description: "Primary Google Search indexing crawler" },
                      ]).map((bot: any, bIdx: number) => (
                        <tr key={bIdx} className="hover:bg-slate-50/60">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                            {bot.botName}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {bot.description}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                                bot.status === "blocked"
                                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                                  : bot.status === "allowed"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-blue-50 text-blue-700 border border-blue-200"
                              }`}
                            >
                              {bot.status === "blocked" ? "Blocked ✕" : bot.status === "allowed" ? "Allowed ✓" : "Default Allowed ✓"}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-[11px] text-slate-500 font-mono">
                            {bot.status === "blocked" ? "Excluded from citations" : "Indexable in AI answers"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Robots.txt & Sitemap Directives Inspector Side-by-Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Robots.txt Inspector */}
                <div className="flat-card p-5 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900">
                      /robots.txt Directives
                    </h3>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        data.crawlers?.hasRobotsTxt
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {data.crawlers?.hasRobotsTxt ? "Active (200 OK)" : "Not Detected"}
                    </span>
                  </div>

                  {data.crawlers?.rawRobotsSnippet ? (
                    <div className="space-y-3">
                      <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-[11px] font-mono overflow-x-auto max-h-48 leading-relaxed">
                        <code>{data.crawlers.rawRobotsSnippet}</code>
                      </pre>
                      {data.crawlers.disallowedPaths.length > 0 && (
                        <div className="text-xs text-slate-600">
                          <strong className="text-slate-800">Disallowed Paths:</strong>{" "}
                          <span className="font-mono text-[11px] text-slate-500">
                            {data.crawlers.disallowedPaths.join(", ")}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">
                      No robots.txt file found. Crawlers explore entire website unhindered.
                    </p>
                  )}
                </div>

                {/* Sitemap.xml Inspector */}
                <div className="flat-card p-5 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900">
                      /sitemap.xml Inspector
                    </h3>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        data.crawlers?.sitemap.detected
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {data.crawlers?.sitemap.detected ? "Valid XML Detected" : "Not Found"}
                    </span>
                  </div>

                  {data.crawlers?.sitemap.detected ? (
                    <div className="space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                          <span className="text-[10px] uppercase text-slate-500 font-semibold block">URLs Declared</span>
                          <span className="font-mono font-bold text-slate-900 text-sm">
                            {data.crawlers.sitemap.urlCount} URLs
                          </span>
                        </div>
                        <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                          <span className="text-[10px] uppercase text-slate-500 font-semibold block">Sitemap Type</span>
                          <span className="font-semibold text-slate-900">
                            {data.crawlers.sitemap.isSitemapIndex ? "Sitemap Index" : "Standard URLset"}
                          </span>
                        </div>
                      </div>

                      {data.crawlers.sitemap.sampleUrls.length > 0 && (
                        <div>
                          <span className="text-slate-500 block mb-1 text-[11px]">Discovered XML Entries:</span>
                          <div className="space-y-1 font-mono text-[11px] text-blue-700 bg-slate-50 p-2.5 rounded border border-slate-200 max-h-28 overflow-y-auto">
                            {data.crawlers.sitemap.sampleUrls.map((u: string, uIdx: number) => (
                              <div key={uIdx} className="truncate">{u}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">
                      No XML sitemap could be loaded at /sitemap.xml. Search engines must rely strictly on internal link discovery.
                    </p>
                  )}
                </div>
              </div>

              {/* GEO Strategic Recommendations */}
              <div className="p-5 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-3 text-xs">
                <div className="flex items-center gap-2 font-bold text-indigo-900">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Key Generative Engine Optimization (GEO) Action Items
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="bg-white p-3.5 rounded-lg border border-indigo-100">
                    <strong className="text-slate-900 block mb-1">Key Strengths for AI Citations</strong>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      {(data.crawlers?.geo.strengths || [
                        "Top AI bots have open crawl permissions to parse your content.",
                        "Structured headings provide clean topical section breaks.",
                      ]).map((str: string, sIdx: number) => (
                        <li key={sIdx}>{str}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-indigo-100">
                    <strong className="text-slate-900 block mb-1">Recommended GEO Improvements</strong>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      {(data.crawlers?.geo.recommendations || [
                        "Add FAQPage or Article schema to qualify for direct answer citations.",
                        "Ensure robots.txt explicitly allows ChatGPT-User and PerplexityBot.",
                      ]).map((rec: string, rIdx: number) => (
                        <li key={rIdx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
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
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                        Estimated Monthly Web Visits
                      </span>
                      {data.traffic.modelEngine && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                          {data.traffic.modelEngine}
                        </span>
                      )}
                    </div>
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
                      {data.traffic.tldTier ? `Tier: ${data.traffic.tldTier}` : "Based on verified public signals"}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed mb-6">
                  <strong className="text-slate-800 font-medium">Confidence Basis:</strong> {data.traffic.confidenceReason}
                </div>

                {/* Open PageRank Authority & Global Web Ranking */}
                {data.traffic.openPageRank && (
                  <div className="p-5 bg-gradient-to-br from-indigo-50/70 to-blue-50/50 rounded-2xl border border-indigo-100 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                          <Globe className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                            DomCop Open PageRank & Global Index
                          </h4>
                          <span className="text-[11px] text-slate-500">
                            Deterministic authority benchmark derived from Common Crawl graph
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border uppercase ${
                          data.traffic.openPageRank.isLive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}>
                          {data.traffic.openPageRank.isLive ? "Live API Verified" : "Statistical Baseline"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Metric 1: PageRank Score */}
                      <div className="p-4 bg-white/90 rounded-xl border border-indigo-100/80 shadow-sm">
                        <div className="text-xs text-slate-500 font-medium mb-1">
                          Domain PageRank (0 - 10)
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-2xl font-black text-slate-900 font-mono">
                            {data.traffic.openPageRank.pageRankDecimal !== null
                              ? data.traffic.openPageRank.pageRankDecimal.toFixed(1)
                              : "N/A"}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">/ 10.0</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.max(0, ((data.traffic.openPageRank.pageRankDecimal || 0) / 10) * 100))}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Metric 2: Global Rank */}
                      <div className="p-4 bg-white/90 rounded-xl border border-indigo-100/80 shadow-sm">
                        <div className="text-xs text-slate-500 font-medium mb-1">
                          Estimated Global Web Rank
                        </div>
                        <div className="text-2xl font-black text-slate-900 font-mono mb-1">
                          {data.traffic.openPageRank.rankFormatted}
                        </div>
                        <span className="text-[11px] text-slate-500">
                          Worldwide web visibility tier
                        </span>
                      </div>

                      {/* Metric 3: Authority Classification */}
                      <div className="p-4 bg-white/90 rounded-xl border border-indigo-100/80 shadow-sm">
                        <div className="text-xs text-slate-500 font-medium mb-1">
                          Authority Classification
                        </div>
                        <div className="text-sm font-bold text-indigo-900 mb-1 line-clamp-1">
                          {data.traffic.openPageRank.tier}
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {data.traffic.openPageRank.message || "DomCop 300k query index"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

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

          {/* TAB: SERP & SOCIAL PREVIEW SIMULATOR */}
          {activeTab === "social" && (
            <SerpSocialPreview
              url={data.page.finalUrl}
              domain={data.page.domain}
              title={data.page.title || ""}
              description={data.page.metaDescription || ""}
              ogImage={data.page.openGraph?.image}
              ogTitle={data.page.openGraph?.title}
              ogDescription={data.page.openGraph?.description}
              twitterCard={data.page.twitterCard?.card}
              twitterTitle={data.page.twitterCard?.title}
              twitterDescription={data.page.twitterCard?.description}
              twitterImage={data.page.twitterCard?.image}
            />
          )}

          {/* TAB: FIX-IT & SCHEMA STUDIO */}
          {activeTab === "schema" && (
            <SchemaCodeGenerator
              domain={data.page.domain}
              url={data.page.finalUrl}
              title={data.page.title || ""}
              description={data.page.metaDescription || ""}
            />
          )}

          {/* TAB: BROKEN LINKS (404) ENGINE */}
          {activeTab === "deadlinks" && (
            <LinkCrawlerMatrix
              targetUrl={data.page.finalUrl}
              initialLinks={[
                ...(data.links?.internalLinksSample?.map((l: any) => ({
                  href: l.href,
                  text: l.anchorText,
                  isInternal: true,
                })) || []),
                ...(data.links?.externalLinksSample?.map((l: any) => ({
                  href: l.href,
                  text: l.anchorText,
                  isInternal: false,
                })) || []),
              ]}
            />
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

      {data && (
        <WhiteLabelPdfModal
          isOpen={isWhiteLabelOpen}
          onClose={() => setIsWhiteLabelOpen(false)}
          domain={data.page.domain}
          score={data.audit.overallScore}
          grade={data.audit.grade}
        />
      )}
    </div>
  );
}
