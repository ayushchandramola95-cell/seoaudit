import type { Metadata } from "next";
import GoogleHubClient from "./GoogleHubClient";
import AuthGuard from "@/components/auth/AuthGuard";

export const metadata: Metadata = {
  title: "Google Search Console & GA4 Multi-Site Hub | SEO Audit",
  description:
    "Connect and manage all your verified Google Search Console and Google Analytics 4 properties. Switch between client domains, inspect search queries, and trigger audits on demand.",
};

export default function GoogleHubPage() {
  return (
    <AuthGuard
      fallbackTitle="Sign In to Access Google Search Console & GA4 Hub"
      fallbackMessage="Connect your Google Search Console and GA4 properties to view real search impressions, queries, and engagement across all your websites."
    >
      <GoogleHubClient />
    </AuthGuard>
  );
}
