import { Metadata } from "next";
import { Suspense } from "react";
import DocumentArchitectureClient from "./DocumentArchitectureClient";

export const metadata: Metadata = {
  title: "Document Architecture & DOM Heading Ladder | SEO Audit Intel",
  description:
    "Audit H1–H6 heading hierarchies, detect skipped heading tags, inspect DOM depth distribution, and export clean Markdown document outlines.",
};

export default function DocumentArchitecturePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <div className="flex items-center gap-3 text-slate-500 font-medium">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span>Loading Document Architecture Studio...</span>
          </div>
        </div>
      }
    >
      <DocumentArchitectureClient />
    </Suspense>
  );
}
