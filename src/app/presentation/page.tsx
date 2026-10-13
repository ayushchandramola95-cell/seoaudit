import { Metadata } from "next";
import PresentationClient from "./PresentationClient";

export const metadata: Metadata = {
  title: "Project Presentation Slide Deck — SeoSeite (WebIntel)",
  description: "Interactive Capstone Project Presentation Deck for SeoSeite by Ayush Chandramola.",
};

export default function PresentationPage() {
  return <PresentationClient />;
}
