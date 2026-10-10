"use client";

import { useState } from "react";
import {
  Globe,
  Smartphone,
  Monitor,
  Share2,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
} from "lucide-react";

interface SerpSocialPreviewProps {
  url: string;
  domain: string;
  title: string;
  description: string;
  ogImage?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  twitterCard?: string | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: string | null;
}

export default function SerpSocialPreview({
  url,
  domain,
  title,
  description,
  ogImage,
  ogTitle,
  ogDescription,
  twitterCard = "summary_large_image",
  twitterTitle,
  twitterDescription,
  twitterImage,
}: SerpSocialPreviewProps) {
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Live simulator state (allows user to experiment with edits)
  const [simTitle, setSimTitle] = useState(title || "");
  const [simDesc, setSimDesc] = useState(description || "");

  // Safe Fallbacks
  const activeTitle = simTitle || "Untitled Document";
  const activeDesc =
    simDesc || "No meta description provided. Google will extract an automated snippet from page content.";
  const activeOgTitle = ogTitle || activeTitle;
  const activeOgDesc = ogDescription || activeDesc;
  const activeOgImage = ogImage || twitterImage || null;
  const activeTwitterTitle = twitterTitle || activeOgTitle;
  const activeTwitterDesc = twitterDescription || activeOgDesc;
  const activeTwitterImage = twitterImage || activeOgImage;

  // Title character optimization (Desktop: ~60 chars / 600px; Mobile: ~55 chars)
  const titleLen = simTitle.length;
  const titleOptimal = titleLen >= 35 && titleLen <= 60;
  const titleWarning = titleLen < 35 ? "Too Short" : titleLen > 60 ? "May Be Truncated" : "Optimal";

  // Description character optimization (120–160 chars)
  const descLen = simDesc.length;
  const descOptimal = descLen >= 120 && descLen <= 160;
  const descWarning = descLen < 70 ? "Too Short" : descLen > 160 ? "May Be Truncated" : "Optimal";

  // Breadcrumb formatting for Google
  let breadcrumb = domain;
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    const pathname = parsed.pathname.replace(/\/$/, "");
    if (pathname && pathname !== "/") {
      const parts = pathname.split("/").filter(Boolean);
      breadcrumb = `${parsed.hostname} › ${parts.join(" › ")}`;
    }
  } catch {
    breadcrumb = domain;
  }

  function copySnippet(text: string, type: string) {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  }

  return (
    <div className="space-y-8">
      {/* Live Testing & Simulator Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              Live SERP & Social Share Simulator
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Preview how this page renders across Google Search (Desktop & Mobile), Twitter/X, and LinkedIn feed cards.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Google Viewport:</span>
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
              <button
                onClick={() => setDeviceMode("desktop")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
                  deviceMode === "desktop"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                Desktop
              </button>
              <button
                onClick={() => setDeviceMode("mobile")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
                  deviceMode === "mobile"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Mobile
              </button>
            </div>
          </div>
        </div>

        {/* Live Input Controls to test edits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <label className="font-bold text-slate-700">Meta Title Preview</label>
              <span
                className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded ${
                  titleOptimal
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {titleLen} / 60 chars ({titleWarning})
              </span>
            </div>
            <input
              type="text"
              value={simTitle}
              onChange={(e) => setSimTitle(e.target.value)}
              placeholder="Enter page title..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <label className="font-bold text-slate-700">Meta Description Preview</label>
              <span
                className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded ${
                  descOptimal
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {descLen} / 160 chars ({descWarning})
              </span>
            </div>
            <textarea
              rows={2}
              value={simDesc}
              onChange={(e) => setSimDesc(e.target.value)}
              placeholder="Enter meta description..."
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
            />
          </div>
        </div>
      </div>

      {/* Grid: Google Search vs Social Media */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Google Search Results Preview */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center font-bold text-blue-600 text-xs">
                G
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Google Search Result ({deviceMode === "desktop" ? "Desktop" : "Mobile"})
              </h4>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Pixel limit: ~600px</span>
          </div>

          {/* Realistic Google SERP Card */}
          <div
            className={`p-4 rounded-xl border border-slate-200/80 bg-white transition-all shadow-xs ${
              deviceMode === "mobile" ? "max-w-sm mx-auto" : "w-full"
            }`}
          >
            {/* Favicon & Breadcrumb */}
            <div className="flex items-center gap-2 mb-1 text-[13px] text-[#202124]">
              <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] text-slate-600 shrink-0 font-bold uppercase">
                {domain.charAt(0)}
              </div>
              <div className="leading-tight truncate">
                <span className="text-xs text-[#202124] font-medium block truncate">{domain}</span>
                <span className="text-[11px] text-[#4d5156] font-mono block truncate">{breadcrumb}</span>
              </div>
            </div>

            {/* Clickable Blue Title */}
            <h5 className="text-[18px] sm:text-[20px] leading-snug font-normal text-[#1a0dab] hover:underline cursor-pointer tracking-normal pt-1 break-words">
              {activeTitle.length > (deviceMode === "desktop" ? 64 : 58)
                ? `${activeTitle.slice(0, deviceMode === "desktop" ? 64 : 58)}...`
                : activeTitle}
            </h5>

            {/* Gray Description snippet */}
            <p className="text-[13px] sm:text-[14px] leading-relaxed text-[#4d5156] pt-1 break-words font-sans">
              {activeDesc.length > 160 ? `${activeDesc.slice(0, 157)}...` : activeDesc}
            </p>
          </div>

          {/* Diagnostic indicators */}
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs space-y-1.5 text-slate-600">
            <div className="flex items-center justify-between">
              <span>Title Pixel Width:</span>
              <span className={`font-semibold ${titleOptimal ? "text-emerald-700" : "text-amber-700"}`}>
                Approx. {Math.round(titleLen * 9.5)}px / 600px max
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Google Snippet Health:</span>
              <span className="font-semibold text-slate-800">
                {titleOptimal && descOptimal ? "High CTR Probability" : "Truncation / Length Warning"}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Twitter / X Summary Card Preview */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                𝕏
              </div>
              <h4 className="text-sm font-bold text-slate-900">Twitter / X Card Preview</h4>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Card: {twitterCard}</span>
          </div>

          {/* Realistic Twitter Card Container */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
            {activeTwitterImage ? (
              <div className="h-44 sm:h-52 w-full bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                <img
                  src={activeTwitterImage}
                  alt="OpenGraph visual asset"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback on broken image
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            ) : (
              <div className="h-32 w-full bg-slate-100 flex flex-col items-center justify-center text-slate-400 p-4 text-center border-b border-slate-100">
                <AlertTriangle className="w-6 h-6 mb-1 text-amber-500" />
                <span className="text-xs font-medium text-slate-600">Missing OpenGraph / Twitter Image</span>
                <span className="text-[11px] text-slate-500">Add an og:image tag (1200x630px recommended)</span>
              </div>
            )}

            <div className="p-3.5 space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 block font-mono">
                {domain}
              </span>
              <h5 className="text-sm font-bold text-slate-900 line-clamp-1 leading-snug">
                {activeTwitterTitle}
              </h5>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {activeTwitterDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Aspect Ratio: 1.91:1 (1200 × 630px)</span>
            <button
              onClick={() => copySnippet(activeTwitterTitle, "twitter")}
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              {copiedType === "twitter" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedType === "twitter" ? "Copied" : "Copy Title"}
            </button>
          </div>
        </div>

        {/* 3. LinkedIn & Facebook OpenGraph Feed Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#0a66c2] text-white flex items-center justify-center font-bold text-xs">
                in
              </div>
              <h4 className="text-sm font-bold text-slate-900">LinkedIn & Facebook Feed Share Card</h4>
            </div>
            <span className="text-[11px] text-slate-500">Standard OpenGraph Schema</span>
          </div>

          <div className="max-w-2xl mx-auto border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shadow-xs">
            {activeOgImage ? (
              <div className="h-56 sm:h-64 w-full bg-slate-200 relative overflow-hidden flex items-center justify-center">
                <img
                  src={activeOgImage}
                  alt="LinkedIn feed preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-36 w-full bg-slate-100 flex flex-col items-center justify-center text-slate-400 p-4 border-b border-slate-200">
                <AlertTriangle className="w-6 h-6 text-amber-500 mb-1" />
                <span className="text-xs font-semibold text-slate-700">No og:image specified</span>
                <span className="text-[11px] text-slate-500">Social networks will fallback to first page image</span>
              </div>
            )}

            <div className="p-4 bg-white border-t border-slate-200 space-y-1">
              <span className="text-[11px] text-slate-500 font-mono block">{domain}</span>
              <h5 className="text-base font-bold text-slate-900 leading-snug line-clamp-1">
                {activeOgTitle}
              </h5>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {activeOgDesc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
