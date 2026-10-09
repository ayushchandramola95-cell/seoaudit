import { Suspense } from "react";
import { Metadata } from "next";
import DashboardContent from "./DashboardContent";

export const metadata: Metadata = {
  title: "SaaS Dashboard & Cloud Status — SeoSeite Platform",
  description: "Operational dashboard for tracking recent website audits, competitor benchmarks, and Google Cloud Run / Cloud SQL PostgreSQL runtime connections.",
};

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <div className="text-slate-500 font-medium text-sm flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
            Loading Operational Dashboard...
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
