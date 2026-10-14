import { Suspense } from "react";
import CompareContent from "./CompareContent";

export const metadata = {
  title: "Competitor Website Comparison — SEO Audit Platform",
  description: "Side-by-side technical SEO, Core Web Vitals, technology stack, and traffic comparison between two websites.",
};

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-sm text-slate-500 font-medium">Loading comparison tool...</div>
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
