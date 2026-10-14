"use client";

import Link from "next/link";
import { 
  Clock, 
  Terminal, 
  Bell, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  Code2, 
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function IntegrationTicker() {
  const pills = [
    { label: "Runs 24/7 Autopilot", icon: Clock, color: "text-amber-500 bg-amber-50 border-amber-200" },
    { label: "Slack Webhook Alerts", icon: Bell, color: "text-purple-600 bg-purple-50 border-purple-200" },
    { label: "Native Claude Desktop MCP", icon: Terminal, color: "text-blue-600 bg-blue-50 border-blue-200" },
    { label: "Cursor IDE Integration", icon: Code2, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    { label: "Discord Notifications", icon: Bell, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
    { label: "Sub-100ms Crawl Latency", icon: Zap, color: "text-amber-600 bg-amber-50 border-amber-200" },
    { label: "Zero-Trust SSRF Defense", icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    { label: "50+ Tech Stack Signatures", icon: Cpu, color: "text-blue-600 bg-blue-50 border-blue-200" },
    { label: "Google Lighthouse Lab", icon: Zap, color: "text-rose-600 bg-rose-50 border-rose-200" },
    { label: "GitHub Actions CI/CD", icon: Terminal, color: "text-slate-800 bg-slate-100 border-slate-300" },
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200 overflow-hidden text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Automated Workflows &amp; Integrations</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Connect SEO Audit into your existing engineering &amp; marketing stack
        </h2>
        <p className="text-sm text-slate-600 mt-2 max-w-2xl mx-auto">
          Whether you trigger audits from GitHub pull requests, receive Slack alerts when SEO regresses, or query diagnostics conversationally inside Cursor IDE.
        </p>
      </div>

      {/* Flowing Marquee Ticker Row 1 */}
      <div className="flex overflow-hidden select-none gap-4 py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex shrink-0 gap-4 animate-marquee items-center">
          {pills.concat(pills).map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-all text-xs font-bold text-slate-700 whitespace-nowrap"
              >
                <Icon className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Banner Callout (Image 2 inspired) */}
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-left">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              Autonomous Monitoring
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Focus on growth. Let SEO Audit monitor your site 24/7.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
              Background cron crawlers check your domains weekly for broken links, performance regressions, and security header changes.
            </p>
          </div>
          <Link
            href="/monitor"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs sm:text-sm text-white shrink-0 inline-flex items-center gap-2 transition-colors shadow-md"
          >
            <span>Set Up 24/7 Monitor</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
