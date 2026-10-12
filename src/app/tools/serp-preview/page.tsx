import type { Metadata } from "next";
import SerpPreviewClient from "./SerpPreviewClient";

export const metadata: Metadata = {
  title: "Google SERP Simulator & Snippet Preview Tool | SeoSeite",
  description:
    "Preview how your website appears on Google Desktop and Mobile search results. Check title length, pixel width truncation, and meta description rendering.",
};

export default function SerpPreviewPage() {
  return <SerpPreviewClient />;
}
