import { Suspense } from "react";
import type { Metadata } from "next";
import DesignSkillsClient from "./DesignSkillsClient";

export const metadata: Metadata = {
  title: "Claude & Agent UI/UX Design Skills Reference | SeoSeite",
  description:
    "Curated collection of the top Claude Code and AI agent design skills: frontend-design, TasteSkill, motion physics, bento grids, and 5-state interaction craft.",
};

export default function DesignSkillsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">
          Loading Design Skills Directory...
        </div>
      }
    >
      <DesignSkillsClient />
    </Suspense>
  );
}
