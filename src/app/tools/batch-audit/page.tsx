import { Metadata } from "next";
import BatchAuditClient from "./BatchAuditClient";

export const metadata: Metadata = {
  title: "Multi-URL Batch SEO Auditor | SEO Audit Developer Tools",
  description:
    "Audit up to 15 website URLs simultaneously. Compare technical SEO health scores, response times, tech stacks, and Open PageRank in a single unified table. Modeled after Ahrefs Batch Analysis.",
  keywords: [
    "Batch SEO Analysis",
    "Multi-URL SEO audit",
    "bulk website crawler",
    "Ahrefs Batch Analysis alternative",
    "batch PageRank lookup",
    "bulk SEO checker",
  ],
};

export default function BatchAuditPage() {
  return <BatchAuditClient />;
}
