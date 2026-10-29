import { Suspense } from "react";
import type { Metadata } from "next";
import HreflangAuditorClient from "./HreflangAuditorClient";

export const metadata: Metadata = {
  title: "Hreflang & International SEO Auditor — SeoSeite",
  description:
    "Audit alternate language tags, verify return links and self-referencing hreflangs, validate ISO codes, and ensure accurate global Google search targeting.",
};

export default function HreflangAuditorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <HreflangAuditorClient />
    </Suspense>
  );
}
