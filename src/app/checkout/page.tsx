import { Suspense } from "react";
import { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Secure Checkout & Plan Activation — SeoSeite Intel Platform",
  description: "Complete your subscription payment to activate your SeoSeite Starter, Pro, or Agency plan.",
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm text-slate-500">Loading checkout...</div>}>
      <CheckoutClient />
    </Suspense>
  );
}
