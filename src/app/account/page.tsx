import { Suspense } from "react";
import { Metadata } from "next";
import AccountClient from "./AccountClient";

export const metadata: Metadata = {
  title: "My Account & Subscription — SeoSeite Intel Platform",
  description: "Manage your active subscription, daily scan quotas, FastMCP tokens, and team seats.",
};

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm text-slate-500">Loading account...</div>}>
      <AccountClient />
    </Suspense>
  );
}
