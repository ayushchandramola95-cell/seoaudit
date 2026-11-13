---
name: data-viz-engineering
description: >-
  Use this skill whenever rendering SVG charts, sparklines, metric gauges,
  or trajectory curves to ensure smooth monotone cubic Bezier curves,
  magnetic tooltips, and deterministic data visualization.
---

# Data Visualization & Chart Engineering Directives

This skill enforces high-precision, lightweight mathematical visualizations without bulky, slow third-party chart libraries.

## 1. Monotone Cubic Spline Smoothing
Never connect discrete time-series points with jagged, sharp polylines.
- Use cubic Bezier curve interpolation: `d="M x0 y0 C cp1x cp1y, cp2x cp2y, x1 y1 ..."`
- Control tangents so intermediate control points never overshoot peak values (monotonicity guarantee).

## 2. Gradient Area Fill
- Fill areas beneath trajectories with vertical linear gradients that transition from 15–20% accent color at the peak to 0% transparency at the baseline.
- Keep the boundary line crisp (`stroke-width="2.5"` or `3`) with rounded caps (`strokeLinecap="round"` and `strokeLinejoin="round"`).

## 3. Magnetic Hover Snapping & Crosshairs
- Track `onMouseMove` along the chart bounding box.
- Snap a vertical hairline indicator (`stroke-dasharray="3 3"`) and highlight circle (`r="4.5"`) directly to the closest discrete data index.
- Display a floating pill tooltip showing pinpoint values, month labels, and percentage changes.

## 4. Animated Entrance Path
- Animate the initial appearance using SVG path properties:
  `strokeDasharray={pathLength}`
  `strokeDashoffset={isLoaded ? 0 : pathLength}`
  `transition="stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)"`

## 5. Tabular Monospace Alignment
- All metric labels and axes tick marks must use `font-mono tabular-nums` to ensure numbers do not wobble horizontally as values increment.

