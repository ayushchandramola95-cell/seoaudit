import { Metadata } from "next";
import PresentationClient from "./PresentationClient";

export const metadata: Metadata = {
  title: "Project Presentation Slide Deck — SEO Audit (WebIntel)",
  description: "Interactive Capstone Project Presentation Deck for SEO Audit by Ayush Chandramola.",
};

export default function PresentationPage() {
  return <PresentationClient />;
}
