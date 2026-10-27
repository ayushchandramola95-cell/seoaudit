import { Suspense } from "react";
import CompareContent from "./CompareContent";
import AuthGuard from "@/components/auth/AuthGuard";

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
      <AuthGuard
        fallbackTitle="Sign In for Competitor Benchmarks"
        fallbackMessage="Compare two websites side-by-side, uncover semantic content gaps, and analyze competitor tech stacks with a free account."
      >
        <CompareContent />
      </AuthGuard>
    </Suspense>
  );
}
