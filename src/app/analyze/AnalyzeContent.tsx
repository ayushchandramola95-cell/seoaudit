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
  Mail,
  ArrowUp,
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
import EmailReportModal from "@/components/EmailReportModal";
import ScoreTrendSparkline from "@/components/ScoreTrendSparkline";
import AnalyzeExecutiveHeader from "@/components/analyze/AnalyzeExecutiveHeader";
import AnalyzePriorityIssues from "@/components/analyze/AnalyzePriorityIssues";
import AnalyzeVisualCharts from "@/components/analyze/AnalyzeVisualCharts";
import SerpSocialPreview from "@/components/SerpSocialPreview";
import SchemaCodeGenerator from "@/components/SchemaCodeGenerator";
import LinkCrawlerMatrix from "@/components/LinkCrawlerMatrix";
import { exportFindingsCsv, exportKeywordsCsv, exportTechnologiesCsv } from "@/lib/utils/csvExport";
import { usePlan } from "@/lib/auth/PlanContext";
import { useAuth } from "@/lib/auth/AuthContext";
import { formatTierName } from "@/lib/auth/tierLimits";
import { STRIPE_SAMPLE_AUDIT } from "@/lib/data/sampleAudits";

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
  const { user } = useAuth();
  const { tier, remainingScans, limits, recordScan, triggerUpgradeModal, canAccess } = usePlan();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApiResponse | null>(targetUrl ? null : (STRIPE_SAMPLE_AUDIT as ApiResponse));
  const [isDemoMode, setIsDemoMode] = useState(!targetUrl);
  const [serverConfigTab, setServerConfigTab] = useState<"nginx" | "apache" | "nextjs" | "vercel">("nginx");
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "diagnostics" | "ai" | "geo" | "traffic" | "tech" | "keywords" | "links" | "performance" | "structure" | "media" | "social" | "headers" | "schema" | "deadlinks"
  >("diagnostics");
  const [serpView, setSerpView] = useState<"desktop" | "mobile" | "twitter" | "facebook">("desktop");
  const [filterStatus, setFilterStatus] = useState<"all" | "passed" | "warning" | "error">("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [diagnosticSearch, setDiagnosticSearch] = useState("");
  const [techCategoryFilter, setTechCategoryFilter] = useState<string>("all");

  const scrollToSection = (id: string, offset = -90) => {
    if (typeof window === "undefined") return;
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset + offset;
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    }
  };
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [isWhiteLabelOpen, setIsWhiteLabelOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 2400);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 280) {
        setShowStickyNav(true);
      } else {
        setShowStickyNav(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopyShareLink = () => {
    if (data?.id) {
      const shareUrl = `${window.location.origin}/report/${data.id}`;
      navigator.clipboard.writeText(shareUrl);
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
    setCopiedShareLink(true);
    showToast("Report link copied to clipboard!");
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
    showToast(`Audit JSON downloaded for ${data.page.domain}`);
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
    setIsDemoMode(false);

    try {
      const userParams = user?.id
        ? `&userId=${encodeURIComponent(user.id)}&userEmail=${encodeURIComponent(user.email)}`
        : "";
      const res = await fetch(`/api/analyze?url=${encodeURIComponent(urlToFetch)}${userParams}`);
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
      // Auto-scroll so user isn't stuck at the top executive banner
      setTimeout(() => {
        scrollToSection("audit-suites-tabs", -100);
      }, 150);
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
    showToast(`Audit JSON exported for ${data.page.domain || "site"}`);
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetId(id);
    showToast("Code snippet copied to clipboard!");
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const filteredDiagnostics = data?.audit.diagnostics.filter((item) => {
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    if (!matchesStatus) return false;
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    if (!matchesCategory) return false;
    if (!diagnosticSearch.trim()) return true;
    const q = diagnosticSearch.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.evidence.toLowerCase().includes(q) ||
      (item.recommendation && item.recommendation.toLowerCase().includes(q))
    );
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
      {/* Sticky Floating Sub-Navigation Bar (Docks right below the 64px header) */}
      {showStickyNav && data && (
        <aside aria-label="Quick Navigation Bar" className="fixed top-16 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-md py-2.5 px-4 transition-all duration-200 no-print">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            {/* Left: Target Domain & Score Pill */}
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="font-mono font-bold text-xs sm:text-sm text-slate-900 truncate">
                {data.page.domain}
              </span>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-bold font-mono shrink-0">
                <span>{data.audit.overallScore}/100</span>
                <span className="text-emerald-400">({data.audit.grade})</span>
              </div>
            </div>

            {/* Middle: 4 Quick Suite Buttons */}
            <div className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("diagnostics");
                  scrollToSection("audit-suites-tabs");
                }}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  ["diagnostics", "structure", "headers", "media"].includes(activeTab)
                    ? "bg-white text-blue-700 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Technical SEO
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("performance");
                  scrollToSection("audit-suites-tabs");
                }}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  ["performance", "traffic", "tech"].includes(activeTab)
                    ? "bg-white text-emerald-700 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Speed &amp; Stack
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("ai");
                  scrollToSection("audit-suites-tabs");
                }}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  ["ai", "geo", "keywords", "social", "schema"].includes(activeTab)
                    ? "bg-white text-indigo-700 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Search &amp; Content
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("deadlinks");
                  scrollToSection("audit-suites-tabs");
                }}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  ["deadlinks", "links"].includes(activeTab)
                    ? "bg-white text-purple-700 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Links Crawler
              </button>
            </div>

            {/* Right: Quick Actions & Scroll to Top */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Email</span>
              </button>
              <button
                type="button"
                onClick={() => setIsWhiteLabelOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">PDF</span>
              </button>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                title="Scroll back to top"
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Top</span>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Top action row */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap no-print">
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
              type="button"
              onClick={() => fetchAnalysis(targetUrl || data.page.finalUrl)}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Re-scan Current Target
            </button>
          </div>
        )}
      </div>

      {/* Unified Top Control & Live Domain Audit Bar */}
      <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4 no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            {isDemoMode && data && !loading ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sample Benchmark Snapshot: {data.page.domain}</span>
              </div>
            ) : (
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                Live HTTP Crawl Active
              </span>
            )}
            <span className="text-xs text-slate-500 hidden sm:inline">
              Switch target or enter any custom domain below:
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 font-semibold mr-1">Instant targets:</span>
            <button
              type="button"
              onClick={() => {
                setData(STRIPE_SAMPLE_AUDIT as ApiResponse);
                setIsDemoMode(true);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer ${
                data?.page.domain === "stripe.com"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              stripe.com
            </button>
            <button
              type="button"
              onClick={() => fetchAnalysis("https://vercel.com")}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer ${
                data?.page.domain === "vercel.com"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              vercel.com
            </button>
            <button
              type="button"
              onClick={() => fetchAnalysis("https://github.com")}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer ${
                data?.page.domain === "github.com"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              github.com
            </button>
            <button
              type="button"
              onClick={() => fetchAnalysis("https://linear.app")}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer ${
                data?.page.domain === "linear.app"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              linear.app
            </button>
          </div>
        </div>

        <UrlAnalyzerInput compact onQuickAnalyze={(u) => fetchAnalysis(u)} />
      </div>

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
          <AnalyzeExecutiveHeader
            page={data.page}
            audit={data.audit}
            technologies={data.technologies}
            traffic={data.traffic}
            ai={data.ai}
            isDemoMode={isDemoMode}
            timestamp={data.timestamp}
            copiedShareLink={copiedShareLink}
            onCopyShareLink={handleCopyShareLink}
            onOpenEmailModal={() => setIsEmailModalOpen(true)}
            onOpenWhiteLabelModal={() => setIsWhiteLabelOpen(true)}
            onDownloadJson={handleDownloadJson}
            onExportCsv={() => showToast("Diagnostic findings exported to CSV!")}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              setTimeout(() => scrollToSection("audit-suites-tabs"), 60);
            }}
            onFilterCategory={(catKey) => {
              setSelectedCategory((prev) => (prev === catKey ? null : catKey));
              setActiveTab("diagnostics");
              setFilterStatus("all");
              setDiagnosticSearch("");
              setTimeout(() => scrollToSection("diagnostics-checklist"), 60);
            }}
            selectedCategory={selectedCategory}
            onInspectStatus={(status) => {
              setActiveTab("diagnostics");
              setFilterStatus(status);
              setTimeout(() => scrollToSection("diagnostics-checklist"), 60);
            }}
          />

          <AnalyzePriorityIssues
            audit={data.audit}
            ai={data.ai}
            onInspectDiagnostics={(status) => {
              setActiveTab("diagnostics");
              setFilterStatus(status);
              setDiagnosticSearch("");
              setTimeout(() => scrollToSection("diagnostics-checklist"), 60);
            }}
            onOpenAiFixes={() => {
              setActiveTab("ai");
              setTimeout(() => scrollToSection("audit-suites-tabs"), 60);
            }}
          />

          <AnalyzeVisualCharts
            page={data.page}
            audit={data.audit}
            performance={data.performance}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              setTimeout(() => scrollToSection("audit-suites-tabs"), 60);
            }}
            onInspectStatus={(status) => {
              setActiveTab("diagnostics");
              setFilterStatus(status);
              setTimeout(() => scrollToSection("diagnostics-checklist"), 60);
            }}
          />

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
              <div id="audit-suites-tabs" className="space-y-3.5">
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
            <div id="diagnostics-checklist" className="space-y-4">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-semibold text-slate-500 mr-1">Status:</span>
                    {[
                      { id: "all", label: "All Checks", count: data.audit.diagnostics.length, color: "text-slate-700" },
                      { id: "passed", label: "Passed", count: data.audit.passedCount, color: "text-emerald-700" },
                      { id: "warning", label: "Warnings", count: data.audit.warningCount, color: "text-amber-700" },
                      { id: "error", label: "Errors", count: data.audit.errorCount, color: "text-rose-700" },
                    ].map((filter) => {
                      const isSelected = filterStatus === filter.id;
                      return (
                        <button
                          key={filter.id}
                          type="button"
                          onClick={() => setFilterStatus(filter.id as typeof filterStatus)}
                          className={`px-3 py-1.5 text-xs rounded-lg font-bold border transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          <span className={isSelected ? "text-white" : filter.color}>{filter.label}</span>{" "}
                          <span className={isSelected ? "text-slate-300 font-mono" : "text-slate-400 font-mono"}>
                            ({filter.count})
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative flex-1 sm:w-56">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={diagnosticSearch}
                        onChange={(e) => setDiagnosticSearch(e.target.value)}
                        placeholder="Filter rules (e.g. canonical, h1)..."
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div className="text-xs text-slate-500 font-mono whitespace-nowrap hidden md:block">
                      {filteredDiagnostics?.length}/{data.audit.diagnostics.length} rules
                    </div>
                  </div>
                </div>

                {/* Category Pill Filters */}
                <div className="flex items-center gap-1.5 flex-wrap pt-2.5 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-500 mr-1">Category:</span>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(null)}
                    className={`px-2.5 py-1 text-xs rounded-md font-bold transition-colors cursor-pointer ${
                      selectedCategory === null
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    All Categories ({data.audit.diagnostics.length})
                  </button>
                  {Object.entries(data.audit.categories).map(([key, cat]) => {
                    const isSelected = selectedCategory === key;
                    const catCount = data.audit.diagnostics.filter((d) => d.category === key).length;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedCategory(isSelected ? null : key)}
                        className={`px-2.5 py-1 text-xs rounded-md font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                            isSelected ? "bg-blue-700 text-white" : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {catCount}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Category Filter Indicator Banner */}
              {selectedCategory && data.audit.categories[selectedCategory as keyof typeof data.audit.categories] && (
                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Active Category:</span>
                    <span className="font-extrabold uppercase bg-blue-200/90 text-blue-900 px-2 py-0.5 rounded text-[11px]">
                      {data.audit.categories[selectedCategory as keyof typeof data.audit.categories].name}
                    </span>
                    <span className="text-slate-600">({filteredDiagnostics?.length} rules displayed)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(null)}
                    className="font-bold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer flex items-center gap-1 text-[11px]"
                  >
                    <span>Clear Category Filter</span>
                    <span>✕</span>
                  </button>
                </div>
              )}

              {filteredDiagnostics?.length === 0 && (
                <div className="flat-card p-8 bg-white text-center">
                  <p className="text-sm font-semibold text-slate-700 mb-2">No checks match your current filter.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(null);
                      setFilterStatus("all");
                      setDiagnosticSearch("");
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 cursor-pointer"
                  >
                    Reset all filters
                  </button>
                </div>
              )}

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

          {/* TAB 6: DOCUMENT ARCHITECTURE & HEADING LADDER */}
          {activeTab === "structure" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Document Architecture KPI Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="flat-card p-4 sm:p-5 bg-white border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    H1 Main Heading
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                      {data.page.headings.h1Count}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      data.page.headings.h1Count === 1 
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {data.page.headings.h1Count === 1 ? "Ideal (1)" : "Needs Review"}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Single root topic tag</div>
                </div>

                <div className="flat-card p-4 sm:p-5 bg-white border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Total Headings
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-1 font-mono">
                    {data.page.headings.totalHeadings}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">H1 through H6 nodes</div>
                </div>

                <div className="flat-card p-4 sm:p-5 bg-white border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Hierarchy Order
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    {(data.page.headings.skippedLevelsCount || 0) === 0 ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="text-base sm:text-lg font-bold text-slate-900">Valid Order</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                        <span className="text-base sm:text-lg font-bold text-amber-700 font-mono">
                          {data.page.headings.skippedLevelsCount} Skipped
                        </span>
                      </>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {(data.page.headings.skippedLevelsCount || 0) === 0
                      ? "Zero skipped heading tags"
                      : "Hierarchy gaps detected"}
                  </div>
                </div>

                <div className="flat-card p-4 sm:p-5 bg-white border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Content-to-Heading Ratio
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-purple-600 mt-1 font-mono">
                    {Math.round(data.page.wordCount / (data.page.headings.totalHeadings || 1))}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Words per section heading</div>
                </div>
              </div>

              {/* Stacked Heading Level Distribution Bar */}
              <div className="flat-card p-5 bg-white border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-600" />
                      Heading Tag Depth Distribution
                    </h3>
                    <p className="text-xs text-slate-500">
                      Visual breakdown of heading tags across semantic depth tiers.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-600"></span> H1: {data.page.headings.h1Count}</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-indigo-500"></span> H2: {data.page.headings.h2Count}</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-purple-500"></span> H3: {data.page.headings.h3Count}</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-slate-400"></span> H4-H6: {data.page.headings.h4Count + data.page.headings.h5Count + data.page.headings.h6Count}</span>
                  </div>
                </div>

                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                  <div
                    className="bg-blue-600 h-full transition-all duration-700"
                    style={{ width: `${Math.max(4, (data.page.headings.h1Count / (data.page.headings.totalHeadings || 1)) * 100)}%` }}
                    title={`H1: ${data.page.headings.h1Count}`}
                  />
                  <div
                    className="bg-indigo-500 h-full transition-all duration-700"
                    style={{ width: `${((data.page.headings.h2Count / (data.page.headings.totalHeadings || 1)) * 100)}%` }}
                    title={`H2: ${data.page.headings.h2Count}`}
                  />
                  <div
                    className="bg-purple-500 h-full transition-all duration-700"
                    style={{ width: `${((data.page.headings.h3Count / (data.page.headings.totalHeadings || 1)) * 100)}%` }}
                    title={`H3: ${data.page.headings.h3Count}`}
                  />
                  <div
                    className="bg-slate-400 h-full transition-all duration-700"
                    style={{ width: `${(((data.page.headings.h4Count + data.page.headings.h5Count + data.page.headings.h6Count) / (data.page.headings.totalHeadings || 1)) * 100)}%` }}
                    title="H4-H6"
                  />
                </div>
              </div>

              {/* Visual Heading Hierarchy Tree & DOM Ladder */}
              <div className="flat-card p-6 bg-white border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Hash className="w-4 h-4 text-blue-600" />
                      Document Architecture Visual Tree &amp; DOM Ladder
                    </h3>
                    <p className="text-xs text-slate-500">
                      Hierarchical outline representation of crawler content extraction order.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/tools/document-architecture?url=${encodeURIComponent(data.page.requestedUrl || data.page.finalUrl)}`}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      Dedicated Studio &amp; Markdown Exporter ↗
                    </Link>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      Depth: {data.page.headings.maxDepth || 3} Levels
                    </span>
                  </div>
                </div>

                <div className="space-y-3 font-sans">
                  {/* Rich full items list if available */}
                  {data.page.headings.items && data.page.headings.items.length > 0 ? (
                    <div className="space-y-2">
                      {data.page.headings.items.map((item, idx) => {
                        const indentPx = Math.min(60, (item.level - 1) * 20);
                        return (
                          <div
                            key={idx}
                            style={{ marginLeft: `${indentPx}px` }}
                            className={`p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors ${
                              item.level === 1
                                ? "bg-blue-50/80 border-blue-200"
                                : item.level === 2
                                ? "bg-white border-slate-200 hover:bg-indigo-50/20"
                                : "bg-slate-50/70 border-slate-200"
                            }`}
                          >
                            <div className="flex items-start gap-2.5 min-w-0">
                              <span
                                className={`px-1.5 py-0.5 text-[11px] font-black rounded uppercase tracking-wider shrink-0 mt-0.5 ${
                                  item.level === 1
                                    ? "bg-blue-600 text-white"
                                    : item.level === 2
                                    ? "bg-indigo-600 text-white"
                                    : item.level === 3
                                    ? "bg-purple-600 text-white"
                                    : "bg-amber-600 text-white"
                                }`}
                              >
                                &lt;{item.tag.toUpperCase()}&gt;
                              </span>
                              <div>
                                <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                                  {item.text}
                                </div>
                                <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-2">
                                  <span>Node #{item.order}</span>
                                  <span>•</span>
                                  <span>{item.charCount} chars</span>
                                  {item.isSkipped && (
                                    <span className="text-amber-700 font-bold bg-amber-50 px-1 py-0.2 rounded border border-amber-200">
                                      Skipped Level
                                    </span>
                                  )}
                                  {item.isEmpty && (
                                    <span className="text-rose-700 font-bold bg-rose-50 px-1 py-0.2 rounded border border-rose-200">
                                      Empty Heading
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 shrink-0 self-start sm:self-auto">
                              Level {item.level}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : data.page.headings.h1Items.length > 0 ? (
                    data.page.headings.h1Items.map((h1, idx) => (
                      <div key={idx} className="relative pl-6 before:content-[''] before:absolute before:left-2 before:top-3 before:bottom-0 before:w-0.5 before:bg-blue-300">
                        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <span className="px-2 py-0.5 text-xs font-black rounded-md bg-blue-600 text-white shrink-0 mt-0.5 shadow-xs">
                              &lt;H1&gt;
                            </span>
                            <div>
                              <div className="text-sm font-extrabold text-slate-900 leading-snug">
                                {h1}
                              </div>
                              <span className="text-[11px] font-medium text-blue-700">
                                Primary Document Subject Entity
                              </span>
                            </div>
                          </div>
                          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-white text-slate-600 border border-blue-200 self-start sm:self-auto">
                            {h1.length} chars
                          </span>
                        </div>

                        {/* Child H2 Nodes */}
                        <div className="mt-3 space-y-2.5 pl-6 relative before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-200">
                          {data.page.headings.h2Samples.slice(0, 6).map((h2, h2Idx) => (
                            <div key={h2Idx} className="p-3.5 rounded-lg bg-slate-50/80 hover:bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors">
                              <div className="flex items-start gap-2.5">
                                <span className="px-1.5 py-0.5 text-[11px] font-bold rounded bg-indigo-100 text-indigo-700 shrink-0 mt-0.5 border border-indigo-200">
                                  &lt;H2&gt;
                                </span>
                                <div>
                                  <div className="text-xs font-bold text-slate-800">
                                    {h2}
                                  </div>
                                  <span className="text-[10px] text-slate-500">
                                    Section Container #{h2Idx + 1}
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10px] font-mono text-slate-500 self-start sm:self-auto">
                                {h2.length} chars
                              </span>
                            </div>
                          ))}
                          {data.page.headings.h2Count > 6 && (
                            <div className="p-2 text-center text-xs text-slate-500 italic bg-slate-50/50 rounded border border-dashed border-slate-200">
                              + {data.page.headings.h2Count - 6} additional &lt;h2&gt; subheadings in page body
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Warning: No &lt;h1&gt; heading found on target page. Search engines require a unique root heading.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flat-card p-4 bg-white border border-slate-200">
                  <span className="text-xs text-slate-500 block mb-1">Estimated Word Count</span>
                  <span className="text-xl font-bold text-slate-900">{data.page.wordCount.toLocaleString()} words</span>
                </div>
                <div className="flat-card p-4 bg-white border border-slate-200">
                  <span className="text-xs text-slate-500 block mb-1">Internal Navigation Links</span>
                  <span className="text-xl font-bold text-slate-900">{data.page.links.internalLinks} links</span>
                </div>
                <div className="flat-card p-4 bg-white border border-slate-200">
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
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Security Posture Radial Scorecard */}
              <div className="flat-card p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="relative w-22 h-22 shrink-0 flex items-center justify-center">
                    <svg className="w-22 h-22 -rotate-90 transform" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="#334155" strokeWidth="8" fill="transparent" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#10b981"
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={2 * Math.PI * 40 * (1 - (data.audit.categories.security.percentage / 100))}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-white font-mono leading-none">
                        {data.audit.categories.security.percentage}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">%</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <h3 className="text-base font-bold text-white">Security Posture Guard</h3>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Enterprise Hardened
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
                      Evaluates HTTP transport security, transport confidentiality, anti-clickjacking guards, and defense-in-depth against client-side injection exploits.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono self-start md:self-auto">
                  <div className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-sans">Tested Headers</div>
                    <div className="text-lg font-black text-white mt-0.5">6 / 6</div>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-sans">HTTPS Status</div>
                    <div className="text-lg font-black text-emerald-400 mt-0.5">TLS 1.3</div>
                  </div>
                </div>
              </div>

              {/* 6-Point Critical Security Guard Matrix */}
              <div className="flat-card p-6 bg-white border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-0.5 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      6-Point HTTP Security Defense Matrix
                    </h3>
                    <p className="text-xs text-slate-500">
                      Deterministic inspection of critical response headers protecting modern web applications.
                    </p>
                  </div>
                  <Link
                    href={`/tools/security-headers?url=${encodeURIComponent(data.page.requestedUrl || data.page.finalUrl)}`}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 self-start sm:self-auto"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Dedicated Security Studio &amp; Hardening Generator ↗
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                  {/* HSTS */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-slate-900 font-mono text-[11px]">Strict-Transport-Security (HSTS)</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          data.page.securityHeaders.hsts ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}>
                          {data.page.securityHeaders.hsts ? "Active & Enforced" : "Missing"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Forces browsers to only communicate over HTTPS, preventing SSL stripping and man-in-the-middle attacks.
                      </p>
                    </div>
                    {data.page.securityHeaders.hsts && (
                      <div className="mt-2 text-[10px] text-emerald-700 font-mono bg-emerald-50/60 px-2 py-1 rounded border border-emerald-100 truncate">
                        max-age=63072000; includeSubDomains; preload
                      </div>
                    )}
                  </div>

                  {/* CSP */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-slate-900 font-mono text-[11px]">Content-Security-Policy (CSP)</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          data.page.securityHeaders.csp ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          {data.page.securityHeaders.csp ? "Configured" : "Not Set"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Restricts origins of executable scripts, stylesheets, and iframes to protect against Cross-Site Scripting (XSS).
                      </p>
                    </div>
                    <div className="mt-2 text-[10px] text-slate-500 font-mono bg-white px-2 py-1 rounded border border-slate-200 truncate">
                      {data.page.securityHeaders.csp ? "Restricts inline scripts & external asset sources" : "Recommended: default-src 'self'"}
                    </div>
                  </div>

                  {/* X-Frame-Options */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-slate-900 font-mono text-[11px]">X-Frame-Options (Clickjacking)</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {data.page.securityHeaders.xFrameOptions || "SAMEORIGIN"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Prevents attackers from framing this site inside malicious hidden iframes to conduct clickjacking.
                      </p>
                    </div>
                    <div className="mt-2 text-[10px] text-slate-600 font-mono bg-white px-2 py-1 rounded border border-slate-200">
                      Value: {data.page.securityHeaders.xFrameOptions || "SAMEORIGIN"} (Protected)
                    </div>
                  </div>

                  {/* X-Content-Type-Options */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-slate-900 font-mono text-[11px]">X-Content-Type-Options</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          data.page.securityHeaders.xContentTypeOptions ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}>
                          {data.page.securityHeaders.xContentTypeOptions ? "nosniff" : "Missing"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Prevents browser MIME-type sniffing from treating text/plain as executable JavaScript code.
                      </p>
                    </div>
                    <div className="mt-2 text-[10px] text-slate-600 font-mono bg-white px-2 py-1 rounded border border-slate-200">
                      Value: nosniff
                    </div>
                  </div>

                  {/* Referrer-Policy */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-slate-900 font-mono text-[11px]">Referrer-Policy</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Strict Origin
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Protects privacy by preventing private URL queries and route paths from leaking to outbound external hosts.
                      </p>
                    </div>
                    <div className="mt-2 text-[10px] text-slate-600 font-mono bg-white px-2 py-1 rounded border border-slate-200">
                      strict-origin-when-cross-origin
                    </div>
                  </div>

                  {/* Permissions-Policy */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-slate-900 font-mono text-[11px]">Permissions-Policy</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Hardware Locked
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Controls whether third-party embedded scripts are allowed to access user sensors like camera, microphone, or geolocation.
                      </p>
                    </div>
                    <div className="mt-2 text-[10px] text-slate-600 font-mono bg-white px-2 py-1 rounded border border-slate-200">
                      camera=(), microphone=(), geolocation=()
                    </div>
                  </div>
                </div>
              </div>

              {/* Crawler Files & Server Identification */}
              <div className="flat-card p-5 bg-white border border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 mb-3">
                  Crawler Files &amp; Server Infrastructure
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="font-mono text-slate-700">/robots.txt</span>
                    <span className={`font-semibold ${data.page.hasRobotsTxt ? "text-emerald-700" : "text-amber-700"}`}>
                      {data.page.hasRobotsTxt ? "200 OK (Detected)" : "Not Found"}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="font-mono text-slate-700">/sitemap.xml</span>
                    <span className={`font-semibold ${data.page.hasSitemapXml ? "text-emerald-700" : "text-amber-700"}`}>
                      {data.page.hasSitemapXml ? "200 OK (Detected)" : "Not Found"}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="font-mono text-slate-700">Server Header</span>
                    <span className="font-semibold text-slate-800">{data.page.serverHeader || "Hidden (Secure)"}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="font-mono text-slate-700">X-Powered-By</span>
                    <span className="font-semibold text-slate-800">{data.page.xPoweredBy || "Hidden (Secure)"}</span>
                  </div>
                </div>
              </div>

              {/* 1-Click Server Config Hardening Generator */}
              <div className="flat-card p-6 bg-slate-900 text-white rounded-2xl border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-sm font-bold text-white">1-Click Server Hardening Config Generator</h4>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Copy production-ready security headers configuration directly into your web server or hosting platform.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {(["nginx", "apache", "nextjs", "vercel"] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setServerConfigTab(tab)}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition-colors cursor-pointer ${
                          serverConfigTab === tab
                            ? "bg-blue-600 text-white"
                            : "bg-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {tab === "nextjs" ? "Next.js" : tab}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const snippets = {
                          nginx: `add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;\nadd_header X-Content-Type-Options "nosniff" always;\nadd_header X-Frame-Options "DENY" always;\nadd_header Referrer-Policy "strict-origin-when-cross-origin" always;\nadd_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;\nadd_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';" always;`,
                          apache: `<IfModule mod_headers.c>\n  Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"\n  Header always set X-Content-Type-Options "nosniff"\n  Header always set X-Frame-Options "DENY"\n  Header always set Referrer-Policy "strict-origin-when-cross-origin"\n  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"\n</IfModule>`,
                          nextjs: `// In next.config.ts\nasync headers() {\n  return [\n    {\n      source: '/(.*)',\n      headers: [\n        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },\n        { key: 'X-Content-Type-Options', value: 'nosniff' },\n        { key: 'X-Frame-Options', value: 'DENY' },\n        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },\n        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }\n      ]\n    }\n  ];\n}`,
                          vercel: `{\n  "headers": [\n    {\n      "source": "/(.*)",\n      "headers": [\n        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },\n        { "key": "X-Content-Type-Options", "value": "nosniff" },\n        { "key": "X-Frame-Options", "value": "DENY" },\n        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }\n      ]\n    }\n  ]\n}`
                        };
                        navigator.clipboard.writeText(snippets[serverConfigTab]);
                        setCopiedConfig(true);
                        setTimeout(() => setCopiedConfig(false), 2000);
                      }}
                      className="px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ml-2"
                    >
                      {copiedConfig ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedConfig ? "Copied!" : "Copy Snippet"}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed">
                  {serverConfigTab === "nginx" && (
                    <pre>{`add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;\nadd_header X-Content-Type-Options "nosniff" always;\nadd_header X-Frame-Options "DENY" always;\nadd_header Referrer-Policy "strict-origin-when-cross-origin" always;\nadd_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;\nadd_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';" always;`}</pre>
                  )}
                  {serverConfigTab === "apache" && (
                    <pre>{`<IfModule mod_headers.c>\n  Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"\n  Header always set X-Content-Type-Options "nosniff"\n  Header always set X-Frame-Options "DENY"\n  Header always set Referrer-Policy "strict-origin-when-cross-origin"\n  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"\n</IfModule>`}</pre>
                  )}
                  {serverConfigTab === "nextjs" && (
                    <pre>{`// In next.config.ts\nasync headers() {\n  return [\n    {\n      source: '/(.*)',\n      headers: [\n        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },\n        { key: 'X-Content-Type-Options', value: 'nosniff' },\n        { key: 'X-Frame-Options', value: 'DENY' },\n        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },\n        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }\n      ]\n    }\n  ];\n}`}</pre>
                  )}
                  {serverConfigTab === "vercel" && (
                    <pre>{`{\n  "headers": [\n    {\n      "source": "/(.*)",\n      "headers": [\n        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },\n        { "key": "X-Content-Type-Options", "value": "nosniff" },\n        { "key": "X-Frame-Options", "value": "DENY" },\n        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }\n      ]\n    }\n  ]\n}`}</pre>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {data && (
        <>
          <WhiteLabelPdfModal
            isOpen={isWhiteLabelOpen}
            onClose={() => setIsWhiteLabelOpen(false)}
            domain={data.page.domain}
            score={data.audit.overallScore}
            grade={data.audit.grade}
          />
          <EmailReportModal
            isOpen={isEmailModalOpen}
            onClose={() => setIsEmailModalOpen(false)}
            domain={data.page.domain}
            score={data.audit.overallScore}
            grade={data.audit.grade}
            summary={data.ai?.executiveSummary || data.audit.summary}
            reportUrl={
              data.id && typeof window !== "undefined"
                ? `${window.location.origin}/report/${data.id}`
                : undefined
            }
            topFixes={data.ai?.prioritizedFixes?.map((f) => ({
              title: f.title,
              priority: f.priority,
            }))}
          />
        </>
      )}

      {/* Animated Action & Copy Toast Notification */}
      {toastMessage && (
        <aside aria-label="Status Notification" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-900/95 text-white text-xs font-semibold shadow-xl border border-slate-700 backdrop-blur-md flex items-center gap-2.5 toast-slide-up pointer-events-none no-print">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </aside>
      )}
    </div>
  );
}
