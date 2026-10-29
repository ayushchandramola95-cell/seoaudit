"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  Search,
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
  Languages,
} from "lucide-react";
import { useProject } from "@/context/ProjectContext";

interface HreflangResponse {
  success: boolean;
  requestedUrl: string;
  domain: string;
  latencyMs: number;
  status: number;
  score: number;
  totalTagsFound: number;
  hasXDefault: boolean;
  hasSelfReferencing: boolean;
  isMonolingual: boolean;
  tags: Array<{
    hreflang: string;
    href: string;
    language: string;
    country?: string;
    isValidLanguage: boolean;
    isValidCountry: boolean;
    isSelfReferencing: boolean;
    isXDefault: boolean;
    status: "Valid" | "Warning" | "Error";
    errorNotes?: string;
  }>;
  checklist: Array<{
    title: string;
    status: string;
    value: string;
    description: string;
  }>;
  sampleGenerator: string;
}

const PRESET_URLS = [
  { url: "https://stripe.com", label: "Stripe", tag: "Global SaaS" },
  { url: "https://linear.app", label: "Linear", tag: "Productivity" },
  { url: "https://vercel.com", label: "Vercel", tag: "Cloud Frontend" },
  { url: "https://github.com", label: "GitHub", tag: "Dev Platform" },
];

export default function HreflangAuditorClient() {
  const { activeDomain } = useProject();
  const [urlInput, setUrlInput] = useState(activeDomain ? `https://${activeDomain}` : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HreflangResponse | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  useEffect(() => {
    if (activeDomain && !urlInput) {
      setUrlInput(`https://${activeDomain}`);
    }
  }, [activeDomain, urlInput]);

  const handleSelectPreset = (url: string) => {
    setUrlInput(url);
  };

  const handleAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tools/hreflang-auditor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to audit international hreflang tags.");
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
            <span className="text-slate-900 font-semibold">Hreflang &amp; International SEO Auditor</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-slate-950 text-white pt-12 pb-16 relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-radial-gradient from-teal-900/25 via-transparent to-transparent opacity-60 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Languages className="w-3.5 h-3.5 text-teal-400" />
              Multilingual SEO &amp; Geo-Targeting
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              ISO 639-1 &amp; ISO 3166-1 Verification
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
            Hreflang &amp; International SEO Auditor
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed mb-8">
            Audit alternate language tags, verify return links and self-referencing hreflangs, validate ISO language and region codes, and ensure seamless global Google search targeting.
          </p>

          {/* Form */}
          <form onSubmit={handleAudit} className="max-w-3xl">
            <div className="bg-slate-900/90 p-2 sm:p-2.5 rounded-2xl border border-slate-800 shadow-2xl flex flex-col sm:flex-row gap-2 backdrop-blur-md">
              <div className="relative flex-1 flex items-center">
                <Globe className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Enter URL to audit (e.g. https://stripe.com)"
                  className="w-full bg-slate-950/80 text-white placeholder-slate-500 text-sm rounded-xl pl-11 pr-4 py-3 border border-slate-700/80 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 font-mono transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !urlInput.trim()}
                className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-teal-600/30 active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Auditing Hreflangs...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Audit Hreflang Tags</span>
                  </>
                )}
              </button>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2 mt-3.5 text-xs text-slate-400">
              <span className="text-slate-400 font-medium">Quick presets (fills input, click button to audit):</span>
              {PRESET_URLS.map((p) => (
                <button
                  key={p.url}
                  type="button"
                  onClick={() => handleSelectPreset(p.url)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                    urlInput === p.url
                      ? "bg-teal-600/30 text-teal-300 border-teal-500/50 shadow-inner"
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
                <p className="font-semibold text-rose-200">Audit Failed</p>
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
              <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-teal-100 shadow-sm">
                <Languages className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3">
                Global Geo-Targeting &amp; International SEO Verification
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-8">
                Correct hreflang configuration ensures that searchers in different countries receive the appropriate language and regional version of your pages. Enter a URL above and click <strong>&quot;Audit Hreflang Tags&quot;</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Fallback Route</span>
                  <p className="font-bold text-slate-900 text-sm">x-default Standard</p>
                  <p className="text-xs text-slate-500 mt-1">Directs international users to the primary global English fallback page.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Return Tag Linkage</span>
                  <p className="font-bold text-slate-900 text-sm">Bidirectional Links</p>
                  <p className="text-xs text-slate-500 mt-1">Verifies that localized variants point back to the original source URL.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">ISO Syntax</span>
                  <p className="font-bold text-slate-900 text-sm">Language &amp; Region</p>
                  <p className="text-xs text-slate-500 mt-1">Flags common syntax bugs like underscores (en_US) instead of hyphens (en-US).</p>
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
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 font-black">
                  <Languages className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 font-mono truncate max-w-md sm:max-w-xl">
                    {result.requestedUrl}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {result.totalTagsFound} Alternate Languages Detected • Latency: {result.latencyMs}ms
                  </p>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                result.score >= 90
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : result.score >= 60
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : "bg-slate-100 text-slate-800 border-slate-200"
              }`}>
                {result.isMonolingual ? "Monolingual Site" : `International Score: ${result.score}/100`}
              </span>
            </div>

            {/* Scorecard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Hreflang Tags</div>
                <div className="text-3xl font-black text-teal-700">
                  {result.totalTagsFound}
                </div>
                <p className="text-xs text-slate-500 mt-2">Alternate language variants declared</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">x-default Fallback</div>
                <div className="flex items-center gap-2 mt-1">
                  {result.hasXDefault ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Present
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                      <AlertTriangle className="w-3.5 h-3.5" /> Missing
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2">Required for unmatched locales</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Self-Referencing</div>
                <div className="flex items-center gap-2 mt-1">
                  {result.hasSelfReferencing ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                      <AlertTriangle className="w-3.5 h-3.5" /> Not Self-Ref
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2">Points back to current URL</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Compliance Score</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">{result.score}</span>
                  <span className="text-xs font-bold text-slate-400">/ 100</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">ISO language format validation</p>
              </div>
            </div>

            {/* Tags Table */}
            {result.tags.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
                <h3 className="text-base font-black text-slate-900 mb-1">
                  Declared Hreflang Alternate Clusters
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  List of all multilingual variants and localized target destinations extracted from page markup.
                </p>

                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Hreflang Attribute</th>
                        <th className="py-3 px-4">Target Language / Locale</th>
                        <th className="py-3 px-4">Target Destination URL</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {result.tags.map((t, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-teal-700">
                            {t.hreflang}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-800">
                            {t.language} {t.country ? `(${t.country})` : ""}
                          </td>
                          <td className="py-3 px-4 font-mono text-xs text-slate-600 truncate max-w-xs">
                            {t.href}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                              t.status === "Valid" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                            }`}>
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Checklist */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
              <h3 className="text-base font-black text-slate-900 mb-1">
                International SEO Validation Checklist
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Verification against official Google Search Central multilingual documentation.
              </p>

              <div className="space-y-3">
                {result.checklist.map((item, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {item.status === "Pass" ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : item.status === "Fail" ? (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                          <span className="text-xs font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {item.value}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 self-start sm:self-auto ${
                      item.status === "Pass" ? "bg-emerald-100 text-emerald-800" : item.status === "Fail" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Generator */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-teal-400" />
                  <h4 className="font-bold text-sm">Recommended Global Hreflang Cluster Code</h4>
                </div>
                <button
                  type="button"
                  onClick={() => copyCode(result.sampleGenerator)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copiedSnippet ? "Copied" : "Copy Cluster"}</span>
                </button>
              </div>
              <pre className="p-3.5 bg-slate-950 rounded-xl text-xs font-mono text-teal-300 overflow-x-auto border border-slate-800">
                {result.sampleGenerator}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
