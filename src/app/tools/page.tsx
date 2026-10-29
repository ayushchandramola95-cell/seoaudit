import type { Metadata } from "next";
import ToolsHubClient from "./ToolsHubClient";
import AuthGuard from "@/components/auth/AuthGuard";

export const metadata: Metadata = {
  title: "Professional SEO Tools Hub — SEO Audit Intel",
  description:
    "Explore SEO Audit's suite of specialized SEO tools: broken link checker, Core Web Vitals lab, Schema validator, SERP simulator, and tech stack profiler.",
};

export default function ToolsHubPage() {
  return (
    <AuthGuard
      fallbackTitle="Sign In to Access SEO Tools Hub"
      fallbackMessage="Access all 17 specialized SEO utility engines, Core Web Vitals lab, SERP simulators, and AI brand scanners with your account."
    >
      <ToolsHubClient />
    </AuthGuard>
  );
}
