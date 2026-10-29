import { Metadata } from "next";
import { Suspense } from "react";
import KeywordResearchClient from "./KeywordResearchClient";

export const metadata: Metadata = {
  title: "Keyword Density & Frequency Matrix Explorer | SEO Audit Intel",
  description:
    "Extract 1-word, 2-word, and 3-word n-gram keywords, compute TF-IDF semantic density, verify heading presence (Title, H1), and optimize on-page content relevance.",
};

export default function KeywordResearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <div className="flex items-center gap-3 text-slate-500 font-medium">
            <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <span>Loading Keyword Density Explorer...</span>
          </div>
        </div>
      }
    >
      <KeywordResearchClient />
    </Suspense>
  );
}

