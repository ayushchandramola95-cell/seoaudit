"use client";

import { useState, useMemo } from "react";
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
  PieChart,
  Search,
  Download,
  Copy,
  Check,
  Globe,
  Zap,
  Lock,
  CreditCard,
  Code2,
  Info,
  ChevronRight,
  Database,
  Terminal,
} from "lucide-react";
import { TechCategory } from "@/lib/modules/tech/detector";

interface TechItem {
  name: string;
  category: TechCategory;
  version: string | null;
  confidence: "High" | "Medium";
  evidence: string;
  website?: string;
  description?: string;
}

interface ScanData {
  url: string;
  domain: string;
  statusCode: number;
  responseTimeMs: number;
  totalTechnologies: number;
  rawHeadersCount?: number;
  architecture: {
    archetype: string;
    modernnessScore: number;
    performanceTier: string;
    securityPosture: string;
    hasWaf: boolean;
  };
  data: TechItem[];
}

export default function TechDetectorClient() {
  const [url, setUrl] = useState("https://vercel.com");
  const [loading, setLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [copiedToast, setCopiedToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initial Sample State (Vercel Stack)
  const [data, setData] = useState<ScanData | null>({
    url: "https://vercel.com",
    domain: "vercel.com",
    statusCode: 200,
    responseTimeMs: 38,
    totalTechnologies: 7,
    rawHeadersCount: 24,
    architecture: {
      archetype: "Modern Jamstack / Edge-Rendered",
      modernnessScore: 98,
      performanceTier: "Elite (Edge Anycast Accelerated)",
      securityPosture: "Enterprise Hardened (HSTS & WAF)",
      hasWaf: true,
    },
    data: [
      {
        name: "Next.js",
        category: "Frontend Framework",
        confidence: "High",
        version: "15.0",
        evidence: 'Script source: "/_next/static/chunks/app/layout.js"',
        website: "https://nextjs.org",
        description: "React framework for high-performance server-side rendering and static web apps.",
      },
      {
        name: "React",
        category: "Frontend Framework",
        confidence: "High",
        version: "19.0",
        evidence: 'Matched HTML signature pattern: /data-reactroot/i',
        website: "https://react.dev",
        description: "The core JavaScript library for building component-driven user interfaces.",
      },
      {
        name: "Tailwind CSS",
        category: "CSS & UI Framework",
        confidence: "High",
        version: null,
        evidence: 'Matched HTML class attributes: "flex items-center text-slate-900"',
        website: "https://tailwindcss.com",
        description: "Utility-first CSS framework for rapid modern UI development.",
      },
      {
        name: "Vercel",
        category: "CDN & Infrastructure",
        confidence: "High",
        version: null,
        evidence: 'HTTP header "server: Vercel"',
        website: "https://vercel.com",
        description: "Frontend cloud platform providing fast global serverless and edge deployment.",
      },
      {
        name: "Google Analytics 4 (GA4)",
        category: "Analytics & Telemetry",
        confidence: "High",
        version: null,
        evidence: 'Script source: "https://www.googletagmanager.com/gtag/js?id=G-..."',
        website: "https://analytics.google.com",
        description: "Google's next-generation event-based web and app analytics platform.",
      },
      {
        name: "Cloudflare DNS",
        category: "DNS & Cloud Services",
        confidence: "High",
        version: null,
        evidence: "NS record: ns1.cloudflare.com",
        website: "https://cloudflare.com",
        description: "Fast Anycast authoritative DNS service managed by Cloudflare.",
      },
      {
        name: "HSTS Enforced",
        category: "Security & Performance",
        confidence: "High",
        version: null,
        evidence: 'HTTP header "strict-transport-security: max-age=63072000; includeSubDomains; preload"',
        website: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security",
        description: "HTTP Strict Transport Security header forcing browsers to use HTTPS.",
      },
    ],
  });

  const presets = [
    { label: "Vercel", url: "https://vercel.com" },
    { label: "Shopify", url: "https://shopify.com" },
    { label: "Stripe", url: "https://stripe.com" },
    { label: "GitHub", url: "https://github.com" },
    { label: "Apple", url: "https://apple.com" },
    { label: "Airbnb", url: "https://airbnb.com" },
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
      showToast(`Detected ${json.totalTechnologies} technologies on ${json.domain}!`);
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to detect technologies.");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setCopiedToast(msg);
    setTimeout(() => setCopiedToast(null), 3000);
  };

  const copyJson = () => {
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    showToast("Copied technology stack JSON to clipboard!");
  };

  const downloadJson = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `tech-stack-${data.domain}.json`;
    a.click();
    URL.revokeObjectURL(blobUrl);
    showToast(`Downloaded tech-stack-${data.domain}.json`);
  };

  const downloadCsv = () => {
    if (!data) return;
    const headers = ["Name", "Category", "Confidence", "Version", "Evidence", "Website"];
    const rows = data.data.map((t) => [
      `"${t.name}"`,
      `"${t.category}"`,
      `"${t.confidence}"`,
      `"${t.version || ""}"`,
      `"${t.evidence.replace(/"/g, '""')}"`,
      `"${t.website || ""}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `tech-stack-${data.domain}.csv`;
    a.click();
    URL.revokeObjectURL(blobUrl);
    showToast(`Downloaded tech-stack-${data.domain}.csv`);
  };

  // Filtered Technologies
  const filteredTechs = useMemo(() => {
    if (!data) return [];
    return data.data.filter((t) => {
      const matchesCat =
        selectedCategory === "All" ||
        t.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesSearch =
        searchFilter.trim() === "" ||
        t.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        t.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchFilter.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [data, selectedCategory, searchFilter]);

  // Category counts
  const categoryCounts = useMemo(() => {
    if (!data) return {};
    const counts: Record<string, number> = { All: data.data.length };
    data.data.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, [data]);

  const categoriesList = [
    "All",
    "Frontend Framework",
    "CMS & Site Builder",
    "CSS & UI Framework",
    "CDN & Infrastructure",
    "Analytics & Telemetry",
    "E-Commerce & Payments",
    "Web Server & Gateway",
    "Marketing & Communication",
    "Security & Performance",
    "DNS & Cloud Services",
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Frontend Framework":
        return <Cpu className="w-4 h-4 text-blue-600" />;
      case "CMS & Site Builder":
        return <Layers className="w-4 h-4 text-purple-600" />;
      case "CSS & UI Framework":
        return <Code2 className="w-4 h-4 text-cyan-600" />;
      case "CDN & Infrastructure":
        return <Server className="w-4 h-4 text-indigo-600" />;
      case "Analytics & Telemetry":
        return <BarChart className="w-4 h-4 text-amber-600" />;
      case "E-Commerce & Payments":
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case "Web Server & Gateway":
        return <Terminal className="w-4 h-4 text-slate-700" />;
      case "Security & Performance":
        return <ShieldCheck className="w-4 h-4 text-rose-600" />;
      case "DNS & Cloud Services":
        return <Globe className="w-4 h-4 text-teal-600" />;
      default:
        return <Layers className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{copiedToast}</span>
        </div>
      )}

      {/* Sticky Docked Sub-Navbar */}
      {data && (
        <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-2.5 shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center border border-indigo-500/20 text-indigo-600 font-bold text-xs shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{data.domain}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {data.architecture.archetype}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {data.totalTechnologies} Technologies
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                  <span>Latency: {data.responseTimeMs}ms</span>
                  <span>•</span>
                  <span>HTTP {data.statusCode}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyJson}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Copy JSON</span>
              </button>

              <button
                onClick={downloadCsv}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>

              <Link
                href={`/analyze?url=${encodeURIComponent(data.url || `https://${data.domain}`)}`}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Full SEO Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            150+ Signature Deep Profiler &amp; Infrastructure Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Website Technology Stack Detector
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Uncover the frameworks, content management systems, analytics libraries, CDNs, and server engines powering any website with multi-tier DNS &amp; WAF-resilient detection.
          </p>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleScan();
            }}
            className="mt-6 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto"
          >
            <div className="relative flex-1">
              <input
                type="text"
                required
                placeholder="Enter URL to profile (e.g. https://yourdomain.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-3 pl-10 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white shadow-2xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Profiling Stack...
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  Detect Stack
                </>
              )}
            </button>
          </form>

          {/* Presets */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-500">
            <span>Explore live tech stacks:</span>
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setUrl(p.url);
                  handleScan(p.url);
                }}
                className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors font-medium cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm mb-6 flex items-center gap-3 max-w-4xl mx-auto">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        {/* Scan Results Arena */}
        {data && (
          <div className="space-y-6">
            {/* Top Night-Sky Telemetry Banner */}
            <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                {/* SVG Radial Gauge */}
                <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                  <svg className="w-24 h-24 -rotate-90 transform" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#334155" strokeWidth="8" fill="transparent" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#818cf8"
                      strokeWidth="8"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - data.architecture.modernnessScore / 100)}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-white font-mono leading-none">
                      {data.architecture.modernnessScore}
                    </span>
                    <span className="text-[9px] font-bold text-indigo-300 uppercase mt-0.5">/ 100</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-2xl font-black text-white font-mono tracking-tight">{data.domain}</h3>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                      {data.architecture.archetype}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 flex items-center gap-2 flex-wrap">
                    <span>HTTP {data.statusCode}</span>
                    <span>•</span>
                    <span>Latency: {data.responseTimeMs}ms</span>
                    <span>•</span>
                    <span>{data.totalTechnologies} Confirmed Signatures</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1 text-indigo-300">
                      <Zap className="w-3.5 h-3.5 text-indigo-400" />
                      {data.architecture.performanceTier}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      {data.architecture.securityPosture}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto">
                <Link
                  href={`/analyze?url=${encodeURIComponent(data.url || `https://${data.domain}`)}`}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  Run Full SEO Audit <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Proportional Stack Composition Breakdown Bar */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-indigo-600" />
                    Stack Composition Breakdown
                  </h4>
                  <p className="text-xs text-slate-500">
                    Distribution of confirmed software libraries across the application stack.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-500 font-mono">Total Layers: {data.totalTechnologies}</span>
                </div>
              </div>

              {/* Progress Segment Bar */}
              <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                {Object.entries(categoryCounts)
                  .filter(([k]) => k !== "All")
                  .map(([cat, count], idx) => {
                    const colors = [
                      "bg-blue-600",
                      "bg-purple-600",
                      "bg-cyan-600",
                      "bg-indigo-600",
                      "bg-amber-500",
                      "bg-emerald-600",
                      "bg-slate-700",
                      "bg-rose-500",
                      "bg-teal-600",
                    ];
                    const colorClass = colors[idx % colors.length];
                    const percentage = Math.max(5, (count / (data.totalTechnologies || 1)) * 100);

                    return (
                      <div
                        key={cat}
                        className={`${colorClass} h-full transition-all duration-500 hover:opacity-90`}
                        style={{ width: `${percentage}%` }}
                        title={`${cat}: ${count} (${Math.round((count / data.totalTechnologies) * 100)}%)`}
                      />
                    );
                  })}
              </div>

              {/* Legend Chips */}
              <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
                {Object.entries(categoryCounts)
                  .filter(([k]) => k !== "All")
                  .map(([cat, count]) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(selectedCategory === cat ? "All" : cat)}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-indigo-50 border-indigo-300 text-indigo-700 font-bold"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {getCategoryIcon(cat)}
                      <span>{cat}</span>
                      <span className="px-1.5 py-0.2 rounded bg-white text-slate-500 border border-slate-200 text-[10px]">
                        {count}
                      </span>
                    </button>
                  ))}
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                {categoriesList
                  .filter((cat) => cat === "All" || (categoryCounts[cat] || 0) > 0)
                  .map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                        selectedCategory === cat
                          ? "bg-slate-900 text-white shadow-xs"
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span>{cat}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded ${
                          selectedCategory === cat ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {categoryCounts[cat] || 0}
                      </span>
                    </button>
                  ))}
              </div>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Filter technologies..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full px-3 py-1.5 pl-8 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Technology Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTechs.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                          {getCategoryIcon(item.category)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                            {item.version && (
                              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-mono font-bold border border-blue-200">
                                v{item.version}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500">{item.category}</span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          item.confidence === "High"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {item.confidence}
                      </span>
                    </div>

                    {item.description && (
                      <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    {/* Technical Evidence */}
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 font-mono break-all leading-tight">
                      <span className="text-slate-400 block text-[9px] uppercase font-sans font-bold">Evidence:</span>
                      {item.evidence}
                    </div>

                    {item.website && (
                      <div className="flex justify-end">
                        <a
                          href={item.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          Official Docs <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredTechs.length === 0 && (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs space-y-2">
                <Info className="w-6 h-6 mx-auto text-slate-400" />
                <p className="font-semibold text-slate-700">No technologies found matching your filter criteria.</p>
                <p>Try resetting the category filter or clearing your search term.</p>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchFilter("");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-200 hover:bg-blue-100 cursor-pointer transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Architecture Insights Suite */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  <span>Modernity &amp; Framework Evolution</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {data.architecture.archetype === "Modern Jamstack / Edge-Rendered"
                    ? "Application leverages modern edge rendering with minimal server latency, instant static asset delivery, and modern client hydration."
                    : "Architecture utilizes robust CMS / server infrastructure. Ensure server caching layers (Varnish/Redis) and asset minification are active."}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Server className="w-4 h-4 text-indigo-600" />
                  <span>Edge Delivery &amp; Caching Topology</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {data.architecture.performanceTier}
                  . Traffic is routed through optimized edge nodes with automatic TLS handshakes and compression algorithms (Brotli/Gzip).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Security &amp; Fingerprint Posture</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {data.architecture.securityPosture}
                  . {data.architecture.hasWaf ? "Active Cloud WAF defends against Layer 7 DDoS and bot scrapers." : "Consider adding Cloudflare or AWS WAF for perimeter protection."}
                </p>
              </div>
            </div>

            {/* Audit CTA Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md border border-slate-800">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-extrabold border border-blue-400/30">
                  Deep Technical Audit
                </div>
                <h4 className="text-base font-bold text-white">Inspect Performance, Security Headers &amp; SEO Health</h4>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  Run a complete 100-point diagnostic on {data.domain} to evaluate Core Web Vitals, crawl budget, broken links, schema integrity, and search visibility.
                </p>
              </div>
              <Link
                href={`/analyze?url=${encodeURIComponent(data.url || `https://${data.domain}`)}`}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <span>Run Full Audit on {data.domain}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
