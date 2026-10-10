import { Metadata } from "next";
import PricingContent from "./PricingContent";

export const metadata: Metadata = {
  title: "Pricing & Plans — SeoSeite Platform",
  description: "Transparent, predictable pricing for website intelligence, deterministic SEO auditing, technology detection, and competitor benchmarking.",
};

export default function PricingPage() {
  return <PricingContent />;
}
