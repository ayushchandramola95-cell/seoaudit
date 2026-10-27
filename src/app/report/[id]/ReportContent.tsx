"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Globe,
  GitCompare,
  ArrowRight,
  Share2,
  Printer,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Server,
  Zap,
  BarChart3,
  Cpu,
  Layers,
  Sparkles,
  Monitor,
  Hash,
  FileText,
  BookOpen,
  Download,
  Mail,
} from "lucide-react";
import WhiteLabelPdfModal from "@/components/WhiteLabelPdfModal";
import EmailReportModal from "@/components/EmailReportModal";
import { exportFindingsCsv } from "@/lib/utils/csvExport";
import { STRIPE_SAMPLE_AUDIT } from "@/lib/data/sampleAudits";

interface ReportContentProps {
  id: string;
}

interface ScanData {
  id: string;
  domain: string;
  targetUrl: string;
  seoScore: number;
  grade: string;
  responseTimeMs: number;
  perfScore: number | null;
  techCount: number;
  trafficRange: string;
  createdAt: string;
  fullReportJson: {
    page?: {
      title?: string;
      metaDescription?: string;
      canonicalUrl?: string;
      wordCount?: number;
      headings?: { h1Count: number; h2Count: number; h3Count: number };
      ssl?: { valid: boolean; protocol?: string };
    };
    audit?: {
      overallScore: number;
      grade: string;
      categoryScores: {
        metadata: number;
        content: number;
        indexability: number;
        security: number;
      };
      checks: Array<{
        name: string;
        category: string;
        passed: boolean;
        importance: string;
        message: string;
        recommendation?: string;
      }>;
    };
    technologies?: Array<{ name: string; category: string }>;
    keywords?: {
      totalWords: number;
      uniqueWords: number;
      lexicalDiversity: number;
      readingTimeMinutes: number;
      topSingleKeywords: Array<{
        phrase: string;
        count: number;
        density: number;
        inTitle: boolean;
        inH1: boolean;
      }>;
      topTwoWordPhrases: Array<{
        phrase: string;
        count: number;
        density: number;
      }>;
      warnings: string[];
    };
    performance?: {
      scores: { performance: number };
      metrics: {
        fcp: { displayValue: string; score: number };
        lcp: { displayValue: string; score: number };
        cls: { displayValue: string; score: number };
        tbt: { displayValue: string; score: number };
      };
    };
    traffic?: {
      formattedRange: string;
      confidence: number;
      confidenceTier: string;
      breakdown: { organic: number; direct: number; referral: number; social: number };
    };
    ai?: {
      executiveSummary: string;
      keyStrengths: string[];
      criticalGaps: string[];
      prioritizedActionItems: Array<{
        title: string;
        priority: string;
        rationale: string;
        codeSnippet?: string;
      }>;
    };
  };
}

interface ComparisonData {
  id: string;
  siteADomain: string;
  siteBDomain: string;
  siteAScore: number;
  siteBScore: number;
  seoDiff: number;
  createdAt: string;
  fullReportJson: {
    siteA: {
      page: { domain: string };
      audit: { overallScore: number; grade: string };
      technologies: Array<{ name: string; category: string }>;
    };
    siteB: {
      page: { domain: string };
      audit: { overallScore: number; grade: string };
      technologies: Array<{ name: string; category: string }>;
    };
    deltas: {
      seoScoreDiff: number;
      responseTimeDiffMs: number;
      performanceScoreDiff: number;
      lcpDiffMs: number;
    };
    categoryWinners: Record<string, string>;
    techComparison: {
      shared: string[];
      uniqueToA: string[];
      uniqueToB: string[];
    };
    aiComparativeSummary?: {
      headline: string;
      overview: string;
      strengthsSiteA: string[];
      strengthsSiteB: string[];
      conclusion: string;
    };
  };
}

export default function ReportContent({ id }: ReportContentProps) {
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState<"scan" | "comparison" | null>(null);
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isWhiteLabelOpen, setIsWhiteLabelOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  useEffect(() => {
    async function fetchReport() {
      setLoading(true);
      try {
        const res = await fetch(`/api/report/${encodeURIComponent(id)}`);
        const json = await res.json();
        if (json.success) {
          setReportType(json.type);
          if (json.type === "scan") {
            setScanData(json.data);
          } else {
            setComparisonData(json.data);
          }
        } else {
          setError(json.error || "Report not found.");
        }
      } catch (err: unknown) {
        setError((err as Error)?.message || "Failed to load report.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchReport();
    }
  }, [id]);

  function copyShareLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handlePrint() {
    window.print();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-slate-600">Retrieving permanent audit snapshot...</p>
        </div>
      </div>
    );
  }

  const handleLoadDemoReport = () => {
    setError(null);
    setReportType("scan");
    setScanData({
      id: "sample-stripe-enterprise",
      domain: STRIPE_SAMPLE_AUDIT.page.domain,
      targetUrl: STRIPE_SAMPLE_AUDIT.page.requestedUrl,
      seoScore: STRIPE_SAMPLE_AUDIT.audit.overallScore,
      grade: STRIPE_SAMPLE_AUDIT.audit.grade,
      responseTimeMs: STRIPE_SAMPLE_AUDIT.page.responseTimeMs,
      perfScore: STRIPE_SAMPLE_AUDIT.performance.scores.performance,
      techCount: STRIPE_SAMPLE_AUDIT.technologies.length,
      trafficRange: STRIPE_SAMPLE_AUDIT.traffic.formattedRange,
      createdAt: STRIPE_SAMPLE_AUDIT.timestamp,
      fullReportJson: STRIPE_SAMPLE_AUDIT as any,
    });
  };

  if (error || (!scanData && !comparisonData)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-md w-full text-center shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-200">
            <Globe className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Audit Snapshot Not Found</h2>
          <p className="text-sm text-slate-600">
            {error || "The requested audit report ID does not exist in the database or has expired."}
          </p>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={handleLoadDemoReport}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              Preview Enterprise Reference Report (Stripe.com)
            </button>
            <div className="flex gap-2">
              <Link
                href="/dashboard"
                className="w-1/2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors text-center"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/analyze"
                className="w-1/2 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors text-center"
              >
                Run New Audit
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Control Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Permanent Snapshot
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                Public Technical Diagnostic (Mode A)
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {scanData
                  ? new Date(scanData.createdAt).toLocaleString()
                  : comparisonData
                  ? new Date(comparisonData.createdAt).toLocaleString()
                  : ""}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              {reportType === "scan" ? (
                <>
                  <Globe className="w-6 h-6 text-blue-600" />
                  Audit Report: <span className="font-mono text-blue-700">{scanData?.domain}</span>
                </>
              ) : (
                <>
                  <GitCompare className="w-6 h-6 text-purple-600" />
                  Competitor Benchmark:{" "}
                  <span className="font-mono text-blue-700">{comparisonData?.siteADomain}</span> vs{" "}
                  <span className="font-mono text-purple-700">{comparisonData?.siteBDomain}</span>
                </>
              )}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Public technical audit snapshot. First-party analytics and connected telemetry (GSC / GA4) are strictly isolated to verified owner dashboards and excluded from public shareable links.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={copyShareLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Link Copied!" : "Copy Share Link"}
            </button>

            <button
              onClick={() => setIsEmailModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-600" />
              Email Report
            </button>

            <button
              onClick={() => setIsWhiteLabelOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-blue-600" />
              White-Label Client PDF
            </button>

            {reportType === "scan" && scanData && (
              <button
                onClick={() => {
                  const rawJson = scanData.fullReportJson as any;
                  const diagnostics = rawJson?.diagnostics || [];
                  exportFindingsCsv(
                    scanData.domain,
                    scanData.seoScore,
                    scanData.grade,
                    diagnostics.map((d: any) => ({
                      id: d.id,
                      category: d.category,
                      label: d.title || d.label,
                      status: d.status,
                      score: d.score || d.pointsEarned || 0,
                      maxScore: d.maxScore || d.maxPoints || 0,
                      message: d.message || d.evidence || "",
                      details: d.details || d.recommendation || "",
                    }))
                  );
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                Export CSV
              </button>
            )}

            {reportType === "scan" && scanData && (
              <Link
                href={`/analyze?url=${encodeURIComponent(scanData.domain)}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Re-scan Now
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            {reportType === "comparison" && comparisonData && (
              <Link
                href={`/compare?siteA=${encodeURIComponent(
                  comparisonData.siteADomain
                )}&siteB=${encodeURIComponent(comparisonData.siteBDomain)}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Re-compare Now
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* ------------------- SCAN VIEW ------------------- */}
        {reportType === "scan" && scanData && (
          <div className="space-y-6">
            {/* Top Score Summary Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4">
                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="26" stroke="#f1f5f9" strokeWidth="5" fill="none" />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke={scanData.seoScore >= 80 ? "#10b981" : scanData.seoScore >= 60 ? "#f59e0b" : "#ef4444"}
                      strokeWidth="5"
                      strokeDasharray={163.36}
                      strokeDashoffset={163.36 - (163.36 * scanData.seoScore) / 100}
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-base font-black text-slate-900 leading-none">{scanData.seoScore}</span>
                    <span className="text-[9px] font-bold text-slate-400">/100</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase text-slate-500">Overall SEO Score</div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-black ${
                        scanData.seoScore >= 80
                          ? "bg-emerald-100 text-emerald-800"
                          : scanData.seoScore >= 60
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      Grade: {scanData.grade}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500 font-mono">
                    {scanData.seoScore >= 80 ? "Audit Passed" : "Needs Review"}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="text-xs font-semibold uppercase text-slate-500">Server Latency</div>
                <div className="mt-2 text-3xl font-extrabold text-slate-900 font-mono">
                  {scanData.responseTimeMs}
                  <span className="text-sm font-sans font-normal text-slate-500 ml-1">ms</span>
                </div>
                <div className="mt-1 text-xs text-slate-500">Time to first HTML byte (TTFB)</div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="text-xs font-semibold uppercase text-slate-500">Technologies Detected</div>
                <div className="mt-2 text-3xl font-extrabold text-slate-900">{scanData.techCount}</div>
                <div className="mt-1 text-xs text-slate-500">Frameworks, CMS, analytics, CDNs</div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="text-xs font-semibold uppercase text-slate-500">Estimated Monthly Visits</div>
                <div className="mt-2 text-xl font-bold text-slate-900 font-mono truncate">
                  {scanData.trafficRange}
                </div>
                <div className="mt-1 text-xs text-slate-500">Transparent heuristic model</div>
              </div>
            </div>

            {/* Category Scores */}
            {scanData.fullReportJson.audit && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-base font-bold text-slate-900 mb-4">Core SEO Category Scores</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.entries(scanData.fullReportJson.audit.categoryScores).map(
                    ([cat, score]) => (
                      <div key={cat} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase text-slate-500 capitalize">{cat}</span>
                          <span className="text-xs font-bold text-slate-900">{score}/25</span>
                        </div>
                        <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              score >= 20 ? "bg-emerald-500" : score >= 15 ? "bg-blue-500" : "bg-amber-500"
                            }`}
                            style={{ width: `${(score / 25) * 100}%` }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* AI Executive Summary */}
            {scanData.fullReportJson.ai && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">AI Diagnostic Summary</h2>
                    <p className="text-xs text-slate-500">
                      Grounded interpretation of measured technical data.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 leading-relaxed">
                  {scanData.fullReportJson.ai.executiveSummary}
                </div>

                {/* Prioritized Action Items */}
                {scanData.fullReportJson.ai.prioritizedActionItems && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-900">Prioritized Technical Action Items</h3>
                    <div className="space-y-3">
                      {scanData.fullReportJson.ai.prioritizedActionItems.map((item, idx) => (
                        <div key={idx} className="p-4 bg-white border border-slate-200 rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-900">{item.title}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                item.priority === "high"
                                  ? "bg-rose-100 text-rose-800"
                                  : item.priority === "medium"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {item.priority.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{item.rationale}</p>
                          {item.codeSnippet && (
                            <pre className="p-2.5 bg-slate-900 text-slate-100 rounded text-xs font-mono overflow-x-auto">
                              <code>{item.codeSnippet}</code>
                            </pre>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

              {/* Detected Technology Pills */}
            {scanData.fullReportJson.technologies && scanData.fullReportJson.technologies.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  Detected Technology Stack ({scanData.fullReportJson.technologies.length})
                </h2>
                <div className="flex flex-wrap gap-2">
                  {scanData.fullReportJson.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                    >
                      {tech.name} <span className="text-slate-400 font-normal">({tech.category})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* SERP Search Result Snippet Simulation */}
            {scanData.fullReportJson.page && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-blue-600" />
                    Google SERP Search Result Snippet
                  </h2>
                  <span className="text-xs text-slate-500 font-mono">Simulated Organic Impression</span>
                </div>

                <div className="p-5 bg-white border border-slate-200 rounded-xl max-w-2xl">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                      {scanData.domain.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-[12px] text-slate-900 font-medium">{scanData.domain}</div>
                      <div className="text-[11px] text-slate-500 font-mono truncate max-w-md">
                        {scanData.fullReportJson.page.canonicalUrl || scanData.targetUrl}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-[18px] text-[#1a0dab] font-normal leading-snug line-clamp-1 mb-1">
                    {scanData.fullReportJson.page.title || `${scanData.domain} - Official Homepage`}
                  </h3>

                  <p className="text-[13px] text-[#4d5156] leading-relaxed line-clamp-2">
                    {scanData.fullReportJson.page.metaDescription || (
                      <span className="italic text-slate-400">
                        No meta description tag provided on target page.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Keyword Density & Vocabulary Breakdown */}
            {scanData.fullReportJson.keywords && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-indigo-600" />
                    On-Page Keyword Density & Vocabulary Profile
                  </h2>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
                    {scanData.fullReportJson.keywords.totalWords.toLocaleString()} Indexable Words
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-slate-500 font-semibold uppercase text-[10px]">Total Words</div>
                    <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">
                      {scanData.fullReportJson.keywords.totalWords.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-slate-500 font-semibold uppercase text-[10px]">Unique Terms</div>
                    <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">
                      {scanData.fullReportJson.keywords.uniqueWords.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-slate-500 font-semibold uppercase text-[10px]">Lexical Variety</div>
                    <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">
                      {(scanData.fullReportJson.keywords.lexicalDiversity * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="text-slate-500 font-semibold uppercase text-[10px]">Reading Time</div>
                    <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">
                      {scanData.fullReportJson.keywords.readingTimeMinutes} min
                    </div>
                  </div>
                </div>

                {scanData.fullReportJson.keywords.topSingleKeywords &&
                  scanData.fullReportJson.keywords.topSingleKeywords.length > 0 && (
                    <div className="overflow-x-auto border border-slate-200 rounded-lg">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                            <th className="py-2 px-3">Keyword</th>
                            <th className="py-2 px-3 text-right">Count</th>
                            <th className="py-2 px-3">Density</th>
                            <th className="py-2 px-3 text-center">In Title</th>
                            <th className="py-2 px-3 text-center">In H1</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {scanData.fullReportJson.keywords.topSingleKeywords.slice(0, 8).map((kw, kIdx) => (
                            <tr key={kIdx} className="hover:bg-slate-50">
                              <td className="py-2 px-3 font-semibold text-slate-900 font-mono">{kw.phrase}</td>
                              <td className="py-2 px-3 text-right font-mono text-slate-600">{kw.count}×</td>
                              <td className="py-2 px-3 font-mono text-blue-700 font-semibold">{kw.density.toFixed(2)}%</td>
                              <td className="py-2 px-3 text-center">
                                {kw.inTitle ? (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                    Yes
                                  </span>
                                ) : (
                                  <span className="text-slate-300">✕</span>
                                )}
                              </td>
                              <td className="py-2 px-3 text-center">
                                {kw.inH1 ? (
                                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                                    Yes
                                  </span>
                                ) : (
                                  <span className="text-slate-300">✕</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
              </div>
            )}
          </div>
        )}

        {/* ------------------- COMPARISON VIEW ------------------- */}
        {reportType === "comparison" && comparisonData && (
          <div className="space-y-6">
            {/* Head-to-Head Scoreboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-sm">
                <div className="text-xs font-semibold uppercase text-blue-600">Website A</div>
                <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
                  {comparisonData.siteADomain}
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-blue-700">{comparisonData.siteAScore}</span>
                  <span className="text-sm text-slate-500">/ 100</span>
                </div>
              </div>

              <div className="bg-white border border-purple-200 rounded-xl p-6 shadow-sm">
                <div className="text-xs font-semibold uppercase text-purple-600">Website B</div>
                <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
                  {comparisonData.siteBDomain}
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-purple-700">{comparisonData.siteBScore}</span>
                  <span className="text-sm text-slate-500">/ 100</span>
                </div>
              </div>
            </div>

            {/* Leader Badge */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <span className="text-sm font-bold text-emerald-800">
                {comparisonData.seoDiff > 0
                  ? `🏆 ${comparisonData.siteADomain} leads by +${comparisonData.seoDiff} SEO points!`
                  : comparisonData.seoDiff < 0
                  ? `🏆 ${comparisonData.siteBDomain} leads by +${Math.abs(comparisonData.seoDiff)} SEO points!`
                  : "🤝 Both websites have equal overall SEO scores!"}
              </span>
            </div>

            {/* AI Comparative Summary */}
            {comparisonData.fullReportJson.aiComparativeSummary && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  {comparisonData.fullReportJson.aiComparativeSummary.headline}
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                  {comparisonData.fullReportJson.aiComparativeSummary.overview}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-lg">
                    <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
                      {comparisonData.siteADomain} Strengths
                    </h4>
                    <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                      {comparisonData.fullReportJson.aiComparativeSummary.strengthsSiteA.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-purple-50/50 border border-purple-200 rounded-lg">
                    <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider mb-2">
                      {comparisonData.siteBDomain} Strengths
                    </h4>
                    <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
                      {comparisonData.fullReportJson.aiComparativeSummary.strengthsSiteB.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {(scanData || comparisonData) && (
          <>
            <WhiteLabelPdfModal
              isOpen={isWhiteLabelOpen}
              onClose={() => setIsWhiteLabelOpen(false)}
              domain={
                scanData
                  ? scanData.domain
                  : comparisonData
                  ? `${comparisonData.siteADomain} vs ${comparisonData.siteBDomain}`
                  : "Domain"
              }
              score={
                scanData
                  ? scanData.seoScore
                  : comparisonData
                  ? Math.round((comparisonData.siteAScore + comparisonData.siteBScore) / 2)
                  : 85
              }
              grade={scanData ? scanData.grade : "A"}
            />
            <EmailReportModal
              isOpen={isEmailModalOpen}
              onClose={() => setIsEmailModalOpen(false)}
              domain={
                scanData
                  ? scanData.domain
                  : comparisonData
                  ? `${comparisonData.siteADomain} vs ${comparisonData.siteBDomain}`
                  : "Domain"
              }
              score={
                scanData
                  ? scanData.seoScore
                  : comparisonData
                  ? Math.round((comparisonData.siteAScore + comparisonData.siteBScore) / 2)
                  : 85
              }
              grade={scanData ? scanData.grade : "A"}
              summary={
                scanData
                  ? scanData.fullReportJson.ai?.executiveSummary
                  : comparisonData?.fullReportJson.aiComparativeSummary?.overview
              }
              topFixes={scanData?.fullReportJson.ai?.prioritizedActionItems?.map((item) => ({
                title: item.title,
                priority: item.priority,
              }))}
            />
          </>
        )}
      </div>
    </div>
  );
}
