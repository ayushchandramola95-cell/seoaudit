import { Metadata } from "next";
import ContentGapClient from "./ContentGapClient";

export const metadata: Metadata = {
  title: "Semantic Content Gap & Keyword Matrix | SEO Audit Competitive Tools",
  description:
    "Compare your webpage against any competitor to uncover missing keywords, topical heading gaps, and content length disparity. Inspired by Ahrefs Content Gap.",
  keywords: [
    "Content Gap Tool",
    "Keyword Gap Analysis",
    "Ahrefs Content Gap alternative",
    "competitor keyword finder",
    "topic gap analysis",
    "SEO semantic keywords",
  ],
};

export default function ContentGapPage() {
  return <ContentGapClient />;
}
