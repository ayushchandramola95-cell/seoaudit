import { Suspense } from "react";
import type { Metadata } from "next";
import SpeedLabClient from "./SpeedLabClient";
import AuthGuard from "@/components/auth/AuthGuard";

export const metadata: Metadata = {
  title: "Core Web Vitals & PageSpeed Lab — SEO Audit Intel",
  description:
    "Test your website speed, Core Web Vitals (LCP, CLS, INP, FCP, TTFB), and performance bottlenecks powered directly by Google PageSpeed Insights.",
};

export default function SpeedLabPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="text-sm font-medium text-slate-500">Loading PageSpeed telemetry engine...</div>
        </div>
      }
    >
      <AuthGuard
        fallbackTitle="Sign In to Access Core Web Vitals Lab"
        fallbackMessage="Inspect sub-second Core Web Vitals, performance Gantt waterfall timelines, and interactive optimization simulations."
      >
        <SpeedLabClient />
      </AuthGuard>
    </Suspense>
  );
}
