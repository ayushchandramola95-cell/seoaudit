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

### 3. `aceternity-magic-patterns` (Glowing Beams, Radar & Mesh Textures)
- Rotating conic gradient borders (1px beam rays traveling around card perimeters).
- Subtle dot/grid mesh background textures with radial vignette fade masks.
- Shimmering highlight text sweeps and expanding concentric radar sweeps for active crawlers.
- Cursor spotlight illumination overlays running at 60 FPS on GPU compositor.

### 4. `gsap-scroll-storytelling` (Scroll Choreography & Section Pacing)
- Pinned sticky container choreography for multi-step feature walkthroughs.
- Sticky stacking cards with progressive scaling depth (`scale-[0.96]`, `scale-[0.98]`, `scale-100`).
- Scrubbed progress indicators and IntersectionObserver reveals with staggered entry.

### 5. `kinetic-typography-motion` (Rolling Counters & Blur Cascades)
- Rolling odometer count-up animations for scores (0 -> 98/100) and traffic counts with Out-Quart easing.
- Word-by-word staggered reveal cascades with blur removal (`filter: blur(8px) -> blur(0)`).
- Dynamic 3-color linear gradient text sweeps on marquee headlines.
- Typewriter character streams for live crawler and FastMCP terminal outputs.

### 6. `interactive-3d-tilt-haptics` (Spatial Depth & Card Glare)
- 3D perspective card tilt on cursor movement (`perspective(1000px) rotateX(...) rotateY(...) scale3d(1.02)`).
- Dynamic specular glare light overlay catching ambient light as the card tilts.
- Magnetic button pull toward the cursor when hovering within a 40px radius.
- Gentle ambient floating physics for illustration badges.

### 7. `ui-ux-craft` (Component Completeness & Bento Architecture)
- Enforce the **5-State Rule** on every interactive component: `default`, `hover`, `focus-visible`, `active`, and `disabled`.
- Zero-CLS skeleton shimmers matching the exact height and line layout of incoming data.
- Asymmetrical bento grid compositions with embedded living mini-engines (live sparklines, status beams, interactive controls).

### 8. `data-viz-engineering` (Mathematical Splines)
- Render charts using monotone cubic Bezier curves rather than jagged polylines.
- Magnetic hover crosshairs that snap to nearest discrete points with floating metric tooltips.
- Tabular monospace numeric alignment for numbers, latency metrics, and percentages.

### 9. `a11y-wcag-accessibility` (Universal Standards)
- Minimum contrast ratio 4.5:1 for body copy and 3.0:1 for UI controls.
- Explicit focus rings: `focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2`.
- `aria-label` on icon-only buttons and `aria-live="polite"` for asynchronous updates.
