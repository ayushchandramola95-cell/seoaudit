"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
  tag: string;
}

const FAQS: FaqItem[] = [
  {
    q: "What makes SEO Audit different from Ahrefs or Semrush?",
    a: "Commercial SEO giants cost $129 to $449 every month and heavily penalize teams by charging $40–$80 for every single extra user seat. SEO Audit provides an all-in-one SEO and website intelligence platform with sub-second deterministic audits, 9 specialized growth engines, Content Gap, Brand Radar AI, and native MCP automation at an accessible price ($0 to $49/mo) with zero seat penalties.",
    tag: "Pricing & Value",
  },
  {
    q: "Can I use all 9 standalone SEO engines without creating an account?",
    a: "Yes! All 9 specialized engines (Broken Links, Core Web Vitals, Schema Validator, SERP Preview, Tech Detector, Open PageRank, Brand Radar, Content Gap, and Batch Auditor) can be used immediately without entering a credit card.",
    tag: "Free Access",
  },
  {
    q: "How does the Claude Desktop & Cursor IDE MCP Server work?",
    a: "Our native Model Context Protocol (MCP) server exposes deterministic SEO tools over stdio and HTTP JSON-RPC 2.0. When you ask Claude or Cursor 'Audit https://stripe.com and fix slow Web Vitals', your AI agent invokes our crawl engine in real time and writes remediations grounded in live DOM data.",
    tag: "AI & MCP",
  },
  {
    q: "Are the 0–100 SEO scores and traffic numbers trustworthy?",
    a: "Yes. Every 0–100 SEO health score is 100% deterministic and mathematically derived from live HTML tags, DOM hierarchy, HTTP security headers, and Google Lighthouse telemetry. We never hallucinate metrics and always show explicit confidence tiers.",
    tag: "Methodology",
  },
  {
    q: "How does 24/7 automated monitoring & webhook alerting work?",
    a: "Our background cron worker crawls your monitored watchlist domains on schedule. If your deterministic SEO score drops by more than 5 points or broken 404 links appear, an instant alert payload is sent to your Slack or Discord webhook.",
    tag: "Automation",
  },
];

export default function HomeFaqAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platform Architecture &amp; Billing FAQ</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Everything you need to know about our deterministic scoring, 9 standalone tools, and MCP integration.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all overflow-hidden bg-white ${
                  isOpen ? "border-blue-500 shadow-md" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <HelpCircle
                      className={`w-5 h-5 shrink-0 transition-colors ${
                        isOpen ? "text-blue-600" : "text-slate-400"
                      }`}
                    />
                    <span className="text-sm sm:text-base font-bold text-slate-900">
                      {faq.q}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {faq.tag}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-blue-600" : ""
                      }`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pl-14">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
