"use client";

import { useState } from "react";
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
  BarChart2
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
  };
  items: LinkItem[];
}

const DEMO_PRESETS: Record<string, CrawlReport> = {
  "https://stripe.com": {
    summary: {
      totalChecked: 72,
      healthyCount: 68,
      redirectCount: 4,
      brokenCount: 0,
      timeoutCount: 0,
      linkHealthScore: 98,
      internalCount: 54,
      externalCount: 18,
    },
    items: [
      { url: "https://stripe.com/payments", originalHref: "/payments", anchorText: "Payments", isInternal: true, statusCode: 200, statusText: "OK", timingMs: 42, health: "healthy" },
      { url: "https://stripe.com/billing", originalHref: "/billing", anchorText: "Billing & Subscriptions", isInternal: true, statusCode: 200, statusText: "OK", timingMs: 38, health: "healthy" },
      { url: "https://stripe.com/connect", originalHref: "/connect", anchorText: "Connect for Marketplaces", isInternal: true, statusCode: 200, statusText: "OK", timingMs: 45, health: "healthy" },
      { url: "https://stripe.com/docs", originalHref: "/docs", anchorText: "Documentation", isInternal: true, statusCode: 200, statusText: "OK", timingMs: 51, health: "healthy" },
      { url: "https://stripe.com/pricing-old", originalHref: "/pricing-old", anchorText: "Old Pricing Plan", isInternal: true, statusCode: 301, statusText: "Moved Permanently", timingMs: 65, health: "redirect", redirectUrl: "https://stripe.com/pricing" },
      { url: "https://github.com/stripe", originalHref: "https://github.com/stripe", anchorText: "GitHub Repositories", isInternal: false, statusCode: 200, statusText: "OK", timingMs: 88, health: "healthy" },
      { url: "https://twitter.com/stripe", originalHref: "https://twitter.com/stripe", anchorText: "Twitter / X Feed", isInternal: false, statusCode: 302, statusText: "Found", timingMs: 76, health: "redirect", redirectUrl: "https://x.com/stripe" },
      { url: "https://stripe.com/global", originalHref: "/global", anchorText: "Global Infrastructure", isInternal: true, statusCode: 200, statusText: "OK", timingMs: 44, health: "healthy" },
    ],
  },
  "https://github.com": {
    summary: {
      totalChecked: 85,
      healthyCount: 81,
      redirectCount: 3,
      brokenCount: 1,
      timeoutCount: 0,
      linkHealthScore: 95,
      internalCount: 68,
      externalCount: 17,
    },
    items: [
      { url: "https://github.com/features", originalHref: "/features", anchorText: "Features", isInternal: true, statusCode: 200, statusText: "OK", timingMs: 48, health: "healthy" },
      { url: "https://github.com/pricing", originalHref: "/pricing", anchorText: "Pricing", isInternal: true, statusCode: 200, statusText: "OK", timingMs: 52, health: "healthy" },
      { url: "https://github.com/enterprise", originalHref: "/enterprise", anchorText: "Enterprise", isInternal: true, statusCode: 200, statusText: "OK", timingMs: 58, health: "healthy" },
      { url: "https://github.com/old-blog-archive", originalHref: "/old-blog-archive", anchorText: "Legacy 2012 Blog", isInternal: true, statusCode: 404, statusText: "Not Found", timingMs: 72, health: "broken" },
      { url: "https://github.com/readme", originalHref: "/readme", anchorText: "The ReadME Project", isInternal: true, statusCode: 200, statusText: "OK", timingMs: 61, health: "healthy" },
    ],
  },
};

export default function BrokenLinksClient() {
  const { tier, triggerUpgradeModal } = usePlan();
  const [url, setUrl] = useState("https://stripe.com");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<CrawlReport | null>(DEMO_PRESETS["https://stripe.com"]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "broken" | "redirect" | "healthy">("all");

  const presets = [
    { label: "Stripe", url: "https://stripe.com" },
    { label: "GitHub", url: "https://github.com" },
  ];

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
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to crawl website links.");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = (report?.items || []).filter((item) => {
    if (filter === "all") return true;
    return item.health === filter;
  });

  const total = report?.summary.totalChecked || 1;
  const healthyPct = Math.round(((report?.summary.healthyCount || 0) / total) * 100);
  const redirectPct = Math.round(((report?.summary.redirectCount || 0) / total) * 100);
  const brokenPct = Math.max(0, 100 - healthyPct - redirectPct);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold mb-3">
          <Link2 className="w-3.5 h-3.5 text-purple-600" />
          High-Speed Hyperlink &amp; 404 Crawler Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
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
            className="flex-1 px-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white shadow-2xs font-mono"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
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
          
          {/* Main Hero Summary Card: Health Radial Gauge + Proportional Stacked Chart */}
          <div className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-2xl shadow-sm">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-6 border-b border-slate-100">
              
              {/* Radial Gauge */}
              <div className="flex items-center gap-6">
                <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke={report.summary.linkHealthScore >= 90 ? "#10b981" : report.summary.linkHealthScore >= 70 ? "#f59e0b" : "#ef4444"}
                      strokeWidth="10"
                      strokeDasharray={2 * Math.PI * 50}
                      strokeDashoffset={2 * Math.PI * 50 * (1 - report.summary.linkHealthScore / 100)}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-slate-900 tracking-tight">
                      {report.summary.linkHealthScore}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      / 100
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>Hyperlink Health Index</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {report.summary.brokenCount === 0
                      ? "Zero Broken Links Detected"
                      : `${report.summary.brokenCount} Dead Links Require Attention`}
                  </h2>
                  <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                    Audited {report.summary.totalChecked} hyperlinks ({report.summary.internalCount} internal, {report.summary.externalCount} external outbound).
                  </p>
                </div>
              </div>

              {/* Action Link */}
              <Link
                href={`/analyze?url=${encodeURIComponent(url)}&tab=deadlinks`}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-colors"
              >
                <span>Open in 14-Engine Auditor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Visual Link Status Proportional Bar Chart */}
            <div className="pt-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Link Response Distribution Ratio</span>
                <span className="text-slate-400 font-mono text-[11px]">{report.summary.totalChecked} Total Audited</span>
              </div>

              {/* Stacked Proportional Bar */}
              <div className="h-4 rounded-full overflow-hidden flex bg-slate-100 border border-slate-200/80 p-0.5">
                <div
                  style={{ width: `${healthyPct}%` }}
                  className="bg-emerald-500 h-full rounded-l-full transition-all duration-700"
                  title={`${healthyPct}% Healthy`}
                />
                <div
                  style={{ width: `${redirectPct}%` }}
                  className="bg-amber-400 h-full transition-all duration-700"
                  title={`${redirectPct}% Redirects`}
                />
                <div
                  style={{ width: `${brokenPct}%` }}
                  className="bg-rose-500 h-full rounded-r-full transition-all duration-700"
                  title={`${brokenPct}% Broken`}
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

          {/* Table Header & Interactive Filter Tabs */}
          <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mr-1">
                  <Filter className="w-3.5 h-3.5" /> Filter by Health:
                </span>
                <div className="flex gap-1.5 text-xs">
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

              <div className="text-xs font-mono text-slate-500">
                Showing {filteredItems.length} of {report.items.length} items
              </div>
            </div>

            {/* Link List */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Anchor Text</th>
                    <th className="py-3 px-3">Target Destination URL</th>
                    <th className="py-3 px-3 text-right">Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
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
                      <td className="py-3 px-3 font-semibold text-slate-800 max-w-[200px] truncate">
                        {item.anchorText || <span className="text-slate-400 italic">[Empty Anchor]</span>}
                      </td>
                      <td className="py-3 px-3 text-slate-600 max-w-sm truncate">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 hover:underline flex items-center gap-1 font-mono text-[11px]"
                        >
                          <span className="truncate">{item.url}</span>
                          <ArrowUpRight className="w-3 h-3 shrink-0 opacity-60" />
                        </a>
                        {item.redirectUrl && (
                          <div className="text-[11px] text-amber-700 mt-0.5 flex items-center gap-1">
                            <span>↳ 301 Target:</span>
                            <span className="font-mono text-slate-700">{item.redirectUrl}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-500 whitespace-nowrap font-bold">
                        {item.timingMs}ms
                      </td>
                    </tr>
                  ))}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-slate-400">
                        No links matching the selected filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Autopilot Banner */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white rounded-2xl border border-purple-900/60 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3 h-3" />
                Automated 404 Sentinel
              </div>
              <h3 className="text-lg font-bold">Never Let a Dead Link Break Your SEO or Ad Traffic</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                Connect your domains to SeoSeite Autopilot. Our background cron worker continuously scans your site and alerts you before Google Search Console penalizes your index.
              </p>
            </div>
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold whitespace-nowrap transition-all shadow-md shrink-0"
            >
              Start Automated Monitoring
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
