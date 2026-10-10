import { Metadata } from "next";
import CapstoneContent from "./CapstoneContent";

export const metadata: Metadata = {
  title: "Academic Capstone Report & Viva Prep — SeoSeite Platform",
  description: "Official BCA Final-Year Capstone Project documentation, system architecture, mathematical formulations, and College Viva Voce examination questions.",
};

export default function CapstonePage() {
  return <CapstoneContent />;
}
