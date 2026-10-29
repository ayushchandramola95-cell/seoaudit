import { Suspense } from "react";
import type { Metadata } from "next";
import GeoReadinessClient from "./GeoReadinessClient";

export const metadata: Metadata = {
  title: "AI Search & GEO Readiness Engine — SeoSeite",
  description:
    "Evaluate how ChatGPT Search, Perplexity AI, Google Gemini, and Claude index your website. Inspect AI bot crawler access, detect /llms.txt, and optimize schema citation density.",
};

export default function GeoReadinessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <GeoReadinessClient />
    </Suspense>
  );
}

