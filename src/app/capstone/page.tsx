import { Metadata } from "next";
import CapstoneContent from "./CapstoneContent";

export const metadata: Metadata = {
  title: "Architecture & Methodology Spec — SeoSeite Platform",
  description: "Enterprise website intelligence architecture, deterministic scoring formulations, Core Web Vitals telemetry, and SSRF security engineering specifications.",
};

export default function CapstonePage() {
  return <CapstoneContent />;
}
