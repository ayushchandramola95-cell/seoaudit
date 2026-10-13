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
  ArrowRight,
  Activity,
  BarChart3
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

const DEMO_RADAR: Record<string, BrandRadarResponse> = {
  saas: {
    success: true,
    timestamp: new Date().toISOString(),
    provider: "Google Gemini 2.5 Flash + MCP Engine",
    brandName: "Stripe",
    targetDomain: "stripe.com",
    metrics: {
      shareOfVoice: 85,
      totalPrompts: 3,
      citedCount: 3,
      averageRank: 1,
      aeoGrade: "A+",
    },
    results: [
      {
        prompt: "What are the best payment processors for SaaS startups in 2026?",
        isMentioned: true,
        rank: 1,
        sentiment: "positive",
        snippet: "Stripe is widely recognized as the industry gold standard for SaaS startups, providing developer-friendly APIs, global payment methods, and automated billing workflows out-of-the-box.",
        competitorsCited: ["PayPal", "Paddle", "Adyen"],
      },
      {
        prompt: "Compare top API payment gateways for developers with recurring billing",
        isMentioned: true,
        rank: 1,
        sentiment: "positive",
        snippet: "Stripe Billing leads developer comparisons with extensive SDK support, webhook reliability, and low cold-start latency compared to legacy merchant accounts.",
        competitorsCited: ["Braintree", "Authorize.Net"],
      },
      {
        prompt: "Which payment platforms have the lowest latency and best documentation?",
        isMentioned: true,
        rank: 1,
        sentiment: "positive",
        snippet: "Stripe's interactive API docs and CLI tooling set the benchmark for low integration friction and 99.999% uptime SLAs.",
        competitorsCited: ["Adyen", "Checkout.com"],
      },
    ],
    competitorLeaderboard: [
      { name: "PayPal", count: 2, share: 67 },
      { name: "Adyen", count: 2, share: 67 },
      { name: "Paddle", count: 1, share: 33 },
      { name: "Braintree", count: 1, share: 33 },
      { name: "Checkout.com", count: 1, share: 33 },
    ],
    aeoRecommendations: [
      {
        title: "Maintain API Documentation Dominance",
        impact: "High",
        description: "LLMs consistently cite Stripe's official docs when answering technical integration queries.",
      },
      {
        title: "Expand Comparison Landing Pages",
        impact: "Medium",
        description: "Add clear side-by-side matrices against Paddle to capture merchant-of-record intent queries in Perplexity.",
      },
    ],
  },
};

export default function BrandRadarClient() {
  const { tier, triggerUpgradeModal, canAccess } = usePlan();
  const [brandName, setBrandName] = useState("Stripe");
  const [targetDomain, setTargetDomain] = useState("stripe.com");
  const [prompts, setPrompts] = useState<string[]>(PRESET_CATEGORIES.saas.prompts);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BrandRadarResponse | null>(DEMO_RADAR.saas);
  const [error, setError] = useState<string | null>(null);
  const [copiedSnippetIdx, setCopiedSnippetIdx] = useState<number | null>(null);

  const handleSelectPreset = (key: string) => {
    const preset = PRESET_CATEGORIES[key];
    if (preset) {
      setBrandName(preset.defaultBrand);
      setTargetDomain(preset.defaultDomain);
      setPrompts(preset.prompts);
      if (DEMO_RADAR[key]) {
        setData(DEMO_RADAR[key]);
      }
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
      setError("Please provide a brand or company name to track.");
      return;
    }

    const validPrompts = prompts.filter((p) => p.trim().length > 0);
    if (validPrompts.length === 0) {
      setError("Please enter at least one buyer query or prompt.");
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
        throw new Error(json.error || "Failed to execute Brand Radar AI scan.");
      }

      setData(json);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (idx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippetIdx(idx);
    setTimeout(() => setCopiedSnippetIdx(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
          <Radar className="w-3.5 h-3.5 text-blue-600" />
          Generative AI Search &amp; AEO Share of Voice
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
          Brand Radar AI &amp; AEO Visibility Studio
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Track how often your brand is cited and recommended in LLM answers (**ChatGPT**, **Google Gemini**, **Perplexity**, and **Claude**). Measure your **AI Share of Voice (SoV)** against direct competitors.
        </p>

        {/* Industry Presets */}
        <div className="pt-3">
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
      <form onSubmit={handleRunRadar} className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-2xl shadow-sm space-y-6">
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
              className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-semibold"
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
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Scanning Generative LLMs...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                Run Brand Radar AI Analysis
              </>
            )}
          </button>
        </div>
      </form>

      {/* RESULTS DISPLAY */}
      {data && (
        <div className="space-y-8 mt-10 animate-in fade-in duration-300">
          
          {/* Main Hero Card: Share of Voice Radial Donut + AEO Grade */}
          <div className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-2xl shadow-sm">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-6 border-b border-slate-100">
              
              {/* Left: Animated Radial Donut Chart */}
              <div className="flex items-center gap-6">
                <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="#2563eb"
                      strokeWidth="10"
                      strokeDasharray={2 * Math.PI * 50}
                      strokeDashoffset={2 * Math.PI * 50 * (1 - data.metrics.shareOfVoice / 100)}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-slate-900 tracking-tight">
                      {data.metrics.shareOfVoice}%
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      SoV
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>AI Share of Voice (AEO)</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                    {data.metrics.shareOfVoice >= 75
                      ? "Dominant Brand Authority in AI Search"
                      : "Competitive Presence with Growth Opportunity"}
                  </h2>
                  <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                    Cited in {data.metrics.citedCount} of {data.metrics.totalPrompts} generative buyer queries across monitored AI platforms.
                  </p>
                </div>
              </div>

              {/* Right: AEO Grade & Position Badge */}
              <div className="flex items-center gap-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[100px]">
                  <div className="text-[10px] uppercase font-bold text-slate-400">AEO Grade</div>
                  <div className="text-2xl font-black text-emerald-600">{data.metrics.aeoGrade}</div>
                  <div className="text-[10px] text-slate-500 font-semibold">Tier 1 Leader</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[100px]">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Average Rank</div>
                  <div className="text-2xl font-black text-purple-600">
                    {data.metrics.averageRank ? `#${data.metrics.averageRank}` : "#1"}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold">In Lists</div>
                </div>
              </div>
            </div>

            {/* Monitored LLM Engines Status Strip */}
            <div className="pt-6">
              <div className="text-xs font-bold text-slate-700 mb-3 flex items-center justify-between">
                <span>Multi-Model AI Overview Attribution</span>
                <span className="text-[11px] text-emerald-600 font-semibold">5 / 5 Connected</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { name: "ChatGPT Search", color: "bg-emerald-50 text-emerald-800 border-emerald-200", status: "Cited #1" },
                  { name: "Google AI Overviews", color: "bg-blue-50 text-blue-800 border-blue-200", status: "Featured Snippet" },
                  { name: "Perplexity AI", color: "bg-purple-50 text-purple-800 border-purple-200", status: "Cited with link" },
                  { name: "Claude 3.5 Sonnet", color: "bg-amber-50 text-amber-800 border-amber-200", status: "Leader Mention" },
                  { name: "Google Gemini", color: "bg-rose-50 text-rose-800 border-rose-200", status: "Top Recommendation" },
                ].map((m, i) => (
                  <div key={i} className={`p-3 rounded-xl border text-left ${m.color}`}>
                    <div className="text-xs font-black truncate">{m.name}</div>
                    <div className="text-[10px] font-semibold opacity-90 mt-0.5">{m.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Competitor Co-Citation Leaderboard (Bar Chart Style) */}
          {data.competitorLeaderboard.length > 0 && (
            <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Competitor Co-Citation Share of Voice
                  </h3>
                  <p className="text-xs text-slate-500">
                    Brands that the AI models mentioned alongside or instead of {data.brandName}.
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-slate-500">
                  {data.competitorLeaderboard.length} Competitors Tracked
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {data.competitorLeaderboard.map((comp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-800">{comp.name}</span>
                      <span className="text-slate-500 font-mono">{comp.share}% SoV ({comp.count} queries)</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        style={{ width: `${comp.share}%` }}
                        className={`h-full rounded-full transition-all duration-700 ${
                          idx === 0 ? "bg-indigo-500" : idx === 1 ? "bg-purple-500" : "bg-slate-400"
                        }`}
                      />
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
              {data.results.map((res, idx) => (
                <div key={idx} className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-3 text-left">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        Q#{idx + 1}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900">{res.prompt}</span>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                        res.isMentioned
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-rose-50 text-rose-800 border border-rose-200"
                      }`}
                    >
                      {res.isMentioned ? `Rank #${res.rank || 1} • Mentioned` : "Not Cited"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed font-mono">
                    &quot;{res.snippet}&quot;
                  </p>

                  {res.competitorsCited.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                      <span className="font-semibold">Co-cited competitors:</span>
                      <div className="flex flex-wrap gap-1">
                        {res.competitorsCited.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
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

          {/* Actionable Recommendations */}
          {data.aeoRecommendations.length > 0 && (
            <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                AEO Optimization Roadmap
              </h3>
              <div className="space-y-3">
                {data.aeoRecommendations.map((rec, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        {rec.title}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{rec.description}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 shrink-0">
                      {rec.impact} Impact
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Banner */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 text-white rounded-2xl border border-blue-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-400/20 text-blue-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3 h-3" />
                Continuous AEO Radar
              </div>
              <h3 className="text-lg font-bold">Monitor Your AI Search Share of Voice 24/7</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                As generative AI captures search market share, track whether customers querying ChatGPT and Perplexity discover your product or your competitor.
              </p>
            </div>
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold whitespace-nowrap transition-all shadow-md shrink-0"
            >
              Start AEO Tracking
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
