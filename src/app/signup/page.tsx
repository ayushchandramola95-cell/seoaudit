import { Suspense } from "react";
import { Metadata } from "next";
import SignupClient from "./SignupClient";

export const metadata: Metadata = {
  title: "Sign Up & Select Plan — SEO Audit Intel Platform",
  description: "Create your SEO Audit account and choose from Free Webmaster, Starter, Pro Analyst, or Agency tiers.",
};

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm text-slate-500">Loading sign up...</div>}>
      <SignupClient />
    </Suspense>
  );
}
