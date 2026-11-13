# SeoSeite Project & UI/UX Guidelines for Antigravity

This repository houses **SeoSeite** (SEO Audit Intel), an enterprise-grade technical SEO intelligence platform built with Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4, Lucide icons, and PostgreSQL.

## Core Frontend & Animation Directives

Whenever creating or editing UI components, pages, charts, or interactive flows, you MUST adhere to the workspace skills defined in `.agents/skills/`:

### 1. `frontend-design` (Anti-Slop Directives)
- Avoid generic AI defaults: No unmotivated floating pill buttons, no centered purple/blue gradients, and no generic 3-box emoji card grids.
- Emphasize high-density domain craftsmanship: Sharp 1px sub-pixel rim borders (`border-white/10` or `border-slate-200/90`), monospace tabular data (`font-mono font-bold`), clean status beacons, and authoritative visual hierarchy.
- Maintain the 60-30-10 palette balance with a single high-voltage accent.

### 2. `motion-physics-animations` (Fluid Dynamics)
- Replace rigid linear easing with physical spring dynamics (`stiffness: 260-350`, `damping: 20-28`).
- Animate active indicator pills across tabs using shared layout continuity (`layoutId`).
- Use staggered entrance cascades (30-50ms delays) and tactile active depression (`active:scale-[0.98]`).
- Run all animations strictly on GPU-composited properties (`transform`, `opacity`).
- Respect `prefers-reduced-motion`.

### 3. `ui-ux-craft` (Component Completeness & Bento Architecture)
- Enforce the **5-State Rule** on every interactive component: `default`, `hover`, `focus-visible`, `active`, and `disabled`.
- Zero-CLS skeleton shimmers matching the exact height and line layout of incoming data.
- Asymmetrical bento grid compositions with embedded living mini-engines (live sparklines, status beams, interactive controls).

### 4. `data-viz-engineering` (Mathematical Splines)
- Render charts using monotone cubic Bezier curves rather than jagged polylines.
- Magnetic hover crosshairs that snap to nearest discrete points with floating metric tooltips.
- Tabular monospace numeric alignment for numbers, latency metrics, and percentages.

### 5. `a11y-wcag-accessibility` (Universal Standards)
- Minimum contrast ratio 4.5:1 for body copy and 3.0:1 for UI controls.
- Explicit focus rings: `focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2`.
- `aria-label` on icon-only buttons and `aria-live="polite"` for asynchronous updates.
