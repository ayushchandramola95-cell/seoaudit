"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { usePlan } from "@/lib/auth/PlanContext";
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  ArrowRight,
  ExternalLink,
  Loader2,
  Sparkles,
  Download,
  Copy,
  Printer,
  Share2,
  RefreshCw,
  Search,
  Filter,
  FileText,
  Hash,
  ListTree,
  Check,
  Zap,
  Globe,
  ChevronDown,
  ChevronUp,
  Code2,
  HelpCircle,
  TrendingUp,
  LayoutTemplate,
  BookmarkCheck,
  Eye,
} from "lucide-react";
import { HeadingNode, HeadingIssue, HeadingsAnalysis } from "@/lib/modules/seo/fetcher";

interface DocumentArchitectureReport {
  url: string;
  domain: string;
  title: string | null;
  wordCount: number;
  readingTimeMinutes: number;
  responseTimeMs: number;
  headings: HeadingsAnalysis;
}

const DEMO_PRESETS: Record<string, DocumentArchitectureReport> = {
  "stripe.com": {
    url: "https://stripe.com/",
    domain: "stripe.com",
    title: "Stripe | Financial Infrastructure for the Internet",
    wordCount: 3840,
    readingTimeMinutes: 19,
    responseTimeMs: 84,
    headings: {
      h1Count: 1,
      h1Items: ["Financial infrastructure for the internet"],
      h2Count: 6,
      h2Samples: [
        "A fully integrated suite of financial and payment products",
        "The backbone for global internet commerce",
        "Designed for developers, engineered for scale",
        "Global payment processing with 135+ currencies",
        "Embedded banking and treasury infrastructure",
        "Ready to build the future of payments?",
      ],
      h3Count: 14,
      h4Count: 8,
      h5Count: 0,
      h6Count: 0,
      totalHeadings: 29,
      hierarchyScore: 98,
      skippedLevelsCount: 0,
      emptyHeadingsCount: 0,
      maxDepth: 4,
      issues: [
        {
          type: "long_heading",
          severity: "info",
          message: "<H2> 'A fully integrated suite of financial and payment products' is 59 chars long. Optimal length is within 40-65 chars.",
          tag: "h2",
          text: "A fully integrated suite of financial and payment products",
          order: 2,
        },
      ],
      items: [
        { tag: "h1", level: 1, text: "Financial infrastructure for the internet", charCount: 41, order: 1 },
        { tag: "h2", level: 2, text: "A fully integrated suite of financial and payment products", charCount: 59, order: 2 },
        { tag: "h3", level: 3, text: "Modular solutions for dynamic business models", charCount: 45, order: 3 },
        { tag: "h3", level: 3, text: "Unified payments across in-person and online channels", charCount: 54, order: 4 },
        { tag: "h2", level: 2, text: "The backbone for global internet commerce", charCount: 41, order: 5 },
        { tag: "h3", level: 3, text: "Enterprise reliability with 99.999% historical uptime", charCount: 53, order: 6 },
        { tag: "h3", level: 3, text: "Automated tax compliance with Stripe Tax", charCount: 40, order: 7 },
        { tag: "h4", level: 4, text: "Cross-border tax calculation engine", charCount: 36, order: 8 },
        { tag: "h4", level: 4, text: "Real-time jurisdiction address validation", charCount: 41, order: 9 },
        { tag: "h2", level: 2, text: "Designed for developers, engineered for scale", charCount: 46, order: 10 },
        { tag: "h3", level: 3, text: "Comprehensive client & server SDK libraries", charCount: 43, order: 11 },
        { tag: "h3", level: 3, text: "Webhooks and event-driven architecture", charCount: 39, order: 12 },
        { tag: "h2", level: 2, text: "Global payment processing with 135+ currencies", charCount: 47, order: 13 },
        { tag: "h3", level: 3, text: "Localized payment methods: Cards, Wallets, Bank Transfers", charCount: 57, order: 14 },
        { tag: "h3", level: 3, text: "Optimized authorization rates with Machine Learning", charCount: 51, order: 15 },
        { tag: "h2", level: 2, text: "Embedded banking and treasury infrastructure", charCount: 44, order: 16 },
        { tag: "h3", level: 3, text: "Stripe Issuing: Commercial card creation", charCount: 40, order: 17 },
        { tag: "h3", level: 3, text: "Stripe Treasury: Banking-as-a-service accounts", charCount: 46, order: 18 },
        { tag: "h2", level: 2, text: "Ready to build the future of payments?", charCount: 38, order: 19 },
        { tag: "h3", level: 3, text: "Explore developer documentation", charCount: 32, order: 20 },
        { tag: "h3", level: 3, text: "Contact our enterprise sales team", charCount: 33, order: 21 },
      ],
    },
  },
  "vercel.com": {
    url: "https://vercel.com/",
    domain: "vercel.com",
    title: "Vercel: Build and deploy the best Web experiences",
    wordCount: 2980,
    readingTimeMinutes: 15,
    responseTimeMs: 62,
    headings: {
      h1Count: 1,
      h1Items: ["Your complete platform for the web"],
      h2Count: 5,
      h2Samples: [
        "Develop with your favorite tools",
        "Preview before deploying to production",
        "Ship on high-performance Edge Network",
        "Enterprise-grade security and compliance",
        "Ready to build the future of the web?",
      ],
      h3Count: 10,
      h4Count: 4,
      h5Count: 0,
      h6Count: 0,
      totalHeadings: 20,
      hierarchyScore: 97,
      skippedLevelsCount: 0,
      emptyHeadingsCount: 0,
      maxDepth: 4,
      issues: [],
      items: [
        { tag: "h1", level: 1, text: "Your complete platform for the web", charCount: 35, order: 1 },
        { tag: "h2", level: 2, text: "Develop with your favorite tools", charCount: 32, order: 2 },
        { tag: "h3", level: 3, text: "Framework-defined infrastructure for Next.js, Svelte, Nuxt", charCount: 57, order: 3 },
        { tag: "h3", level: 3, text: "Local iteration with seamless environment syncing", charCount: 50, order: 4 },
        { tag: "h2", level: 2, text: "Preview before deploying to production", charCount: 39, order: 5 },
        { tag: "h3", level: 3, text: "Collaborative preview URLs for every git push", charCount: 46, order: 6 },
        { tag: "h3", level: 3, text: "Visual feedback and comments directly on the page", charCount: 50, order: 7 },
        { tag: "h2", level: 2, text: "Ship on high-performance Edge Network", charCount: 38, order: 8 },
        { tag: "h3", level: 3, text: "Global CDN distribution with automated SSL", charCount: 42, order: 9 },
        { tag: "h4", level: 4, text: "Edge Middleware execution in <5ms", charCount: 34, order: 10 },
        { tag: "h4", level: 4, text: "Serverless compute scaling from 0 to millions", charCount: 46, order: 11 },
        { tag: "h2", level: 2, text: "Enterprise-grade security and compliance", charCount: 41, order: 12 },
        { tag: "h3", level: 3, text: "SOC2 Type II, ISO 27001, and HIPAA compliance", charCount: 46, order: 13 },
        { tag: "h3", level: 3, text: "DDoS mitigation & managed web application firewall", charCount: 51, order: 14 },
        { tag: "h2", level: 2, text: "Ready to build the future of the web?", charCount: 37, order: 15 },
        { tag: "h3", level: 3, text: "Deploy your first project in minutes", charCount: 36, order: 16 },
      ],
    },
  },
  "github.com": {
    url: "https://github.com/",
    domain: "github.com",
    title: "GitHub: Let’s build from here",
    wordCount: 4120,
    readingTimeMinutes: 21,
    responseTimeMs: 98,
    headings: {
      h1Count: 1,
      h1Items: ["Let's build from here"],
      h2Count: 6,
      h2Samples: [
        "The AI-powered developer platform",
        "GitHub Copilot is your AI pair programmer",
        "Collaborate seamlessly with Pull Requests",
        "Automate your workflow with GitHub Actions",
        "Security built into every step of development",
        "Over 100 million developers shape the future",
      ],
      h3Count: 12,
      h4Count: 3,
      h5Count: 0,
      h6Count: 0,
      totalHeadings: 22,
      hierarchyScore: 89,
      skippedLevelsCount: 1,
      emptyHeadingsCount: 0,
      maxDepth: 4,
      issues: [
        {
          type: "skipped_level",
          severity: "warning",
          message: "Skipped heading level: jumped from <H2> directly to <H4> in workflow sub-module.",
          tag: "h4",
          text: "Self-hosted runner architecture",
          order: 14,
        },
      ],
      items: [
        { tag: "h1", level: 1, text: "Let's build from here", charCount: 21, order: 1 },
        { tag: "h2", level: 2, text: "The AI-powered developer platform", charCount: 33, order: 2 },
        { tag: "h3", level: 3, text: "Accelerate development speed with Copilot Chat", charCount: 46, order: 3 },
        { tag: "h3", level: 3, text: "Universal context across repositories and docs", charCount: 46, order: 4 },
        { tag: "h2", level: 2, text: "GitHub Copilot is your AI pair programmer", charCount: 41, order: 5 },
        { tag: "h3", level: 3, text: "Code suggestions in 30+ languages", charCount: 34, order: 6 },
        { tag: "h3", level: 3, text: "Automated unit test generation", charCount: 31, order: 7 },
        { tag: "h2", level: 2, text: "Collaborate seamlessly with Pull Requests", charCount: 41, order: 8 },
        { tag: "h3", level: 3, text: "Inline code reviews & suggested changes", charCount: 39, order: 9 },
        { tag: "h2", level: 2, text: "Automate your workflow with GitHub Actions", charCount: 42, order: 10 },
        { tag: "h3", level: 3, text: "Pre-built CI/CD templates for every stack", charCount: 41, order: 11 },
        { tag: "h3", level: 3, text: "Matrix builds across macOS, Linux, and Windows", charCount: 47, order: 12 },
        { tag: "h4", level: 4, text: "Self-hosted runner architecture", charCount: 31, order: 13, isSkipped: true },
        { tag: "h2", level: 2, text: "Security built into every step of development", charCount: 45, order: 14 },
        { tag: "h3", level: 3, text: "Dependabot automated dependency upgrades", charCount: 41, order: 15 },
        { tag: "h3", level: 3, text: "Secret scanning & push protection", charCount: 33, order: 16 },
      ],
    },
  },
  "linear.app": {
    url: "https://linear.app/",
    domain: "linear.app",
    title: "Linear: A better way to build products",
    wordCount: 2200,
    readingTimeMinutes: 11,
    responseTimeMs: 58,
    headings: {
      h1Count: 1,
      h1Items: ["Linear is a better way to build products"],
      h2Count: 5,
      h2Samples: [
        "Meet the new standard for modern software development",
        "Purpose-built for product development",
        "Designed to move fast and stay focused",
        "Integrate with your existing workflows",
        "Built for modern software teams",
      ],
      h3Count: 8,
      h4Count: 0,
      h5Count: 0,
      h6Count: 0,
      totalHeadings: 14,
      hierarchyScore: 100,
      skippedLevelsCount: 0,
      emptyHeadingsCount: 0,
      maxDepth: 3,
      issues: [],
      items: [
        { tag: "h1", level: 1, text: "Linear is a better way to build products", charCount: 39, order: 1 },
        { tag: "h2", level: 2, text: "Meet the new standard for modern software development", charCount: 53, order: 2 },
        { tag: "h3", level: 3, text: "Sub-50ms sync engine and offline capability", charCount: 44, order: 3 },
        { tag: "h3", level: 3, text: "Keyboard-first navigation for high velocity", charCount: 44, order: 4 },
        { tag: "h2", level: 2, text: "Purpose-built for product development", charCount: 37, order: 5 },
        { tag: "h3", level: 3, text: "Issue tracking with automated branch workflows", charCount: 46, order: 6 },
        { tag: "h3", level: 3, text: "Roadmaps and quarterly initiative planning", charCount: 42, order: 7 },
        { tag: "h2", level: 2, text: "Designed to move fast and stay focused", charCount: 39, order: 8 },
        { tag: "h3", level: 3, text: "Cycles, automated backlogs, and project graphs", charCount: 47, order: 9 },
        { tag: "h2", level: 2, text: "Integrate with your existing workflows", charCount: 38, order: 10 },
        { tag: "h3", level: 3, text: "Native GitHub, GitLab, and Slack integrations", charCount: 45, order: 11 },
        { tag: "h2", level: 2, text: "Built for modern software teams", charCount: 31, order: 12 },
        { tag: "h3", level: 3, text: "Start for free, scale to thousands", charCount: 34, order: 13 },
      ],
    },
  },
};

export default function DocumentArchitectureClient() {
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get("url") || "";

  const { tier, recordScan, limits } = usePlan();

  const [urlInput, setUrlInput] = useState(initialUrl);
  const [activePreset, setActivePreset] = useState<string>(initialUrl ? "" : "stripe.com");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DocumentArchitectureReport | null>(
    initialUrl ? null : DEMO_PRESETS["stripe.com"]
  );

  // Filters & Views
  const [levelFilter, setLevelFilter] = useState<"all" | "h1" | "h2" | "h3" | "h4plus" | "issues">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"tree" | "ladder" | "issues">("tree");
  const [collapsedNodes, setCollapsedNodes] = useState<Record<number, boolean>>({});

  // Feedback states
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [copiedHeadingIdx, setCopiedHeadingIdx] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 2500);
  };

  const handleScan = async (targetToScan: string) => {
    let cleanUrl = targetToScan.trim();
    if (!cleanUrl) return;

    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = `https://${cleanUrl}`;
    }

    // Check if matching preset
    const presetKey = Object.keys(DEMO_PRESETS).find(
      (k) => cleanUrl.toLowerCase().includes(k)
    );
    if (presetKey && !targetToScan.includes("/")) {
      setActivePreset(presetKey);
      setData(DEMO_PRESETS[presetKey]);
      setError(null);
      return;
    }

    setActivePreset("");
    setLoading(true);
    setError(null);

    try {
      if (!recordScan()) {
        setError(`Daily scan limit reached (${limits.dailyScans}/${limits.dailyScans}). Switch or upgrade plan for unlimited audits.`);
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/tools/document-architecture?url=${encodeURIComponent(cleanUrl)}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to inspect document architecture.");
      }

      setData({
        url: json.url,
        domain: json.domain,
        title: json.title,
        wordCount: json.wordCount || 0,
        readingTimeMinutes: json.readingTimeMinutes || 1,
        responseTimeMs: json.responseTimeMs || 0,
        headings: json.headings,
      });
      showToast(`Document architecture parsed for ${json.domain}`);
    } catch (err: unknown) {
      setError((err as Error)?.message || "Scan failed. Please verify the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialUrl) {
      setUrlInput(initialUrl);
      handleScan(initialUrl);
    }
  }, [initialUrl]);

  // Filtered Headings
  const filteredHeadings = useMemo(() => {
    if (!data?.headings.items) return [];

    return data.headings.items.filter((item) => {
      // Level filter
      if (levelFilter === "h1" && item.level !== 1) return false;
      if (levelFilter === "h2" && item.level !== 2) return false;
      if (levelFilter === "h3" && item.level !== 3) return false;
      if (levelFilter === "h4plus" && item.level < 4) return false;
      if (levelFilter === "issues" && !item.isSkipped && !item.isEmpty && !item.isOverLength) return false;

      // Keyword search
      if (searchQuery.trim().length > 0) {
        return item.text.toLowerCase().includes(searchQuery.toLowerCase());
      }

      return true;
    });
  }, [data, levelFilter, searchQuery]);

  // Generate Markdown Outline
  const generateMarkdownOutline = () => {
    if (!data?.headings.items) return "";
    let md = `# Document Outline: ${data.domain}\n`;
    if (data.title) md += `<!-- Title: ${data.title} -->\n\n`;

    data.headings.items.forEach((item) => {
      const hashes = "#".repeat(item.level);
      md += `${hashes} ${item.text}\n`;
    });
    return md;
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdownOutline();
    if (!md) return;
    navigator.clipboard.writeText(md);
    setCopiedMarkdown(true);
    showToast("Clean Markdown document outline copied to clipboard!");
    setTimeout(() => setCopiedMarkdown(false), 2200);
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdownOutline();
    if (!md || !data) return;
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `outline-${data.domain}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Saved outline-${data.domain}.md`);
  };

  const handleDownloadJson = () => {
    if (!data) return;
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `document-architecture-${data.domain}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded architecture JSON for ${data.domain}`);
  };

  const handleCopyShareLink = () => {
    if (typeof window !== "undefined") {
      const target = data?.domain ? `?url=https://${data.domain}` : "";
      navigator.clipboard.writeText(`${window.location.origin}/tools/document-architecture${target}`);
      setCopiedShareLink(true);
      showToast("Shareable link copied to clipboard!");
      setTimeout(() => setCopiedShareLink(false), 2000);
    }
  };

  const handleCopySingleHeading = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedHeadingIdx(idx);
    showToast("Heading text copied!");
    setTimeout(() => setCopiedHeadingIdx(null), 1800);
  };

  const toggleCollapse = (order: number) => {
    setCollapsedNodes((prev) => ({ ...prev, [order]: !prev[order] }));
  };

  // Score Grade computation
  const score = data?.headings.hierarchyScore ?? 95;
  const grade = score >= 95 ? "Grade A+" : score >= 85 ? "Grade A" : score >= 75 ? "Grade B" : score >= 60 ? "Grade C" : "Grade F";
  const gradeColor = score >= 90 ? "text-emerald-700 bg-emerald-50 border-emerald-200" : score >= 75 ? "text-blue-700 bg-blue-50 border-blue-200" : "text-amber-700 bg-amber-50 border-amber-200";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 border border-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner / Breadcrumb */}
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
            <span className="text-slate-900 font-bold">Document Architecture &amp; DOM Ladder</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              <Layers className="w-3 h-3 text-blue-600" />
              Flagship Semantic Engine
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {tier === "free" ? "Free Utility" : "Pro Analyst"}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Tool Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
              <ListTree className="w-4 h-4" />
              Semantic Structure &amp; HTML5 Heading Inspector
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Document Architecture &amp; DOM Heading Ladder
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Verify strict H1–H6 hierarchy order, detect skipped heading jumps, inspect DOM depth distribution, and optimize content for Google AI Overviews and featured snippet extraction.
            </p>
          </div>

          {/* Action Toolbar */}
          {data && (
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={handleCopyShareLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
                title="Copy shareable link"
              >
                {copiedShareLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
                Share
              </button>

              <button
                onClick={handleCopyMarkdown}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
                title="Copy Markdown outline"
              >
                {copiedMarkdown ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                Copy Outline
              </button>

              <button
                onClick={handleDownloadMarkdown}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
                title="Download .md outline file"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                Download .MD
              </button>

              <button
                onClick={handleDownloadJson}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
                title="Export hierarchy JSON"
              >
                <Code2 className="w-3.5 h-3.5 text-slate-500" />
                JSON
              </button>

              <button
                onClick={() => typeof window !== "undefined" && window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
                title="Print report"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                Print
              </button>
            </div>
          )}
        </div>

        {/* Input Bar & Presets */}
        <div className="flat-card p-5 bg-white border border-slate-200 shadow-xs">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleScan(urlInput);
            }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <div className="relative flex-1">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Enter domain or webpage URL (e.g. stripe.com, vercel.com/docs)..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50 hover:bg-white transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !urlInput.trim()}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-xs shrink-0 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Inspecting DOM...</span>
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  <span>Audit Architecture</span>
                </>
              )}
            </button>
          </form>

          {/* Instant Demo Presets */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
              Instant Benchmarks:
            </span>
            {Object.keys(DEMO_PRESETS).map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setUrlInput(preset);
                  setActivePreset(preset);
                  setData(DEMO_PRESETS[preset]);
                  setError(null);
                }}
                className={`px-3 py-1 rounded-lg font-mono text-xs transition-colors cursor-pointer ${
                  activePreset === preset
                    ? "bg-blue-600 text-white font-bold shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {preset}
              </button>
            ))}

            {data && (
              <Link
                href={`/analyze?url=${encodeURIComponent(data.url)}&tab=structure`}
                className="ml-auto text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                Full 360° SEO Audit View →
              </Link>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-3 animate-in fade-in">
            <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Extraction Error</div>
              <p className="mt-0.5 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* DATA REPORT VIEW */}
        {data && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Target Information Strip */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm border border-blue-100 shrink-0">
                  DOM
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-black text-slate-900 font-mono">
                      {data.domain}
                    </span>
                    <a
                      href={data.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-blue-600 transition-colors"
                      title="Open page in new window"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-1 max-w-xl">
                    {data.title || data.url}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {data.wordCount.toLocaleString()} words
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  ~{data.readingTimeMinutes}m read
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {data.responseTimeMs}ms response
                </span>
              </div>
            </div>

            {/* 5 Executive KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              {/* Card 1: Hierarchy Health Score */}
              <div className="flat-card p-4 sm:p-5 bg-white border border-slate-200 col-span-2 sm:col-span-1">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Hierarchy Score
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                    {score}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${gradeColor}`}>
                    {grade}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Semantic integrity grade</div>
              </div>

              {/* Card 2: H1 Main Heading */}
              <div className="flat-card p-4 sm:p-5 bg-white border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Root H1 Status
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-blue-600 font-mono">
                    {data.headings.h1Count}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      data.headings.h1Count === 1
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {data.headings.h1Count === 1 ? "Ideal (1)" : data.headings.h1Count === 0 ? "Missing (0)" : "Multiple"}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Single root topic entity</div>
              </div>

              {/* Card 3: Total Headings */}
              <div className="flat-card p-4 sm:p-5 bg-white border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Total Headings
                </div>
                <div className="text-2xl sm:text-3xl font-black text-indigo-600 mt-1 font-mono">
                  {data.headings.totalHeadings}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">H1 through H6 nodes</div>
              </div>

              {/* Card 4: Skipped Level Diagnostics */}
              <div className="flat-card p-4 sm:p-5 bg-white border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Skipped Levels
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  {(data.headings.skippedLevelsCount || 0) === 0 ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-base sm:text-lg font-bold text-emerald-700">0 Skipped</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                      <span className="text-base sm:text-lg font-bold text-amber-700 font-mono">
                        {data.headings.skippedLevelsCount} Skipped
                      </span>
                    </>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {(data.headings.skippedLevelsCount || 0) === 0
                    ? "Strict sequential order"
                    : "Hierarchy gaps detected"}
                </div>
              </div>

              {/* Card 5: Content-to-Heading Ratio */}
              <div className="flat-card p-4 sm:p-5 bg-white border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Section Density
                </div>
                <div className="text-2xl sm:text-3xl font-black text-purple-600 mt-1 font-mono">
                  {Math.round(data.wordCount / (data.headings.totalHeadings || 1))}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Words per section heading</div>
              </div>
            </div>

            {/* Visual Heading Tag Depth Distribution */}
            <div className="flat-card p-5 bg-white border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    Heading Tag Depth Distribution
                  </h3>
                  <p className="text-xs text-slate-500">
                    Proportional breakdown of document heading tags across semantic hierarchy levels.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-blue-600"></span>
                    <strong className="text-slate-800">H1:</strong> {data.headings.h1Count}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500"></span>
                    <strong className="text-slate-800">H2:</strong> {data.headings.h2Count}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-purple-500"></span>
                    <strong className="text-slate-800">H3:</strong> {data.headings.h3Count}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>
                    <strong className="text-slate-800">H4:</strong> {data.headings.h4Count}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-slate-400"></span>
                    <strong className="text-slate-800">H5-H6:</strong> {data.headings.h5Count + data.headings.h6Count}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                <div
                  className="bg-blue-600 h-full transition-all duration-500"
                  style={{ width: `${Math.max(2, (data.headings.h1Count / (data.headings.totalHeadings || 1)) * 100)}%` }}
                  title={`H1: ${data.headings.h1Count}`}
                />
                <div
                  className="bg-indigo-500 h-full transition-all duration-500"
                  style={{ width: `${((data.headings.h2Count / (data.headings.totalHeadings || 1)) * 100)}%` }}
                  title={`H2: ${data.headings.h2Count}`}
                />
                <div
                  className="bg-purple-500 h-full transition-all duration-500"
                  style={{ width: `${((data.headings.h3Count / (data.headings.totalHeadings || 1)) * 100)}%` }}
                  title={`H3: ${data.headings.h3Count}`}
                />
                <div
                  className="bg-amber-500 h-full transition-all duration-500"
                  style={{ width: `${((data.headings.h4Count / (data.headings.totalHeadings || 1)) * 100)}%` }}
                  title={`H4: ${data.headings.h4Count}`}
                />
                <div
                  className="bg-slate-400 h-full transition-all duration-500"
                  style={{ width: `${(((data.headings.h5Count + data.headings.h6Count) / (data.headings.totalHeadings || 1)) * 100)}%` }}
                  title={`H5-H6: ${data.headings.h5Count + data.headings.h6Count}`}
                />
              </div>
            </div>

            {/* Heading Issues & Diagnostic Alerts (if any) */}
            {data.headings.issues && data.headings.issues.length > 0 && (
              <div className="flat-card p-5 bg-white border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Hierarchy Diagnostic Warnings ({data.headings.issues.length})
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Fixing these optimizes crawler comprehension &amp; accessibility
                  </span>
                </div>

                <div className="space-y-2.5">
                  {data.headings.issues.map((issue, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs ${
                        issue.severity === "error"
                          ? "bg-rose-50/70 border-rose-200 text-rose-800"
                          : issue.severity === "warning"
                          ? "bg-amber-50/70 border-amber-200 text-amber-800"
                          : "bg-blue-50/70 border-blue-200 text-blue-800"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 mt-0.5 ${
                            issue.severity === "error"
                              ? "bg-rose-600 text-white"
                              : issue.severity === "warning"
                              ? "bg-amber-600 text-white"
                              : "bg-blue-600 text-white"
                          }`}
                        >
                          {issue.severity}
                        </span>
                        <div>
                          <div className="font-bold leading-snug">{issue.message}</div>
                          {issue.text && (
                            <div className="text-[11px] opacity-80 mt-0.5 font-mono">
                              Target heading: &quot;{issue.text}&quot;
                            </div>
                          )}
                        </div>
                      </div>

                      {issue.order && (
                        <span className="text-[10px] font-mono opacity-70 shrink-0 self-start sm:self-auto">
                          Node #{issue.order}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DOM Visual Tree & Heading Ladder Studio */}
            <div className="flat-card p-6 bg-white border border-slate-200 shadow-xs">
              {/* Controls Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-5 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-blue-600" />
                    Interactive DOM Heading Ladder &amp; Document Tree
                  </h3>
                  <p className="text-xs text-slate-500">
                    Hierarchical outline representation matching real search crawler DOM traversal order.
                  </p>
                </div>

                {/* View Mode Switcher */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start md:self-auto">
                  <button
                    onClick={() => setViewMode("tree")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      viewMode === "tree" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Visual Tree
                  </button>
                  <button
                    onClick={() => setViewMode("ladder")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      viewMode === "ladder" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    DOM Sequence
                  </button>
                </div>
              </div>

              {/* Filter Tabs & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
                {/* Level Filters */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
                  <button
                    onClick={() => setLevelFilter("all")}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      levelFilter === "all"
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    All ({data.headings.totalHeadings})
                  </button>
                  <button
                    onClick={() => setLevelFilter("h1")}
                    className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      levelFilter === "h1"
                        ? "bg-blue-600 text-white"
                        : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                    }`}
                  >
                    H1 ({data.headings.h1Count})
                  </button>
                  <button
                    onClick={() => setLevelFilter("h2")}
                    className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      levelFilter === "h2"
                        ? "bg-indigo-600 text-white"
                        : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                    }`}
                  >
                    H2 ({data.headings.h2Count})
                  </button>
                  <button
                    onClick={() => setLevelFilter("h3")}
                    className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      levelFilter === "h3"
                        ? "bg-purple-600 text-white"
                        : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                    }`}
                  >
                    H3 ({data.headings.h3Count})
                  </button>
                  <button
                    onClick={() => setLevelFilter("h4plus")}
                    className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      levelFilter === "h4plus"
                        ? "bg-amber-600 text-white"
                        : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                    }`}
                  >
                    H4–H6 ({data.headings.h4Count + data.headings.h5Count + data.headings.h6Count})
                  </button>
                  {(data.headings.issues?.length || 0) > 0 && (
                    <button
                      onClick={() => setLevelFilter("issues")}
                      className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        levelFilter === "issues"
                          ? "bg-rose-600 text-white"
                          : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                      }`}
                    >
                      Issues Only ({data.headings.issues?.length})
                    </button>
                  )}
                </div>

                {/* Keyword Search */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search heading text..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50"
                  />
                </div>
              </div>

              {/* HEADING ITEMS LIST / TREE */}
              {filteredHeadings.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <div className="font-bold text-slate-700">No headings match this filter</div>
                  <p className="mt-1">Try switching to &quot;All&quot; or clearing your search query.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredHeadings.map((item, idx) => {
                    // Tree indentation calculation
                    const indentPx = viewMode === "tree" ? Math.min(80, (item.level - 1) * 24) : 0;

                    // Color tokens per tag
                    const badgeStyles =
                      item.level === 1
                        ? "bg-blue-600 text-white border-blue-700 shadow-xs"
                        : item.level === 2
                        ? "bg-indigo-600 text-white border-indigo-700"
                        : item.level === 3
                        ? "bg-purple-600 text-white border-purple-700"
                        : item.level === 4
                        ? "bg-amber-600 text-white border-amber-700"
                        : "bg-slate-600 text-white border-slate-700";

                    const cardBg =
                      item.level === 1
                        ? "bg-blue-50/60 border-blue-200 hover:bg-blue-50"
                        : item.level === 2
                        ? "bg-white border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30"
                        : item.level === 3
                        ? "bg-white border-slate-200 hover:border-purple-200 hover:bg-purple-50/20"
                        : "bg-slate-50/70 border-slate-200 hover:bg-slate-50";

                    return (
                      <div
                        key={idx}
                        style={{ marginLeft: `${indentPx}px` }}
                        className={`p-3.5 rounded-xl border transition-all ${cardBg} shadow-xs relative`}
                      >
                        {/* Tree connector branch visual */}
                        {viewMode === "tree" && item.level > 1 && (
                          <div
                            className="absolute -left-3 top-1/2 w-3 h-0.5 bg-slate-300 -translate-y-1/2 pointer-events-none"
                            style={{ display: indentPx > 0 ? "block" : "none" }}
                          />
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-2.5 min-w-0">
                            {/* Heading Tag Badge */}
                            <span
                              className={`px-2 py-0.5 text-[11px] font-black rounded-md uppercase tracking-wider shrink-0 mt-0.5 border ${badgeStyles}`}
                            >
                              &lt;{item.tag.toUpperCase()}&gt;
                            </span>

                            <div className="min-w-0">
                              <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug break-words">
                                {item.text}
                              </div>

                              <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500">
                                <span>Sequence Node #{item.order}</span>
                                <span>•</span>
                                <span className={item.isOverLength ? "text-amber-600 font-semibold" : "text-slate-500"}>
                                  {item.charCount} characters
                                  {item.isOverLength && " (Over 70 chars)"}
                                </span>

                                {item.isSkipped && (
                                  <>
                                    <span>•</span>
                                    <span className="text-amber-700 font-bold flex items-center gap-1 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                                      Skipped Level Jump
                                    </span>
                                  </>
                                )}

                                {item.isEmpty && (
                                  <>
                                    <span>•</span>
                                    <span className="text-rose-700 font-bold bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                                      Empty Heading Tag
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Quick copy text button */}
                          <button
                            onClick={() => handleCopySingleHeading(item.text, idx)}
                            className="px-2 py-1 text-[11px] font-mono text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors self-start sm:self-auto shrink-0 flex items-center gap-1"
                            title="Copy heading text"
                          >
                            {copiedHeadingIdx === idx ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700 font-bold">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Google AI Overview & Semantic Readiness Guide */}
            <div className="flat-card p-6 bg-linear-to-br from-blue-50/50 via-white to-indigo-50/50 border border-blue-200/80 shadow-xs">
              <div className="flex items-center gap-2.5 text-blue-900 font-bold text-sm mb-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Google AI Overviews &amp; Featured Snippet Semantic Readiness
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4 max-w-4xl">
                Modern search algorithms and generative AI engines (Google AI Overviews, ChatGPT, Gemini, Perplexity) analyze HTML heading hierarchy as the primary document outline to extract passage-level answers. Clear, un-skipped H2 and H3 tags drastically increase citation eligibility.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Single Root Subject (H1)
                  </div>
                  <p className="text-slate-500 leading-relaxed">
                    Always reserve &lt;H1&gt; exclusively for the primary entity topic. Never place multiple H1 tags across marketing sections.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Sequential Depth (H2 → H3)
                  </div>
                  <p className="text-slate-500 leading-relaxed">
                    Never jump directly from &lt;H1&gt; to &lt;H3&gt; or from &lt;H2&gt; to &lt;H4&gt;. Screen readers and AI scrapers use depth to build semantic taxonomies.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Question-Based Subheadings
                  </div>
                  <p className="text-slate-500 leading-relaxed">
                    Formulate H2 and H3 tags as concise queries (&quot;How does X work?&quot;, &quot;What are the pricing tiers?&quot;) to rank for zero-click AI answers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
