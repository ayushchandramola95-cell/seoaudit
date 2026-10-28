"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { usePlan } from "@/lib/auth/PlanContext";
import {
  Link2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  Loader2,
  Sparkles,
  ArrowUpRight,
  Clock,
  Download,
  Activity,
  Play,
  Check,
  Filter,
  BarChart2,
  Search,
  Share2,
  Copy,
  Printer,
  RefreshCw,
  Lock,
  Unlock,
  Globe,
  Home,
  FileText,
  AlertOctagon,
  Compass,
  HelpCircle,
  X,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  GitFork,
  Zap,
  Tag,
  ArrowUpDown,
  FileCode2,
  Radio,
} from "lucide-react";

interface LinkItem {
  url: string;
  originalHref: string;
  anchorText: string;
  isInternal: boolean;
  statusCode: number;
  statusText: string;
  timingMs: number;
  health: "healthy" | "redirect" | "broken" | "timeout";
  redirectUrl?: string;
  isHttps: boolean;
  isAnchorEmpty: boolean;
  isGenericAnchor: boolean;
}

interface PageDiscoveryData {
  totalLinksOnPage: number;
  internalLinksCount: number;
  externalLinksCount: number;
  nofollowCount: number;
  sponsoredCount: number;
  emptyAnchorCount: number;
  uniqueExternalDomains: string[];
  linkEquityRatio: {
    internalPercent: number;
    externalPercent: number;
  };
  warnings: string[];
}

interface CrawlReport {
  summary: {
    totalChecked: number;
    healthyCount: number;
    redirectCount: number;
    brokenCount: number;
    timeoutCount: number;
    linkHealthScore: number;
    internalCount: number;
    externalCount: number;
    insecureHttpCount: number;
    emptyAnchorCount: number;
    genericAnchorCount: number;
    avgLatencyMs: number;
  };
  items: LinkItem[];
  pageDiscovery?: PageDiscoveryData;
}

const DEMO_PRESETS: Record<string, CrawlReport> = {
  "https://stripe.com": {
    summary: {
      totalChecked: 8,
      healthyCount: 6,
      redirectCount: 2,
      brokenCount: 0,
      timeoutCount: 0,
      linkHealthScore: 98,
      internalCount: 6,
      externalCount: 2,
      insecureHttpCount: 0,
      emptyAnchorCount: 0,
      genericAnchorCount: 0,
      avgLatencyMs: 48,
    },
    pageDiscovery: {
      totalLinksOnPage: 36,
      internalLinksCount: 30,
      externalLinksCount: 6,
      nofollowCount: 0,
      sponsoredCount: 0,
      emptyAnchorCount: 1,
      uniqueExternalDomains: ["github.com", "twitter.com", "x.com"],
      linkEquityRatio: { internalPercent: 75, externalPercent: 25 },
      warnings: [
        "2 redirect hops detected. Update href attributes directly to final destinations to eliminate redirect latency.",
      ],
    },
    items: [
      {
        url: "https://stripe.com/payments",
        originalHref: "/payments",
        anchorText: "Payments Platform",
        isInternal: true,
        statusCode: 200,
        statusText: "OK",
        timingMs: 42,
        health: "healthy",
        isHttps: true,
        isAnchorEmpty: false,
        isGenericAnchor: false,
      },
      {
        url: "https://stripe.com/billing",
        originalHref: "/billing",
        anchorText: "Billing & Subscriptions",
        isInternal: true,
        statusCode: 200,
        statusText: "OK",
        timingMs: 38,
        health: "healthy",
        isHttps: true,
        isAnchorEmpty: false,
        isGenericAnchor: false,
      },
      {
        url: "https://stripe.com/connect",
        originalHref: "/connect",
        anchorText: "Connect for Marketplaces",
        isInternal: true,
        statusCode: 200,
        statusText: "OK",
        timingMs: 45,
        health: "healthy",
        isHttps: true,
        isAnchorEmpty: false,
        isGenericAnchor: false,
      },
      {
        url: "https://stripe.com/docs",
        originalHref: "/docs",
        anchorText: "Developer Documentation",
        isInternal: true,
        statusCode: 200,
        statusText: "OK",
        timingMs: 51,
        health: "healthy",
        isHttps: true,
        isAnchorEmpty: false,
        isGenericAnchor: false,
      },
      {
        url: "https://stripe.com/pricing-old",
        originalHref: "/pricing-old",
        anchorText: "Old Pricing Plan",
        isInternal: true,
        statusCode: 301,
        statusText: "Moved Permanently",
        timingMs: 65,
        health: "redirect",
        redirectUrl: "https://stripe.com/pricing",
        isHttps: true,
        isAnchorEmpty: false,
        isGenericAnchor: false,
      },
      {
        url: "https://github.com/stripe",
        originalHref: "https://github.com/stripe",
        anchorText: "GitHub Repositories",
        isInternal: false,
        statusCode: 200,
        statusText: "OK",
        timingMs: 88,
        health: "healthy",
        isHttps: true,
        isAnchorEmpty: false,
        isGenericAnchor: false,
      },
      {
        url: "https://twitter.com/stripe",
        originalHref: "https://twitter.com/stripe",
        anchorText: "Twitter / X Feed",
        isInternal: false,
        statusCode: 302,
        statusText: "Found",
        timingMs: 76,
        health: "redirect",
        redirectUrl: "https://x.com/stripe",
        isHttps: true,
        isAnchorEmpty: false,
        isGenericAnchor: false,
      },
      {
        url: "https://stripe.com/global",
        originalHref: "/global",
        anchorText: "Global Infrastructure",
        isInternal: true,
        statusCode: 200,
        statusText: "OK",
        timingMs: 44,
        health: "healthy",
        isHttps: true,
        isAnchorEmpty: false,
        isGenericAnchor: false,
      },
    ],
  },
  "https://github.com": {
    summary: {
      totalChecked: 5,
      healthyCount: 4,
      redirectCount: 0,
      brokenCount: 1,
      timeoutCount: 0,
      linkHealthScore: 88,
      internalCount: 5,
      externalCount: 0,
      insecureHttpCount: 0,
      emptyAnchorCount: 0,
      genericAnchorCount: 0,
      avgLatencyMs: 58,
    },
    pageDiscovery: {
      totalLinksOnPage: 42,
      internalLinksCount: 38,
      externalLinksCount: 4,
      nofollowCount: 2,
      sponsoredCount: 0,
      emptyAnchorCount: 0,
      uniqueExternalDomains: ["github.blog", "docs.github.com"],
      linkEquityRatio: { internalPercent: 90, externalPercent: 10 },
      warnings: [
        "1 broken 404 link discovered (/old-blog-archive). Add a 301 redirect or update internal navigation immediately.",
      ],
    },
    items: [
      {
        url: "https://github.com/features",
        originalHref: "/features",
        anchorText: "Platform Features",
        isInternal: true,
        statusCode: 200,
        statusText: "OK",
        timingMs: 48,
        health: "healthy",
        isHttps: true,
        isAnchorEmpty: false,
        isGenericAnchor: false,
      },
      {
        url: "https://github.com/pricing",
        originalHref: "/pricing",
        anchorText: "GitHub Pricing",
        isInternal: true,
        statusCode: 200,
        statusText: "OK",
        timingMs: 52,
        health: "healthy",
        isHttps: true,
        isAnchorEmpty: false,
        isGenericAnchor: false,
      },
      {
        url: "https://github.com/enterprise",
        originalHref: "/enterprise",
        anchorText: "Enterprise Security",
        isInternal: true,
        statusCode: 200,
        statusText: "OK",
        timingMs: 58,
        health: "healthy",
        isHttps: true,
        isAnchorEmpty: false,
        isGenericAnchor: false,
      },
      {
        url: "https://github.com/old-blog-archive",
        originalHref: "/old-blog-archive",
        anchorText: "Legacy 2012 Blog",
        isInternal: true,
        statusCode: 404,
        statusText: "Not Found",
        timingMs: 72,
        health: "broken",
        isHttps: true,
        isAnchorEmpty: false,
        isGenericAnchor: false,
      },
      {
        url: "https://github.com/readme",
        originalHref: "/readme",
        anchorText: "The ReadME Project",
        isInternal: true,
        statusCode: 200,
        statusText: "OK",
        timingMs: 61,
        health: "healthy",
        isHttps: true,
        isAnchorEmpty: false,
        isGenericAnchor: false,
      },
    ],
  },
  "https://vercel.com": {
    summary: {
      totalChecked: 6,
      healthyCount: 5,
      redirectCount: 1,
      brokenCount: 0,
      timeoutCount: 0,
      linkHealthScore: 99,
      internalCount: 5,
      externalCount: 1,
      insecureHttpCount: 0,
      emptyAnchorCount: 0,
      genericAnchorCount: 0,
      avgLatencyMs: 41,
    },
    pageDiscovery: {
      totalLinksOnPage: 54,
      internalLinksCount: 46,
      externalLinksCount: 8,
      nofollowCount: 1,
      sponsoredCount: 0,
      emptyAnchorCount: 0,
      uniqueExternalDomains: ["nextjs.org", "turborepo.org"],
      linkEquityRatio: { internalPercent: 85, externalPercent: 15 },
      warnings: [
        "1 permanent 308 redirect detected (/legacy-now). Update anchor href directly to /docs/cli.",
      ],
    },
    items: [
      {
        url: "https://vercel.com/docs",
        originalHref: "/docs",
        anchorText: "Vercel Documentation",
        isInternal: true,
        statusCode: 200,
        statusText: "OK",
        timingMs: 34,
        health: "healthy",
        isHttps: true,
        isAnchorEmpty: false,
        isGenericAnchor: false,
      },
      {
        url: "https://vercel.com/templates",
        originalHref: "/templates",
        anchorText: "Next.js Templates",
        isInternal: true,
        statusCode: 200,
        statusText: "OK",
        timingMs: 39,
        health: "healthy",
        isHttps: true,
        isAnchorEmpty: false,
        isGenericAnchor: false,
      },
      {
        url: "https://vercel.com/pricing",
        originalHref: "/pricing",
        anchorText: "Pricing & Quotas",
        isInternal: true,
        statusCode: 200,
        statusText: "OK",
        timingMs: 36,
        health: "healthy",
        isHttps: true,
        isAnchorEmpty: false,
        isGenericAnchor: false,
      },
      {
        url: "https://vercel.com/ai",
        originalHref: "/ai",
        anchorText: "Vercel AI SDK",
        isInternal: true,
        statusCode: 200,
        statusText: "OK",
        timingMs: 41,
        health: "healthy",
        isHttps: true,
        isAnchorEmpty: false,
        isGenericAnchor: false,
      },
      {
        url: "https://vercel.com/legacy-now",
        originalHref: "/legacy-now",
        anchorText: "ZEIT Now CLI Docs",
        isInternal: true,
        statusCode: 308,
        statusText: "Permanent Redirect",
        timingMs: 52,
        health: "redirect",
        redirectUrl: "https://vercel.com/docs/cli",
        isHttps: true,
        isAnchorEmpty: false,
        isGenericAnchor: false,
      },
      {
        url: "https://nextjs.org",
        originalHref: "https://nextjs.org",
        anchorText: "Next.js Framework",
        isInternal: false,
        statusCode: 200,
        statusText: "OK",
        timingMs: 45,
        health: "healthy",
        isHttps: true,
        isAnchorEmpty: false,
        isGenericAnchor: false,
      },
    ],
  },
};

export default function BrokenLinksClient() {
  const searchParams = useSearchParams();
  const urlParam = searchParams.get("url");

  const [url, setUrl] = useState("https://stripe.com");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<CrawlReport | null>(DEMO_PRESETS["https://stripe.com"]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "broken" | "redirect" | "healthy">("all");
  const [scopeFilter, setScopeFilter] = useState<"all" | "internal" | "external">("all");
  const [protocolFilter, setProtocolFilter] = useState<"all" | "insecure">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLiveScan, setIsLiveScan] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedLinkForInspection, setSelectedLinkForInspection] = useState<LinkItem | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [sortField, setSortField] = useState<"url" | "anchor" | "status" | "latency">("status");
  const [sortAsc, setSortAsc] = useState(false);

  const presets = [
    { label: "Stripe", url: "https://stripe.com" },
    { label: "GitHub", url: "https://github.com" },
    { label: "Vercel", url: "https://vercel.com" },
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 2500);
  };

  const handleScan = async (targetToScan = url) => {
    if (!targetToScan) return;
    setLoading(true);
    setError(null);

    let formattedUrl = targetToScan.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
      setUrl(formattedUrl);
    }

    try {
      const res = await fetch("/api/crawler/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUrl: formattedUrl }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to crawl links.");
      }
      setReport(json.data);
      setIsLiveScan(true);
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to crawl website links.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-scan if incoming URL param is provided
  useEffect(() => {
    if (urlParam && urlParam.trim()) {
      let formatted = urlParam.trim();
      if (!formatted.startsWith("http://") && !formatted.startsWith("https://")) {
        formatted = `https://${formatted}`;
      }
      setUrl(formatted);
      handleScan(formatted);
    }
  }, [urlParam]);

  const filteredAndSortedItems = useMemo(() => {
    if (!report?.items) return [];

    let items = report.items.filter((item) => {
      if (filter !== "all" && item.health !== filter) return false;
      if (scopeFilter === "internal" && !item.isInternal) return false;
      if (scopeFilter === "external" && item.isInternal) return false;
      if (protocolFilter === "insecure" && item.isHttps) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.url.toLowerCase().includes(q) ||
          item.anchorText.toLowerCase().includes(q) ||
          String(item.statusCode).includes(q) ||
          (item.redirectUrl && item.redirectUrl.toLowerCase().includes(q))
        );
      }
      return true;
    });

    items.sort((a, b) => {
      let comp = 0;
      if (sortField === "status") {
        comp = a.statusCode - b.statusCode;
      } else if (sortField === "latency") {
        comp = a.timingMs - b.timingMs;
      } else if (sortField === "anchor") {
        comp = a.anchorText.localeCompare(b.anchorText);
      } else if (sortField === "url") {
        comp = a.url.localeCompare(b.url);
      }
      return sortAsc ? comp : -comp;
    });

    return items;
  }, [report, filter, scopeFilter, protocolFilter, searchQuery, sortField, sortAsc]);

  const avgLatencyMs = useMemo(() => {
    if (!report || report.items.length === 0) return 0;
    return Math.round(report.items.reduce((sum, i) => sum + i.timingMs, 0) / report.items.length);
  }, [report]);

  const handleCopyLink = (linkUrl: string) => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(linkUrl);
    setCopiedUrl(linkUrl);
    showToast("URL copied to clipboard!");
    setTimeout(() => {
      setCopiedUrl((c) => (c === linkUrl ? null : c));
    }, 2000);
  };

  const handleCopyShareLink = () => {
    if (typeof window === "undefined") return;
    const shareUrl = `${window.location.origin}/tools/broken-links?url=${encodeURIComponent(url)}`;
    navigator.clipboard.writeText(shareUrl);
    showToast("Shareable link report copied to clipboard!");
  };

  const handleExportCsv = () => {
    if (!report) return;
    const rows = [
      [
        "URL",
        "Original HREF",
        "Anchor Text",
        "Scope",
        "Protocol",
        "Status Code",
        "Status Text",
        "Health",
        "Redirect Target",
        "Latency (ms)",
      ],
      ...report.items.map((i) => [
        `"${i.url.replace(/"/g, '""')}"`,
        `"${(i.originalHref || "").replace(/"/g, '""')}"`,
        `"${(i.anchorText || "").replace(/"/g, '""')}"`,
        i.isInternal ? "Internal" : "External",
        i.isHttps ? "HTTPS" : "HTTP",
        String(i.statusCode),
        `"${i.statusText}"`,
        i.health,
        `"${i.redirectUrl || ""}"`,
        String(i.timingMs),
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `broken-links-audit-${url.replace(/https?:\/\//, "").split("/")[0]}.csv`;
    link.click();
    showToast("Full CSV report downloaded!");
  };

  const handleExportJson = () => {
    if (!report) return;
    const jsonStr = JSON.stringify(
      {
        targetUrl: url,
        mode: isLiveScan ? "live_parallel_crawl" : "sample_snapshot",
        crawledAt: new Date().toISOString(),
        summary: report.summary,
        pageDiscovery: report.pageDiscovery,
        items: report.items,
      },
      null,
      2
    );
    const blob = new Blob([jsonStr], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `broken-links-audit-${url.replace(/https?:\/\//, "").split("/")[0]}.json`;
    link.click();
    showToast("Telemetry JSON report exported successfully!");
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const total = report?.summary.totalChecked || 1;
  const healthyPct = Math.round(((report?.summary.healthyCount || 0) / total) * 100);
  const redirectPct = Math.round(((report?.summary.redirectCount || 0) / total) * 100);
  const brokenPct = Math.max(0, 100 - healthyPct - redirectPct);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-2xl border border-slate-800 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold">
          <Link2 className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
          <span>High-Speed Hyperlink &amp; 404 Crawler Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Broken Link &amp; 404 Status Crawler
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Deep-crawls internal and external hyperlinks, detecting dead 404 endpoints, redirect hops, and anchor text disparities with sub-second Cheerio streaming.
        </p>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleScan();
          }}
          className="mt-6 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto"
        >
          <input
            type="text"
            required
            placeholder="Enter website URL (e.g. https://yourdomain.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white shadow-2xs font-mono text-slate-900 placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-sm shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Crawling Links...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                Crawl Website Links
              </>
            )}
          </button>
        </form>

        {/* Demo Presets */}
        <div className="flex items-center justify-center gap-2 mt-3.5 text-xs text-slate-500">
          <span>Try verified sample:</span>
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setUrl(p.url);
                setReport(DEMO_PRESETS[p.url] || null);
                setIsLiveScan(false);
                handleScan(p.url);
              }}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 font-semibold transition-colors cursor-pointer border border-slate-200"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-8 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results */}
      {report && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Quick Action Toolbar (Share, CSV, JSON, Print, Re-Crawl) */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="font-bold text-slate-900 font-mono">{url}</span>
              <span className="text-slate-300">|</span>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                {isLiveScan ? "Live Parallel HTTP Crawl" : "Sample Crawl Snapshot"}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-purple-600" />
                <span>Share Link</span>
              </button>

              <button
                type="button"
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={handleExportJson}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                <FileCode2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Export JSON</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Print PDF</span>
              </button>

              <button
                type="button"
                onClick={() => handleScan(url)}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>Re-Crawl</span>
              </button>
            </div>
          </div>

          {/* Main Hero Summary Card: Health Radial Gauge + Scorecard */}
          <div className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-2xl shadow-sm">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-6 border-b border-slate-100">
              {/* Radial Gauge with Ambient Glow & Gradient Stroke */}
              <div className="flex items-center gap-6">
                <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                  <div
                    className={`absolute inset-0 rounded-full blur-xl opacity-25 ${
                      report.summary.linkHealthScore >= 90
                        ? "bg-emerald-500"
                        : report.summary.linkHealthScore >= 70
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                  />
                  <svg className="w-full h-full -rotate-90 transform relative z-10" viewBox="0 0 120 120">
                    <defs>
                      <linearGradient id="linkHealthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        {report.summary.linkHealthScore >= 90 ? (
                          <>
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#06b6d4" />
                          </>
                        ) : report.summary.linkHealthScore >= 70 ? (
                          <>
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#ea580c" />
                          </>
                        ) : (
                          <>
                            <stop offset="0%" stopColor="#f43f5e" />
                            <stop offset="100%" stopColor="#dc2626" />
                          </>
                        )}
                      </linearGradient>
                    </defs>
                    <circle cx="60" cy="60" r="50" stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="url(#linkHealthGrad)"
                      strokeWidth="10"
                      strokeDasharray={2 * Math.PI * 50}
                      strokeDashoffset={2 * Math.PI * 50 * (1 - report.summary.linkHealthScore / 100)}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <span className="text-3xl font-black text-slate-900 tracking-tight">
                      {report.summary.linkHealthScore}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      / 100
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                      <span>Hyperlink Health Index</span>
                    </div>
                    {report.summary.insecureHttpCount > 0 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                        {report.summary.insecureHttpCount} Insecure HTTP
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {report.summary.brokenCount === 0
                      ? "Zero Broken Links Detected"
                      : `${report.summary.brokenCount} Dead Link${report.summary.brokenCount > 1 ? "s" : ""} Require Attention`}
                  </h2>
                  <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                    Audited {report.items.length} hyperlinks ({report.summary.internalCount} internal,{" "}
                    {report.summary.externalCount} external outbound) • Avg Latency: {avgLatencyMs}ms.
                  </p>
                </div>
              </div>

              {/* Action Link to Full Audit */}
              <div className="flex items-center gap-3">
                <Link
                  href={`/analyze?url=${encodeURIComponent(url)}&tab=deadlinks`}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-purple-600 text-white text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-colors shadow-sm"
                >
                  <span>Open in 14-Engine Auditor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 5-Card Telemetry Summary Grid with Icons */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 py-5 border-b border-slate-100">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Total Audited</span>
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <span className="text-2xl font-black text-slate-900 font-mono block">
                  {report.items.length}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  {report.summary.internalCount} int • {report.summary.externalCount} ext
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
                <div className="flex items-center justify-between text-emerald-800 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Healthy (200)</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span className="text-2xl font-black text-emerald-700 font-mono block">
                  {report.summary.healthyCount}
                </span>
                <span className="text-[10px] text-emerald-600 mt-0.5 block">{healthyPct}% pass rate</span>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
                <div className="flex items-center justify-between text-amber-800 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Redirects (3xx)</span>
                  <GitFork className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <span className="text-2xl font-black text-amber-700 font-mono block">
                  {report.summary.redirectCount}
                </span>
                <span className="text-[10px] text-amber-600 mt-0.5 block">301 / 302 / 308 hops</span>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200">
                <div className="flex items-center justify-between text-rose-800 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Dead Links (404)</span>
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                </div>
                <span className="text-2xl font-black text-rose-700 font-mono block">
                  {report.summary.brokenCount}
                </span>
                <span className="text-[10px] text-rose-600 mt-0.5 block">Broken or refused</span>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200 col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between text-indigo-800 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Avg Latency</span>
                  <Zap className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <span className="text-2xl font-black text-indigo-700 font-mono block">
                  {avgLatencyMs}ms
                </span>
                <span className="text-[10px] text-indigo-600 mt-0.5 block">Parallel HEAD/GET</span>
              </div>
            </div>

            {/* Visual Link Status Proportional Bar Chart */}
            <div className="pt-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Link Response Distribution Ratio</span>
                <span className="text-slate-400 font-mono text-[11px]">{report.summary.totalChecked} Total Audited</span>
              </div>

              {/* Stacked Proportional Bar */}
              <div className="h-4 rounded-full overflow-hidden flex bg-slate-100 border border-slate-200/80 p-0.5 gap-0.5">
                <div
                  style={{ width: `${healthyPct}%` }}
                  className="bg-emerald-500 h-full rounded-l-full transition-all duration-700"
                  title={`${healthyPct}% Healthy (200 OK)`}
                />
                <div
                  style={{ width: `${redirectPct}%` }}
                  className="bg-amber-400 h-full transition-all duration-700"
                  title={`${redirectPct}% Redirects (3xx)`}
                />
                <div
                  style={{ width: `${brokenPct}%` }}
                  className="bg-rose-500 h-full rounded-r-full transition-all duration-700"
                  title={`${brokenPct}% Broken (404/5xx)`}
                />
              </div>

              {/* Legend Strip */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs pt-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="font-bold text-slate-800">{report.summary.healthyCount} Healthy ({healthyPct}%)</span>
                  <span className="text-slate-400 text-[11px]">200 OK responses</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="font-bold text-slate-800">{report.summary.redirectCount} Redirects ({redirectPct}%)</span>
                  <span className="text-slate-400 text-[11px]">301/302 hops</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="font-bold text-slate-800">{report.summary.brokenCount} Broken ({brokenPct}%)</span>
                  <span className="text-slate-400 text-[11px]">404 / 500 errors</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Interactive Diagnostic Analysis Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Widget 1: Link Scope & Equity Distribution */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Link Scope &amp; Equity
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {report.pageDiscovery?.totalLinksOnPage || report.summary.totalChecked} on Page
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-slate-600 flex items-center gap-1 font-semibold">
                    <Home className="w-3 h-3 text-blue-600" /> Internal (
                    {report.pageDiscovery?.linkEquityRatio?.internalPercent ??
                      Math.round((report.summary.internalCount / total) * 100)}
                    %)
                  </span>
                  <span className="text-slate-600 flex items-center gap-1 font-semibold">
                    <Globe className="w-3 h-3 text-emerald-600" /> External (
                    {report.pageDiscovery?.linkEquityRatio?.externalPercent ??
                      Math.round((report.summary.externalCount / total) * 100)}
                    %)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden flex border border-slate-200/80">
                  <div
                    className="h-full bg-blue-600"
                    style={{
                      width: `${
                        report.pageDiscovery?.linkEquityRatio?.internalPercent ??
                        Math.round((report.summary.internalCount / total) * 100)
                      }%`,
                    }}
                  />
                  <div
                    className="h-full bg-emerald-500"
                    style={{
                      width: `${
                        report.pageDiscovery?.linkEquityRatio?.externalPercent ??
                        Math.round((report.summary.externalCount / total) * 100)
                      }%`,
                    }}
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Internal links pass domain authority (PageRank) to key landing pages, while external outbound links cite reputable references.
              </p>
            </div>

            {/* Widget 2: Security & Protocol Hygiene */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Protocol &amp; Security
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    report.summary.insecureHttpCount === 0
                      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                      : "text-amber-700 bg-amber-50 border-amber-200"
                  }`}
                >
                  {report.summary.insecureHttpCount === 0 ? "100% Encrypted" : "Mixed Content Warning"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    report.summary.insecureHttpCount === 0
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "bg-amber-50 text-amber-600 border border-amber-200"
                  }`}
                >
                  {report.summary.insecureHttpCount === 0 ? (
                    <Lock className="w-5 h-5" />
                  ) : (
                    <Unlock className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    {report.summary.insecureHttpCount === 0
                      ? "All Links Enforce HTTPS"
                      : `${report.summary.insecureHttpCount} Insecure HTTP Link${
                          report.summary.insecureHttpCount > 1 ? "s" : ""
                        }`}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {report.summary.insecureHttpCount === 0
                      ? "Zero mixed-content browser warnings detected."
                      : "Upgrade HTTP destinations to HTTPS to prevent security warnings."}
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Google Chrome and search crawlers favor strict TLS 1.3 encrypted endpoints to guarantee visitor privacy.
              </p>
            </div>

            {/* Widget 3: Anchor Text SEO Quality */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Anchor Text Quality
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    report.summary.emptyAnchorCount === 0
                      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                      : "text-amber-700 bg-amber-50 border-amber-200"
                  }`}
                >
                  {report.summary.emptyAnchorCount === 0 ? "Clean Anchors" : `${report.summary.emptyAnchorCount} Empty`}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Descriptive Copy:</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {report.items.length - report.summary.emptyAnchorCount - report.summary.genericAnchorCount} links
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Empty Anchor Text:</span>
                  <span className="font-mono font-bold text-amber-700">
                    {report.summary.emptyAnchorCount} links
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Generic ('Click Here'):</span>
                  <span className="font-mono font-bold text-slate-700">
                    {report.summary.genericAnchorCount} links
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Descriptive keyword anchors provide contextual clues that help Google rank destination pages for relevant queries.
              </p>
            </div>
          </div>

          {/* Outbound External Domain Footprint (When present) */}
          {report.pageDiscovery?.uniqueExternalDomains && report.pageDiscovery.uniqueExternalDomains.length > 0 && (
            <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Outbound Authority Footprint ({report.pageDiscovery.uniqueExternalDomains.length} Unique External Domains)
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">External Destinations</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {report.pageDiscovery.uniqueExternalDomains.map((domain, dIdx) => (
                  <span
                    key={dIdx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium bg-slate-50 text-slate-700 border border-slate-200"
                  >
                    <Tag className="w-3 h-3 text-purple-600" />
                    <span>{domain}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Table Header & Interactive Filter Tabs */}
          <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              {/* Health Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mr-1">
                  <Filter className="w-3.5 h-3.5" /> Filter by Health:
                </span>
                <div className="flex gap-1.5 text-xs flex-wrap">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      filter === "all" ? "bg-slate-900 text-white shadow-2xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    All ({report.items.length})
                  </button>
                  <button
                    onClick={() => setFilter("broken")}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      filter === "broken" ? "bg-rose-600 text-white shadow-2xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Broken ({report.summary.brokenCount})
                  </button>
                  <button
                    onClick={() => setFilter("redirect")}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      filter === "redirect" ? "bg-amber-600 text-white shadow-2xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Redirects ({report.summary.redirectCount})
                  </button>
                  <button
                    onClick={() => setFilter("healthy")}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      filter === "healthy" ? "bg-emerald-600 text-white shadow-2xs" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Healthy ({report.summary.healthyCount})
                  </button>
                </div>
              </div>

              {/* Scope Switcher, Protocol Filter & Search */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Scope Switcher */}
                <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs font-semibold">
                  {[
                    { id: "all", label: "All Scope" },
                    { id: "internal", label: `Internal (${report.summary.internalCount})` },
                    { id: "external", label: `External (${report.summary.externalCount})` },
                  ].map((sc) => (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => setScopeFilter(sc.id as typeof scopeFilter)}
                      className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                        scopeFilter === sc.id
                          ? "bg-white text-purple-700 shadow-2xs font-bold"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {sc.label}
                    </button>
                  ))}
                </div>

                {/* Protocol Filter */}
                {report.summary.insecureHttpCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setProtocolFilter(protocolFilter === "all" ? "insecure" : "all")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      protocolFilter === "insecure"
                        ? "bg-amber-100 text-amber-800 border-amber-300 font-bold"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    ⚠️ Insecure HTTP ({report.summary.insecureHttpCount})
                  </button>
                )}

                {/* Search Bar */}
                <div className="relative w-48 sm:w-56">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search URL or anchor..."
                    className="w-full pl-8 pr-7 py-1.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="text-xs font-mono text-slate-500 whitespace-nowrap">
                  {filteredAndSortedItems.length}/{report.items.length} links
                </div>
              </div>
            </div>

            {/* Link List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider select-none">
                    <th
                      className="py-3 px-3 cursor-pointer hover:text-slate-700"
                      onClick={() => {
                        if (sortField === "status") setSortAsc(!sortAsc);
                        else {
                          setSortField("status");
                          setSortAsc(true);
                        }
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <span>Status</span>
                        <ArrowUpDown className="w-3 h-3 opacity-60" />
                      </div>
                    </th>
                    <th className="py-3 px-3">Scope &amp; Protocol</th>
                    <th
                      className="py-3 px-3 cursor-pointer hover:text-slate-700"
                      onClick={() => {
                        if (sortField === "anchor") setSortAsc(!sortAsc);
                        else {
                          setSortField("anchor");
                          setSortAsc(true);
                        }
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <span>Anchor Text</span>
                        <ArrowUpDown className="w-3 h-3 opacity-60" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-3 cursor-pointer hover:text-slate-700"
                      onClick={() => {
                        if (sortField === "url") setSortAsc(!sortAsc);
                        else {
                          setSortField("url");
                          setSortAsc(true);
                        }
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <span>Target Destination URL</span>
                        <ArrowUpDown className="w-3 h-3 opacity-60" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-3 text-right cursor-pointer hover:text-slate-700"
                      onClick={() => {
                        if (sortField === "latency") setSortAsc(!sortAsc);
                        else {
                          setSortField("latency");
                          setSortAsc(true);
                        }
                      }}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Latency</span>
                        <ArrowUpDown className="w-3 h-3 opacity-60" />
                      </div>
                    </th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAndSortedItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                      {/* Status Code */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                            item.health === "healthy"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : item.health === "broken"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {item.statusCode || "ERR"} {item.statusText}
                        </span>
                      </td>

                      {/* Scope & Protocol */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${
                              item.isInternal
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            {item.isInternal ? <Home className="w-2.5 h-2.5" /> : <Globe className="w-2.5 h-2.5" />}
                            <span>{item.isInternal ? "Internal" : "External"}</span>
                          </span>

                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                              item.isHttps
                                ? "bg-slate-50 text-slate-600 border-slate-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                            title={item.isHttps ? "Secure HTTPS" : "Insecure HTTP"}
                          >
                            {item.isHttps ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                          </span>
                        </div>
                      </td>

                      {/* Anchor Text */}
                      <td className="py-3 px-3 font-semibold text-slate-800 max-w-[200px] truncate">
                        {item.isAnchorEmpty ? (
                          <span className="text-amber-700 font-normal italic flex items-center gap-1 text-[11px]">
                            <AlertTriangle className="w-3 h-3 shrink-0" />
                            [Empty Anchor Text]
                          </span>
                        ) : item.isGenericAnchor ? (
                          <span className="text-slate-800 flex items-center gap-1">
                            <span>{item.anchorText}</span>
                            <span className="text-[10px] font-normal text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                              generic
                            </span>
                          </span>
                        ) : (
                          item.anchorText
                        )}
                      </td>

                      {/* Target Destination URL */}
                      <td className="py-3 px-3 text-slate-600 max-w-sm">
                        <div className="flex items-center gap-1 font-mono text-[11px] truncate">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-purple-600 hover:underline truncate"
                          >
                            {item.url}
                          </a>
                        </div>
                        {item.redirectUrl && (
                          <div className="text-[11px] text-amber-700 mt-0.5 flex items-center gap-1 font-mono">
                            <span className="font-bold">↳ 301 Target:</span>
                            <a
                              href={item.redirectUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline truncate text-slate-700"
                            >
                              {item.redirectUrl}
                            </a>
                          </div>
                        )}
                      </td>

                      {/* Latency */}
                      <td className="py-3 px-3 text-right font-mono text-slate-500 whitespace-nowrap">
                        <span
                          className={`font-bold ${
                            item.timingMs < 80
                              ? "text-emerald-700"
                              : item.timingMs < 200
                              ? "text-slate-700"
                              : "text-amber-700"
                          }`}
                        >
                          {item.timingMs}ms
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedLinkForInspection(item)}
                            className="p-1 rounded-md text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                            title="Inspect Diagnostics"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyLink(item.url)}
                            className="p-1 rounded-md text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                            title="Copy URL"
                          >
                            {copiedUrl === item.url ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-md text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                            title="Open Link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredAndSortedItems.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-400">
                        No links matching the selected filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actionable Remediation Guidance & 404 Fixes */}
          <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 uppercase tracking-wider">
                <FileCode2 className="w-3.5 h-3.5 text-purple-600" />
                <span>Actionable SEO Remediation Playbook</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mt-1">
                Engineering Fixes for Dead Links &amp; Redirect Bottlenecks
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black flex items-center justify-center">
                    1
                  </span>
                  <span>Fix 404 Dead Links via 301</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Never leave broken 404s unhandled. Add a permanent 301 redirect in your edge config or CMS to preserve inbound link equity and eliminate user bounce rates.
                </p>
                <div className="pt-1 text-[11px] font-mono text-purple-700 font-semibold">
                  next.config.js redirects() or Nginx rewrite
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black flex items-center justify-center">
                    2
                  </span>
                  <span>Eliminate Redirect Chains</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  When a link triggers a 301/302 hop, update the original href attribute directly to the final destination to conserve search engine crawl budget.
                </p>
                <div className="pt-1 text-[11px] font-mono text-purple-700 font-semibold">
                  Reduces TTFB by ~60ms per hop
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black flex items-center justify-center">
                    3
                  </span>
                  <span>Descriptive Anchor Keywords</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Replace generic copy like "click here" or empty anchors with informative target keywords to maximize Google PageRank relevance scoring.
                </p>
                <div className="pt-1 text-[11px] font-mono text-purple-700 font-semibold">
                  Boosts destination ranking signals
                </div>
              </div>
            </div>
          </div>

          {/* Autopilot Sentinel Banner */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-2xl border border-purple-900/60 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3 h-3" />
                Automated 404 Sentinel
              </div>
              <h3 className="text-lg font-bold">Never Let a Dead Link Break Your SEO or Ad Traffic</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                Connect your domains to SeoSeite Autopilot. Our background cron worker continuously scans your site and alerts you via Slack/Discord before Google Search Console penalizes your index.
              </p>
            </div>
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold whitespace-nowrap transition-all shadow-md shrink-0 cursor-pointer"
            >
              Start Automated Monitoring
            </Link>
          </div>
        </div>
      )}

      {/* Interactive Link Diagnostic Drawer / Modal */}
      {selectedLinkForInspection && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-bold text-purple-600 uppercase tracking-wider font-mono">
                  Link Diagnostic Inspector
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mt-0.5 truncate max-w-md">
                  {selectedLinkForInspection.anchorText}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLinkForInspection(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-mono">Status Code:</span>
                <span
                  className={`px-2 py-0.5 rounded font-mono font-bold ${
                    selectedLinkForInspection.health === "healthy"
                      ? "bg-emerald-100 text-emerald-800"
                      : selectedLinkForInspection.health === "broken"
                      ? "bg-rose-100 text-rose-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {selectedLinkForInspection.statusCode} {selectedLinkForInspection.statusText}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-mono">Scope:</span>
                <span className="font-bold text-slate-800">
                  {selectedLinkForInspection.isInternal ? "Internal Site Link" : "External Outbound"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-mono">Protocol:</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  {selectedLinkForInspection.isHttps ? (
                    <>
                      <Lock className="w-3 h-3 text-emerald-600" /> Secure HTTPS
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3 h-3 text-amber-600" /> Insecure HTTP
                    </>
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-mono">Response Latency:</span>
                <span className="font-mono font-bold text-slate-900">
                  {selectedLinkForInspection.timingMs}ms
                </span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="font-bold text-slate-800">Destination URL:</div>
              <div className="p-2.5 rounded-lg bg-slate-100 font-mono text-[11px] text-slate-800 break-all select-all">
                {selectedLinkForInspection.url}
              </div>
            </div>

            {selectedLinkForInspection.redirectUrl && (
              <div className="space-y-1 text-xs">
                <div className="font-bold text-amber-800">Redirects To:</div>
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 font-mono text-[11px] text-amber-900 break-all select-all">
                  {selectedLinkForInspection.redirectUrl}
                </div>
              </div>
            )}

            <div className="space-y-1 text-xs text-slate-600">
              <div className="font-bold text-slate-800">SEO Recommendation:</div>
              <p className="leading-relaxed">
                {selectedLinkForInspection.health === "broken"
                  ? "Dead 404 links cause crawl budget waste and bad user experience. Add a 301 redirect or remove this anchor from the template."
                  : selectedLinkForInspection.health === "redirect"
                  ? "Update the original link href directly to the redirect destination to save latency and avoid redirect chains."
                  : "Link is healthy (200 OK) with fast response latency."}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <a
                href={selectedLinkForInspection.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 cursor-pointer"
              >
                <span>Visit URL</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setSelectedLinkForInspection(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
