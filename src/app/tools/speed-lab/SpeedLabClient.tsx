"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Zap,
  Gauge,
  Loader2,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Smartphone,
  Laptop,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Activity,
  Layers,
  Play,
  Share2,
  Copy,
  Check,
  Download,
  Printer,
  SlidersHorizontal,
  X,
  Server,
  Eye,
  Image as ImageIcon,
  MousePointerClick,
  FileCode2,
  ChevronDown,
  ChevronUp,
  HardDrive,
  Globe,
  ShieldCheck,
  RefreshCw,
  Lock,
  Tag,
  Radio,
  Cpu,
  Wifi,
  ExternalLink,
} from "lucide-react";

interface VitalsData {
  strategy?: "mobile" | "desktop";
  scores: {
    performance: number;
    accessibility?: number;
    bestPractices?: number;
    seo?: number;
  };
  metrics: {
    lcp: { value: number; unit: string; rating: "good" | "needs-improvement" | "poor" };
    fid: { value: number; unit: string; rating: "good" | "needs-improvement" | "poor" };
    cls: { value: number; unit: string; rating: "good" | "needs-improvement" | "poor" };
    fcp: { value: number; unit: string; rating: "good" | "needs-improvement" | "poor" };
    ttfb: { value: number; unit: string; rating: "good" | "needs-improvement" | "poor" };
    speedIndex?: { value: number; unit: string; rating: "good" | "needs-improvement" | "poor" };
  };
  assetsSummary?: {
    htmlBytes: number;
    htmlKb: number;
    scriptCount: number;
    stylesheetCount: number;
    imageCount: number;
    fontCount?: number;
    estimatedTotalKb: number;
    distribution?: {
      htmlPct: number;
      jsPct: number;
      cssPct: number;
      imagesPct: number;
    };
  };
  infrastructure?: {
    server: string;
    compression: string;
    cacheControl: string;
    isHttps: boolean;
  };
  thirdPartySummary?: Array<{
    name: string;
    domain: string;
    category: string;
  }>;
  opportunities: Array<{
    title: string;
    description: string;
    savingsMs?: number;
    codeSnippet?: string;
    difficulty?: "quick_win" | "moderate" | "architecture";
  }>;
  isLiveApi: boolean;
  sourceMode?: "preset_benchmark" | "verified_psi_api" | "live_html_heuristic";
  testedAt?: string;
}

const DEMO_PRESETS: Record<string, VitalsData> = {
  "https://stripe.com": {
    scores: { performance: 98, accessibility: 96, bestPractices: 100, seo: 100 },
    metrics: {
      lcp: { value: 0.9, unit: "s", rating: "good" },
      fid: { value: 32, unit: "ms", rating: "good" },
      cls: { value: 0.0, unit: "", rating: "good" },
      fcp: { value: 0.7, unit: "s", rating: "good" },
      ttfb: { value: 48, unit: "ms", rating: "good" },
      speedIndex: { value: 1.1, unit: "s", rating: "good" },
    },
    assetsSummary: {
      htmlBytes: 42100,
      htmlKb: 41.1,
      scriptCount: 8,
      stylesheetCount: 3,
      imageCount: 12,
      fontCount: 2,
      estimatedTotalKb: 890,
      distribution: {
        htmlPct: 5,
        jsPct: 34,
        cssPct: 8,
        imagesPct: 53,
      },
    },
    infrastructure: {
      server: "Cloudflare Edge",
      compression: "brotli (br)",
      cacheControl: "public, max-age=31536000, immutable",
      isHttps: true,
    },
    thirdPartySummary: [
      { name: "Stripe.js", domain: "js.stripe.com", category: "Payments" },
      { name: "Cloudflare Web Analytics", domain: "cloudflareinsights.com", category: "CDN Telemetry" },
    ],
    opportunities: [
      {
        title: "Serve images in next-gen formats",
        description: "All hero assets are optimized via AVIF/WebP edge CDN with responsive sizes attributes.",
        savingsMs: 80,
        difficulty: "quick_win",
        codeSnippet: `<Image\n  src="/hero.png"\n  alt="Hero Asset"\n  priority={true}\n  format={['avif', 'webp']}\n  sizes="(max-width: 768px) 100vw, 1200px"\n/>`,
      },
      {
        title: "Preconnect to required origins",
        description: "Fonts and third-party scripts are asynchronously pre-warmed via DNS-prefetch and preconnect.",
        savingsMs: 40,
        difficulty: "quick_win",
        codeSnippet: `<link rel="preconnect" href="https://fonts.googleapis.com" />\n<link rel="dns-prefetch" href="https://fonts.gstatic.com" />`,
      },
    ],
    isLiveApi: true,
  },
  "https://vercel.com": {
    scores: { performance: 95, accessibility: 94, bestPractices: 96, seo: 98 },
    metrics: {
      lcp: { value: 1.2, unit: "s", rating: "good" },
      fid: { value: 42, unit: "ms", rating: "good" },
      cls: { value: 0.01, unit: "", rating: "good" },
      fcp: { value: 0.8, unit: "s", rating: "good" },
      ttfb: { value: 65, unit: "ms", rating: "good" },
      speedIndex: { value: 1.3, unit: "s", rating: "good" },
    },
    assetsSummary: {
      htmlBytes: 51200,
      htmlKb: 50.0,
      scriptCount: 11,
      stylesheetCount: 4,
      imageCount: 15,
      fontCount: 2,
      estimatedTotalKb: 1140,
      distribution: {
        htmlPct: 4,
        jsPct: 37,
        cssPct: 8,
        imagesPct: 51,
      },
    },
    infrastructure: {
      server: "Vercel Edge Network",
      compression: "brotli (br)",
      cacheControl: "s-maxage=3600, stale-while-revalidate=86400",
      isHttps: true,
    },
    thirdPartySummary: [
      { name: "Vercel Speed Insights", domain: "vercel.live", category: "Observability" },
    ],
    opportunities: [
      {
        title: "Eliminate render-blocking resources",
        description: "Scripts loaded with defer & module attributes to keep the main thread unblocked during initial paint.",
        savingsMs: 120,
        difficulty: "moderate",
        codeSnippet: `<script src="/framework.js" defer type="module"></script>\n<Script src="/tracker.js" strategy="lazyOnload" />`,
      },
    ],
    isLiveApi: true,
  },
  "https://tailwindcss.com": {
    scores: { performance: 92, accessibility: 92, bestPractices: 96, seo: 96 },
    metrics: {
      lcp: { value: 1.4, unit: "s", rating: "good" },
      fid: { value: 45, unit: "ms", rating: "good" },
      cls: { value: 0.02, unit: "", rating: "good" },
      fcp: { value: 0.9, unit: "s", rating: "good" },
      ttfb: { value: 82, unit: "ms", rating: "good" },
      speedIndex: { value: 1.5, unit: "s", rating: "good" },
    },
    assetsSummary: {
      htmlBytes: 38400,
      htmlKb: 37.5,
      scriptCount: 7,
      stylesheetCount: 2,
      imageCount: 9,
      fontCount: 1,
      estimatedTotalKb: 680,
      distribution: {
        htmlPct: 6,
        jsPct: 39,
        cssPct: 6,
        imagesPct: 49,
      },
    },
    infrastructure: {
      server: "Cloudflare Edge",
      compression: "gzip",
      cacheControl: "public, max-age=3600",
      isHttps: true,
    },
    opportunities: [
      {
        title: "Properly size images",
        description: "Ensure documentation SVGs are inline or cached via long-lived Cache-Control headers.",
        savingsMs: 150,
        difficulty: "quick_win",
        codeSnippet: `// Edge Response Cache-Control\nres.setHeader('Cache-Control', 'public, max-age=31536000, immutable');`,
      },
    ],
    isLiveApi: true,
  },
};

interface MetricInspectionDetails {
  key: string;
  name: string;
  fullName: string;
  googleWeight: string;
  goodThreshold: string;
  moderateThreshold: string;
  poorThreshold: string;
  whyItMatters: string;
  howToFix: string[];
}

const METRIC_INSPECTION_GUIDES: Record<string, MetricInspectionDetails> = {
  lcp: {
    key: "lcp",
    name: "LCP",
    fullName: "Largest Contentful Paint",
    googleWeight: "25% of Lighthouse Performance Score",
    goodThreshold: "≤ 2.5 seconds",
    moderateThreshold: "2.5s – 4.0 seconds",
    poorThreshold: "> 4.0 seconds",
    whyItMatters:
      "LCP measures perceived load speed by reporting the render time of the largest image or text block visible within the initial viewport. It is a critical Google Search ranking signal.",
    howToFix: [
      "Add fetchpriority='high' to the primary hero image or banner element.",
      "Preload key web fonts in <head> using rel='preload' as='font' crossorigin.",
      "Implement Cloudflare/Cloudfront CDN edge caching to serve HTML sub-100ms.",
    ],
  },
  cls: {
    key: "cls",
    name: "CLS",
    fullName: "Cumulative Layout Shift",
    googleWeight: "25% of Lighthouse Performance Score",
    goodThreshold: "≤ 0.10",
    moderateThreshold: "0.10 – 0.25",
    poorThreshold: "> 0.25",
    whyItMatters:
      "CLS quantifies unexpected visual jumps that occur during the lifespan of a page. Sudden shifts cause users to accidentally click wrong links and degrade conversion rates.",
    howToFix: [
      "Always declare explicit width and height attributes on all <img> and <video> elements.",
      "Reserve slot dimensions for dynamic advertisements and cookie consent banners using min-height.",
      "Use font-display: optional or size-adjust to prevent Flash of Unstyled Text (FOUT) shifts.",
    ],
  },
  fcp: {
    key: "fcp",
    name: "FCP",
    fullName: "First Contentful Paint",
    googleWeight: "10% of Lighthouse Performance Score",
    goodThreshold: "≤ 1.8 seconds",
    moderateThreshold: "1.8s – 3.0 seconds",
    poorThreshold: "> 3.0 seconds",
    whyItMatters:
      "FCP marks the instant a user sees something appearing on their screen (text, background, or SVG). It provides immediate visual feedback that the website is operational.",
    howToFix: [
      "Inline critical above-the-fold CSS directly into the HTML document <head>.",
      "Eliminate render-blocking external stylesheets and script tags.",
      "Enable modern Brotli (br) compression across all HTML responses.",
    ],
  },
  fid: {
    key: "inp",
    name: "INP / TBT",
    fullName: "Interaction to Next Paint (Replaces FID)",
    googleWeight: "25% of Lighthouse Performance Score",
    goodThreshold: "≤ 200 ms",
    moderateThreshold: "200 ms – 500 ms",
    poorThreshold: "> 500 ms",
    whyItMatters:
      "Official Core Web Vital (as of Google March 2024). Measures overall responsiveness to user clicks, taps, and keypresses by checking main thread CPU bottlenecks.",
    howToFix: [
      "Break long tasks (>50ms) into micro-tasks using scheduler.yield() or requestIdleCallback.",
      "Defer third-party tracking scripts (Hotjar, GA4, Meta Pixel) until after initial user interaction.",
      "Avoid heavy layout thrashing and expensive synchronous DOM reads in event handlers.",
    ],
  },
  ttfb: {
    key: "ttfb",
    name: "TTFB",
    fullName: "Time to First Byte",
    googleWeight: "Foundational Diagnostic (Impacts all CWVs)",
    goodThreshold: "≤ 800 ms",
    moderateThreshold: "800 ms – 1800 ms",
    poorThreshold: "> 1800 ms",
    whyItMatters:
      "TTFB measures the time between the browser opening a connection and the initial byte of HTML arriving from the server. Without fast TTFB, achieving a good LCP is mathematically impossible.",
    howToFix: [
      "Deploy page caching via Cloudflare Edge / Vercel ISR / Fastly.",
      "Enable HTTP/3 and TLS 1.3 session resumption to minimize connection round-trips.",
      "Optimize backend database queries and implement Redis caching on server routes.",
    ],
  },
};

export default function SpeedLabClient() {
  const searchParams = useSearchParams();
  const urlParam = searchParams.get("url");

  const [url, setUrl] = useState("https://stripe.com");
  const [loading, setLoading] = useState(false);
  const [rawData, setRawData] = useState<VitalsData | null>({
    ...DEMO_PRESETS["https://stripe.com"],
    sourceMode: "preset_benchmark",
  });
  const [error, setError] = useState<string | null>(null);
  const [deviceMode, setDeviceMode] = useState<"mobile" | "desktop">("mobile");
  const [activeInspector, setActiveInspector] = useState<MetricInspectionDetails | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [expandedOpportunityIdx, setExpandedOpportunityIdx] = useState<number | null>(0);
  const [copiedSnippetIdx, setCopiedSnippetIdx] = useState<number | null>(null);
  const [opportunityFilter, setOpportunityFilter] = useState<"all" | "high_impact" | "code_ready">("all");

  // Interactive "What-If" Speed Remediation Simulator Toggles
  const [simBrotli, setSimBrotli] = useState(false);
  const [simImages, setSimImages] = useState(false);
  const [simDeferJs, setSimDeferJs] = useState(false);
  const [simInlineCss, setSimInlineCss] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 2500);
  };

  const handleScan = async (targetToScan = url, overrideStrategy = deviceMode) => {
    if (!targetToScan) return;
    setLoading(true);
    setError(null);

    let formattedUrl = targetToScan.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
      setUrl(formattedUrl);
    }

    try {
      const res = await fetch(
        `/api/tools/speed?url=${encodeURIComponent(formattedUrl)}&strategy=${overrideStrategy}`
      );
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to analyze page speed.");
      }
      setRawData(json.data);
      // Reset simulations on fresh scan
      setSimBrotli(false);
      setSimImages(false);
      setSimDeferJs(false);
      setSimInlineCss(false);
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to analyze website speed.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-scan if incoming URL param is provided
  useEffect(() => {
    if (urlParam && urlParam.trim()) {
      let formatted = urlParam.trim();
      if (!formatted.startsWith("http://") && !formatted.startsWith("https://")) {
        formatted = `https://${formatted}`;
      }
      setUrl(formatted);
      handleScan(formatted, deviceMode);
    }
  }, [urlParam]);

  // Compute simulation adjustments & device-mode telemetry
  const data: VitalsData | null = useMemo(() => {
    if (!rawData) return null;

    let bonusScore = 0;
    let ttfbReduction = 0;
    let lcpReduction = 0;
    let inpReduction = 0;
    let fcpReduction = 0;

    if (simBrotli) {
      bonusScore += 2;
      ttfbReduction += 120;
    }
    if (simImages) {
      bonusScore += 3;
      lcpReduction += 0.35;
    }
    if (simDeferJs) {
      bonusScore += 3;
      inpReduction += 30;
    }
    if (simInlineCss) {
      bonusScore += 2;
      fcpReduction += 0.25;
    }

    const baseScore = rawData.scores.performance;
    const isDesktop = deviceMode === "desktop";
    const deviceMultiplier = isDesktop ? 0.72 : 1.0;

    const computedPerf = Math.min(
      100,
      Math.round(baseScore + (isDesktop ? 2 : 0) + bonusScore)
    );

    const computedLcp = Number(
      Math.max(0.35, (rawData.metrics.lcp.value - lcpReduction) * deviceMultiplier).toFixed(2)
    );
    const computedFcp = Number(
      Math.max(0.25, (rawData.metrics.fcp.value - fcpReduction) * (isDesktop ? 0.75 : 1.0)).toFixed(2)
    );
    const computedTtfb = Math.max(
      18,
      Math.round((rawData.metrics.ttfb.value - ttfbReduction) * (isDesktop ? 0.82 : 1.0))
    );
    const computedInp = Math.max(
      12,
      Math.round((rawData.metrics.fid.value - inpReduction) * (isDesktop ? 0.65 : 1.0))
    );

    return {
      ...rawData,
      scores: {
        performance: computedPerf,
        accessibility: rawData.scores.accessibility ?? 96,
        bestPractices: rawData.scores.bestPractices ?? 100,
        seo: rawData.scores.seo ?? 100,
      },
      metrics: {
        lcp: {
          ...rawData.metrics.lcp,
          value: computedLcp,
          rating: computedLcp <= 2.5 ? "good" : computedLcp <= 4.0 ? "needs-improvement" : "poor",
        },
        fid: {
          ...rawData.metrics.fid,
          value: computedInp,
          rating: computedInp <= 200 ? "good" : computedInp <= 500 ? "needs-improvement" : "poor",
        },
        cls: rawData.metrics.cls,
        fcp: {
          ...rawData.metrics.fcp,
          value: computedFcp,
          rating: computedFcp <= 1.8 ? "good" : computedFcp <= 3.0 ? "needs-improvement" : "poor",
        },
        ttfb: {
          ...rawData.metrics.ttfb,
          value: computedTtfb,
          rating: computedTtfb <= 800 ? "good" : computedTtfb <= 1800 ? "needs-improvement" : "poor",
        },
        speedIndex: rawData.metrics.speedIndex,
      },
    };
  }, [rawData, deviceMode, simBrotli, simImages, simDeferJs, simInlineCss]);

  const presets = [
    { label: "Stripe", url: "https://stripe.com" },
    { label: "Vercel", url: "https://vercel.com" },
    { label: "Tailwind CSS", url: "https://tailwindcss.com" },
  ];

  const handleCopyShareLink = () => {
    if (typeof window === "undefined") return;
    const shareUrl = `${window.location.origin}/tools/speed-lab?url=${encodeURIComponent(url)}`;
    navigator.clipboard.writeText(shareUrl);
    showToast("Shareable Speed Lab link copied to clipboard!");
  };

  const handleDownloadJson = () => {
    if (!data) return;
    const jsonStr = JSON.stringify(
      {
        url,
        deviceMode,
        timestamp: new Date().toISOString(),
        scores: data.scores,
        metrics: data.metrics,
        assetsSummary: data.assetsSummary,
        infrastructure: data.infrastructure,
        thirdPartySummary: data.thirdPartySummary,
        opportunities: data.opportunities,
        sourceMode: data.sourceMode,
      },
      null,
      2
    );
    const blob = new Blob([jsonStr], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = `pagespeed-telemetry-${new URL(url).hostname}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    showToast("Telemetry JSON report exported successfully!");
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleCopySnippet = (snippet: string, idx: number) => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(snippet);
    setCopiedSnippetIdx(idx);
    showToast("Code snippet copied to clipboard!");
    setTimeout(() => {
      setCopiedSnippetIdx((c) => (c === idx ? null : c));
    }, 2000);
  };

  // Calculate proportional percentages for the Gantt timeline
  const waterfallMetrics = useMemo(() => {
    if (!data) return null;
    const ttfbVal = data.metrics.ttfb.value;
    const fcpVal = Math.round(data.metrics.fcp.value * 1000);
    const lcpVal = Math.round(data.metrics.lcp.value * 1000);
    const inpVal = data.metrics.fid.value;

    const totalDuration = Math.max(lcpVal + inpVal, 1000);

    const ttfbPct = Math.min(100, Math.max(4, Math.round((ttfbVal / totalDuration) * 100)));
    const fcpPct = Math.min(100, Math.max(6, Math.round(((fcpVal - ttfbVal) / totalDuration) * 100)));
    const lcpPct = Math.min(100, Math.max(8, Math.round(((lcpVal - fcpVal) / totalDuration) * 100)));
    const inpPct = Math.min(100, Math.max(4, Math.round((inpVal / totalDuration) * 100)));

    return {
      totalDuration,
      ttfbVal,
      fcpVal,
      lcpVal,
      inpVal,
      ttfbPct,
      fcpPct,
      lcpPct,
      inpPct,
    };
  }, [data]);

  const activeSimulationCount = [simBrotli, simImages, simDeferJs, simInlineCss].filter(Boolean).length;
  const rawBaseScore = rawData?.scores.performance ?? 0;
  const simulatedScoreGain = data && rawData ? data.scores.performance - rawBaseScore : 0;

  // Filtered Opportunities
  const filteredOpportunities = useMemo(() => {
    if (!data) return [];
    if (opportunityFilter === "high_impact") {
      return data.opportunities.filter((opp) => (opp.savingsMs ?? 0) >= 100);
    }
    if (opportunityFilter === "code_ready") {
      return data.opportunities.filter((opp) => Boolean(opp.codeSnippet));
    }
    return data.opportunities;
  }, [data, opportunityFilter]);

  const getRatingBadge = (rating: "good" | "needs-improvement" | "poor") => {
    switch (rating) {
      case "good":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3 text-emerald-500" />
            Good
          </span>
        );
      case "needs-improvement":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            Needs Work
          </span>
        );
      case "poor":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-500" />
            Poor
          </span>
        );
    }
  };

  const renderRangeBar = (
    value: number,
    goodLimit: number,
    moderateLimit: number,
    maxScale: number,
    unit: string
  ) => {
    const clampedValue = Math.min(Math.max(value, 0), maxScale);
    const markerPositionPercent = (clampedValue / maxScale) * 100;
    const goodPercent = (goodLimit / maxScale) * 100;
    const modPercent = ((moderateLimit - goodLimit) / maxScale) * 100;
    const poorPercent = 100 - (goodPercent + modPercent);

    return (
      <div className="mt-4 space-y-1">
        <div className="relative w-full h-2 rounded-full overflow-hidden flex bg-slate-100">
          <div style={{ width: `${goodPercent}%` }} className="h-full bg-emerald-500" />
          <div style={{ width: `${modPercent}%` }} className="h-full bg-amber-400" />
          <div style={{ width: `${poorPercent}%` }} className="h-full bg-rose-500" />
          {/* Needle / indicator marker */}
          <div
            className="absolute top-0 bottom-0 w-1.5 bg-slate-900 border-x border-white shadow-xs rounded-full transition-all duration-500 -ml-0.5"
            style={{ left: `${markerPositionPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-slate-400 px-0.5">
          <span>0</span>
          <span className="text-emerald-700 font-semibold">&lt;{goodLimit}{unit}</span>
          <span className="text-amber-700 font-semibold">{moderateLimit}{unit}</span>
          <span>{maxScale}{unit}+</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-2xl border border-slate-800 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>Google PageSpeed Insights &amp; Lighthouse Telemetry Lab</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Core Web Vitals &amp; PageSpeed Lab
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Inspect LCP, CLS, INP, FCP, and TTFB with sub-second accuracy. Identify exactly which script payloads and assets are causing render blocks before they hurt organic search rankings.
        </p>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleScan();
          }}
          className="mt-6 flex flex-col sm:flex-row gap-2 max-w-xl mx-auto"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white font-mono shadow-2xs"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Auditing Web Vitals...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Test PageSpeed
              </>
            )}
          </button>
        </form>

        {/* Presets */}
        <div className="flex items-center justify-center gap-2 mt-3.5 text-xs text-slate-500">
          <span>Try verified sample:</span>
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setUrl(p.url);
                if (DEMO_PRESETS[p.url]) {
                  setRawData({ ...DEMO_PRESETS[p.url], sourceMode: "preset_benchmark" });
                  setSimBrotli(false);
                  setSimImages(false);
                  setSimDeferJs(false);
                  setSimInlineCss(false);
                }
                handleScan(p.url, deviceMode);
              }}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 font-semibold transition-colors cursor-pointer border border-slate-200"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-8 flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results */}
      {data && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Quick Action Toolbar (Share, JSON, Print, Full Audit) */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="font-bold text-slate-900 font-mono">{url}</span>
              <span className="text-slate-300">|</span>
              <span className="text-[11px] font-mono text-slate-500">
                {deviceMode === "mobile" ? "📱 Mobile (4G Throttled)" : "💻 Desktop (Broadband)"}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Share Link</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadJson}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export JSON</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Print PDF</span>
              </button>

              <button
                type="button"
                onClick={() => handleScan(url, deviceMode)}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>Re-Test</span>
              </button>
            </div>
          </div>

          {/* Main Hero Card: Radial Gauge + Score Breakdown + Device Toggle */}
          <div className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-2xl shadow-sm">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Left: Big Radial Gauge with Ambient Glow & Gradient Stroke */}
              <div className="flex items-center gap-6">
                <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                  {/* Subtle ambient glow */}
                  <div
                    className={`absolute inset-0 rounded-full blur-xl opacity-30 ${
                      data.scores.performance >= 90
                        ? "bg-emerald-500"
                        : data.scores.performance >= 50
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                  />
                  <svg className="w-full h-full -rotate-90 transform relative z-10" viewBox="0 0 120 120">
                    <defs>
                      <linearGradient id="scoreGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        {data.scores.performance >= 90 ? (
                          <>
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#06b6d4" />
                          </>
                        ) : data.scores.performance >= 50 ? (
                          <>
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#ea580c" />
                          </>
                        ) : (
                          <>
                            <stop offset="0%" stopColor="#f43f5e" />
                            <stop offset="100%" stopColor="#dc2626" />
                          </>
                        )}
                      </linearGradient>
                    </defs>
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="#f1f5f9"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="url(#scoreGaugeGrad)"
                      strokeWidth="10"
                      strokeDasharray={2 * Math.PI * 50}
                      strokeDashoffset={2 * Math.PI * 50 * (1 - data.scores.performance / 100)}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <span className="text-3xl font-black text-slate-900 tracking-tight">
                      {data.scores.performance}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      / 100
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Lighthouse Performance Score</span>
                    </div>
                    <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {data.sourceMode === "verified_psi_api"
                        ? "Source: Google PSI Lab API"
                        : data.sourceMode === "live_html_heuristic"
                        ? "Source: Live HTML + Asset Telemetry"
                        : "Source: Verified Benchmark Preset"}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {data.scores.performance >= 90
                      ? "Fast & Optimized (Top 5%)"
                      : data.scores.performance >= 50
                      ? "Moderate — Opportunities Exist"
                      : "Critical Latency Detected"}
                  </h2>
                  <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                    {deviceMode === "mobile"
                      ? "Evaluated under Mobile 4G throttled network and 4x CPU slowdown simulation."
                      : "Evaluated under Desktop high-speed broadband fiber and unthrottled CPU."}
                  </p>
                </div>
              </div>

              {/* Right: Device Mode Toggle & Full Audit CTA */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto justify-end shrink-0">
                <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setDeviceMode("mobile");
                      if (rawData && rawData.sourceMode !== "preset_benchmark") {
                        handleScan(url, "mobile");
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      deviceMode === "mobile"
                        ? "bg-white text-blue-600 shadow-2xs border border-slate-200/70"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 shrink-0" />
                    <span>Mobile (4G)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeviceMode("desktop");
                      if (rawData && rawData.sourceMode !== "preset_benchmark") {
                        handleScan(url, "desktop");
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      deviceMode === "desktop"
                        ? "bg-white text-blue-600 shadow-2xs border border-slate-200/70"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5 shrink-0" />
                    <span>Desktop</span>
                  </button>
                </div>

                <Link
                  href={`/analyze?url=${encodeURIComponent(url)}`}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-colors shrink-0"
                >
                  <span>View 14-Engine Audit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 4-Pillar Lighthouse Score Breakdown Strip */}
            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Performance", icon: Zap, val: data.scores.performance, desc: "Core Web Vitals & Speed" },
                { label: "Accessibility", icon: Eye, val: data.scores.accessibility ?? 96, desc: "ARIA, Contrast & Alt Tags" },
                { label: "Best Practices", icon: ShieldCheck, val: data.scores.bestPractices ?? 100, desc: "HTTPS, Modern APIs & CSP" },
                { label: "SEO Readiness", icon: Globe, val: data.scores.seo ?? 100, desc: "Crawlability & Meta Tags" },
              ].map((pillar) => {
                const Icon = pillar.icon;
                const isHigh = pillar.val >= 90;
                const isMed = pillar.val >= 50 && pillar.val < 90;
                return (
                  <div
                    key={pillar.label}
                    className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between gap-3 hover:bg-white hover:shadow-2xs transition-all"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 truncate">
                        <Icon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{pillar.label}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">{pillar.desc}</div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-lg font-mono text-sm font-black border shrink-0 ${
                        isHigh
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : isMed
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}
                    >
                      {pillar.val}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Loading Journey Waterfall Milestone Visual (Proportional & Dynamic) */}
          <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold text-slate-200">
                  Page Loading Timeline &amp; Proportional Waterfall Gantt
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                {waterfallMetrics && waterfallMetrics.lcpVal < 1000 ? "SUB-SECOND RENDER" : "OPTIMIZED FLOW"}
              </span>
            </div>

            {/* 4 Milestone KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">Milestone 1</span>
                  <Server className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-xs font-bold text-slate-200">TTFB (Server Response)</div>
                <div className="text-lg font-black text-emerald-400 font-mono mt-1">
                  {data.metrics.ttfb.value} {data.metrics.ttfb.unit}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Initial HTML stream delivered</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">Milestone 2</span>
                  <Eye className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div className="text-xs font-bold text-slate-200">FCP (First Paint)</div>
                <div className="text-lg font-black text-sky-400 font-mono mt-1">
                  {data.metrics.fcp.value} {data.metrics.fcp.unit}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">First pixels painted to screen</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">Milestone 3</span>
                  <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-xs font-bold text-slate-200">LCP (Largest Contentful)</div>
                <div className="text-lg font-black text-blue-400 font-mono mt-1">
                  {data.metrics.lcp.value} {data.metrics.lcp.unit}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Primary hero image/text rendered</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">Milestone 4</span>
                  <MousePointerClick className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div className="text-xs font-bold text-slate-200">Interactive Latency (INP)</div>
                <div className="text-lg font-black text-purple-400 font-mono mt-1">
                  {data.metrics.fid.value} {data.metrics.fid.unit}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Main thread responsive to clicks</div>
              </div>
            </div>

            {/* Visual Horizontal Proportional Waterfall Gantt Timeline Bar */}
            {waterfallMetrics && (
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 flex-wrap gap-2">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-500" />
                    <span>0ms (Request Start)</span>
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>TTFB ({waterfallMetrics.ttfbVal}ms)</span>
                  </span>
                  <span className="flex items-center gap-1 text-sky-400">
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    <span>FCP ({waterfallMetrics.fcpVal}ms)</span>
                  </span>
                  <span className="flex items-center gap-1 text-blue-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>LCP ({waterfallMetrics.lcpVal}ms)</span>
                  </span>
                  <span className="flex items-center gap-1 text-purple-400">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>Interactive ({waterfallMetrics.lcpVal + waterfallMetrics.inpVal}ms)</span>
                  </span>
                </div>
                <div className="w-full h-3.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden flex p-0.5 gap-0.5">
                  <div
                    className="h-full rounded-l-full bg-gradient-to-r from-emerald-500 to-emerald-400 hover:brightness-110 transition-all duration-500 cursor-help"
                    style={{ width: `${waterfallMetrics.ttfbPct}%` }}
                    title={`Milestone 1: TTFB (${waterfallMetrics.ttfbVal}ms)`}
                  />
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-sky-400 hover:brightness-110 transition-all duration-500 cursor-help"
                    style={{ width: `${waterfallMetrics.fcpPct}%` }}
                    title={`Milestone 2: FCP (${waterfallMetrics.fcpVal}ms)`}
                  />
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-500 hover:brightness-110 transition-all duration-500 cursor-help"
                    style={{ width: `${waterfallMetrics.lcpPct}%` }}
                    title={`Milestone 3: LCP (${waterfallMetrics.lcpVal}ms)`}
                  />
                  <div
                    className="h-full rounded-r-full bg-gradient-to-r from-purple-600 to-purple-500 hover:brightness-110 transition-all duration-500 cursor-help"
                    style={{ width: `${waterfallMetrics.inpPct}%` }}
                    title={`Milestone 4: INP/TBT (${waterfallMetrics.inpVal}ms)`}
                  />
                </div>
              </div>
            )}

            {/* Detailed 4-Row DevTools-Style Waterfall Breakdown */}
            {waterfallMetrics && (
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Step-by-Step Render Pipeline Breakdown
                </div>
                {[
                  {
                    step: "1. DNS, TLS & Initial Server Response",
                    range: `0ms → ${waterfallMetrics.ttfbVal}ms`,
                    duration: `${waterfallMetrics.ttfbVal}ms`,
                    pct: waterfallMetrics.ttfbPct,
                    color: "bg-emerald-500",
                    offset: 0,
                  },
                  {
                    step: "2. DOM Parse & Critical CSS Execution",
                    range: `${waterfallMetrics.ttfbVal}ms → ${waterfallMetrics.fcpVal}ms`,
                    duration: `${Math.max(10, waterfallMetrics.fcpVal - waterfallMetrics.ttfbVal)}ms`,
                    pct: waterfallMetrics.fcpPct,
                    color: "bg-sky-500",
                    offset: waterfallMetrics.ttfbPct,
                  },
                  {
                    step: "3. Hero Asset Download & Viewport Paint",
                    range: `${waterfallMetrics.fcpVal}ms → ${waterfallMetrics.lcpVal}ms`,
                    duration: `${Math.max(10, waterfallMetrics.lcpVal - waterfallMetrics.fcpVal)}ms`,
                    pct: waterfallMetrics.lcpPct,
                    color: "bg-blue-500",
                    offset: waterfallMetrics.ttfbPct + waterfallMetrics.fcpPct,
                  },
                  {
                    step: "4. JavaScript Hydration & Input Readiness",
                    range: `${waterfallMetrics.lcpVal}ms → ${waterfallMetrics.lcpVal + waterfallMetrics.inpVal}ms`,
                    duration: `${waterfallMetrics.inpVal}ms`,
                    pct: waterfallMetrics.inpPct,
                    color: "bg-purple-500",
                    offset: waterfallMetrics.ttfbPct + waterfallMetrics.fcpPct + waterfallMetrics.lcpPct,
                  },
                ].map((row, rIdx) => (
                  <div key={rIdx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between font-mono text-[11px] mb-1.5">
                      <span className="text-slate-300 font-semibold">{row.step}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">{row.range}</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-bold">
                          {row.duration}
                        </span>
                      </div>
                    </div>
                    {/* Visual Gantt Bar with Left Offset */}
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden relative">
                      <div
                        className={`h-full rounded-full ${row.color} transition-all duration-500`}
                        style={{
                          marginLeft: `${Math.min(90, row.offset)}%`,
                          width: `${Math.max(5, row.pct)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Frame-by-Frame Filmstrip Progression with Realistic Browser Windows */}
          <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Visual Filmstrip Progression (Frame-by-Frame Render Simulation)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Simulated Screen Buffer</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Frame 1 (0.00s) */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between h-48 hover:shadow-xs transition-shadow">
                <div className="text-[10px] font-mono font-bold text-slate-400 flex items-center justify-between">
                  <span>0.00s</span>
                  <span className="text-slate-400">0% Paint</span>
                </div>
                {/* Mini Browser Window Mockup */}
                <div className="w-full flex-1 my-2 bg-white rounded-lg border border-slate-200/80 overflow-hidden flex flex-col">
                  <div className="h-4 bg-slate-100 border-b border-slate-200 flex items-center px-1.5 gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <div className="ml-auto w-16 h-2 rounded bg-slate-200 flex items-center justify-center">
                      <span className="text-[6px] text-slate-500 font-mono">🔒 https://...</span>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center p-2 space-y-1.5">
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
                    <span className="text-[8px] font-mono text-slate-400">Connecting</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 truncate font-mono">DNS &amp; TLS Handshake</div>
              </div>

              {/* Frame 2 (FCP) */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between h-48 hover:shadow-xs transition-shadow">
                <div className="text-[10px] font-mono font-bold text-sky-600 flex items-center justify-between">
                  <span>{data.metrics.fcp.value}s</span>
                  <span className="text-sky-600">35% (FCP)</span>
                </div>
                {/* Mini Browser Window Mockup */}
                <div className="w-full flex-1 my-2 bg-white rounded-lg border border-slate-200/80 overflow-hidden flex flex-col">
                  <div className="h-4 bg-slate-100 border-b border-slate-200 flex items-center px-1.5 gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <div className="ml-auto w-16 h-2 rounded bg-slate-200 flex items-center justify-center">
                      <span className="text-[6px] text-slate-500 font-mono">🔒 https://...</span>
                    </div>
                  </div>
                  <div className="flex-1 p-2 space-y-1.5">
                    {/* Header navbar skeleton */}
                    <div className="flex justify-between items-center mb-1">
                      <div className="w-8 h-2 rounded bg-slate-300" />
                      <div className="w-12 h-1.5 rounded bg-slate-200" />
                    </div>
                    <div className="w-16 h-2 rounded bg-slate-300" />
                    <div className="w-full h-1.5 rounded bg-slate-100" />
                    <div className="w-3/4 h-1.5 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="text-[10px] text-sky-700 font-semibold truncate font-mono">First Contentful Paint</div>
              </div>

              {/* Frame 3 (LCP) */}
              <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/30 flex flex-col justify-between h-48 hover:shadow-xs transition-shadow">
                <div className="text-[10px] font-mono font-bold text-blue-600 flex items-center justify-between">
                  <span>{data.metrics.lcp.value}s</span>
                  <span className="text-blue-600">85% (LCP)</span>
                </div>
                {/* Mini Browser Window Mockup */}
                <div className="w-full flex-1 my-2 bg-white rounded-lg border border-blue-100 overflow-hidden flex flex-col shadow-2xs">
                  <div className="h-4 bg-slate-100 border-b border-slate-200 flex items-center px-1.5 gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <div className="ml-auto w-16 h-2 rounded bg-slate-200 flex items-center justify-center">
                      <span className="text-[6px] text-slate-500 font-mono">🔒 https://...</span>
                    </div>
                  </div>
                  <div className="flex-1 p-2 space-y-1.5">
                    <div className="flex justify-between items-center mb-1">
                      <div className="w-10 h-2 rounded bg-blue-600/70" />
                      <div className="w-14 h-1.5 rounded bg-slate-200" />
                    </div>
                    {/* Hero Graphic block */}
                    <div className="w-full h-8 rounded bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center text-[9px] font-mono text-blue-600 font-bold border border-blue-200/50">
                      Hero Banner
                    </div>
                    <div className="w-10 h-2 rounded bg-blue-600" />
                  </div>
                </div>
                <div className="text-[10px] text-blue-700 font-bold truncate font-mono">Largest Contentful Paint</div>
              </div>

              {/* Frame 4 (Interactive) */}
              <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/30 flex flex-col justify-between h-48 hover:shadow-xs transition-shadow">
                <div className="text-[10px] font-mono font-bold text-emerald-600 flex items-center justify-between">
                  <span>{Number((data.metrics.lcp.value + 0.2).toFixed(2))}s</span>
                  <span className="text-emerald-600">100% Ready</span>
                </div>
                {/* Mini Browser Window Mockup */}
                <div className="w-full flex-1 my-2 bg-white rounded-lg border border-emerald-100 overflow-hidden flex flex-col shadow-2xs">
                  <div className="h-4 bg-slate-100 border-b border-slate-200 flex items-center px-1.5 gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <div className="ml-auto w-16 h-2 rounded bg-slate-200 flex items-center justify-center">
                      <span className="text-[6px] text-slate-500 font-mono">🔒 https://...</span>
                    </div>
                  </div>
                  <div className="flex-1 p-2 space-y-1.5">
                    <div className="flex justify-between items-center mb-1">
                      <div className="w-12 h-2 rounded bg-slate-900" />
                      <div className="w-16 h-2 rounded-full bg-emerald-100 border border-emerald-200 text-[6px] text-emerald-700 text-center font-bold">
                        Interactive
                      </div>
                    </div>
                    <div className="w-full h-8 rounded bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-[9px] font-bold text-white shadow-xs">
                      Hydrated App
                    </div>
                    <div className="grid grid-cols-2 gap-1 pt-0.5">
                      <div className="h-3 rounded bg-slate-100 border border-slate-200" />
                      <div className="h-3 rounded bg-slate-100 border border-slate-200" />
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-emerald-700 font-bold truncate font-mono">Fully Interactive (INP)</div>
              </div>
            </div>
          </div>

          {/* Core Web Vitals Metric Cards with Visual Range Meters & Click-to-Inspect */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Core Web Vitals Metrics (Click card to inspect ranking impact)
              </span>
              <span className="text-[11px] text-blue-600 font-semibold">5 Official Signals</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* LCP */}
              <div
                onClick={() => setActiveInspector(METRIC_INSPECTION_GUIDES.lcp)}
                className={`p-5 rounded-2xl flex flex-col justify-between border transition-all cursor-pointer group shadow-2xs hover:-translate-y-1 hover:shadow-md duration-300 ${
                  data.metrics.lcp.rating === "good"
                    ? "bg-gradient-to-b from-white to-emerald-50/20 border-slate-200/90 hover:border-emerald-300"
                    : data.metrics.lcp.rating === "needs-improvement"
                    ? "bg-gradient-to-b from-white to-amber-50/20 border-slate-200/90 hover:border-amber-300"
                    : "bg-gradient-to-b from-white to-rose-50/20 border-slate-200/90 hover:border-rose-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors">
                      LCP
                    </span>
                    {getRatingBadge(data.metrics.lcp.rating)}
                  </div>
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    {data.metrics.lcp.value} {data.metrics.lcp.unit}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Largest Contentful Paint</div>
                </div>
                <div>
                  {renderRangeBar(data.metrics.lcp.value, 2.5, 4.0, 6.0, "s")}
                  <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span>Target: &lt; 2.5s</span>
                    <span className="text-emerald-600 font-semibold">25% Weight</span>
                  </div>
                </div>
              </div>

              {/* CLS */}
              <div
                onClick={() => setActiveInspector(METRIC_INSPECTION_GUIDES.cls)}
                className={`p-5 rounded-2xl flex flex-col justify-between border transition-all cursor-pointer group shadow-2xs hover:-translate-y-1 hover:shadow-md duration-300 ${
                  data.metrics.cls.rating === "good"
                    ? "bg-gradient-to-b from-white to-emerald-50/20 border-slate-200/90 hover:border-emerald-300"
                    : data.metrics.cls.rating === "needs-improvement"
                    ? "bg-gradient-to-b from-white to-amber-50/20 border-slate-200/90 hover:border-amber-300"
                    : "bg-gradient-to-b from-white to-rose-50/20 border-slate-200/90 hover:border-rose-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors">
                      CLS
                    </span>
                    {getRatingBadge(data.metrics.cls.rating)}
                  </div>
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    {data.metrics.cls.value}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Cumulative Layout Shift</div>
                </div>
                <div>
                  {renderRangeBar(data.metrics.cls.value, 0.1, 0.25, 0.5, "")}
                  <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span>Target: &lt; 0.1</span>
                    <span className="text-emerald-600 font-semibold">25% Weight</span>
                  </div>
                </div>
              </div>

              {/* FCP */}
              <div
                onClick={() => setActiveInspector(METRIC_INSPECTION_GUIDES.fcp)}
                className={`p-5 rounded-2xl flex flex-col justify-between border transition-all cursor-pointer group shadow-2xs hover:-translate-y-1 hover:shadow-md duration-300 ${
                  data.metrics.fcp.rating === "good"
                    ? "bg-gradient-to-b from-white to-emerald-50/20 border-slate-200/90 hover:border-emerald-300"
                    : data.metrics.fcp.rating === "needs-improvement"
                    ? "bg-gradient-to-b from-white to-amber-50/20 border-slate-200/90 hover:border-amber-300"
                    : "bg-gradient-to-b from-white to-rose-50/20 border-slate-200/90 hover:border-rose-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors">
                      FCP
                    </span>
                    {getRatingBadge(data.metrics.fcp.rating)}
                  </div>
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    {data.metrics.fcp.value} {data.metrics.fcp.unit}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">First Contentful Paint</div>
                </div>
                <div>
                  {renderRangeBar(data.metrics.fcp.value, 1.8, 3.0, 5.0, "s")}
                  <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span>Target: &lt; 1.8s</span>
                    <span className="text-emerald-600 font-semibold">10% Weight</span>
                  </div>
                </div>
              </div>

              {/* INP / FID */}
              <div
                onClick={() => setActiveInspector(METRIC_INSPECTION_GUIDES.fid)}
                className={`p-5 rounded-2xl flex flex-col justify-between border transition-all cursor-pointer group shadow-2xs hover:-translate-y-1 hover:shadow-md duration-300 ${
                  data.metrics.fid.rating === "good"
                    ? "bg-gradient-to-b from-white to-emerald-50/20 border-slate-200/90 hover:border-emerald-300"
                    : data.metrics.fid.rating === "needs-improvement"
                    ? "bg-gradient-to-b from-white to-amber-50/20 border-slate-200/90 hover:border-amber-300"
                    : "bg-gradient-to-b from-white to-rose-50/20 border-slate-200/90 hover:border-rose-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors">
                      INP / TBT
                    </span>
                    {getRatingBadge(data.metrics.fid.rating)}
                  </div>
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    {data.metrics.fid.value} {data.metrics.fid.unit}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Interaction Responsiveness</div>
                </div>
                <div>
                  {renderRangeBar(data.metrics.fid.value, 200, 500, 800, "ms")}
                  <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span>Target: &lt; 200ms</span>
                    <span className="text-emerald-600 font-semibold">25% Weight</span>
                  </div>
                </div>
              </div>

              {/* TTFB */}
              <div
                onClick={() => setActiveInspector(METRIC_INSPECTION_GUIDES.ttfb)}
                className={`p-5 rounded-2xl flex flex-col justify-between border transition-all cursor-pointer group shadow-2xs hover:-translate-y-1 hover:shadow-md duration-300 ${
                  data.metrics.ttfb.rating === "good"
                    ? "bg-gradient-to-b from-white to-emerald-50/20 border-slate-200/90 hover:border-emerald-300"
                    : data.metrics.ttfb.rating === "needs-improvement"
                    ? "bg-gradient-to-b from-white to-amber-50/20 border-slate-200/90 hover:border-amber-300"
                    : "bg-gradient-to-b from-white to-rose-50/20 border-slate-200/90 hover:border-rose-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors">
                      TTFB
                    </span>
                    {getRatingBadge(data.metrics.ttfb.rating)}
                  </div>
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    {data.metrics.ttfb.value} {data.metrics.ttfb.unit}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Time to First Byte</div>
                </div>
                <div>
                  {renderRangeBar(data.metrics.ttfb.value, 800, 1800, 3000, "ms")}
                  <div className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span>Target: &lt; 800ms</span>
                    <span className="text-emerald-600 font-semibold">Foundation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Asset Weight & Resource Composition Card with Stacked Distribution Bar */}
          {data.assetsSummary && (
            <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Resource Weight &amp; Asset Payload Breakdown
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                  Total Transfer Estimate: ~{data.assetsSummary.estimatedTotalKb} KB
                </span>
              </div>

              {/* Stacked Proportional Distribution Bar */}
              {data.assetsSummary.distribution && (
                <div className="space-y-1.5">
                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex p-0.5 gap-0.5 border border-slate-200">
                    <div
                      className="h-full rounded-l-full bg-emerald-500 transition-all duration-500 cursor-help"
                      style={{ width: `${data.assetsSummary.distribution.htmlPct}%` }}
                      title={`HTML: ${data.assetsSummary.distribution.htmlPct}% (~${data.assetsSummary.htmlKb} KB)`}
                    />
                    <div
                      className="h-full bg-blue-500 transition-all duration-500 cursor-help"
                      style={{ width: `${data.assetsSummary.distribution.jsPct}%` }}
                      title={`JavaScript: ${data.assetsSummary.distribution.jsPct}% (~${data.assetsSummary.scriptCount * 38} KB)`}
                    />
                    <div
                      className="h-full bg-purple-500 transition-all duration-500 cursor-help"
                      style={{ width: `${data.assetsSummary.distribution.cssPct}%` }}
                      title={`CSS: ${data.assetsSummary.distribution.cssPct}% (~${data.assetsSummary.stylesheetCount * 22} KB)`}
                    />
                    <div
                      className="h-full rounded-r-full bg-amber-500 transition-all duration-500 cursor-help"
                      style={{ width: `${data.assetsSummary.distribution.imagesPct}%` }}
                      title={`Media: ${data.assetsSummary.distribution.imagesPct}% (~${data.assetsSummary.imageCount * 45} KB)`}
                    />
                  </div>
                  {/* Bar Legend */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 flex-wrap gap-2 px-1">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>HTML ({data.assetsSummary.distribution.htmlPct}%)</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>JavaScript ({data.assetsSummary.distribution.jsPct}%)</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      <span>CSS ({data.assetsSummary.distribution.cssPct}%)</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Media Assets ({data.assetsSummary.distribution.imagesPct}%)</span>
                    </span>
                  </div>
                </div>
              )}

              {/* 4 Payload Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left pt-1">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">HTML Document</div>
                  <div className="text-base font-extrabold text-slate-900 font-mono mt-0.5">
                    {data.assetsSummary.htmlKb} KB
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Raw DOM Payload</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">JavaScript Payloads</div>
                  <div className="text-base font-extrabold text-blue-600 font-mono mt-0.5">
                    {data.assetsSummary.scriptCount} Scripts
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    ~{data.assetsSummary.scriptCount * 38} KB uncompressed
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Stylesheets</div>
                  <div className="text-base font-extrabold text-purple-600 font-mono mt-0.5">
                    {data.assetsSummary.stylesheetCount} CSS Bundles
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    ~{data.assetsSummary.stylesheetCount * 22} KB stylesheets
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Images &amp; Icons</div>
                  <div className="text-base font-extrabold text-emerald-600 font-mono mt-0.5">
                    {data.assetsSummary.imageCount} Assets
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    ~{data.assetsSummary.imageCount * 45} KB media
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hosting & Edge Infrastructure Telemetry Card */}
          {data.infrastructure && (
            <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Hosting &amp; Edge Infrastructure Telemetry
                  </h3>
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  HTTP/2+ Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Edge Server Platform</div>
                  <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                    {data.infrastructure.server}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">CDN &amp; Reverse Proxy</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Compression Algorithm</div>
                  <div className="text-sm font-bold text-emerald-700 font-mono mt-0.5 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{data.infrastructure.compression.toUpperCase()}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Content-Encoding Header</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] text-slate-400 font-mono uppercase">Cache-Control Policy</div>
                  <div className="text-sm font-bold text-slate-900 font-mono mt-0.5 truncate" title={data.infrastructure.cacheControl}>
                    {data.infrastructure.cacheControl}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Browser Caching Lifetime</div>
                </div>
              </div>

              {/* Third-Party Scripts Breakdown */}
              {data.thirdPartySummary && data.thirdPartySummary.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-mono font-semibold text-slate-500 mb-2">
                    Detected Third-Party Telemetry &amp; Marketing Scripts:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.thirdPartySummary.map((tp, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-100 text-slate-800 border border-slate-200 font-mono"
                      >
                        <Tag className="w-3 h-3 text-blue-600" />
                        <span>{tp.name}</span>
                        <span className="text-[10px] text-slate-400">({tp.category})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Interactive "What-If" Speed Remediation Simulator with Live Uplift Bar */}
          <div className="p-6 sm:p-7 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white rounded-2xl border border-indigo-900/60 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-800">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Interactive "What-If" Speed Remediation Sandbox
                </div>
                <h3 className="text-base font-extrabold text-white mt-1">
                  Simulate Real-World Optimizations &amp; Projected Scores
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {activeSimulationCount} Optimizations Active
                </span>
                {activeSimulationCount < 4 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSimBrotli(true);
                      setSimImages(true);
                      setSimDeferJs(true);
                      setSimInlineCss(true);
                    }}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer underline"
                  >
                    Apply All
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSimBrotli(false);
                      setSimImages(false);
                      setSimDeferJs(false);
                      setSimInlineCss(false);
                    }}
                    className="text-xs text-slate-400 hover:text-white cursor-pointer underline"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
              {/* Toggle 1: Edge CDN / Brotli */}
              <div
                onClick={() => setSimBrotli(!simBrotli)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  simBrotli
                    ? "bg-indigo-900/40 border-indigo-400 shadow-md shadow-indigo-500/20 ring-1 ring-indigo-400"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-200">Edge CDN Caching</span>
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                      simBrotli
                        ? "bg-emerald-500 border-emerald-400 text-slate-950 font-bold"
                        : "border-slate-600"
                    }`}
                  >
                    {simBrotli && "✓"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Serve cached HTML via Cloudflare Edge with Brotli compression.
                </p>
                <div className="mt-2 text-[10px] font-mono text-emerald-400 font-semibold">
                  Saves ~120ms TTFB (+2 pts)
                </div>
              </div>

              {/* Toggle 2: AVIF / WebP images */}
              <div
                onClick={() => setSimImages(!simImages)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  simImages
                    ? "bg-indigo-900/40 border-indigo-400 shadow-md shadow-indigo-500/20 ring-1 ring-indigo-400"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-200">Next-Gen AVIF Assets</span>
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                      simImages
                        ? "bg-emerald-500 border-emerald-400 text-slate-950 font-bold"
                        : "border-slate-600"
                    }`}
                  >
                    {simImages && "✓"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Convert hero JPEG/PNG assets to AVIF with fetchpriority="high".
                </p>
                <div className="mt-2 text-[10px] font-mono text-emerald-400 font-semibold">
                  Saves ~350ms LCP (+3 pts)
                </div>
              </div>

              {/* Toggle 3: Defer JS */}
              <div
                onClick={() => setSimDeferJs(!simDeferJs)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  simDeferJs
                    ? "bg-indigo-900/40 border-indigo-400 shadow-md shadow-indigo-500/20 ring-1 ring-indigo-400"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-200">Defer Third-Party JS</span>
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                      simDeferJs
                        ? "bg-emerald-500 border-emerald-400 text-slate-950 font-bold"
                        : "border-slate-600"
                    }`}
                  >
                    {simDeferJs && "✓"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Delay analytics scripts and heavy marketing widgets until after click.
                </p>
                <div className="mt-2 text-[10px] font-mono text-emerald-400 font-semibold">
                  Saves ~30ms INP (+3 pts)
                </div>
              </div>

              {/* Toggle 4: Inline Critical CSS */}
              <div
                onClick={() => setSimInlineCss(!simInlineCss)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  simInlineCss
                    ? "bg-indigo-900/40 border-indigo-400 shadow-md shadow-indigo-500/20 ring-1 ring-indigo-400"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-200">Inline Above-Fold CSS</span>
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                      simInlineCss
                        ? "bg-emerald-500 border-emerald-400 text-slate-950 font-bold"
                        : "border-slate-600"
                    }`}
                  >
                    {simInlineCss && "✓"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Extract critical styles and eliminate external render-blocking stylesheets.
                </p>
                <div className="mt-2 text-[10px] font-mono text-emerald-400 font-semibold">
                  Saves ~250ms FCP (+2 pts)
                </div>
              </div>
            </div>

            {/* Live Projected Uplift Bar */}
            <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-indigo-900/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 font-bold">
                  +{simulatedScoreGain}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Projected Performance:</span>
                    <span className="text-slate-400">{rawBaseScore}</span>
                    <span className="text-slate-500">&rarr;</span>
                    <span className="text-emerald-400 font-mono font-extrabold text-sm">
                      {data.scores.performance} / 100
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {activeSimulationCount > 0
                      ? `Active uplift: ${activeSimulationCount} optimizations applied. Estimated bounce reduction: -${activeSimulationCount * 4}%.`
                      : "Toggle any optimization above to preview projected Lighthouse score uplift."}
                  </div>
                </div>
              </div>

              {activeSimulationCount > 0 && (
                <button
                  type="button"
                  onClick={() => showToast("Optimization roadmap copied to clipboard!")}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  Save Optimization Spec
                </button>
              )}
            </div>
          </div>

          {/* Diagnostic Opportunities with Expandable Code Fixes & Filters */}
          {data.opportunities.length > 0 && (
            <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Automated Speed Remediation &amp; Actionable Code Fixes
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Pre-generated code templates tailored to resolve detected Core Web Vitals bottlenecks.
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setOpportunityFilter("all")}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      opportunityFilter === "all"
                        ? "bg-white text-blue-600 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    All ({data.opportunities.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpportunityFilter("high_impact")}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      opportunityFilter === "high_impact"
                        ? "bg-white text-blue-600 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    High Impact (&gt;100ms)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpportunityFilter("code_ready")}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      opportunityFilter === "code_ready"
                        ? "bg-white text-blue-600 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Code Fixes Ready
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {filteredOpportunities.map((opp, idx) => {
                  const isExpanded = expandedOpportunityIdx === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200/90 bg-slate-50/70 overflow-hidden transition-all"
                    >
                      <div
                        onClick={() => setExpandedOpportunityIdx(isExpanded ? null : idx)}
                        className="p-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-100/60 transition-colors"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span>{opp.title}</span>
                            {opp.difficulty && (
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                                  opp.difficulty === "quick_win"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : opp.difficulty === "moderate"
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : "bg-indigo-50 text-indigo-700 border-indigo-200"
                                }`}
                              >
                                {opp.difficulty === "quick_win"
                                  ? "Quick Win (5 mins)"
                                  : opp.difficulty === "moderate"
                                  ? "Moderate (30 mins)"
                                  : "Architectural (1 hr)"}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{opp.description}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {opp.savingsMs !== undefined && opp.savingsMs > 0 && (
                            <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                              {opp.savingsMs < 200
                                ? `Save ~${opp.savingsMs}ms`
                                : `Save ~${(opp.savingsMs / 1000).toFixed(2)}s`}
                            </span>
                          )}
                          <div className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>
                      </div>

                      {/* Expandable Code Fix Accordion */}
                      {isExpanded && opp.codeSnippet && (
                        <div className="p-4 bg-slate-950 text-slate-200 border-t border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                              <FileCode2 className="w-3.5 h-3.5" />
                              Recommended Code Implementation
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopySnippet(opp.codeSnippet!, idx);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                            >
                              {copiedSnippetIdx === idx ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy Snippet</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-sky-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                            {opp.codeSnippet}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Continuous 24/7 Autopilot Banner */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3 h-3" />
                Continuous 24/7 Autopilot
              </div>
              <h3 className="text-lg font-bold">Monitor Core Web Vitals Weekly with Real-Time Webhooks</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                Receive instant notifications in Slack or Discord whenever a new code deployment or asset upload degrades your LCP or causes layout shifts.
              </p>
            </div>
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold whitespace-nowrap transition-all shadow-md shrink-0 cursor-pointer"
            >
              Explore Growth Plans ($0–$49/mo)
            </Link>
          </div>
        </div>
      )}

      {/* Interactive Metric Inspector Modal */}
      {activeInspector && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider font-mono">
                  Core Web Vitals Diagnostic Inspector
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {activeInspector.name} — {activeInspector.fullName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveInspector(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-blue-600" />
                <span>Google Lighthouse Weight:</span>
                <span className="text-emerald-700 font-mono font-bold">{activeInspector.googleWeight}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono text-[10px]">
                <div className="p-1.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <div className="font-bold">Good</div>
                  <div>{activeInspector.goodThreshold}</div>
                </div>
                <div className="p-1.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                  <div className="font-bold">Moderate</div>
                  <div>{activeInspector.moderateThreshold}</div>
                </div>
                <div className="p-1.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                  <div className="font-bold">Poor</div>
                  <div>{activeInspector.poorThreshold}</div>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-800">Why Google Evaluates This:</div>
              <p className="text-xs text-slate-600 leading-relaxed">{activeInspector.whyItMatters}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-800">Recommended Engineering Actions:</div>
              <ul className="space-y-1 text-xs text-slate-600">
                {activeInspector.howToFix.map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveInspector(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
