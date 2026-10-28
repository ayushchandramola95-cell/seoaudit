"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  GitCompare, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Download, 
  Layers, 
  Zap, 
  TrendingUp, 
  ExternalLink,
  Brain,
  Gauge,
  Sparkles,
  Trophy,
  Scale,
  Share2,
  Printer,
  Copy,
  Check,
  Hash,
  BookOpen,
  Globe,
  Crown,
  ArrowUpRight,
  Flame,
  Search,
  Sliders,
  Activity,
  Terminal,
  Lock,
  Clock,
  Code2,
  Filter,
} from "lucide-react";
import { ComparisonReport } from "@/lib/modules/compare/comparator";
import { exportKeywordGapCsv } from "@/lib/utils/csvExport";
import { usePlan } from "@/lib/auth/PlanContext";
import { formatTierName } from "@/lib/auth/tierLimits";

interface ApiResponse {
  success: boolean;
  id?: string;
  timestamp: string;
  comparison: ComparisonReport;
  error?: string;
  errorType?: string;
  details?: string;
}

export default function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { tier, canAccess, triggerUpgradeModal } = usePlan();
  const hasCompareAccess = canAccess("allowCompetitorCompare");

  const paramSiteA = searchParams.get("siteA") || "";
  const paramSiteB = searchParams.get("siteB") || "";

  const [inputA, setInputA] = useState(paramSiteA);
  const [inputB, setInputB] = useState(paramSiteB);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ComparisonReport | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active view tab
  const [activeTab, setActiveTab] = useState<"overview" | "categories" | "vitals" | "tech" | "keywords">("overview");
  const [winnerFilter, setWinnerFilter] = useState<"all" | "siteA" | "siteB" | "tie">("all");
  const [keywordSearch, setKeywordSearch] = useState("");
  const [hoveredRadarAxis, setHoveredRadarAxis] = useState<number | null>(null);

  // Sticky sub-navbar state
  const [isScrolled, setIsScrolled] = useState(false);

  const samplePairs = [
    { a: "github.com", b: "gitlab.com" },
    { a: "vercel.com", b: "netlify.com" },
    { a: "stripe.com", b: "paypal.com" },
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 2400);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 340);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopyShare = () => {
    if (reportId) {
      const shareUrl = `${window.location.origin}/report/${reportId}`;
      navigator.clipboard.writeText(shareUrl);
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
    setCopiedShare(true);
    showToast("Shareable benchmark link copied!");
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const fetchComparison = async (urlA: string, urlB: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(
        `/api/compare?siteA=${encodeURIComponent(urlA)}&siteB=${encodeURIComponent(urlB)}`
      );
      const result: ApiResponse = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || result.details || "Failed to compare target websites.");
      }

      setData(result.comparison);
      if (result.id) setReportId(result.id);
      showToast(`Comparison complete: ${result.comparison.siteA.page.domain} vs ${result.comparison.siteB.page.domain}`);
    } catch (err: unknown) {
      setError((err as Error).message || "An unexpected error occurred during comparison.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paramSiteA && paramSiteB) {
      setInputA(paramSiteA);
      setInputB(paramSiteB);
      fetchComparison(paramSiteA, paramSiteB);
    } else {
      setInputA("stripe.com");
      setInputB("paypal.com");
      fetchComparison("stripe.com", "paypal.com");
    }
  }, [paramSiteA, paramSiteB]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputA.trim() || !inputB.trim()) {
      setError("Please specify both Website A and Website B.");
      return;
    }

    const isSample = samplePairs.some(
      (p) =>
        (inputA.toLowerCase().includes(p.a) && inputB.toLowerCase().includes(p.b)) ||
        (inputA.toLowerCase().includes(p.b) && inputB.toLowerCase().includes(p.a))
    );

    if (!hasCompareAccess && !isSample) {
      triggerUpgradeModal({
        requiredTier: "pro",
        featureTitle: "Competitor Benchmark Suite",
        description:
          "Head-to-head domain comparison with differential scoring and topic gap analysis is a Pro Analyst feature. You can test any pre-set demo pair for free or upgrade to benchmark custom domains.",
      });
      return;
    }

    router.push(`/compare?siteA=${encodeURIComponent(inputA.trim())}&siteB=${encodeURIComponent(inputB.trim())}`);
  };

  const handleSwap = () => {
    const temp = inputA;
    setInputA(inputB);
    setInputB(temp);
    if (inputA && inputB) {
      router.push(`/compare?siteA=${encodeURIComponent(inputB)}&siteB=${encodeURIComponent(inputA)}`);
    }
  };

  const handleExportJson = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seoseite-comparison-${data.siteA.page.domain}-vs-${data.siteB.page.domain}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded comparison JSON for ${data.siteA.page.domain} vs ${data.siteB.page.domain}`);
  };

  // Win Tally Calculations
  const battleTally = useMemo(() => {
    if (!data) return { winsA: 0, winsB: 0, ties: 0, overallWinner: "tie" as "siteA" | "siteB" | "tie" };

    let winsA = 0;
    let winsB = 0;
    let ties = 0;

    // 1. Overall SEO
    if (data.deltas.seoScoreDiff > 0) winsA++;
    else if (data.deltas.seoScoreDiff < 0) winsB++;
    else ties++;

    // 2. Performance
    if (data.siteA.performance.scores.performance > data.siteB.performance.scores.performance) winsA++;
    else if (data.siteB.performance.scores.performance > data.siteA.performance.scores.performance) winsB++;
    else ties++;

    // 3. Open PageRank
    const prA = data.trafficComparison?.pageRankA ?? 0;
    const prB = data.trafficComparison?.pageRankB ?? 0;
    if (prA > prB) winsA++;
    else if (prB > prA) winsB++;
    else ties++;

    // 4. LCP Speed
    const lcpA = data.siteA.performance.vitals.lcp.numericValue;
    const lcpB = data.siteB.performance.vitals.lcp.numericValue;
    if (lcpA < lcpB) winsA++;
    else if (lcpB < lcpA) winsB++;
    else ties++;

    // 5. Metadata Category
    if (data.categoryWinners.metadata === "siteA") winsA++;
    else if (data.categoryWinners.metadata === "siteB") winsB++;
    else ties++;

    // 6. Content Category
    if (data.categoryWinners.content === "siteA") winsA++;
    else if (data.categoryWinners.content === "siteB") winsB++;
    else ties++;

    // 7. Indexability Category
    if (data.categoryWinners.indexability === "siteA") winsA++;
    else if (data.categoryWinners.indexability === "siteB") winsB++;
    else ties++;

    // 8. Security Category
    if (data.categoryWinners.security === "siteA") winsA++;
    else if (data.categoryWinners.security === "siteB") winsB++;
    else ties++;

    const overallWinner: "siteA" | "siteB" | "tie" =
      winsA > winsB ? "siteA" : winsB > winsA ? "siteB" : "tie";

    return { winsA, winsB, ties, overallWinner };
  }, [data]);

  // Handle Tab Click with smooth scrolling when stuck
  const handleTabClick = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (isScrolled && typeof window !== "undefined") {
      const el = document.getElementById("compare-tab-content");
      if (el) {
        const yOffset = -128; // 64px header + 48px subnavbar + 16px buffer
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  // Copy Executive Markdown Table
  const handleCopyMarkdownReport = () => {
    if (!data) return;
    const winnerName =
      battleTally.overallWinner === "siteA"
        ? data.siteA.page.domain
        : battleTally.overallWinner === "siteB"
        ? data.siteB.page.domain
        : "Evenly Matched Contenders";

    let md = `# Competitor Website Comparison: ${data.siteA.page.domain} vs ${data.siteB.page.domain}\n\n`;
    md += `**Overall Category Leader**: ${winnerName} (${battleTally.winsA} vs ${battleTally.winsB} Wins • ${battleTally.ties} Ties)\n\n`;
    md += `| Comparative Metric | ${data.siteA.page.domain} | ${data.siteB.page.domain} | Advantage |\n`;
    md += `| :--- | :--- | :--- | :--- |\n`;
    md += `| **Technical SEO Score** | ${data.siteA.audit.overallScore}/100 (${data.siteA.audit.grade}) | ${data.siteB.audit.overallScore}/100 (${data.siteB.audit.grade}) | ${data.deltas.seoScoreDiff > 0 ? `${data.siteA.page.domain} (+${data.deltas.seoScoreDiff})` : data.deltas.seoScoreDiff < 0 ? `${data.siteB.page.domain} (+${Math.abs(data.deltas.seoScoreDiff)})` : "Tied"} |\n`;
    md += `| **PageSpeed Performance** | ${data.siteA.performance.scores.performance}/100 | ${data.siteB.performance.scores.performance}/100 | ${data.siteA.performance.scores.performance > data.siteB.performance.scores.performance ? data.siteA.page.domain : data.siteB.performance.scores.performance > data.siteA.performance.scores.performance ? data.siteB.page.domain : "Tied"} |\n`;
    md += `| **Largest Contentful Paint (LCP)** | ${data.vitalsComparison.lcpA} | ${data.vitalsComparison.lcpB} | ${data.siteA.performance.vitals.lcp.numericValue < data.siteB.performance.vitals.lcp.numericValue ? `${data.siteA.page.domain} Faster` : data.siteB.performance.vitals.lcp.numericValue < data.siteA.performance.vitals.lcp.numericValue ? `${data.siteB.page.domain} Faster` : "Tied"} |\n`;
    md += `| **Open PageRank Authority** | ${data.trafficComparison?.pageRankA ?? "N/A"}/10 | ${data.trafficComparison?.pageRankB ?? "N/A"}/10 | ${(data.trafficComparison?.pageRankA ?? 0) > (data.trafficComparison?.pageRankB ?? 0) ? data.siteA.page.domain : (data.trafficComparison?.pageRankB ?? 0) > (data.trafficComparison?.pageRankA ?? 0) ? data.siteB.page.domain : "Tied"} |\n`;
    md += `| **Estimated Monthly Visits** | ${data.siteA.traffic.formattedRange} | ${data.siteB.traffic.formattedRange} | ${data.siteA.traffic.monthlyVisitsMidpoint > data.siteB.traffic.monthlyVisitsMidpoint ? data.siteA.page.domain : data.siteB.traffic.monthlyVisitsMidpoint > data.siteA.traffic.monthlyVisitsMidpoint ? data.siteB.page.domain : "Tied"} |\n`;
    md += `| **Word Count Volume** | ${data.siteA.page.wordCount.toLocaleString()} words | ${data.siteB.page.wordCount.toLocaleString()} words | ${data.siteA.page.wordCount > data.siteB.page.wordCount ? `${data.siteA.page.domain} Deeper Copy` : `${data.siteB.page.domain} Deeper Copy`} |\n`;
    md += `| **Internal Links** | ${data.siteA.page.links.internalLinks} links | ${data.siteB.page.links.internalLinks} links | ${data.siteA.page.links.internalLinks > data.siteB.page.links.internalLinks ? data.siteA.page.domain : data.siteB.page.links.internalLinks > data.siteA.page.links.internalLinks ? data.siteB.page.domain : "Tied"} |\n`;
    md += `| **Server Response (TTFB)** | ${data.vitalsComparison.ttfbA} | ${data.vitalsComparison.ttfbB} | ${data.siteA.page.responseTimeMs < data.siteB.page.responseTimeMs ? `${data.siteA.page.domain} (${data.siteA.page.responseTimeMs}ms)` : `${data.siteB.page.domain} (${data.siteB.page.responseTimeMs}ms)`} |\n\n`;
    md += `*Generated by SEO Audit Intel Competitive Benchmarking Suite*\n`;

    navigator.clipboard.writeText(md);
    setCopiedMarkdown(true);
    showToast("Comparative Markdown Table copied to clipboard!");
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  // 5-Axis Spider / Radar Chart Data
  const radarAxes = useMemo(() => {
    if (!data) return [];
    return [
      {
        label: "Technical SEO",
        valA: data.siteA.audit.overallScore,
        valB: data.siteB.audit.overallScore,
        max: 100,
        unit: "pts",
      },
      {
        label: "Core Web Vitals",
        valA: data.siteA.performance.scores.performance,
        valB: data.siteB.performance.scores.performance,
        max: 100,
        unit: "pts",
      },
      {
        label: "Content Depth",
        valA: Math.min(100, Math.round((data.siteA.audit.categories.content.score / 25) * 100)),
        valB: Math.min(100, Math.round((data.siteB.audit.categories.content.score / 25) * 100)),
        max: 100,
        unit: "%",
      },
      {
        label: "Security Guard",
        valA: Math.min(100, Math.round((data.siteA.audit.categories.security.score / 25) * 100)),
        valB: Math.min(100, Math.round((data.siteB.audit.categories.security.score / 25) * 100)),
        max: 100,
        unit: "%",
      },
      {
        label: "Domain Authority",
        valA: Math.min(100, Math.round((data.trafficComparison?.pageRankA ?? 5) * 10)),
        valB: Math.min(100, Math.round((data.trafficComparison?.pageRankB ?? 5) * 10)),
        max: 100,
        unit: "/10",
      },
    ];
  }, [data]);

  const radarCenterX = 150;
  const radarCenterY = 135;
  const radarMaxR = 90;

  const getRadarPoint = (index: number, val: number) => {
    const angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
    const r = (Math.max(10, Math.min(100, val)) / 100) * radarMaxR;
    return {
      x: radarCenterX + r * Math.cos(angle),
      y: radarCenterY + r * Math.sin(angle),
      labelX: radarCenterX + (radarMaxR + 24) * Math.cos(angle),
      labelY: radarCenterY + (radarMaxR + 18) * Math.sin(angle),
    };
  };

  const polyA = radarAxes.map((a, i) => {
    const pt = getRadarPoint(i, a.valA);
    return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
  }).join(" ");

  const polyB = radarAxes.map((a, i) => {
    const pt = getRadarPoint(i, a.valB);
    return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
  }).join(" ");

  // Category Matrix items
  const categoryMatrixItems = useMemo(() => {
    if (!data) return [];
    const cats = [
      {
        name: "Metadata & Tags",
        key: "metadata" as const,
        scoreA: data.siteA.audit.categories.metadata.score,
        scoreB: data.siteB.audit.categories.metadata.score,
        winner: data.categoryWinners.metadata,
        desc: "Title tags, meta descriptions, Open Graph protocol, canonical tags, and SERP visibility signals.",
      },
      {
        name: "Content & Semantics",
        key: "content" as const,
        scoreA: data.siteA.audit.categories.content.score,
        scoreB: data.siteB.audit.categories.content.score,
        winner: data.categoryWinners.content,
        desc: "H1 hierarchy, document word count density, text-to-HTML ratio, and readability structuring.",
      },
      {
        name: "Indexability Signals",
        key: "indexability" as const,
        scoreA: data.siteA.audit.categories.indexability.score,
        scoreB: data.siteB.audit.categories.indexability.score,
        winner: data.categoryWinners.indexability,
        desc: "Robots.txt, XML sitemap presence, noindex robots directives, and canonical host resolution.",
      },
      {
        name: "Security & Standards",
        key: "security" as const,
        scoreA: data.siteA.audit.categories.security.score,
        scoreB: data.siteB.audit.categories.security.score,
        winner: data.categoryWinners.security,
        desc: "HTTPS transport encryption, HSTS headers, mixed content protection, and server technology cloaking.",
      },
    ];

    if (winnerFilter === "all") return cats;
    return cats.filter((c) => c.winner === winnerFilter);
  }, [data, winnerFilter]);

  // Keyword Gap Filtered list
  const filteredKeywordGap = useMemo(() => {
    if (!data?.keywordGap) return { uniqueToA: [], uniqueToB: [], topOverlap: [] };
    const q = keywordSearch.trim().toLowerCase();
    if (!q) {
      return {
        uniqueToA: data.keywordGap.uniqueToA,
        uniqueToB: data.keywordGap.uniqueToB,
        topOverlap: data.keywordGap.topOverlapKeywords,
      };
    }
    return {
      uniqueToA: data.keywordGap.uniqueToA.filter((k) => k.phrase.toLowerCase().includes(q)),
      uniqueToB: data.keywordGap.uniqueToB.filter((k) => k.phrase.toLowerCase().includes(q)),
      topOverlap: data.keywordGap.topOverlapKeywords.filter((k) => k.phrase.toLowerCase().includes(q)),
    };
  }, [data, keywordSearch]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 border border-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* FULL-WIDTH FIXED SUB-NAVBAR ON SCROLL */}
      {isScrolled && data && (
        <aside
          aria-label="Comparison Sub-Navigation"
          className="fixed top-16 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs py-2 px-4 sm:px-6 lg:px-8 transition-all duration-200 animate-in fade-in slide-in-from-top-1 no-print"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            {/* Left: Domains Head-to-Head */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900">
                <span className="text-blue-700 font-extrabold truncate max-w-[110px] sm:max-w-[140px]">
                  {data.siteA.page.domain}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono font-bold">
                  {data.siteA.audit.overallScore}
                </span>
                <span className="text-slate-400 font-sans font-normal text-[11px]">vs</span>
                <span className="text-purple-700 font-extrabold truncate max-w-[110px] sm:max-w-[140px]">
                  {data.siteB.page.domain}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200 font-mono font-bold">
                  {data.siteB.audit.overallScore}
                </span>
              </div>
            </div>

            {/* Middle: 5 Sleek Tabs (Zero scrollbars) */}
            <nav
              className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold overflow-x-auto no-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <button
                type="button"
                onClick={() => handleTabClick("overview")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "overview"
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Overview</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabClick("categories")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "categories"
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Categories</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabClick("vitals")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "vitals"
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <Gauge className="w-3.5 h-3.5 text-emerald-600" />
                <span>Web Vitals</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabClick("tech")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "tech"
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-purple-600" />
                <span>Tech Stack</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabClick("keywords")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "keywords"
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                <Hash className="w-3.5 h-3.5 text-indigo-600" />
                <span>Topic Gap</span>
              </button>
            </nav>

            {/* Right: Quick Actions */}
            <div className="hidden lg:flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleSwap}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                title="Swap Site A and Site B"
              >
                <Scale className="w-3.5 h-3.5 text-slate-500" />
                <span>Swap</span>
              </button>

              <button
                type="button"
                onClick={handleCopyMarkdownReport}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                title="Copy Markdown Report"
              >
                {copiedMarkdown ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                )}
                <span>Report</span>
              </button>

              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                title="Scroll to Top"
              >
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                <span>Top</span>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Top Breadcrumbs & Tier Badge */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-slate-900 transition-colors">
              Tools Hub
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">Competitor Benchmark</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
              <GitCompare className="w-3 h-3 text-purple-600" />
              Competitive Intelligence Suite
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {formatTierName(tier)}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Plan Upgrade Banner if on Starter/Free */}
        {!hasCompareAccess && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-900">Pro Analyst Competitive Suite:</span>{" "}
                <span className="text-slate-600">
                  Explore pre-set benchmark demo pairs below for free, or upgrade to Pro Analyst ($39/mo) for unlimited custom domain head-to-head comparisons.
                </span>
              </div>
            </div>
            <button
              onClick={() =>
                triggerUpgradeModal({
                  requiredTier: "pro",
                  featureTitle: "Competitor Benchmark Suite",
                  description: "Run unlimited side-by-side URL benchmarks with differential delta scoring and topic gaps.",
                })
              }
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold whitespace-nowrap self-start sm:self-auto cursor-pointer shadow-xs"
            >
              Upgrade to Pro
            </button>
          </div>
        )}

        {/* Hero Form Card: Dual Cockpit */}
        <div className="flat-card p-6 bg-white border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="text-center max-w-3xl mx-auto mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 mb-2.5">
              <Scale className="w-3.5 h-3.5" />
              Head-to-Head Comparative Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Competitor Website Comparison
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl mx-auto leading-relaxed">
              Deterministic side-by-side benchmarking across technical SEO architecture, Core Web Vitals lab speed, technology stacks, and on-page semantic topic coverage.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl mx-auto">
            <div className="relative flex flex-col md:flex-row items-center gap-3">
              {/* Site A Box */}
              <div className="relative flex-1 w-full p-3 bg-blue-50/30 border-2 border-blue-200 hover:border-blue-400 focus-within:border-blue-600 rounded-2xl transition-all shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-blue-600" />
                    Website A (Primary Focus)
                  </span>
                  {inputA && (
                    <button
                      type="button"
                      onClick={() => setInputA("")}
                      className="text-slate-400 hover:text-slate-600 text-[10px] font-mono cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={inputA}
                  onChange={(e) => setInputA(e.target.value)}
                  placeholder="e.g. stripe.com"
                  className="w-full bg-transparent text-sm sm:text-base font-bold text-slate-900 outline-none font-mono placeholder:text-slate-400"
                />
              </div>

              {/* Floating Swap Button */}
              <button
                type="button"
                onClick={handleSwap}
                className="w-10 h-10 rounded-full bg-white border-2 border-slate-300 hover:border-purple-600 text-slate-600 hover:text-purple-700 flex items-center justify-center shrink-0 shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer z-10"
                title="Swap Website A and Website B"
              >
                <Scale className="w-4 h-4" />
              </button>

              {/* Site B Box */}
              <div className="relative flex-1 w-full p-3 bg-purple-50/30 border-2 border-purple-200 hover:border-purple-400 focus-within:border-purple-600 rounded-2xl transition-all shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-purple-600" />
                    Website B (Competitor Benchmark)
                  </span>
                  {inputB && (
                    <button
                      type="button"
                      onClick={() => setInputB("")}
                      className="text-slate-400 hover:text-slate-600 text-[10px] font-mono cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={inputB}
                  onChange={(e) => setInputB(e.target.value)}
                  placeholder="e.g. paypal.com"
                  className="w-full bg-transparent text-sm sm:text-base font-bold text-slate-900 outline-none font-mono placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading || !inputA.trim() || !inputB.trim()}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Executing Dual Audits...</span>
                  </>
                ) : (
                  <>
                    <GitCompare className="w-4 h-4" />
                    <span>Compare Websites Side-by-Side</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Instant Test Pairs */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
              Instant Benchmarks:
            </span>
            {samplePairs.map((pair, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputA(pair.a);
                  setInputB(pair.b);
                  router.push(`/compare?siteA=${encodeURIComponent(pair.a)}&siteB=${encodeURIComponent(pair.b)}`);
                }}
                className={`px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-mono text-xs transition-colors border border-slate-200 cursor-pointer ${
                  inputA === pair.a && inputB === pair.b ? "bg-purple-100 border-purple-300 font-bold text-purple-900" : ""
                }`}
              >
                {pair.a} <span className="text-slate-400 font-normal">vs</span> {pair.b}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State Animation */}
        {loading && (
          <div className="flat-card p-12 text-center max-w-xl mx-auto my-8 bg-white border border-slate-200 shadow-sm animate-in fade-in">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center mx-auto mb-5 shadow-lg animate-pulse">
              <Scale className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">
              Executing Dual Real-Time Telemetry Scans
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">
              Performing parallel Cheerio DOM scraping, Core Web Vitals speed tests, Open PageRank queries, and keyword extraction...
            </p>

            <div className="space-y-2.5 text-left max-w-xs mx-auto text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between font-mono">
                <span className="text-blue-700 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  {inputA || "Site A"}
                </span>
                <span className="text-[10px] text-slate-400">Scraping &amp; SEO</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span className="text-purple-700 font-bold flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-600" />
                  {inputB || "Site B"}
                </span>
                <span className="text-[10px] text-slate-400">Vitals &amp; PageSpeed</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-slate-400" />
                  Delta Comparator
                </span>
                <span className="text-[10px] text-slate-400">Cross-Analysis</span>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && !loading && (
          <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-3.5 animate-in fade-in">
            <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-bold text-sm text-rose-900">Comparison Failed</div>
              <p className="mt-1 leading-relaxed">{error}</p>
              <p className="mt-2 text-[11px] text-rose-700">
                Please verify that both URLs point to live, publicly accessible domains and do not trigger firewall or private subnet blocks.
              </p>
            </div>
          </div>
        )}

        {/* DATA LOADED: THE COMPARISON STUDIO */}
        {data && !loading && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Action Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-slate-900 font-bold">{data.siteA.page.domain}</span>
                <span className="text-slate-400 font-normal">vs</span>
                <span className="font-mono text-slate-900 font-bold">{data.siteB.page.domain}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleSwap}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  title="Swap Site A and Site B"
                >
                  <Scale className="w-3.5 h-3.5 text-slate-500" />
                  Swap Sites
                </button>

                <button
                  onClick={handleCopyShare}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  title="Share Benchmark URL"
                >
                  {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
                  Share
                </button>

                <button
                  onClick={handleCopyMarkdownReport}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  title="Copy Comparison Markdown Table"
                >
                  {copiedMarkdown ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  Copy Markdown
                </button>

                <button
                  onClick={handleExportJson}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  title="Export Comparison JSON"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  JSON
                </button>

                <button
                  onClick={() => typeof window !== "undefined" && window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  title="Print comparison report"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  Print
                </button>
              </div>
            </div>

            {/* HEAD-TO-HEAD ARENA HERO BANNER */}
            <div className="p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
              {/* Ambient Glows */}
              <div className="absolute -left-20 -top-20 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                {/* SITE A HERO COCKPIT */}
                <div className="flex items-center gap-4 text-center sm:text-left w-full lg:w-auto justify-center sm:justify-start">
                  <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                    <svg className="w-24 h-24 -rotate-90 transform" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#3b82f6"
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={2 * Math.PI * 40 * (1 - data.siteA.audit.overallScore / 100)}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-white font-mono leading-none">
                        {data.siteA.audit.overallScore}
                      </span>
                      <span className="text-[10px] font-bold text-blue-400 uppercase mt-0.5 tracking-wider">
                        {data.siteA.audit.grade}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400 block mb-0.5">
                      Website A Focus
                    </span>
                    <h2 className="text-lg font-black text-white font-mono tracking-tight flex items-center gap-2">
                      {data.siteA.page.domain}
                      {battleTally.overallWinner === "siteA" && (
                        <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                      )}
                    </h2>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-300 font-mono">
                      <span>Speed: {data.siteA.performance.scores.performance}/100</span>
                      <span>•</span>
                      <span>LCP: {data.vitalsComparison.lcpA}</span>
                    </div>
                  </div>
                </div>

                {/* CLASH ARENA CENTER */}
                <div className="text-center px-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs max-w-md w-full">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-2">
                    <Trophy className="w-3.5 h-3.5" />
                    {battleTally.overallWinner === "siteA"
                      ? `${data.siteA.page.domain} Leads Benchmark`
                      : battleTally.overallWinner === "siteB"
                      ? `${data.siteB.page.domain} Leads Benchmark`
                      : "Evenly Matched Contenders"}
                  </div>

                  <div className="text-2xl font-black text-white font-mono tracking-tight mb-1">
                    <span className="text-blue-400">{battleTally.winsA} Wins</span>
                    <span className="text-slate-500 font-sans text-sm mx-2">vs</span>
                    <span className="text-purple-400">{battleTally.winsB} Wins</span>
                    {battleTally.ties > 0 && (
                      <span className="text-xs text-slate-400 block font-normal mt-0.5">
                        ({battleTally.ties} Categories Tied)
                      </span>
                    )}
                  </div>

                  {/* Tug-of-war meter */}
                  <div className="mt-2.5 h-2 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                    <div
                      className="bg-blue-500 h-full transition-all duration-700"
                      style={{
                        width: `${(data.siteA.audit.overallScore / ((data.siteA.audit.overallScore + data.siteB.audit.overallScore) || 1)) * 100}%`
                      }}
                      title={`${data.siteA.page.domain}: ${data.siteA.audit.overallScore}`}
                    />
                    <div
                      className="bg-purple-500 h-full transition-all duration-700"
                      style={{
                        width: `${(data.siteB.audit.overallScore / ((data.siteA.audit.overallScore + data.siteB.audit.overallScore) || 1)) * 100}%`
                      }}
                      title={`${data.siteB.page.domain}: ${data.siteB.audit.overallScore}`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                    <span>{data.siteA.page.domain}</span>
                    <span>{data.siteB.page.domain}</span>
                  </div>
                </div>

                {/* SITE B HERO COCKPIT */}
                <div className="flex items-center gap-4 text-center sm:text-right w-full lg:w-auto justify-center sm:justify-end flex-row-reverse sm:flex-row">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400 block mb-0.5">
                      Website B Benchmark
                    </span>
                    <h2 className="text-lg font-black text-white font-mono tracking-tight flex items-center justify-end gap-2">
                      {battleTally.overallWinner === "siteB" && (
                        <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                      )}
                      {data.siteB.page.domain}
                    </h2>
                    <div className="flex items-center justify-end gap-2 mt-1.5 text-xs text-slate-300 font-mono">
                      <span>Speed: {data.siteB.performance.scores.performance}/100</span>
                      <span>•</span>
                      <span>LCP: {data.vitalsComparison.lcpB}</span>
                    </div>
                  </div>

                  <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                    <svg className="w-24 h-24 -rotate-90 transform" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#a855f7"
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={2 * Math.PI * 40 * (1 - data.siteB.audit.overallScore / 100)}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-white font-mono leading-none">
                        {data.siteB.audit.overallScore}
                      </span>
                      <span className="text-[10px] font-bold text-purple-400 uppercase mt-0.5 tracking-wider">
                        {data.siteB.audit.grade}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* IN-PAGE NAVIGATION TABS (5 COMPARATIVE SUITES) */}
            <div id="compare-tab-content" className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Executive Overview</span>
              </button>

              <button
                onClick={() => setActiveTab("categories")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "categories"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Diagnostic Matrix (4 Pillars)</span>
              </button>

              <button
                onClick={() => setActiveTab("vitals")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "vitals"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Gauge className="w-3.5 h-3.5" />
                <span>Core Web Vitals &amp; Speed</span>
              </button>

              <button
                onClick={() => setActiveTab("tech")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "tech"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Tech Stack Diff ({data.techComparison.shared.length + data.techComparison.uniqueToA.length + data.techComparison.uniqueToB.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("keywords")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "keywords"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <Hash className="w-3.5 h-3.5" />
                <span>Topic &amp; Content Gap</span>
              </button>
            </div>

            {/* TAB 1: EXECUTIVE OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* 4 Head-to-Head Key Dimension Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* 1. SEO Compliance */}
                  <div className="flat-card p-4 bg-white border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <span>Technical SEO</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        data.deltas.seoScoreDiff > 0
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : data.deltas.seoScoreDiff < 0
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}>
                        {data.deltas.seoScoreDiff > 0
                          ? `+${data.deltas.seoScoreDiff} Site A`
                          : data.deltas.seoScoreDiff < 0
                          ? `+${Math.abs(data.deltas.seoScoreDiff)} Site B`
                          : "Equal"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-100">
                        <span className="text-[11px] font-mono text-slate-500 truncate block mb-1">
                          {data.siteA.page.domain}
                        </span>
                        <span className="text-xl font-black text-slate-900 block leading-tight">
                          {data.siteA.audit.overallScore}
                        </span>
                        <span className="text-[10px] text-slate-400">Grade {data.siteA.audit.grade}</span>
                      </div>

                      <div className="p-2.5 bg-purple-50/50 rounded-lg border border-purple-100">
                        <span className="text-[11px] font-mono text-slate-500 truncate block mb-1">
                          {data.siteB.page.domain}
                        </span>
                        <span className="text-xl font-black text-slate-900 block leading-tight">
                          {data.siteB.audit.overallScore}
                        </span>
                        <span className="text-[10px] text-slate-400">Grade {data.siteB.audit.grade}</span>
                      </div>
                    </div>
                    <div className="mt-2.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                      <div
                        className="bg-blue-600 h-full transition-all duration-700"
                        style={{
                          width: `${(data.siteA.audit.overallScore / ((data.siteA.audit.overallScore + data.siteB.audit.overallScore) || 1)) * 100}%`
                        }}
                      />
                      <div
                        className="bg-purple-600 h-full transition-all duration-700"
                        style={{
                          width: `${(data.siteB.audit.overallScore / ((data.siteA.audit.overallScore + data.siteB.audit.overallScore) || 1)) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* 2. Open PageRank Authority */}
                  <div className="flat-card p-4 bg-white border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-indigo-600" />
                        Open PageRank
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono font-bold">
                        {data.trafficComparison?.isLiveA || data.trafficComparison?.isLiveB ? "Live Index" : "Authority"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2.5 bg-indigo-50/40 rounded-lg border border-indigo-100">
                        <span className="text-[11px] font-mono text-slate-500 truncate block mb-1">
                          {data.siteA.page.domain}
                        </span>
                        <span className="text-xl font-black text-indigo-900 block leading-tight">
                          {data.trafficComparison?.pageRankA !== null && data.trafficComparison?.pageRankA !== undefined
                            ? `${data.trafficComparison.pageRankA.toFixed(1)}`
                            : "N/A"}
                          <span className="text-[10px] text-slate-400 font-normal">/10</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 block truncate">
                          {data.trafficComparison?.rankFormattedA || "Unranked"}
                        </span>
                      </div>

                      <div className="p-2.5 bg-indigo-50/40 rounded-lg border border-indigo-100">
                        <span className="text-[11px] font-mono text-slate-500 truncate block mb-1">
                          {data.siteB.page.domain}
                        </span>
                        <span className="text-xl font-black text-indigo-900 block leading-tight">
                          {data.trafficComparison?.pageRankB !== null && data.trafficComparison?.pageRankB !== undefined
                            ? `${data.trafficComparison.pageRankB.toFixed(1)}`
                            : "N/A"}
                          <span className="text-[10px] text-slate-400 font-normal">/10</span>
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 block truncate">
                          {data.trafficComparison?.rankFormattedB || "Unranked"}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                      <div
                        className="bg-blue-600 h-full transition-all duration-700"
                        style={{
                          width: `${((data.trafficComparison?.pageRankA ?? 5) / (((data.trafficComparison?.pageRankA ?? 5) + (data.trafficComparison?.pageRankB ?? 5)) || 1)) * 100}%`
                        }}
                      />
                      <div
                        className="bg-purple-600 h-full transition-all duration-700"
                        style={{
                          width: `${((data.trafficComparison?.pageRankB ?? 5) / (((data.trafficComparison?.pageRankA ?? 5) + (data.trafficComparison?.pageRankB ?? 5)) || 1)) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* 3. PageSpeed Lab */}
                  <div className="flat-card p-4 bg-white border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <span>PageSpeed Score</span>
                      <span className="text-[10px] text-slate-400">Mobile Lab</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-[11px] font-mono text-slate-500 truncate block mb-1">
                          {data.siteA.page.domain}
                        </span>
                        <span className="text-xl font-black text-slate-900 block leading-tight">
                          {data.siteA.performance.scores.performance}
                        </span>
                        <span className="text-[10px] text-slate-500 truncate block">
                          LCP {data.siteA.performance.vitals.lcp.value}
                        </span>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-[11px] font-mono text-slate-500 truncate block mb-1">
                          {data.siteB.page.domain}
                        </span>
                        <span className="text-xl font-black text-slate-900 block leading-tight">
                          {data.siteB.performance.scores.performance}
                        </span>
                        <span className="text-[10px] text-slate-500 truncate block">
                          LCP {data.siteB.performance.vitals.lcp.value}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                      <div
                        className="bg-blue-600 h-full transition-all duration-700"
                        style={{
                          width: `${(data.siteA.performance.scores.performance / ((data.siteA.performance.scores.performance + data.siteB.performance.scores.performance) || 1)) * 100}%`
                        }}
                      />
                      <div
                        className="bg-purple-600 h-full transition-all duration-700"
                        style={{
                          width: `${(data.siteB.performance.scores.performance / ((data.siteA.performance.scores.performance + data.siteB.performance.scores.performance) || 1)) * 100}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* 4. Estimated Traffic Reach */}
                  <div className="flat-card p-4 bg-white border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <span>Monthly Reach</span>
                      <span className="text-[10px] text-slate-400">Est. Range</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-[11px] font-mono text-slate-500 truncate block mb-1">
                          {data.siteA.page.domain}
                        </span>
                        <span className="text-sm font-black text-slate-900 block leading-tight font-mono truncate">
                          {data.siteA.traffic.formattedRange.split(" /")[0]}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {data.siteA.traffic.confidence} Conf.
                        </span>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-[11px] font-mono text-slate-500 truncate block mb-1">
                          {data.siteB.page.domain}
                        </span>
                        <span className="text-sm font-black text-slate-900 block leading-tight font-mono truncate">
                          {data.siteB.traffic.formattedRange.split(" /")[0]}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {data.siteB.traffic.confidence} Conf.
                        </span>
                      </div>
                    </div>
                    <div className="mt-2.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                      <div
                        className="bg-blue-600 h-full transition-all duration-700"
                        style={{
                          width: `${(data.siteA.traffic.monthlyVisitsMidpoint / ((data.siteA.traffic.monthlyVisitsMidpoint + data.siteB.traffic.monthlyVisitsMidpoint) || 1)) * 100}%`
                        }}
                      />
                      <div
                        className="bg-purple-600 h-full transition-all duration-700"
                        style={{
                          width: `${(data.siteB.traffic.monthlyVisitsMidpoint / ((data.siteA.traffic.monthlyVisitsMidpoint + data.siteB.traffic.monthlyVisitsMidpoint) || 1)) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* DUAL 5-AXIS SPIDER RADAR CHART */}
                <div className="flat-card p-6 bg-white border border-slate-200 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-600" />
                        5-Axis Multi-Pillar Spider Radar Chart
                      </h3>
                      <p className="text-xs text-slate-500">
                        Geometric cross-comparison of overall technical health, Core Web Vitals, content semantics, transport security, and authority.
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono font-bold">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-blue-600" />
                        <span>{data.siteA.page.domain}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-purple-600" />
                        <span>{data.siteB.page.domain}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-6">
                    {/* SVG Polygon Canvas */}
                    <div className="flex justify-center relative">
                      <svg viewBox="0 0 300 270" className="w-full max-w-sm overflow-visible">
                        {/* Radar Grid Rings */}
                        {[0.25, 0.5, 0.75, 1.0].map((ring) => {
                          const points = radarAxes.map((_, i) => {
                            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                            const r = ring * radarMaxR;
                            return `${(radarCenterX + r * Math.cos(angle)).toFixed(1)},${(radarCenterY + r * Math.sin(angle)).toFixed(1)}`;
                          }).join(" ");
                          return (
                            <polygon
                              key={ring}
                              points={points}
                              fill="none"
                              stroke="#e2e8f0"
                              strokeWidth="1"
                              strokeDasharray={ring === 1.0 ? "none" : "3,3"}
                            />
                          );
                        })}

                        {/* Axis Radial Lines */}
                        {radarAxes.map((_, i) => {
                          const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                          const x2 = radarCenterX + radarMaxR * Math.cos(angle);
                          const y2 = radarCenterY + radarMaxR * Math.sin(angle);
                          return (
                            <line
                              key={i}
                              x1={radarCenterX}
                              y1={radarCenterY}
                              x2={x2}
                              y2={y2}
                              stroke="#cbd5e1"
                              strokeWidth="1"
                            />
                          );
                        })}

                        {/* Site B Polygon (Purple) */}
                        <polygon
                          points={polyB}
                          fill="rgba(147, 51, 234, 0.22)"
                          stroke="#9333ea"
                          strokeWidth="2.5"
                          className="transition-all duration-700"
                        />

                        {/* Site A Polygon (Blue) */}
                        <polygon
                          points={polyA}
                          fill="rgba(37, 99, 235, 0.22)"
                          stroke="#2563eb"
                          strokeWidth="2.5"
                          className="transition-all duration-700"
                        />

                        {/* Axis Labels & Vertex Dots */}
                        {radarAxes.map((axis, i) => {
                          const ptA = getRadarPoint(i, axis.valA);
                          const ptB = getRadarPoint(i, axis.valB);
                          const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                          const lx = radarCenterX + (radarMaxR + 26) * Math.cos(angle);
                          const ly = radarCenterY + (radarMaxR + 14) * Math.sin(angle);

                          return (
                            <g key={i}>
                              {/* Label */}
                              <text
                                x={lx}
                                y={ly}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-[10px] font-bold fill-slate-700 cursor-pointer"
                                onMouseEnter={() => setHoveredRadarAxis(i)}
                                onMouseLeave={() => setHoveredRadarAxis(null)}
                              >
                                {axis.label}
                              </text>

                              {/* Dot A */}
                              <circle
                                cx={ptA.x}
                                cy={ptA.y}
                                r="4"
                                fill="#2563eb"
                                stroke="#ffffff"
                                strokeWidth="1.5"
                              />

                              {/* Dot B */}
                              <circle
                                cx={ptB.x}
                                cy={ptB.y}
                                r="4"
                                fill="#9333ea"
                                stroke="#ffffff"
                                strokeWidth="1.5"
                              />
                            </g>
                          );
                        })}
                      </svg>
                    </div>

                    {/* Metric Breakdown Cards on the Right */}
                    <div className="space-y-3">
                      {radarAxes.map((axis, i) => {
                        const isHovered = hoveredRadarAxis === i;
                        const diff = axis.valA - axis.valB;
                        return (
                          <div
                            key={i}
                            onMouseEnter={() => setHoveredRadarAxis(i)}
                            onMouseLeave={() => setHoveredRadarAxis(null)}
                            className={`p-3 rounded-xl border transition-all ${
                              isHovered
                                ? "bg-slate-100 border-slate-300 shadow-xs"
                                : "bg-slate-50 border-slate-200"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-bold text-slate-900">{axis.label}</span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  diff > 0
                                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                                    : diff < 0
                                    ? "bg-purple-50 text-purple-700 border border-purple-200"
                                    : "bg-slate-100 text-slate-700 border border-slate-200"
                                }`}
                              >
                                {diff > 0 ? `${data.siteA.page.domain} (+${diff})` : diff < 0 ? `${data.siteB.page.domain} (+${Math.abs(diff)})` : "Tied"}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                              <div className="flex items-center justify-between p-1.5 rounded bg-white border border-slate-200">
                                <span className="text-blue-700 font-bold">{data.siteA.page.domain}</span>
                                <span className="font-extrabold">{axis.valA}{axis.unit}</span>
                              </div>
                              <div className="flex items-center justify-between p-1.5 rounded bg-white border border-slate-200">
                                <span className="text-purple-700 font-bold">{data.siteB.page.domain}</span>
                                <span className="font-extrabold">{axis.valB}{axis.unit}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Executive AI Comparative Analysis */}
                <div className="flat-card p-6 bg-white border border-purple-200 shadow-xs">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-600" />
                      <h3 className="text-base font-extrabold text-slate-900">
                        {data.aiComparativeSummary.headline}
                      </h3>
                    </div>
                    <span className="flat-badge bg-purple-50 text-purple-700 border-purple-200 font-bold">
                      Evidence-Based Diagnosis
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-purple-50/40 p-4 rounded-xl border border-purple-100 mb-5">
                    {data.aiComparativeSummary.overview}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="p-4 bg-blue-50/30 rounded-xl border border-blue-200">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2.5 flex items-center gap-1.5 font-mono">
                        <span>{data.siteA.page.domain}</span>
                        <span className="text-blue-600 font-sans font-semibold">Competitive Moats</span>
                      </h4>
                      <ul className="space-y-2 text-xs text-slate-700">
                        {data.aiComparativeSummary.strengthsSiteA.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-blue-600 font-black">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-purple-50/30 rounded-xl border border-purple-200">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-2.5 flex items-center gap-1.5 font-mono">
                        <span>{data.siteB.page.domain}</span>
                        <span className="text-purple-600 font-sans font-semibold">Competitive Moats</span>
                      </h4>
                      <ul className="space-y-2 text-xs text-slate-700">
                        {data.aiComparativeSummary.strengthsSiteB.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-purple-600 font-black">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 italic">
                    {data.aiComparativeSummary.conclusion}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: DIAGNOSTIC CATEGORY MATRIX */}
            {activeTab === "categories" && (
              <div className="flat-card p-6 bg-white border border-slate-200 shadow-xs space-y-5 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-600" />
                      Diagnostic Category Breakdown Matrix
                    </h3>
                    <p className="text-xs text-slate-500">
                      Standardized audit scores (scored out of 25 maximum points per diagnostic category).
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1 text-xs font-semibold">
                    <button
                      onClick={() => setWinnerFilter("all")}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        winnerFilter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setWinnerFilter("siteA")}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        winnerFilter === "siteA" ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                      }`}
                    >
                      Site A Leads
                    </button>
                    <button
                      onClick={() => setWinnerFilter("siteB")}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        winnerFilter === "siteB" ? "bg-purple-600 text-white" : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                      }`}
                    >
                      Site B Leads
                    </button>
                    <button
                      onClick={() => setWinnerFilter("tie")}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        winnerFilter === "tie" ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      Tied
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {categoryMatrixItems.map((cat, idx) => {
                    const maxScore = 25;
                    const isWinnerA = cat.winner === "siteA";
                    const isWinnerB = cat.winner === "siteB";

                    return (
                      <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-extrabold text-slate-900">{cat.name}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">{cat.desc}</p>
                          </div>

                          <span
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border shrink-0 ${
                              isWinnerA
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : isWinnerB
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            }`}
                          >
                            {isWinnerA ? `Winner: ${data.siteA.page.domain}` : isWinnerB ? `Winner: ${data.siteB.page.domain}` : "Equal / Tied"}
                          </span>
                        </div>

                        {/* Dual Progress Bars */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          {/* Site A */}
                          <div className="p-3 rounded-lg bg-white border border-slate-200">
                            <div className="flex justify-between text-xs font-mono mb-1.5">
                              <span className="font-bold text-blue-700">{data.siteA.page.domain}</span>
                              <span className="font-extrabold text-slate-900">{cat.scoreA} / {maxScore} pts</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full transition-all duration-700"
                                style={{ width: `${(cat.scoreA / maxScore) * 100}%` }}
                              />
                            </div>
                          </div>

                          {/* Site B */}
                          <div className="p-3 rounded-lg bg-white border border-slate-200">
                            <div className="flex justify-between text-xs font-mono mb-1.5">
                              <span className="font-bold text-purple-700">{data.siteB.page.domain}</span>
                              <span className="font-extrabold text-slate-900">{cat.scoreB} / {maxScore} pts</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-purple-600 rounded-full transition-all duration-700"
                                style={{ width: `${(cat.scoreB / maxScore) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: CORE WEB VITALS & SPEED LAB */}
            {activeTab === "vitals" && (
              <div className="flat-card p-6 bg-white border border-slate-200 shadow-xs space-y-5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-emerald-600" />
                      Core Web Vitals &amp; PageSpeed Metrics
                    </h3>
                    <p className="text-xs text-slate-500">
                      Standardized Google Lighthouse Mobile Lab metrics, server latency, and byte payload sizes.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                    Lighthouse Telemetry
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* LCP Card */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Largest Contentful Paint</span>
                      <span className="text-[10px] font-mono text-slate-500">Target &lt; 2.5s</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                      <div className="p-2 rounded bg-white border border-slate-200">
                        <span className="text-[10px] text-blue-700 font-bold block">{data.siteA.page.domain}</span>
                        <span className="text-sm font-black text-slate-900">{data.vitalsComparison.lcpA}</span>
                      </div>
                      <div className="p-2 rounded bg-white border border-slate-200">
                        <span className="text-[10px] text-purple-700 font-bold block">{data.siteB.page.domain}</span>
                        <span className="text-sm font-black text-slate-900">{data.vitalsComparison.lcpB}</span>
                      </div>
                    </div>
                    <div className="text-[11px] font-bold text-center text-emerald-700 pt-1">
                      {data.siteA.performance.vitals.lcp.numericValue < data.siteB.performance.vitals.lcp.numericValue
                        ? `✓ ${data.siteA.page.domain} Faster Loading`
                        : `✓ ${data.siteB.page.domain} Faster Loading`}
                    </div>
                  </div>

                  {/* FCP Card */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">First Contentful Paint</span>
                      <span className="text-[10px] font-mono text-slate-500">Target &lt; 1.8s</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                      <div className="p-2 rounded bg-white border border-slate-200">
                        <span className="text-[10px] text-blue-700 font-bold block">{data.siteA.page.domain}</span>
                        <span className="text-sm font-black text-slate-900">{data.vitalsComparison.fcpA}</span>
                      </div>
                      <div className="p-2 rounded bg-white border border-slate-200">
                        <span className="text-[10px] text-purple-700 font-bold block">{data.siteB.page.domain}</span>
                        <span className="text-sm font-black text-slate-900">{data.vitalsComparison.fcpB}</span>
                      </div>
                    </div>
                    <div className="text-[11px] font-bold text-center text-emerald-700 pt-1">
                      {data.siteA.performance.vitals.fcp.numericValue < data.siteB.performance.vitals.fcp.numericValue
                        ? `✓ ${data.siteA.page.domain} First Render`
                        : `✓ ${data.siteB.page.domain} First Render`}
                    </div>
                  </div>

                  {/* TTFB Card */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Server Latency (TTFB)</span>
                      <span className="text-[10px] font-mono text-slate-500">Target &lt; 200ms</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                      <div className="p-2 rounded bg-white border border-slate-200">
                        <span className="text-[10px] text-blue-700 font-bold block">{data.siteA.page.domain}</span>
                        <span className="text-sm font-black text-slate-900">{data.vitalsComparison.ttfbA}</span>
                      </div>
                      <div className="p-2 rounded bg-white border border-slate-200">
                        <span className="text-[10px] text-purple-700 font-bold block">{data.siteB.page.domain}</span>
                        <span className="text-sm font-black text-slate-900">{data.vitalsComparison.ttfbB}</span>
                      </div>
                    </div>
                    <div className="text-[11px] font-bold text-center text-emerald-700 pt-1">
                      {data.siteA.page.responseTimeMs < data.siteB.page.responseTimeMs
                        ? `✓ ${data.siteA.page.domain} Snappier Backend`
                        : `✓ ${data.siteB.page.domain} Snappier Backend`}
                    </div>
                  </div>

                  {/* Cumulative Layout Shift */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Cumulative Layout Shift</span>
                      <span className="text-[10px] font-mono text-slate-500">Target &lt; 0.1</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                      <div className="p-2 rounded bg-white border border-slate-200">
                        <span className="text-[10px] text-blue-700 font-bold block">{data.siteA.page.domain}</span>
                        <span className="text-sm font-black text-slate-900">{data.vitalsComparison.clsA}</span>
                      </div>
                      <div className="p-2 rounded bg-white border border-slate-200">
                        <span className="text-[10px] text-purple-700 font-bold block">{data.siteB.page.domain}</span>
                        <span className="text-sm font-black text-slate-900">{data.vitalsComparison.clsB}</span>
                      </div>
                    </div>
                    <div className="text-[11px] font-bold text-center text-slate-600 pt-1">
                      Visual Stability Verified
                    </div>
                  </div>

                  {/* Transfer Size */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Total Page Transfer Size</span>
                      <span className="text-[10px] font-mono text-slate-500">Wire Payload</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                      <div className="p-2 rounded bg-white border border-slate-200">
                        <span className="text-[10px] text-blue-700 font-bold block">{data.siteA.page.domain}</span>
                        <span className="text-sm font-black text-slate-900">{data.vitalsComparison.pageSizeA}</span>
                      </div>
                      <div className="p-2 rounded bg-white border border-slate-200">
                        <span className="text-[10px] text-purple-700 font-bold block">{data.siteB.page.domain}</span>
                        <span className="text-sm font-black text-slate-900">{data.vitalsComparison.pageSizeB}</span>
                      </div>
                    </div>
                    <div className="text-[11px] font-bold text-center text-emerald-700 pt-1">
                      {data.siteA.page.contentLengthBytes < data.siteB.page.contentLengthBytes
                        ? `✓ ${data.siteA.page.domain} Lighter Network Payload`
                        : `✓ ${data.siteB.page.domain} Lighter Network Payload`}
                    </div>
                  </div>

                  {/* Overall PageSpeed Score */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Overall PageSpeed Score</span>
                      <span className="text-[10px] font-mono text-slate-500">0 - 100</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                      <div className="p-2 rounded bg-white border border-slate-200">
                        <span className="text-[10px] text-blue-700 font-bold block">{data.siteA.page.domain}</span>
                        <span className="text-sm font-black text-blue-700">{data.siteA.performance.scores.performance}</span>
                      </div>
                      <div className="p-2 rounded bg-white border border-slate-200">
                        <span className="text-[10px] text-purple-700 font-bold block">{data.siteB.page.domain}</span>
                        <span className="text-sm font-black text-purple-700">{data.siteB.performance.scores.performance}</span>
                      </div>
                    </div>
                    <div className="text-[11px] font-bold text-center text-slate-700 pt-1">
                      {data.deltas.performanceScoreDiff > 0
                        ? `✓ ${data.siteA.page.domain} Leads by +${data.deltas.performanceScoreDiff} pts`
                        : data.deltas.performanceScoreDiff < 0
                        ? `✓ ${data.siteB.page.domain} Leads by +${Math.abs(data.deltas.performanceScoreDiff)} pts`
                        : "Identical Performance"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: TECH STACK CROSS-DIFF */}
            {activeTab === "tech" && (
              <div className="flat-card p-6 bg-white border border-slate-200 shadow-xs space-y-5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-purple-600" />
                      Technology Stack Cross-Diff &amp; Framework Footprint
                    </h3>
                    <p className="text-xs text-slate-500">
                      Discovers web frameworks, analytics platforms, CDN routing layers, and infrastructure libraries.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-purple-50 text-purple-700 border border-purple-200">
                    {data.techComparison.shared.length + data.techComparison.uniqueToA.length + data.techComparison.uniqueToB.length} Techs Detected
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Shared Technologies */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Shared Components
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 font-bold text-slate-700">
                        {data.techComparison.shared.length} shared
                      </span>
                    </div>

                    {data.techComparison.shared.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {data.techComparison.shared.map((t, idx) => (
                          <span key={idx} className="flat-badge bg-emerald-50 text-emerald-700 border-emerald-200 font-mono text-xs">
                            ✓ {t}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No shared frameworks or CDNs discovered.</p>
                    )}
                  </div>

                  {/* Unique to Site A */}
                  <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-900 font-mono truncate max-w-[160px]">
                        Only on {data.siteA.page.domain}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 font-bold text-blue-700">
                        {data.techComparison.uniqueToA.length} unique
                      </span>
                    </div>

                    {data.techComparison.uniqueToA.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {data.techComparison.uniqueToA.map((t, idx) => (
                          <span key={idx} className="flat-badge bg-blue-50 text-blue-700 border-blue-200 font-mono text-xs">
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No unique technologies found.</p>
                    )}
                  </div>

                  {/* Unique to Site B */}
                  <div className="p-4 bg-purple-50/40 rounded-xl border border-purple-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-900 font-mono truncate max-w-[160px]">
                        Only on {data.siteB.page.domain}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 font-bold text-purple-700">
                        {data.techComparison.uniqueToB.length} unique
                      </span>
                    </div>

                    {data.techComparison.uniqueToB.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {data.techComparison.uniqueToB.map((t, idx) => (
                          <span key={idx} className="flat-badge bg-purple-50 text-purple-700 border-purple-200 font-mono text-xs">
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No unique technologies found.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: ON-PAGE SEMANTIC TOPIC & KEYWORD GAP */}
            {activeTab === "keywords" && data.keywordGap && (
              <div className="flat-card p-6 bg-white border border-slate-200 shadow-xs space-y-5 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Hash className="w-4 h-4 text-purple-600" />
                      Semantic Topic &amp; Content Gap Matrix
                    </h3>
                    <p className="text-xs text-slate-500">
                      Discovers exclusive on-page content themes, high-density keywords, and direct shared phrase overlap.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={keywordSearch}
                        onChange={(e) => setKeywordSearch(e.target.value)}
                        placeholder="Filter keywords..."
                        className="pl-8 pr-3 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-purple-600"
                      />
                    </div>

                    <button
                      onClick={() => {
                        if (data.keywordGap) {
                          exportKeywordGapCsv(
                            data.siteA.page.domain,
                            data.siteB.page.domain,
                            data.keywordGap
                          );
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-600" />
                      Export CSV
                    </button>
                  </div>
                </div>

                {/* 3 Columns: Unique to A, Overlap, Unique to B */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Column 1: Unique to Site A */}
                  <div className="p-4 bg-blue-50/30 rounded-xl border border-blue-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-900 font-mono truncate max-w-[150px]">
                        {data.siteA.page.domain} Exclusives
                      </span>
                      <span className="text-[10px] font-mono text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded font-bold">
                        +{filteredKeywordGap.uniqueToA.length} terms
                      </span>
                    </div>

                    {filteredKeywordGap.uniqueToA.length > 0 ? (
                      <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                        {filteredKeywordGap.uniqueToA.map((kw, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-lg bg-white border border-blue-100 text-xs font-mono shadow-2xs"
                          >
                            <span className="font-semibold text-slate-800 truncate mr-2">{kw.phrase}</span>
                            <span className="text-blue-700 font-extrabold">{kw.density.toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No matching exclusive keywords.</p>
                    )}
                  </div>

                  {/* Column 2: Direct Shared Overlap */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Head-to-Head Overlap
                      </span>
                      <span className="text-[10px] font-mono text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded font-bold">
                        {filteredKeywordGap.topOverlap.length} matched
                      </span>
                    </div>

                    {filteredKeywordGap.topOverlap.length > 0 ? (
                      <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                        {filteredKeywordGap.topOverlap.map((kw, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs font-mono shadow-2xs"
                          >
                            <span className="font-semibold text-slate-900 truncate mr-2">{kw.phrase}</span>
                            <div className="flex items-center gap-1.5 text-[11px] shrink-0">
                              <span className="text-blue-700 font-bold">{kw.countA}×</span>
                              <span className="text-slate-300">vs</span>
                              <span className="text-purple-700 font-bold">{kw.countB}×</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No matching shared overlap terms.</p>
                    )}
                  </div>

                  {/* Column 3: Unique to Site B */}
                  <div className="p-4 bg-purple-50/30 rounded-xl border border-purple-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-900 font-mono truncate max-w-[150px]">
                        {data.siteB.page.domain} Exclusives
                      </span>
                      <span className="text-[10px] font-mono text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded font-bold">
                        +{filteredKeywordGap.uniqueToB.length} terms
                      </span>
                    </div>

                    {filteredKeywordGap.uniqueToB.length > 0 ? (
                      <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                        {filteredKeywordGap.uniqueToB.map((kw, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-lg bg-white border border-purple-100 text-xs font-mono shadow-2xs"
                          >
                            <span className="font-semibold text-slate-800 truncate mr-2">{kw.phrase}</span>
                            <span className="text-purple-700 font-extrabold">{kw.density.toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No matching exclusive keywords.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
