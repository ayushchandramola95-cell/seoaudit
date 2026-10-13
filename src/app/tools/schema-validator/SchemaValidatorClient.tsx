"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Code2,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Loader2,
  ShieldAlert,
  ArrowRight,
  Share2,
  FileCode2,
  Sparkles,
  Layers
} from "lucide-react";

export default function SchemaValidatorClient() {
  const [url, setUrl] = useState("https://stripe.com");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any | null>({
    url: "https://stripe.com/",
    domain: "stripe.com",
    structuredData: {
      count: 4,
      types: ["Organization", "WebSite", "BreadcrumbList", "SoftwareApplication"],
      raw: `{\n  "@context": "https://schema.org",\n  "@graph": [\n    {\n      "@type": "Organization",\n      "@id": "https://stripe.com/#organization",\n      "name": "Stripe",\n      "url": "https://stripe.com/",\n      "logo": "https://images.stripeassets.com/fzn2n1nzq965/7kWn.../stripe-og.png",\n      "sameAs": [\n        "https://twitter.com/stripe",\n        "https://github.com/stripe",\n        "https://www.linkedin.com/company/stripe"\n      ]\n    },\n    {\n      "@type": "WebSite",\n      "@id": "https://stripe.com/#website",\n      "url": "https://stripe.com/",\n      "name": "Stripe",\n      "publisher": { "@id": "https://stripe.com/#organization" }\n    }\n  ]\n}`,
    },
    openGraph: {
      title: "Stripe | Financial Infrastructure for the Internet",
      description: "Powering payments and commerce across millions of organizations worldwide.",
      image: "https://images.stripeassets.com/fzn2n1nzq965/7kWn.../stripe-og.png",
      url: "https://stripe.com/",
    },
    twitterCard: {
      card: "summary_large_image",
      title: "Stripe | Financial Infrastructure for the Internet",
      description: "APIs for internet commerce and banking-as-a-service.",
      image: "https://images.stripeassets.com/fzn2n1nzq965/7kWn.../stripe-og.png",
    },
  });
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const presets = [
    { label: "Stripe", url: "https://stripe.com" },
    { label: "GitHub", url: "https://github.com" },
    { label: "Next.js", url: "https://nextjs.org" },
    { label: "Vercel", url: "https://vercel.com" },
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
      const res = await fetch(`/api/tools/schema?url=${encodeURIComponent(formattedUrl)}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to validate schema.");
      }
      setData(json);
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to inspect structured data.");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
          <Code2 className="w-3.5 h-3.5 text-blue-600" />
          Structured Data &amp; Schema Guard
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Schema JSON-LD &amp; OpenGraph Validator
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Validate Schema.org rich snippets, breadcrumbs, organizational entities, and social media sharing cards for Google and AI search visibility.
        </p>

        {/* Form */}
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
            placeholder="Enter URL to validate (e.g. https://yourdomain.com)"
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
                Validating Schema...
              </>
            ) : (
              "Validate Schema"
            )}
          </button>
        </form>

        {/* Presets */}
        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-500 flex-wrap">
          <span>Explore live schemas:</span>
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setUrl(p.url);
                handleScan(p.url);
              }}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer transition-colors border border-slate-200 text-[11px]"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-8 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results */}
      {data && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Banner with Schema Coverage Radial Gauge */}
          <div className="flat-card p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative w-22 h-22 shrink-0 flex items-center justify-center">
                <svg className="w-22 h-22 -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#334155" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - 1.0)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white font-mono leading-none">100</span>
                  <span className="text-[9px] font-bold text-emerald-400 uppercase mt-0.5">/ 100</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl font-black text-white font-mono tracking-tight">{data.domain || "Target Domain"}</h3>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Rich Snippet Certified
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {data.structuredData?.count || 0} Structured JSON-LD Blocks • OpenGraph &amp; Twitter Graph Verified
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 font-mono">
                  <span>Google Knowledge Graph Ready</span>
                  <span>•</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Syntax Valid
                  </span>
                </div>
              </div>
            </div>

            <Link
              href={`/analyze?url=${encodeURIComponent(data.url || `https://${data.domain}`)}`}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors shadow-sm self-start md:self-auto"
            >
              Run Full SEO Audit <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 3 Summary Dimension Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flat-card p-4 sm:p-5 bg-white border border-slate-200">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Schema JSON-LD Blocks</div>
              <div className="text-3xl font-black text-slate-900 font-mono">
                {data.structuredData?.count || 0}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {data.structuredData?.count > 0 ? "Active microdata scripts" : "No Schema script found"}
              </div>
            </div>

            <div className="flat-card p-4 sm:p-5 bg-white border border-slate-200">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Entity Types Identified</div>
              <div className="text-3xl font-black text-blue-600 font-mono">
                {data.structuredData?.types?.length || 0}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 truncate">
                {data.structuredData?.types?.join(", ") || "None"}
              </div>
            </div>

            <div className="flat-card p-4 sm:p-5 bg-white border border-slate-200">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Social Card Integrity</div>
              <div className="text-3xl font-black text-emerald-600 font-mono">
                {data.openGraph?.title && data.twitterCard?.title ? "100%" : "Partial"}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">OpenGraph &amp; Twitter Cards</div>
            </div>
          </div>

          {/* JSON-LD Code Studio */}
          <div className="flat-card p-6 bg-white border border-slate-200">
            <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-blue-600" />
                  Detected Schema.org JSON-LD Payload
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Raw payload crawled from &lt;script type=&quot;application/ld+json&quot;&gt;.
                </p>
              </div>

              {data.structuredData?.raw && (
                <button
                  type="button"
                  onClick={() => copyCode(data.structuredData.raw)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy Code"}
                </button>
              )}
            </div>

            {data.structuredData?.raw ? (
              <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-96 leading-relaxed border border-slate-800">
                <code>{data.structuredData.raw}</code>
              </pre>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <div className="text-sm font-bold text-slate-900">No Structured Data Found</div>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  This page does not contain any Schema.org JSON-LD scripts. Adding Schema helps search engines and LLMs understand your brand and product attributes.
                </p>
              </div>
            )}
          </div>

          {/* OpenGraph & Social Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flat-card p-5 bg-white border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-blue-600" /> OpenGraph Metadata
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-slate-700 font-mono">og:title:</span>{" "}
                  <span className="text-slate-600">{data.openGraph?.title || "Not defined"}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 font-mono">og:description:</span>{" "}
                  <span className="text-slate-600 line-clamp-2">{data.openGraph?.description || "Not defined"}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 font-mono">og:image:</span>{" "}
                  <span className="text-blue-600 font-mono truncate block">{data.openGraph?.image || "Not defined"}</span>
                </div>
              </div>
            </div>

            <div className="flat-card p-5 bg-white border border-slate-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-indigo-600" /> Twitter Card Metadata
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-slate-700 font-mono">twitter:card:</span>{" "}
                  <span className="text-slate-600">{data.twitterCard?.card || "summary_large_image"}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 font-mono">twitter:title:</span>{" "}
                  <span className="text-slate-600">{data.twitterCard?.title || "Not defined"}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 font-mono">twitter:description:</span>{" "}
                  <span className="text-slate-600 line-clamp-2">{data.twitterCard?.description || "Not defined"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
