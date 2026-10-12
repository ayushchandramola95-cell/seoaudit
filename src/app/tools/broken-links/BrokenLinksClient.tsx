"use client";

import { useState } from "react";
import Link from "next/link";
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
  Download
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

export default function BrokenLinksClient() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<CrawlReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "broken" | "redirect" | "healthy">("all");

  const presets = [
    { label: "Stripe", url: "https://stripe.com" },
    { label: "GitHub", url: "https://github.com" },
    { label: "Vercel", url: "https://vercel.com" },
  ];

  const handleScan = async (targetToScan = url) => {
    if (!targetToScan) return;
    setLoading(true);
    setError(null);
    setReport(null);

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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
          <Link2 className="w-3.5 h-3.5 text-blue-600" />
          Free Technical SEO Tool
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Free Broken Link &amp; 404 Checker
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Crawl your website in seconds to locate dead internal links, broken 404 destinations, and redirect chains before they hurt your search rankings.
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
            className="flex-1 px-4 py-3 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Crawling...
              </>
            ) : (
              "Check 404 Links"
            )}
          </button>
        </form>

        {/* Demo Presets */}
        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-500">
          <span>Try quick demo:</span>
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setUrl(p.url);
                handleScan(p.url);
              }}
              className="text-blue-600 hover:underline font-medium cursor-pointer"
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
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flat-card p-4 bg-white border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">Health Score</div>
              <div className="text-2xl font-black text-slate-900">{report.summary.linkHealthScore}/100</div>
              <div className="text-[11px] text-slate-400 mt-1">{report.summary.totalChecked} links audited</div>
            </div>

            <div className="flat-card p-4 bg-emerald-50/60 border border-emerald-200">
              <div className="text-xs text-emerald-700 mb-1">Healthy (200 OK)</div>
              <div className="text-2xl font-black text-emerald-800">{report.summary.healthyCount}</div>
              <div className="text-[11px] text-emerald-600 mt-1">Passing responses</div>
            </div>

            <div className="flat-card p-4 bg-red-50/60 border border-red-200">
              <div className="text-xs text-red-700 mb-1">Broken (404/Error)</div>
              <div className="text-2xl font-black text-red-800">{report.summary.brokenCount}</div>
              <div className="text-[11px] text-red-600 mt-1">Needs immediate fix</div>
            </div>

            <div className="flat-card p-4 bg-amber-50/60 border border-amber-200">
              <div className="text-xs text-amber-700 mb-1">Redirects (3xx)</div>
              <div className="text-2xl font-black text-amber-800">{report.summary.redirectCount}</div>
              <div className="text-[11px] text-amber-600 mt-1">301 / 302 hops</div>
            </div>
          </div>

          {/* Table Header & Filters */}
          <div className="flat-card p-5 bg-white border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Filter Status:</span>
                <div className="flex gap-1 text-xs">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      filter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    All ({report.items.length})
                  </button>
                  <button
                    onClick={() => setFilter("broken")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      filter === "broken" ? "bg-red-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Broken ({report.summary.brokenCount})
                  </button>
                  <button
                    onClick={() => setFilter("redirect")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      filter === "redirect" ? "bg-amber-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Redirects ({report.summary.redirectCount})
                  </button>
                  <button
                    onClick={() => setFilter("healthy")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                      filter === "healthy" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Healthy ({report.summary.healthyCount})
                  </button>
                </div>
              </div>

              <Link
                href={`/analyze?url=${encodeURIComponent(url)}`}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Run Full 14-Engine SEO Audit <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Link List */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Anchor Text</th>
                    <th className="py-2.5 px-3">Target URL</th>
                    <th className="py-2.5 px-3 text-right">Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                            item.health === "healthy"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : item.health === "broken"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {item.statusCode || "ERR"} {item.statusText}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800 max-w-[180px] truncate">
                        {item.anchorText || <span className="text-slate-400 italic">[Empty Anchor]</span>}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 max-w-sm truncate">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <span className="truncate">{item.url}</span>
                          <ArrowUpRight className="w-3 h-3 shrink-0 opacity-60" />
                        </a>
                        {item.redirectUrl && (
                          <div className="text-[11px] text-amber-700 mt-0.5">
                            ↳ Redirects to: <span className="font-mono">{item.redirectUrl}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-500 whitespace-nowrap">
                        {item.timingMs}ms
                      </td>
                    </tr>
                  ))}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400">
                        No links matching filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pro Upgrade Callout */}
          <div className="flat-card p-6 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-xs font-semibold mb-1">
                <Sparkles className="w-3 h-3" />
                SeoSeite Pro Tier
              </div>
              <h3 className="text-base font-bold">Need to audit an entire multi-page domain?</h3>
              <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
                The free checker audits up to 25 links per URL. Upgrade to <strong>Pro Analyst</strong> to crawl 500+ pages with recursive redirect trees and scheduled alert monitoring.
              </p>
            </div>
            <Link
              href="/pricing"
              className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold whitespace-nowrap transition-colors"
            >
              View Pro Plans
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
