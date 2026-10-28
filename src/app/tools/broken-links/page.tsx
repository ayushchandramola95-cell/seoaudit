import { Suspense } from "react";
import type { Metadata } from "next";
import BrokenLinksClient from "./BrokenLinksClient";

export const metadata: Metadata = {
  title: "Free Broken Link Checker - Find 404 Dead Links | SEO Audit",
  description:
    "Scan any website URL in seconds to identify internal and external 404 dead links, broken redirects, and anchor text issues with zero friction.",
};

export default function BrokenLinksPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <BrokenLinksClient />
    </Suspense>
  );
}
