import { Suspense } from "react";
import type { Metadata } from "next";
import ImageOptimizerClient from "./ImageOptimizerClient";

export const metadata: Metadata = {
  title: "Image SEO & Next-Gen Format Scanner — SeoSeite",
  description:
    "Audit image alt text coverage, detect legacy PNGs/JPEGs, check for WebP/AVIF compression, and prevent Cumulative Layout Shift (CLS) penalties.",
};

export default function ImageOptimizerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ImageOptimizerClient />
    </Suspense>
  );
}

