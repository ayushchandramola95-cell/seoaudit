<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# SeoSeite Frontend Design & UI/UX Agent Rules

Whenever designing, modifying, styling, or adding components, pages, or animations to this project, ALWAYS adhere to the installed project skills (`.agents/skills/`):

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

3. **`ui-ux-craft` (5-State Rule & Bento Architecture):**
   - Every interactive element must define `default`, `hover`, `focus-visible`, `active` (scale-98), and `disabled`.
   - Zero Cumulative Layout Shift (CLS=0) using identical-dimension skeleton shimmers.
   - Group complex interfaces into asymmetrical bento grids with embedded mini-engines (live sparklines, status gauges, telemetry streams).

4. **`data-viz-engineering` (Smooth Splines & Deterministic Curves):**
   - Interpolate time-series charts with smooth monotone cubic Bezier curves (`M ... C ...`).
   - Area gradient underlays with vertical fade.
   - Magnetic hover guidelines and pinpoint tooltips snapping to closest data points.

5. **`a11y-wcag-accessibility` (Universal Inclusivity):**
   - Contrast ratio minimum: 4.5:1 text, 3:1 interactive controls.
   - Custom visible focus rings: `focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2`.
   - Descriptive `aria-label` on all icon-only buttons and `aria-live="polite"` on async audit completions.
