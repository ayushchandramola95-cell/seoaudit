"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  GitCompare,
  Radar,
  Workflow,
  ArrowRight,
  CheckCircle2,
  Zap,
  TrendingUp,
  Terminal,
  Bell,
  Search,
  Sparkles,
  ChevronRight,
  Gauge,
  Check
} from "lucide-react";

interface Step {
  id: string;
  stepNum: string;
  tabLabel: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  icon: any;
  color: string;
  ctaText: string;
  ctaHref: string;
  highlights: string[];
  metricLabel: string;
  metricValue: string;
  metricSub: string;
  previewCard: {
    title: string;
    items: { label: string; value: string; status: "success" | "warning" | "info" }[];
    footer: string;
  };
}

export default function StrategicWorkflowSection() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps: Step[] = [
    {
      id: "audit",
      stepNum: "01",
      tabLabel: "Audit & Fix Health",
      title: "Audit Technical Health in Sub-Seconds",
      subtitle: "Eliminate indexing blockers before they hurt your rankings",
      description:
        "Unlike legacy crawlers that take minutes to parse headless JavaScript, SeoSeite's Cheerio AST engine inspects your HTML structure, HTTP headers, Core Web Vitals, and 404 dead links in under 100 milliseconds.",
      badge: "Sub-Second Crawls",
      icon: ShieldCheck,
      color: "emerald",
      ctaText: "Start Free Technical Audit",
      ctaHref: "/signup",
      highlights: [
        "100% deterministic 0–100 health scoring with 0 hallucinations",
        "Deep 404 hyperlink discovery across internal & external links",
        "Lab Core Web Vitals (LCP, CLS, INP) with copy-paste remediation",
        "Instant Schema.org JSON-LD syntax & OpenGraph validation",
      ],
      metricLabel: "Average Crawl Latency",
      metricValue: "< 68 ms",
      metricSub: "8x faster than headless crawlers",
      previewCard: {
        title: "Technical Diagnostic Report",
        items: [
          { label: "Deterministic Health", value: "96 / 100 Grade A", status: "success" },
          { label: "Core Web Vitals", value: "LCP 1.1s • CLS 0.01", status: "success" },
          { label: "Hyperlink Crawler", value: "64 Links • 0 Dead 404s", status: "success" },
          { label: "Schema.org Markup", value: "Valid Organization JSON-LD", status: "success" },
        ],
        footer: "21 / 22 automated technical checks passing with zero errors",
      },
    },
    {
      id: "gap",
      stepNum: "02",
      tabLabel: "Competitor & Content Gaps",
      title: "Steal Competitor Keywords & Fill Content Gaps",
      subtitle: "Reverse-engineer what market leaders rank for that you're missing",
      description:
        "Enter any competitor URL alongside your own to generate an instant TF-IDF semantic overlap matrix. Uncover the exact high-intent search queries, heading disparities, and topics your content is lacking.",
      badge: "TF-IDF Matrix",
      icon: GitCompare,
      color: "purple",
      ctaText: "Explore Content Gap Engine",
      ctaHref: "/tools/content-gap",
      highlights: [
        "Cross-domain keyword intersection and unique keyword extraction",
        "H1, H2, H3 semantic topic hierarchy comparison",
        "Content density & reading level benchmarking",
        "Export actionable keyword target lists to CSV in 1 click",
      ],
      metricLabel: "Competitor Keywords",
      metricValue: "+18 Gaps",
      metricSub: "Identified high-intent commercial terms",
      previewCard: {
        title: "Competitive Content Matrix",
        items: [
          { label: "Keyword Overlap", value: "72% Semantic Similarity", status: "info" },
          { label: "Missing High-Value Terms", value: "18 Uncovered Keywords", status: "warning" },
          { label: "Heading Hierarchy", value: "H2 Topic Gaps: 4 Identified", status: "warning" },
          { label: "Crawl Latency Advantage", value: "68ms vs 420ms (You Win)", status: "success" },
        ],
        footer: "Ready to deploy into your content roadmap",
      },
    },
    {
      id: "radar",
      stepNum: "03",
      tabLabel: "AI Search & AEO Visibility",
      title: "Dominate Generative AI Search & LLM Citations",
      subtitle: "Track your brand in ChatGPT, Perplexity, Claude & Google AI Overviews",
      description:
        "Organic search isn't just blue links anymore. SeoSeite's Brand Radar AI monitors how generative AI engines recommend your brand when customers ask buying prompts, measuring your Share of Voice across leading LLMs.",
      badge: "AEO Intelligence",
      icon: Radar,
      color: "blue",
      ctaText: "Launch Brand Radar AI",
      ctaHref: "/tools/brand-radar",
      highlights: [
        "Track brand citations across Google AI Overviews & Gemini",
        "Monitor ChatGPT Search, Claude 3.5 Sonnet, and Perplexity",
        "Analyze competitor brand sentiment and citation share",
        "Actionable recommendations to get cited in generative answers",
      ],
      metricLabel: "AI Share of Voice",
      metricValue: "84% Cited",
      metricSub: "#1 Recommended Brand in Category",
      previewCard: {
        title: "Generative Engine Visibility",
        items: [
          { label: "Google AI Overviews", value: "Cited in 88% of queries", status: "success" },
          { label: "ChatGPT Search", value: "Ranked #1 for buyer prompts", status: "success" },
          { label: "Perplexity AI", value: "Cited with link attribution", status: "success" },
          { label: "Claude 3.5 Sonnet", value: "Recognized as leading provider", status: "success" },
        ],
        footer: "AEO Score: 92/100 • Top 5% in SaaS category",
      },
    },
    {
      id: "autopilot",
      stepNum: "04",
      tabLabel: "24/7 Autopilot & MCP",
      title: "Put Your SEO on 24/7 Autopilot & Native MCP",
      subtitle: "Automate health monitoring and bring SEO directly into Cursor & Claude",
      description:
        "Never get caught off guard by broken redirects or code deploys that degrade your rankings. SeoSeite crawls your domains weekly and sends instant Slack/Discord webhook alerts if health drops. Plus, query audits directly inside Cursor IDE and Claude via native MCP.",
      badge: "Agentic MCP & Alerts",
      icon: Workflow,
      color: "amber",
      ctaText: "Explore MCP & Webhooks",
      ctaHref: "/mcp",
      highlights: [
        "Weekly automated background cron audits with regression alerts",
        "Instant Slack and Discord webhook notifications if score drops >5 pts",
        "Native Model Context Protocol (MCP) for Claude Desktop & Cursor IDE",
        "REST API with deterministic JSON payloads for custom CI/CD pipelines",
      ],
      metricLabel: "Continuous Uptime",
      metricValue: "24/7 Shield",
      metricSub: "Zero regressions slip into production",
      previewCard: {
        title: "Automated Monitoring Status",
        items: [
          { label: "Background Cron", value: "Active • Scheduled Weekly", status: "success" },
          { label: "Slack / Discord Webhooks", value: "Connected • 0 Regressions", status: "success" },
          { label: "Cursor / Claude MCP", value: "Connected via stdio & HTTP", status: "success" },
          { label: "CI/CD Gatekeeper", value: "GitHub Actions Ready", status: "success" },
        ],
        footer: "100% automated protection without manual checking",
      },
    },
  ];

  const current = steps[activeStep];
  const CurrentIcon = current.icon;

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden border-y border-slate-800">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[300px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[300px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>The Complete Growth Operating System</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-white">
            How Modern Teams Use SeoSeite to <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Outrank Competitors &amp; Win Search
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            From technical crawl hygiene to AI Search visibility and agentic developer workflows — here is the 4-step playbook for predictable organic traffic.
          </p>
        </div>

        {/* 4 Interactive Step Pill Selectors */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                  isActive
                    ? "bg-slate-800/90 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500"
                    : "bg-slate-950/60 hover:bg-slate-800/60 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                )}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[11px] font-mono font-extrabold ${isActive ? "text-blue-400" : "text-slate-500"}`}>
                    STEP {s.stepNum}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isActive ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" : "bg-slate-800 text-slate-500"
                  }`}>
                    {s.badge}
                  </span>
                </div>
                <div className={`text-sm font-bold truncate ${isActive ? "text-white" : "text-slate-300"}`}>
                  {s.tabLabel}
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Step Detail Workspace Frame */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            
            {/* Left Column: Narrative, Problem, Highlights & CTA (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <CurrentIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider block">
                    Playbook Step {current.stepNum}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {current.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm font-semibold text-blue-200">
                {current.subtitle}
              </p>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {current.description}
              </p>

              {/* Highlights Checkmarks */}
              <div className="space-y-2.5 pt-2">
                {current.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href={current.ctaHref}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg hover:shadow-blue-500/20 transition-all inline-flex items-center gap-2"
                >
                  <span>{current.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-mono">{current.metricLabel}</div>
                    <div className="font-bold text-emerald-400">{current.metricValue}</div>
                  </div>
                  <span className="text-slate-600">•</span>
                  <div className="text-slate-400 text-[11px]">{current.metricSub}</div>
                </div>
              </div>
            </div>

            {/* Right Column: Live Telemetry Preview Card (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
                {/* Header Strip */}
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-slate-200">
                      {current.previewCard.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                    LIVE
                  </span>
                </div>

                {/* Card Items */}
                <div className="space-y-3">
                  {current.previewCard.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-400 font-medium">{item.label}</span>
                      <span
                        className={`font-mono font-bold ${
                          item.status === "success"
                            ? "text-emerald-400"
                            : item.status === "warning"
                            ? "text-amber-400"
                            : "text-blue-400"
                        }`}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Card Footer */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{current.previewCard.footer}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
