---
name: kinetic-typography-motion
description: >-
  Use this skill whenever animating headlines, audit scores, rolling counter numbers,
  word-by-word reveal cascades, or gradient sweep typography.
---

# Kinetic Typography & Rolling Counter Directives

This skill controls text animation, rolling odometer numeric reveals, and fluid character transitions for high-impact metrics.

## 1. Rolling Odometer Number Counters
When displaying audit scores (e.g. 0 -> 98/100) or visitor volumes:
- Animate numbers using an easing step function rather than instant replacement:
  - Duration: 1200ms–1800ms.
  - Easing: Out-Quart `1 - Math.pow(1 - progress, 4)` so numbers rush forward quickly and decelerate smoothly as they reach the final score.
- Ensure all numbers use `font-mono tabular-nums` to prevent horizontal jitter during the animation count.

## 2. Word-by-Word Cascade with Blur Removal
For high-impact section headlines and executive summaries:
- Split sentence into individual word tokens.
- Wrap each word in a container with staggered entrance:
  - Initial: `opacity: 0, filter: blur(8px), transform: translateY(12px)`.
  - Target: `opacity: 1, filter: blur(0px), transform: translateY(0)`.
  - Stagger delay: `idx * 0.04s` (40ms per word).
  - Gives an elegant, high-end editorial focus effect rather than a harsh jump.

## 3. Dynamic Gradient Text Sweeps
For key brand phrases and flagship capabilities:
- Layer a multi-stop color gradient across the text:
  `background: linear-gradient(90deg, #2563eb, #7c3aed, #06b6d4, #2563eb);`
  `background-size: 300% 100%;`
  `-webkit-background-clip: text;`
  `-webkit-text-fill-color: transparent;`
- Animate `background-position` smoothly over 6s infinite loop.

## 4. Live Terminal Typewriter Streams
For crawler logs, MCP server responses, and technical audits:
- Append characters at 15–25ms intervals with a blinking cursor indicator (`inline-block w-1.5 h-4 bg-emerald-400 animate-pulse`).
- Auto-scroll terminal containers to the bottom (`scrollTop = scrollHeight`) as new lines arrive.

