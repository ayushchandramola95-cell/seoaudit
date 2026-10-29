"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useProject } from "@/context/ProjectContext";
import {
  Repeat,
  Search,
  Globe,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  Lock,
  Unlock,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Server,
  Zap,
} from "lucide-react";
import { RedirectHop } from "@/app/api/tools/redirect-tracer/route";

interface RedirectApiResponse {
  success: boolean;
  initialUrl: string;
  finalUrl: string;
  totalHops: number;
  totalLatencyMs: number;
  loopDetected: boolean;
  isSslSafe: boolean;
  hops: RedirectHop[];
}

const PRESET_DOMAINS = [
  { url: "http://stripe.com", label: "http://stripe.com (HTTP → HTTPS)" },
  { url: "http://linear.app", label: "http://linear.app (Apex → Secure)" },
  { url: "http://github.com", label: "http://github.com (HSTS Redirect)" },
  { url: "vercel.com", label: "vercel.com (Direct)" },
];

export default function RedirectTracerClient() {
  const { activeDomain } = useProject();
  const [urlInput, setUrlInput] = useState(activeDomain ? `https://${activeDomain}` : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RedirectApiResponse | null>(null);

  useEffect(() => {
    if (activeDomain && !urlInput) {
      setUrlInput(`https://${activeDomain}`);
    }
  }, [activeDomain, urlInput]);
  const [copiedChain, setCopiedChain] = useState(false);

  // STRICT REQUIREMENT: NO AUTO-FETCHING!
  // Presets ONLY populate the input box. User MUST explicitly click "Trace Redirects".
  const handleSelectPreset = (url: string) => {
    setUrlInput(url);
  };

  const handleTrace = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tools/redirect-tracer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to trace redirect hops.");
      }

      setResult(data);
    } catch (err: unknown) {
      setError((err as Error)?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const copyChainSummary = () => {
    if (!result) return;
    const text = `Redirect Chain Report for ${result.initialUrl}:
Total Hops: ${result.totalHops} | Cumulative Latency: ${result.totalLatencyMs}ms
Final URL: ${result.finalUrl}
Hops:
${result.hops.map(h => `${h.hopNumber}. [${h.statusCode} ${h.statusText}] ${h.url} (${h.responseTimeMs}ms)${h.locationHeader ? ` -> ${h.locationHeader}` : ""}`).join("\n")}
Generated via SeoSeite HTTP Redirect Tracer`;
    navigator.clipboard.writeText(text);
    setCopiedChain(true);
    setTimeout(() => setCopiedChain(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28">
      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-amber-600 transition-colors">Tools</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">HTTP Redirect Chain Tracer</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-slate-950 text-white pt-12 pb-16 relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-radial-gradient from-amber-900/20 via-transparent to-transparent opacity-60 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-xs">
              <Repeat className="w-3.5 h-3.5 text-amber-400" />
              HTTP Status Chain Inspector
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              SSL Downgrade Guard
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              Hop Latency Benchmarking
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
            HTTP Redirect &amp; Status Code Chain Tracer
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed mb-8">
            Inspect intermediate 301 Permanent and 302 Temporary redirect hops, measure network latency at each jump, 
            detect redirect loops, and preserve SEO link equity across URL migrations.
          </p>

          {/* Form */}
          <form onSubmit={handleTrace} className="max-w-3xl">
            <div className="bg-slate-900/90 p-2 sm:p-2.5 rounded-2xl border border-slate-800 shadow-2xl flex flex-col sm:flex-row gap-2 backdrop-blur-md">
              <div className="relative flex-1 flex items-center">
                <Globe className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Enter URL to trace (e.g. http://stripe.com or https://linear.app)"
                  className="w-full bg-slate-950/80 text-white placeholder-slate-500 text-sm rounded-xl pl-11 pr-4 py-3 border border-slate-700/80 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-mono transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !urlInput.trim()}
                className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-amber-600/30 active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Tracing Hops...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Trace Redirects</span>
                  </>
                )}
              </button>
            </div>

            {/* Presets - STRICTLY populate only, user must click button to audit */}
            <div className="flex flex-wrap items-center gap-2 mt-3.5 text-xs text-slate-400">
              <span className="text-slate-400 font-medium">Quick presets (fills input, click Trace to run):</span>
              {PRESET_DOMAINS.map((p) => (
                <button
                  key={p.url}
                  type="button"
                  onClick={() => handleSelectPreset(p.url)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                    urlInput === p.url
                      ? "bg-amber-600/30 text-amber-300 border-amber-500/50 shadow-inner"
                      : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700"
                  }`}
                >
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </form>

          {error && (
            <div className="mt-6 max-w-3xl p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-200">Trace Request Failed</p>
                <p className="mt-0.5 text-xs text-rose-300/90">{error}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {!result && !loading && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm text-center">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-100 shadow-sm">
              <Repeat className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">
              Ready to Trace HTTP Redirect Chains &amp; Status Codes
            </h3>
            <p className="text-sm text-slate-600 max-w-xl mx-auto mb-8">
              Enter any URL above or choose a preset, then click <strong>&quot;Trace Redirects&quot;</strong>. 
              Data is never fetched automatically.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-1">
                  <Repeat className="w-4 h-4 text-amber-600" />
                  301 vs 302 Link Equity
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Confirms permanent 301 status to ensure 100% of PageRank link juice transfers to target destinations.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-1">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Hop Latency Accumulation
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Each redirect hop adds 50-200ms latency. Detect multi-hop chains that degrade Core Web Vitals and TTFB.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  SSL Protocol Integrity
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Ensures redirects do not downgrade from HTTPS to HTTP or expose sensitive query tokens.
                </p>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Initial URL:</span>
                  <span className="font-mono text-xs font-bold text-slate-900 truncate max-w-md">{result.initialUrl}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Final Target:</span>
                  <span className="font-mono text-xs font-bold text-emerald-700 truncate max-w-md">{result.finalUrl}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={copyChainSummary}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {copiedChain ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedChain ? "Copied" : "Copy Chain"}</span>
                </button>
              </div>
            </div>

            {/* Top 4 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <span>Total Hops</span>
                  <Repeat className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-3xl font-black text-slate-900">
                  {result.totalHops} {result.totalHops === 1 ? "Hop" : "Hops"}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {result.totalHops <= 2 ? "Optimal hop count (≤ 2)" : "Excessive hops (> 2)"}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <span>Final Status Code</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-black text-emerald-700">
                  {result.hops[result.hops.length - 1]?.statusCode} OK
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Final destination response status
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <span>Cumulative Latency</span>
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-3xl font-black text-blue-700">
                  {result.totalLatencyMs} ms
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Total network roundtrip duration
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <span>SSL Protocol Safety</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-black ${result.isSslSafe ? "text-emerald-600" : "text-rose-600"}`}>
                    {result.isSslSafe ? "Secure" : "Downgrade Risk"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {result.isSslSafe ? "All hops preserve HTTPS encryption" : "Insecure HTTP hop detected"}
                </p>
              </div>
            </div>

            {/* Step-by-Step Hop Pipeline */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8">
              <div className="mb-6">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-600" />
                  <span>Sequential Hop Chain Pipeline</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Trace of each HTTP request, intermediate status response, and redirect target.
                </p>
              </div>

              <div className="space-y-4 relative">
                {result.hops.map((hop, idx) => {
                  const isFinal = idx === result.hops.length - 1;
                  let badgeBg = "bg-amber-100 text-amber-800 border-amber-200";
                  if (hop.statusCode === 200) badgeBg = "bg-emerald-100 text-emerald-800 border-emerald-200";
                  if (hop.statusCode >= 400) badgeBg = "bg-rose-100 text-rose-800 border-rose-200";

                  return (
                    <div key={idx} className="relative flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-200 transition-colors">
                      {/* Step Number Circle */}
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                        {hop.hopNumber}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${badgeBg}`}>
                              HTTP {hop.statusCode} {hop.statusText}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              {hop.responseTimeMs} ms
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs">
                            {hop.isHttps ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                                <Lock className="w-3 h-3" /> HTTPS
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                                <Unlock className="w-3 h-3" /> Plain HTTP
                              </span>
                            )}
                            {hop.serverHeader && (
                              <span className="text-slate-400 font-mono text-[11px]">
                                Server: {hop.serverHeader}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="font-mono text-xs font-bold text-slate-900 break-all">
                          {hop.url}
                        </div>

                        {hop.locationHeader && !isFinal && (
                          <div className="mt-2 pt-2 border-t border-slate-200/60 text-xs text-slate-500 flex items-center gap-2">
                            <ArrowRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span className="text-slate-400">Redirects to:</span>
                            <span className="font-mono text-slate-700 truncate">{hop.locationHeader}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cross-Tool Actions Footer */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div>
                <h4 className="text-lg font-bold">Crawl Complete Domain for 404s &amp; Broken Links</h4>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  Deeply scan all internal anchor tags to detect broken redirect loops, dead links, and missing assets.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <Link
                  href={`/tools/broken-links?url=${encodeURIComponent(result.finalUrl)}`}
                  className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  <span>Broken Links Crawler</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={`/tools/security-headers?url=${encodeURIComponent(result.finalUrl)}`}
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors border border-slate-700 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Audit Security Headers</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

