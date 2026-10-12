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
  FileText 
} from "lucide-react";

export default function PricingContent() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleCheckout = async (planId: string) => {
    if (planId === "free") {
      window.location.href = "/analyze";
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
        window.location.href = `/dashboard?upgraded=${planId}`;
      }
    } catch {
      window.location.href = `/dashboard?upgraded=${planId}`;
    } finally {
      setLoadingTier(null);
    }
  };

  const tiers = [
    {
      id: "free",
      name: "Free Webmaster",
      badge: "Free Forever",
      description: "Essential on-page technical diagnostics and deterministic scoring for site owners.",
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
      ],
      notIncluded: [
        "Core Web Vitals & PageSpeed Lab",
        "DomCop Open PageRank & Authority Estimator",
        "Competitor Head-to-Head Comparison (/compare)",
        "Semantic Topic & Content Gap Matrix",
        "Deep 404 Broken Link Crawler & Redirects",
        "AI Diagnostic Code Generation (Gemini)",
        "White-label Client PDF Export",
      ],
      ctaText: "Start Free Audit",
      ctaHref: "/analyze",
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
      ],
      notIncluded: [
        "Competitor Head-to-Head Comparison (/compare)",
        "Semantic Topic & Content Gap Matrix",
        "Deep 404 Crawler (500+ links)",
        "AI Diagnostic Code Generation (Gemini)",
        "White-label Client PDF Export",
        "REST API & AI MCP Server Access",
      ],
      ctaText: "Start Starter Plan",
      ctaHref: "/analyze?tier=starter",
      isPopular: false,
    },
    {
      id: "pro",
      name: "Pro Analyst",
      badge: "Most Popular",
      description: "Deep competitor benchmarking, topic gap analysis, and AI developer fix action items.",
      monthlyPrice: 49,
      annualPrice: 39,
      features: [
        "Unlimited Daily Website Audits",
        "25 Monitored Project Domains with History",
        "Speed & Stack Lab (Lighthouse Core Web Vitals)",
        "DomCop Open PageRank & Global Tier Estimator",
        "Competitive Intelligence Suite (/compare Benchmark)",
        "On-Page Semantic Topic & Content Gap Matrix",
        "AI Diagnostic Synthesizer & Code Recommendations",
        "GEO AI Search Readiness (GPTBot & ClaudeBot)",
        "Deep 404 Broken Link Crawler (up to 500 links)",
        "Executive PDF Report Export (Clean Printout)",
        "3 Team Member Seats Included (0 extra fee)",
      ],
      notIncluded: [
        "Mode B Connected Telemetry (GSC / GA4 OAuth)",
        "White-label Custom Agency Branding & Logo",
        "24/7 Automated SEO Alerts & Webhooks",
        "Full REST API & AI MCP Server Access",
      ],
      ctaText: "Start Pro Trial",
      ctaHref: "/analyze?tier=pro",
      isPopular: true,
    },
    {
      id: "enterprise",
      name: "Agency & Enterprise",
      badge: "Unlimited Power",
      description: "White-label client reporting, verified owner telemetry, API access, and unlimited team seats.",
      monthlyPrice: 149,
      annualPrice: 119,
      features: [
        "Everything in Pro Analyst",
        "Unlimited Projects & Monitored Domains",
        "Unlimited Team Member Seats (No per-user fees)",
        "White-Label Client PDF Exports (Custom Agency Logo)",
        "Connected Telemetry Suite (Mode B: GSC + GA4 OAuth)",
        "Automated 24/7 SEO Alerts & Webhooks (Slack/Discord)",
        "REST Diagnostic API & AI MCP Server Access",
        "Dedicated High-Speed Crawl Queue (<50ms execution)",
        "Priority Engineering SLA & Dedicated Support",
      ],
      notIncluded: [],
      ctaText: "Upgrade to Agency",
      ctaHref: "/analyze?tier=enterprise",
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
        { name: "Included Team Seats", free: "1 User", starter: "1 User", pro: "3 Users Included", enterprise: "Unlimited Seats" },
      ],
    },
    {
      category: "Intelligence & Diagnostics",
      items: [
        { name: "Deterministic 0-100 SEO Score", free: "Included", starter: "Included", pro: "Full + Historic", enterprise: "Full + Historic" },
        { name: "Technology Stack Signatures", free: "15 Basic", starter: "50+ Deep Signatures", pro: "50+ Deep Signatures", enterprise: "50+ Deep Signatures" },
        { name: "Core Web Vitals Telemetry", free: "—", starter: "Lab Metrics", pro: "Lab + Opportunities", enterprise: "Lab + Opportunities" },
        { name: "Authority & Open PageRank", free: "—", starter: "Included", pro: "Included", enterprise: "Included" },
        { name: "Head-to-Head Competitor Compare", free: "—", starter: "—", pro: "Included (/compare)", enterprise: "Included (Bulk)" },
        { name: "Semantic Content & Topic Gap", free: "—", starter: "—", pro: "Included", enterprise: "Included" },
        { name: "AI Developer Code Generation", free: "—", starter: "—", pro: "Unlimited Generations", enterprise: "Unlimited Generations" },
      ],
    },
    {
      category: "Reporting & Integrations",
      items: [
        { name: "Permanent Snapshot URLs", free: "Public", starter: "Public", pro: "Public or Unlisted", enterprise: "Private + Branded" },
        { name: "Executive PDF / Print Export", free: "Basic", starter: "Included", pro: "Included", enterprise: "White-Label Agency Logo" },
        { name: "Verified Owner GSC Telemetry", free: "1 Domain", starter: "1 Domain", pro: "5 Domains", enterprise: "Unlimited Domains" },
        { name: "REST API & AI MCP Server", free: "—", starter: "—", pro: "—", enterprise: "Full Access" },
        { name: "24/7 Automated Webhook Alerts", free: "—", starter: "—", pro: "—", enterprise: "Slack, Discord, Email" },
      ],
    },
  ];

  const faqs = [
    {
      q: "How is SeoSeite different from Ahrefs or Semrush?",
      a: "Commercial suites cost $129 to $499 every month and bundle hundreds of complex features you might never use. SeoSeite focuses on sub-second technical health auditing, instant 50+ technology stack detection, Core Web Vitals, and transparent AI recommendations at a fraction of the cost, with zero fabricated or black-box metrics.",
    },
    {
      q: "Do I need a credit card to use the Starter plan?",
      a: "No! The Starter tier is completely free with no credit card required. You can inspect any public website immediately.",
    },
    {
      q: "Are the SEO health scores and traffic numbers accurate?",
      a: "Our 0–100 SEO score is 100% deterministic and rule-based, calculated directly from your page's live HTML and HTTP security headers. Traffic figures are calculated using empirical search click distribution models, and we always transparently display our confidence rating rather than inventing exact visitor numbers.",
    },
    {
      q: "How does the permanent report snapshot work?",
      a: "When you run an audit, the full diagnostic dataset is saved into our managed Google Cloud SQL PostgreSQL database. You receive a unique shareable URL (/report/[id]) that lets your clients or developers inspect that exact audit state forever without re-crawling.",
    },
    {
      q: "When will paid subscription checkout be enabled?",
      a: "We are currently operating in high-performance open preview with free access to our core toolset. Paid subscriptions (via Stripe) will launch in upcoming releases, and all early adopters will receive grandfathered discounts.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Top Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Transparent, Predictable Plans
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Invest in Technical Clarity, <br className="hidden sm:inline" />
          Not Expensive Black Boxes.
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Sub-second crawling, deterministic SEO scores, 50+ stack detection, and AI code fixes. 
          Start for free, then scale as your agency or platform expands.
        </p>

        {/* Monthly vs Annual Toggle */}
        <div className="flex items-center justify-center gap-3 mt-8">
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
        {tiers.map((tier, idx) => {
          const price = isAnnual ? tier.annualPrice : tier.monthlyPrice;
          return (
            <div
              key={idx}
              className={`flat-card p-5 sm:p-6 flex flex-col justify-between relative bg-white ${
                tier.isPopular ? "border-2 border-blue-600 shadow-md ring-1 ring-blue-600/20" : "border-slate-200"
              }`}
            >
              {tier.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-slate-900">{tier.name}</h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {tier.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-5 min-h-[34px] leading-relaxed">{tier.description}</p>

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
                  {tier.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}

                  {tier.notIncluded.length > 0 && (
                    <div className="pt-2.5 mt-2.5 border-t border-slate-100 space-y-1.5">
                      {tier.notIncluded.map((feat, nIdx) => (
                        <div key={nIdx} className="flex items-start gap-2 text-[11px] text-slate-400">
                          <span className="w-3.5 h-3.5 text-slate-300 text-center font-bold">✕</span>
                          <span className="line-through leading-snug">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <button
                  onClick={() => handleCheckout(tier.id)}
                  disabled={loadingTier !== null}
                  className={`w-full inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold py-2.5 px-3 rounded-lg transition-colors cursor-pointer ${
                    tier.isPopular
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  {loadingTier === tier.id ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Connecting...
                    </span>
                  ) : (
                    <>
                      <span>{tier.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-2">
                  Instant activation • Zero lock-in
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
              href="/analyze?tier=ai-starter"
              className="text-xs font-semibold py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-center transition-colors"
            >
              Add Starter AI Checks
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
              href="/analyze?tier=ai-growth"
              className="text-xs font-semibold py-2 px-3 rounded-lg bg-white hover:bg-slate-100 text-slate-900 text-center transition-colors"
            >
              Add Growth AI Radar
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
              href="/analyze?tier=ai-scale"
              className="text-xs font-semibold py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-center transition-colors"
            >
              Add Scale Agency AI
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
                <th className="py-3 px-3 text-slate-700 font-bold text-center">Free Webmaster</th>
                <th className="py-3 px-3 text-slate-700 font-bold text-center">Starter ($15)</th>
                <th className="py-3 px-3 text-blue-600 font-bold text-center bg-blue-50/50">Pro Analyst ($39)</th>
                <th className="py-3 px-3 text-slate-900 font-bold text-center">Enterprise ($119)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisonFeatures.map((section, sIdx) => (
                <>
                  <tr key={`sec-${sIdx}`} className="bg-slate-50 font-bold text-slate-800">
                    <td colSpan={5} className="py-2.5 px-4 uppercase text-[11px] tracking-wider text-slate-500">
                      {section.category}
                    </td>
                  </tr>
                  {section.items.map((item, iIdx) => (
                    <tr key={`item-${sIdx}-${iIdx}`} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-medium text-slate-900">{item.name}</td>
                      <td className="py-3 px-3 text-center text-slate-600">{item.free}</td>
                      <td className="py-3 px-3 text-center text-slate-700">{item.starter}</td>
                      <td className="py-3 px-3 text-center font-semibold text-blue-600 bg-blue-50/30">{item.pro}</td>
                      <td className="py-3 px-3 text-center text-slate-900 font-medium">{item.enterprise}</td>
                    </tr>
                  ))}
                </>
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
          Join thousands of developers, founders, and marketers analyzing website performance with honest, deterministic data.
        </p>
        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3.5 rounded-lg text-sm transition-colors"
        >
          Launch Free Website Audit
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
