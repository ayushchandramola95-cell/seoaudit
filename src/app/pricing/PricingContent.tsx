"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Check, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Layers, 
  BarChart3, 
  Globe, 
  FileText,
  CheckCircle2,
  Users,
  Bot,
  Radar,
  ListChecks,
  GitCompare,
  Terminal,
  Bell,
  Sliders
} from "lucide-react";
import { usePlan } from "@/lib/auth/PlanContext";
import { PlanTier, formatTierName, PLAN_CONFIGS } from "@/lib/auth/tierLimits";

export default function PricingContent() {
  const { tier: activeTier, setTier } = usePlan();
  const [isAnnual, setIsAnnual] = useState(true);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [switchedNotice, setSwitchedNotice] = useState<string | null>(null);

  const handleSwitchTier = (newTier: PlanTier) => {
    setTier(newTier);
    setSwitchedNotice(`Simulated switch to ${formatTierName(newTier)}! Your active limits and feature access have been updated.`);
    setTimeout(() => setSwitchedNotice(null), 4000);
  };

  const handleCheckout = async (planId: string) => {
    if (planId === "free") {
      handleSwitchTier("free");
      return;
    }
    setLoadingTier(planId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          billing: isAnnual ? "annual" : "monthly",
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        handleSwitchTier(planId as PlanTier);
        window.location.href = `/dashboard?upgraded=${planId}`;
      }
    } catch {
      handleSwitchTier(planId as PlanTier);
      window.location.href = `/dashboard?upgraded=${planId}`;
    } finally {
      setLoadingTier(null);
    }
  };

  const tiers: Array<{
    id: PlanTier;
    name: string;
    badge: string;
    description: string;
    monthlyPrice: number;
    annualPrice: number;
    features: string[];
    notIncluded: string[];
    isPopular: boolean;
  }> = [
    {
      id: "free",
      name: "Free Webmaster",
      badge: "Free Forever",
      description: "Essential on-page technical diagnostics, schema validation, and deterministic scoring.",
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        "5 Website Audits per day",
        "Deterministic 0–100 SEO Health Score",
        "Document Architecture & Headings Audit",
        "Basic SERP & Social Preview Simulator",
        "Schema JSON-LD Syntax Validation",
        "HTTP Security Headers & SSL Check",
        "Permanent Report Snapshot Links (/report/[id])",
        "1 Verified Domain with Mode B Telemetry",
        "Sample Competitor Benchmark & Content Gap",
      ],
      notIncluded: [
        "Core Web Vitals & PageSpeed Lab",
        "DomCop Open PageRank & Authority Estimator",
        "Full Competitor Benchmark (/compare)",
        "Semantic Topic & Content Gap Matrix",
        "Deep 404 Broken Link Crawler (50+ links)",
        "AI Diagnostic Code Generation (Gemini)",
        "White-label Client PDF Export",
        "REST API & AI MCP Server Access",
      ],
      isPopular: false,
    },
    {
      id: "starter",
      name: "Starter",
      badge: "Solo Creators",
      description: "Performance metrics, authority estimation, and dead link crawling for niche site owners.",
      monthlyPrice: 19,
      annualPrice: 15,
      features: [
        "50 Website Audits per day",
        "5 Monitored Project Domains in Dashboard",
        "Core Web Vitals Lab (LCP, CLS, INP, FCP, TTFB)",
        "DomCop Open PageRank & Authority Tiering",
        "Complete 50+ Framework & CMS Detector",
        "Broken Link Crawler (up to 50 links per page)",
        "CSV Raw Data Export for Spreadsheets",
        "Historical Scan Timeline in Cloud SQL",
        "Multi-URL Batch Audit (up to 5 URLs)",
      ],
      notIncluded: [
        "Full Competitor Benchmark (/compare)",
        "Semantic Topic & Content Gap Matrix",
        "Deep 404 Crawler (500+ links)",
        "AI Diagnostic Code Generation (Gemini)",
        "White-label Client PDF Export",
        "REST API & AI MCP Server Access",
        "Automated 24/7 Webhook Alerts",
      ],
      isPopular: false,
    },
    {
      id: "pro",
      name: "Pro Analyst",
      badge: "Most Popular",
      description: "Deep competitor benchmarking, topic gap analysis, AI code fixes, and bulk auditing.",
      monthlyPrice: 49,
      annualPrice: 39,
      features: [
        "Unlimited Daily Website Audits",
        "25 Monitored Project Domains with History",
        "Competitive Intelligence Suite (/compare Benchmark)",
        "Semantic Content Gap & Keyword Matrix (/tools/content-gap)",
        "Multi-URL Batch SEO Auditor (up to 15 URLs)",
        "AI Diagnostic Synthesizer & Code Recommendations",
        "GEO AI Search Readiness (GPTBot & ClaudeBot)",
        "Deep 404 Broken Link Crawler (up to 500 links)",
        "Executive PDF Report Export (Clean Printout)",
        "3 Team Member Seats Included ($0 extra fee)",
        "Weekly Automated Monitoring Crawl",
      ],
      notIncluded: [
        "White-label Custom Agency Branding & Logo",
        "24/7 Real-Time Webhook Alerts (Slack/Discord)",
        "Full REST API & AI MCP Server Access",
        "Unlimited Team Seats",
      ],
      isPopular: true,
    },
    {
      id: "enterprise",
      name: "Agency & Enterprise",
      badge: "Unlimited Power",
      description: "White-label client reporting, verified owner telemetry, REST API access, and unlimited team seats.",
      monthlyPrice: 149,
      annualPrice: 119,
      features: [
        "Everything in Pro Analyst",
        "Unlimited Projects & Monitored Domains",
        "Unlimited Team Member Seats (No per-user fees)",
        "White-Label Client PDF Exports (Custom Agency Logo)",
        "Connected Telemetry Suite (Mode B: GSC + GA4 OAuth)",
        "Automated 24/7 SEO Alerts & Webhooks (Slack/Discord)",
        "REST Diagnostic API (/api-docs)",
        "SeoSeite Native SEO MCP Server (/mcp & Claude/Cursor)",
        "Dedicated High-Speed Crawl Queue (<50ms execution)",
        "Priority Engineering SLA & Dedicated Support",
      ],
      notIncluded: [],
      isPopular: false,
    },
  ];

  const comparisonFeatures = [
    {
      category: "Audit & Scraping Capacity",
      items: [
        { name: "Daily URL Audits", free: "5 / day", starter: "50 / day", pro: "Unlimited", enterprise: "Unlimited" },
        { name: "Monitored Domains", free: "1 Project", starter: "5 Projects", pro: "25 Projects", enterprise: "Unlimited" },
        { name: "Crawl Latency", free: "< 100 ms", starter: "< 90 ms", pro: "< 70 ms (Priority)", enterprise: "< 50 ms (Dedicated)" },
        { name: "Included Team Seats", free: "1 User", starter: "1 User", pro: "3 Users ($0 fee)", enterprise: "Unlimited Seats ($0 fee)" },
        { name: "Single-Seat Penalty vs Ahrefs", free: "$0 penalty", starter: "$0 penalty", pro: "Save $120+/mo", enterprise: "Save $500+/mo" },
      ],
    },
    {
      category: "Competitive & Bulk Intelligence",
      items: [
        { name: "Head-to-Head Compare (/compare)", free: "Sample", starter: "—", pro: "Included", enterprise: "Included (Bulk)" },
        { name: "Semantic Content Gap (/tools/content-gap)", free: "Sample pairs", starter: "Basic", pro: "Full Keyword & Heading Gaps", enterprise: "Full + AI Outlines" },
        { name: "Multi-URL Batch Auditor (/tools/batch-audit)", free: "Sample (3 URLs)", starter: "5 URLs", pro: "15 URLs (Bulk Matrix)", enterprise: "Unlimited URLs" },
        { name: "On-Page Broken Links (404)", free: "First 20", starter: "50 Links", pro: "500 Links + Tree", enterprise: "5,000 Links" },
      ],
    },
    {
      category: "AI, MCP & Automation",
      items: [
        { name: "Brand Radar AI (AEO Share of Voice)", free: "Robots Check", starter: "50 checks/mo", pro: "150 checks/mo", enterprise: "500 checks/mo" },
        { name: "AI Developer Code Remediations", free: "—", starter: "—", pro: "Unlimited Generations", enterprise: "Unlimited Generations" },
        { name: "SeoSeite Native SEO MCP Server", free: "—", starter: "—", pro: "—", enterprise: "Claude & Cursor Stdio + HTTP" },
        { name: "24/7 Automated Monitoring & Cron", free: "—", starter: "Weekly (1 Domain)", pro: "Weekly (25 Domains)", enterprise: "Daily (Unlimited)" },
        { name: "Alert Webhooks (Slack, Discord, Email)", free: "—", starter: "—", pro: "—", enterprise: "Real-Time Triggers" },
      ],
    },
    {
      category: "Reporting & Integrations",
      items: [
        { name: "Permanent Snapshot URLs (/report/[id])", free: "Public", starter: "Public", pro: "Public or Unlisted", enterprise: "Private + Branded" },
        { name: "Executive PDF / Print Export", free: "Standard", starter: "Standard", pro: "Executive Clean", enterprise: "White-Label Agency Branding" },
        { name: "Custom Agency Logo & Header", free: "—", starter: "—", pro: "—", enterprise: "Included" },
        { name: "Verified Owner GSC Telemetry (Mode B)", free: "1 Domain", starter: "1 Domain", pro: "5 Domains", enterprise: "Unlimited Domains" },
        { name: "REST API Documentation (/api-docs)", free: "—", starter: "—", pro: "—", enterprise: "Full Access" },
      ],
    },
  ];

  const faqs = [
    {
      q: "How does SeoSeite compare to Ahrefs's pricing?",
      a: "Ahrefs plans cost $129 to $449/month with strict single-user limits (charging an extra $40–$80/mo per extra seat) and credit consumption caps. SeoSeite provides sub-second deterministic audits, 9 modular micro-tools, Content Gap, and Batch Auditing starting at $0 to $49/mo, with 3 team seats included on Pro and zero per-seat fees on Agency.",
    },
    {
      q: "What is the Live Plan Simulator above?",
      a: "The simulator lets you test-drive any tier immediately in your browser without entering a credit card. Switch to Starter, Pro, or Agency to instantly unlock gated tools like Content Gap, Batch Auditor, and White-Label PDF exports.",
    },
    {
      q: "How does the SeoSeite SEO MCP Server work?",
      a: "The Model Context Protocol (MCP) server allows AI tools like Claude Desktop and Cursor IDE to call SeoSeite's deterministic auditing tools natively. Ask Claude 'Audit https://stripe.com' and it automatically queries SeoSeite's engine for verified JSON diagnostic data.",
    },
    {
      q: "Are the SEO scores and traffic numbers accurate?",
      a: "Our 0–100 SEO score is 100% deterministic and rule-based, calculated directly from your page's live HTML, DOM structure, and HTTP security headers. We never fabricate exact visitor counts and transparently indicate heuristic confidence ratings.",
    },
    {
      q: "How does 24/7 automated monitoring work?",
      a: "Our background cron worker crawls your monitored domains weekly. If your SEO score drops by more than 5 points or dead links are detected, an instant notification is dispatched to your registered Slack or Discord webhook.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Top Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Transparent, Predictable Plans
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Invest in Technical Clarity, <br className="hidden sm:inline" />
          Not Expensive Black Boxes.
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6">
          Sub-second crawling, deterministic SEO scores, 9 standalone micro-tools, Content Gap intelligence, and native AI MCP. 
          Start for free, then scale as your agency or platform expands.
        </p>

        {/* Live Plan Simulator Bar */}
        <div className="flat-card p-4 sm:p-5 bg-slate-900 text-white rounded-xl text-left border border-slate-800 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                <Sliders className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Interactive Plan Simulator
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  Active Tier: <span className="text-blue-400 capitalize">{formatTierName(activeTier)}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Live
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(["free", "starter", "pro", "enterprise"] as PlanTier[]).map((t) => (
                <button
                  key={t}
                  onClick={() => handleSwitchTier(t)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeTier === t
                      ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/50"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  }`}
                >
                  {t === "free" && "Free ($0)"}
                  {t === "starter" && "Starter ($19)"}
                  {t === "pro" && "Pro ($49)"}
                  {t === "enterprise" && "Agency ($149)"}
                </button>
              ))}
            </div>
          </div>

          {switchedNotice && (
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2 text-xs text-emerald-400 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{switchedNotice}</span>
            </div>
          )}
        </div>

        {/* Monthly vs Annual Toggle */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <span className={`text-sm font-medium ${!isAnnual ? "text-slate-900 font-bold" : "text-slate-500"}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out bg-slate-900 focus:outline-none"
            role="switch"
            aria-checked={isAnnual}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isAnnual ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-sm font-medium flex items-center gap-1.5 ${isAnnual ? "text-slate-900 font-bold" : "text-slate-500"}`}>
            Annual Billing
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Save 20%
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-16 items-stretch">
        {tiers.map((tierItem) => {
          const price = isAnnual ? tierItem.annualPrice : tierItem.monthlyPrice;
          const isCurrentActive = activeTier === tierItem.id;

          return (
            <div
              key={tierItem.id}
              className={`flat-card p-5 sm:p-6 flex flex-col justify-between relative bg-white ${
                isCurrentActive
                  ? "border-2 border-emerald-600 shadow-md ring-1 ring-emerald-600/30"
                  : tierItem.isPopular
                  ? "border-2 border-blue-600 shadow-md ring-1 ring-blue-600/20"
                  : "border-slate-200"
              }`}
            >
              {isCurrentActive && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm whitespace-nowrap flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Active Plan
                </div>
              )}

              {!isCurrentActive && tierItem.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-slate-900">{tierItem.name}</h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {tierItem.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-5 min-h-[34px] leading-relaxed">{tierItem.description}</p>

                <div className="flex items-baseline gap-1 mb-5 pb-5 border-b border-slate-200">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    ${price}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    / mo {isAnnual && price > 0 && "(annual)"}
                  </span>
                </div>

                <div className="space-y-2.5 mb-6">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Included Capabilities:
                  </div>
                  {tierItem.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}

                  {tierItem.notIncluded.length > 0 && (
                    <div className="pt-2.5 mt-2.5 border-t border-slate-100 space-y-1.5">
                      {tierItem.notIncluded.map((feat, nIdx) => (
                        <div key={nIdx} className="flex items-start gap-2 text-[11px] text-slate-400">
                          <span className="w-3.5 h-3.5 text-slate-300 text-center font-bold">✕</span>
                          <span className="line-through leading-snug">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                {isCurrentActive ? (
                  <button
                    disabled
                    className="w-full inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold py-2.5 px-3 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-300 cursor-default"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Currently Active</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleSwitchTier(tierItem.id)}
                      className={`w-full inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold py-2.5 px-3 rounded-lg transition-colors cursor-pointer ${
                        tierItem.isPopular
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                          : "bg-slate-900 hover:bg-slate-800 text-white"
                      }`}
                    >
                      <span>Simulate {tierItem.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    {tierItem.id !== "free" && (
                      <button
                        onClick={() => handleCheckout(tierItem.id)}
                        disabled={loadingTier !== null}
                        className="w-full text-[11px] font-semibold py-1.5 text-slate-600 hover:text-slate-900 transition-colors block text-center"
                      >
                        {loadingTier === tierItem.id ? "Connecting Stripe..." : "Or Subscribe via Stripe →"}
                      </button>
                    )}
                  </>
                )}
                <p className="text-[10px] text-center text-slate-400">
                  Instant activation • Zero per-user penalties
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Visibility & Custom Prompt Packages (Inspired by Ahrefs Brand Radar) */}
      <div className="flat-card p-6 sm:p-8 mb-20 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white rounded-2xl border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              AEO &amp; Generative Engine Optimization
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-white mb-2">
              Brand Radar AI &amp; Prompt Tracking Studio
            </h3>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Track how often your brand is cited and recommended across ChatGPT, Perplexity, Google Gemini, Claude, and Copilot. While Ahrefs charges <strong>$199/month</strong> for Brand Radar, SeoSeite provides transparent custom prompt checks starting at an accessible rate.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs text-slate-400">Supported AI Engines:</span>
            <div className="flex -space-x-1 text-xs font-bold">
              <span className="px-2 py-1 rounded bg-slate-800 text-blue-400 border border-slate-700">ChatGPT</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-emerald-400 border border-slate-700">Perplexity</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-purple-400 border border-slate-700">Gemini</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-amber-400 border border-slate-700">Claude</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="text-sm font-bold text-white mb-1">Starter AI Checks</div>
              <div className="text-xs text-slate-400 mb-4">50 prompt checks daily across 1 AI engine</div>
              <div className="text-2xl font-extrabold text-white mb-4">$29<span className="text-xs font-normal text-slate-400"> / mo</span></div>
              <ul className="text-xs text-slate-300 space-y-2 mb-6">
                <li>• 1,500 AI checks / month</li>
                <li>• Brand citation detection</li>
                <li>• Competitor share of voice</li>
              </ul>
            </div>
            <Link
              href="/tools/brand-radar"
              className="text-xs font-semibold py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-center transition-colors"
            >
              Open Brand Radar Studio →
            </Link>
          </div>

          <div className="p-5 rounded-xl bg-slate-800/90 border border-blue-500/50 relative flex flex-col justify-between">
            <div className="absolute -top-2.5 right-4 bg-blue-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Popular
            </div>
            <div>
              <div className="text-sm font-bold text-white mb-1">Growth AI Radar</div>
              <div className="text-xs text-slate-400 mb-4">150 prompt checks daily across all 4 AI engines</div>
              <div className="text-2xl font-extrabold text-white mb-4">$69<span className="text-xs font-normal text-slate-400"> / mo</span></div>
              <ul className="text-xs text-slate-300 space-y-2 mb-6">
                <li>• 5,000 AI checks / month</li>
                <li>• Full AEO ranking matrix</li>
                <li>• Automated citation drop alerts</li>
              </ul>
            </div>
            <Link
              href="/tools/brand-radar"
              className="text-xs font-semibold py-2 px-3 rounded-lg bg-white hover:bg-slate-100 text-slate-900 text-center transition-colors"
            >
              Open Brand Radar Studio →
            </Link>
          </div>

          <div className="p-5 rounded-xl bg-slate-800/60 border border-slate-700/80 flex flex-col justify-between">
            <div>
              <div className="text-sm font-bold text-white mb-1">Scale Agency AI</div>
              <div className="text-xs text-slate-400 mb-4">500 prompt checks daily with multi-location testing</div>
              <div className="text-2xl font-extrabold text-white mb-4">$149<span className="text-xs font-normal text-slate-400"> / mo</span></div>
              <ul className="text-xs text-slate-300 space-y-2 mb-6">
                <li>• 20,000 AI checks / month</li>
                <li>• Dedicated AI prompt webhooks</li>
                <li>• Agency white-label PDF integration</li>
              </ul>
            </div>
            <Link
              href="/tools/brand-radar"
              className="text-xs font-semibold py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-center transition-colors"
            >
              Open Brand Radar Studio →
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Comparison Matrix */}
      <div className="flat-card p-6 sm:p-8 mb-20 bg-white">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2 text-center">
          Comprehensive Feature Breakdown
        </h2>
        <p className="text-sm text-slate-600 text-center mb-8 max-w-xl mx-auto">
          Compare plan capabilities side-by-side to choose the right tier for your workflow.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="py-3 px-3 text-slate-900 font-bold w-1/3">Capability</th>
                <th className={`py-3 px-3 text-slate-700 font-bold text-center ${activeTier === "free" ? "bg-emerald-50 text-emerald-800" : ""}`}>
                  Free Webmaster
                </th>
                <th className={`py-3 px-3 text-slate-700 font-bold text-center ${activeTier === "starter" ? "bg-emerald-50 text-emerald-800" : ""}`}>
                  Starter ($15)
                </th>
                <th className={`py-3 px-3 text-blue-600 font-bold text-center ${activeTier === "pro" ? "bg-emerald-50 text-emerald-800" : "bg-blue-50/50"}`}>
                  Pro Analyst ($39)
                </th>
                <th className={`py-3 px-3 text-slate-900 font-bold text-center ${activeTier === "enterprise" ? "bg-emerald-50 text-emerald-800" : ""}`}>
                  Enterprise ($119)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisonFeatures.map((section, sIdx) => (
                <tbody key={`sec-group-${sIdx}`}>
                  <tr key={`sec-${sIdx}`} className="bg-slate-50 font-bold text-slate-800">
                    <td colSpan={5} className="py-2.5 px-4 uppercase text-[11px] tracking-wider text-slate-500">
                      {section.category}
                    </td>
                  </tr>
                  {section.items.map((item, iIdx) => (
                    <tr key={`item-${sIdx}-${iIdx}`} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-medium text-slate-900">{item.name}</td>
                      <td className={`py-3 px-3 text-center text-slate-600 ${activeTier === "free" ? "bg-emerald-50/50 font-semibold" : ""}`}>{item.free}</td>
                      <td className={`py-3 px-3 text-center text-slate-700 ${activeTier === "starter" ? "bg-emerald-50/50 font-semibold" : ""}`}>{item.starter}</td>
                      <td className={`py-3 px-3 text-center font-semibold text-blue-600 ${activeTier === "pro" ? "bg-emerald-50/50 text-emerald-800" : "bg-blue-50/30"}`}>{item.pro}</td>
                      <td className={`py-3 px-3 text-center text-slate-900 font-medium ${activeTier === "enterprise" ? "bg-emerald-50/50 font-semibold" : ""}`}>{item.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2 text-center">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-slate-600 text-center mb-10">
          Everything you need to know about SeoSeite plans, data guarantees, and billing.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="flat-card p-5 sm:p-6 bg-white">
              <h3 className="text-base font-bold text-slate-900 mb-2 flex items-start gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                {faq.q}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed pl-7">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="flat-card p-8 sm:p-10 bg-slate-900 text-white rounded-2xl text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
          Ready to diagnose your website in under 100 milliseconds?
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
          Join thousands of developers, founders, and agencies analyzing website performance with honest, deterministic data.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3.5 rounded-lg text-sm transition-colors"
          >
            Launch Free Website Audit
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-6 py-3.5 rounded-lg text-sm border border-slate-700 transition-colors"
          >
            Explore 9 Standalone Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
