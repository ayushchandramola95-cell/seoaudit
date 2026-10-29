"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Image as ImageIcon,
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
  Layers,
  FileImage,
  Zap,
} from "lucide-react";
import { useProject } from "@/context/ProjectContext";

interface ImageResponse {
  success: boolean;
  requestedUrl: string;
  domain: string;
  latencyMs: number;
  status: number;
  score: number;
  summary: {
    totalImages: number;
    missingAltCount: number;
    legacyFormatCount: number;
    nextGenCount: number;
    nextGenAdoptionRate: string;
    altCoverageRate: string;
    clsProtectedRate: string;
    estimatedByteSavings: string;
  };
  items: Array<{
    src: string;
    alt: string;
    format: string;
    hasAlt: boolean;
    isDescriptiveAlt: boolean;
    hasDimensions: boolean;
    width?: string;
    height?: string;
    isLazy: boolean;
    hasSrcset: boolean;
    issues: string[];
  }>;
  recommendedPictureSnippet: string;
}

const PRESET_URLS = [
  { url: "https://stripe.com", label: "Stripe", tag: "Fintech SaaS" },
  { url: "https://linear.app", label: "Linear", tag: "Productivity" },
  { url: "https://vercel.com", label: "Vercel", tag: "Cloud Frontend" },
  { url: "https://github.com", label: "GitHub", tag: "Dev Platform" },
];

export default function ImageOptimizerClient() {
  const { activeDomain } = useProject();
  const [urlInput, setUrlInput] = useState(activeDomain ? `https://${activeDomain}` : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImageResponse | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [formatFilter, setFormatFilter] = useState<string>("all");

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
      const res = await fetch("/api/tools/image-optimizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to audit website images.");
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

  const filteredItems = result?.items.filter((item) => {
    if (formatFilter === "all") return true;
    if (formatFilter === "missing-alt") return !item.hasAlt;
    if (formatFilter === "legacy") return item.format === "png" || item.format === "jpeg" || item.format === "gif";
    if (formatFilter === "next-gen") return item.format === "avif" || item.format === "webp" || item.format === "svg";
    return true;
  }) || [];

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
            <span className="text-slate-900 font-semibold">Image SEO &amp; Next-Gen Format Scanner</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-slate-950 text-white pt-12 pb-16 relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-radial-gradient from-amber-900/25 via-transparent to-transparent opacity-60 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
              AVIF &amp; WebP Next-Gen Analyzer
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Alt Text Coverage &amp; CLS Guard
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
            Image SEO &amp; Next-Gen Format Scanner
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed mb-8">
            Audit image alt text coverage for Google Image Search, identify uncompressed PNGs and JPEGs, detect missing width/height attributes causing layout shifts, and calculate WebP/AVIF byte savings.
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
                  placeholder="Enter URL to audit images (e.g. https://stripe.com)"
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
                    <span>Scanning Images...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Scan Page Images</span>
                  </>
                )}
              </button>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2 mt-3.5 text-xs text-slate-400">
              <span className="text-slate-400 font-medium">Quick presets (fills input, click button to scan):</span>
              {PRESET_URLS.map((p) => (
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
                <p className="font-semibold text-rose-200">Image Scan Failed</p>
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
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-100 shadow-sm">
                <ImageIcon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3">
                Image SEO &amp; Media Payload Performance Lab
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-8">
                Unoptimized images are the #1 cause of slow Core Web Vitals (LCP) and missed Google Image Search clicks. Enter any URL above and click <strong>&quot;Scan Page Images&quot;</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Alt Accessibility</span>
                  <p className="font-bold text-slate-900 text-sm">Alt Text Guard</p>
                  <p className="text-xs text-slate-500 mt-1">Detects missing or filename-based alt text that hurts image indexing.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Modern Compression</span>
                  <p className="font-bold text-slate-900 text-sm">AVIF &amp; WebP</p>
                  <p className="text-xs text-slate-500 mt-1">Identifies legacy PNG/JPEGs and calculates potential bandwidth savings.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">CLS Protection</span>
                  <p className="font-bold text-slate-900 text-sm">Explicit Dimensions</p>
                  <p className="text-xs text-slate-500 mt-1">Verifies width and height attributes to eliminate layout jump penalties.</p>
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
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-black">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 font-mono truncate max-w-md sm:max-w-xl">
                    {result.requestedUrl}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {result.summary.totalImages} Images Audited • Latency: {result.latencyMs}ms
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                Est. Savings: {result.summary.estimatedByteSavings}
              </span>
            </div>

            {/* Scorecard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Image SEO Score</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-amber-600">{result.score}</span>
                  <span className="text-xs font-bold text-slate-400">/ 100</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Combined alt coverage and format efficiency</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Alt Text Coverage</div>
                <div className="text-3xl font-black text-emerald-600">
                  {result.summary.altCoverageRate}
                </div>
                <p className="text-xs text-slate-500 mt-2">{result.summary.missingAltCount} images missing alt text</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Next-Gen Adoption</div>
                <div className="text-3xl font-black text-blue-600">
                  {result.summary.nextGenAdoptionRate}
                </div>
                <p className="text-xs text-slate-500 mt-2">{result.summary.nextGenCount} WebP, AVIF, or SVG</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">CLS Layout Protection</div>
                <div className="text-3xl font-black text-purple-600">
                  {result.summary.clsProtectedRate}
                </div>
                <p className="text-xs text-slate-500 mt-2">Images with explicit width &amp; height</p>
              </div>
            </div>

            {/* Images Table & Filter */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-base font-black text-slate-900 mb-1">
                    Audited Page Images ({filteredItems.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Inspecting alt tags, modern formats, dimensions, and lazy loading attributes.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setFormatFilter("all")}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      formatFilter === "all" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    All ({result.items.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormatFilter("missing-alt")}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      formatFilter === "missing-alt" ? "bg-white text-rose-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Missing Alt ({result.summary.missingAltCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormatFilter("legacy")}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      formatFilter === "legacy" ? "bg-white text-amber-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Legacy Formats ({result.summary.legacyFormatCount})
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Image Source</th>
                      <th className="py-3 px-4">Format</th>
                      <th className="py-3 px-4">Alt Attribute</th>
                      <th className="py-3 px-4">Dimensions</th>
                      <th className="py-3 px-4">Lazy Loading</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {filteredItems.map((img, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 font-mono text-xs text-slate-600 truncate max-w-xs" title={img.src}>
                          {img.src}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                            img.format === "avif" || img.format === "webp"
                              ? "bg-emerald-100 text-emerald-800"
                              : img.format === "svg"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {img.format}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {img.hasAlt ? (
                            <span className="text-xs text-slate-800 font-medium">
                              &quot;{img.alt}&quot;
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                              <XCircle className="w-3 h-3" /> Missing Alt
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {img.hasDimensions ? (
                            <span className="font-mono text-xs text-slate-700">
                              {img.width} × {img.height}
                            </span>
                          ) : (
                            <span className="text-xs text-amber-600 font-semibold">Missing (CLS)</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {img.isLazy ? (
                            <span className="text-xs text-emerald-600 font-bold">loading=&quot;lazy&quot;</span>
                          ) : (
                            <span className="text-xs text-slate-400">Eager</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Code Generator */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-amber-400" />
                  <h4 className="font-bold text-sm">Recommended High-Performance &lt;picture&gt; Implementation</h4>
                </div>
                <button
                  type="button"
                  onClick={() => copyCode(result.recommendedPictureSnippet)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copiedSnippet ? "Copied" : "Copy Picture Tag"}</span>
                </button>
              </div>
              <pre className="p-3.5 bg-slate-950 rounded-xl text-xs font-mono text-amber-300 overflow-x-auto border border-slate-800">
                {result.recommendedPictureSnippet}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
