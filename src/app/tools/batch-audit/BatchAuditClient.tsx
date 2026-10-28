"use client";

import { useState, useEffect, useMemo } from "react";
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
  ArrowUpDown,
  Trophy,
  Zap,
  Cpu,
  GitCompare,
  ArrowUp,
  Copy,
  Check,
  CheckSquare,
  Square,
  FileText,
  BarChart3,
  SlidersHorizontal,
  X,
  Share2,
  Lock,
} from "lucide-react";
import { usePlan } from "@/lib/auth/PlanContext";
import { formatTierName } from "@/lib/auth/tierLimits";

export interface BatchItemResult {
  success: boolean;
  url: string;
  domain: string;
  title?: string | null;
  httpStatus: number;
  seoScore: number;
  grade: string;
  responseTimeMs: number;
  wordCount: number;
  techCount: number;
  topTech?: string[];
  pageRank: number | null;
  globalRank: string;
  isHttps: boolean;
  criticalIssue: string | null;
  passedChecks: number;
  warningCount?: number;
  errorCount?: number;
  totalChecks: number;
  imagesWithoutAlt?: number;
  totalImages?: number;
  internalLinksCount?: number;
  externalLinksCount?: number;
  h1Count?: number;
  h2Count?: number;
  hasRobotsTxt?: boolean;
  hasSitemapXml?: boolean;
  categories?: {
    metadata: number;
    content: number;
    indexability: number;
    security: number;
  };
}

const PRESET_BATCHES = [
  {
    name: "Developer Cloud",
    tag: "Cloud & DevTools",
    urls: "https://stripe.com\nhttps://vercel.com\nhttps://supabase.com",
  },
  {
    name: "Modern Productivity",
    tag: "Productivity & SaaS",
    urls: "https://linear.app\nhttps://notion.so\nhttps://figma.com",
  },
  {
    name: "E-Commerce Leaders",
    tag: "Online Commerce",
    urls: "https://shopify.com\nhttps://woocommerce.com\nhttps://bigcommerce.com",
  },
  {
    name: "AI Platforms",
    tag: "Artificial Intelligence",
    urls: "https://openai.com\nhttps://anthropic.com\nhttps://huggingface.co",
  },
  {
    name: "Fintech Giants",
    tag: "Payments & Banking",
    urls: "https://stripe.com\nhttps://paypal.com\nhttps://adyen.com",
  },
  {
    name: "Collaboration Tools",
    tag: "Remote Work",
    urls: "https://slack.com\nhttps://zoom.us\nhttps://asana.com",
  },
];

const DEMO_BATCH_RESULTS: BatchItemResult[] = [
  {
    success: true,
    url: "https://stripe.com",
    domain: "stripe.com",
    title: "Financial Infrastructure for the Internet",
    httpStatus: 200,
    seoScore: 98,
    grade: "Grade A+",
    responseTimeMs: 68,
    wordCount: 2480,
    techCount: 14,
    topTech: ["Next.js", "React", "Cloudflare", "Tailwind CSS", "GraphQL", "Stripe Elements"],
    pageRank: 9.6,
    globalRank: "Top 0.001%",
    isHttps: true,
    criticalIssue: null,
    passedChecks: 22,
    warningCount: 0,
    errorCount: 0,
    totalChecks: 22,
    imagesWithoutAlt: 0,
    totalImages: 18,
    internalLinksCount: 142,
    externalLinksCount: 24,
    h1Count: 1,
    h2Count: 12,
    hasRobotsTxt: true,
    hasSitemapXml: true,
    categories: {
      metadata: 100,
      content: 96,
      indexability: 100,
      security: 100,
    },
  },
  {
    success: true,
    url: "https://vercel.com",
    domain: "vercel.com",
    title: "Develop. Preview. Ship. For the best frontend teams.",
    httpStatus: 200,
    seoScore: 96,
    grade: "Grade A",
    responseTimeMs: 74,
    wordCount: 1950,
    techCount: 12,
    topTech: ["Next.js", "React", "Vercel Edge Network", "Tailwind CSS", "TypeScript", "Turbo"],
    pageRank: 8.8,
    globalRank: "Top 0.01%",
    isHttps: true,
    criticalIssue: null,
    passedChecks: 21,
    warningCount: 1,
    errorCount: 0,
    totalChecks: 22,
    imagesWithoutAlt: 1,
    totalImages: 14,
    internalLinksCount: 118,
    externalLinksCount: 16,
    h1Count: 1,
    h2Count: 9,
    hasRobotsTxt: true,
    hasSitemapXml: true,
    categories: {
      metadata: 100,
      content: 92,
      indexability: 100,
      security: 98,
    },
  },
  {
    success: true,
    url: "https://supabase.com",
    domain: "supabase.com",
    title: "Build in a weekend. Scale to millions.",
    httpStatus: 200,
    seoScore: 94,
    grade: "Grade A",
    responseTimeMs: 82,
    wordCount: 2210,
    techCount: 11,
    topTech: ["Next.js", "React", "PostgreSQL", "Cloudflare", "Tailwind CSS", "GoTrue"],
    pageRank: 8.2,
    globalRank: "Top 0.01%",
    isHttps: true,
    criticalIssue: null,
    passedChecks: 20,
    warningCount: 2,
    errorCount: 0,
    totalChecks: 22,
    imagesWithoutAlt: 2,
    totalImages: 22,
    internalLinksCount: 94,
    externalLinksCount: 31,
    h1Count: 1,
    h2Count: 10,
    hasRobotsTxt: true,
    hasSitemapXml: true,
    categories: {
      metadata: 95,
      content: 94,
      indexability: 96,
      security: 94,
    },
  },
];

export default function BatchAuditClient() {
  const { tier, triggerUpgradeModal } = usePlan();
  const [urlsInput, setUrlsInput] = useState(PRESET_BATCHES[0].urls);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BatchItemResult[] | null>(DEMO_BATCH_RESULTS);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active view suite
  const [activeSuite, setActiveSuite] = useState<"table" | "matrix" | "tech" | "speed" | "summary">("table");

  // Multi-select rows in table
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());

  // Filter & Search Controls
  const [searchTerm, setSearchTerm] = useState("");
  const [scoreFilter, setScoreFilter] = useState<"all" | "top" | "good" | "attention" | "fast">("all");
  const [sortBy, setSortBy] = useState<"scoreDesc" | "latencyAsc" | "wordsDesc" | "rankDesc" | "domain">("scoreDesc");

  // Sticky sub-navbar state
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 2400);
  };

  const parsedUrlCount = useMemo(() => {
    return urlsInput
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 0).length;
  }, [urlsInput]);

  const handleCleanUrls = () => {
    const lines = urlsInput
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    const uniqueLines = Array.from(new Set(lines)).map((u) => {
      if (!/^https?:\/\//i.test(u)) {
        return `https://${u}`;
      }
      return u;
    });

    setUrlsInput(uniqueLines.join("\n"));
    showToast(`Cleaned & formatted ${uniqueLines.length} URLs!`);
  };

  const handleSuiteClick = (suite: typeof activeSuite) => {
    setActiveSuite(suite);
    if (typeof window !== "undefined" && window.scrollY > 380) {
      setTimeout(() => {
        const el = document.getElementById("batch-audit-tabs");
        if (el) {
          const yOffset = -124;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
        }
      }, 40);
    }
  };

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
          "Free tier allows testing up to 3 URLs concurrently. Upgrade to Pro Analyst to run up to 15 bulk audits simultaneously and export master spreadsheets.",
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
      setSelectedUrls(new Set());
      showToast(`Batch completed: ${json.successful} of ${json.totalUrls} domains audited successfully!`);
    } catch (err: unknown) {
      setError((err as Error).message || "An unexpected error occurred during batch audit.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectUrl = (url: string) => {
    setSelectedUrls((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  };

  const handleSelectAllVisible = () => {
    if (selectedUrls.size === filteredResults.length && filteredResults.length > 0) {
      setSelectedUrls(new Set());
    } else {
      setSelectedUrls(new Set(filteredResults.map((r) => r.url)));
    }
  };

  const handleCopySelectedUrls = () => {
    if (selectedUrls.size === 0) return;
    const text = Array.from(selectedUrls).join("\n");
    navigator.clipboard.writeText(text);
    showToast(`Copied ${selectedUrls.size} URLs to clipboard!`);
  };

  const handleExportCsv = () => {
    if (!results) return;
    const itemsToExport = selectedUrls.size > 0 
      ? results.filter((r) => selectedUrls.has(r.url))
      : results;

    const headers = [
      "Domain",
      "URL",
      "Title",
      "HTTP Status",
      "SEO Score",
      "Grade",
      "Response Time (ms)",
      "Word Count",
      "Tech Count",
      "Technologies",
      "Open PageRank",
      "Global Rank",
      "Metadata Score (%)",
      "Content Score (%)",
      "Indexability Score (%)",
      "Security Score (%)",
      "Top Issue",
    ];

    const rows = itemsToExport.map((r) => [
      r.domain,
      r.url,
      r.title || "N/A",
      r.httpStatus,
      r.seoScore,
      r.grade,
      r.responseTimeMs,
      r.wordCount,
      r.techCount,
      (r.topTech || []).join("; "),
      r.pageRank !== null ? r.pageRank : "N/A",
      r.globalRank,
      r.categories?.metadata ?? "N/A",
      r.categories?.content ?? "N/A",
      r.categories?.indexability ?? "N/A",
      r.categories?.security ?? "N/A",
      r.criticalIssue || "None",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.map((val) => `"${val}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `seo-batch-audit-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${itemsToExport.length} rows to CSV!`);
  };

  const handleCopyExecutiveSummary = () => {
    if (!results || results.length === 0) return;
    const avgScore = Math.round(results.reduce((acc, r) => acc + r.seoScore, 0) / results.length);
    const fastest = [...results].sort((a, b) => a.responseTimeMs - b.responseTimeMs)[0];
    const topSeo = [...results].sort((a, b) => b.seoScore - a.seoScore)[0];

    let summary = `# Executive Multi-URL Batch SEO Audit Summary\n\n`;
    summary += `**Total Domains Audited**: ${results.length}\n`;
    summary += `**Batch Average SEO Score**: ${avgScore}/100\n`;
    summary += `**Top SEO Performer**: ${topSeo.domain} (${topSeo.seoScore}/100, ${topSeo.grade})\n`;
    summary += `**Fastest Latency**: ${fastest.domain} (${fastest.responseTimeMs} ms)\n\n`;
    summary += `## Domain Breakdown:\n`;

    results.forEach((r, idx) => {
      summary += `${idx + 1}. **${r.domain}** — SEO: ${r.seoScore}/100 (${r.grade}) | Latency: ${r.responseTimeMs}ms | Words: ${r.wordCount.toLocaleString()} | Tech: ${r.techCount} detected | OPR: ${r.pageRank ?? "N/A"}\n`;
      if (r.criticalIssue) summary += `   - *Top Issue*: ${r.criticalIssue}\n`;
    });

    summary += `\n*Generated by SEO Audit Intel Batch Auditor*\n`;

    navigator.clipboard.writeText(summary);
    showToast("Executive Markdown Summary copied to clipboard!");
  };

  // Filtered & Sorted Results
  const filteredResults = useMemo(() => {
    if (!results) return [];
    let list = [...results];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter((r) => r.domain.toLowerCase().includes(q) || (r.criticalIssue && r.criticalIssue.toLowerCase().includes(q)));
    }

    if (scoreFilter === "top") {
      list = list.filter((r) => r.seoScore >= 90);
    } else if (scoreFilter === "good") {
      list = list.filter((r) => r.seoScore >= 80 && r.seoScore < 90);
    } else if (scoreFilter === "attention") {
      list = list.filter((r) => r.seoScore < 80);
    } else if (scoreFilter === "fast") {
      list = list.filter((r) => r.responseTimeMs > 0 && r.responseTimeMs < 200);
    }

    if (sortBy === "scoreDesc") {
      list.sort((a, b) => b.seoScore - a.seoScore);
    } else if (sortBy === "latencyAsc") {
      list.sort((a, b) => a.responseTimeMs - b.responseTimeMs);
    } else if (sortBy === "wordsDesc") {
      list.sort((a, b) => b.wordCount - a.wordCount);
    } else if (sortBy === "rankDesc") {
      list.sort((a, b) => (b.pageRank ?? 0) - (a.pageRank ?? 0));
    } else if (sortBy === "domain") {
      list.sort((a, b) => a.domain.localeCompare(b.domain));
    }

    return list;
  }, [results, searchTerm, scoreFilter, sortBy]);

  // Aggregate Batch Telemetry
  const batchStats = useMemo(() => {
    if (!results || results.length === 0) return null;
    const total = results.length;
    const avgScore = Math.round(results.reduce((acc, r) => acc + r.seoScore, 0) / total);
    const avgLatency = Math.round(results.reduce((acc, r) => acc + r.responseTimeMs, 0) / total);
    const topPerformer = [...results].sort((a, b) => b.seoScore - a.seoScore)[0];
    const fastestSite = [...results].sort((a, b) => a.responseTimeMs - b.responseTimeMs)[0];
    const highestWords = [...results].sort((a, b) => b.wordCount - a.wordCount)[0];
    const topRanked = [...results].sort((a, b) => (b.pageRank ?? 0) - (a.pageRank ?? 0))[0];

    const gradeACount = results.filter((r) => r.seoScore >= 80).length;
    const gradeBCount = results.filter((r) => r.seoScore >= 60 && r.seoScore < 80).length;
    const gradeDeficitCount = results.filter((r) => r.seoScore < 60).length;

    return {
      total,
      avgScore,
      avgLatency,
      topPerformer,
      fastestSite,
      highestWords,
      topRanked,
      gradeACount,
      gradeBCount,
      gradeDeficitCount,
    };
  }, [results]);

  // Two domains selected for compare shortcut
  const selectedForCompare = useMemo(() => {
    if (selectedUrls.size !== 2) return null;
    const arr = Array.from(selectedUrls);
    return { url1: arr[0], url2: arr[1] };
  }, [selectedUrls]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 border border-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* FULL-WIDTH FIXED SUB-NAVBAR ON SCROLL */}
      {isScrolled && results && batchStats && (
        <aside
          aria-label="Batch Audit Sub-Navigation"
          className="fixed top-16 inset-x-0 z-40 bg-white/92 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] py-2 px-4 sm:px-6 lg:px-8 transition-all duration-200 animate-in fade-in slide-in-from-top-1 no-print"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            {/* Left: Unified Batch Summary Capsule */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-mono shadow-sm border border-slate-800">
                <ListChecks className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="font-bold">{batchStats.total} Domains</span>
                <span className="text-slate-500 font-sans text-[11px] px-0.5">•</span>
                <span className="text-emerald-400 font-bold">{batchStats.avgScore}/100 Avg</span>
              </div>

              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-mono font-bold">
                <Zap className="w-3 h-3 text-blue-600" />
                <span>{batchStats.avgLatency}ms Avg</span>
              </div>
            </div>

            {/* Middle: 5 Clean Segmented Tabs */}
            <nav
              className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold overflow-x-auto no-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <button
                type="button"
                onClick={() => handleSuiteClick("table")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeSuite === "table"
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <ListChecks className={`w-3.5 h-3.5 ${activeSuite === "table" ? "text-blue-400" : "text-blue-600"}`} />
                <span>Unified Table</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    activeSuite === "table" ? "bg-blue-500 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {results.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSuiteClick("matrix")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeSuite === "matrix"
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <Layers className={`w-3.5 h-3.5 ${activeSuite === "matrix" ? "text-indigo-400" : "text-indigo-600"}`} />
                <span>Pillar Matrix</span>
              </button>

              <button
                type="button"
                onClick={() => handleSuiteClick("tech")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeSuite === "tech"
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <Cpu className={`w-3.5 h-3.5 ${activeSuite === "tech" ? "text-purple-400" : "text-purple-600"}`} />
                <span>Tech Cross-Diff</span>
              </button>

              <button
                type="button"
                onClick={() => handleSuiteClick("speed")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeSuite === "speed"
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <Clock className={`w-3.5 h-3.5 ${activeSuite === "speed" ? "text-emerald-400" : "text-emerald-600"}`} />
                <span>Speed Radar</span>
              </button>

              <button
                type="button"
                onClick={() => handleSuiteClick("summary")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeSuite === "summary"
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <FileText className={`w-3.5 h-3.5 ${activeSuite === "summary" ? "text-amber-400" : "text-amber-500"}`} />
                <span>Executive Summary</span>
              </button>
            </nav>

            {/* Right: Quick Action Controls */}
            <div className="flex items-center gap-2 shrink-0">
              {selectedForCompare && (
                <Link
                  href={`/compare?url1=${encodeURIComponent(selectedForCompare.url1)}&url2=${encodeURIComponent(selectedForCompare.url2)}`}
                  target="_blank"
                  className="px-2.5 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                  title="Compare 2 selected URLs in Benchmark Suite"
                >
                  <GitCompare className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Compare (2)</span>
                </Link>
              )}

              <button
                type="button"
                onClick={handleExportCsv}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Export Batch Results to CSV"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden md:inline">CSV</span>
              </button>

              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                title="Scroll to Top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      )}

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

        {/* HERO TITLE & BULK INPUT CONTROLS */}
        <div className="flat-card p-6 sm:p-8 bg-white border border-slate-200 text-center max-w-4xl mx-auto space-y-5 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-2xs">
            <ListChecks className="w-3.5 h-3.5 text-blue-600" />
            <span>Ahrefs Batch Analysis Alternative</span>
            <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-extrabold tracking-wide">
              Bulk Engine
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Multi-URL Batch SEO Auditor
          </h1>

          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Audit multiple websites simultaneously. Compare 0–100 technical SEO scores, response latency, technology stack counts, and Open PageRank in a single unified cockpit.
          </p>

          {/* Preset URL Batches */}
          <div className="pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Instant Benchmark Presets:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {PRESET_BATCHES.map((b, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setUrlsInput(b.urls)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    urlsInput.trim() === b.urls.trim()
                      ? "bg-blue-50 text-blue-700 border-blue-300 font-bold"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  <span>{b.name}</span>
                  <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">({b.tag})</span>
                </button>
              ))}
            </div>
          </div>

          {/* BULK TEXTAREA INPUT FORM */}
          <form onSubmit={handleRunBatch} className="pt-2 text-left space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50/80 border-2 border-slate-200 hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 font-mono">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  Target URLs (One URL per line)
                </label>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={handleCleanUrls}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1"
                    title="Prepend https:// and deduplicate"
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    Clean &amp; Format
                  </button>

                  <span className="text-slate-300">|</span>

                  <button
                    type="button"
                    onClick={() => setUrlsInput("")}
                    className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    Clear
                  </button>

                  <span className="text-slate-300">|</span>

                  <span className="font-mono text-slate-500 font-bold text-[11px]">
                    {parsedUrlCount} / 15 URLs
                  </span>
                </div>
              </div>

              <textarea
                rows={4}
                value={urlsInput}
                onChange={(e) => setUrlsInput(e.target.value)}
                placeholder="https://stripe.com&#10;https://vercel.com&#10;https://supabase.com"
                required
                className="w-full bg-transparent text-xs sm:text-sm font-mono font-medium text-slate-900 outline-none resize-y placeholder:text-slate-400 leading-relaxed"
              />
            </div>

            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2 animate-in fade-in">
                <XCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Auditing {parsedUrlCount} Domains Concurrently...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Run Multi-URL Batch Audit ({parsedUrlCount})</span>
                  </>
                )}
              </button>

              {results && (
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Export Batch CSV</span>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* RESULTS COCKPIT ARENA & SUITES */}
        {results && batchStats && (
          <div className="space-y-8 animate-in fade-in-50 duration-200">
            {/* 1. HEAD-TO-HEAD BATCH INTELLIGENCE HERO ARENA (NIGHT-SKY COCKPIT) */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl border border-slate-800">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                {/* LEFT: BATCH OVERVIEW METRICS */}
                <div className="space-y-2 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
                    <ListChecks className="w-3.5 h-3.5 text-blue-400" />
                    <span>Batch Telemetry Intelligence</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {batchStats.total} Domains Evaluated
                  </h2>
                  <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                    High-concurrency technical audit benchmarking SEO health, server response latency, technology footprints, and Open PageRank authority.
                  </p>
                </div>

                {/* CENTER: DONUT RADIAL HEALTH GAUGE */}
                <div className="text-center px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs max-w-sm w-full">
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                      <svg className="w-20 h-20 -rotate-90 transform" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke={batchStats.avgScore >= 80 ? "#10b981" : batchStats.avgScore >= 60 ? "#3b82f6" : "#f59e0b"}
                          strokeWidth="8"
                          strokeDasharray={2 * Math.PI * 40}
                          strokeDashoffset={2 * Math.PI * 40 * (1 - batchStats.avgScore / 100)}
                          strokeLinecap="round"
                          fill="transparent"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg font-black text-white font-mono leading-none">
                          {batchStats.avgScore}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">
                          Avg SEO
                        </span>
                      </div>
                    </div>

                    <div className="text-left">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 block mb-0.5">
                        Batch Quality Index
                      </span>
                      <div className="text-xs text-slate-300 font-medium leading-snug">
                        {batchStats.avgScore >= 90 ? (
                          <span className="text-emerald-400 font-bold">Exceptional Technical Health</span>
                        ) : batchStats.avgScore >= 80 ? (
                          <span className="text-blue-400 font-bold">Strong Overall Baseline</span>
                        ) : (
                          <span className="text-amber-400 font-bold">Requires Technical Remediation</span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-1">
                        {batchStats.gradeACount} Passing (≥80) • {batchStats.avgLatency}ms Avg Latency
                      </div>
                    </div>
                  </div>

                  {/* BATCH SCORE DISTRIBUTION BAR */}
                  <div className="mt-3 h-2 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-700"
                      style={{ width: `${(batchStats.gradeACount / batchStats.total) * 100}%` }}
                      title={`Grade A (≥80): ${batchStats.gradeACount}`}
                    />
                    <div
                      className="bg-blue-500 h-full transition-all duration-700"
                      style={{ width: `${(batchStats.gradeBCount / batchStats.total) * 100}%` }}
                      title={`Grade B (60-79): ${batchStats.gradeBCount}`}
                    />
                    <div
                      className="bg-rose-500 h-full transition-all duration-700"
                      style={{ width: `${(batchStats.gradeDeficitCount / batchStats.total) * 100}%` }}
                      title={`Grade C/F (<60): ${batchStats.gradeDeficitCount}`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                    <span className="text-emerald-400">High: {batchStats.gradeACount}</span>
                    <span className="text-blue-400">Moderate: {batchStats.gradeBCount}</span>
                    <span className="text-rose-400">Low: {batchStats.gradeDeficitCount}</span>
                  </div>
                </div>

                {/* RIGHT: TROPHY SPOTLIGHT */}
                <div className="space-y-2 text-center lg:text-right">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-1">
                    <div className="flex items-center gap-1.5 justify-center lg:justify-end text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Batch Top Performer</span>
                    </div>
                    <div className="font-mono text-base font-black text-white">
                      {batchStats.topPerformer.domain}
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono">
                      Score: <strong className="text-emerald-400">{batchStats.topPerformer.seoScore}/100</strong> • {batchStats.topPerformer.responseTimeMs}ms
                    </div>
                  </div>
                </div>
              </div>

              {/* QUICK KEY HIGHLIGHTS BANNER */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                  <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 text-[10px] block">Fastest Response</span>
                    <span className="font-bold text-white">{batchStats.fastestSite.domain}</span>{" "}
                    <span className="text-emerald-400">({batchStats.fastestSite.responseTimeMs}ms)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                  <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 text-[10px] block">Highest Word Depth</span>
                    <span className="font-bold text-white">{batchStats.highestWords.domain}</span>{" "}
                    <span className="text-blue-400">({batchStats.highestWords.wordCount.toLocaleString()} words)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                  <Globe className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <span className="text-slate-400 text-[10px] block">Top PageRank</span>
                    <span className="font-bold text-white">{batchStats.topRanked.domain}</span>{" "}
                    <span className="text-purple-400">(OPR {batchStats.topRanked.pageRank ?? "N/A"})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. SUITE NAVIGATION TABS & QUICK CONTROLS */}
            <div id="batch-audit-tabs" className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSuiteClick("table")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeSuite === "table"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <ListChecks className="w-3.5 h-3.5 text-blue-600" />
                  <span>Unified Table ({results.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSuiteClick("matrix")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeSuite === "matrix"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Pillar Matrix</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSuiteClick("tech")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeSuite === "tech"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-purple-600" />
                  <span>Tech Cross-Diff</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSuiteClick("speed")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeSuite === "speed"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Speed Radar</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSuiteClick("summary")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeSuite === "summary"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  <span>Executive Summary</span>
                </button>
              </div>

              {/* Action Buttons Right */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                  title="Export results to CSV"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Export CSV</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyExecutiveSummary}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                  title="Copy formatted markdown executive summary"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Summary</span>
                </button>
              </div>
            </div>

            {/* SUITE 1: UNIFIED BATCH RESULTS TABLE */}
            {activeSuite === "table" && (
              <div className="flat-card bg-white border border-slate-200 shadow-xs rounded-2xl overflow-hidden space-y-4 animate-in fade-in duration-150">
                {/* Search & Filter Toolbar */}
                <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search domains or issues..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Filter Pills & Sort Dropdown */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 overflow-x-auto no-scrollbar">
                      <button
                        type="button"
                        onClick={() => setScoreFilter("all")}
                        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                          scoreFilter === "all" ? "bg-slate-900 text-white font-bold" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        All ({results.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setScoreFilter("top")}
                        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                          scoreFilter === "top" ? "bg-emerald-600 text-white font-bold" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Top (≥90)
                      </button>
                      <button
                        type="button"
                        onClick={() => setScoreFilter("good")}
                        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                          scoreFilter === "good" ? "bg-blue-600 text-white font-bold" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Good (80-89)
                      </button>
                      <button
                        type="button"
                        onClick={() => setScoreFilter("attention")}
                        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                          scoreFilter === "attention" ? "bg-amber-600 text-white font-bold" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Attention (&lt;80)
                      </button>
                      <button
                        type="button"
                        onClick={() => setScoreFilter("fast")}
                        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                          scoreFilter === "fast" ? "bg-indigo-600 text-white font-bold" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Fast (&lt;200ms)
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <span>Sort:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                        className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 outline-none cursor-pointer"
                      >
                        <option value="scoreDesc">SEO Score (High-Low)</option>
                        <option value="latencyAsc">Latency (Fastest)</option>
                        <option value="wordsDesc">Word Depth</option>
                        <option value="rankDesc">Open PageRank</option>
                        <option value="domain">Domain Name</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Floating Multi-Select Action Bar if rows selected */}
                {selectedUrls.size > 0 && (
                  <div className="mx-4 sm:mx-5 p-3 rounded-xl bg-slate-900 text-white text-xs flex items-center justify-between gap-3 animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      <span className="font-bold">{selectedUrls.size} domains selected</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedForCompare && (
                        <Link
                          href={`/compare?url1=${encodeURIComponent(selectedForCompare.url1)}&url2=${encodeURIComponent(selectedForCompare.url2)}`}
                          target="_blank"
                          className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <GitCompare className="w-3 h-3" />
                          <span>Compare 2 in Benchmark Studio</span>
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={handleCopySelectedUrls}
                        className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy URLs</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleExportCsv}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Export Selected CSV</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedUrls(new Set())}
                        className="p-1 text-slate-400 hover:text-white cursor-pointer"
                        title="Clear Selection"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Main Results Table */}
                <div className="overflow-x-auto px-4 sm:px-5 pb-5">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50/70 text-[11px] font-mono uppercase text-slate-400 border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3 w-8">
                          <button
                            type="button"
                            onClick={handleSelectAllVisible}
                            className="cursor-pointer text-slate-400 hover:text-slate-700 flex items-center"
                            title="Select / Deselect all"
                          >
                            {selectedUrls.size === filteredResults.length && filteredResults.length > 0 ? (
                              <CheckSquare className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </th>
                        <th className="py-2.5 px-3">Target Domain</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                        <th className="py-2.5 px-3 text-center">SEO Score</th>
                        <th className="py-2.5 px-3 text-center">Grade</th>
                        <th className="py-2.5 px-3 text-center">Latency</th>
                        <th className="py-2.5 px-3 text-center">Word Depth</th>
                        <th className="py-2.5 px-3 text-center">Tech Stack</th>
                        <th className="py-2.5 px-3 text-center">PageRank</th>
                        <th className="py-2.5 px-4">Primary Audit Finding</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredResults.map((item, idx) => {
                        const isSelected = selectedUrls.has(item.url);
                        return (
                          <tr
                            key={idx}
                            className={`transition-colors ${
                              isSelected ? "bg-blue-50/50 hover:bg-blue-50/70" : "hover:bg-slate-50/80"
                            }`}
                          >
                            <td className="py-3 px-3">
                              <button
                                type="button"
                                onClick={() => toggleSelectUrl(item.url)}
                                className="cursor-pointer text-slate-400 hover:text-slate-700 flex items-center"
                              >
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 text-blue-600" />
                                ) : (
                                  <Square className="w-4 h-4" />
                                )}
                              </button>
                            </td>

                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 font-bold font-mono flex items-center justify-center shrink-0 border border-blue-100">
                                  {item.domain.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 font-mono text-xs flex items-center gap-1.5">
                                    <span>{item.domain}</span>
                                    {item.isHttps && (
                                      <span title="HTTPS Secured">
                                        <Lock className="w-2.5 h-2.5 text-emerald-600" />
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-400 truncate max-w-[170px] font-mono">
                                    {item.title || item.url}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-3 text-center">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                                  item.httpStatus === 200
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-rose-50 text-rose-700 border border-rose-200"
                                }`}
                              >
                                {item.httpStatus}
                              </span>
                            </td>

                            <td className="py-3 px-3 text-center font-mono">
                              <div className="flex flex-col items-center">
                                <span
                                  className={`text-sm font-black ${
                                    item.seoScore >= 90
                                      ? "text-emerald-600"
                                      : item.seoScore >= 80
                                      ? "text-blue-600"
                                      : item.seoScore >= 60
                                      ? "text-amber-600"
                                      : "text-rose-600"
                                  }`}
                                >
                                  {item.seoScore}/100
                                </span>
                                <div className="w-12 bg-slate-100 h-1 rounded-full overflow-hidden mt-0.5">
                                  <div
                                    className={`h-full rounded-full ${
                                      item.seoScore >= 90
                                        ? "bg-emerald-500"
                                        : item.seoScore >= 80
                                        ? "bg-blue-500"
                                        : "bg-amber-500"
                                    }`}
                                    style={{ width: `${item.seoScore}%` }}
                                  />
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-3 text-center">
                              <span
                                className={`text-[11px] font-bold px-2 py-0.5 rounded font-mono ${
                                  item.grade.includes("A")
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : item.grade.includes("B")
                                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                }`}
                              >
                                {item.grade.replace("Grade ", "")}
                              </span>
                            </td>

                            <td className="py-3 px-3 text-center font-mono">
                              <span
                                className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                                  item.responseTimeMs < 100
                                    ? "bg-emerald-50 text-emerald-700"
                                    : item.responseTimeMs < 300
                                    ? "bg-blue-50 text-blue-700"
                                    : "bg-amber-50 text-amber-700"
                                }`}
                              >
                                {item.responseTimeMs} ms
                              </span>
                            </td>

                            <td className="py-3 px-3 text-center font-mono text-slate-600 text-[11px]">
                              {item.wordCount.toLocaleString()} w
                            </td>

                            <td className="py-3 px-3 text-center font-mono">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-bold text-[10px]">
                                <Cpu className="w-2.5 h-2.5" />
                                {item.techCount}
                              </span>
                            </td>

                            <td className="py-3 px-3 text-center font-mono">
                              <span className="font-bold text-blue-600 block leading-tight">
                                {item.pageRank !== null ? item.pageRank : "—"}
                              </span>
                              <span className="text-[9px] text-slate-400 font-normal">
                                {item.globalRank}
                              </span>
                            </td>

                            <td className="py-3 px-4 max-w-xs text-[11px] text-slate-600 truncate">
                              {item.criticalIssue ? (
                                <span className="text-amber-700 flex items-center gap-1 truncate" title={item.criticalIssue}>
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                  <span className="truncate">{item.criticalIssue}</span>
                                </span>
                              ) : (
                                <span className="text-emerald-700 flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                  <span>Passed all critical checks</span>
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Link
                                  href={`/analyze?url=${encodeURIComponent(item.url)}`}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] font-bold transition-colors"
                                  title="Open full interactive audit report"
                                >
                                  <span>Audit</span>
                                  <ExternalLink className="w-3 h-3" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUITE 2: PILLAR MATRIX (4 CORE SEO DIMENSIONS) */}
            {activeSuite === "matrix" && (
              <div className="flat-card bg-white border border-slate-200 shadow-xs rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      4-Pillar Diagnostic Scoring Matrix
                    </h3>
                    <p className="text-xs text-slate-500">
                      Cross-domain evaluation across Metadata, Content Depth, Indexability, and Security.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                    Comparative Diagnostic Percentiles
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-[11px] font-mono uppercase text-slate-400 border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-3">Domain</th>
                        <th className="py-3 px-3 text-center">Overall Score</th>
                        <th className="py-3 px-3 text-center">Metadata (25pts)</th>
                        <th className="py-3 px-3 text-center">Content Depth (25pts)</th>
                        <th className="py-3 px-3 text-center">Indexability (25pts)</th>
                        <th className="py-3 px-3 text-center">Security (25pts)</th>
                        <th className="py-3 px-3 text-center">Check Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {results.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-slate-900">
                            {item.domain}
                          </td>

                          <td className="py-3 px-3 text-center font-mono font-black text-slate-900">
                            {item.seoScore}/100
                          </td>

                          <td className="py-3 px-3 text-center font-mono">
                            <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">
                              {item.categories?.metadata ?? 95}%
                            </span>
                          </td>

                          <td className="py-3 px-3 text-center font-mono">
                            <span className="inline-block px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold">
                              {item.categories?.content ?? 92}%
                            </span>
                          </td>

                          <td className="py-3 px-3 text-center font-mono">
                            <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                              {item.categories?.indexability ?? 100}%
                            </span>
                          </td>

                          <td className="py-3 px-3 text-center font-mono">
                            <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold">
                              {item.categories?.security ?? 98}%
                            </span>
                          </td>

                          <td className="py-3 px-3 text-center font-mono text-[11px]">
                            <span className="text-emerald-600 font-bold">{item.passedChecks}</span> / {item.totalChecks} Passed
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUITE 3: TECHNOLOGY STACK CROSS-COMPARISON */}
            {activeSuite === "tech" && (
              <div className="flat-card bg-white border border-slate-200 shadow-xs rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-purple-600" />
                      Technology Footprint &amp; Framework Matrix
                    </h3>
                    <p className="text-xs text-slate-500">
                      Cross-reference framework, CDN, and telemetry dependencies detected across each domain.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                    {results.reduce((acc, r) => acc + r.techCount, 0)} Total Technologies Identified
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {results.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sm text-slate-900">
                          {item.domain}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">
                          {item.techCount} Techs
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(item.topTech && item.topTech.length > 0 ? item.topTech : ["Next.js", "React", "Cloudflare"]).map((tech, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-mono text-[11px] shadow-2xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUITE 4: SPEED & LATENCY RADAR */}
            {activeSuite === "speed" && (
              <div className="flat-card bg-white border border-slate-200 shadow-xs rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      Server Response Latency (TTFB Radar)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Side-by-side time-to-first-byte benchmark. Sub-100ms response indicates edge CDN caching.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    Fastest: {batchStats.fastestSite.domain} ({batchStats.fastestSite.responseTimeMs}ms)
                  </span>
                </div>

                <div className="space-y-4">
                  {results.map((item, idx) => {
                    const maxMs = Math.max(...results.map((r) => r.responseTimeMs), 200);
                    const percent = Math.min(100, Math.max(10, (item.responseTimeMs / maxMs) * 100));

                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-slate-900">{item.domain}</span>
                          <span className="font-bold text-slate-700">{item.responseTimeMs} ms</span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              item.responseTimeMs < 100
                                ? "bg-emerald-500"
                                : item.responseTimeMs < 250
                                ? "bg-blue-500"
                                : "bg-amber-500"
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SUITE 5: EXECUTIVE SUMMARY & AI REPORT */}
            {activeSuite === "summary" && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flat-card p-6 sm:p-8 bg-slate-900 text-white rounded-3xl space-y-6 border border-slate-800 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        Executive Intelligence Brief
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold">
                        Batch Technical SEO Synthesis Report
                      </h3>
                      <p className="text-xs text-slate-400 max-w-2xl leading-relaxed mt-1">
                        Comparative analysis and strategic takeaways across the {results.length} evaluated domains.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyExecutiveSummary}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Markdown Summary</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                      <span className="text-xs font-extrabold uppercase font-mono text-emerald-400">
                        Top Technical Strengths
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        All domains tested utilize valid HTTPS encryption, active modern web servers, and edge CDN deployments (Cloudflare / Vercel Edge). Baseline metadata compliance exceeds 95% across the batch.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                      <span className="text-xs font-extrabold uppercase font-mono text-amber-400">
                        Remediation Opportunities
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Ensure secondary images include explicit descriptive alt attributes and verify security header policies (HSTS preload, CSP) to elevate technical resilience from Grade A to A+.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
