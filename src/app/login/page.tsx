import { Suspense } from "react";
import { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Sign In — SEO Audit Intel Platform",
  description: "Sign in to your SEO Audit Intel account to access technical audits, Core Web Vitals telemetry, and FastMCP tools.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm text-slate-500">Loading sign in...</div>}>
      <LoginClient />
    </Suspense>
  );
}
