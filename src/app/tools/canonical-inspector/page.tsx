import { Suspense } from "react";
import type { Metadata } from "next";
import CanonicalInspectorClient from "./CanonicalInspectorClient";

export const metadata: Metadata = {
  title: "Canonical & Duplicate Content Inspector — SeoSeite",
  description:
    "Verify rel=canonical tags, detect multiple conflicting tags, test trailing slashes and HTTP vs. HTTPS, and prevent duplicate content penalties.",
};

export default function CanonicalInspectorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CanonicalInspectorClient />
    </Suspense>
  );
}

