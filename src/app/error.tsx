"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  AlertOctagon,
  RefreshCw,
  Home,
  Activity,
  Terminal,
  ShieldAlert,
} from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[SeoSeite Runtime Boundary Caught Exception]:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] bg-slate-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-xl w-full bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-sm text-center space-y-6">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center">
          <AlertOctagon className="w-8 h-8 text-rose-600" />
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
            <ShieldAlert className="w-3.5 h-3.5" />
            Client Runtime Exception Intercepted
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Something interrupted this view
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Our error boundary caught an unexpected runtime or network error before it could crash your session. Your saved scans and dashboard history remain intact.
          </p>
        </div>

        {/* Diagnostic Error Details Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-1.5 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
              <Terminal className="w-3.5 h-3.5 text-blue-600" />
              Diagnostic Trace
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-200/70 text-slate-700 text-[10px] font-bold">
              {error?.digest ? `Digest: ${error.digest}` : "Code: ERR_CLIENT_BOUNDARY"}
            </span>
          </div>
          <p className="text-rose-700 break-words leading-relaxed">
            {error?.message || "An unexpected client-side exception occurred while rendering this module."}
          </p>
        </div>

        {/* Recovery Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-colors"
          >
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>System & Cloud Status</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-sm font-semibold transition-colors"
          >
            <Home className="w-4 h-4 text-slate-500" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
