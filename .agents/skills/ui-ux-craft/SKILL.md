---
name: ui-ux-craft
description: >-
  Use this skill to audit and implement pixel-perfect component ergonomics,
  complete 5-state interactive coverage, modern bento grids, glassmorphism,
  and zero-layout-shift (CLS=0) loading states.
---

# UI/UX Craft & Component Ergonomics

This skill enforces high-end interaction craft, eliminating broken hover states, layout shifts, and unfinished UI components.

## 1. The 5-State Rule
Every interactive component (buttons, cards, links, select menus, input boxes) MUST explicitly handle all five states:
1. **Default:** Well-balanced resting appearance.
2. **Hover:** Clear feedback via brightness elevation, rim illumination, or cursor change (`cursor-pointer`).
3. **Focus-Visible:** High-contrast, unambiguous keyboard focus ring (`focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`).
4. **Active:** Tactile physical depression on mousedown/tap (`active:scale-[0.98]`).
5. **Disabled:** Visually distinguishable reduced opacity (`disabled:opacity-50 disabled:cursor-not-allowed`) paired with a tooltip or banner explaining why it is disabled.

## 2. Zero Cumulative Layout Shift (CLS = 0)
- **Loading Skeletons:** Skeleton shimmers must exactly match the height, width, and border-radius of the final loaded component.
- **Image & Chart Placeholders:** Always declare explicit aspect ratios (`aspect-video`, `aspect-square`, or fixed heights like `h-48`) so incoming data or media never causes jarring jumps.

## 3. Asymmetrical Bento Grid Design
- Structure feature sets, metrics, and intelligence dashboards into multi-span bento boxes (12-column CSS Grid).
- Avoid uniform, uninspired 3x1 cards. Mix:
  - 8-column hero visualizer + 4-column KPI card.
  - 4-column quick trigger + 4-column live stream + 4-column status gauge.
- Embed interactive mini-engines inside cards (live sparklines, status beacons, terminal logs, or pill switchers) rather than static prose.

## 4. Cursor Spotlights & Dynamic Lighting
- For cards on dark or tinted surfaces:
  - Track mouse coordinates relative to the card container:
    `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`
  - Keeps interfaces feeling tactile and responsive to user presence without blocking clicks.

## 5. Micro-Feedback & Error Recovery
- Never leave a user hanging after an action:
  - Immediate optimistic state update.
  - Micro-toast notification upon clipboard copy or settings save.
  - Contextual retry triggers on network failure instead of generic dead-end errors.

