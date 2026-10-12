import type { Metadata } from "next";
import SpeedLabClient from "./SpeedLabClient";

export const metadata: Metadata = {
  title: "Core Web Vitals & PageSpeed Lab - Free Speed Audit | SeoSeite",
  description:
    "Test your website speed, Core Web Vitals (LCP, CLS, INP, FCP, TTFB), and performance bottlenecks powered directly by Google PageSpeed Insights.",
};

export default function SpeedLabPage() {
  return <SpeedLabClient />;
}
