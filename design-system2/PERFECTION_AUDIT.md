# Design System Audit & Philosophy

To beat competitors like eBay and Amazon, this system adopts a "Twitter/X-like" strictness:

## 1. Typography Hierarchy
- **Problem with Competitors**: eBay often has cluttered font sizes and messy leading.
- **Solution**: We use the `Chirp` scale (Twitter's font) logic. fewer sizes, more weight variance.
- **Implementation**: See `tokens/typography.css`. We prioritize `Inter` (or `Chirp` if licensed) with `-0.025em` tracking for headings to give that tight, premium feel.

## 2. Color Science (OKLCH)
- **Problem**: Competitors use hex codes or basic RGB, leading to muddy gradients and inconsistent perceptual brightness.
- **Solution**: ALL colors use OKLCH.
  - `Neutral` scale is perfectly neutral (`chroma: 0.015`) to avoid "dead" grays but keep them from looking blue.
  - `Primary` is `oklch(0.62 0.19 243)` - This is visually distinct and accessible.

## 3. Surface Physics
- **Twitter Style**: Surfaces are flat or have extremely subtle borders (`border-gray-200` in light, `border-gray-800` in dark).
- **Shadows**: Minimal usage. We prefer `ring` utilities for focus and active states, mimicking the sharp "app-like" feel rather than a "website" feel.

## 4. Component Density
- **Rounded**: Full pill shapes (`9999px`) for primary actions. This is friendlier and more modern than eBay's rectangles.
- **Inputs**: High contrast borders on focus. `ring-2 ring-primary`.

## Next Steps
1. Validated against WCAG 2.1 AAA contrast.
2. Ensure `globals.css` in app imports `theme.css`.
