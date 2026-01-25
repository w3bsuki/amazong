# Design System V2: "Twitter-Perfect"

This design system aims to replace the legacy styling with a unified, high-performance, and visually perfect system based on:
- **Tailwind CSS v4**: CSS-first configuration, native variables.
- **Shadcn UI**: Component patterns.
- **Twitter/X Aesthetics**: Clean, high-contrast, "Chirp"-like typography, and specific blue accents.
- **Marketplace Optimized**: Designed to beat eBay/Amazon in readability and trust.

## Structure

```
/design-system2
  /tokens
    colors.css        // Primitive OKLCH palettes and Semantic mappings
    typography.css    // Font families, weights, tracking
    layout.css        // Spacing, containers, radius
    effects.css       // Shadows, blurs, animations
  /components         // Reference implementations (shadcn v4)
  theme.css           // Main entry point importing all tokens
```

## Core Principles

1.  **Neutral Supremacy**: Backgrounds and surfaces are pure neutral or slightly cool grays. No mud.
2.  **Twitter Blue Primary**: Uses the specific `oklch(0.62 0.19 243)` (approx #1D9BF0) for primary actions.
3.  **Optical Perfection**: Spacing and radius are tuned for density and clarity.
4.  **Dark Mode First**: Tokens are defined with dark mode in mind, ensuring perfect contrast.

## Components

### Badges
We have introduced a robust badge system using OKLCH functional colors.

**Seller Badges:**
- `Business Seller`: Info variant
- `Verified`: Success variant
- `New Seller`: Warning variant

**Category Badges:**
- `Fashion`: Pink/Rose theme
- `Electronics`: Cyan/Tech theme
- `Automotive`: Industrial/Orange theme

All use the base `Badge` component with specific semantic variants.

## Usage

Import `design-system2/theme.css` in your root layout or main CSS file.
