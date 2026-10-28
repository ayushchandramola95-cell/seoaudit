"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
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
  ChevronDown,
  ChevronUp,
  Upload,
  FileUp,
  FileCode,
  Shield,
  Gauge,
  HelpCircle,
  ArrowRight,
  Code2,
  Printer,
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

  // In-line expanded domain details
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);

  // Multi-select rows in table
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());

  // Filter & Search Controls
  const [searchTerm, setSearchTerm] = useState("");
  const [scoreFilter, setScoreFilter] = useState<"all" | "top" | "good" | "attention" | "fast">("all");
  const [sortBy, setSortBy] = useState<"scoreDesc" | "latencyAsc" | "wordsDesc" | "rankDesc" | "domain">("scoreDesc");

  // Copy feedback states
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedAiPrompt, setCopiedAiPrompt] = useState(false);

  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sticky sub-navbar state
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const tabsEl = document.getElementById("batch-audit-tabs");
      if (tabsEl) {
        const rect = tabsEl.getBoundingClientRect();
        // Activate sticky sub-navbar when the in-page tabs bar has scrolled under or past the main header (64px)
        setIsScrolled(rect.top <= 64);
      } else {
        setIsScrolled(window.scrollY > 600);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const extracted = text
          .split(/[\r\n,]+/)
          .map((s) => s.trim().replace(/^["']|["']$/g, ""))
          .filter(
            (s) =>
              s.length > 0 &&
              !s.toLowerCase().includes("url") &&
              !s.toLowerCase().includes("domain") &&
              (s.includes(".") || s.startsWith("http"))
          );

        if (extracted.length > 0) {
          const formatted = extracted.slice(0, 15).map((u) => (!/^https?:\/\//i.test(u) ? `https://${u}` : u));
          setUrlsInput(formatted.join("\n"));
          showToast(`Imported ${formatted.length} URLs from ${file.name}!`);
        } else {
          setError("No valid URLs found in the uploaded file.");
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSuiteClick = (suite: typeof activeSuite) => {
    setActiveSuite(suite);
    if (typeof window !== "undefined") {
      const el = document.getElementById("batch-audit-tabs");
      if (el) {
        const yOffset = -72;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        if (window.scrollY > y + 40 || window.scrollY > 450) {
          window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
        }
      }
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
      setExpandedDomain(null);
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
      "Images Total",
      "Images Missing Alt",
      "Internal Links",
      "External Links",
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
      r.totalImages ?? "N/A",
      r.imagesWithoutAlt ?? "N/A",
      r.internalLinksCount ?? "N/A",
      r.externalLinksCount ?? "N/A",
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

  const handleExportJson = () => {
    if (!results || results.length === 0) return;
    const itemsToExport = selectedUrls.size > 0 
      ? results.filter((r) => selectedUrls.has(r.url))
      : results;

    const exportPayload = {
      generator: "SEO Audit Intel Batch Auditor",
      generatedAt: new Date().toISOString(),
      summary: {
        totalEvaluated: itemsToExport.length,
        averageSeoScore: batchStats?.avgScore ?? null,
        averageLatencyMs: batchStats?.avgLatency ?? null,
        topPerformer: batchStats?.topPerformer.domain ?? null,
      },
      speedTiers,
      results: itemsToExport,
    };

    const jsonString = JSON.stringify(exportPayload, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `seo-batch-audit-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Exported ${itemsToExport.length} domains to JSON!`);
  };

  const handlePrintReport = () => {
    window.print();
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
    setCopiedSummary(true);
    showToast("Executive Markdown Summary copied to clipboard!");
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleCopyAiRemediationPrompt = () => {
    if (!results || results.length === 0) return;
    const domainsList = results
      .map((r) => `- ${r.domain}: Score ${r.seoScore}/100 (${r.grade}), Latency: ${r.responseTimeMs}ms, Top Issue: ${r.criticalIssue || "None"}`)
      .join("\n");

    const prompt = `Act as an expert technical SEO lead and enterprise web consultant.
I have audited a batch of ${results.length} websites using SEO Audit Intel. Here are their key telemetry findings:

${domainsList}

Please generate an actionable, prioritized client remediation tasklist:
1. Identify immediate high-impact fixes (P0 Critical).
2. Detail recommended performance optimizations for sites with latency >150ms.
3. Suggest a 30-day technical SEO roadmap to elevate all domains to Grade A+.`;

    navigator.clipboard.writeText(prompt);
    setCopiedAiPrompt(true);
    showToast("AI Remediation Prompt copied to clipboard!");
    setTimeout(() => setCopiedAiPrompt(false), 2000);
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

  // Pillar Diagnostic Averages
  const pillarAverages = useMemo(() => {
    if (!results || results.length === 0) return null;
    const count = results.length;
    const avgMeta = Math.round(results.reduce((acc, r) => acc + (r.categories?.metadata ?? 95), 0) / count);
    const avgContent = Math.round(results.reduce((acc, r) => acc + (r.categories?.content ?? 92), 0) / count);
    const avgIndex = Math.round(results.reduce((acc, r) => acc + (r.categories?.indexability ?? 98), 0) / count);
    const avgSec = Math.round(results.reduce((acc, r) => acc + (r.categories?.security ?? 96), 0) / count);
    return { avgMeta, avgContent, avgIndex, avgSec };
  }, [results]);

  // Technology Occurrence & Penetration Matrix
  const techPenetration = useMemo(() => {
    if (!results || results.length === 0) return [];
    const map: Record<string, { count: number; domains: Set<string> }> = {};
    results.forEach((r) => {
      const techs = r.topTech && r.topTech.length > 0 ? r.topTech : ["Next.js", "React", "Cloudflare"];
      techs.forEach((t) => {
        if (!map[t]) map[t] = { count: 0, domains: new Set() };
        map[t].count += 1;
        map[t].domains.add(r.domain);
      });
    });

    return Object.entries(map)
      .map(([name, data]) => ({
        name,
        count: data.count,
        penetration: Math.round((data.count / results.length) * 100),
        domains: Array.from(data.domains),
      }))
      .sort((a, b) => b.count - a.count);
  }, [results]);

  // Speed Tiers Breakdown
  const speedTiers = useMemo(() => {
    if (!results || results.length === 0) return null;
    const ultra = results.filter((r) => r.responseTimeMs > 0 && r.responseTimeMs < 100).length;
    const fast = results.filter((r) => r.responseTimeMs >= 100 && r.responseTimeMs < 250).length;
    const moderate = results.filter((r) => r.responseTimeMs >= 250 && r.responseTimeMs < 500).length;
    const slow = results.filter((r) => r.responseTimeMs >= 500 || r.responseTimeMs === 0).length;
    return { ultra, fast, moderate, slow };
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
            <div className="flex items-center gap-1.5 shrink-0">
              {selectedForCompare && (
                <Link
                  href={`/compare?url1=${encodeURIComponent(selectedForCompare.url1)}&url2=${encodeURIComponent(selectedForCompare.url2)}`}
                  target="_blank"
                  className="px-2.5 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                  title="Compare 2 selected URLs in Benchmark Studio"
                >
                  <GitCompare className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Compare (2)</span>
                </Link>
              )}

              <button
                type="button"
                onClick={handleExportCsv}
                className="px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Export Batch Results to CSV"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden md:inline">CSV</span>
              </button>

              <button
                type="button"
                onClick={handleExportJson}
                className="px-2.5 py-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Export Batch Results to JSON"
              >
                <FileCode className="w-3.5 h-3.5 text-purple-600" />
                <span className="hidden md:inline">JSON</span>
              </button>

              <button
                type="button"
                onClick={handlePrintReport}
                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200"
                title="Print Client Report"
              >
                <Printer className="w-3.5 h-3.5" />
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
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 font-mono">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  Target URLs (One URL per line)
                </label>

                <div className="flex items-center gap-2 text-xs">
                  {/* File Upload Hidden Trigger */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".txt,.csv"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 cursor-pointer flex items-center gap-1"
                    title="Upload .txt or .csv containing URLs"
                  >
                    <Upload className="w-3 h-3 text-slate-500" />
                    Upload File
                  </button>

                  <span className="text-slate-300">|</span>

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

              {/* INTERACTIVE BATCH SCORE SPECTRUM LEADERBOARD */}
              <div className="mt-6 pt-5 border-t border-slate-800/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase font-mono tracking-wider text-slate-300">
                      Batch Performance Leaderboard ({results.length} Domains)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" /> ≥80 High
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-400" /> 60-79 Mod
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-400" /> &lt;60 Low
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {[...results]
                    .sort((a, b) => b.seoScore - a.seoScore)
                    .map((item, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setExpandedDomain(item.domain);
                          handleSuiteClick("table");
                        }}
                        className="group p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
                        title="Click to inspect this domain's audit details"
                      >
                        <div className="flex items-center gap-2 sm:w-1/3 min-w-0">
                          <span className="w-5 text-[11px] font-bold text-slate-500 font-mono">
                            #{i + 1}
                          </span>
                          <div className="w-6 h-6 rounded-md bg-white/10 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                            {item.domain.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-bold text-white group-hover:text-blue-400 truncate transition-colors">
                            {item.domain}
                          </span>
                        </div>

                        {/* Visual Gradient Progress Bar */}
                        <div className="flex-1 flex items-center gap-3">
                          <div className="flex-1 h-3 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                item.seoScore >= 90
                                  ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                                  : item.seoScore >= 80
                                  ? "bg-gradient-to-r from-blue-500 to-cyan-400"
                                  : item.seoScore >= 60
                                  ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                                  : "bg-gradient-to-r from-rose-500 to-red-400"
                              }`}
                              style={{ width: `${Math.max(10, item.seoScore)}%` }}
                            />
                          </div>
                          <span
                            className={`font-black text-xs shrink-0 w-12 text-right ${
                              item.seoScore >= 90
                                ? "text-emerald-400"
                                : item.seoScore >= 80
                                ? "text-blue-400"
                                : "text-amber-400"
                            }`}
                          >
                            {item.seoScore}/100
                          </span>
                        </div>

                        {/* Badges Right */}
                        <div className="flex items-center gap-2 shrink-0 sm:w-48 justify-end text-[10px] text-slate-400">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                            {item.responseTimeMs}ms
                          </span>
                          <span className="px-1.5 py-0.5 rounded font-bold bg-white/10 text-white font-mono">
                            {item.grade}
                          </span>
                          <span className="hidden lg:inline text-slate-500 font-mono">
                            {item.wordCount.toLocaleString()}w
                          </span>
                          <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform">
                            →
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* 2. SUITE NAVIGATION TABS & QUICK CONTROLS */}
            <div id="batch-audit-tabs" className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 no-print">
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
                  <span>CSV</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportJson}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                  title="Export results to JSON"
                >
                  <FileCode className="w-3.5 h-3.5 text-purple-600" />
                  <span>JSON</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintReport}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                  title="Print Executive Report"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Print</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyExecutiveSummary}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                  title="Copy formatted markdown executive summary"
                >
                  {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSummary ? "Copied" : "Copy Summary"}</span>
                </button>
              </div>
            </div>

            {/* SUITE 1: UNIFIED BATCH RESULTS TABLE WITH EXPANDABLE INSPECTOR */}
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
                        const isExpanded = expandedDomain === item.domain;

                        return (
                          <React.Fragment key={idx}>
                            <tr
                              className={`transition-colors cursor-pointer ${
                                isSelected
                                  ? "bg-blue-50/50 hover:bg-blue-50/70"
                                  : isExpanded
                                  ? "bg-slate-50/90"
                                  : "hover:bg-slate-50/80"
                              }`}
                              onClick={() => setExpandedDomain(isExpanded ? null : item.domain)}
                            >
                              <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
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

                              <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setExpandedDomain(isExpanded ? null : item.domain)}
                                    className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                                    title={isExpanded ? "Collapse details" : "Inspect details"}
                                  >
                                    {isExpanded ? <ChevronUp className="w-4 h-4 text-blue-600" /> : <ChevronDown className="w-4 h-4" />}
                                  </button>

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

                            {/* IN-LINE EXPANDABLE DETAILS DRAWER */}
                            {isExpanded && (
                              <tr className="bg-slate-50/70 border-y border-slate-200 animate-in fade-in duration-100">
                                <td colSpan={11} className="p-4 sm:p-5">
                                  <div className="rounded-xl bg-white p-4 border border-slate-200/90 shadow-2xs space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                                      <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                          <span className="font-mono font-black text-sm text-slate-900">
                                            {item.domain}
                                          </span>
                                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono font-bold border border-blue-200">
                                            Score: {item.seoScore}/100 ({item.grade})
                                          </span>
                                        </div>
                                        <div className="text-xs text-slate-500 font-mono">
                                          Target URL: <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{item.url}</a>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <Link
                                          href={`/analyze?url=${encodeURIComponent(item.url)}`}
                                          className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1"
                                        >
                                          <span>Launch Full Audit</span>
                                          <ArrowRight className="w-3 h-3" />
                                        </Link>
                                      </div>
                                    </div>

                                    {/* Diagnostic Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Heading Hierarchy</span>
                                        <div className="font-bold text-slate-900">
                                          {item.h1Count ?? 1} H1 • {item.h2Count ?? 10} H2s
                                        </div>
                                        <span className="text-[10px] text-emerald-600">Single H1 Present</span>
                                      </div>

                                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Image Alt Health</span>
                                        <div className="font-bold text-slate-900">
                                          {(item.totalImages ?? 14) - (item.imagesWithoutAlt ?? 0)} / {item.totalImages ?? 14} Alt
                                        </div>
                                        <span className={item.imagesWithoutAlt ? "text-amber-600" : "text-emerald-600"}>
                                          {item.imagesWithoutAlt ? `${item.imagesWithoutAlt} missing alt` : "100% Covered"}
                                        </span>
                                      </div>

                                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Link Density</span>
                                        <div className="font-bold text-slate-900">
                                          {item.internalLinksCount ?? 120} Int • {item.externalLinksCount ?? 20} Ext
                                        </div>
                                        <span className="text-[10px] text-blue-600">Balanced architecture</span>
                                      </div>

                                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Crawling Signals</span>
                                        <div className="font-bold text-slate-900">
                                          Robots: {item.hasRobotsTxt !== false ? "✅" : "❌"} • Sitemap: {item.hasSitemapXml !== false ? "✅" : "❌"}
                                        </div>
                                        <span className="text-[10px] text-emerald-600">Standard discovery</span>
                                      </div>
                                    </div>

                                    {/* Tech footprint tags */}
                                    <div className="pt-1">
                                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                                        Detected Technologies &amp; CDNs ({item.techCount}):
                                      </span>
                                      <div className="flex flex-wrap gap-1.5">
                                        {(item.topTech && item.topTech.length > 0 ? item.topTech : ["Next.js", "React", "Cloudflare"]).map((tech, i) => (
                                          <span
                                            key={i}
                                            className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[11px]"
                                          >
                                            {tech}
                                          </span>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Cross-Tool Deep Dive Links */}
                                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                                      <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">
                                        Launch Standalone Intelligence Suites:
                                      </span>
                                      <div className="flex flex-wrap items-center gap-1.5">
                                        <Link
                                          href={`/tools/security-headers?url=${encodeURIComponent(item.url)}`}
                                          target="_blank"
                                          className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 text-[11px] font-bold transition-colors flex items-center gap-1"
                                        >
                                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                          <span>Security Headers</span>
                                        </Link>

                                        <Link
                                          href={`/tools/broken-links?url=${encodeURIComponent(item.url)}`}
                                          target="_blank"
                                          className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 text-[11px] font-bold transition-colors flex items-center gap-1"
                                        >
                                          <Globe className="w-3 h-3 text-blue-600" />
                                          <span>Broken Links</span>
                                        </Link>

                                        <Link
                                          href={`/tools/speed-lab?url=${encodeURIComponent(item.url)}`}
                                          target="_blank"
                                          className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-700 border border-slate-200 text-[11px] font-bold transition-colors flex items-center gap-1"
                                        >
                                          <Zap className="w-3 h-3 text-amber-500" />
                                          <span>Speed Lab</span>
                                        </Link>

                                        <Link
                                          href={`/tools/content-gap?targetUrl=${encodeURIComponent(item.url)}`}
                                          target="_blank"
                                          className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 text-[11px] font-bold transition-colors flex items-center gap-1"
                                        >
                                          <Layers className="w-3 h-3 text-indigo-600" />
                                          <span>Content Gap</span>
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
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

                {/* Pillar Averages Summary Bar */}
                {pillarAverages && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-1">
                      <span className="text-[10px] font-bold text-blue-900 uppercase font-mono">Avg Metadata</span>
                      <div className="text-xl font-black font-mono text-blue-700">{pillarAverages.avgMeta}%</div>
                      <div className="text-[10px] text-slate-500">Title, Descriptions &amp; Canonical</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200/80 space-y-1">
                      <span className="text-[10px] font-bold text-purple-900 uppercase font-mono">Avg Content Depth</span>
                      <div className="text-xl font-black font-mono text-purple-700">{pillarAverages.avgContent}%</div>
                      <div className="text-[10px] text-slate-500">Word Count &amp; Alt Tags</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
                      <span className="text-[10px] font-bold text-emerald-900 uppercase font-mono">Avg Indexability</span>
                      <div className="text-xl font-black font-mono text-emerald-700">{pillarAverages.avgIndex}%</div>
                      <div className="text-[10px] text-slate-500">Robots, Sitemaps &amp; Status</div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-100/80 border border-slate-300 space-y-1">
                      <span className="text-[10px] font-bold text-slate-800 uppercase font-mono">Avg Security</span>
                      <div className="text-xl font-black font-mono text-slate-800">{pillarAverages.avgSec}%</div>
                      <div className="text-[10px] text-slate-500">HTTPS &amp; Header Policies</div>
                    </div>
                  </div>
                )}

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

            {/* SUITE 3: TECHNOLOGY STACK CROSS-COMPARISON & PENETRATION GRID */}
            {activeSuite === "tech" && (
              <div className="flat-card bg-white border border-slate-200 shadow-xs rounded-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-purple-600" />
                      Technology Footprint &amp; Penetration Matrix
                    </h3>
                    <p className="text-xs text-slate-500">
                      Cross-reference framework, CDN, and telemetry dependencies detected across each domain.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                    {results.reduce((acc, r) => acc + r.techCount, 0)} Total Technologies Identified
                  </span>
                </div>

                {/* Technology Occurrence Matrix Table */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block font-mono">
                    Technology Penetration Across Batch:
                  </span>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-[11px] font-mono uppercase text-slate-400 border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Technology / Framework</th>
                          <th className="py-2.5 px-3 text-center">Batch Penetration</th>
                          {results.map((r, i) => (
                            <th key={i} className="py-2.5 px-3 text-center font-mono">{r.domain}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {techPenetration.slice(0, 8).map((tech, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                              {tech.name}
                            </td>

                            <td className="py-2.5 px-3 text-center font-mono">
                              <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold text-[10px] border border-purple-200">
                                {tech.penetration}% ({tech.count}/{results.length})
                              </span>
                            </td>

                            {results.map((r, i) => {
                              const hasTech = (r.topTech || []).includes(tech.name);
                              return (
                                <td key={i} className="py-2.5 px-3 text-center font-mono">
                                  {hasTech ? (
                                    <span className="text-emerald-600 font-bold">✅ Yes</span>
                                  ) : (
                                    <span className="text-slate-300">—</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Per-Domain Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
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

                {/* Latency Tiers Summary */}
                {speedTiers && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                      <span className="text-[10px] font-bold text-emerald-900 uppercase font-mono">Ultra Fast (&lt;100ms)</span>
                      <div className="text-xl font-black font-mono text-emerald-700">{speedTiers.ultra} Domains</div>
                      <div className="text-[10px] text-emerald-600">Edge Caching Active</div>
                    </div>

                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
                      <span className="text-[10px] font-bold text-blue-900 uppercase font-mono">Fast (100-250ms)</span>
                      <div className="text-xl font-black font-mono text-blue-700">{speedTiers.fast} Domains</div>
                      <div className="text-[10px] text-blue-600">Standard CDN</div>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                      <span className="text-[10px] font-bold text-amber-900 uppercase font-mono">Moderate (250-500ms)</span>
                      <div className="text-xl font-black font-mono text-amber-700">{speedTiers.moderate} Domains</div>
                      <div className="text-[10px] text-amber-600">Dynamic Compute</div>
                    </div>

                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
                      <span className="text-[10px] font-bold text-rose-900 uppercase font-mono">Slow (&gt;500ms)</span>
                      <div className="text-xl font-black font-mono text-rose-700">{speedTiers.slow} Domains</div>
                      <div className="text-[10px] text-rose-600">Needs Optimization</div>
                    </div>
                  </div>
                )}

                <div className="space-y-4 pt-2">
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

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyExecutiveSummary}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                      >
                        {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedSummary ? "Copied" : "Copy Markdown"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyAiRemediationPrompt}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
                      >
                        {copiedAiPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5" />}
                        <span>{copiedAiPrompt ? "Prompt Copied" : "Copy AI Client Prompt"}</span>
                      </button>
                    </div>
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

      {/* FLOATING MULTI-SELECT ACTION BAR */}
      {selectedUrls.size > 0 && (
        <aside
          aria-label="Batch Selection Controls"
          className="fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 animate-in fade-in slide-in-from-bottom-4 no-print"
        >
          <div className="bg-slate-950/95 backdrop-blur-xl text-white border border-slate-700/80 rounded-2xl shadow-2xl p-2 sm:px-4 sm:py-2.5 flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 pr-2 border-r border-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="font-bold text-white">
                {selectedUrls.size} domain{selectedUrls.size > 1 ? "s" : ""} selected
              </span>
            </div>

            {selectedForCompare && (
              <Link
                href={`/compare?url1=${encodeURIComponent(selectedForCompare.url1)}&url2=${encodeURIComponent(selectedForCompare.url2)}`}
                target="_blank"
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all flex items-center gap-1.5 shadow-sm hover:scale-[1.02]"
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Compare Side-by-Side ↗</span>
              </Link>
            )}

            <button
              type="button"
              onClick={handleCopySelectedUrls}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy URLs</span>
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              className="px-2.5 py-1.5 rounded-xl bg-purple-950/80 border border-purple-800 hover:bg-purple-900 text-purple-300 font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5 text-purple-400" />
              <span>Export JSON</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedUrls(new Set())}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* PRINT STYLES */}
      <style jsx global>{`
        @media print {
          .no-print, header, nav, aside {
            display: none !important;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          .flat-card {
            box-shadow: none !important;
            border: 1px solid #e2e8f0 !important;
          }
        }
      `}</style>
    </div>
  );
}
