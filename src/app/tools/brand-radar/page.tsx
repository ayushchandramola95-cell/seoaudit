import { Metadata } from "next";
import BrandRadarClient from "./BrandRadarClient";

export const metadata: Metadata = {
  title: "Brand Radar AI & AEO Visibility Studio | SeoSeite Standalone Tools",
  description:
    "Track your brand recommendations across AI answer engines (ChatGPT, Google Gemini, Perplexity, Claude). Measure AI Share of Voice (SoV), competitor co-citations, and rank positions.",
  keywords: [
    "Brand Radar AI",
    "AEO tool",
    "Answer Engine Optimization",
    "AI Share of Voice",
    "ChatGPT brand mentions",
    "Perplexity citation tracker",
    "Ahrefs Brand Radar alternative",
  ],
};

export default function BrandRadarPage() {
  return <BrandRadarClient />;
}
