"use client";

import { useState, useMemo } from "react";
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
  Globe,
  Copy,
  Check,
  Download,
  ExternalLink,
  Star,
  Calendar,
  DollarSign,
  HelpCircle,
  Sliders,
  Wand2,
  Layers,
  Ruler,
  Code2,
  Tag,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Zap,
  Info,
  Flame,
  CheckSquare,
  XSquare,
  Bot,
} from "lucide-react";

interface SitelinkItem {
  title: string;
  url: string;
  description: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

export default function SerpPreviewClient() {
  const [url, setUrl] = useState("https://stripe.com");
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // View modes
  const [viewMode, setViewMode] = useState<"desktop" | "mobile" | "ai-overview" | "competitor">("desktop");
  const [activeTab, setActiveTab] = useState<"editor" | "snippets" | "ai-generator" | "code">("editor");
  const [showRuler, setShowRuler] = useState(false);

  // Metadata State
  const [title, setTitle] = useState("Stripe | Financial Infrastructure for the Internet");
  const [description, setDescription] = useState(
    "Stripe is a suite of APIs powering online payment processing and commerce solutions for internet businesses of every size. Start accepting payments in minutes."
  );
  const [canonical, setCanonical] = useState("https://stripe.com/");
  const [domain, setDomain] = useState("stripe.com");
  const [brandName, setBrandName] = useState("Stripe");
  const [favicon, setFavicon] = useState("https://stripe.com/favicon.ico");
  const [searchQuery, setSearchQuery] = useState("payment infrastructure API");

  // Rich Snippet Enhancements
  const [enableRating, setEnableRating] = useState(true);
  const [ratingValue, setRatingValue] = useState("4.9");
  const [ratingCount, setRatingCount] = useState("1,840");

  const [enableDate, setEnableDate] = useState(true);
  const [publishDate, setPublishDate] = useState("Oct 24, 2026");

  const [enablePricing, setEnablePricing] = useState(false);
  const [pricingText, setPricingText] = useState("$29.00 - In stock");

  const [enableSitelinks, setEnableSitelinks] = useState(true);
  const [sitelinks, setSitelinks] = useState<SitelinkItem[]>([
    {
      title: "Pricing",
      url: "https://stripe.com/pricing",
      description: "Explore pay-as-you-go pricing for cards, wallets, and local payments.",
    },
    {
      title: "Documentation",
      url: "https://stripe.com/docs",
      description: "Quickstart guides, code samples, and comprehensive API reference.",
    },
    {
      title: "Payments API",
      url: "https://stripe.com/payments",
      description: "Accept payments online, in-person, and around the world.",
    },
    {
      title: "Sign In",
      url: "https://dashboard.stripe.com/login",
      description: "Log in to your Stripe account to manage payments and payouts.",
    },
  ]);

  const [enableFaq, setEnableFaq] = useState(false);
  const [faqItems, setFaqItems] = useState<FaqItem[]>([
    {
      question: "How long does it take to integrate Stripe?",
      answer: "Most developers can deploy Stripe Checkout and start processing payments within an hour using our pre-built UIs and SDKs.",
    },
    {
      question: "What payment methods are supported?",
      answer: "Stripe supports credit/debit cards, Apple Pay, Google Pay, buy now pay later (Klarna, Affirm), and 100+ local payment methods worldwide.",
    },
  ]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const presets = [
    { label: "Stripe", url: "https://stripe.com" },
    { label: "Linear", url: "https://linear.app" },
    { label: "Vercel", url: "https://vercel.com" },
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
      const res = await fetch(`/api/tools/serp?url=${encodeURIComponent(formattedUrl)}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to generate SERP preview.");
      }

      setTitle(json.serp.title || "Homepage Title");
      setDescription(json.serp.metaDescription || "Website meta description.");
      setCanonical(json.serp.canonical || formattedUrl);
      setDomain(json.domain || "example.com");
      if (json.brandName) setBrandName(json.brandName);
      if (json.serp.favicon) setFavicon(json.serp.favicon);

      if (json.serp.suggestedSitelinks && json.serp.suggestedSitelinks.length > 0) {
        setSitelinks(json.serp.suggestedSitelinks);
      }
      showToast(`Scanned ${json.domain} successfully!`);
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to generate SERP snippet.");
    } finally {
      setLoading(false);
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

  // Pixel calculations
  const titlePixelWidth = Math.round(title.length * 9.5);
  const descPixelWidth = Math.round(description.length * 6.8);

  const titleMaxPixels = viewMode === "mobile" ? 540 : 580;
  const descMaxPixels = viewMode === "mobile" ? 680 : 960;

  const isTitleOver = titlePixelWidth > titleMaxPixels || title.length > 60;
  const isDescOver = descPixelWidth > descMaxPixels || description.length > 160;

  // Click-Through-Rate (CTR) & Quality Analysis
  const ctrAnalysis = useMemo(() => {
    let score = 50;
    const checks: { label: string; passed: boolean; tip: string }[] = [];

    // Title Length Check
    const titleGoodLength = title.length >= 45 && title.length <= 60 && titlePixelWidth <= titleMaxPixels;
    checks.push({
      label: "Title Length (45–60 chars)",
      passed: titleGoodLength,
      tip: title.length < 45 ? "Title is short. Add primary benefits or brand." : title.length > 60 ? "Title exceeds 60 characters and will be truncated by Google." : "Perfect length for desktop and mobile.",
    });
    if (titleGoodLength) score += 15;
    else if (title.length > 60) score -= 10;

    // Description Length Check
    const descGoodLength = description.length >= 120 && description.length <= 158 && descPixelWidth <= descMaxPixels;
    checks.push({
      label: "Meta Description (120–155 chars)",
      passed: descGoodLength,
      tip: description.length < 120 ? "Description is too brief. Expand with features and user benefit." : description.length > 158 ? "Description exceeds ~155 chars and may be trimmed on mobile." : "Optimal description length.",
    });
    if (descGoodLength) score += 15;
    else if (description.length > 160) score -= 5;

    // Power Words & Numbers
    const powerWords = ["best", "free", "guide", "pricing", "fast", "top", "easy", "2026", "official", "save", "review", "new", "how", "ultimate"];
    const hasPowerWord = powerWords.some((pw) => title.toLowerCase().includes(pw) || description.toLowerCase().includes(pw));
    checks.push({
      label: "Power Word / Value Trigger",
      passed: hasPowerWord,
      tip: hasPowerWord ? "Contains engaging action/power words." : "Add power words (e.g. 'Best', 'Free', '2026', 'Guide') to boost clicks.",
    });
    if (hasPowerWord) score += 10;

    // Brand Name presence
    const hasBrand = title.includes("|") || title.includes("-") || title.toLowerCase().includes(brandName.toLowerCase());
    checks.push({
      label: "Brand Identity Separation",
      passed: hasBrand,
      tip: hasBrand ? "Brand clearly separated with pipe or dash." : "Add your brand name at the end (e.g., ' | BrandName').",
    });
    if (hasBrand) score += 5;

    // Rich Snippets Enhancement
    const hasRichSnippets = enableRating || enableSitelinks || enableFaq;
    checks.push({
      label: "Rich Snippets Active",
      passed: hasRichSnippets,
      tip: hasRichSnippets ? "Rich snippets configured (Ratings/Sitelinks/FAQ)." : "Enable ratings or sitelinks to dominate organic SERP real-estate.",
    });
    if (hasRichSnippets) score += 5;

    const clampedScore = Math.min(100, Math.max(30, score));
    return { score: clampedScore, checks };
  }, [title, description, titlePixelWidth, descPixelWidth, titleMaxPixels, descMaxPixels, brandName, enableRating, enableSitelinks, enableFaq]);

  // Keyword Bolding in SERP
  const renderHighlightedText = (text: string, query: string) => {
    if (!query || !query.trim()) return text;
    const words = query
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 2);
    if (words.length === 0) return text;

    const regex = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <strong key={i} className="font-semibold text-slate-900">
          {part}
        </strong>
      ) : (
        part
      )
    );
  };

  // AI Headline Variations
  const aiVariations = [
    {
      type: "Action & High CTR",
      badge: "Highest CTR",
      title: `${brandName} — Modern Solutions to Accelerate Growth (2026)`,
      description: `Discover how ${brandName} helps businesses scale with next-generation tools, real-time analytics, and enterprise reliability. Try it free today.`,
    },
    {
      type: "Direct & SEO Focused",
      badge: "Keyword Ranked",
      title: `Best ${searchQuery || "Tools"} | Official ${brandName} Platform`,
      description: `Explore the industry-leading platform for ${searchQuery || "digital operations"}. Trusted by thousands of top teams worldwide. View pricing & demos.`,
    },
    {
      type: "Curiosity & Benefit",
      badge: "Engaging Hook",
      title: `Why Top Developers Switch to ${brandName} in 2026`,
      description: `Stop wrestling with slow, outdated workflows. ${brandName} delivers instant setup, high performance APIs, and 99.99% uptime out of the box.`,
    },
    {
      type: "Proof & Authority",
      badge: "Social Proof",
      title: `${brandName}: Rated 4.9/5 by 10,000+ Teams Worldwide`,
      description: `Join global leaders who rely on ${brandName} every day. Zero hidden fees, seamless integrations, and 24/7 dedicated support.`,
    },
  ];

  // Generated Meta Code
  const generatedMetaCode = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}" />
<meta name="description" content="${description}" />
<link rel="canonical" href="${canonical}" />

<!-- Open Graph / Facebook / LinkedIn -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${canonical}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:site_name" content="${brandName}" />

<!-- Twitter / X -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${canonical}" />
<meta property="twitter:title" content="${title}" />
<meta property="twitter:description" content="${description}" />`;

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
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-2.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center border border-blue-500/20 text-blue-600 font-bold text-xs shrink-0">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">{domain || "SERP Simulator"}</span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    ctrAnalysis.score >= 80
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : ctrAnalysis.score >= 60
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  CTR Score: {ctrAnalysis.score}/100
                </span>
                {!isTitleOver && !isDescOver && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Optimal Pixel Fit
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 truncate max-w-[280px] sm:max-w-md">{title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setViewMode("desktop")}
                className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === "desktop" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" /> Desktop
              </button>
              <button
                onClick={() => setViewMode("mobile")}
                className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === "mobile" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Mobile
              </button>
              <button
                onClick={() => setViewMode("ai-overview")}
                className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === "ai-overview" ? "bg-white text-purple-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-purple-600" /> AI Overview
              </button>
              <button
                onClick={() => setViewMode("competitor")}
                className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === "competitor" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-indigo-600" /> Competitors
              </button>
            </div>

            <button
              onClick={() => copyToClipboard(generatedMetaCode, "HTML Meta Tags")}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Copy Meta Tags</span>
            </button>

            <Link
              href={`/analyze?url=${encodeURIComponent(canonical)}`}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Full SEO Audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-6">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Google SERP Simulator &amp; CTR Studio
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Google Desktop, Mobile &amp; AI Overview Simulator
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Inspect pixel truncation limits, simulate AI Overviews and rich snippets, test keyword bolding, and optimize organic click-through rates (CTR).
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
                placeholder="Enter URL to preview (e.g. https://yourdomain.com)"
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
                  Simulating...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Preview SERP
                </>
              )}
            </button>
          </form>

          {/* Presets */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-500">
            <span>Explore live presets:</span>
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setUrl(p.url);
                  handleScan(p.url);
                }}
                className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors font-medium cursor-pointer"
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

        {/* Telemetry KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Title Budget */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
              <span>Title Pixel Budget</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                isTitleOver ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
              }`}>
                {isTitleOver ? "Truncated" : "Fits"}
              </span>
            </div>
            <div className="text-xl font-extrabold text-slate-900">
              {titlePixelWidth} <span className="text-xs font-normal text-slate-400">/ {titleMaxPixels}px</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5 flex justify-between">
              <span>{title.length} characters</span>
              <span className="text-[11px] text-slate-400">Target: 45–60 chars</span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isTitleOver ? "bg-rose-500" : titlePixelWidth > titleMaxPixels * 0.85 ? "bg-emerald-500" : "bg-blue-500"
                }`}
                style={{ width: `${Math.min(100, (titlePixelWidth / titleMaxPixels) * 100)}%` }}
              />
            </div>
          </div>

          {/* Card 2: Description Budget */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
              <span>Meta Description Budget</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                isDescOver ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
              }`}>
                {isDescOver ? "Trimmed" : "Fits"}
              </span>
            </div>
            <div className="text-xl font-extrabold text-slate-900">
              {descPixelWidth} <span className="text-xs font-normal text-slate-400">/ {descMaxPixels}px</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5 flex justify-between">
              <span>{description.length} characters</span>
              <span className="text-[11px] text-slate-400">Target: 120–155 chars</span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isDescOver ? "bg-rose-500" : descPixelWidth > descMaxPixels * 0.85 ? "bg-emerald-500" : "bg-blue-500"
                }`}
                style={{ width: `${Math.min(100, (descPixelWidth / descMaxPixels) * 100)}%` }}
              />
            </div>
          </div>

          {/* Card 3: CTR Index */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
              <span>CTR Clickability Score</span>
              <Zap className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-xl font-extrabold text-slate-900">
              {ctrAnalysis.score} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {ctrAnalysis.score >= 80 ? "A+ Click Magnet" : ctrAnalysis.score >= 60 ? "Good Click Appeal" : "Needs Optimization"}
            </div>
            <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  ctrAnalysis.score >= 80 ? "bg-emerald-500" : ctrAnalysis.score >= 60 ? "bg-blue-500" : "bg-amber-500"
                }`}
                style={{ width: `${ctrAnalysis.score}%` }}
              />
            </div>
          </div>

          {/* Card 4: Rich Snippet Elements */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
              <span>Rich Snippet Features</span>
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="text-xl font-extrabold text-slate-900">
              {[enableRating, enableSitelinks, enableDate, enablePricing, enableFaq].filter(Boolean).length}{" "}
              <span className="text-xs font-normal text-slate-400">/ 5 Active</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5 truncate">
              {enableRating ? "Ratings • " : ""}{enableSitelinks ? "Sitelinks • " : ""}{enableDate ? "Date" : ""}
            </div>
            <div className="mt-2 flex gap-1">
              {[enableRating, enableSitelinks, enableDate, enablePricing, enableFaq].map((act, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${act ? "bg-indigo-500" : "bg-slate-200"}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Main 2-Column Workstation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Snippet Studio & Controllers */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Tab Header */}
            <div className="flex border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1">
              <button
                onClick={() => setActiveTab("editor")}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "editor"
                    ? "bg-white text-blue-700 shadow-xs border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Editor</span>
              </button>
              <button
                onClick={() => setActiveTab("snippets")}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "snippets"
                    ? "bg-white text-blue-700 shadow-xs border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                <span>Rich Snippets</span>
              </button>
              <button
                onClick={() => setActiveTab("ai-generator")}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "ai-generator"
                    ? "bg-white text-purple-700 shadow-xs border border-purple-200/80"
                    : "text-slate-600 hover:text-purple-700 hover:bg-purple-50"
                }`}
              >
                <Wand2 className="w-3.5 h-3.5 text-purple-600" />
                <span>AI Rewrites</span>
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "code"
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>HTML</span>
              </button>
            </div>

            {/* Tab 1: Metadata Editor */}
            {activeTab === "editor" && (
              <div className="p-5 space-y-5">
                {/* Search Query Simulator */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-blue-600" />
                      Target Search Query (Keywords to Bold)
                    </span>
                    <span className="text-[11px] text-slate-400">Simulates Google match</span>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. payment processing api"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                </div>

                {/* Title Tag */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-indigo-600" />
                      Title Tag (&lt;title&gt;)
                    </span>
                    <span className={isTitleOver ? "text-rose-600 font-bold" : "text-slate-500"}>
                      {title.length} chars / ~{titlePixelWidth}px (Max: {titleMaxPixels}px)
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter page title tag..."
                      className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-2 ${
                        isTitleOver
                          ? "border-rose-300 focus:ring-rose-500 bg-rose-50/20"
                          : "border-slate-300 focus:ring-blue-600 bg-white"
                      }`}
                    />
                  </div>

                  {/* Separator Quick Insertion */}
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500">
                    <span>Quick brand separators:</span>
                    {["|", "—", "•", "›"].map((sep) => (
                      <button
                        key={sep}
                        type="button"
                        onClick={() => setTitle(`${title.trim()} ${sep} ${brandName}`)}
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer transition-colors"
                      >
                        {sep} {brandName}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Meta Description */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-emerald-600" />
                      Meta Description
                    </span>
                    <span className={isDescOver ? "text-rose-600 font-bold" : "text-slate-500"}>
                      {description.length} chars / ~{descPixelWidth}px (Max: {descMaxPixels}px)
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter meta description summary..."
                    className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-2 ${
                      isDescOver
                        ? "border-rose-300 focus:ring-rose-500 bg-rose-50/20"
                        : "border-slate-300 focus:ring-blue-600 bg-white"
                    }`}
                  />
                  <div className="flex justify-between items-center mt-1 text-[11px] text-slate-400">
                    <span>Recommendation: 120–155 characters for mobile &amp; desktop visibility.</span>
                    <button
                      type="button"
                      onClick={() => setDescription("")}
                      className="text-slate-400 hover:text-slate-600 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Brand & Canonical */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Brand / Site Name</label>
                    <input
                      type="text"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="e.g. Stripe"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Canonical URL</label>
                    <input
                      type="text"
                      value={canonical}
                      onChange={(e) => setCanonical(e.target.value)}
                      placeholder="https://stripe.com/"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Rich Snippets & Features */}
            {activeTab === "snippets" && (
              <div className="p-5 space-y-5">
                <div className="text-xs text-slate-500">
                  Toggle and customize rich snippet elements that Google renders when Schema.org markup is present.
                </div>

                {/* Star Ratings */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableRating}
                        onChange={(e) => setEnableRating(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                      <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                      Review &amp; Aggregate Star Rating
                    </label>
                    <span className="text-[10px] text-slate-400">Schema AggregateRating</span>
                  </div>

                  {enableRating && (
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Rating (1.0 - 5.0)</label>
                        <input
                          type="text"
                          value={ratingValue}
                          onChange={(e) => setRatingValue(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-0.5">Total Reviews</label>
                        <input
                          type="text"
                          value={ratingCount}
                          onChange={(e) => setRatingCount(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Publish Date */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableDate}
                        onChange={(e) => setEnableDate(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                      <Calendar className="w-4 h-4 text-blue-600" />
                      Published Snippet Date
                    </label>
                    <span className="text-[10px] text-slate-400">Article / Blog</span>
                  </div>
                  {enableDate && (
                    <input
                      type="text"
                      value={publishDate}
                      onChange={(e) => setPublishDate(e.target.value)}
                      placeholder="e.g. Oct 24, 2026"
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                    />
                  )}
                </div>

                {/* Sitelinks */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableSitelinks}
                        onChange={(e) => setEnableSitelinks(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                      <Layers className="w-4 h-4 text-indigo-600" />
                      Google Sitelinks Block ({sitelinks.length})
                    </label>
                    <span className="text-[10px] text-slate-400">Expanded SERP Footprint</span>
                  </div>

                  {enableSitelinks && (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {sitelinks.map((link, idx) => (
                        <div key={idx} className="p-2 rounded bg-white border border-slate-200 text-xs space-y-1">
                          <input
                            type="text"
                            value={link.title}
                            onChange={(e) => {
                              const updated = [...sitelinks];
                              updated[idx].title = e.target.value;
                              setSitelinks(updated);
                            }}
                            placeholder="Sitelink Title..."
                            className="w-full font-semibold px-2 py-1 border border-slate-200 rounded text-xs"
                          />
                          <input
                            type="text"
                            value={link.description}
                            onChange={(e) => {
                              const updated = [...sitelinks];
                              updated[idx].description = e.target.value;
                              setSitelinks(updated);
                            }}
                            placeholder="Sitelink Description..."
                            className="w-full text-slate-500 px-2 py-1 border border-slate-200 rounded text-[11px]"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* FAQ Accordions */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableFaq}
                        onChange={(e) => setEnableFaq(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                      <HelpCircle className="w-4 h-4 text-emerald-600" />
                      FAQ Accordion Dropdowns
                    </label>
                    <span className="text-[10px] text-slate-400">FAQPage Schema</span>
                  </div>

                  {enableFaq && (
                    <div className="space-y-2">
                      {faqItems.map((faq, idx) => (
                        <div key={idx} className="p-2 rounded bg-white border border-slate-200 text-xs space-y-1">
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => {
                              const updated = [...faqItems];
                              updated[idx].question = e.target.value;
                              setFaqItems(updated);
                            }}
                            className="w-full font-semibold px-2 py-1 border border-slate-200 rounded text-xs"
                          />
                          <textarea
                            rows={2}
                            value={faq.answer}
                            onChange={(e) => {
                              const updated = [...faqItems];
                              updated[idx].answer = e.target.value;
                              setFaqItems(updated);
                            }}
                            className="w-full text-slate-500 px-2 py-1 border border-slate-200 rounded text-[11px]"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price & Stock */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enablePricing}
                        onChange={(e) => setEnablePricing(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      Pricing &amp; In-Stock Badge
                    </label>
                    <span className="text-[10px] text-slate-400">Product Schema</span>
                  </div>
                  {enablePricing && (
                    <input
                      type="text"
                      value={pricingText}
                      onChange={(e) => setPricingText(e.target.value)}
                      placeholder="e.g. $29.00 - In stock"
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: AI CTR Rewriter */}
            {activeTab === "ai-generator" && (
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
                    <Wand2 className="w-4 h-4 text-purple-600" />
                    <span>AI Click-Through Rate Optimizers</span>
                  </div>
                  <span className="text-[11px] text-slate-400">1-Click Apply</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Proven title and description angles engineered to increase CTR and capture organic impressions.
                </p>

                <div className="space-y-3">
                  {aiVariations.map((v, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-200 bg-white hover:border-purple-300 transition-colors space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{v.type}</span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                          {v.badge}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900 leading-snug">{v.title}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{v.description}</p>
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setTitle(v.title);
                            setDescription(v.description);
                            showToast(`Applied ${v.type} to live preview!`);
                          }}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" /> Apply Variation
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Clean HTML Code */}
            {activeTab === "code" && (
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">HTML Head Tags</span>
                  <button
                    type="button"
                    onClick={() => {
                      copyToClipboard(generatedMetaCode, "HTML Tags");
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2000);
                    }}
                    className="px-2.5 py-1 rounded bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? "Copied" : "Copy All"}</span>
                  </button>
                </div>
                <div className="relative">
                  <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800 max-h-96">
                    <code>{generatedMetaCode}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Google SERP Preview Arena */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              {/* Simulator Navigation Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    Live Google Result Simulator
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowRuler(!showRuler)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                      showRuler ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Ruler className="w-3 h-3" />
                    <span>{showRuler ? "Hide Ruler" : "Pixel Ruler"}</span>
                  </button>
                </div>

                {/* Device Selector */}
                <div className="flex gap-1 p-1 bg-slate-100 rounded-lg text-xs">
                  <button
                    onClick={() => setViewMode("desktop")}
                    className={`px-2.5 py-1 font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                      viewMode === "desktop" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" /> Desktop
                  </button>
                  <button
                    onClick={() => setViewMode("mobile")}
                    className={`px-2.5 py-1 font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                      viewMode === "mobile" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" /> Mobile
                  </button>
                  <button
                    onClick={() => setViewMode("ai-overview")}
                    className={`px-2.5 py-1 font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                      viewMode === "ai-overview" ? "bg-white text-purple-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Bot className="w-3.5 h-3.5 text-purple-600" /> AI Overview
                  </button>
                  <button
                    onClick={() => setViewMode("competitor")}
                    className={`px-2.5 py-1 font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                      viewMode === "competitor" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-indigo-600" /> Full SERP
                  </button>
                </div>
              </div>

              {/* Pixel Ruler (Optional Toggle) */}
              {showRuler && (
                <div className="mb-4 p-2 bg-slate-100 rounded-lg border border-slate-200">
                  <div className="flex justify-between text-[9px] font-mono text-slate-500 mb-1">
                    <span>0px</span>
                    <span>150px</span>
                    <span>300px</span>
                    <span>450px</span>
                    <span className="text-rose-600 font-bold">580px (Cutoff)</span>
                    <span>600px</span>
                  </div>
                  <div className="relative h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${isTitleOver ? "bg-rose-500" : "bg-blue-600"}`}
                      style={{ width: `${Math.min(100, (titlePixelWidth / 600) * 100)}%` }}
                    />
                    <div className="absolute top-0 bottom-0 left-[96.6%] w-0.5 bg-rose-600" title="580px Limit" />
                  </div>
                </div>
              )}

              {/* 1. DESKTOP VIEW */}
              {viewMode === "desktop" && (
                <div className="p-6 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
                  {/* Google Desktop Header: Favicon + Brand URL */}
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center p-1 border border-slate-200 shrink-0">
                      {favicon ? (
                        <img src={favicon} alt="Favicon" className="w-4 h-4 rounded-full object-contain" />
                      ) : (
                        <Globe className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div className="text-[14px] leading-tight">
                      <div className="text-slate-900 font-medium">{brandName || domain}</div>
                      <div className="text-[#4d5156] text-[12px] flex items-center gap-1 truncate max-w-lg">
                        <span>{canonical || `https://${domain}/`}</span>
                        <span className="text-slate-400">›</span>
                      </div>
                    </div>
                  </div>

                  {/* Title (Google Blue #1a0dab) */}
                  <h4
                    className="text-[20px] text-[#1a0dab] hover:underline font-normal cursor-pointer leading-[1.3] pt-0.5 pb-1 max-w-[600px]"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    {renderHighlightedText(title || "Example Web Page Title", searchQuery)}
                  </h4>

                  {/* Ratings & Price Snippets */}
                  {(enableRating || enablePricing) && (
                    <div className="flex items-center gap-3 text-xs text-[#70757a] mb-1.5 font-sans">
                      {enableRating && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#e37400] font-medium">Rating: {ratingValue}</span>
                          <span className="text-[#e37400]">★★★★★</span>
                          <span>· {ratingCount} reviews</span>
                        </div>
                      )}
                      {enablePricing && (
                        <div className="text-slate-700 font-medium">
                          <span>{pricingText}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  <p
                    className="text-[14px] text-[#4d5156] leading-[1.58] max-w-[600px]"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    {enableDate && <span className="text-[#70757a]">{publishDate} — </span>}
                    {renderHighlightedText(
                      description || "Meta description will appear here to summarize your page.",
                      searchQuery
                    )}
                  </p>

                  {/* Sitelinks Expanded Grid */}
                  {enableSitelinks && sitelinks.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mt-4 pt-3 border-t border-slate-100">
                      {sitelinks.map((s, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[15px] text-[#1a0dab] hover:underline font-normal leading-tight block"
                          >
                            {s.title}
                          </a>
                          <p className="text-[12px] text-[#4d5156] leading-snug line-clamp-2">{s.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* FAQ Accordions in SERP */}
                  {enableFaq && faqItems.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                      <div className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">People also ask:</div>
                      {faqItems.map((faq, idx) => (
                        <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                          <button
                            type="button"
                            onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                            className="w-full p-2.5 text-left font-medium text-slate-800 flex justify-between items-center hover:bg-slate-50 cursor-pointer"
                          >
                            <span>{faq.question}</span>
                            {openFaqIndex === idx ? (
                              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </button>
                          {openFaqIndex === idx && (
                            <div className="p-2.5 bg-slate-50 text-slate-600 text-[12px] border-t border-slate-200 leading-relaxed">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 2. MOBILE VIEW */}
              {viewMode === "mobile" && (
                <div className="max-w-[390px] mx-auto p-5 bg-white rounded-2xl border-2 border-slate-300 shadow-lg">
                  {/* Mobile Google Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center p-1 border border-slate-200">
                        {favicon ? (
                          <img src={favicon} alt="Favicon" className="w-3.5 h-3.5 rounded-full object-contain" />
                        ) : (
                          <Globe className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </div>
                      <div className="text-[13px] leading-tight">
                        <div className="text-slate-900 font-medium">{brandName || domain}</div>
                        <div className="text-[#4d5156] text-[11px] truncate max-w-[200px]">{canonical}</div>
                      </div>
                    </div>
                    <span className="text-slate-400 text-xs">⋮</span>
                  </div>

                  {/* Title */}
                  <h4
                    className="text-[18px] text-[#1a0dab] hover:underline font-normal cursor-pointer leading-[1.3] line-clamp-2 mb-1.5"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    {renderHighlightedText(title || "Example Web Page Title", searchQuery)}
                  </h4>

                  {/* Star Rating snippet */}
                  {enableRating && (
                    <div className="flex items-center gap-1.5 text-[11px] text-[#70757a] mb-1.5">
                      <span className="text-[#e37400]">★★★★★</span>
                      <span className="font-semibold text-slate-700">{ratingValue}</span>
                      <span>({ratingCount})</span>
                    </div>
                  )}

                  {/* Description */}
                  <p
                    className="text-[13px] text-[#4d5156] leading-[1.4] line-clamp-3"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    {enableDate && <span className="text-[#70757a]">{publishDate} — </span>}
                    {renderHighlightedText(description, searchQuery)}
                  </p>

                  {/* Mobile Sitelinks Horizontal Carousel */}
                  {enableSitelinks && sitelinks.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto mt-3 pt-2.5 border-t border-slate-100 pb-1 scrollbar-none">
                      {sitelinks.map((s, idx) => (
                        <div
                          key={idx}
                          className="px-2.5 py-1.5 bg-slate-100 rounded-lg border border-slate-200 text-xs shrink-0 whitespace-nowrap text-[#1a0dab]"
                        >
                          {s.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 3. AI OVERVIEW / GEMINI SGE VIEW */}
              {viewMode === "ai-overview" && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50/70 via-indigo-50/40 to-blue-50/60 border border-purple-200/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-purple-950 uppercase tracking-wider">
                          Google AI Overview (Gemini)
                        </span>
                        <div className="text-[11px] text-purple-700">Synthesized answer for &quot;{searchQuery}&quot;</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold border border-purple-200">
                      Cited Source
                    </span>
                  </div>

                  {/* AI Generated Text Simulation */}
                  <div className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-white/80 p-4 rounded-xl border border-purple-100/80 space-y-2">
                    <p>
                      When evaluating <strong>{searchQuery}</strong>, platforms like{" "}
                      <strong className="text-purple-900">{brandName}</strong> stand out for developer simplicity and
                      enterprise scale.
                    </p>
                    <p className="text-slate-600 text-xs">
                      {description || "They offer comprehensive payment APIs, built-in fraud detection, and multi-currency payouts."}
                    </p>
                  </div>

                  {/* Cited Card Link Widget */}
                  <div className="text-xs font-semibold text-slate-700">Authoritative Sources Google Relies On:</div>
                  <div className="flex flex-wrap gap-3">
                    <div className="p-3 bg-white rounded-xl border border-purple-200 shadow-2xs hover:shadow-sm transition-all max-w-xs flex items-start gap-2.5">
                      {favicon ? (
                        <img src={favicon} alt="Favicon" className="w-5 h-5 rounded-full mt-0.5 shrink-0" />
                      ) : (
                        <Globe className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <div className="text-xs font-bold text-[#1a0dab] line-clamp-1">{title}</div>
                        <div className="text-[11px] text-slate-500">{domain}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. FULL COMPETITOR SERP LANDSCAPE VIEW */}
              {viewMode === "competitor" && (
                <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-6">
                  {/* Mock Google Search Bar */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-full max-w-xl text-xs text-slate-700">
                    <Search className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-slate-900">{searchQuery}</span>
                  </div>

                  {/* Mock Result 1: Sponsored Ad */}
                  <div className="p-4 rounded-lg bg-slate-50/50 border border-slate-200/60 space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-slate-900">Sponsored</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-600">https://competitor-pay.com/</span>
                    </div>
                    <div className="text-[16px] text-[#1a0dab] hover:underline font-normal cursor-pointer">
                      Alternative Payments &amp; Checkout Solutions for Enterprises
                    </div>
                    <div className="text-xs text-[#4d5156]">
                      Looking for payment APIs? Compare top pricing and features with zero contract minimums.
                    </div>
                  </div>

                  {/* Mock Result 2: YOUR WEBSITE (#1 ORGANIC RANK) */}
                  <div className="p-4 rounded-xl bg-blue-50/40 border-2 border-blue-400/80 shadow-xs space-y-1.5 relative">
                    <span className="absolute -top-2.5 right-4 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-extrabold rounded-full">
                      #1 Organic Result
                    </span>
                    <div className="flex items-center gap-2 text-xs">
                      {favicon ? (
                        <img src={favicon} alt="Favicon" className="w-4 h-4 rounded-full" />
                      ) : (
                        <Globe className="w-4 h-4 text-slate-400" />
                      )}
                      <span className="font-medium text-slate-900">{brandName}</span>
                      <span className="text-slate-400">›</span>
                      <span className="text-slate-500 truncate">{canonical}</span>
                    </div>
                    <div className="text-[18px] text-[#1a0dab] hover:underline font-normal cursor-pointer">
                      {renderHighlightedText(title, searchQuery)}
                    </div>
                    {enableRating && (
                      <div className="text-xs text-[#70757a]">
                        <span className="text-[#e37400]">★★★★★ {ratingValue}</span> · {ratingCount} reviews
                      </div>
                    )}
                    <div className="text-xs text-[#4d5156] leading-relaxed">
                      {renderHighlightedText(description, searchQuery)}
                    </div>
                  </div>

                  {/* Mock Result 3: Secondary Organic */}
                  <div className="p-4 rounded-lg bg-slate-50/30 border border-slate-100 space-y-1 opacity-70">
                    <div className="text-xs text-slate-500">https://developer-community.org/reviews/</div>
                    <div className="text-[16px] text-[#1a0dab]">Top 10 Payment APIs Ranked by Performance (2026)</div>
                    <div className="text-xs text-[#4d5156]">
                      Comprehensive benchmarks across response times, checkout conversion rates, and localized payment coverage.
                    </div>
                  </div>
                </div>
              )}

              {/* Truncation Diagnostics Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-100 text-xs">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  {isTitleOver ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold text-slate-900">
                      Title Pixel Budget: {titlePixelWidth}px / {titleMaxPixels}px
                    </div>
                    <div className="text-slate-500 mt-0.5">
                      {isTitleOver
                        ? "Title is likely truncated with ellipses (...) on search result pages."
                        : "Fits comfortably within Google's pixel envelope without truncating."}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  {isDescOver ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold text-slate-900">
                      Description Budget: {descPixelWidth}px / {descMaxPixels}px
                    </div>
                    <div className="text-slate-500 mt-0.5">
                      {isDescOver
                        ? "Exceeds Google display limit. Characters beyond ~155 will be trimmed."
                        : "Optimal length. Readers can see the entire call-to-action on desktop & mobile."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTR & Optimization Intelligence Cards */}
        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Google SERP Clickability &amp; Best Practices Checklist</h3>
              <p className="text-xs text-slate-500">Evaluated against search engine guidelines and user psychology.</p>
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              {ctrAnalysis.checks.filter((c) => c.passed).length} / {ctrAnalysis.checks.length} Passed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ctrAnalysis.checks.map((check, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-start gap-3"
              >
                {check.passed ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XSquare className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="text-xs font-bold text-slate-900">{check.label}</div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{check.tip}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Callout */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md border border-slate-800">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-extrabold border border-blue-400/30">
                Next Step: Complete Organic Site Audit
              </div>
              <h4 className="text-base font-bold text-white">Audit All Metadata, Core Web Vitals, and Backlinks</h4>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Run a comprehensive 100-point SEO health check on {domain} to uncover indexing blockers, missing headers, broken links, and high-impact keyword opportunities.
              </p>
            </div>
            <Link
              href={`/analyze?url=${encodeURIComponent(canonical)}`}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Run Full Audit on {domain}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
