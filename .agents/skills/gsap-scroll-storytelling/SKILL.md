---
name: gsap-scroll-storytelling
description: >-
  Use this skill whenever orchestrating scroll-triggered reveals, pinned section
  storytelling, sticky stacking cards, horizontal scrub sequences, or parallax
  depth across landing pages and deep-dive reports.
---

# Scroll Storytelling & Choreography Directives

This skill guides the construction of scroll-driven narratives, pinned feature walkthroughs, and responsive viewport scrubbing inspired by Apple and Linear.

## 1. Pinned Sticky Storytelling
For multi-step feature walkthroughs (e.g. Crawl -> Parse -> Score -> Alert):
- Use a `h-[300vh]` parent container with a `sticky top-20 h-[80vh]` inner viewport.
- As the user scrolls through the 300vh track:
  - Step 1 (0%–33%): Display engine step 1, dim others to 20% opacity.
  - Step 2 (33%–66%): Slide in step 2 graphic, highlight step 2 metrics.
  - Step 3 (66%–100%): Complete sequence with full report summary.

## 2. Sticky Stacking Cards
Cards that smoothly stack on top of each other as the user scrolls down:
- Apply `sticky top-24`, `sticky top-28`, `sticky top-32` with incremental scale downs (`scale-[0.96]`, `scale-[0.98]`, `scale-100`).
- Each subsequent card covers the previous card with a crisp sub-pixel shadow, creating tactile physical depth.

## 3. Scrubbed Progress & Viewport Triggers
- Progress Trackers: A slim 2px top indicator bar that scales horizontally (`transform: scaleX(progress)`) pinned to the top of the viewport.
- IntersectionObserver Reveal:
  - Threshold: `0.15` (triggers when 15% of the section enters the viewport).
  - Reveal transform: `translateY(24px) scale(0.98) opacity(0)` -> `translateY(0) scale(1) opacity(1)`.
  - Duration: `600ms` with `cubic-bezier(0.16, 1, 0.3, 1)`.

## 4. Horizontal Scrub Sections
For showcasing horizontal comparison sets or multi-domain matrices:
- Map vertical scroll distance to horizontal translation:
  `transform: translateX(-${scrollProgress * (totalWidth - viewportWidth)}px)`.
- Keeps user in natural vertical scrolling flow while unveiling horizontal panoramic content.

## 5. Performance Safeguards
- Always use `requestAnimationFrame` or CSS transforms for scroll-bound calculations.
- Never measure DOM geometry (`offsetHeight`, `offsetTop`) inside an active scroll listener without caching.
