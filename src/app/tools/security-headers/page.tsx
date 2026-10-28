import { Metadata } from "next";
import { Suspense } from "react";
import SecurityHeadersClient from "./SecurityHeadersClient";

export const metadata: Metadata = {
  title: "Security Headers Guard & SSL Hardening Studio | SEO Audit Intel",
  description:
    "Audit critical HTTP security headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy), inspect transport encryption, and generate 1-click server hardening configs.",
};

export default function SecurityHeadersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <div className="flex items-center gap-3 text-slate-500 font-medium">
            <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <span>Loading Security Headers Studio...</span>
          </div>
        </div>
      }
    >
      <SecurityHeadersClient />
    </Suspense>
  );
}
