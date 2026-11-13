---
name: interactive-3d-tilt-haptics
description: >-
  Use this skill whenever adding interactive 3D perspective card tilting,
  magnetic button attraction, tactile glare reflections, or subtle floating physics.
---

# Interactive 3D Tilt & Tactile Physics Directives

This skill introduces spatial depth and interactive 3D physics to cards, buttons, and showcase components.

## 1. 3D Perspective Card Tilt
On mouse movement over featured cards:
- Compute cursor offset from card center:
  `const rect = card.getBoundingClientRect();`
  `const x = (e.clientX - rect.left) / rect.width - 0.5;`
  `const y = (e.clientY - rect.top) / rect.height - 0.5;`
- Apply 3D perspective transform:
  `transform: perspective(1000px) rotateX(${ -y * maxTilt }deg) rotateY(${ x * maxTilt }deg) scale3d(1.02, 1.02, 1.02);`
- Keep `maxTilt` subtle (between 6° and 12°) to maintain elegance and prevent disorientation.
- Smooth return: When `onMouseLeave`, animate back to `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)` with a 500ms spring curve.

## 2. Dynamic Specular Glare Reflection
- Complement the 3D tilt with a moving specular highlight:
  - An absolute overlay with:
    `background: radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255, 255, 255, 0.15), transparent 60%);`
  - Creates the physical impression of a frosted glass or metallic surface catching ambient overhead light.

## 3. Magnetic Button Attraction
For primary CTAs (e.g. "Run Audit", "Analyze Website"):
- When cursor is within 40px radius of the button, pull the button slightly toward the cursor position:
  `transform: translate(${offsetX * 0.25}px, ${offsetY * 0.25}px);`
- Gives high-intent buttons a magnetic, responsive physical presence.

## 4. Subtle Ambient Floating Physics
For decorative badges, status beacons, and illustration cards:
- Animate a smooth, non-intrusive floating loop:
  `@keyframes floatSlow { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }`
- Duration: 4s–6s with `easeInOutSine` to keep motion gentle and backgrounded.
