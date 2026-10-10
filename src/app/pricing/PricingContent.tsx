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
    if (planId === "starter") {
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
      id: "starter",
      name: "Starter",
      badge: "Free Forever",
      description: "Essential public website intelligence and deterministic SEO scoring for developers & founders.",
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        "15 Website Audits per day",
        "Deterministic 0–100 Technical SEO Health Score",
        "Basic Technology Detection (top 15 frameworks)",
        "Core Web Vitals lab performance metrics",
        "Permanent Shareable Report URLs (/report/[id])",
        "Executive Print & PDF browser export",
        "Sub-100ms high-speed Cheerio crawl engine",
        "Zero-trust SSRF protection",
      ],
      notIncluded: [
        "Parallel Competitor Benchmarking",
        "Google Gemini AI Prioritized Code Fixes",
        "Heuristic Traffic Reach Estimations",
        "First-party GA4 & GSC OAuth Sync",
        "Scheduled Regression Monitoring",
      ],
      ctaText: "Start Free Analysis",
      ctaHref: "/analyze",
      isPopular: false,
    },
    {
      id: "pro",
      name: "Pro Analyst",
      badge: "Most Popular",
      description: "Deep competitor benchmarking, full tech stack detection, and AI developer action items.",
      monthlyPrice: 29,
      annualPrice: 24,
      features: [
        "Unlimited Daily Website Audits",
        "Side-by-Side Parallel Competitor Comparison (/compare)",
        "Complete 50+ Framework & CMS Fingerprint Scanner",
        "Google Gemini AI Diagnostic Summary & Fixes",
        "Copyable code snippets for meta tags, HSTS & schemas",
        "Heuristic Traffic Estimation & Search Channel Models",
        "Lighthouse Lab Opportunities & Savings Estimates",
        "Priority High-Speed Scraping Queue",
        "Permanent Report Archival in Cloud SQL",
      ],
      notIncluded: [
        "First-party GA4 & GSC OAuth Sync",
        "Scheduled Regression Monitoring Cron",
      ],
      ctaText: "Start Pro Trial",
      ctaHref: "/analyze?tier=pro",
      isPopular: true,
    },
    {
      id: "enterprise",
      name: "Agency & Enterprise",
      badge: "Team Power",
      description: "For agencies and digital teams needing automated site monitoring and multi-domain reporting.",
      monthlyPrice: 79,
      annualPrice: 64,
      features: [
        "Everything in Pro Analyst",
        "Multi-Domain Concurrent Scans",
        "First-Party Google Analytics 4 (GA4) & GSC OAuth Integration",
        "Automated 24/7 SEO Regression & Uptime Monitoring",
        "White-label Client PDF Export with Custom Agency Logo",
        "REST API Access with Webhooks for CI/CD Pipelines",
        "Custom Rate Limits & High-Concurrency Node Allocation",
        "Dedicated Engineering Support & SLA",
      ],
      notIncluded: [],
      ctaText: "Upgrade to Enterprise",
      ctaHref: "/analyze?tier=enterprise",
      isPopular: false,
    },
  ];

  const comparisonFeatures = [
    {
      category: "Audit & Scraping Capacity",
      items: [
        { name: "Daily URL Audits", starter: "15 / day", pro: "Unlimited", enterprise: "Unlimited" },
        { name: "Crawl Engine Latency", starter: "< 100 ms", pro: "< 80 ms (Priority)", enterprise: "< 50 ms (Dedicated)" },
        { name: "Parallel Competitor Benchmarks", starter: "Manual", pro: "Included", enterprise: "Included (Bulk)" },
        { name: "SSRF & Subnet Shielding", starter: "Active", pro: "Active", enterprise: "Active + Dedicated IP" },
      ],
    },
    {
      category: "Intelligence & Diagnostics",
      items: [
        { name: "Deterministic 0-100 SEO Score", starter: "Full", pro: "Full", enterprise: "Full + Historic Trends" },
        { name: "Technology Stack Signatures", starter: "15 Basic", pro: "50+ Deep Signatures", enterprise: "50+ Deep Signatures" },
        { name: "Core Web Vitals Telemetry", starter: "Lab Metrics", pro: "Lab + Opportunities", enterprise: "Lab + Opportunities" },
        { name: "Traffic Heuristic Modeling", starter: "—", pro: "Included (with confidence score)", enterprise: "Included + Channel breakdown" },
        { name: "Google Gemini AI Code Fixes", starter: "—", pro: "Unlimited Generations", enterprise: "Unlimited Generations" },
      ],
    },
    {
      category: "Reporting & Sharing",
      items: [
        { name: "Permanent Snapshot URLs", starter: "Public", pro: "Public or Unlisted", enterprise: "Private + Custom Domain" },
        { name: "Executive Print / PDF Export", starter: "Included", pro: "Included", enterprise: "White-Label Agency Branding" },
        { name: "First-Party GA4 / GSC OAuth", starter: "—", pro: "Roadmap Access", enterprise: "Included" },
        { name: "REST API & Webhooks", starter: "—", pro: "—", enterprise: "Full Access" },
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 items-stretch">
        {tiers.map((tier, idx) => {
          const price = isAnnual ? tier.annualPrice : tier.monthlyPrice;
          return (
            <div
              key={idx}
              className={`flat-card p-6 sm:p-8 flex flex-col justify-between relative bg-white ${
                tier.isPopular ? "border-2 border-blue-600 shadow-md ring-1 ring-blue-600/20" : "border-slate-200"
              }`}
            >
              {tier.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  Recommended for Marketers
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {tier.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-6 min-h-[36px]">{tier.description}</p>

                <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-slate-200">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                    ${price}
                  </span>
                  <span className="text-sm font-medium text-slate-500">
                    / month {isAnnual && price > 0 && "(billed annually)"}
                  </span>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Included Features:
                  </div>
                  {tier.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}

                  {tier.notIncluded.length > 0 && (
                    <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
                      {tier.notIncluded.map((feat, nIdx) => (
                        <div key={nIdx} className="flex items-start gap-2.5 text-xs text-slate-400">
                          <span className="w-4 h-4 text-slate-300 text-center font-bold">✕</span>
                          <span className="line-through">{feat}</span>
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
                  className={`w-full inline-flex items-center justify-center gap-2 text-sm font-semibold py-3 px-4 rounded-lg transition-colors cursor-pointer ${
                    tier.isPopular
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  {loadingTier === tier.id ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Connecting...
                    </span>
                  ) : (
                    <>
                      <span>{tier.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-[11px] text-center text-slate-400 mt-2.5">
                  Instant activation • No setup fees
                </p>
              </div>
            </div>
          );
        })}
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
                <th className="py-3 px-4 text-slate-900 font-bold w-2/5">Capability</th>
                <th className="py-3 px-4 text-slate-900 font-bold text-center w-1/5">Starter (Free)</th>
                <th className="py-3 px-4 text-blue-600 font-bold text-center w-1/5">Pro Analyst ($24)</th>
                <th className="py-3 px-4 text-slate-900 font-bold text-center w-1/5">Enterprise ($64)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisonFeatures.map((section, sIdx) => (
                <>
                  <tr key={`sec-${sIdx}`} className="bg-slate-50 font-bold text-slate-800">
                    <td colSpan={4} className="py-2.5 px-4 uppercase text-[11px] tracking-wider text-slate-500">
                      {section.category}
                    </td>
                  </tr>
                  {section.items.map((item, iIdx) => (
                    <tr key={`item-${sIdx}-${iIdx}`} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-medium text-slate-900">{item.name}</td>
                      <td className="py-3 px-4 text-center text-slate-600">{item.starter}</td>
                      <td className="py-3 px-4 text-center font-semibold text-blue-600 bg-blue-50/30">{item.pro}</td>
                      <td className="py-3 px-4 text-center text-slate-900 font-medium">{item.enterprise}</td>
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
