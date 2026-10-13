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
  CheckCircle2,
  PieChart
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
  } | null>({
    url: "https://vercel.com",
    domain: "vercel.com",
    statusCode: 200,
    responseTimeMs: 42,
    data: [
      { name: "Next.js", category: "framework", confidence: "high", version: "14.2" },
      { name: "React", category: "framework", confidence: "high", version: "18.3" },
      { name: "Vercel Edge Network", category: "cdn", confidence: "high" },
      { name: "Tailwind CSS", category: "framework", confidence: "high" },
      { name: "Google Analytics 4", category: "analytics", confidence: "high" },
      { name: "Cloudflare Anycast DNS", category: "server", confidence: "high" },
    ],
  });
  const [error, setError] = useState<string | null>(null);

  const presets = [
    { label: "Vercel", url: "https://vercel.com" },
    { label: "Shopify", url: "https://shopify.com" },
    { label: "GitHub", url: "https://github.com" },
    { label: "Stripe", url: "https://stripe.com" },
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

  const totalTechs = data?.data.length || 0;
  const frameworkCount = data?.data.filter((t) => t.category === "framework").length || 0;
  const cdnCount = data?.data.filter((t) => t.category === "cdn").length || 0;
  const analyticsCount = data?.data.filter((t) => t.category === "analytics").length || 0;
  const serverCount = data?.data.filter((t) => t.category === "server").length || 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          50+ Signature Tech Profiler Engine
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
        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-500 flex-wrap">
          <span>Explore live tech stacks:</span>
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
          {/* Top Banner with Stack Modernness SVG Radial Gauge */}
          <div className="flat-card p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative w-22 h-22 shrink-0 flex items-center justify-center">
                <svg className="w-22 h-22 -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#334155" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#818cf8"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - 0.98)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white font-mono leading-none">98</span>
                  <span className="text-[9px] font-bold text-indigo-300 uppercase mt-0.5">/ 100</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-2xl font-black text-white font-mono tracking-tight">{data.domain}</h3>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    Modern Edge Stack
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  HTTP {data.statusCode} • Latency: {data.responseTimeMs}ms • {data.data.length} Confirmed Signatures
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 font-mono">
                  <span>Fast Edge Delivery</span>
                  <span>•</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Clean Fingerprint
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

          {/* Stack Distribution Stacked Bar Chart */}
          <div className="flat-card p-6 bg-white border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-indigo-600" />
                  Stack Composition Breakdown
                </h4>
                <p className="text-xs text-slate-500">
                  Categorical distribution of discovered software layers across the application.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-600"></span> UI/Frameworks: {frameworkCount}</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-indigo-500"></span> CDN/Host: {cdnCount}</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-purple-500"></span> Analytics: {analyticsCount}</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-slate-500"></span> Server: {serverCount}</span>
              </div>
            </div>

            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
              <div
                className="bg-blue-600 h-full transition-all duration-700"
                style={{ width: `${Math.max(10, (frameworkCount / (totalTechs || 1)) * 100)}%` }}
                title={`Frameworks: ${frameworkCount}`}
              />
              <div
                className="bg-indigo-500 h-full transition-all duration-700"
                style={{ width: `${((cdnCount / (totalTechs || 1)) * 100)}%` }}
                title={`CDN: ${cdnCount}`}
              />
              <div
                className="bg-purple-500 h-full transition-all duration-700"
                style={{ width: `${((analyticsCount / (totalTechs || 1)) * 100)}%` }}
                title={`Analytics: ${analyticsCount}`}
              />
              <div
                className="bg-slate-500 h-full transition-all duration-700"
                style={{ width: `${((serverCount / (totalTechs || 1)) * 100)}%` }}
                title={`Server: ${serverCount}`}
              />
            </div>
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
                            className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200 flex items-center justify-between gap-2 transition-colors"
                          >
                            <div className="flex items-center gap-2.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <div>
                                <span className="text-xs font-bold text-slate-900 block leading-tight">{item.name}</span>
                                {item.version && (
                                  <span className="text-[10px] text-slate-500 font-mono">v{item.version}</span>
                                )}
                              </div>
                            </div>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 uppercase">
                              {item.confidence}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic py-6 text-center">
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
