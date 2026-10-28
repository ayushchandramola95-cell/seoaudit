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
  Terminal,
  Network,
  GitCompare,
  AlertTriangle,
  FileText,
  CheckSquare,
  XSquare,
  RefreshCw,
} from "lucide-react";
import {
  TechCategory,
  StackRisk,
  StackOptimization,
  SecurityHeaderCheck,
} from "@/lib/modules/tech/detector";

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
  rawHeaders?: Record<string, string>;
  dnsRecords?: {
    ns: string[];
    mx: string[];
    txt: string[];
  };
  insights?: {
    risks: StackRisk[];
    optimizations: StackOptimization[];
    headerChecks: SecurityHeaderCheck[];
  };
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
  const [activeTab, setActiveTab] = useState<"catalog" | "topology" | "security" | "dns" | "compare">("catalog");
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [copiedToast, setCopiedToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Compare Mode State
  const [compareUrl, setCompareUrl] = useState("https://netlify.com");
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareData, setCompareData] = useState<ScanData | null>(null);

  // Initial Sample State (Vercel Stack)
  const [data, setData] = useState<ScanData | null>({
    url: "https://vercel.com",
    domain: "vercel.com",
    statusCode: 200,
    responseTimeMs: 38,
    totalTechnologies: 8,
    rawHeadersCount: 24,
    rawHeaders: {
      server: "Vercel",
      "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
      "content-security-policy": "default-src 'self'; script-src 'self' 'unsafe-eval' https://va.vercel-scripts.com",
      "x-content-type-options": "nosniff",
      "x-frame-options": "DENY",
    },
    dnsRecords: {
      ns: ["ns1.cloudflare.com", "ns2.cloudflare.com"],
      mx: ["aspmx.l.google.com (Priority: 1)", "alt1.aspmx.l.google.com (Priority: 5)"],
      txt: [
        "v=spf1 include:_spf.google.com ~all",
        "stripe-verification=d890b0e5fd41f7e349",
        "google-site-verification=abc123xyz",
      ],
    },
    insights: {
      risks: [
        {
          severity: "good",
          title: "HSTS Enforced with Preload",
          description: "All client requests are strictly forced to HTTPS with domain preload protection.",
          recommendation: "Maintain certificate validity.",
        },
      ],
      optimizations: [
        {
          title: "Leverage Incremental Static Regeneration (ISR)",
          category: "Framework Architecture",
          impact: "High",
          description: "Combines static edge caching speed with dynamic server revalidation on demand.",
        },
        {
          title: "Consolidate Marketing Pixels via Server-Side GTM",
          category: "Web Vitals / TBT",
          impact: "Medium",
          description: "Move third-party trackers off the main browser thread to reduce Total Blocking Time (TBT).",
        },
      ],
      headerChecks: [
        {
          header: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
          status: "pass",
          description: "Forces HTTPS connections and mitigates SSL-stripping.",
        },
        {
          header: "Content-Security-Policy",
          value: "default-src 'self'; script-src 'self'...",
          status: "pass",
          description: "Restricts unauthorized script injection and XSS.",
        },
        {
          header: "Server",
          value: "Vercel",
          status: "warn",
          description: "Identifies Vercel edge reverse proxy.",
        },
        {
          header: "X-Powered-By",
          value: null,
          status: "pass",
          description: "No backend framework disclosure detected.",
        },
      ],
    },
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
        name: "Google Workspace (Gmail)",
        category: "DNS & Cloud Services",
        confidence: "High",
        version: null,
        evidence: "MX record points to Google Mail servers",
        website: "https://workspace.google.com",
        description: "Enterprise email and productivity suite hosted by Google.",
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

  const handleCompareScan = async () => {
    if (!compareUrl) return;
    setCompareLoading(true);
    let formatted = compareUrl.trim();
    if (!formatted.startsWith("http://") && !formatted.startsWith("https://")) {
      formatted = `https://${formatted}`;
      setCompareUrl(formatted);
    }

    try {
      const res = await fetch(`/api/tools/tech?url=${encodeURIComponent(formatted)}`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to scan competitor.");
      setCompareData(json);
      showToast(`Scanned competitor ${json.domain}!`);
    } catch (err: unknown) {
      showToast((err as Error)?.message || "Competitor scan failed.");
    } finally {
      setCompareLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setCopiedToast(msg);
    setTimeout(() => setCopiedToast(null), 3000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard!`);
  };

  const copyJson = () => {
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    showToast("Copied technology stack JSON to clipboard!");
  };

  const copyMarkdownBadge = () => {
    if (!data) return;
    const md = `### 🛠️ Technology Stack for ${data.domain}
- **Architecture**: ${data.architecture.archetype}
- **Modernness Score**: ${data.architecture.modernnessScore}/100
- **Performance Tier**: ${data.architecture.performanceTier}
- **Security Posture**: ${data.architecture.securityPosture}

| Technology | Category | Version | Confidence |
| :--- | :--- | :--- | :--- |
${data.data.map((t) => `| **${t.name}** | ${t.category} | ${t.version || "Latest"} | ${t.confidence} |`).join("\n")}

*Audited via [SEO Audit Platform](https://localhost:3000/tools/tech-detector)*`;

    navigator.clipboard.writeText(md);
    showToast("Copied Markdown summary to clipboard!");
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

  // Group technologies into 5 schematic layers for the Topology Map
  const topologyLayers = useMemo(() => {
    if (!data) return [];
    return [
      {
        title: "1. DNS & Network Perimeter",
        desc: "Nameservers, Anycast routing & Email exchangers",
        icon: Globe,
        color: "teal",
        items: data.data.filter((t) => t.category === "DNS & Cloud Services"),
      },
      {
        title: "2. Edge CDN & Caching Shield",
        desc: "Global reverse proxy, DDoS mitigation & TLS termination",
        icon: Server,
        color: "indigo",
        items: data.data.filter((t) => t.category === "CDN & Infrastructure" || t.category === "Web Server & Gateway"),
      },
      {
        title: "3. Application & UI Framework",
        desc: "Component libraries, client-side hydration & styling runtime",
        icon: Cpu,
        color: "blue",
        items: data.data.filter((t) => t.category === "Frontend Framework" || t.category === "CSS & UI Framework" || t.category === "JavaScript Library"),
      },
      {
        title: "4. CMS & E-Commerce Core",
        desc: "Content management, shopping cart & payment processing",
        icon: Layers,
        color: "purple",
        items: data.data.filter((t) => t.category === "CMS & Site Builder" || t.category === "E-Commerce & Payments"),
      },
      {
        title: "5. Telemetry & Customer Ops",
        desc: "Analytics, user session replays, crash monitoring & live chat",
        icon: BarChart,
        color: "amber",
        items: data.data.filter((t) => t.category === "Analytics & Telemetry" || t.category === "Marketing & Communication" || t.category === "Security & Performance"),
      },
    ];
  }, [data]);

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
                  <span>Score: {data.architecture.modernnessScore}/100</span>
                </div>
              </div>
            </div>

            {/* Mode Tabs in Sub-Navbar */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setActiveTab("catalog")}
                className={`px-3 py-1 font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "catalog" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Catalog</span>
              </button>
              <button
                onClick={() => setActiveTab("topology")}
                className={`px-3 py-1 font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "topology" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Network className="w-3.5 h-3.5 text-indigo-600" />
                <span>Topology Map</span>
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`px-3 py-1 font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "security" ? "bg-white text-rose-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                <span>Security Audit</span>
              </button>
              <button
                onClick={() => setActiveTab("dns")}
                className={`px-3 py-1 font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "dns" ? "bg-white text-teal-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-teal-600" />
                <span>DNS &amp; Mail</span>
              </button>
              <button
                onClick={() => setActiveTab("compare")}
                className={`px-3 py-1 font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "compare" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <GitCompare className="w-3.5 h-3.5 text-blue-600" />
                <span>Compare</span>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={copyMarkdownBadge}
                title="Copy Markdown summary for README / Notion"
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Markdown</span>
              </button>

              <button
                onClick={downloadCsv}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">CSV</span>
              </button>

              <Link
                href={`/analyze?url=${encodeURIComponent(data.url || `https://${data.domain}`)}`}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Full Audit</span>
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

            {/* TAB 1: TECHNOLOGY CATALOG */}
            {activeTab === "catalog" && (
              <div className="space-y-6">
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
              </div>
            )}

            {/* TAB 2: INTERACTIVE ARCHITECTURE TOPOLOGY MAP */}
            {activeTab === "topology" && (
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Network className="w-4 h-4 text-indigo-600" />
                    Application Architecture Schematic Topology
                  </h4>
                  <p className="text-xs text-slate-500">
                    End-to-end data flow mapping from DNS lookup down through edge delivery, frontend rendering, and background analytics.
                  </p>
                </div>

                <div className="space-y-4">
                  {topologyLayers.map((layer, idx) => {
                    const LayerIcon = layer.icon;
                    return (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center">
                              <LayerIcon className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-slate-900">{layer.title}</h5>
                              <p className="text-[11px] text-slate-500">{layer.desc}</p>
                            </div>
                          </div>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                            {layer.items.length} Active {layer.items.length === 1 ? "Component" : "Components"}
                          </span>
                        </div>

                        {layer.items.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                            {layer.items.map((tech, tidx) => (
                              <div
                                key={tidx}
                                className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between gap-2"
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span className="text-xs font-bold text-slate-900 truncate">{tech.name}</span>
                                </div>
                                {tech.version && (
                                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-blue-50 text-blue-700 rounded border border-blue-200 font-bold shrink-0">
                                    v{tech.version}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400 italic bg-white/60 p-2.5 rounded-xl border border-dashed border-slate-200 text-center">
                            No third-party vendor signature identified in this architectural layer.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: SECURITY & VULNERABILITY AUDIT */}
            {activeTab === "security" && (
              <div className="space-y-6">
                {/* Security Posture Header Banner */}
                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Security &amp; Fingerprint Disclosure
                    </span>
                    <h4 className="text-lg font-bold text-slate-900">{data.architecture.securityPosture}</h4>
                    <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                      Server fingerprint audits check whether HTTP headers, banner tokens, or deprecated client libraries inadvertently disclose system details to threat actors.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-mono font-bold">
                      WAF Protected: {data.architecture.hasWaf ? "YES (Active)" : "NO"}
                    </span>
                  </div>
                </div>

                {/* Security Risks Checklist */}
                {data.insights?.risks && data.insights.risks.length > 0 && (
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Identified Security Risks &amp; Vulnerabilities
                    </h4>
                    <div className="space-y-3">
                      {data.insights.risks.map((risk, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{risk.title}</span>
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase border ${
                                risk.severity === "high"
                                  ? "bg-rose-50 text-rose-700 border-rose-200"
                                  : risk.severity === "medium"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
                              }`}
                            >
                              {risk.severity} Severity
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">{risk.description}</p>
                          <p className="text-[11px] text-blue-700 font-semibold bg-blue-50/60 p-2 rounded-lg border border-blue-200/60">
                            💡 Recommendation: {risk.recommendation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* HTTP Security Headers Evaluation Table */}
                {data.insights?.headerChecks && (
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      HTTP Security Headers Policy Matrix
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[10px]">
                            <th className="p-2.5 font-bold">Header Directive</th>
                            <th className="p-2.5 font-bold">Status</th>
                            <th className="p-2.5 font-bold">Observed Value</th>
                            <th className="p-2.5 font-bold">Security Evaluation</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono">
                          {data.insights.headerChecks.map((hc, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="p-2.5 font-bold text-slate-900 font-sans">{hc.header}</td>
                              <td className="p-2.5">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                                    hc.status === "pass"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : hc.status === "warn"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-rose-100 text-rose-800"
                                  }`}
                                >
                                  {hc.status}
                                </span>
                              </td>
                              <td className="p-2.5 text-slate-600 text-[11px] truncate max-w-xs">
                                {hc.value || "(Not Defined)"}
                              </td>
                              <td className="p-2.5 text-slate-500 text-[11px] font-sans">{hc.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Raw HTTP Response Headers Drawer */}
                {data.rawHeaders && (
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-slate-700" />
                        Raw Server Headers Disclosed ({Object.keys(data.rawHeaders).length})
                      </h4>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(data.rawHeaders, null, 2), "Raw HTTP Headers")}
                        className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" /> Copy Headers
                      </button>
                    </div>
                    <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto max-h-60 leading-relaxed border border-slate-800">
                      {Object.entries(data.rawHeaders).map(([k, v]) => (
                        <div key={k}>
                          <span className="text-indigo-400">{k}</span>:{" "}
                          <span className="text-slate-300">{v}</span>
                        </div>
                      ))}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: DNS & ENTERPRISE INFRASTRUCTURE */}
            {activeTab === "dns" && (
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-teal-600" />
                    Public DNS &amp; Enterprise Cloud Infrastructure
                  </h4>
                  <p className="text-xs text-slate-500">
                    Extracted from global DNS records (Nameservers, Mail Exchangers, and TXT verification entries).
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Nameservers */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Server className="w-4 h-4 text-indigo-600" /> Nameservers (NS)
                    </span>
                    {data.dnsRecords?.ns && data.dnsRecords.ns.length > 0 ? (
                      <div className="space-y-1 font-mono text-[11px] text-slate-600">
                        {data.dnsRecords.ns.map((ns, i) => (
                          <div key={i} className="p-1.5 bg-white rounded border border-slate-200 truncate">
                            {ns}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No NS records returned.</p>
                    )}
                  </div>

                  {/* Mail Exchangers */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-blue-600" /> Mail Infrastructure (MX)
                    </span>
                    {data.dnsRecords?.mx && data.dnsRecords.mx.length > 0 ? (
                      <div className="space-y-1 font-mono text-[11px] text-slate-600">
                        {data.dnsRecords.mx.map((mx, i) => (
                          <div key={i} className="p-1.5 bg-white rounded border border-slate-200 truncate">
                            {mx}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No MX records found.</p>
                    )}
                  </div>

                  {/* TXT Records */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-teal-600" /> Verification &amp; SPF (TXT)
                    </span>
                    {data.dnsRecords?.txt && data.dnsRecords.txt.length > 0 ? (
                      <div className="space-y-1 font-mono text-[11px] text-slate-600 max-h-48 overflow-y-auto">
                        {data.dnsRecords.txt.map((txt, i) => (
                          <div key={i} className="p-1.5 bg-white rounded border border-slate-200 break-all">
                            {txt}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No TXT records found.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: COMPARE TECH STACKS */}
            {activeTab === "compare" && (
              <div className="space-y-6">
                {/* Compare Input Bar */}
                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <GitCompare className="w-4 h-4 text-blue-600" />
                      Side-by-Side Competitive Stack Benchmarking
                    </h4>
                    <p className="text-xs text-slate-500">
                      Compare {data.domain}&apos;s software stack against another website or competitor.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 max-w-xl">
                    <input
                      type="text"
                      placeholder="Enter competitor URL (e.g. https://netlify.com)"
                      value={compareUrl}
                      onChange={(e) => setCompareUrl(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleCompareScan}
                      disabled={compareLoading}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {compareLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <GitCompare className="w-3.5 h-3.5" />}
                      <span>Compare Stacks</span>
                    </button>
                  </div>
                </div>

                {/* Compare Grid */}
                {compareData && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Site A (Current) */}
                    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                          <h5 className="text-base font-extrabold text-slate-900 font-mono">{data.domain}</h5>
                          <span className="text-[11px] text-slate-500">{data.architecture.archetype}</span>
                        </div>
                        <span className="text-xl font-black text-indigo-600 font-mono">
                          {data.architecture.modernnessScore}/100
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-700">Confirmed Technologies ({data.data.length})</div>
                      <div className="space-y-2">
                        {data.data.map((t, i) => (
                          <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-800">{t.name}</span>
                            <span className="text-[10px] text-slate-500">{t.category}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Site B (Competitor) */}
                    <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div>
                          <h5 className="text-base font-extrabold text-slate-900 font-mono">{compareData.domain}</h5>
                          <span className="text-[11px] text-slate-500">{compareData.architecture.archetype}</span>
                        </div>
                        <span className="text-xl font-black text-blue-600 font-mono">
                          {compareData.architecture.modernnessScore}/100
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-700">Confirmed Technologies ({compareData.data.length})</div>
                      <div className="space-y-2">
                        {compareData.data.map((t, i) => (
                          <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-800">{t.name}</span>
                            <span className="text-[10px] text-slate-500">{t.category}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
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
