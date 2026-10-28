"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FileSearch,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  GitCompare,
  TrendingUp,
  Download,
  Copy,
  Check,
  Play,
  RefreshCw,
  AlertCircle,
  XCircle,
  CheckCircle2,
  Layers,
  FileText,
  BookOpen,
  Hash,
  ExternalLink,
  ShieldCheck,
  Scale,
  Trophy,
  Target,
  Flame,
  ArrowUpDown,
  SlidersHorizontal,
  Search,
  Share2,
  ArrowUp,
  Crown,
  X,
  Activity,
  Globe,
  CheckSquare,
  Square,
  Zap,
  Info,
  ShieldAlert,
  ChevronRight,
  Code2,
} from "lucide-react";
import { usePlan } from "@/lib/auth/PlanContext";
import { formatTierName } from "@/lib/auth/tierLimits";

interface KeywordItem {
  term: string;
  targetCount: number;
  competitorCount: number;
  gapStatus: "missing" | "shared" | "lead";
  opportunityScore?: number;
  inCompTitleOrH1?: boolean;
  inTargetTitleOrH1?: boolean;
  isTwoWord?: boolean;
}

interface ContentGapData {
  success: boolean;
  timestamp: string;
  target: {
    domain: string;
    url: string;
    wordCount: number;
    title: string;
    h1Count: number;
    h2Count: number;
  };
  competitor: {
    domain: string;
    url: string;
    wordCount: number;
    title: string;
    h1Count: number;
    h2Count: number;
  };
  gapSummary: {
    missingKeywordsCount: number;
    sharedKeywordsCount: number;
    targetLeadsCount: number;
    wordDisparity: number;
    topicCoverageScore: number;
  };
  missingKeywords: KeywordItem[];
  sharedKeywords: KeywordItem[];
  targetLeads: KeywordItem[];
  missingTopics: string[];
  suggestedOutline: Array<{
    heading: string;
    recommendedKeywords: string[];
    importance: string;
  }>;
}

const DEMO_GAP: ContentGapData = {
  success: true,
  timestamp: new Date().toISOString(),
  target: {
    domain: "stripe.com",
    url: "https://stripe.com",
    wordCount: 2480,
    title: "Financial Infrastructure for the Internet",
    h1Count: 1,
    h2Count: 12,
  },
  competitor: {
    domain: "paypal.com",
    url: "https://paypal.com",
    wordCount: 3120,
    title: "Digital Wallets, Money Management and Payments",
    h1Count: 1,
    h2Count: 16,
  },
  gapSummary: {
    missingKeywordsCount: 18,
    sharedKeywordsCount: 42,
    targetLeadsCount: 26,
    wordDisparity: 640,
    topicCoverageScore: 74,
  },
  missingKeywords: [
    { term: "buyer protection guarantee", targetCount: 0, competitorCount: 8, gapStatus: "missing", opportunityScore: 95, inCompTitleOrH1: true, isTwoWord: true },
    { term: "consumer digital wallet app", targetCount: 0, competitorCount: 9, gapStatus: "missing", opportunityScore: 92, inCompTitleOrH1: true, isTwoWord: true },
    { term: "peer-to-peer money transfer", targetCount: 0, competitorCount: 6, gapStatus: "missing", opportunityScore: 88, inCompTitleOrH1: false, isTwoWord: true },
    { term: "cross-border currency conversion", targetCount: 0, competitorCount: 7, gapStatus: "missing", opportunityScore: 84, inCompTitleOrH1: false, isTwoWord: true },
    { term: "point of sale card reader", targetCount: 0, competitorCount: 5, gapStatus: "missing", opportunityScore: 79, inCompTitleOrH1: false, isTwoWord: true },
    { term: "crypto checkout settlement", targetCount: 0, competitorCount: 4, gapStatus: "missing", opportunityScore: 72, inCompTitleOrH1: false, isTwoWord: true },
    { term: "cashback rewards program", targetCount: 0, competitorCount: 5, gapStatus: "missing", opportunityScore: 68, inCompTitleOrH1: false, isTwoWord: true },
    { term: "installments pay in 4", targetCount: 0, competitorCount: 6, gapStatus: "missing", opportunityScore: 65, inCompTitleOrH1: false, isTwoWord: true },
    { term: "contactless qr code payment", targetCount: 0, competitorCount: 5, gapStatus: "missing", opportunityScore: 63, inCompTitleOrH1: false, isTwoWord: true },
    { term: "instant bank debit transfer", targetCount: 0, competitorCount: 4, gapStatus: "missing", opportunityScore: 60, inCompTitleOrH1: false, isTwoWord: true },
  ],
  sharedKeywords: [
    { term: "online payments", targetCount: 14, competitorCount: 18, gapStatus: "shared", isTwoWord: true },
    { term: "fraud detection radar", targetCount: 8, competitorCount: 6, gapStatus: "shared", isTwoWord: true },
    { term: "merchant accounts", targetCount: 6, competitorCount: 12, gapStatus: "shared", isTwoWord: true },
    { term: "recurring billing invoices", targetCount: 11, competitorCount: 8, gapStatus: "shared", isTwoWord: true },
    { term: "pci dss compliance", targetCount: 5, competitorCount: 4, gapStatus: "shared", isTwoWord: true },
  ],
  targetLeads: [
    { term: "developer api endpoints", targetCount: 16, competitorCount: 0, gapStatus: "lead", inTargetTitleOrH1: true, isTwoWord: true },
    { term: "saas subscription billing", targetCount: 14, competitorCount: 0, gapStatus: "lead", inTargetTitleOrH1: false, isTwoWord: true },
    { term: "webhooks event latency", targetCount: 9, competitorCount: 0, gapStatus: "lead", inTargetTitleOrH1: false, isTwoWord: true },
    { term: "custom checkout elements", targetCount: 11, competitorCount: 0, gapStatus: "lead", inTargetTitleOrH1: false, isTwoWord: true },
    { term: "revenue recognition reporting", targetCount: 7, competitorCount: 0, gapStatus: "lead", inTargetTitleOrH1: false, isTwoWord: true },
  ],
  missingTopics: [
    "Consumer Buyer Protection Program & Chargeback Cover",
    "Physical Point of Sale Hardware Kits & Terminal SDK",
    "QR Code Contactless In-Store Checkout Solutions",
    "Global Currency Exchange Rate Calculator & FX Hedging",
    "Pay Later & Buy Now Pay Later Installment Options",
    "Direct Peer-to-Peer Transfer Fees & Mobile App Setup",
  ],
  suggestedOutline: [
    {
      heading: "Comprehensive Consumer Protection & Dispute Resolution",
      recommendedKeywords: ["buyer protection guarantee", "chargeback protection", "resolution center", "fraud screening"],
      importance: "Critical Commercial ROI",
    },
    {
      heading: "In-Person Point of Sale & Terminal SDK Integrations",
      recommendedKeywords: ["point of sale card reader", "tap to pay on mobile", "omnichannel payments hardware"],
      importance: "High Search Volume",
    },
    {
      heading: "Cross-Border FX Settlement & International Wallet Support",
      recommendedKeywords: ["cross-border currency conversion", "crypto checkout settlement", "multi-currency payout"],
      importance: "High Volume",
    },
    {
      heading: "Flexible Installment Billing & Pay Later Options",
      recommendedKeywords: ["installments pay in 4", "consumer credit lines", "checkout conversion booster"],
      importance: "Medium Commercial",
    },
  ],
};

const SAMPLE_PAIRS = [
  { target: "https://stripe.com", competitor: "https://paypal.com", label: "Stripe vs PayPal" },
  { target: "https://vercel.com", competitor: "https://netlify.com", label: "Vercel vs Netlify" },
  { target: "https://supabase.com", competitor: "https://firebase.google.com", label: "Supabase vs Firebase" },
  { target: "https://github.com", competitor: "https://gitlab.com", label: "GitHub vs GitLab" },
  { target: "https://notion.so", competitor: "https://linear.app", label: "Notion vs Linear" },
  { target: "https://airbnb.com", competitor: "https://booking.com", label: "Airbnb vs Booking" },
];

export default function ContentGapClient() {
  const { tier, triggerUpgradeModal } = usePlan();
  const [targetUrl, setTargetUrl] = useState("https://stripe.com");
  const [competitorUrl, setCompetitorUrl] = useState("https://paypal.com");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ContentGapData | null>(DEMO_GAP);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 6 Interactive Suites
  const [activeTab, setActiveTab] = useState<"missing" | "moats" | "topics" | "outline" | "shared" | "distribution">("missing");
  const [copiedTerm, setCopiedTerm] = useState<string | null>(null);
  const [copiedBrief, setCopiedBrief] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedAllMissing, setCopiedAllMissing] = useState(false);

  // Multi-select keywords in Gaps table
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());

  // AI Prompt Customization Mode
  const [aiPromptMode, setAiPromptMode] = useState<"guide" | "landing" | "compare">("guide");

  // Filter & Search Controls
  const [missingSearch, setMissingSearch] = useState("");
  const [missingFilter, setMissingFilter] = useState<"all" | "highPriority" | "inHeader" | "transactional" | "commercial" | "twoWord">("all");
  const [missingSort, setMissingSort] = useState<"oppDesc" | "compFreqDesc" | "alpha">("oppDesc");
  const [moatsSearch, setMoatsSearch] = useState("");
  const [sharedSearch, setSharedSearch] = useState("");

  // Sticky sub-navbar state
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 420);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 2400);
  };

  const normalizeInputUrl = (raw: string) => {
    let u = raw.trim();
    if (!u) return "";
    if (!/^https?:\/\//i.test(u)) {
      u = "https://" + u;
    }
    return u;
  };

  const inferKeywordIntent = (term: string): { label: "Transactional" | "Commercial" | "Technical" | "Informational"; color: string; bg: string } => {
    const t = term.toLowerCase();
    if (/buy|price|cost|checkout|pay|reader|fee|wallet|card|transfer|rate|settlement|installment/i.test(t)) {
      return { label: "Transactional", color: "text-emerald-700 border-emerald-200", bg: "bg-emerald-50" };
    }
    if (/protection|guarantee|review|comparison|vs|best|software|platform|rewards|service|consumer/i.test(t)) {
      return { label: "Commercial", color: "text-amber-700 border-amber-200", bg: "bg-amber-50" };
    }
    if (/api|sdk|endpoint|webhook|latency|code|script|crypto|radar|pci|dss|compliance/i.test(t)) {
      return { label: "Technical", color: "text-indigo-700 border-indigo-200", bg: "bg-indigo-50" };
    }
    return { label: "Informational", color: "text-blue-700 border-blue-200", bg: "bg-blue-50" };
  };

  const handleSelectSample = (t: string, c: string) => {
    setTargetUrl(t);
    setCompetitorUrl(c);
  };

  const handleSwap = () => {
    const temp = targetUrl;
    setTargetUrl(competitorUrl);
    setCompetitorUrl(temp);
    showToast("Swapped target and competitor domains!");
  };

  const handleTabClick = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (typeof window !== "undefined" && window.scrollY > 280) {
      setTimeout(() => {
        const el = document.getElementById("content-gap-tabs");
        if (el) {
          const yOffset = -124;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
        }
      }, 40);
    }
  };

  const handleRunAnalysis = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!targetUrl.trim() || !competitorUrl.trim()) {
      setError("Please specify both Your Webpage and Competitor Webpage URLs.");
      return;
    }

    const normTarget = normalizeInputUrl(targetUrl);
    const normCompetitor = normalizeInputUrl(competitorUrl);

    const isSample = SAMPLE_PAIRS.some(
      (p) =>
        normTarget.toLowerCase().includes(p.target) || normCompetitor.toLowerCase().includes(p.competitor)
    );

    if (tier === "free" && !isSample) {
      triggerUpgradeModal({
        requiredTier: "pro",
        featureTitle: "Custom Competitor Content Gap",
        description:
          "Free tier includes sample comparisons. Upgrade to Pro Analyst to evaluate custom domains, extract semantic topic gaps, and download content outlines.",
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tools/content-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUrl: normTarget,
          competitorUrl: normCompetitor,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to analyze content gap.");
      }

      setData(json);
      setSelectedKeywords(new Set());
      showToast(`Content gap analyzed: ${json.target.domain} vs ${json.competitor.domain}`);
    } catch (err: unknown) {
      setError((err as Error).message || "An unexpected error occurred during content gap analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (term: string) => {
    navigator.clipboard.writeText(term);
    setCopiedTerm(term);
    showToast(`Copied "${term}" to clipboard`);
    setTimeout(() => setCopiedTerm(null), 2000);
  };

  const toggleSelectKeyword = (term: string) => {
    setSelectedKeywords((prev) => {
      const next = new Set(prev);
      if (next.has(term)) next.delete(term);
      else next.add(term);
      return next;
    });
  };

  const handleSelectAllVisible = () => {
    if (selectedKeywords.size === filteredMissingKeywords.length && filteredMissingKeywords.length > 0) {
      setSelectedKeywords(new Set());
    } else {
      setSelectedKeywords(new Set(filteredMissingKeywords.map((k) => k.term)));
    }
  };

  const handleCopySelected = () => {
    if (selectedKeywords.size === 0) return;
    const text = Array.from(selectedKeywords).join(", ");
    navigator.clipboard.writeText(text);
    showToast(`Copied ${selectedKeywords.size} selected keywords to clipboard!`);
  };

  const handleCopyAllMissing = () => {
    if (!data) return;
    const allTerms = filteredMissingKeywords.map((k) => k.term).join(", ");
    navigator.clipboard.writeText(allTerms);
    setCopiedAllMissing(true);
    showToast(`Copied ${filteredMissingKeywords.length} missing keywords to clipboard!`);
    setTimeout(() => setCopiedAllMissing(false), 2000);
  };

  const handleExportCsv = () => {
    if (!data) return;
    const rows = [
      ["Keyword", "Gap Status", "Opportunity Score", "In Competitor H1/Title", `${data.target.domain} Frequency`, `${data.competitor.domain} Frequency`],
      ...data.missingKeywords.map((k) => [k.term, "Missing on Target", k.opportunityScore ?? "N/A", k.inCompTitleOrH1 ? "YES" : "NO", k.targetCount, k.competitorCount]),
      ...data.targetLeads.map((k) => [k.term, "Target Moat (Lead)", "Moat", k.inTargetTitleOrH1 ? "YES" : "NO", k.targetCount, k.competitorCount]),
      ...data.sharedKeywords.map((k) => [k.term, "Shared", "Shared", "N/A", k.targetCount, k.competitorCount]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((e) => e.map((val) => `"${val}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `content-gap-${data.target.domain}-vs-${data.competitor.domain}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Downloaded Content Gap CSV");
  };

  const handleCopyMarkdownBrief = () => {
    if (!data) return;
    let brief = `# Editorial Content Gap & Strategy Brief\n\n`;
    brief += `**Target Webpage**: ${data.target.domain} (${data.target.wordCount.toLocaleString()} words)\n`;
    brief += `**Competitor Webpage**: ${data.competitor.domain} (${data.competitor.wordCount.toLocaleString()} words)\n`;
    brief += `**Topic Coverage Overlap**: ${data.gapSummary.topicCoverageScore}%\n`;
    brief += `**Word Disparity**: ${data.gapSummary.wordDisparity > 0 ? `Competitor is +${data.gapSummary.wordDisparity} words longer` : `Target leads by ${Math.abs(data.gapSummary.wordDisparity)} words`}\n\n`;

    brief += `## Recommended Content Outline to Win the Gap:\n\n`;
    data.suggestedOutline.forEach((item, idx) => {
      brief += `### Section ${idx + 1}: ${item.heading} [${item.importance}]\n`;
      brief += `*Recommended Keywords to Integrate*: ${item.recommendedKeywords.join(", ")}\n\n`;
    });

    brief += `## Priority Missing Semantic Keywords (${data.missingKeywords.length}):\n`;
    data.missingKeywords.slice(0, 20).forEach((item, idx) => {
      brief += `${idx + 1}. **${item.term}** — Competitor Frequency: ${item.competitorCount}× | Opportunity Score: ${item.opportunityScore ?? 80}/100${item.inCompTitleOrH1 ? " [In Competitor H1/Title]" : ""}\n`;
    });

    brief += `\n## Target Defensive Moats to Protect (${data.targetLeads.length}):\n`;
    data.targetLeads.slice(0, 10).forEach((item, idx) => {
      brief += `- **${item.term}** (${item.targetCount}× occurrences on your page)\n`;
    });

    brief += `\n*Generated by SEO Audit Intel Content Gap Studio*\n`;

    navigator.clipboard.writeText(brief);
    setCopiedBrief(true);
    showToast("Editorial Content Brief copied to clipboard!");
    setTimeout(() => setCopiedBrief(false), 2000);
  };

  const handleCopyAiPrompt = () => {
    if (!data) return;
    const targetKeywords = selectedKeywords.size > 0 
      ? Array.from(selectedKeywords).map((k) => `"${k}"`).join(", ")
      : data.missingKeywords.slice(0, 12).map((k) => `"${k.term}"`).join(", ");
    
    const topics = data.missingTopics.slice(0, 4).map((t) => `"${t}"`).join(", ");

    let modeDescription = "comprehensive topic guide and section refresh";
    if (aiPromptMode === "landing") {
      modeDescription = "high-converting product landing page section copy";
    } else if (aiPromptMode === "compare") {
      modeDescription = "head-to-head comparison page against " + data.competitor.domain;
    }

    const prompt = `Act as an expert enterprise SEO copywriter and search intent specialist.
Task: Write a ${modeDescription} for "${data.target.domain}" to close the topical and semantic content gap against competitor "${data.competitor.domain}".

Competitor currently ranks for these priority subheadings:
${topics}

Please write an in-depth, authoritative, and natural content draft incorporating these high-intent missing semantic keywords:
${targetKeywords}

Requirements:
1. Maintain high EEAT topical authority and natural semantic integration (no keyword stuffing).
2. Include direct, concise answers for Google Featured Snippets and People Also Ask boxes.
3. Structure with clean H2 and H3 subheadings with actionable bullet points.
4. Target an additional ${Math.max(500, Math.abs(data.gapSummary.wordDisparity))} words of substantive copy depth to achieve topical parity.`;

    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    showToast("AI Copywriter Prompt copied to clipboard!");
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  // Filtered Missing Keywords
  const filteredMissingKeywords = useMemo(() => {
    if (!data?.missingKeywords) return [];
    let list = [...data.missingKeywords];

    if (missingSearch.trim()) {
      const q = missingSearch.toLowerCase().trim();
      list = list.filter((k) => k.term.toLowerCase().includes(q));
    }

    if (missingFilter === "highPriority") {
      list = list.filter((k) => (k.opportunityScore ?? 0) >= 80);
    } else if (missingFilter === "inHeader") {
      list = list.filter((k) => k.inCompTitleOrH1);
    } else if (missingFilter === "transactional") {
      list = list.filter((k) => inferKeywordIntent(k.term).label === "Transactional");
    } else if (missingFilter === "commercial") {
      list = list.filter((k) => inferKeywordIntent(k.term).label === "Commercial");
    } else if (missingFilter === "twoWord") {
      list = list.filter((k) => k.isTwoWord || k.term.includes(" "));
    }

    if (missingSort === "oppDesc") {
      list.sort((a, b) => (b.opportunityScore ?? 0) - (a.opportunityScore ?? 0));
    } else if (missingSort === "compFreqDesc") {
      list.sort((a, b) => b.competitorCount - a.competitorCount);
    } else if (missingSort === "alpha") {
      list.sort((a, b) => a.term.localeCompare(b.term));
    }

    return list;
  }, [data?.missingKeywords, missingSearch, missingFilter, missingSort]);

  // Filtered Moats
  const filteredMoats = useMemo(() => {
    if (!data?.targetLeads) return [];
    if (!moatsSearch.trim()) return data.targetLeads;
    const q = moatsSearch.toLowerCase().trim();
    return data.targetLeads.filter((k) => k.term.toLowerCase().includes(q));
  }, [data?.targetLeads, moatsSearch]);

  // Filtered Shared
  const filteredShared = useMemo(() => {
    if (!data?.sharedKeywords) return [];
    if (!sharedSearch.trim()) return data.sharedKeywords;
    const q = sharedSearch.toLowerCase().trim();
    return data.sharedKeywords.filter((k) => k.term.toLowerCase().includes(q));
  }, [data?.sharedKeywords, sharedSearch]);

  // Highest Opportunity Keyword
  const topOpportunityKeyword = useMemo(() => {
    if (!data?.missingKeywords || data.missingKeywords.length === 0) return null;
    return [...data.missingKeywords].sort((a, b) => (b.opportunityScore ?? 0) - (a.opportunityScore ?? 0))[0];
  }, [data?.missingKeywords]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 border border-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* FULL-WIDTH FIXED SUB-NAVBAR ON SCROLL (SLEEK MAC-STYLE PILL COCKPIT) */}
      {isScrolled && data && (
        <aside
          aria-label="Content Gap Sub-Navigation"
          className="fixed top-16 inset-x-0 z-40 bg-white/92 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] py-2 px-4 sm:px-6 lg:px-8 transition-all duration-200 animate-in fade-in slide-in-from-top-1 no-print"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            {/* Left: Unified Matchup Badge */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-mono shadow-sm border border-slate-800">
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                  <span className="truncate max-w-[100px] sm:max-w-[130px]">{data.target.domain}</span>
                </div>
                <span className="text-slate-400 font-sans font-normal text-[11px]">vs</span>
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
                  <span className="truncate max-w-[100px] sm:max-w-[130px]">{data.competitor.domain}</span>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-mono font-bold">
                <span>{data.gapSummary.topicCoverageScore}%</span>
                <span className="text-blue-500 font-normal">Match</span>
              </div>

              <button
                type="button"
                onClick={handleSwap}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                title="Swap Contenders (⇄)"
              >
                <ArrowUpDown className="w-3.5 h-3.5 rotate-90 text-indigo-600" />
              </button>
            </div>

            {/* Middle: 6 Clean Segmented Tabs (Zero scrollbars) */}
            <nav
              className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold overflow-x-auto no-scrollbar"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <button
                type="button"
                onClick={() => handleTabClick("missing")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "missing"
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${activeTab === "missing" ? "text-rose-400" : "text-rose-500"}`} />
                <span>Missing Gaps</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    activeTab === "missing" ? "bg-rose-500 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {data.missingKeywords.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleTabClick("moats")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "moats"
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <ShieldCheck className={`w-3.5 h-3.5 ${activeTab === "moats" ? "text-blue-400" : "text-blue-600"}`} />
                <span>Target Moats</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    activeTab === "moats" ? "bg-blue-500 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {data.targetLeads.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleTabClick("topics")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "topics"
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <Layers className={`w-3.5 h-3.5 ${activeTab === "topics" ? "text-purple-400" : "text-purple-600"}`} />
                <span>H2 Sections</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    activeTab === "topics" ? "bg-purple-500 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {data.missingTopics.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleTabClick("outline")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "outline"
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${activeTab === "outline" ? "text-amber-400" : "text-amber-500"}`} />
                <span>Editorial Brief</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabClick("shared")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "shared"
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <Hash className={`w-3.5 h-3.5 ${activeTab === "shared" ? "text-indigo-400" : "text-indigo-600"}`} />
                <span>Shared Core</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    activeTab === "shared" ? "bg-indigo-500 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {data.sharedKeywords.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleTabClick("distribution")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === "distribution"
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <Activity className={`w-3.5 h-3.5 ${activeTab === "distribution" ? "text-emerald-400" : "text-emerald-600"}`} />
                <span>Semantic Balance</span>
              </button>
            </nav>

            {/* Right: Quick Action Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyMarkdownBrief}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Copy Markdown Editorial Brief"
              >
                {copiedBrief ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span className="hidden md:inline">{copiedBrief ? "Copied" : "Brief"}</span>
              </button>

              <button
                type="button"
                onClick={handleExportCsv}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Export Gap Matrix as CSV"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden md:inline">CSV</span>
              </button>

              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                title="Scroll to Top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Breadcrumb & Status */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Tools Hub
          </Link>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-700">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span className="font-bold">{formatTierName(tier)}</span>
            </div>
            {tier === "free" && (
              <button
                onClick={() =>
                  triggerUpgradeModal({
                    requiredTier: "pro",
                    featureTitle: "Unlimited Content Gap Audits",
                    description:
                      "Analyze unlimited competitors, extract TF-IDF keyword matrices, and export briefs to CSV.",
                  })
                }
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[11px] font-bold shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3 h-3" /> Upgrade
              </button>
            )}
          </div>
        </div>

        {/* HERO TITLE & COCKPIT CONTROLS */}
        <div className="flat-card p-6 sm:p-8 bg-white border border-slate-200 text-center max-w-4xl mx-auto space-y-5 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-2xs">
            <GitCompare className="w-3.5 h-3.5 text-blue-600" />
            <span>Ahrefs Content Gap Alternative</span>
            <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-extrabold tracking-wide">
              Competitive Intelligence
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Semantic Content Gap &amp; Keyword Studio
          </h1>

          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Uncover the topics, long-tail phrases, and heading hierarchies that your competitors rank for, but your webpage is missing. Generate actionable editorial briefs in seconds.
          </p>

          {/* DUAL COCKPIT INPUT FORM */}
          <form onSubmit={handleRunAnalysis} className="pt-2 text-left space-y-4">
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* TARGET INPUT */}
              <div className="p-4 rounded-2xl bg-blue-50/40 border-2 border-blue-100 hover:border-blue-300 transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-blue-900 flex items-center gap-1.5 font-mono">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    Target Webpage (Your Site)
                  </label>
                  {targetUrl && (
                    <button
                      type="button"
                      onClick={() => setTargetUrl("")}
                      className="text-[10px] font-semibold text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 select-none">https://</span>
                  <input
                    type="text"
                    value={targetUrl.replace(/^https?:\/\//i, "")}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="stripe.com"
                    required
                    className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none font-mono placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* 1-CLICK SWAP BUTTON IN THE CENTER */}
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="w-9 h-9 rounded-full bg-white border border-slate-300 shadow-md flex items-center justify-center hover:bg-slate-50 text-slate-700 hover:text-slate-900 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="Swap Target & Competitor (⇄)"
                >
                  <ArrowUpDown className="w-4 h-4 rotate-90 text-indigo-600" />
                </button>
              </div>

              {/* COMPETITOR INPUT */}
              <div className="p-4 rounded-2xl bg-purple-50/40 border-2 border-purple-100 hover:border-purple-300 transition-all focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-purple-900 flex items-center gap-1.5 font-mono">
                    <span className="w-2 h-2 rounded-full bg-purple-600" />
                    Competitor Webpage
                  </label>
                  {competitorUrl && (
                    <button
                      type="button"
                      onClick={() => setCompetitorUrl("")}
                      className="text-[10px] font-semibold text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 select-none">https://</span>
                  <input
                    type="text"
                    value={competitorUrl.replace(/^https?:\/\//i, "")}
                    onChange={(e) => setCompetitorUrl(e.target.value)}
                    placeholder="paypal.com"
                    required
                    className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none font-mono placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2 animate-in fade-in">
                <XCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Extracting Semantic Topics...</span>
                  </>
                ) : (
                  <>
                    <GitCompare className="w-4 h-4" />
                    <span>Analyze Content Gap Matrix</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSwap}
                className="md:hidden w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-indigo-600" />
                <span>Swap Contenders</span>
              </button>
            </div>
          </form>

          {/* Quick Instant Test Pairs */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Instant Benchmarks:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {SAMPLE_PAIRS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(p.target, p.competitor)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold font-mono transition-all border cursor-pointer ${
                    targetUrl.includes(p.target) && competitorUrl.includes(p.competitor)
                      ? "bg-blue-50 text-blue-700 border-blue-300 font-bold"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RESULTS DISPLAY */}
        {data && (
          <div className="space-y-8 animate-in fade-in-50 duration-200">
            {/* 1. HEAD-TO-HEAD TOPIC GAP ARENA (HERO) */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl border border-slate-800">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                {/* SITE A COCKPIT */}
                <div className="flex items-center gap-4 text-center sm:text-left w-full lg:w-auto justify-center sm:justify-start">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black font-mono text-xl shrink-0 shadow-inner">
                    {data.target.domain.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400 block mb-0.5">
                        Target Website (You)
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono font-bold">
                        {data.targetLeads.length} Moats
                      </span>
                    </div>
                    <h2 className="text-lg font-black text-white font-mono tracking-tight truncate max-w-[220px]">
                      {data.target.domain}
                    </h2>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-300 font-mono">
                      <span>{data.target.wordCount.toLocaleString()} words</span>
                      <span>•</span>
                      <span>{data.target.h2Count} H2s</span>
                    </div>
                  </div>
                </div>

                {/* CENTER CLASH: RADIAL DONUT GAUGE FOR OVERLAP */}
                <div className="text-center px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs max-w-sm w-full">
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                      <svg className="w-20 h-20 -rotate-90 transform" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke={data.gapSummary.topicCoverageScore >= 75 ? "#3b82f6" : "#f59e0b"}
                          strokeWidth="8"
                          strokeDasharray={2 * Math.PI * 40}
                          strokeDashoffset={2 * Math.PI * 40 * (1 - data.gapSummary.topicCoverageScore / 100)}
                          strokeLinecap="round"
                          fill="transparent"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg font-black text-white font-mono leading-none">
                          {data.gapSummary.topicCoverageScore}%
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">
                          Overlap
                        </span>
                      </div>
                    </div>

                    <div className="text-left">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 block mb-0.5">
                        Topical Overlap Score
                      </span>
                      <div className="text-xs text-slate-300 font-medium leading-snug">
                        {data.gapSummary.topicCoverageScore >= 80 ? (
                          <span className="text-emerald-400 font-bold">Strong Topical Parity</span>
                        ) : data.gapSummary.topicCoverageScore >= 60 ? (
                          <span className="text-blue-400 font-bold">Moderate Content Gap</span>
                        ) : (
                          <span className="text-rose-400 font-bold">High Semantic Deficit</span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-1">
                        {data.gapSummary.missingKeywordsCount} Missing • {data.gapSummary.targetLeadsCount} Moats
                      </div>
                    </div>
                  </div>

                  {/* 3-WAY TOPICAL TUG-OF-WAR METER */}
                  <div className="mt-3 h-2 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                    <div
                      className="bg-blue-500 h-full transition-all duration-700"
                      style={{
                        width: `${(data.gapSummary.targetLeadsCount / ((data.gapSummary.targetLeadsCount + data.gapSummary.sharedKeywordsCount + data.gapSummary.missingKeywordsCount) || 1)) * 100}%`
                      }}
                      title={`Target Leads: ${data.gapSummary.targetLeadsCount}`}
                    />
                    <div
                      className="bg-purple-500 h-full transition-all duration-700"
                      style={{
                        width: `${(data.gapSummary.sharedKeywordsCount / ((data.gapSummary.targetLeadsCount + data.gapSummary.sharedKeywordsCount + data.gapSummary.missingKeywordsCount) || 1)) * 100}%`
                      }}
                      title={`Shared Core: ${data.gapSummary.sharedKeywordsCount}`}
                    />
                    <div
                      className="bg-rose-500 h-full transition-all duration-700"
                      style={{
                        width: `${(data.gapSummary.missingKeywordsCount / ((data.gapSummary.targetLeadsCount + data.gapSummary.sharedKeywordsCount + data.gapSummary.missingKeywordsCount) || 1)) * 100}%`
                      }}
                      title={`Missing Competitor Terms: ${data.gapSummary.missingKeywordsCount}`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                    <span className="text-blue-400">Moats: {data.gapSummary.targetLeadsCount}</span>
                    <span className="text-purple-400">Shared: {data.gapSummary.sharedKeywordsCount}</span>
                    <span className="text-rose-400">Gaps: {data.gapSummary.missingKeywordsCount}</span>
                  </div>
                </div>

                {/* SITE B COCKPIT */}
                <div className="flex items-center gap-4 text-center sm:text-right w-full lg:w-auto justify-center sm:justify-end flex-row-reverse sm:flex-row">
                  <div>
                    <div className="flex items-center gap-2 justify-center sm:justify-end">
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">
                        {data.missingKeywords.length} Lead Gaps
                      </span>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400 block mb-0.5">
                        Competitor Benchmark
                      </span>
                    </div>
                    <h2 className="text-lg font-black text-white font-mono tracking-tight truncate max-w-[220px]">
                      {data.competitor.domain}
                    </h2>
                    <div className="flex items-center justify-end gap-2 mt-1 text-xs text-slate-300 font-mono">
                      <span>{data.competitor.wordCount.toLocaleString()} words</span>
                      <span>•</span>
                      <span>{data.competitor.h2Count} H2s</span>
                    </div>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black font-mono text-xl shrink-0 shadow-inner">
                    {data.competitor.domain.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>

              {/* TOP OPPORTUNITY QUICK CALLOUT BANNER INSIDE HERO */}
              {topOpportunityKeyword && (
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                    <span className="text-slate-400 font-medium">#1 Highest ROI Missing Opportunity:</span>
                    <span className="font-mono font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      &ldquo;{topOpportunityKeyword.term}&rdquo;
                    </span>
                    <span className="text-rose-400 font-mono font-bold">
                      (Opp Score: {topOpportunityKeyword.opportunityScore}/100)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(topOpportunityKeyword.term)}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {copiedTerm === topOpportunityKeyword.term ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy Term</span>
                  </button>
                </div>
              )}
            </div>

            {/* 2. FOUR EXECUTIVE KPI METRIC CARDS + STRATEGIC AI ADVICE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Missing Keywords */}
              <div className="flat-card p-5 bg-white border border-rose-100 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Missing Keywords
                  </span>
                  <Flame className="w-4 h-4 text-rose-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-rose-600 font-mono">
                    {data.gapSummary.missingKeywordsCount}
                  </span>
                  <span className="text-xs font-bold text-slate-500">Unused terms</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Keywords on competitor with 0 occurrences on target.
                </p>
              </div>

              {/* Card 2: Topic Coverage */}
              <div className="flat-card p-5 bg-white border border-blue-100 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Topic Coverage Overlap
                  </span>
                  <Target className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-blue-600 font-mono">
                    {data.gapSummary.topicCoverageScore}%
                  </span>
                  <span className="text-xs font-bold text-slate-500">Vocabulary match</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${data.gapSummary.topicCoverageScore}%` }}
                  />
                </div>
              </div>

              {/* Card 3: Word Count Disparity */}
              <div className="flat-card p-5 bg-white border border-slate-200 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Word Count Disparity
                  </span>
                  <Scale className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-3xl font-black font-mono ${
                      data.gapSummary.wordDisparity > 0 ? "text-amber-600" : "text-emerald-600"
                    }`}
                  >
                    {data.gapSummary.wordDisparity > 0
                      ? `+${data.gapSummary.wordDisparity}`
                      : `${data.gapSummary.wordDisparity}`}
                  </span>
                  <span className="text-xs font-bold text-slate-500">words</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  {data.gapSummary.wordDisparity > 0
                    ? `Competitor has ${Math.round((data.competitor.wordCount / (data.target.wordCount || 1)) * 100 - 100)}% more content volume.`
                    : "Your target webpage has higher copy depth."}
                </p>
              </div>

              {/* Card 4: Missing H2 Subsections */}
              <div className="flat-card p-5 bg-white border border-purple-100 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Missing Heading Topics
                  </span>
                  <Layers className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-purple-600 font-mono">
                    {data.missingTopics.length}
                  </span>
                  <span className="text-xs font-bold text-slate-500">H2 Sections</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Structural subsections covered by competitor only.
                </p>
              </div>
            </div>

            {/* STRATEGIC AI ADVICE BANNER */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 flex items-start gap-3.5 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs leading-relaxed space-y-1">
                <h3 className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <span>Executive Content Strategy Recommendation</span>
                  <span className="px-1.5 py-0.2 rounded bg-indigo-200/60 text-indigo-800 text-[10px] font-extrabold uppercase">
                    AI Insight
                  </span>
                </h3>
                <p className="text-slate-600">
                  {data.competitor.domain} outranks you primarily across <strong className="text-slate-900">commercial buyer protection and physical terminal integrations</strong>. Adding the {data.missingTopics.length} missing H2 subsections and targeting ~{Math.max(500, Math.abs(data.gapSummary.wordDisparity))} additional words of editorial depth will bridge the semantic deficit while protecting your {data.targetLeads.length} existing keyword moats.
                </p>
              </div>
            </div>

            {/* 3. IN-PAGE SUITE TABS (6 COMPARATIVE VIEWS) */}
            <div id="content-gap-tabs" className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleTabClick("missing")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === "missing"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  <span>Missing Gaps ({data.missingKeywords.length})</span>
                </button>

                <button
                  onClick={() => handleTabClick("moats")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === "moats"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Target Moats ({data.targetLeads.length})</span>
                </button>

                <button
                  onClick={() => handleTabClick("topics")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === "topics"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-purple-600" />
                  <span>H2 Subsections ({data.missingTopics.length})</span>
                </button>

                <button
                  onClick={() => handleTabClick("outline")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === "outline"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Editorial Brief</span>
                </button>

                <button
                  onClick={() => handleTabClick("shared")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === "shared"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Hash className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Shared Core ({data.sharedKeywords.length})</span>
                </button>

                <button
                  onClick={() => handleTabClick("distribution")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === "distribution"
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Semantic Balance</span>
                </button>
              </div>

              {/* Action Buttons Right */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                  title="Export complete matrix to CSV"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Export CSV</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyMarkdownBrief}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                  title="Copy formatted markdown editorial brief"
                >
                  {copiedBrief ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBrief ? "Copied" : "Copy Brief"}</span>
                </button>
              </div>
            </div>

            {/* TAB 1: MISSING KEYWORDS OPPORTUNITY MATRIX */}
            {activeTab === "missing" && (
              <div className="flat-card bg-white border border-slate-200 shadow-xs rounded-2xl overflow-hidden space-y-4 animate-in fade-in duration-150">
                {/* Search & Filter Toolbar */}
                <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={missingSearch}
                      onChange={(e) => setMissingSearch(e.target.value)}
                      placeholder="Search missing keywords..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {missingSearch && (
                      <button
                        onClick={() => setMissingSearch("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Filter Pills & Sort */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 overflow-x-auto no-scrollbar">
                      <button
                        type="button"
                        onClick={() => setMissingFilter("all")}
                        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                          missingFilter === "all" ? "bg-slate-900 text-white font-bold" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        All ({data.missingKeywords.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setMissingFilter("highPriority")}
                        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                          missingFilter === "highPriority" ? "bg-rose-600 text-white font-bold" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        High ROI (≥80)
                      </button>
                      <button
                        type="button"
                        onClick={() => setMissingFilter("inHeader")}
                        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                          missingFilter === "inHeader" ? "bg-purple-600 text-white font-bold" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        In H1 / Title
                      </button>
                      <button
                        type="button"
                        onClick={() => setMissingFilter("transactional")}
                        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                          missingFilter === "transactional" ? "bg-emerald-600 text-white font-bold" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Transactional
                      </button>
                      <button
                        type="button"
                        onClick={() => setMissingFilter("commercial")}
                        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                          missingFilter === "commercial" ? "bg-amber-600 text-white font-bold" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Commercial
                      </button>
                      <button
                        type="button"
                        onClick={() => setMissingFilter("twoWord")}
                        className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                          missingFilter === "twoWord" ? "bg-blue-600 text-white font-bold" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Long-Tail
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <span>Sort:</span>
                      <select
                        value={missingSort}
                        onChange={(e) => setMissingSort(e.target.value as typeof missingSort)}
                        className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 outline-none cursor-pointer"
                      >
                        <option value="oppDesc">Opportunity Score</option>
                        <option value="compFreqDesc">Competitor Count</option>
                        <option value="alpha">Alphabetical</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyAllMissing}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold transition-colors cursor-pointer flex items-center gap-1"
                      title="Copy all filtered missing keywords as comma-separated list"
                    >
                      {copiedAllMissing ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedAllMissing ? "Copied All" : "Copy All CSV"}</span>
                    </button>
                  </div>
                </div>

                {/* Floating Multi-Select Action Bar if items selected */}
                {selectedKeywords.size > 0 && (
                  <div className="mx-4 sm:mx-5 p-3 rounded-xl bg-slate-900 text-white text-xs flex items-center justify-between gap-3 animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      <span className="font-bold">{selectedKeywords.size} keywords selected</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopySelected}
                        className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy Selected</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyAiPrompt}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Generate AI Prompt for Selected</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedKeywords(new Set())}
                        className="p-1 text-slate-400 hover:text-white cursor-pointer"
                        title="Clear Selection"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Missing Keywords Table */}
                <div className="overflow-x-auto px-4 sm:px-5 pb-5">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[11px] font-mono uppercase text-slate-400 border-b border-slate-200 bg-slate-50/50">
                      <tr>
                        <th className="py-2.5 px-3 w-8">
                          <button
                            type="button"
                            onClick={handleSelectAllVisible}
                            className="cursor-pointer text-slate-400 hover:text-slate-700 flex items-center"
                            title="Select / Deselect all"
                          >
                            {selectedKeywords.size === filteredMissingKeywords.length && filteredMissingKeywords.length > 0 ? (
                              <CheckSquare className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </th>
                        <th className="py-2.5 px-3">Missing Keyword Phrase</th>
                        <th className="py-2.5 px-3 text-center">Opportunity ROI</th>
                        <th className="py-2.5 px-3 text-center">Search Intent</th>
                        <th className="py-2.5 px-3 text-center">{data.competitor.domain}</th>
                        <th className="py-2.5 px-3 text-center">{data.target.domain}</th>
                        <th className="py-2.5 px-3 text-center">Strategic Prominence</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredMissingKeywords.map((item, idx) => {
                        const opp = item.opportunityScore ?? 75;
                        const intent = inferKeywordIntent(item.term);
                        const isSelected = selectedKeywords.has(item.term);

                        return (
                          <tr
                            key={idx}
                            className={`transition-colors ${
                              isSelected ? "bg-blue-50/50 hover:bg-blue-50/70" : "hover:bg-slate-50/80"
                            }`}
                          >
                            <td className="py-3 px-3">
                              <button
                                type="button"
                                onClick={() => toggleSelectKeyword(item.term)}
                                className="cursor-pointer text-slate-400 hover:text-slate-700 flex items-center"
                              >
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 text-blue-600" />
                                ) : (
                                  <Square className="w-4 h-4" />
                                )}
                              </button>
                            </td>

                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2 font-bold text-slate-900 font-mono text-xs">
                                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                                <span>{item.term}</span>
                              </div>
                            </td>

                            <td className="py-3 px-3 text-center">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold ${
                                  opp >= 85
                                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                                    : opp >= 70
                                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                {opp >= 85 && <Flame className="w-3 h-3 text-rose-500" />}
                                {opp}/100
                              </span>
                            </td>

                            <td className="py-3 px-3 text-center">
                              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${intent.bg} ${intent.color}`}>
                                {intent.label}
                              </span>
                            </td>

                            <td className="py-3 px-3 text-center font-mono font-bold text-purple-700">
                              {item.competitorCount}×
                            </td>

                            <td className="py-3 px-3 text-center font-mono text-slate-400 font-bold">
                              0×
                            </td>

                            <td className="py-3 px-3 text-center">
                              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                {item.inCompTitleOrH1 && (
                                  <span className="flat-badge bg-purple-50 text-purple-800 border-purple-200 text-[10px] font-bold">
                                    In Title / H1
                                  </span>
                                )}
                                {item.isTwoWord && (
                                  <span className="flat-badge bg-blue-50 text-blue-700 border-blue-200 text-[10px]">
                                    Long-Tail
                                  </span>
                                )}
                                {!item.inCompTitleOrH1 && !item.isTwoWord && (
                                  <span className="text-[11px] text-slate-400 font-mono">Body Content</span>
                                )}
                              </div>
                            </td>

                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => handleCopy(item.term)}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer shadow-2xs"
                              >
                                {copiedTerm === item.term ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3 text-slate-400" />
                                )}
                                {copiedTerm === item.term ? "Copied" : "Copy"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredMissingKeywords.length === 0 && (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                            No missing keywords match the selected filter or search term.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: TARGET EXCLUSIVE MOATS (KEYWORDS YOU OWN) */}
            {activeTab === "moats" && (
              <div className="flat-card bg-white border border-blue-200 shadow-xs rounded-2xl overflow-hidden space-y-4 animate-in fade-in duration-150">
                <div className="p-4 sm:p-5 border-b border-blue-100 bg-blue-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-blue-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      Target Exclusive Moats ({data.targetLeads.length} Keywords)
                    </h3>
                    <p className="text-xs text-slate-600">
                      Terms that {data.target.domain} ranks for, but {data.competitor.domain} is completely missing. Protect these keywords during copy refreshes.
                    </p>
                  </div>

                  <div className="relative max-w-xs w-full">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={moatsSearch}
                      onChange={(e) => setMoatsSearch(e.target.value)}
                      placeholder="Search moat keywords..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Protective Guardrail Warning */}
                <div className="mx-4 sm:mx-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold">Defensive Content Protection Rule:</span>
                    <p className="text-amber-800 leading-relaxed">
                      When expanding copy to target competitor topics, ensure you do not overwrite or delete these {data.targetLeads.length} core keywords. They represent your unique search equity and prevent counter-encroachment by {data.competitor.domain}.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto px-4 sm:px-5 pb-5">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[11px] font-mono uppercase text-slate-400 border-b border-slate-200 bg-slate-50/50">
                      <tr>
                        <th className="py-2.5 px-3">Exclusive Moat Term</th>
                        <th className="py-2.5 px-3 text-center">{data.target.domain} Count</th>
                        <th className="py-2.5 px-3 text-center">{data.competitor.domain} Count</th>
                        <th className="py-2.5 px-3 text-center">Intent</th>
                        <th className="py-2.5 px-3 text-center">Placement</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredMoats.map((item, idx) => {
                        const intent = inferKeywordIntent(item.term);
                        return (
                          <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2 font-bold text-slate-900 font-mono text-xs">
                                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                                <span>{item.term}</span>
                              </div>
                            </td>

                            <td className="py-3 px-3 text-center font-mono font-bold text-blue-700">
                              {item.targetCount}×
                            </td>

                            <td className="py-3 px-3 text-center font-mono text-slate-400 font-bold">
                              0×
                            </td>

                            <td className="py-3 px-3 text-center">
                              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${intent.bg} ${intent.color}`}>
                                {intent.label}
                              </span>
                            </td>

                            <td className="py-3 px-3 text-center">
                              {item.inTargetTitleOrH1 ? (
                                <span className="flat-badge bg-blue-50 text-blue-800 border-blue-200 text-[10px] font-bold">
                                  In Your H1 / Title
                                </span>
                              ) : (
                                <span className="text-[11px] text-slate-400 font-mono">Body Copy</span>
                              )}
                            </td>

                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => handleCopy(item.term)}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer shadow-2xs"
                              >
                                {copiedTerm === item.term ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3 text-slate-400" />
                                )}
                                {copiedTerm === item.term ? "Copied" : "Copy"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: MISSING TOPICS & H2 SUBSECTIONS */}
            {activeTab === "topics" && (
              <div className="flat-card p-6 bg-white border border-slate-200 shadow-xs space-y-6 rounded-2xl animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-600" />
                      Missing Heading Subsections &amp; Topical Architecture
                    </h3>
                    <p className="text-xs text-slate-500">
                      Headings that {data.competitor.domain} includes in their structural outline that are absent from your page.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-purple-50 text-purple-700 border border-purple-200">
                    {data.missingTopics.length} Sections to Implement
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.missingTopics.map((topic, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 transition-all flex items-start justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800 uppercase">
                            H2 Section #{idx + 1}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">Structural Gap</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {topic}
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Adding this dedicated H2 heading and 250+ words of topical copy directly addresses Google search intent satisfied by {data.competitor.domain}.
                        </p>
                      </div>

                      <button
                        onClick={() => handleCopy(topic)}
                        className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
                        title="Copy Section Heading"
                      >
                        {copiedTerm === topic ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: EDITORIAL CONTENT STRATEGY BRIEF & AI PROMPT */}
            {activeTab === "outline" && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* Dark Executive Brief Card */}
                <div className="flat-card p-6 sm:p-8 bg-slate-900 text-white rounded-3xl space-y-6 border border-slate-800 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        Editorial Content Brief &amp; Action Plan
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold">
                        Recommended Outline to Overcome {data.competitor.domain}
                      </h3>
                      <p className="text-xs text-slate-400 max-w-2xl leading-relaxed mt-1">
                        Incorporate these subheadings and semantic keyword clusters into your webpage to achieve topical authority parity.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyMarkdownBrief}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        {copiedBrief ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedBrief ? "Brief Copied!" : "Copy Markdown Brief"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyAiPrompt}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                        <span>{copiedPrompt ? "Prompt Copied!" : "Copy AI Writer Prompt"}</span>
                      </button>
                    </div>
                  </div>

                  {/* AI Prompt Mode Selector */}
                  <div className="flex items-center gap-2 bg-slate-800/90 p-1.5 rounded-xl border border-slate-700 text-xs">
                    <span className="text-slate-400 font-semibold px-2">Prompt Mode:</span>
                    <button
                      type="button"
                      onClick={() => setAiPromptMode("guide")}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer font-bold ${
                        aiPromptMode === "guide" ? "bg-blue-600 text-white" : "text-slate-300 hover:text-white"
                      }`}
                    >
                      Comprehensive Guide
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiPromptMode("landing")}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer font-bold ${
                        aiPromptMode === "landing" ? "bg-blue-600 text-white" : "text-slate-300 hover:text-white"
                      }`}
                    >
                      Landing Page Section
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiPromptMode("compare")}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer font-bold ${
                        aiPromptMode === "compare" ? "bg-blue-600 text-white" : "text-slate-300 hover:text-white"
                      }`}
                    >
                      Head-to-Head Comparison
                    </button>
                  </div>

                  {/* Section Outlines */}
                  <div className="space-y-4">
                    {data.suggestedOutline.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono">
                            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center font-bold">
                              {idx + 1}
                            </span>
                            <span>&ldquo;{item.heading}&rdquo;</span>
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            {item.importance}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-300 flex-wrap pt-1">
                          <span className="text-[11px] text-slate-400 font-semibold">Integrate Keywords:</span>
                          {item.recommendedKeywords.map((kw, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleCopy(kw)}
                              className="px-2.5 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-200 font-mono text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                              title="Click to copy keyword"
                            >
                              <span>{kw}</span>
                              <Copy className="w-2.5 h-2.5 text-slate-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: SHARED CORE KEYWORDS MATRIX */}
            {activeTab === "shared" && (
              <div className="flat-card bg-white border border-slate-200 shadow-xs rounded-2xl overflow-hidden space-y-4 animate-in fade-in duration-150">
                <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Hash className="w-4 h-4 text-indigo-600" />
                      Shared Core Terms Matrix ({data.sharedKeywords.length} Keywords)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Terms that appear on both your webpage and {data.competitor.domain}.
                    </p>
                  </div>

                  <div className="relative max-w-xs w-full">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={sharedSearch}
                      onChange={(e) => setSharedSearch(e.target.value)}
                      placeholder="Search shared terms..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto px-4 sm:px-5 pb-5">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[11px] font-mono uppercase text-slate-400 border-b border-slate-200 bg-slate-50/50">
                      <tr>
                        <th className="py-2.5 px-3">Shared Keyword Term</th>
                        <th className="py-2.5 px-3 text-center">{data.target.domain} Frequency</th>
                        <th className="py-2.5 px-3 text-center">{data.competitor.domain} Frequency</th>
                        <th className="py-2.5 px-3 text-center">Frequency Ratio</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredShared.map((item, idx) => {
                        const ratio = (item.targetCount / (item.competitorCount || 1)).toFixed(1);
                        return (
                          <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2 font-bold text-slate-900 font-mono text-xs">
                                <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                                <span>{item.term}</span>
                              </div>
                            </td>

                            <td className="py-3 px-3 text-center font-mono font-bold text-blue-600">
                              {item.targetCount}×
                            </td>

                            <td className="py-3 px-3 text-center font-mono font-bold text-purple-600">
                              {item.competitorCount}×
                            </td>

                            <td className="py-3 px-3 text-center font-mono">
                              <span
                                className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                                  item.targetCount >= item.competitorCount ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                                }`}
                              >
                                {item.targetCount >= item.competitorCount
                                  ? `Your Lead (${ratio}x)`
                                  : `Comp Lead (${(item.competitorCount / (item.targetCount || 1)).toFixed(1)}x)`}
                              </span>
                            </td>

                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => handleCopy(item.term)}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer shadow-2xs"
                              >
                                {copiedTerm === item.term ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3 text-slate-400" />
                                )}
                                {copiedTerm === item.term ? "Copied" : "Copy"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 6: SEMANTIC BALANCE & 3-PILLAR OVERLAP CHART */}
            {activeTab === "distribution" && (
              <div className="flat-card p-6 sm:p-8 bg-white border border-slate-200 shadow-xs rounded-2xl space-y-6 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-600" />
                      3-Pillar Semantic Overlap &amp; Topical Balance Distribution
                    </h3>
                    <p className="text-xs text-slate-500">
                      Cross-domain TF-IDF intersection between {data.target.domain} and {data.competitor.domain}.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                    {data.gapSummary.topicCoverageScore}% Common Coverage
                  </span>
                </div>

                {/* Large Stacked Proportional Bar */}
                <div className="space-y-2">
                  <div className="h-5 rounded-full overflow-hidden flex bg-slate-100 border border-slate-200 p-0.5 shadow-inner">
                    <div
                      style={{
                        width: `${Math.round(
                          (data.targetLeads.length /
                            ((data.missingKeywords.length + data.sharedKeywords.length + data.targetLeads.length) || 1)) *
                            100
                        )}%`,
                      }}
                      className="bg-blue-600 h-full rounded-l-full transition-all duration-700"
                      title="Target Exclusive Keywords (Your Moats)"
                    />
                    <div
                      style={{
                        width: `${Math.round(
                          (data.sharedKeywords.length /
                            ((data.missingKeywords.length + data.sharedKeywords.length + data.targetLeads.length) || 1)) *
                            100
                        )}%`,
                      }}
                      className="bg-purple-600 h-full transition-all duration-700"
                      title="Shared Keywords"
                    />
                    <div
                      style={{
                        width: `${Math.round(
                          (data.missingKeywords.length /
                            ((data.missingKeywords.length + data.sharedKeywords.length + data.targetLeads.length) || 1)) *
                            100
                        )}%`,
                      }}
                      className="bg-rose-500 h-full rounded-r-full transition-all duration-700"
                      title="Missing Competitor Gaps"
                    />
                  </div>
                </div>

                {/* 3 Pillar Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {/* Pillar 1: Moats */}
                  <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase font-mono text-blue-900">
                        Target Moats
                      </span>
                      <span className="text-xs font-mono font-black text-blue-700">
                        {data.targetLeads.length} Terms
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Keywords unique to {data.target.domain}. These terms represent your established search moat that the competitor has not targeted.
                    </p>
                  </div>

                  {/* Pillar 2: Shared */}
                  <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase font-mono text-purple-900">
                        Shared Core
                      </span>
                      <span className="text-xs font-mono font-black text-purple-700">
                        {data.sharedKeywords.length} Terms
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Core semantic keywords covered by both websites. Represents baseline industry terminology.
                    </p>
                  </div>

                  {/* Pillar 3: Gaps */}
                  <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase font-mono text-rose-900">
                        Competitor Gaps
                      </span>
                      <span className="text-xs font-mono font-black text-rose-700">
                        {data.missingKeywords.length} Terms
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Keywords covered by {data.competitor.domain} that are missing on your page. Primary opportunities to win rank.
                    </p>
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
