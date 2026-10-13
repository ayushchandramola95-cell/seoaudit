"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileSearch,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  GitCompare,
  TrendingUp,
  Download,
  Copy,
  Check,
  Play,
  RefreshCw,
  AlertCircle,
  XCircle,
  CheckCircle2,
  Layers,
  FileText,
  BookOpen,
  Hash,
  ExternalLink,
} from "lucide-react";
import { usePlan } from "@/lib/auth/PlanContext";
import { formatTierName } from "@/lib/auth/tierLimits";

interface KeywordItem {
  term: string;
  targetCount: number;
  competitorCount: number;
  gapStatus: "missing" | "shared" | "lead";
}

interface ContentGapData {
  success: boolean;
  timestamp: string;
  target: {
    domain: string;
    url: string;
    wordCount: number;
    title: string;
    h1Count: number;
    h2Count: number;
  };
  competitor: {
    domain: string;
    url: string;
    wordCount: number;
    title: string;
    h1Count: number;
    h2Count: number;
  };
  gapSummary: {
    missingKeywordsCount: number;
    sharedKeywordsCount: number;
    targetLeadsCount: number;
    wordDisparity: number;
    topicCoverageScore: number;
  };
  missingKeywords: KeywordItem[];
  sharedKeywords: KeywordItem[];
  targetLeads: KeywordItem[];
  missingTopics: string[];
  suggestedOutline: Array<{
    heading: string;
    recommendedKeywords: string[];
    importance: string;
  }>;
}

const DEMO_GAP: ContentGapData = {
  success: true,
  timestamp: new Date().toISOString(),
  target: {
    domain: "stripe.com",
    url: "https://stripe.com",
    wordCount: 2480,
    title: "Financial Infrastructure for the Internet",
    h1Count: 1,
    h2Count: 12,
  },
  competitor: {
    domain: "paypal.com",
    url: "https://paypal.com",
    wordCount: 3120,
    title: "Digital Wallets, Money Management and Payments",
    h1Count: 1,
    h2Count: 16,
  },
  gapSummary: {
    missingKeywordsCount: 18,
    sharedKeywordsCount: 42,
    targetLeadsCount: 26,
    wordDisparity: 640,
    topicCoverageScore: 74,
  },
  missingKeywords: [
    { term: "buyer protection guarantee", targetCount: 0, competitorCount: 8, gapStatus: "missing" },
    { term: "peer-to-peer money transfer", targetCount: 0, competitorCount: 6, gapStatus: "missing" },
    { term: "consumer digital wallet app", targetCount: 0, competitorCount: 9, gapStatus: "missing" },
    { term: "crypto checkout settlement", targetCount: 0, competitorCount: 4, gapStatus: "missing" },
    { term: "point of sale card reader hardware", targetCount: 0, competitorCount: 5, gapStatus: "missing" },
    { term: "cross-border currency conversion rate", targetCount: 0, competitorCount: 7, gapStatus: "missing" },
  ],
  sharedKeywords: [
    { term: "online payments", targetCount: 14, competitorCount: 18, gapStatus: "shared" },
    { term: "fraud detection radar", targetCount: 8, competitorCount: 6, gapStatus: "shared" },
    { term: "merchant accounts", targetCount: 6, competitorCount: 12, gapStatus: "shared" },
    { term: "recurring billing invoices", targetCount: 11, competitorCount: 8, gapStatus: "shared" },
  ],
  targetLeads: [
    { term: "developer api endpoints", targetCount: 16, competitorCount: 2, gapStatus: "lead" },
    { term: "webhooks latency", targetCount: 9, competitorCount: 0, gapStatus: "lead" },
    { term: "saas subscription billing", targetCount: 14, competitorCount: 3, gapStatus: "lead" },
  ],
  missingTopics: [
    "Consumer Buyer Protection Program",
    "Physical Point of Sale Hardware Kits",
    "QR Code Contactless In-Store Checkout",
    "Global Currency Exchange Rate Calculator",
  ],
  suggestedOutline: [
    {
      heading: "Comprehensive Consumer Protection & Dispute Handling",
      recommendedKeywords: ["buyer protection guarantee", "chargeback protection", "resolution center"],
      importance: "High Commercial Value",
    },
    {
      heading: "In-Person Point of Sale & Terminal SDK Integrations",
      recommendedKeywords: ["point of sale card reader hardware", "tap to pay on iPhone", "omnichannel payments"],
      importance: "High Search Volume",
    },
  ],
};

const SAMPLE_PAIRS = [
  { target: "https://stripe.com", competitor: "https://paypal.com", label: "Stripe vs PayPal" },
  { target: "https://vercel.com", competitor: "https://netlify.com", label: "Vercel vs Netlify" },
  { target: "https://supabase.com", competitor: "https://firebase.google.com", label: "Supabase vs Firebase" },
];

export default function ContentGapClient() {
  const { tier, triggerUpgradeModal, canAccess } = usePlan();
  const [targetUrl, setTargetUrl] = useState("https://stripe.com");
  const [competitorUrl, setCompetitorUrl] = useState("https://paypal.com");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ContentGapData | null>(DEMO_GAP);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"missing" | "topics" | "outline" | "shared">("missing");
  const [copiedTerm, setCopiedTerm] = useState<string | null>(null);

  const handleSelectSample = (t: string, c: string) => {
    setTargetUrl(t);
    setCompetitorUrl(c);
  };

  const handleRunAnalysis = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!targetUrl.trim() || !competitorUrl.trim()) {
      setError("Please specify both Your Webpage and Competitor Webpage URLs.");
      return;
    }

    const isSample = SAMPLE_PAIRS.some(
      (p) =>
        targetUrl.toLowerCase().includes(p.target) || competitorUrl.toLowerCase().includes(p.competitor)
    );

    if (tier === "free" && !isSample) {
      triggerUpgradeModal({
        requiredTier: "pro",
        featureTitle: "Custom Competitor Content Gap",
        description:
          "Free tier includes sample comparisons. Upgrade to Pro Analyst to evaluate custom domains, extract semantic topic gaps, and download content outlines.",
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tools/content-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUrl: targetUrl.trim(),
          competitorUrl: competitorUrl.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to analyze content gap.");
      }

      setData(json);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (term: string) => {
    navigator.clipboard.writeText(term);
    setCopiedTerm(term);
    setTimeout(() => setCopiedTerm(null), 2000);
  };

  const handleExportCsv = () => {
    if (!data) return;
    const rows = [
      ["Keyword", "Gap Status", `${data.target.domain} Frequency`, `${data.competitor.domain} Frequency`],
      ...data.missingKeywords.map((k) => [k.term, "Missing on Target", k.targetCount, k.competitorCount]),
      ...data.sharedKeywords.map((k) => [k.term, "Shared", k.targetCount, k.competitorCount]),
      ...data.targetLeads.map((k) => [k.term, "Target Lead", k.targetCount, k.competitorCount]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((e) => e.map((val) => `"${val}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `content-gap-${data.target.domain}-vs-${data.competitor.domain}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
                  featureTitle: "Unlimited Content Gap Audits",
                  description:
                    "Analyze unlimited competitors, extract TF-IDF keyword matrices, and export briefs to CSV.",
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
          <GitCompare className="w-3.5 h-3.5" />
          <span>Ahrefs Content Gap Alternative</span>
          <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-bold">
            Competitive Suite
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Semantic Content Gap &amp; Keyword Studio
        </h1>

        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Uncover the topics, keywords, and heading hierarchies that your competitors rank for, but your webpage is missing. Produce actionable content briefs in seconds.
        </p>

        {/* Sample Pairs */}
        <div className="pt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Test Sample Benchmarks:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {SAMPLE_PAIRS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(p.target, p.competitor)}
                className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleRunAnalysis} className="flat-card p-6 sm:p-8 bg-white border-slate-200 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>Your Webpage (Target URL)</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://yoursite.com/page"
              required
              className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>Competitor Webpage URL</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="url"
              value={competitorUrl}
              onChange={(e) => setCompetitorUrl(e.target.value)}
              placeholder="https://competitor.com/page"
              required
              className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-mono"
            />
          </div>
        </div>

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
                Extracting Semantic Topics...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                Analyze Content Gap
              </>
            )}
          </button>

          {data && (
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              Export Gap CSV
            </button>
          )}
        </div>
      </form>

      {/* RESULTS DISPLAY */}
      {data && (
        <div className="space-y-8 animate-in fade-in-50 duration-200">
          {/* KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flat-card p-5 bg-white border-blue-200 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Missing Keywords
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-rose-600 font-mono">
                  {data.gapSummary.missingKeywordsCount}
                </span>
                <span className="text-xs font-bold text-slate-500">Unused terms</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Present on competitor but 0 occurrences on target.
              </p>
            </div>

            <div className="flat-card p-5 bg-white border-slate-200 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Topic Coverage Score
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-blue-600 font-mono">
                  {data.gapSummary.topicCoverageScore}%
                </span>
                <span className="text-xs font-bold text-slate-500">Overlap</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${data.gapSummary.topicCoverageScore}%` }}
                />
              </div>
            </div>

            <div className="flat-card p-5 bg-white border-slate-200 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Word Count Disparity
              </span>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-3xl font-black font-mono ${
                    data.gapSummary.wordDisparity > 0 ? "text-amber-600" : "text-emerald-600"
                  }`}
                >
                  {data.gapSummary.wordDisparity > 0
                    ? `+${data.gapSummary.wordDisparity}`
                    : `${data.gapSummary.wordDisparity}`}
                </span>
                <span className="text-xs font-bold text-slate-500">words</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                {data.gapSummary.wordDisparity > 0
                  ? "Competitor content is longer."
                  : "Target content has higher word volume."}
              </p>
            </div>

            <div className="flat-card p-5 bg-white border-slate-200 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Missing Heading Topics
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-purple-600 font-mono">
                  {data.missingTopics.length}
                </span>
                <span className="text-xs font-bold text-slate-500">H2 Sections</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Key structural sections competitor covers.
              </p>
            </div>
          </div>

          {/* Side by side Domain Meta Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-blue-700 tracking-wider">
                  Target Website
                </span>
                <span className="text-xs font-mono font-bold text-blue-900">
                  {data.target.wordCount} words
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 truncate">{data.target.domain}</h3>
              <p className="text-xs text-slate-500 truncate font-mono">{data.target.url}</p>
            </div>

            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-purple-700 tracking-wider">
                  Competitor Website
                </span>
                <span className="text-xs font-mono font-bold text-purple-900">
                  {data.competitor.wordCount} words
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 truncate">{data.competitor.domain}</h3>
              <p className="text-xs text-slate-500 truncate font-mono">{data.competitor.url}</p>
            </div>
          </div>

          {/* Visual Semantic Distribution Chart */}
          <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Semantic Keyword Overlap &amp; Coverage Distribution
                </h3>
                <p className="text-xs text-slate-500">
                  Cross-domain TF-IDF intersection between {data.target.domain} and {data.competitor.domain}.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                {data.gapSummary.topicCoverageScore}% Common Coverage
              </span>
            </div>

            {/* Stacked Proportional Bar */}
            <div className="h-4 rounded-full overflow-hidden flex bg-slate-100 border border-slate-200/80 p-0.5">
              <div
                style={{ width: `${Math.round((data.targetLeads.length / (data.missingKeywords.length + data.sharedKeywords.length + data.targetLeads.length || 1)) * 100)}%` }}
                className="bg-blue-600 h-full rounded-l-full transition-all duration-700"
                title="Target Exclusive Keywords"
              />
              <div
                style={{ width: `${data.gapSummary.topicCoverageScore}%` }}
                className="bg-purple-600 h-full transition-all duration-700"
                title="Shared Keywords"
              />
              <div
                style={{ width: `${Math.round((data.missingKeywords.length / (data.missingKeywords.length + data.sharedKeywords.length + data.targetLeads.length || 1)) * 100)}%` }}
                className="bg-rose-500 h-full rounded-r-full transition-all duration-700"
                title="Missing Competitor Keywords"
              />
            </div>

            {/* Legend Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs pt-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600" />
                <span className="font-bold text-slate-800">{data.targetLeads.length} Target Leads</span>
                <span className="text-slate-400 text-[11px]">Unique to you</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-600" />
                <span className="font-bold text-slate-800">{data.sharedKeywords.length} Shared Terms</span>
                <span className="text-slate-400 text-[11px]">Intersecting topics</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="font-bold text-slate-800">{data.missingKeywords.length} Missing Gaps</span>
                <span className="text-slate-400 text-[11px]">Ranked by competitor only</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-lg border border-slate-200 flex-wrap">
            <button
              onClick={() => setActiveTab("missing")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeTab === "missing" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Missing Keywords ({data.missingKeywords.length})
            </button>
            <button
              onClick={() => setActiveTab("topics")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeTab === "topics" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Missing Topics &amp; H2s ({data.missingTopics.length})
            </button>
            <button
              onClick={() => setActiveTab("outline")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === "outline" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Content Strategy Brief
            </button>
            <button
              onClick={() => setActiveTab("shared")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeTab === "shared" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Shared Keywords ({data.sharedKeywords.length})
            </button>
          </div>

          {/* TAB 1: MISSING KEYWORDS */}
          {activeTab === "missing" && (
            <div className="flat-card bg-white border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    High-Intent Missing Terms
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Keywords appearing prominently on {data.competitor.domain} that are completely missing from your page.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50/50 text-[11px] font-bold uppercase text-slate-400 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4">Keyword Term</th>
                      <th className="py-2.5 px-4 text-center">Competitor Frequency</th>
                      <th className="py-2.5 px-4 text-center">Your Frequency</th>
                      <th className="py-2.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {data.missingKeywords.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                          <span>{item.term}</span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-purple-700">
                          {item.competitorCount}×
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-slate-400">
                          0×
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleCopy(item.term)}
                            className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 transition-colors cursor-pointer"
                          >
                            {copiedTerm === item.term ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3 text-slate-400" />
                            )}
                            {copiedTerm === item.term ? "Copied" : "Copy"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: MISSING TOPICS & H2s */}
          {activeTab === "topics" && (
            <div className="flat-card p-6 bg-white border-slate-200 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Missing Heading Subsections
                </h3>
                <p className="text-xs text-slate-500">
                  Headings that {data.competitor.domain} includes in their document hierarchy that are not present on your page.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.missingTopics.map((topic, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 uppercase">
                        H2 Section #{idx + 1}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        {topic}
                      </h4>
                    </div>
                    <button
                      onClick={() => handleCopy(topic)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      title="Copy topic"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CONTENT STRATEGY BRIEF */}
          {activeTab === "outline" && (
            <div className="flat-card p-6 sm:p-8 bg-slate-900 text-white rounded-2xl space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-semibold mb-2">
                  <Sparkles className="w-3 h-3" />
                  Editorial Action Plan
                </div>
                <h3 className="text-lg font-bold">
                  Recommended Content Outline to Win the Gap
                </h3>
                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  Incorporate these suggested subheadings and semantic keywords into your webpage copy to achieve topical parity with {data.competitor.domain}.
                </p>
              </div>

              <div className="space-y-3">
                {data.suggestedOutline.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-800/90 border border-slate-700/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-100">
                        Section #{idx + 1}: &ldquo;{item.heading}&rdquo;
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {item.importance} Importance
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-300 flex-wrap">
                      <span className="text-[11px] text-slate-400">Target Keywords:</span>
                      {item.recommendedKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-slate-700 text-slate-200 font-mono text-[11px]"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SHARED KEYWORDS */}
          {activeTab === "shared" && (
            <div className="flat-card bg-white border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-200 bg-slate-50">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Shared Core Keywords
                </h3>
                <p className="text-[11px] text-slate-500">
                  Terms that appear on both your webpage and {data.competitor.domain}.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50/50 text-[11px] font-bold uppercase text-slate-400 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4">Keyword</th>
                      <th className="py-2.5 px-4 text-center">Your Frequency</th>
                      <th className="py-2.5 px-4 text-center">Competitor Frequency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {data.sharedKeywords.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {item.term}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-blue-600">
                          {item.targetCount}×
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-purple-600">
                          {item.competitorCount}×
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
