---
name: a11y-wcag-accessibility
description: >-
  Use this skill to ensure high visual craft never compromises accessibility,
  enforcing WCAG AAA color contrast, keyboard focus traps, screen reader landmarks,
  and ARIA live announcements.
---

# Accessibility & WCAG Directives

This skill ensures that all interfaces are universally operable, accessible to screen readers, and fully compliant with international web standards.

## 1. Contrast Ratios (WCAG 2.1 AA & AAA)
- **Normal Text (under 18pt / 24px):** Minimum 4.5:1 contrast against its background.
- **Large Text (18pt+ bold or 24px+):** Minimum 3.0:1 contrast.
- **Interactive Controls & Focused Borders:** Minimum 3.0:1 contrast against adjacent colors.
- Never use low-contrast pale gray text on white (e.g. avoid `text-slate-400` for body copy; use `text-slate-600` or `text-slate-700`).

## 2. Keyboard Focus Trap & Navigation
- All interactive elements must be focusable using `Tab` and navigable via keyboard.
- Modals, drawers, and command palettes must trap focus inside the dialog while open.
- Hitting `Escape` must immediately dismiss active popups, menus, and drawers.
- Focus outlines must never be hidden with `outline: none` without providing:
  `focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2`

## 3. Screen Reader Landmarks & Live Regions
- All icon-only buttons (close, copy, search, menu toggle) must include:
  `aria-label="Descriptive action"` AND/OR `<span className="sr-only">Label</span>`
- Asynchronous updates (e.g. audit progress, copy confirmation, filter changes) must be wrapped in:
  `aria-live="polite"` or `role="status"`

## 4. Semantic Hierarchy
- Strictly follow single-H1 per page rules, followed by sequential H2 and H3 tags. Never skip heading levels for visual styling alone.
- Wrap main content areas in `<main>`, global header in `<header>`, navigation links in `<nav>`, and side panels in `<aside>`.

