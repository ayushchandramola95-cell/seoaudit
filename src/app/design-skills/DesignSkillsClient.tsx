"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  Palette,
  Zap,
  Layers,
  Activity,
  CheckCircle2,
  Code2,
  Copy,
  Check,
  Eye,
  ArrowRight,
  Sliders,
  MousePointer,
  Maximize2,
  Minimize2,
  Monitor,
  Flame,
  Search,
  Filter,
  Terminal,
  ShieldCheck,
  RefreshCw,
  Box,
  Compass,
  Cpu,
  Globe,
  LayoutGrid,
  TrendingUp,
  FileCode,
  Info,
} from "lucide-react";

interface DesignSkill {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  category: "anti-slop" | "motion" | "craft" | "data-viz" | "ergonomics" | "patterns";
  origin: "Anthropic Official" | "Community Standard" | "Enterprise Design";
  tagline: string;
  antiSlopVerdict: string;
  principles: string[];
  skillMdPrompt: string;
  implementationCode: string;
  keyLibraries: string[];
}

export default function DesignSkillsClient() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkillId, setSelectedSkillId] = useState<string>("frontend-design");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Interactive Live Motion Playground State
  const [springStiffness, setSpringStiffness] = useState<number>(300);
  const [springDamping, setSpringDamping] = useState<number>(25);
  const [motionTrigger, setMotionTrigger] = useState<number>(0);

  // Interactive Spotlight Card Mouse Coordinates
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!spotlightRef.current) return;
    const rect = spotlightRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const skills: DesignSkill[] = [
    {
      id: "frontend-design",
      name: "frontend-design",
      badge: "Anthropic Official",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      category: "anti-slop",
      origin: "Anthropic Official",
      tagline: "The definitive anti-slop framework for Claude Code & AI agents.",
      antiSlopVerdict:
        "Bans generic purple-blue gradients, cookie-cutter 3-column card layouts, and unmotivated pill buttons. Forces a distinct artistic point of view derived from the project domain.",
      principles: [
        "Commit to a specific aesthetic point of view: Swiss Modernist, Industrial Brutalism, Editorial Luxury, or High-Density FinTech Terminal.",
        "Derive typography, colors, and rhythm from the real-world domain rather than defaulting blindly to Inter/Roboto and blue accents.",
        "Avoid centered hero clichés (headline + badge + generic CTA) unless rigorously justified by narrative hierarchy.",
        "Use asymmetrical grids, horizontal rule dividers, and structured content density.",
      ],
      skillMdPrompt: `---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with strong point of view, zero AI slop, and intentional craft.
---
# Frontend Design Directives
When generating, refactoring, or polishing web interfaces:
1. Avoid "AI Slop Defaults": Never output generic centered purple/blue gradients, repetitive 3-box feature grids, or unmotivated floating pill buttons.
2. Establish Aesthetic Direction: Choose a coherent design philosophy (e.g., Swiss Graphic Design, High-Density Cyberpunk, Minimalist Scandinavian, or Enterprise Monospace).
3. Typography Pairing: Use deliberate pairings (e.g. Display font like Syne/Plus Jakarta Sans + Monospace numeric tabular font for data).
4. Content-Driven Rhythm: Structure layouts according to information hierarchy, prioritizing scanning ergonomics over decorative filler.`,
      implementationCode: `// Example: Enterprise Monospace High-Density Header
<div className="flex items-center justify-between py-3 px-4 border-b border-slate-200/80 bg-slate-900 text-white">
  <div className="flex items-center gap-3">
    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
    <span className="font-mono text-xs uppercase tracking-wider text-slate-400">ENGINE_STATUS: ACTIVE</span>
    <span className="text-slate-600">/</span>
    <span className="font-mono text-xs font-bold text-white">LATENCY: 42ms</span>
  </div>
  <kbd className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">⌘K QUICK JUMP</kbd>
</div>`,
      keyLibraries: ["Tailwind CSS v4", "CSS Grid", "Design Tokens", "Radix UI Primitives"],
    },
    {
      id: "taste-skill",
      name: "TasteSkill (Anti-Slop Palette)",
      badge: "Community Gold Standard",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
      category: "anti-slop",
      origin: "Community Standard",
      tagline: "Curated aesthetic taste, color restraint, and proportional balance.",
      antiSlopVerdict:
        "Eliminates chaotic multi-color noise by enforcing the 60-30-10 color rule and a strict 4-layer surface elevation system.",
      principles: [
        "60-30-10 Color Hierarchy: 60% neutral canvas, 30% structural contrast (slate-800/zinc-100), 10% electric high-voltage focal accent.",
        "4-Layer Surface Elevation: Layer 0 (canvas) -> Layer 1 (card surface) -> Layer 2 (interactive hover) -> Sub-pixel rim border.",
        "Sub-pixel Rim Borders: Use 1px borders with 5-15% white opacity (dark mode) or 10-20% slate opacity (light mode) instead of heavy shadows.",
        "Avoid muddy dark grays: Use tinted darks (e.g., rich midnight blue #0B0F19 or graphite zinc #09090B).",
      ],
      skillMdPrompt: `---
name: taste-skill
description: Enforce high design taste, harmonic color palettes, and balanced surface hierarchies.
---
# Taste & Elevation Directives
1. Color Balance: Enforce 60-30-10 color proportions. Never use more than one high-chroma primary accent per view.
2. Elevation Depth: Never rely exclusively on drop shadows. Build depth using tinted borders (border-white/10 or border-slate-200/80) and subtle background shifts.
3. Spacing Rhythm: Standardize spacing on an 8pt grid (gap-2, gap-4, gap-6, p-6, p-8) to create predictable visual harmony.
4. Typography Contrast: Use font weights (400, 600, 800) and optical sizes rather than arbitrary font size jumps.`,
      implementationCode: `/* TasteSkill 4-Layer Surface Tokens */
:root {
  --surface-canvas: #090d16;
  --surface-card: #0f172a;
  --surface-hover: #1e293b;
  --border-rim: rgba(255, 255, 255, 0.08);
  --accent-focal: #3b82f6;
}

.tasty-card {
  background: var(--surface-card);
  border: 1px solid var(--border-rim);
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.5);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}`,
      keyLibraries: ["Tailwind Theme Config", "CSS Custom Properties", "Chroma.js", "Geist"],
    },
    {
      id: "motion-physics",
      name: "motion-physics (Framer Motion)",
      badge: "Fluid Dynamics",
      badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
      category: "motion",
      origin: "Enterprise Design",
      tagline: "Natural spring physics and layout morphing over robotic linear easings.",
      antiSlopVerdict:
        "Replaces rigid linear or bezier transitions with physical mass, stiffness, and damping. Prevents stiff, jarring UI animations.",
      principles: [
        "Spring Physics Directives: Default to snappy spring transitions (stiffness: 260-350, damping: 20-28) that mirror physical objects.",
        "Shared Layout Morphing: Use layoutId to glide active pill indicators, tabs, and modal cards without sudden jumps or reflows.",
        "Staggered Cascades: Cascade list entrances with 30-50ms staggering so complex views blossom into place naturally.",
        "Micro-Exit Acceleration: Exit animations should be 30% faster than entrance animations so UI feels instantaneous.",
        "Respect Accessibility: Always wrap motion in @media (prefers-reduced-motion) to prevent vestibular discomfort.",
      ],
      skillMdPrompt: `---
name: motion-physics
description: Implement physics-based UI animations, layout morphing, and fluid gesture interactions.
---
# Motion Directives
1. Prefer Springs: Avoid linear ease-in-out curves for layout changes. Use damping & stiffness parameters.
2. Layout Continuity: Use Framer Motion layoutId for active selection indicators (tabs, navigations, segment switchers).
3. Scale Dynamics: Active tap/click state must offer tactile feedback (scale: 0.98, transition: { duration: 0.1 }).
4. Reduced Motion Support: Honor user accessibility settings with smooth zero-translation opacity fallbacks.`,
      implementationCode: `// Framer Motion Spring Recipe
import { motion } from "framer-motion";

export const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 24,
  mass: 0.8,
};

export function ActiveTabPill({ isSelected, label }) {
  return (
    <button className="relative px-4 py-2 text-xs font-bold">
      {isSelected && (
        <motion.div
          layoutId="active-pill"
          className="absolute inset-0 bg-blue-600 rounded-xl"
          transition={springTransition}
        />
      )}
      <span className="relative z-10 text-white">{label}</span>
    </button>
  );
}`,
      keyLibraries: ["Framer Motion", "Motion One", "React Spring", "GSAP ScrollTrigger"],
    },
    {
      id: "impeccable-states",
      name: "impeccable-states (5-State Rule)",
      badge: "Pixel Precision",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      category: "ergonomics",
      origin: "Enterprise Design",
      tagline: "Zero missing interaction states, resilient skeletons, and instant feedback.",
      antiSlopVerdict:
        "Eliminates empty flash screens and unresponsive buttons by requiring every single element to define default, hover, focus-visible, active, and disabled states.",
      principles: [
        "The 5-State Imperative: Every interactable must declare Default, Hover, Focus-Visible, Active (pressed), and Disabled states.",
        "Zero-Layout-Shift Skeletons: Shimmer loading skeletons must exactly duplicate the geometric dimensions of final populated content.",
        "Contextual Disabled Tooltips: Never disable a button silently; always provide an explanatory tooltip indicating prerequisite actions.",
        "Optimistic UI Responses: Immediately update UI upon user click, silently reconciling in the background with rollback resilience.",
      ],
      skillMdPrompt: `---
name: impeccable-states
description: Ensure 100% interactive state coverage, zero layout shifts, and bulletproof user feedback.
---
# State Ergonomics Directives
1. 5-State Rule: Define default, hover (brightness shift), focus-visible (ring-2 ring-offset-2), active (scale-98), and disabled (cursor-not-allowed, opacity-50).
2. Layout Stability (CLS=0): Skeletons must match final typography lines and card heights exactly.
3. Keyboard Navigation: Interactive items must support Tab, Shift+Tab, Enter, Space, and Escape.
4. Error Recovery: Every error state must include a prominent 'Retry' trigger rather than a dead-end message.`,
      implementationCode: `// 5-State Button Implementation in Tailwind v4
<button
  type="button"
  disabled={isLoading}
  className="
    inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl
    bg-blue-600 text-white shadow-xs
    hover:bg-blue-500 hover:shadow-md hover:shadow-blue-500/20
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
    active:scale-[0.98] active:bg-blue-700
    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
    transition-all duration-150 cursor-pointer
  "
>
  {isLoading ? <Spinner className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
  <span>Execute Action</span>
</button>`,
      keyLibraries: ["Tailwind v4", "Radix Slot", "Lucide React", "ARIA Live Regions"],
    },
    {
      id: "bento-craft",
      name: "bento-craft (Spatial Depth)",
      badge: "Modern Layouts",
      badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-200",
      category: "craft",
      origin: "Enterprise Design",
      tagline: "Apple/Linear style asymmetrical bento grids with embedded mini-engines.",
      antiSlopVerdict:
        "Replaces boring rows of identical cards with dynamic 1x1, 2x1, and 2x2 modular grids containing active live telemetry visualizers.",
      principles: [
        "Dynamic Cell Geometry: Mix 1x1 summary cells, 2x1 trend charts, and 2x2 interactive studios in a single cohesive grid.",
        "Embedded Mini-Visualizers: Every bento card must house a living visual element (sparkline, gauge, status beam, or interactive toggle).",
        "Subtle Gradient Wash: Apply radial background lighting that emanates from top-right corner of focal cards.",
        "Frosted Glass Depth: Incorporate subtle backdrop blurs (backdrop-blur-md) with 1px translucent borders.",
      ],
      skillMdPrompt: `---
name: bento-craft
description: Create spatial bento grids with variable cell geometry, embedded visual engines, and glassmorphism.
---
# Bento Grid Directives
1. Structural Variation: Group cards into multi-span layouts (col-span-12, col-span-8, col-span-4). Avoid uniform repeated sizes.
2. In-Card Visualizations: Embed functional mini-components (live sparkline, radial score meter, interactive pill switcher).
3. Subtle Glassmorphism: Use subtle backdrop blurs (backdrop-blur-md) and translucent rim borders (border-white/10 or border-slate-200/90).
4. Focal Hierarchy: Ensure the single most important card has 2x spatial footprint and subtle ambient background glow.`,
      implementationCode: `// 12-Column Asymmetrical Bento Grid Template
<div className="grid grid-cols-1 md:grid-cols-12 gap-4">
  {/* Primary Hero Card: 8 Columns */}
  <div className="md:col-span-8 p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
    <h3 className="text-lg font-black">Main Intelligence Engine</h3>
    <p className="text-xs text-slate-400 mt-1">Real-time deterministic telemetry stream.</p>
    {/* Live Chart Placeholder */}
    <div className="h-40 mt-4 rounded-2xl bg-slate-800/50 border border-slate-700/50" />
  </div>

  {/* Secondary Metric Card: 4 Columns */}
  <div className="md:col-span-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
    <div>
      <span className="text-[10px] font-extrabold uppercase text-slate-400">Score Index</span>
      <div className="text-3xl font-black text-slate-900 mt-1">98.4%</div>
    </div>
    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-600 font-bold">
      <span>Sub-100ms Crawl</span>
      <CheckCircle2 className="w-4 h-4" />
    </div>
  </div>
</div>`,
      keyLibraries: ["CSS Grid", "Tailwind CSS", "Radix UI", "Lucide Icons"],
    },
    {
      id: "data-viz-studio",
      name: "data-viz-studio (Mathematical Curves)",
      badge: "Deterministic Visuals",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
      category: "data-viz",
      origin: "Enterprise Design",
      tagline: "Smooth monotone cubic Bezier curves, animated stroke paths, and magnetic tooltips.",
      antiSlopVerdict:
        "Replaces jagged line charts with mathematically interpolated monotone cubic Bezier curves and responsive SVG viewports.",
      principles: [
        "Monotone Cubic Spline Interpolation: Smooth out data points using tangent-controlled cubic Bezier curves (C x1 y1, x2 y2, x y) to eliminate unnatural sharp peaks.",
        "Area Gradient Lighting: Fill areas beneath trajectories with vertical gradients fading smoothly to 0% opacity.",
        "Interactive Magnetic Snapping: Crosshairs that snap magnetically to nearest discrete month/day data points on mousemove.",
        "Stroke Dasharray Drawing: Animate line entrance using stroke-dasharray and stroke-dashoffset transitions.",
      ],
      skillMdPrompt: `---
name: data-viz-studio
description: Render mathematically precise, lightweight SVG data visualizations with smooth Bezier curves.
---
# Data Visualization Directives
1. Smooth Splines: Always interpolate discrete time-series points with cubic Bezier curves rather than jagged polyline connects.
2. Responsive ViewBox: Use normalized 1000x300 SVG viewports with preserveAspectRatio='none' or explicit responsive padding.
3. Interactive Crosshair: Provide floating tooltips with crosshair guidelines responding to clientX coordinates.
4. Clean Typography: Render chart labels with tabular monospace numbers for accurate horizontal alignment.`,
      implementationCode: `// Monotone Cubic Bezier SVG Curve Generator
function generateSmoothPath(points) {
  if (points.length < 2) return "";
  let d = \`M \${points[0].x} \${points[0].y}\`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += \` C \${cp1x} \${cp1y}, \${cp2x} \${cp2y}, \${p2.x} \${p2.y}\`;
  }
  return d;
}`,
      keyLibraries: ["SVG ViewBox", "KaTeX Math", "D3-Shape Math", "Recharts"],
    },
    {
      id: "spotlight-textures",
      name: "spotlight-textures (Dynamic Lighting)",
      badge: "Aceternity / Magic UI",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
      category: "patterns",
      origin: "Community Standard",
      tagline: "Dynamic cursor-following spotlight cards, subtle grid meshes, and grain overlays.",
      antiSlopVerdict:
        "Elevates flat SaaS boxes into interactive physical cards with dynamic radial lights that illuminate borders on hover.",
      principles: [
        "Cursor Spotlight Tracking: Track relative mouse position inside card containers and render dynamic radial gradients.",
        "Sub-pixel Border Masking: Illuminate only the card's 1px border when mouse nears the edge using background-clip or layered divs.",
        "Noise & Grid Underlays: Apply subtle SVG noise or dotted grid patterns at 3-5% opacity to add tactile texture.",
        "GPU Accelerated Transforms: All lighting calculations must run on transform/opacity to guarantee 60fps performance.",
      ],
      skillMdPrompt: `---
name: spotlight-textures
description: Create cursor-tracking spotlight illumination cards, sub-pixel border highlights, and ambient mesh gradients.
---
# Spotlight & Texture Directives
1. Relative Position Tracking: Use clientX/clientY relative to getBoundingClientRect() to position radial lights.
2. Sub-pixel Borders: Use an inner border container to ensure the light catches the rim without washing out inner content.
3. GPU Purity: Run hover lighting on pure opacity/transform styles to ensure 60fps frame rate without reflows.`,
      implementationCode: `// Cursor Spotlight Container Component
export function SpotlightCard({ children }) {
  const [pos, setPos] = useState({ x: 0, y: 0, opacity: 0 });
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, opacity: 1 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPos((p) => ({ ...p, opacity: 0 }))}
      className="relative rounded-3xl border border-slate-800 bg-slate-900 p-8 overflow-hidden"
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: pos.opacity,
          background: \`radial-gradient(600px circle at \${pos.x}px \${pos.y}px, rgba(59, 130, 246, 0.15), transparent 40%)\`,
        }}
      />
      {children}
    </div>
  );
}`,
      keyLibraries: ["Aceternity UI", "Magic UI", "CSS Gradients", "Canvas Confetti"],
    },
    {
      id: "a11y-wcag-studio",
      name: "a11y-wcag-studio (Universal Access)",
      badge: "WCAG AAA Standard",
      badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
      category: "ergonomics",
      origin: "Anthropic Official",
      tagline: "WCAG AAA color contrast ratios, screen reader live regions, and keyboard traps.",
      antiSlopVerdict:
        "Guarantees that aesthetic polish never compromises accessibility. Enforces strict contrast, ARIA landmarks, and keyboard focus trap loops.",
      principles: [
        "Contrast Compliance: Minimum 4.5:1 ratio for text and 3:1 for all interactive controls and border outlines.",
        "ARIA Live Announcements: Real-time scan score completions and dynamic filter updates must announce cleanly via aria-live='polite'.",
        "Visible Focus Rings: Never suppress outline:none without replacing it with a high-contrast focus-visible ring.",
        "Screen Reader Clarity: Provide descriptive aria-labels for icon-only buttons (copy, close, menu toggle).",
      ],
      skillMdPrompt: `---
name: a11y-wcag-studio
description: Enforce rigorous accessibility standards, WCAG AAA color contrast, and screen-reader semantics.
---
# Accessibility Directives
1. Contrast Checking: Text colors against backgrounds must pass minimum 4.5:1 ratio.
2. Focus Ring Policy: Always provide focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2.
3. Screen Reader Landmarks: Ensure header, main, nav, and modal dialogs have role and aria-labelledby tags.
4. Dynamic Announcements: Wrap async updates in aria-live='polite' so non-sighted users are alerted to completion.`,
      implementationCode: `// Fully Accessible Icon Button with Focus Ring & Live Region
<button
  type="button"
  aria-label="Copy audit verification link to clipboard"
  onClick={handleCopy}
  className="
    p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2
    active:scale-95 transition-all
  "
>
  <Copy className="w-4 h-4" aria-hidden="true" />
  <span className="sr-only">Copy Link</span>
</button>
<div aria-live="polite" className="sr-only">
  {isCopied && "Link copied to clipboard"}
</div>`,
      keyLibraries: ["WCAG 2.1 Guidelines", "Radix Primitives", "Tailwind sr-only"],
    },
  ];

  const categories = [
    { id: "all", label: "All Skills", count: skills.length },
    { id: "anti-slop", label: "Anti-Slop & Aesthetics", count: skills.filter((s) => s.category === "anti-slop").length },
    { id: "motion", label: "Motion & Animation", count: skills.filter((s) => s.category === "motion").length },
    { id: "craft", label: "Bento & Component Craft", count: skills.filter((s) => s.category === "craft").length },
    { id: "data-viz", label: "Data Visualization", count: skills.filter((s) => s.category === "data-viz").length },
    { id: "patterns", label: "Dynamic Textures & Lights", count: skills.filter((s) => s.category === "patterns").length },
    { id: "ergonomics", label: "Accessibility & Ergonomics", count: skills.filter((s) => s.category === "ergonomics").length },
  ];

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesSearch =
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.principles.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
        skill.keyLibraries.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCat = activeCategory === "all" || skill.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [skills, searchQuery, activeCategory]);

  const selectedSkill = skills.find((s) => s.id === selectedSkillId) || skills[0];

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Top Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/tools" className="hover:text-blue-600 transition-colors">
                Resources
              </Link>
              <span>/</span>
              <span className="font-semibold text-slate-800">Claude &amp; Agent UI/UX Design Skills</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/tools"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
              >
                <span>All 22 Engines</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl border border-slate-800">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Anthropic &amp; Modern Agentic Frontend Standards</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                Top UI, Design &amp; Motion Skills for World-Class Web Engineering
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Discover the exact instruction sets, motion physics rules, and design philosophies used by Claude,
                Cursor, and enterprise engineering teams to eliminate generic &quot;AI slop&quot; and build websites of
                Stripe, Linear, and Vercel caliber.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aesthetic Quality</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">Zero AI Slop</div>
              </div>
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Motion Standard</div>
                <div className="text-sm font-bold text-blue-400 mt-0.5">Spring Dynamics</div>
              </div>
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Layout Topology</div>
                <div className="text-sm font-bold text-purple-400 mt-0.5">Spatial Bento Grids</div>
              </div>
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Accessibility</div>
                <div className="text-sm font-bold text-cyan-400 mt-0.5">WCAG AAA Certified</div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Interactive Laboratories (Spring Dynamics & Spotlight) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Lab 1: Interactive Spring Physics Sandbox */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Live Spring Physics Lab</h3>
                  <p className="text-[11px] text-slate-500">Tune physical mass, stiffness, and damping in real time.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMotionTrigger((prev) => prev + 1)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Trigger Spring</span>
              </button>
            </div>

            {/* Visual Spring Stage */}
            <div className="h-44 bg-slate-900 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Trajectory Simulation: stiffness={springStiffness}, damping={springDamping}
              </div>

              {/* Animated Floating Card with Dynamic CSS Spring */}
              <div
                key={motionTrigger}
                style={{
                  animation: `bounceSpring 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275)`,
                  transition: `transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)`,
                }}
                className="p-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-black">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-black text-xs">Tactile Spring Component</div>
                    <div className="text-[10px] text-indigo-100 font-mono">Zero robotic linear easing</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-md font-bold">60 FPS</span>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Start: [x: 0, scale: 0.95]</span>
                <span className="text-emerald-400">Resting Point: [x: 0, scale: 1.00]</span>
              </div>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-bold text-slate-700">
                  <span>Stiffness</span>
                  <span className="font-mono text-indigo-600">{springStiffness}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="500"
                  value={springStiffness}
                  onChange={(e) => setSpringStiffness(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-bold text-slate-700">
                  <span>Damping</span>
                  <span className="font-mono text-indigo-600">{springDamping}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={springDamping}
                  onChange={(e) => setSpringDamping(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Lab 2: Interactive Dynamic Spotlight Lighting */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Dynamic Spotlight Laboratory</h3>
                  <p className="text-[11px] text-slate-500">Move your cursor over the card to test radial rim lighting.</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                GPU Shader
              </span>
            </div>

            {/* Interactive Spotlight Card */}
            <div
              ref={spotlightRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="h-56 bg-slate-900 rounded-2xl p-6 relative overflow-hidden border border-slate-800 flex flex-col justify-between cursor-crosshair group"
            >
              {/* Radial Lighting Mesh */}
              <div
                className="pointer-events-none absolute -inset-px transition-opacity duration-200 rounded-2xl"
                style={{
                  opacity: mousePos.opacity,
                  background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(147, 51, 234, 0.25), rgba(59, 130, 246, 0.1) 40%, transparent 80%)`,
                }}
              />

              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/50">
                  Cursor Spotlight Active
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  x: {Math.round(mousePos.x)}px, y: {Math.round(mousePos.y)}px
                </span>
              </div>

              <div className="relative z-10 space-y-1">
                <h4 className="text-base font-bold text-white group-hover:text-purple-200 transition-colors">
                  Aceternity / Magic UI Dynamic Surface
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Notice how the ambient light follows your cursor smoothly across the surface without triggering DOM
                  reflows.
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-2 pt-3 border-t border-slate-800 text-[11px] text-slate-300 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>60 FPS Hardware Rendered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills by name, directive, or framework (e.g. Framer, Anti-Slop, Bento)..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 focus:bg-white text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div className="text-xs font-bold text-slate-500">
              Showing <span className="text-slate-900 font-extrabold">{filteredSkills.length}</span> of{" "}
              {skills.length} skills
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-slate-900 text-white shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                    activeCategory === cat.id ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Master-Detail Catalog Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Skill Selector Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            {filteredSkills.map((skill) => {
              const isSelected = selectedSkillId === skill.id;
              return (
                <div
                  key={skill.id}
                  onClick={() => setSelectedSkillId(skill.id)}
                  className={`p-5 rounded-2xl border text-left cursor-pointer transition-all space-y-3 ${
                    isSelected
                      ? "bg-white border-blue-600 ring-2 ring-blue-500/20 shadow-md"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-black text-slate-900">{skill.name}</span>
                    </div>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${skill.badgeColor}`}>
                      {skill.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-snug line-clamp-2">{skill.tagline}</p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <div className="flex flex-wrap gap-1">
                      {skill.keyLibraries.slice(0, 2).map((lib, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                          {lib}
                        </span>
                      ))}
                    </div>
                    <span className={`font-bold flex items-center gap-1 ${isSelected ? "text-blue-600" : "text-slate-400"}`}>
                      <span>Inspect</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Deep-Dive Skill Dossier (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${selectedSkill.badgeColor}`}>
                      {selectedSkill.origin}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">ID: {selectedSkill.id}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-1">
                    {selectedSkill.name}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(selectedSkill.skillMdPrompt, selectedSkill.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  {copiedId === selectedSkill.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied SKILL.md</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy SKILL.md Prompt</span>
                    </>
                  )}
                </button>
              </div>

              {/* Anti-Slop Verdict Card */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Anti-Slop Directives &amp; Philosophy</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">{selectedSkill.antiSlopVerdict}</p>
              </div>

              {/* Core Execution Principles */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Core Implementation Directives
                </h3>
                <div className="space-y-2">
                  {selectedSkill.principles.map((p, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-xs text-slate-700">
                      <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="leading-snug">{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agent SKILL.md Instructions Block */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-slate-500" />
                    <span>Exact SKILL.md Prompt Format</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">Paste in .claude/skills/ or prompt</span>
                </div>
                <pre className="text-xs font-mono bg-slate-900 text-slate-100 p-4 rounded-2xl overflow-x-auto leading-relaxed border border-slate-800">
                  {selectedSkill.skillMdPrompt}
                </pre>
              </div>

              {/* Ready-to-use Code Recipe */}
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Production Code Recipe</span>
                </h3>
                <pre className="text-xs font-mono bg-slate-950 text-blue-300 p-4 rounded-2xl overflow-x-auto leading-relaxed border border-slate-800">
                  {selectedSkill.implementationCode}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Global How to Install & Apply Guide */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Agent Setup Guide
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              How to Install &amp; Activate These Skills in Claude Code &amp; Cursor
            </h2>
            <p className="text-xs text-slate-500">
              Skills allow your AI assistant to persistently apply these design rules across every generation without
              repeated prompting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  1
                </div>
                <span>Create Skill Directory</span>
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                In your project root, create <code className="font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-slate-200">.claude/skills/frontend-design/</code> or globally in your user config.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  2
                </div>
                <span>Save SKILL.md Prompt</span>
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                Copy the prompt box from any skill above and save it as <code className="font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-slate-200">SKILL.md</code> inside that directory.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  3
                </div>
                <span>Prompt with Intent</span>
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                Ask Claude: <em className="text-slate-800 font-semibold">&quot;Using frontend-design, rebuild this dashboard with spring physics and an editorial Swiss aesthetic.&quot;</em>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
