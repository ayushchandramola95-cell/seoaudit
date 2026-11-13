---
name: aceternity-magic-patterns
description: >-
  Use this skill whenever building modern visual effects, animated gradient borders,
  background beams, radar sweeps, meteor streaks, or grid/dot texture underlays
  inspired by Aceternity UI and Magic UI.
---

# Aceternity & Magic UI Component Patterns

This skill provides production recipes for high-impact modern web aesthetics, glowing border lights, and ambient background animations.

## 1. Moving Border Gradient Beams
Add animated light rays that travel continuously around the perimeter of card containers:
- Use an outer container with `relative overflow-hidden p-[1px] rounded-3xl`.
- Position an absolute element inside with a conic gradient running on an infinite rotation:
  `background: conic-gradient(from 0deg, transparent 0 340deg, #3b82f6 360deg)`
- Animate with `@keyframes spin { to { transform: rotate(360deg); } }` (duration: 3–6s linear infinite).
- Place an inner card with solid background (`bg-slate-900` or `bg-white`) over it to reveal only the 1px luminous edge.

## 2. Dynamic Radial Grid / Dot Mesh Underlays
Create subtle tactical depth under hero and dashboard sections:
- Base pattern:
  `background-image: radial-gradient(rgba(148, 163, 184, 0.15) 1px, transparent 1px);`
  `background-size: 24px 24px;`
- Vignette Mask: Always apply a radial mask so the pattern softly dissipates toward the edges:
  `mask-image: radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%);`

## 3. Shimmering Text & Moving Highlights
For high-impact badges and section titles:
- Apply a linear gradient with a moving highlight stop:
  `background: linear-gradient(110deg, #94a3b8 45%, #ffffff 55%, #94a3b8 65%);`
  `background-size: 200% 100%;`
  `-webkit-background-clip: text;`
  `-webkit-text-fill-color: transparent;`
- Animate `background-position: -200% 0` to `200% 0` over 3s.

## 4. Glowing Radar & Beacon Sweeps
For real-time crawlers, active scans, and live monitoring indicators:
- Animate expanding concentric rings:
  `animate-ping` with `opacity-75` on an outer ring while the inner core remains solid.
- Dual-ring wave: Delay the second ring by 750ms (`animation-delay: 750ms`) for a continuous pulse effect.

## 5. Ambient Cursor Spotlight
- Track relative mouse position inside the card bounding box.
- Apply a dynamic radial gradient on an absolute overlay:
  `background: radial-gradient(500px circle at ${x}px ${y}px, rgba(59, 130, 246, 0.12), transparent 40%)`
- Run strictly on GPU composited layers (`opacity`, `transform`) without triggering layout reflow.

