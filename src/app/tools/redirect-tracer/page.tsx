import { Metadata } from "next";
import { Suspense } from "react";
import RedirectTracerClient from "./RedirectTracerClient";

export const metadata: Metadata = {
  title: "HTTP Redirect & Status Code Chain Tracer | SEO Audit Intel",
  description:
    "Trace 301, 302, 307, and 308 redirect chains, inspect hop latencies, detect redirect loops, and prevent SSL downgrade vulnerabilities.",
};

export default function RedirectTracerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <div className="flex items-center gap-3 text-slate-500 font-medium">
            <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
            <span>Loading Redirect Chain Tracer...</span>
          </div>
        </div>
      }
    >
      <RedirectTracerClient />
    </Suspense>
  );
}
