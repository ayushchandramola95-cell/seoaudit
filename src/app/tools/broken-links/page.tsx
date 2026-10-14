import type { Metadata } from "next";
import BrokenLinksClient from "./BrokenLinksClient";

export const metadata: Metadata = {
  title: "Free Broken Link Checker - Find 404 Dead Links | SEO Audit",
  description:
    "Scan any website URL in seconds to identify internal and external 404 dead links, broken redirects, and anchor text issues with zero friction.",
};

export default function BrokenLinksPage() {
  return <BrokenLinksClient />;
}
