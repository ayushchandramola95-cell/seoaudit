import { Metadata } from "next";
import { Suspense } from "react";
import TrafficEstimatorClient from "./TrafficEstimatorClient";

export const metadata: Metadata = {
  title: "Organic Traffic & Reach Estimator | SEO Audit Intel",
  description:
    "Predict monthly search traffic, benchmark against Open PageRank authority, analyze traffic channels (Organic, Direct, Referral, Social), and estimate SERP reach.",
};

export default function TrafficEstimatorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <div className="flex items-center gap-3 text-slate-500 font-medium">
            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span>Loading Traffic Estimator...</span>
          </div>
        </div>
      }
    >
      <TrafficEstimatorClient />
    </Suspense>
  );
}
