"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Smartphone,
  Monitor,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Globe
} from "lucide-react";

export default function SerpPreviewClient() {
  const [url, setUrl] = useState("https://stripe.com");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"desktop" | "mobile">("desktop");
  const [title, setTitle] = useState("Stripe | Financial Infrastructure for the Internet");
  const [description, setDescription] = useState("Stripe is a suite of APIs powering online payment processing and commerce solutions for internet businesses of every size.");
  const [canonical, setCanonical] = useState("https://stripe.com/");
  const [domain, setDomain] = useState("stripe.com");
  const [favicon, setFavicon] = useState("https://stripe.com/favicon.ico");
  const [error, setError] = useState<string | null>(null);

  const presets = [
    { label: "Stripe", url: "https://stripe.com" },
    { label: "Linear", url: "https://linear.app" },
    { label: "Vercel", url: "https://vercel.com" },
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
      const res = await fetch(`/api/tools/serp?url=${encodeURIComponent(formattedUrl)}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to generate SERP preview.");
      }
      setTitle(json.serp.title);
      setDescription(json.serp.metaDescription);
      setCanonical(json.serp.canonical);
      setDomain(json.domain);
      setFavicon(json.serp.favicon);
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to generate SERP snippet.");
    } finally {
      setLoading(false);
    }
  };

  // Pixel calculations
  const titlePixelWidth = Math.round(title.length * 9.5);
  const descPixelWidth = Math.round(description.length * 6.8);

  const titleMaxPixels = mode === "desktop" ? 580 : 540;
  const descMaxPixels = mode === "desktop" ? 960 : 680;

  const isTitleOver = titlePixelWidth > titleMaxPixels || title.length > 60;
  const isDescOver = descPixelWidth > descMaxPixels || description.length > 160;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
          <Search className="w-3.5 h-3.5 text-blue-600" />
          Google SERP Simulator
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Google Desktop &amp; Mobile SERP Simulator
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Inspect how your meta title and description render on Google search results. Test pixel truncation thresholds before publishing changes.
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
            placeholder="Enter URL to preview (e.g. https://yourdomain.com)"
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
                Simulating...
              </>
            ) : (
              "Preview SERP"
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

      {/* Interactive Playground & SERP Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Tweaker */}
        <div className="lg:col-span-5 flat-card p-6 bg-white border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Live Snippet Editor</h3>
            <span className="text-[11px] text-slate-400">Edits update preview in real-time</span>
          </div>

          {/* Visibility Scorecard */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between gap-4 border border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">SERP Visibility Index</span>
              <div className="text-sm font-bold text-white mt-0.5">
                {!isTitleOver && !isDescOver ? "100% Optimal Rendering" : "Pixel Truncation Risk"}
              </div>
            </div>
            <div className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${
              !isTitleOver && !isDescOver 
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30" 
                : "bg-amber-500/20 text-amber-300 border-amber-400/30"
            }`}>
              {!isTitleOver && !isDescOver ? "A+ Clickable" : "Review Length"}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
              <span>Title Tag</span>
              <span className={isTitleOver ? "text-red-600 font-bold" : "text-slate-500"}>
                {title.length} chars / ~{titlePixelWidth}px (Max: ~{titleMaxPixels}px)
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Page title tag..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <div className="mt-1.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isTitleOver ? "bg-rose-500" : titlePixelWidth > titleMaxPixels * 0.85 ? "bg-emerald-500" : "bg-blue-500"
                }`}
                style={{ width: `${Math.min(100, (titlePixelWidth / titleMaxPixels) * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
              <span>Meta Description</span>
              <span className={isDescOver ? "text-red-600 font-bold" : "text-slate-500"}>
                {description.length} chars / ~{descPixelWidth}px (Max: ~{descMaxPixels}px)
              </span>
            </div>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Meta description content..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <div className="mt-1.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isDescOver ? "bg-rose-500" : descPixelWidth > descMaxPixels * 0.8 ? "bg-emerald-500" : "bg-blue-500"
                }`}
                style={{ width: `${Math.min(100, (descPixelWidth / descMaxPixels) * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Canonical URL</label>
            <input
              type="text"
              value={canonical}
              onChange={(e) => setCanonical(e.target.value)}
              placeholder="https://example.com/canonical"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Right: The Actual Google SERP Simulation */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flat-card p-6 bg-white border border-slate-200">
            <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Google Result Preview</span>
              <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  onClick={() => setMode("desktop")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                    mode === "desktop" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" /> Desktop
                </button>
                <button
                  onClick={() => setMode("mobile")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                    mode === "mobile" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" /> Mobile
                </button>
              </div>
            </div>

            {/* Google SERP Snippet Box */}
            <div
              className={`p-6 bg-white rounded-xl border border-slate-200 shadow-sm ${
                mode === "mobile" ? "max-w-sm mx-auto" : ""
              }`}
            >
              {/* Favicon & Breadcrumb */}
              <div className="flex items-center gap-2 mb-1.5">
                {favicon ? (
                  <img src={favicon} alt="Favicon" className="w-4 h-4 rounded-full" />
                ) : (
                  <Globe className="w-4 h-4 text-slate-400" />
                )}
                <div className="text-xs text-slate-800 font-medium">
                  {domain || "example.com"}
                  <span className="text-slate-400 text-[11px] block sm:inline sm:ml-1">
                    {canonical ? canonical.replace(/^https?:\/\/[^/]+/, "") : ""}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h4
                className="text-lg text-[#1a0dab] hover:underline font-normal cursor-pointer leading-snug line-clamp-2"
                style={{ fontFamily: "Arial, sans-serif" }}
              >
                {title || "Example Web Page Title - Add Your Title Here"}
              </h4>

              {/* Description */}
              <p
                className="text-xs text-[#4d5156] mt-1.5 leading-relaxed line-clamp-3"
                style={{ fontFamily: "Arial, sans-serif" }}
              >
                {description || "Meta description will appear here. Provide an accurate summary to improve organic click-through rates."}
              </p>
            </div>

            {/* Truncation Status Badges */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                {isTitleOver ? (
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <span className={isTitleOver ? "text-amber-800" : "text-slate-700"}>
                  Title: {isTitleOver ? "Likely Truncated on Google" : "Fits within pixel budget"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isDescOver ? (
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <span className={isDescOver ? "text-amber-800" : "text-slate-700"}>
                  Description: {isDescOver ? "Likely Truncated on Google" : "Fits within pixel budget"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
