import { Metadata } from "next";
import { Suspense } from "react";
import RobotsSitemapClient from "./RobotsSitemapClient";

export const metadata: Metadata = {
  title: "Robots.txt & XML Sitemap Inspector | SEO Audit Intel",
  description:
    "Audit crawler directives, check AI bot permissions (GPTBot, ClaudeBot, PerplexityBot), validate XML sitemaps, and compute Generative Engine Optimization (GEO) AI readiness score.",
};

export default function RobotsSitemapPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <div className="flex items-center gap-3 text-slate-500 font-medium">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span>Loading Robots & Sitemap Inspector...</span>
          </div>
        </div>
      }
    >
      <RobotsSitemapClient />
    </Suspense>
  );
}
