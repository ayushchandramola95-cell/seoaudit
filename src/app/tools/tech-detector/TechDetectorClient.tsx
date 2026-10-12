"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Cpu,
  Server,
  ShieldCheck,
  BarChart,
  Loader2,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Sparkles,
  CheckCircle2
} from "lucide-react";

interface TechItem {
  name: string;
  category: "framework" | "cms" | "analytics" | "cdn" | "advertising" | "server" | "ecommerce" | "other";
  confidence: "high" | "medium" | "low";
  version?: string;
  icon?: string;
}

export default function TechDetectorClient() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    url: string;
    domain: string;
    statusCode: number;
    responseTimeMs: number;
    data: TechItem[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const presets = [
    { label: "Shopify", url: "https://shopify.com" },
    { label: "Vercel", url: "https://vercel.com" },
    { label: "GitHub", url: "https://github.com" },
  ];

  const handleScan = async (targetToScan = url) => {
    if (!targetToScan) return;
    setLoading(true);
    setError(null);
    setData(null);

    let formattedUrl = targetToScan.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
      setUrl(formattedUrl);
    }

    try {
      const res = await fetch(`/api/tools/tech?url=${encodeURIComponent(formattedUrl)}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to inspect technologies.");
      }
      setData(json);
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to detect technologies.");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { key: "framework", label: "Frameworks & UI", icon: Cpu },
    { key: "cms", label: "CMS & Platform", icon: Layers },
    { key: "analytics", label: "Analytics & Trackers", icon: BarChart },
    { key: "cdn", label: "CDN & Hosting", icon: Server },
    { key: "server", label: "Server & Security", icon: ShieldCheck },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          50+ Signature Tech Profiler
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Website Technology Stack Detector
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Uncover the frameworks, content management systems, analytics libraries, CDNs, and server engines powering any website in under 100 milliseconds.
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
            placeholder="Enter URL to profile (e.g. https://yourdomain.com)"
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
                Detecting Stack...
              </>
            ) : (
              "Detect Stack"
            )}
          </button>
        </form>

        {/* Presets */}
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
          {/* Top Banner */}
          <div className="flat-card p-5 bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-slate-900">{data.domain}</div>
              <div className="text-xs text-slate-500 mt-0.5">
                HTTP {data.statusCode} • Response Time: {data.responseTimeMs}ms • {data.data.length} Technologies Identified
              </div>
            </div>
            <Link
              href={`/analyze?url=${encodeURIComponent(url)}`}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Run Full SEO Audit <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Grouped Technology Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const items = data.data.filter((item) => item.category === cat.key);
              const Icon = cat.icon;

              return (
                <div key={cat.key} className="flat-card p-5 bg-white border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-blue-600" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">{cat.label}</h4>
                      </div>
                      <span className="text-xs font-bold text-slate-400">({items.length})</span>
                    </div>

                    {items.length > 0 ? (
                      <div className="space-y-2.5">
                        {items.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-xs font-bold text-slate-900">{item.name}</span>
                            </div>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                              {item.confidence}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic py-4 text-center">
                        No signature detected in this category.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
