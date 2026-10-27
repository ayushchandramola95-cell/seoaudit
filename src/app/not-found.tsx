"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Radar,
  Search,
  Link2,
  Home,
  ArrowRight,
  AlertTriangle,
  Compass,
  Sparkles,
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const [quickUrl, setQuickUrl] = useState("");

  function handleQuickAudit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = quickUrl.trim();
    if (!trimmed) {
      router.push("/analyze");
      return;
    }
    router.push(`/analyze?url=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="min-h-[82vh] bg-slate-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-2xl w-full bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-sm text-center space-y-6">
        {/* Animated Radar Badge */}
        <div className="relative mx-auto w-20 h-20 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl border-2 border-blue-400/40 animate-ping opacity-30" />
          <Radar className="w-10 h-10 text-blue-600 animate-spin" style={{ animationDuration: "8s" }} />
          <span className="absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-rose-600 text-white rounded-full border border-white shadow-xs">
            HTTP 404
          </span>
        </div>

        {/* Headline & Clever Copy */}
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Dead Link Detected by SeoSeite Crawler
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            404 — Page Missing or Broken Link
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
            Looks like this URL returned a dead link. Good thing we have a deterministic crawler for that! Run an instant website audit below or jump to our 404 Broken Link scanner.
          </p>
        </div>

        {/* Instant Audit Search Bar */}
        <form
          onSubmit={handleQuickAudit}
          className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 pt-1"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={quickUrl}
              onChange={(e) => setQuickUrl(e.target.value)}
              placeholder="Enter domain to audit (e.g. stripe.com)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:bg-white transition-all"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors cursor-pointer shrink-0"
          >
            <span>Audit URL</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Recovery Links */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-colors"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Run Free Website Audit</span>
          </Link>

          <Link
            href="/tools/broken-links"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs sm:text-sm font-bold transition-colors"
          >
            <Link2 className="w-4 h-4" />
            <span>Scan for 404 Dead Links</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-semibold transition-colors"
          >
            <Home className="w-4 h-4 text-slate-500" />
            <span>Return to Homepage</span>
          </Link>
        </div>

        {/* Helpful Shortcut Pills */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-600 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-slate-400" />
            Popular Destinations:
          </span>
          <Link href="/tools" className="hover:text-blue-600 underline underline-offset-2">
            All 9 SEO Tools
          </Link>
          <span>•</span>
          <Link href="/compare" className="hover:text-blue-600 underline underline-offset-2">
            Competitor Compare
          </Link>
          <span>•</span>
          <Link href="/dashboard" className="hover:text-blue-600 underline underline-offset-2">
            Cloud Dashboard
          </Link>
          <span>•</span>
          <Link href="/api-docs" className="hover:text-blue-600 underline underline-offset-2">
            REST API Docs
          </Link>
        </div>
      </div>
    </div>
  );
}
