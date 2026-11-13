---
name: frontend-design
description: >-
  Use this skill whenever authoring, refactoring, or reviewing frontend user
  interfaces, web pages, or components to eliminate generic AI defaults ("AI slop")
  and deliver distinctive, high-craft, production-grade visual design.
---

# Frontend Design & Anti-Slop Directives

This skill enforces intentional aesthetic direction, bespoke typography, and high visual craft, preventing generic "AI slop" across all frontend code.

## 1. Eliminate "AI Slop" Defaults
Never output generic, low-effort AI aesthetics:
- **BAN generic blue-to-purple linear gradients** on text or buttons unless explicitly requested.
- **BAN predictable 3-box feature card rows** with centered emoji icons.
- **BAN unmotivated floating pill buttons** that float without typographic anchoring.
- **BAN empty white/black backgrounds** without sub-pixel depth, rim borders, or texture.
- **BAN generic centered hero templates** (headline + badge + button) when information hierarchy demands data-rich, high-signal presentation.

## 2. Commit to a Coherent Aesthetic Point of View
Always derive visual styling from the specific domain and user context:
- **High-Density Technical/Data (SEO, DevTools, FinTech):**
  - Dark obsidian or crisp porcelain surfaces (`#090D16` / `#F8FAFC`).
  - Monospace numeric telemetry (`font-mono`, tabular numbers).
  - High-contrast indicator pills (emerald for 200 OK, rose for 404, amber for redirect).
  - Crisp 1px sub-pixel rim borders (`border-white/10` or `border-slate-200/90`).
  - Terminal-grade status bars and ⌘K search triggers.
- **Editorial & Modern SaaS:**
  - High-contrast headline typography (Plus Jakarta Sans, Syne, Geist, Outfit).
  - Generous asymmetric white space balanced with dense operational sidebars.
  - Subdued, confident color palette with single electric focal accents.

## 3. The 60-30-10 Color Hierarchy
- **60% Canvas & Neutral Space:** Deep slate/zinc canvas in dark mode (`slate-950`, `zinc-950`) or warm alabaster/porcelain in light mode (`slate-50`, `zinc-50`).
- **30% Structural Contrast:** Card surfaces, sidebars, borders, and muted badges (`slate-900`, `slate-100`, `slate-200`).
- **10% High-Voltage Focal Accent:** A single intentional accent color for primary actions, live status indicators, and critical metrics (e.g., Electric Blue `#2563EB`, Emerald `#10B981`, or Violet `#7C3AED`).

## 4. Multi-Layer Surface Elevation
Never rely solely on heavy, blurry drop shadows. Build tactile depth using:
1. **Layer 0 (Canvas):** Underlying viewport background.
2. **Layer 1 (Card Surface):** Slightly shifted tone (`bg-white` or `bg-slate-900/90`).
3. **Layer 2 (Interactive/Floating):** Raised popovers, dropdowns, and modals (`bg-white` / `bg-slate-800`).
4. **Sub-Pixel Rim Borders:** 1px border with 8–15% white opacity (dark) or 10–20% slate opacity (light).
5. **Backdrop Blur:** Frosted glass filters (`backdrop-blur-md` or `backdrop-blur-xl`) for floating headers and command bars.

## 5. Layout Typography Rules
- Pair bold display headlines with crisp tabular numbers (`font-mono font-bold`) for metrics.
- Keep body paragraph line lengths between 45–75 characters (`max-w-prose` or `max-w-2xl`).
- Maintain consistent spacing using the 8pt rhythm: `p-3`, `p-4`, `p-6`, `gap-3`, `gap-6`.
