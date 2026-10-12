"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  GitCompare,
  Radar,
  ListChecks,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Globe,
  Terminal,
  Code2,
  TrendingUp,
  Clock,
  Layers,
  Check,
  ExternalLink,
} from "lucide-react";

export default function HomeInteractiveShowcase() {
  const [activeTab, setActiveTab] = useState<"audit" | "compare" | "radar" | "batch" | "mcp">("audit");

  const tabs = [
    { id: "audit", label: "0–100 Technical Health", icon: ShieldCheck, badge: "Deterministic" },
    { id: "compare", label: "Competitor & Content Gap", icon: GitCompare, badge: "TF-IDF Matrix" },
    { id: "radar", label: "Brand Radar AI (AEO)", icon: Radar, badge: "LLM Visibility" },
    { id: "batch", label: "Multi-URL Batch Auditor", icon: ListChecks, badge: "Up to 15 URLs" },
    { id: "mcp", label: "Native SEO MCP Server", icon: Terminal, badge: "Claude & Cursor" },
  ] as const;

  return (
    <div className="w-full">
      {/* Tab Switcher Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/20"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded hidden sm:inline ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div className="flat-card bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl transition-all">
        {/* Tab 1: Technical SEO Health */}
        {activeTab === "audit" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-blue-400">https://linear.app</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    200 OK • Live Crawl
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">Deterministic Site Health Audit</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-3xl font-black text-emerald-400">92<span className="text-sm text-slate-400">/100</span></div>
                  <div className="text-xs text-slate-400 font-semibold">Grade A • Passing 21/22 checks</div>
                </div>
                <Link
                  href="/analyze?url=https://linear.app"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors shrink-0"
                >
                  Inspect Live →
                </Link>
              </div>
            </div>

            {/* 4 Category Score Gauges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400 mb-1">Metadata &amp; Title</div>
                <div className="text-xl font-bold text-emerald-400">25 / 25</div>
                <div className="text-[11px] text-slate-500 mt-1">Title (52 chars), OpenGraph tag set</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400 mb-1">DOM &amp; Hierarchy</div>
                <div className="text-xl font-bold text-emerald-400">24 / 25</div>
                <div className="text-[11px] text-slate-500 mt-1">Single H1, 14 H2s, 0 empty headings</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400 mb-1">Indexability</div>
                <div className="text-xl font-bold text-emerald-400">23 / 25</div>
                <div className="text-[11px] text-slate-500 mt-1">Robots allowed, canonical verified</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400 mb-1">Security Headers</div>
                <div className="text-xl font-bold text-emerald-400">20 / 25</div>
                <div className="text-[11px] text-slate-500 mt-1">HSTS enabled, CSP, SSL Valid</div>
              </div>
            </div>

            {/* Live Findings Sample */}
            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/50 flex items-center justify-between text-emerald-300">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Canonical link strictly matches requested domain without redirect loops
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-400">Passed</span>
              </div>
              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/50 flex items-center justify-between text-emerald-300">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  JSON-LD Structured Data Schema validated (WebApplication, SoftwareApplication)
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-400">Passed</span>
              </div>
              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/50 flex items-center justify-between text-amber-300">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  Add Content-Security-Policy (CSP) header with nonces for strict inline script defense
                </span>
                <span className="text-[10px] uppercase font-bold text-amber-400">Opportunity</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Competitor & Content Gap */}
        {activeTab === "compare" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="text-xs font-mono text-purple-400 mb-1">vercel.com vs netlify.com</div>
                <h3 className="text-xl font-bold text-white">Semantic Topic &amp; Keyword Gap Matrix</h3>
              </div>
              <Link
                href="/tools/content-gap"
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white transition-colors shrink-0"
              >
                Open Content Gap Studio →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-2xl font-bold text-red-400">18 Terms</div>
                <div className="text-xs text-slate-400 mt-1">Missing on Target Page</div>
                <div className="text-[11px] text-slate-500 mt-0.5">High-intent competitor keywords</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-2xl font-bold text-blue-400">34 Terms</div>
                <div className="text-xs text-slate-400 mt-1">Shared Industry Topics</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Edge middleware, Next.js, CI/CD</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-2xl font-bold text-emerald-400">72% Score</div>
                <div className="text-xs text-slate-400 mt-1">Topic Coverage Density</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Semantic relevance index</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
              <div className="text-slate-400 font-bold mb-2">Detected Competitor Heading Gaps (Uncovered H2s):</div>
              <div className="text-slate-300">• &quot;Serverless GPU functions for AI inference&quot;</div>
              <div className="text-slate-300">• &quot;Instant rollback preview deployments with zero downtime&quot;</div>
              <div className="text-slate-300">• &quot;Automatic SSL certificate renewals across wildcards&quot;</div>
            </div>
          </div>
        )}

        {/* Tab 3: Brand Radar AI */}
        {activeTab === "radar" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="text-xs font-mono text-blue-400 mb-1">Target Brand: Stripe (stripe.com)</div>
                <h3 className="text-xl font-bold text-white">Brand Radar AI — Prompt Visibility</h3>
              </div>
              <Link
                href="/tools/brand-radar"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors shrink-0"
              >
                Launch Brand Radar Studio →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-3xl font-black text-blue-400">100%</div>
                <div className="text-xs text-slate-300 font-bold mt-1">AI Share of Voice</div>
                <div className="text-[11px] text-slate-500">Cited in 3/3 target buyer prompts</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-3xl font-black text-purple-400">#1 Top</div>
                <div className="text-xs text-slate-300 font-bold mt-1">Dominant Rank</div>
                <div className="text-[11px] text-slate-500">Leading recommendation in Gemini</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <div className="text-3xl font-black text-emerald-400">4 Engines</div>
                <div className="text-xs text-slate-300 font-bold mt-1">Multi-LLM Tested</div>
                <div className="text-[11px] text-slate-500">ChatGPT, Claude, Gemini, Perplexity</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-2">
              <div className="text-slate-400">Query: &quot;What are the best payment processors for SaaS startups in 2026?&quot;</div>
              <div className="text-emerald-400">
                ✓ Cited in Gemini 2.5 Flash: &quot;Stripe is the industry benchmark for developer-first subscription billing, supporting 135+ currencies...&quot;
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Multi-URL Batch Auditor */}
        {activeTab === "batch" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="text-xs font-mono text-indigo-400 mb-1">Batch Queue • Up to 15 Concurrent Domains</div>
                <h3 className="text-xl font-bold text-white">Multi-URL Batch SEO Auditor</h3>
              </div>
              <Link
                href="/tools/batch-audit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors shrink-0"
              >
                Run Multi-URL Batch →
              </Link>
            </div>

            {/* Mini Table Preview */}
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2 px-3">Domain</th>
                    <th className="py-2 px-3">Score</th>
                    <th className="py-2 px-3">Latency</th>
                    <th className="py-2 px-3">PageRank</th>
                    <th className="py-2 px-3">Stack</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-white">stripe.com</td>
                    <td className="py-2.5 px-3 text-emerald-400">92 (A)</td>
                    <td className="py-2.5 px-3">64 ms</td>
                    <td className="py-2.5 px-3">8.4 / 10</td>
                    <td className="py-2.5 px-3 text-slate-400">React, Next.js</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-white">vercel.com</td>
                    <td className="py-2.5 px-3 text-emerald-400">88 (B)</td>
                    <td className="py-2.5 px-3">82 ms</td>
                    <td className="py-2.5 px-3">7.9 / 10</td>
                    <td className="py-2.5 px-3 text-slate-400">Next.js, Tailwind</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-white">supabase.com</td>
                    <td className="py-2.5 px-3 text-emerald-400">86 (B)</td>
                    <td className="py-2.5 px-3">74 ms</td>
                    <td className="py-2.5 px-3">6.8 / 10</td>
                    <td className="py-2.5 px-3 text-slate-400">Tailwind, React</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span>Concurrent safe scraping with SSRF prevention &amp; timeout safety</span>
              <span className="text-indigo-400 font-semibold">1-Click Master CSV Export</span>
            </div>
          </div>
        )}

        {/* Tab 5: Native MCP Server */}
        {activeTab === "mcp" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <div className="text-xs font-mono text-emerald-400 mb-1">Model Context Protocol (JSON-RPC 2.0)</div>
                <h3 className="text-xl font-bold text-white">Native SeoSeite SEO MCP Server</h3>
              </div>
              <Link
                href="/mcp"
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors shrink-0"
              >
                Open MCP Playground →
              </Link>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Connect SeoSeite directly to <strong>Claude Desktop</strong>, <strong>Cursor IDE</strong>, or your autonomous AI agent workflows. Ask Claude: <code className="bg-slate-800 text-emerald-300 px-1 py-0.5 rounded">&quot;Audit https://stripe.com and find slow Web Vitals&quot;</code> and receive structured, deterministic JSON.
            </p>

            <pre className="p-4 rounded-xl bg-slate-950 text-slate-300 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
{`# 1. Add to Claude Desktop or Cursor IDE (~/.cursor/mcp.json)
{
  "mcpServers": {
    "seoseite": {
      "command": "node",
      "args": ["scripts/seoseite-mcp.mjs"],
      "env": { "SEOSEITE_API_URL": "http://localhost:3000" }
    }
  }
}`}
            </pre>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span className="text-emerald-400 font-bold">Supported MCP Tools:</span>
              <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">seoseite_audit_url</code>
              <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">seoseite_compare_domains</code>
              <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">seoseite_check_broken_links</code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
