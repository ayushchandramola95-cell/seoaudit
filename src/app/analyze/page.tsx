import { Suspense } from "react";
import AnalyzeContent from "./AnalyzeContent";

export const metadata = {
  title: "Website Analyzer — SeoSeite Platform",
  description: "Analyze technical SEO, performance, technologies, and traffic estimation for any public website.",
};

export default function AnalyzePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-sm text-slate-500 font-medium">Loading analyzer interface...</div>
        </div>
      }
    >
      <AnalyzeContent />
    </Suspense>
  );
}
