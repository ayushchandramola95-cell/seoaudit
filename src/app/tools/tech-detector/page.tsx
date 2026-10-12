import type { Metadata } from "next";
import TechDetectorClient from "./TechDetectorClient";

export const metadata: Metadata = {
  title: "Website Technology Stack Detector - CMS & Framework Profiler | SeoSeite",
  description:
    "Detect what CMS, framework, CDN, hosting, analytics, and advertising scripts any website is running in under 100 milliseconds.",
};

export default function TechDetectorPage() {
  return <TechDetectorClient />;
}
