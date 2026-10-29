import { Metadata } from "next";
import { Suspense } from "react";
import BacklinkCheckerClient from "./BacklinkCheckerClient";

export const metadata: Metadata = {
  title: "Backlink Profile & Anchor Text Checker | SEO Audit Intel",
  description:
    "Analyze backlink footprint, referring domains, dofollow vs nofollow ratio, anchor text distribution, and spam score powered by Open PageRank web graph.",
};

export default function BacklinkCheckerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <div className="flex items-center gap-3 text-slate-500 font-medium">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span>Loading Backlink Profile Studio...</span>
          </div>
        </div>
      }
    >
      <BacklinkCheckerClient />
    </Suspense>
  );
}
