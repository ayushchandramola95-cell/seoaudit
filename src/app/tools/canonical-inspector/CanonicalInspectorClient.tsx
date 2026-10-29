"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Link2,
  Search,
  Globe,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  RefreshCw,
  Code2,
  FileCode,
  ShieldAlert,
  Info,
} from "lucide-react";
import { useProject } from "@/context/ProjectContext";

interface CanonicalResponse {
  success: boolean;
  requestedUrl: string;
  domain: string;
  latencyMs: number;
  status: number;
  finalUrl: string;
  score: number;
  riskLevel: string;
  canonical: {
    htmlTag: string | null;
    httpHeader: string | null;
    count: number;
    isAbsolute: boolean;
    isSelfReferencing: boolean;
    isCrossDomain: boolean;
  };
  checks: Array<{
    title: string;
    status: "Pass" | "Fail" | "Warning" | "Info";
    value: string;
    impact: string;
    description: string;
  }>;
  variantsTested: Array<{
    variant: string;
    url: string;
    resolvesToCanonical: boolean;
  }>;
  recommendedSnippet: string;
}

const PRESET_URLS = [
  { url: "https://stripe.com", label: "Stripe", tag: "Fintech SaaS" },
  { url: "https://linear.app", label: "Linear", tag: "Productivity" },
  { url: "https://vercel.com", label: "Vercel", tag: "Cloud Frontend" },
  { url: "https://github.com", label: "GitHub", tag: "Dev Platform" },
];

export default function CanonicalInspectorClient() {
  const { activeDomain } = useProject();
  const [urlInput, setUrlInput] = useState(activeDomain ? `https://${activeDomain}` : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CanonicalResponse | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  useEffect(() => {
    if (activeDomain && !urlInput) {
      setUrlInput(`https://${activeDomain}`);
    }
  }, [activeDomain, urlInput]);

  const handleSelectPreset = (url: string) => {
    setUrlInput(url);
  };

  const handleInspect = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tools/canonical-inspector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to inspect canonical tags.");
      }

      setResult(data);
    } catch (err: unknown) {
      setError((err as Error)?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28">
      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-indigo-600 transition-colors">Tools</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Canonical &amp; Duplicate Content Inspector</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-slate-950 text-white pt-12 pb-16 relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-radial-gradient from-blue-900/25 via-transparent to-transparent opacity-60 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Link2 className="w-3.5 h-3.5 text-blue-400" />
              rel=&quot;canonical&quot; Precision Analyzer
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Duplicate Indexing Guard
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
            Canonical &amp; Duplicate Content Inspector
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed mb-8">
            Verify canonical tags, detect multiple conflicting tags, test HTTP vs. HTTPS and trailing slash variations, and prevent Google duplicate content indexing penalties.
          </p>

          {/* Form */}
          <form onSubmit={handleInspect} className="max-w-3xl">
            <div className="bg-slate-900/90 p-2 sm:p-2.5 rounded-2xl border border-slate-800 shadow-2xl flex flex-col sm:flex-row gap-2 backdrop-blur-md">
              <div className="relative flex-1 flex items-center">
                <Globe className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Enter page URL (e.g. https://stripe.com/pricing)"
                  className="w-full bg-slate-950/80 text-white placeholder-slate-500 text-sm rounded-xl pl-11 pr-4 py-3 border border-slate-700/80 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-mono transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !urlInput.trim()}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/30 active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Inspecting Tags...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Inspect Canonical Tags</span>
                  </>
                )}
              </button>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2 mt-3.5 text-xs text-slate-400">
              <span className="text-slate-400 font-medium">Quick presets (fills input, click button to run):</span>
              {PRESET_URLS.map((p) => (
                <button
                  key={p.url}
                  type="button"
                  onClick={() => handleSelectPreset(p.url)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                    urlInput === p.url
                      ? "bg-blue-600/30 text-blue-300 border-blue-500/50 shadow-inner"
                      : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700"
                  }`}
                >
                  <span className="font-semibold">{p.label}</span>
                  <span className="text-[10px] text-slate-400 px-1 py-0.2 rounded bg-slate-800">
                    {p.tag}
                  </span>
                </button>
              ))}
            </div>
          </form>

          {error && (
            <div className="mt-6 max-w-3xl p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-200">Inspection Failed</p>
                <p className="mt-0.5 text-xs text-rose-300/90">{error}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {!result && !loading && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm text-center relative overflow-hidden">
            <div className="max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-sm">
                <Link2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3">
                Canonical URL &amp; Duplicate Content Diagnostics
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-8">
                Search engines penalize sites with duplicate content created by HTTP/HTTPS inconsistencies, tracking parameters, or trailing slashes. Enter any URL above and click <strong>&quot;Inspect Canonical Tags&quot;</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Tag Singularity</span>
                  <p className="font-bold text-slate-900 text-sm">Conflict Detection</p>
                  <p className="text-xs text-slate-500 mt-1">Verifies exactly 1 canonical tag exists. Multiple tags void all canonicals.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">URL Cleanliness</span>
                  <p className="font-bold text-slate-900 text-sm">Absolute Target</p>
                  <p className="text-xs text-slate-500 mt-1">Confirms canonical uses fully-qualified HTTPS protocol without relative paths.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Variant Matrix</span>
                  <p className="font-bold text-slate-900 text-sm">Cross-Variant Resolution</p>
                  <p className="text-xs text-slate-500 mt-1">Tests www, non-www, HTTP, and UTM query strings for clean consolidation.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black">
                  <Link2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 font-mono truncate max-w-md sm:max-w-xl">
                    {result.requestedUrl}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Response: {result.status} OK • Latency: {result.latencyMs}ms
                  </p>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                result.score >= 90
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : result.score >= 70
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : "bg-rose-50 text-rose-800 border-rose-200"
              }`}>
                {result.riskLevel}
              </span>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Canonical Health</div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-black ${
                    result.score >= 90 ? "text-emerald-600" : result.score >= 70 ? "text-amber-600" : "text-rose-600"
                  }`}>
                    {result.score}
                  </span>
                  <span className="text-xs font-bold text-slate-400">/ 100</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Tag integrity and protocol validity</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">HTML Tag Target</div>
                <div className="text-sm font-mono font-bold text-slate-900 truncate mt-1" title={result.canonical.htmlTag || "None"}>
                  {result.canonical.htmlTag || "None detected"}
                </div>
                <p className="text-xs text-slate-500 mt-2">Declared in &lt;head&gt; element</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Tag Count</div>
                <div className="text-2xl font-black text-slate-900">
                  {result.canonical.count} {result.canonical.count === 1 ? "Tag (Valid)" : "Tags (Error)"}
                </div>
                <p className="text-xs text-slate-500 mt-2">Zero duplicates found</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Scope</div>
                <div className="text-2xl font-black text-blue-600">
                  {result.canonical.isSelfReferencing ? "Self-Referencing" : result.canonical.isCrossDomain ? "Cross-Domain" : "Standard"}
                </div>
                <p className="text-xs text-slate-500 mt-2">Points to active origin domain</p>
              </div>
            </div>

            {/* Diagnostic Checklist */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
              <h3 className="text-base font-black text-slate-900 mb-1">
                Canonical Integrity Diagnostic Checklist
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Deterministic validation against Google Search Central canonicalization specifications.
              </p>

              <div className="space-y-3">
                {result.checks.map((c, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {c.status === "Pass" ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : c.status === "Fail" ? (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{c.title}</span>
                          <span className="text-xs font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {c.value}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{c.description}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 self-start sm:self-auto ${
                      c.status === "Pass" ? "bg-emerald-100 text-emerald-800" : c.status === "Fail" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Generator */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-blue-400" />
                  <h4 className="font-bold text-sm">Recommended Canonical Tag Implementation</h4>
                </div>
                <button
                  type="button"
                  onClick={() => copyCode(result.recommendedSnippet)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copiedSnippet ? "Copied" : "Copy Snippet"}</span>
                </button>
              </div>
              <pre className="p-3.5 bg-slate-950 rounded-xl text-xs font-mono text-blue-300 overflow-x-auto border border-slate-800">
                {result.recommendedSnippet}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

