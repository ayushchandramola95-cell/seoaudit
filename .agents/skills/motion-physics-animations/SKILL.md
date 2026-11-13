---
name: motion-physics-animations
description: >-
  Use this skill whenever adding animations, transitions, micro-interactions,
  layout morphing, or gesture tracking to web components. Replaces robotic linear
  easings with natural physical spring dynamics and 60fps GPU acceleration.
---

# Motion Physics & Animation Directives

This skill guides the design and implementation of fluid, physically grounded animations that feel like a native macOS or iOS application.

## 1. Spring Dynamics over Linear Easing
Never use robotic linear or basic `ease-in-out` transitions for interactive layout shifts.
- **Default Spring Parameters:**
  - `stiffness`: 260–350 (responsive, fast initial acceleration).
  - `damping`: 20–28 (subtle natural settle without excessive oscillation).
  - `mass`: 0.7–0.9 (snappy, lightweight feel).
- **CSS Spring Approximation:**
  - `cubic-bezier(0.16, 1, 0.3, 1)` for snappy entrance curves.
  - `cubic-bezier(0.175, 0.885, 0.32, 1.275)` for overshoot micro-springs.

## 2. Shared Layout Continuity (`layoutId`)
When an active tab, segment pill, or nav indicator changes selection:
- Use Framer Motion's `layoutId="active-indicator"` or dynamic translation transforms so the highlight pill physically glides across the bar rather than disappearing and reappearing abruptly.

## 3. Staggered Entrance Cascades
- When revealing lists, tables, or bento grids, apply sequential entrance delays:
  - `staggerChildren`: 0.03–0.05s (30–50 milliseconds).
  - Initial state: `opacity: 0, y: 10–14`.
  - Target state: `opacity: 1, y: 0`.
- Fast exits: Exit animations must execute 30% faster than entrance animations (150–200ms) so user flow is never blocked.

## 4. Tactile Micro-Interactions
- **Button Press:** `active:scale-[0.98]` with a snappy 100ms duration.
- **Card Hover:** Subtle upward float `hover:-translate-y-0.5` combined with an illuminated rim border.
- **Toggle Switches:** Spring glide with micro-overshoot on toggle activation.

## 5. 60 FPS GPU Acceleration Rules
- Only animate properties that the GPU compositor handles without layout reflow: `transform` (translate, scale, rotate) and `opacity`.
- Never animate `width`, `height`, `top`, `left`, `margin`, or `padding` directly during real-time hover or drag interactions.
- Apply `will-change: transform, opacity` cautiously on complex animated cards to inform the browser compositor.

## 6. Accessibility & Reduced Motion
Always respect user vestibular sensitivity:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
In Framer Motion:
```tsx
const shouldReduceMotion = useReducedMotion();
const transition = shouldReduceMotion ? { duration: 0 } : springTransition;
```

