"use client";

import { useState } from "react";
import {
  Link2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ArrowRight,
  ShieldAlert,
  Clock,
  Filter,
} from "lucide-react";
import { LinkCrawlerReport } from "@/lib/modules/crawler/linkCrawler";

interface LinkCrawlerMatrixProps {
  targetUrl: string;
  initialLinks?: Array<{ href: string; text: string; isInternal: boolean }>;
}

export default function LinkCrawlerMatrix({ targetUrl, initialLinks = [] }: LinkCrawlerMatrixProps) {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<LinkCrawlerReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "broken" | "redirect" | "healthy">("all");

  async function handleScanLinks() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/crawler/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUrl,
          links: initialLinks.slice(0, 30),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setReport(json.data);
      } else {
        setError(json.error || "Failed to scan link health.");
      }
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to reach link crawler service.");
    } finally {
      setLoading(false);
    }
  }

  const items = report?.items || [];
  const filteredItems = items.filter((item) => {
    if (filter === "broken") return item.health === "broken" || item.health === "timeout";
    if (filter === "redirect") return item.health === "redirect";
    if (filter === "healthy") return item.health === "healthy";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Control Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Link2 className="w-5 h-5 text-indigo-600" />
              Internal Link Health & Dead Link (404) Crawler
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Concurrently audits internal hyperlinks on this page for broken 404s, redirect hops, anchor text quality, and response latency.
            </p>
          </div>

          <button
            onClick={handleScanLinks}
            disabled={loading}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg shadow-sm transition-colors cursor-pointer shrink-0"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Crawling Links...
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                {report ? "Re-Crawl Link Health" : "Run Live Link Audit"}
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Aggregate Stats Cards */}
        {report && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">Link Health</span>
              <span className="text-xl font-extrabold text-slate-900 font-mono mt-0.5 block">
                {report.summary.linkHealthScore}%
              </span>
              <span className="text-[10px] text-slate-500">Based on status codes</span>
            </div>

            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg">
              <span className="text-[11px] font-semibold text-emerald-800 uppercase block">Healthy (200)</span>
              <span className="text-xl font-extrabold text-emerald-700 font-mono mt-0.5 block">
                {report.summary.healthyCount}
              </span>
              <span className="text-[10px] text-emerald-600">Active endpoints</span>
            </div>

            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg">
              <span className="text-[11px] font-semibold text-amber-800 uppercase block">Redirects (3xx)</span>
              <span className="text-xl font-extrabold text-amber-700 font-mono mt-0.5 block">
                {report.summary.redirectCount}
              </span>
              <span className="text-[10px] text-amber-600">301 / 302 hops</span>
            </div>

            <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-lg">
              <span className="text-[11px] font-semibold text-rose-800 uppercase block">Dead Links (404)</span>
              <span className="text-xl font-extrabold text-rose-700 font-mono mt-0.5 block">
                {report.summary.brokenCount}
              </span>
              <span className="text-[10px] text-rose-600">Broken or refused</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg col-span-2 sm:col-span-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">Checked URLs</span>
              <span className="text-xl font-extrabold text-slate-900 font-mono mt-0.5 block">
                {report.summary.totalChecked}
              </span>
              <span className="text-[10px] text-slate-500">
                {report.summary.internalCount} int / {report.summary.externalCount} ext
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Results Table & Filter */}
      {report && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {/* Filter Bar */}
          <div className="px-6 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Filter:</span>
              <div className="inline-flex rounded-md border border-slate-200 p-0.5 bg-white text-xs">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    filter === "all" ? "bg-slate-900 text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  All ({report.summary.totalChecked})
                </button>
                <button
                  onClick={() => setFilter("broken")}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    filter === "broken" ? "bg-rose-600 text-white" : "text-rose-700 hover:bg-rose-50"
                  }`}
                >
                  Dead ({report.summary.brokenCount})
                </button>
                <button
                  onClick={() => setFilter("redirect")}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    filter === "redirect" ? "bg-amber-600 text-white" : "text-amber-700 hover:bg-amber-50"
                  }`}
                >
                  Redirects ({report.summary.redirectCount})
                </button>
                <button
                  onClick={() => setFilter("healthy")}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    filter === "healthy" ? "bg-emerald-600 text-white" : "text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  Healthy ({report.summary.healthyCount})
                </button>
              </div>
            </div>

            <span className="text-xs text-slate-500 font-mono">
              Showing {filteredItems.length} of {report.summary.totalChecked} links
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-6">Hyperlink & Anchor Text</th>
                  <th className="py-3 px-6">Scope</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-6 max-w-md">
                      <div className="font-semibold text-slate-900 truncate flex items-center gap-1.5">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 truncate flex items-center gap-1"
                        >
                          <span className="truncate">{item.url}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                        </a>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 truncate flex items-center gap-1">
                        <span className="font-medium text-slate-600">Anchor:</span>
                        <span className="italic truncate">&quot;{item.anchorText}&quot;</span>
                      </div>
                      {item.redirectUrl && (
                        <div className="text-[11px] text-amber-700 mt-1 flex items-center gap-1 truncate font-mono">
                          <ArrowRight className="w-3 h-3 shrink-0" />
                          <span className="truncate">Redirects to: {item.redirectUrl}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-6">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          item.isInternal
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-slate-100 text-slate-700 border border-slate-200"
                        }`}
                      >
                        {item.isInternal ? "Internal" : "External"}
                      </span>
                    </td>

                    <td className="py-3 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold font-mono ${
                          item.health === "healthy"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : item.health === "redirect"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {item.health === "healthy" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        {item.statusCode > 0 ? `${item.statusCode} ${item.statusText}` : "Unreachable"}
                      </span>
                    </td>

                    <td className="py-3 px-6 text-right font-mono text-slate-500 text-[11px]">
                      {item.timingMs}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Explanation Banner */}
      {!report && !loading && (
        <div className="p-8 rounded-xl border border-dashed border-slate-300 text-center bg-slate-50/50 space-y-3">
          <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto text-indigo-600">
            <Link2 className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Run a Deep Link Verification Scan</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click the button above to dispatch parallel lightweight requests against the discovered hyperlinks on this page and detect dead links (404), redirect chains (301), and crawl response latencies.
          </p>
        </div>
      )}
    </div>
  );
}
