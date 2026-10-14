import { Metadata } from "next";
import ApiDocsClient from "./ApiDocsClient";

export const metadata: Metadata = {
  title: "Developer REST API & Webhooks Reference | SEO Audit",
  description:
    "Explore the complete SEO Audit developer API catalog. Programmatically execute technical SEO audits, competitor benchmarks, batch crawls, and Model Context Protocol queries.",
};

export default function ApiDocsPage() {
  return <ApiDocsClient />;
}
