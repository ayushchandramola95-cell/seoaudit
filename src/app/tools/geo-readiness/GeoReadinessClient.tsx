"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bot,
  Search,
  Globe,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Download,
  Terminal,
  Cpu,
  RefreshCw,
  ExternalLink,
  Code2,
  Layers,
  FileText,
  Zap,
} from "lucide-react";
import { useProject } from "@/context/ProjectContext";

interface GeoResponse {
  success: boolean;
  domain: string;
  latencyMs: number;
  scores: {
    overall: number;
    aiBotAccess: number;
    llmsTxtCompliance: number;
    structuredEntityClarity: number;
    semanticStructure: number;
  };
  aiBots: Array<{
    botName: string;
    engine: string;
    allowed: boolean;
    directive: string;
    impact: string;
    description: string;
  }>;
  llmsTxt: {
    detected: boolean;
    url: string;
    sizeBytes: number;
    snippet: string | null;
    recommendation: string;
  };
  schemaEntities: {
    detected: boolean;
    types: string[];
    hasOrganization: boolean;
    hasFaq: boolean;
    hasArticle: boolean;
  };
  aiSimulations: Array<{
    engine: string;
    simulatedPrompt: string;
    citationLikelihood: string;
    rationale: string;
  }>;
  fixes: Array<{
    title: string;
    priority: string;
    codeSnippet: string;
  }>;
}

const PRESET_DOMAINS = [
  { domain: "stripe.com", label: "Stripe", tag: "Fintech SaaS" },
  { domain: "linear.app", label: "Linear", tag: "Productivity" },
  { domain: "vercel.com", label: "Vercel", tag: "Cloud Frontend" },
  { domain: "github.com", label: "GitHub", tag: "Dev Platform" },
];

export default function GeoReadinessClient() {
  const { activeDomain } = useProject();
  const [domainInput, setDomainInput] = useState(activeDomain || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeoResponse | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [activeSimTab, setActiveSimTab] = useState(0);

  // Sync when active domain changes in workspace, but DO NOT auto-fetch
  useEffect(() => {
    if (activeDomain && !domainInput) {
      setDomainInput(activeDomain);
    }
  }, [activeDomain, domainInput]);

  const handleSelectPreset = (domain: string) => {
    setDomainInput(domain);
  };

  const handleAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!domainInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tools/geo-readiness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domainInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to audit GEO & AI Search readiness.");
      }

      setResult(data);
    } catch (err: unknown) {
      setError((err as Error)?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const copySnippet = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const copySummary = () => {
    if (!result) return;
    const summary = `AI Search & GEO Readiness Audit for ${result.domain}:
- Overall GEO Score: ${result.scores.overall}/100
- AI Bot Crawl Access: ${result.scores.aiBotAccess}/100
- llms.txt Status: ${result.llmsTxt.detected ? "Active" : "Missing"}
- Entity Clarity: ${result.scores.structuredEntityClarity}/100
- GPTBot Access: ${result.aiBots.find((b) => b.botName === "GPTBot")?.allowed ? "Allowed" : "Blocked"}
- PerplexityBot Access: ${result.aiBots.find((b) => b.botName === "PerplexityBot")?.allowed ? "Allowed" : "Blocked"}
Generated via SeoSeite GEO Intelligence Engine`;
    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28">
      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-indigo-600 transition-colors">Tools</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">AI Search &amp; GEO Readiness</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-slate-950 text-white pt-12 pb-16 relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-radial-gradient from-purple-900/25 via-transparent to-transparent opacity-60 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Bot className="w-3.5 h-3.5 text-purple-400" />
              Generative Engine Optimization (GEO)
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              llms.txt Standard Compliance
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              AI Bot Firewall Verification
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
            AI Search &amp; GEO Readiness Engine
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed mb-8">
            Audit how ChatGPT Search, Perplexity AI, Google Gemini, and Claude index your website. 
            Inspect AI crawler permissions, detect `/llms.txt` discovery manifests, and optimize schema citation density.
          </p>

          {/* Form */}
          <form onSubmit={handleAudit} className="max-w-3xl">
            <div className="bg-slate-900/90 p-2 sm:p-2.5 rounded-2xl border border-slate-800 shadow-2xl flex flex-col sm:flex-row gap-2 backdrop-blur-md">
              <div className="relative flex-1 flex items-center">
                <Globe className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  placeholder="Enter any domain (e.g. stripe.com, linear.app, vercel.com)"
                  className="w-full bg-slate-950/80 text-white placeholder-slate-500 text-sm rounded-xl pl-11 pr-4 py-3 border border-slate-700/80 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 font-mono transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !domainInput.trim()}
                className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-purple-600/30 active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Auditing AI Footprint...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4" />
                    <span>Audit AI &amp; GEO Readiness</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 mt-3.5 text-xs text-slate-400">
              <span className="text-slate-400 font-medium">Quick presets (fills input, click button to audit):</span>
              {PRESET_DOMAINS.map((p) => (
                <button
                  key={p.domain}
                  type="button"
                  onClick={() => handleSelectPreset(p.domain)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                    domainInput === p.domain
                      ? "bg-purple-600/30 text-purple-300 border-purple-500/50 shadow-inner"
                      : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700"
                  }`}
                >
                  <span className="font-semibold">{p.domain}</span>
                  <span className="text-[10px] text-slate-400 px-1 py-0.2 rounded bg-slate-800">
                    {p.tag}
                  </span>
                </button>
              ))}
            </div>
          </form>

          {error && (
            <div className="mt-6 max-w-3xl p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-200">GEO Audit Failed</p>
                <p className="mt-0.5 text-xs text-rose-300/90">{error}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {!result && !loading && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm text-center relative overflow-hidden">
            <div className="max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-100 shadow-sm">
                <Bot className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3">
                Generative Engine Optimization (GEO) &amp; AI Search Diagnostics
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-8">
                As traditional search shifts toward AI conversational engines, website visibility depends on crawler accessibility, clean markdown feeds, and entity clarity. Enter your domain above and click <strong>&quot;Audit AI &amp; GEO Readiness&quot;</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Crawl Access</span>
                  <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    AI Crawler Firewall
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Tests GPTBot, PerplexityBot, ClaudeBot, and Google-Extended permissions.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Knowledge Feed</span>
                  <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-purple-600" />
                    /llms.txt Standard
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Detects structured markdown manifests designed for LLM context windows.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Citation RAG</span>
                  <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Entity Schema
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Evaluates Schema.org JSON-LD nodes for direct brand citation grounding.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {/* Top Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-black">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-slate-900">{result.domain}</h2>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                      GEO Inspected
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Latency: {result.latencyMs}ms • Robots.txt &amp; llms.txt Verified
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={copySummary}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copiedSummary ? "Copied" : "Copy Summary"}</span>
                </button>
              </div>
            </div>

            {/* Scorecard Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Overall GEO Score</div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-black tracking-tight ${
                    result.scores.overall >= 80 ? "text-emerald-600" : result.scores.overall >= 60 ? "text-amber-600" : "text-rose-600"
                  }`}>
                    {result.scores.overall}
                  </span>
                  <span className="text-xs font-bold text-slate-400">/ 100</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Combined AI crawlability and entity density</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">AI Bot Crawl Access</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black tracking-tight text-indigo-600">
                    {result.scores.aiBotAccess}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Open access across ChatGPT, Perplexity &amp; Claude</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">/llms.txt Standard</div>
                <div className="flex items-center gap-2 mt-1">
                  {result.llmsTxt.detected ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Detected ({result.llmsTxt.sizeBytes} B)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Not Found (404)
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2">Markdown manifest for LLM scrapers</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Entity Clarity</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black tracking-tight text-purple-600">
                    {result.scores.structuredEntityClarity}%
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">{result.schemaEntities.types.join(", ") || "No Schema detected"}</p>
              </div>
            </div>

            {/* AI Bot Permissions Matrix */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
              <h3 className="text-base font-black text-slate-900 mb-1">
                AI Crawler Firewall Permissions (Robots.txt)
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Directives governing whether major conversational AI engines are permitted to scrape your pages for live citations.
              </p>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">AI Crawler User-Agent</th>
                      <th className="py-3 px-4">Associated AI Engine</th>
                      <th className="py-3 px-4">Directive Status</th>
                      <th className="py-3 px-4">Citation Impact</th>
                      <th className="py-3 px-4">Engine Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {result.aiBots.map((b, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {b.botName}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-700">
                          {b.engine}
                        </td>
                        <td className="py-3 px-4">
                          {b.allowed ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Allowed (200 OK)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                              <XCircle className="w-3.5 h-3.5" />
                              Blocked (Disallow)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            b.impact === "Optimal"
                              ? "bg-emerald-50 text-emerald-700"
                              : b.impact === "Critical"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-slate-100 text-slate-700"
                          }`}>
                            {b.impact}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-500 max-w-xs leading-relaxed">
                          {b.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Simulated AI Search Citations */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
              <h3 className="text-base font-black text-slate-900 mb-1">
                Simulated AI Conversational Search Scenarios
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Evaluates query citation likelihood when users research your brand via conversational LLMs.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.aiSimulations.map((sim, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-slate-900 text-sm">{sim.engine}</span>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          sim.citationLikelihood.includes("High") ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                        }`}>
                          {sim.citationLikelihood}
                        </span>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200/80 text-xs font-mono text-slate-700 mb-3">
                        &quot;{sim.simulatedPrompt}&quot;
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-200/60 pt-2.5">
                      {sim.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Fixes & Code Generator */}
            {result.fixes.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
                <h3 className="text-base font-black text-slate-900 mb-1">
                  GEO Code Generation &amp; Prioritized Fixes
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Ready-to-deploy snippets to unlock 100% AI search engine visibility.
                </p>

                <div className="space-y-4">
                  {result.fixes.map((fix, idx) => (
                    <div key={idx} className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Code2 className="w-4 h-4 text-purple-400" />
                          <span className="font-bold text-sm">{fix.title}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copySnippet(fix.codeSnippet, `fix-${idx}`)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          {copiedSnippet === `fix-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                          <span>{copiedSnippet === `fix-${idx}` ? "Copied" : "Copy Code"}</span>
                        </button>
                      </div>
                      <pre className="p-3 bg-slate-950 rounded-xl text-xs font-mono text-purple-300 overflow-x-auto custom-scrollbar border border-slate-800/80">
                        {fix.codeSnippet}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
