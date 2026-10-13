"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Terminal, 
  Bot, 
  Search, 
  Layers, 
  Zap, 
  ChevronRight,
  Maximize2,
  Minus,
  X,
  Plus
} from "lucide-react";

interface AiPromptExample {
  title: string;
  userPrompt: string;
  steps: string[];
  aiResponse: string;
  actionText: string;
  actionHref: string;
  tag: string;
}

const EXAMPLES: AiPromptExample[] = [
  {
    title: "Competitor Keyword Gap",
    userPrompt: "Where am I losing organic traffic to competitor.com?",
    steps: ["Parsed target domain AST", "Extracted TF-IDF keyword matrices", "Compared 140+ semantic entities"],
    aiResponse: "They outrank you on ~18 high-intent commercial terms, primarily in API documentation and edge middleware topics. Your technical foundation is faster (68ms vs 420ms crawl latency), so closing these content gaps offers immediate upside.",
    actionText: "Opened Content Gap Studio with filters applied",
    actionHref: "/tools/content-gap",
    tag: "Competitive Intel",
  },
  {
    title: "Core Web Vitals Regression",
    userPrompt: "Why did my mobile PageSpeed score drop to 74?",
    steps: ["Queried Google Lighthouse Lab API", "Calculated Largest Contentful Paint (LCP)", "Audited render-blocking assets"],
    aiResponse: "Your LCP degraded to 3.8s due to an unoptimized hero background image (1.4 MB PNG) loaded without priority hints, causing 840ms of main-thread blocking time.",
    actionText: "Opened PageSpeed Lab with remediation snippet",
    actionHref: "/tools/speed-lab",
    tag: "Performance Lab",
  },
  {
    title: "Brand Radar AI Visibility",
    userPrompt: "Is my brand recommended by ChatGPT and Claude for 'best SaaS billing'?",
    steps: ["Dispatched buyer prompts to 4 LLMs", "Analyzed citation frequency in Claude 3.5 & GPT-4o", "Measured AI Share of Voice"],
    aiResponse: "Your brand is cited in 84% of generative search responses. ChatGPT ranks you #1 for enterprise developers, while Perplexity suggests adding more comparison tables to capture comparison intent.",
    actionText: "Viewed Brand Radar AI Share of Voice",
    actionHref: "/tools/brand-radar",
    tag: "AI Search & AEO",
  },
];

export default function AskAiShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeExample = EXAMPLES[activeIdx];

  return (
    <section className="py-20 bg-gradient-to-b from-blue-600 via-blue-700 to-indigo-900 text-white relative overflow-hidden">
      {/* Decorative background glow circles */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & Value Proposition (Image 4 inspired) */}
          <div className="lg:col-span-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Native Agentic SEO Intelligence</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-5">
              Skip the digging. <br />
              <span className="text-amber-300">Just ask.</span>
            </h2>

            <p className="text-blue-100 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
              Ask SeoSeite is our built-in AI assistant powered by Google Gemini and our native Model Context Protocol (MCP). It analyzes your data, runs instant API queries, and diagnoses site health without forcing you to dig through complex reports.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Link
                href="/mcp"
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2"
              >
                <span>Try MCP &amp; AI Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/tools"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all inline-flex items-center gap-2"
              >
                <span>Explore All 9 Tools</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Feature Pills Below (Image 4 bottom row) */}
            <div className="flex flex-wrap gap-2.5 pt-4 border-t border-white/15 text-xs text-blue-100">
              <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Answers in plain English
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Generates actionable code
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Claude &amp; Cursor IDE ready
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                No separate login required
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Chat Console Window (Image 4 inspired) */}
          <div className="lg:col-span-7">
            {/* Prompt Selector Pills */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-xs text-blue-200 font-semibold mr-1">Select Scenario:</span>
              {EXAMPLES.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeIdx === idx
                      ? "bg-amber-400 text-slate-950 shadow-md"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/15"
                  }`}
                >
                  {ex.title}
                </button>
              ))}
            </div>

            {/* Simulated Chat App Container */}
            <div className="bg-white rounded-2xl shadow-2xl text-slate-900 border border-slate-200 overflow-hidden text-left">
              {/* Window Header */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-extrabold text-sm text-slate-900">Ask SeoSeite AI</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700">
                    Gemini 2.5 Flash + MCP
                  </span>
                </div>

                <div className="flex items-center gap-3 text-slate-400 text-xs">
                  <span className="hover:text-slate-600 cursor-pointer hidden sm:inline">+ New chat</span>
                  <span className="hover:text-slate-600 cursor-pointer hidden sm:inline">History</span>
                  <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
                    <Minus className="w-3.5 h-3.5 cursor-pointer hover:text-slate-600" />
                    <Maximize2 className="w-3 h-3 cursor-pointer hover:text-slate-600" />
                    <X className="w-3.5 h-3.5 cursor-pointer hover:text-slate-600" />
                  </div>
                </div>
              </div>

              {/* Chat Message Body */}
              <div className="p-6 space-y-5 text-sm min-h-[300px]">
                {/* User Message Bubble */}
                <div className="flex justify-end">
                  <div className="bg-slate-100 text-slate-800 rounded-2xl rounded-tr-xs px-4 py-2.5 max-w-lg font-medium text-xs sm:text-sm">
                    {activeExample.userPrompt}
                  </div>
                </div>

                {/* AI Assistant Response Box */}
                <div className="space-y-3">
                  {/* Steps Progress Indicator */}
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Searched Engine • Queried MCP API › 3 verified steps</span>
                  </div>

                  {/* Diagnosis Text */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
                    <p>{activeExample.aiResponse}</p>

                    {/* Step details mini pill list */}
                    <div className="pt-2 border-t border-slate-200/60 flex flex-wrap gap-1.5 text-[10px] text-slate-500 font-mono">
                      {activeExample.steps.map((step, sIdx) => (
                        <span key={sIdx} className="px-2 py-0.5 rounded bg-white border border-slate-200">
                          ✓ {step}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 1-Click Action Pill (Image 4 green trigger) */}
                  <Link
                    href={activeExample.actionHref}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold transition-all group"
                  >
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{activeExample.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ml-1" />
                  </Link>
                </div>
              </div>

              {/* Fake Chat Input Bar */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-3">
                <button
                  type="button"
                  className="w-8 h-8 rounded-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <div className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-400">
                  Ask anything about your SEO health, competitor gaps, or tech stack...
                </div>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shrink-0"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
