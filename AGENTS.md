<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# SeoSeite Frontend Design & UI/UX Agent Rules

Whenever designing, modifying, styling, or adding components, sections, charts, or animations to this project, ALWAYS adhere to the installed project skills in `.agents/skills/`:

1. **`frontend-design` (Anti-Slop & Visual Direction):**
   - No generic purple-to-blue linear gradients on buttons or text.
   - No predictable 3-box feature grids with floating centered emojis.
   - Maintain a high-density, authoritative FinTech/DevTools aesthetic (obsidian/slate canvas, sub-pixel 1px rim borders, tabular monospace data).
   - Enforce the 60-30-10 color rule with a single high-voltage accent (Electric Blue `#2563EB` or Emerald `#10B981`).

2. **`motion-physics-animations` (Physical Springs & 60fps GPU Performance):**
   - Use physical spring transitions (`stiffness: 260-350`, `damping: 20-28`, `mass: 0.8`) instead of robotic linear easings.
   - Shared layout morphing: Use `layoutId` for sliding active pills and tabs.
   - Staggered entrances (30-50ms cascading delays).
   - Only animate `transform` and `opacity`. Never animate layout reflow properties (`width`, `height`, `margin`, `padding`) during real-time hover/drag.
   - Always respect `@media (prefers-reduced-motion)`.

3. **`aceternity-magic-patterns` (Glowing Beams, Radar & Mesh Textures):**
   - Rotating conic gradient borders (1px beam rays traveling around card perimeters).
   - Subtle dot/grid mesh background textures with radial vignette fade masks.
   - Shimmering highlight text sweeps and expanding concentric radar sweeps for active crawlers.
   - Cursor spotlight illumination overlays running at 60 FPS on GPU compositor.

4. **`gsap-scroll-storytelling` (Scroll Choreography & Section Pacing):**
   - Pinned sticky container choreography for multi-step feature walkthroughs.
   - Sticky stacking cards with progressive scaling depth (`scale-[0.96]`, `scale-[0.98]`, `scale-100`).
   - Scrubbed progress indicators and IntersectionObserver reveals with staggered entry.

5. **`kinetic-typography-motion` (Rolling Counters & Blur Cascades):**
   - Rolling odometer count-up animations for scores (0 -> 98/100) and traffic counts with Out-Quart easing.
   - Word-by-word staggered reveal cascades with blur removal (`filter: blur(8px) -> blur(0)`).
   - Dynamic 3-color linear gradient text sweeps on marquee headlines.
   - Typewriter character streams for live crawler and FastMCP terminal outputs.

6. **`interactive-3d-tilt-haptics` (Spatial Depth & Card Glare):**
   - 3D perspective card tilt on cursor movement (`perspective(1000px) rotateX(...) rotateY(...) scale3d(1.02)`).
   - Dynamic specular glare light overlay catching ambient light as the card tilts.
   - Magnetic button pull toward the cursor when hovering within a 40px radius.
   - Gentle ambient floating physics for illustration badges.

7. **`ui-ux-craft` (5-State Rule & Bento Architecture):**
   - Every interactive element must define `default`, `hover`, `focus-visible`, `active` (scale-98), and `disabled`.
   - Zero Cumulative Layout Shift (CLS=0) using identical-dimension skeleton shimmers.
   - Group complex interfaces into asymmetrical bento grids with embedded mini-engines (live sparklines, status gauges, telemetry streams).

8. **`data-viz-engineering` (Smooth Splines & Deterministic Curves):**
   - Interpolate time-series charts with smooth monotone cubic Bezier curves (`M ... C ...`).
   - Area gradient underlays with vertical fade.
   - Magnetic hover guidelines and pinpoint tooltips snapping to closest data points.

9. **`a11y-wcag-accessibility` (Universal Inclusivity):**
   - Contrast ratio minimum: 4.5:1 text, 3:1 interactive controls.
   - Custom visible focus rings: `focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2`.
   - Descriptive `aria-label` on all icon-only buttons and `aria-live="polite"` on async audit completions.
