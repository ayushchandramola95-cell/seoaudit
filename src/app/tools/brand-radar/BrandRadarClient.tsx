"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Radar,
  ArrowLeft,
  Sparkles,
  Bot,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Play,
  RefreshCw,
  Plus,
  Trash2,
  TrendingUp,
  Share2,
  Download,
  Copy,
  Check,
  Globe,
  Award,
  Layers,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Flame,
} from "lucide-react";
import { usePlan } from "@/lib/auth/PlanContext";
import { formatTierName } from "@/lib/auth/tierLimits";

interface PromptResult {
  prompt: string;
  isMentioned: boolean;
  rank: number | null;
  sentiment: "positive" | "neutral" | "not-mentioned";
  snippet: string;
  competitorsCited: string[];
}

interface BrandRadarResponse {
  success: boolean;
  timestamp: string;
  provider: string;
  brandName: string;
  targetDomain: string;
  metrics: {
    shareOfVoice: number;
    totalPrompts: number;
    citedCount: number;
    averageRank: number | null;
    aeoGrade: string;
  };
  results: PromptResult[];
  competitorLeaderboard: Array<{ name: string; count: number; share: number }>;
  aeoRecommendations: Array<{ title: string; impact: string; description: string }>;
}

const PRESET_CATEGORIES: Record<string, { label: string; defaultBrand: string; defaultDomain: string; prompts: string[] }> = {
  saas: {
    label: "Developer & SaaS Tools",
    defaultBrand: "Stripe",
    defaultDomain: "stripe.com",
    prompts: [
      "What are the best payment processors for SaaS startups in 2026?",
      "Compare top API payment gateways for developers with recurring billing",
      "Which payment platforms have the lowest latency and best documentation?",
    ],
  },
  seo: {
    label: "SEO & Growth Platforms",
    defaultBrand: "SeoSeite",
    defaultDomain: "seoseite.com",
    prompts: [
      "What are the best free alternatives to Ahrefs for technical SEO audits?",
      "Which SEO platforms provide native Model Context Protocol (MCP) integrations?",
      "Top tools for analyzing Core Web Vitals and Schema JSON-LD markup",
    ],
  },
  ecommerce: {
    label: "E-Commerce & Storefronts",
    defaultBrand: "Shopify",
    defaultDomain: "shopify.com",
    prompts: [
      "What are the top e-commerce platforms for high-volume stores in 2026?",
      "Best platform to build a headless online storefront with global inventory",
      "Which shopping cart platforms have the highest conversion rate out-of-the-box?",
    ],
  },
  hosting: {
    label: "Cloud & Frontend Hosting",
    defaultBrand: "Vercel",
    defaultDomain: "vercel.com",
    prompts: [
      "What is the best hosting platform for Next.js applications?",
      "Compare top serverless edge hosting providers for React websites",
      "Which cloud platform offers the fastest cold start times for edge functions?",
    ],
  },
};

export default function BrandRadarClient() {
  const { tier, triggerUpgradeModal, canAccess } = usePlan();
  const [brandName, setBrandName] = useState("Stripe");
  const [targetDomain, setTargetDomain] = useState("stripe.com");
  const [prompts, setPrompts] = useState<string[]>(PRESET_CATEGORIES.saas.prompts);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BrandRadarResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedSnippetIdx, setCopiedSnippetIdx] = useState<number | null>(null);

  const handleSelectPreset = (key: string) => {
    const preset = PRESET_CATEGORIES[key];
    if (preset) {
      setBrandName(preset.defaultBrand);
      setTargetDomain(preset.defaultDomain);
      setPrompts(preset.prompts);
    }
  };

  const handleAddPrompt = () => {
    if (prompts.length >= 2 && tier === "free") {
      triggerUpgradeModal({
        requiredTier: "pro",
        featureTitle: "Multi-Prompt AEO Brand Radar",
        description:
          "Free tier includes 2 test prompts. Upgrade to Pro Analyst to evaluate 5+ concurrent buyer intent queries across ChatGPT, Claude, and Gemini.",
      });
      return;
    }

    if (prompts.length < 5) {
      setPrompts([...prompts, ""]);
    }
  };

  const handleRemovePrompt = (idx: number) => {
    if (prompts.length <= 1) return;
    setPrompts(prompts.filter((_, i) => i !== idx));
  };

  const handlePromptChange = (idx: number, val: string) => {
    const updated = [...prompts];
    updated[idx] = val;
    setPrompts(updated);
  };

  const handleRunRadar = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!brandName.trim()) {
      setError("Please specify a Brand Name.");
      return;
    }

    const validPrompts = prompts.filter((p) => p.trim().length > 0);
    if (validPrompts.length === 0) {
      setError("Please include at least one buyer intent prompt.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/brand-radar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: brandName.trim(),
          targetDomain: targetDomain.trim(),
          prompts: validPrompts,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to execute Brand Radar scan.");
      }

      setData(json);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopySnippet = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippetIdx(idx);
    setTimeout(() => setCopiedSnippetIdx(null), 2000);
  };

  return (
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
                  featureTitle: "Unlimited Brand Radar Scans",
                  description:
                    "Monitor ongoing AI brand citations, schedule weekly AEO alerts, and crawl up to 25 buyer queries.",
                })
              }
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[11px] font-bold shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3 h-3" /> Upgrade
            </button>
          )}
        </div>
      </div>

      {/* Hero Header */}
      <div className="flat-card p-6 sm:p-8 bg-white border-blue-200 text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-xs">
          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Ahrefs Brand Radar Alternative</span>
          <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-bold">
            AEO Studio
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Brand Radar AI &amp; AEO Visibility Studio
        </h1>

        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Track how often your brand is cited and recommended in LLM answers (**ChatGPT**, **Google Gemini**, **Perplexity**, and **Claude**). Measure your **AI Share of Voice (SoV)** against direct competitors.
        </p>

        {/* Industry Presets */}
        <div className="pt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Load Quick Industry Presets:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {Object.entries(PRESET_CATEGORIES).map(([key, item]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectPreset(key)}
                className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleRunRadar} className="flat-card p-6 sm:p-8 bg-white border-slate-200 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>Brand / Product Name</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Stripe, Vercel, Supabase"
              required
              className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span>Official Website Domain</span>
              <span className="text-[11px] text-slate-400 font-normal">Optional</span>
            </label>
            <input
              type="text"
              value={targetDomain}
              onChange={(e) => setTargetDomain(e.target.value)}
              placeholder="e.g. stripe.com"
              className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-mono"
            />
          </div>
        </div>

        {/* Buyer Intent Prompts List */}
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-bold text-slate-900 block">
                Buyer Intent Test Queries ({prompts.length}/5)
              </label>
              <p className="text-[11px] text-slate-500">
                Questions potential customers ask AI models when researching software in your category.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddPrompt}
              disabled={prompts.length >= 5}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Question
            </button>
          </div>

          <div className="space-y-2.5">
            {prompts.map((p, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-6 text-center text-xs font-bold text-slate-400 font-mono shrink-0">
                  #{idx + 1}
                </span>
                <input
                  type="text"
                  value={p}
                  onChange={(e) => handlePromptChange(idx, e.target.value)}
                  placeholder="e.g. What are the best alternatives to [Competitor]?"
                  className="flex-1 px-3.5 py-2 text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePrompt(idx)}
                  disabled={prompts.length <= 1}
                  className="p-2 text-slate-400 hover:text-rose-600 disabled:opacity-30 transition-colors cursor-pointer"
                  title="Remove query"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
            <XCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Querying LLM Answer Engines...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                Scan Brand Radar Citations
              </>
            )}
          </button>
        </div>
      </form>

      {/* RESULTS DISPLAY */}
      {data && (
        <div className="space-y-8 animate-in fade-in-50 duration-200">
          {/* Executive Metrics Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flat-card p-5 bg-white border-blue-200 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                AI Share of Voice (SoV)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-blue-600 font-mono">
                  {data.metrics.shareOfVoice}%
                </span>
                <span className="text-xs font-bold text-slate-500">
                  ({data.metrics.citedCount}/{data.metrics.totalPrompts} queries)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${data.metrics.shareOfVoice}%` }}
                />
              </div>
            </div>

            <div className="flat-card p-5 bg-white border-slate-200 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                AEO Grade
              </span>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-3xl font-black font-mono ${
                    data.metrics.aeoGrade.startsWith("A")
                      ? "text-emerald-600"
                      : data.metrics.aeoGrade === "B"
                      ? "text-blue-600"
                      : "text-amber-600"
                  }`}
                >
                  {data.metrics.aeoGrade}
                </span>
                <span className="text-xs font-semibold text-slate-500">Visibility Rating</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                {data.metrics.shareOfVoice >= 60
                  ? "Dominant recommendation across search queries."
                  : "Moderate visibility with room for competitive growth."}
              </p>
            </div>

            <div className="flat-card p-5 bg-white border-slate-200 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Average Rank Position
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-purple-600 font-mono">
                  {data.metrics.averageRank ? `#${data.metrics.averageRank}` : "N/A"}
                </span>
                <span className="text-xs font-semibold text-slate-500">When Cited</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Calculated from order of citation in model answer lists.
              </p>
            </div>

            <div className="flat-card p-5 bg-white border-slate-200 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Active Provider
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <Bot className="w-5 h-5 text-indigo-600 shrink-0" />
                <span className="text-xs font-bold text-slate-900 truncate">
                  {data.provider.split(" (")[0]}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Evaluated at {new Date(data.timestamp).toLocaleTimeString()}.
              </p>
            </div>
          </div>

          {/* Competitor Leaderboard */}
          {data.competitorLeaderboard.length > 0 && (
            <div className="flat-card p-6 bg-white border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Competitor Co-Citations in Same Responses
                  </h3>
                  <p className="text-xs text-slate-500">
                    Brands that the AI models mentioned alongside or instead of {data.brandName}.
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-slate-500">
                  {data.competitorLeaderboard.length} Competitors Detected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.competitorLeaderboard.map((comp, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between"
                  >
                    <span className="text-xs font-bold text-slate-800">{comp.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 font-mono">
                        {comp.count} queries
                      </span>
                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                        {comp.share}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Query-by-Query Citations */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Query-by-Query Citation Breakdown
            </h3>

            <div className="space-y-3">
              {data.results.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-xl border bg-white transition-all shadow-xs ${
                    item.isMentioned ? "border-emerald-200" : "border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          Query #{idx + 1}
                        </span>
                        {item.isMentioned ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Cited {item.rank ? `Position #${item.rank}` : "in Answer"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            <XCircle className="w-3 h-3 text-slate-400" />
                            Not Mentioned
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">
                        &ldquo;{item.prompt}&rdquo;
                      </h4>
                    </div>

                    <button
                      onClick={() => handleCopySnippet(item.snippet, idx)}
                      className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-900 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                    >
                      {copiedSnippetIdx === idx ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400" />
                      )}
                      {copiedSnippetIdx === idx ? "Copied" : "Copy Excerpt"}
                    </button>
                  </div>

                  {/* Model Excerpt */}
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-sans">
                    <p className="whitespace-pre-wrap">{item.snippet}</p>
                  </div>

                  {/* Competitor tags in this prompt */}
                  {item.competitorsCited.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-400 font-medium">Other brands cited:</span>
                      <div className="flex flex-wrap gap-1">
                        {item.competitorsCited.map((c, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Strategic AEO Action Plan */}
          <div className="flat-card p-6 sm:p-8 bg-slate-900 text-white rounded-2xl space-y-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                Answer Engine Optimization (AEO)
              </span>
              <h3 className="text-lg font-bold mt-1">
                Strategic Checklist: How to Increase LLM Citations
              </h3>
              <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
                Modern LLMs pull real-time ground truth from high-authority indexes, structured data graphs, and comparison matrices. Follow these steps to improve your brand&apos;s inclusion rate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.aeoRecommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-100">{rec.title}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        rec.impact === "Critical"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : rec.impact === "High"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {rec.impact} Impact
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {rec.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
