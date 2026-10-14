import type { Metadata } from "next";
import ToolsHubClient from "./ToolsHubClient";

export const metadata: Metadata = {
  title: "Free SEO Tools Directory - Professional Website Utilities | SEO Audit",
  description:
    "Explore SEO Audit's suite of free technical SEO tools: broken link checker, Core Web Vitals lab, Schema validator, SERP simulator, and tech stack profiler.",
};

export default function ToolsHubPage() {
  return <ToolsHubClient />;
}
