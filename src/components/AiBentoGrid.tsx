"use client";

import Link from "next/link";
import { 
  Radar, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Code2, 
  TrendingUp, 
  Cpu, 
  Globe2, 
  Layers, 
  Bot, 
  Search,
  ExternalLink
} from "lucide-react";

export default function AiBentoGrid() {
  return (
    <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>AI Search &amp; Modern Visibility Suite</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Search has evolved into AI. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Your SEO suite should too.
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            From generative search citations to sub-second DOM forensics and 1-click Schema fixes — explore our unified platform built for modern search engines and AI agents.
          </p>
        </div>

        {/* Bento Grid Layout (Modeled on Image 5) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Bento Card 1 (Top Left, 7 Cols): Brand Radar AI Across LLMs */}
          <div className="md:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-blue-500/50 transition-all group overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2 max-w-md">
                Track brand visibility across AI search and custom prompts.
              </h3>
              <Link
                href="/tools/brand-radar"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 group-hover:text-blue-300 transition-colors mb-6"
              >
                <span>Launch Brand Radar AI</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Content Display: LLM Engine Badges + Radar Visualizer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center pt-4">
              {/* LLM Engine Chips */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-slate-400 font-semibold mb-2">
                  Monitored LLM Engines:
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Google AI Overviews
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    ChatGPT Search
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    Perplexity AI
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Google Gemini
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Claude 3.5 Sonnet
                  </div>
                </div>
              </div>

              {/* Radar Circle Scanner Visual (Directly from Image 5) */}
              <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                {/* Outer concentric radar circles */}
                <div className="absolute inset-0 rounded-full border border-slate-800" />
                <div className="absolute inset-4 rounded-full border border-slate-800/80" />
                <div className="absolute inset-8 rounded-full border border-slate-800/50" />

                {/* Rotating Radar Sweep Cone */}
                <div className="absolute inset-0 rounded-full border-r-2 border-amber-500/40 bg-gradient-to-tr from-transparent via-amber-500/10 to-amber-500/30 animate-spin [animation-duration:8s] pointer-events-none" />

                {/* Brand Points On Radar */}
                <div className="absolute top-6 right-8 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                  <span className="text-[10px] font-bold text-emerald-300">Your Brand (84%)</span>
                </div>
                <div className="absolute bottom-10 left-6 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-[9px] text-amber-200 font-medium">Competitor A</span>
                </div>
                <div className="absolute top-16 left-8 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span className="text-[9px] text-rose-200 font-medium">Competitor B</span>
                </div>

                {/* Center Core */}
                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_#3b82f6]" />
              </div>
            </div>
          </div>

          {/* Bento Card 2 (Top Right, 5 Cols): Semantic Content Gap & Keyword Matrix */}
          <div className="md:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-purple-500/50 transition-all group overflow-hidden">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
                Write content that gets seen in search and AI.
              </h3>
              <Link
                href="/tools/content-gap"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 group-hover:text-purple-300 transition-colors mb-6"
              >
                <span>Explore Content Gap Matrix</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Score Dial & TF-IDF snippet (Image 5 top right) */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="space-y-1 text-xs">
                <div className="font-bold text-slate-200">Semantic Coverage Density</div>
                <div className="text-[11px] text-slate-400">TF-IDF Keyword Matrix</div>
                <div className="text-emerald-400 text-[11px] font-bold">+18 Missing Competitor Terms</div>
              </div>

              {/* 95 Score Circle Dial */}
              <div className="relative w-18 h-18 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" stroke="#1e293b" strokeWidth="6" fill="transparent" />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="#10b981"
                    strokeWidth="6"
                    strokeDasharray={2 * Math.PI * 32}
                    strokeDashoffset={2 * Math.PI * 32 * (1 - 0.95)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-base font-black text-white">95</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase">Score</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Card 3 (Bottom Left, 4 Cols): 50+ Tech Stack Profiler */}
          <div className="md:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-indigo-500/50 transition-all group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                50+ Tech Stack Fingerprinting
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Instantly identify frameworks, CDNs, analytics, and infrastructure powering any competitor domain.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Next.js 16</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">React 19</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Tailwind</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Cloudflare</span>
              </div>
              <Link
                href="/tools/tech-detector"
                className="text-xs font-bold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1"
              >
                Launch Tech Profiler →
              </Link>
            </div>
          </div>

          {/* Bento Card 4 (Bottom Middle, 4 Cols): DomCop Open PageRank */}
          <div className="md:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-cyan-500/50 transition-all group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                DomCop Open PageRank Reach
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Verifiable Common Crawl PageRank (0–10 scale) without fabricated domain ratings or vanity metrics.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Open PageRank:</span>
                <span className="text-cyan-400 font-bold">8.4 / 10 • Top 0.01%</span>
              </div>
              <Link
                href="/tools/authority-checker"
                className="text-xs font-bold text-cyan-400 group-hover:text-cyan-300 flex items-center gap-1"
              >
                Check Domain Authority →
              </Link>
            </div>
          </div>

          {/* Bento Card 5 (Bottom Right, 4 Cols): Deploy Technical SEO Fixes (Image 5 bottom right) */}
          <div className="md:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:border-emerald-500/50 transition-all group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Deploy technical SEO fixes — no devs needed.
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Get copy-paste Schema.org JSON-LD structured data and AI-crafted code snippets to fix issues in minutes.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-emerald-400">
                ✓ Validated Schema: Organization, WebSite, FAQPage
              </div>
              <Link
                href="/tools/schema-validator"
                className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1"
              >
                Open Schema Studio →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
