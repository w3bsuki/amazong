# AMZN Design System — Master Reference

> **Last Updated:** 2025-12-29  
> **Tech Stack:** shadcn/ui + Tailwind CSS v4 + OKLCH  
> **Compliance:** WCAG 2.2 Level AA  
> **Type:** C2C/B2B Marketplace

---

## 📚 Documentation Structure

This design system is split into **platform-specific guides** for optimal implementation:

| Document | Purpose | When to Use |
|----------|---------|-------------|
| [MOBILE_DESIGN_SYSTEM.md](./MOBILE_DESIGN_SYSTEM.md) | Mobile-first patterns, touch targets, gestures | Building/refactoring mobile UI |
| [DESKTOP_DESIGN_SYSTEM.md](./DESKTOP_DESIGN_SYSTEM.md) | Dense marketplace patterns, keyboard nav | Building/refactoring desktop UI |
| **This document** | Shared foundations, WCAG 2.2 compliance | Cross-platform decisions |

---

## 🎯 Core Philosophy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   "Dense, trustworthy, accessible commerce"                                 │
│                                                                             │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐    │
│   │  DENSITY    │   │   TRUST     │   │ ACCESSIBILITY│   │ PERFORMANCE │    │
│   │             │   │             │   │              │   │             │    │
│   │ Max info    │   │ Clear       │   │ WCAG 2.2 AA │   │ <100ms      │    │
│   │ per pixel   │   │ pricing     │   │ compliant    │   │ interactions│    │
│   │             │   │ & signals   │   │              │   │             │    │
│   └─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🆕 WCAG 2.2 Compliance (December 2024)

WCAG 2.2 is the **newest accessibility standard** (W3C Recommendation 12 December 2024). We target **Level AA** with select AAA enhancements.

### New Success Criteria We Must Meet

#### Level A (Must Have)

| Criterion | Impact | Our Implementation |
|-----------|--------|-------------------|
| **3.2.6 Consistent Help** | Help in same spot | Help button in consistent header position |
| **3.3.7 Redundant Entry** | No duplicate input | Auto-fill from profile, "same as billing" |

#### Level AA (Required for Compliance)

| Criterion | Impact | Our Implementation |
|-----------|--------|-------------------|
| **2.4.11 Focus Not Obscured (Min)** | Visible focus | Scroll margins on focus, z-index management |
| **2.5.7 Dragging Movements** | Alt for drag | All swipe actions have button alternatives |
| **2.5.8 Target Size (Minimum)** | Touch targets ≥24px | 36px standard, 24px min with spacing |
| **3.3.8 Accessible Auth (Min)** | Auth without memory | Password managers, no paste blocking |

#### Level AAA (We Implement Selectively)

| Criterion | Impact | Our Implementation |
|-----------|--------|-------------------|
| **2.4.12 Focus Not Obscured (Enhanced)** | No part of focus hidden | Sticky elements never overlap focused element |
| **2.4.13 Focus Appearance** | 2px thick, 3:1 contrast | Custom focus ring in globals.css |
| **3.3.9 Accessible Auth (Enhanced)** | No object recognition | No CAPTCHA, use password managers only |

### Key Changes from WCAG 2.1

```
┌────────────────────────────────────────────────────────────────────┐
│  WCAG 2.1 (2018) → WCAG 2.2 (2024)                                │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ❌ OLD: 44×44px touch targets (WCAG 2.1 AAA)                      │
│  ✅ NEW: 24×24px minimum OR proper spacing (WCAG 2.2 AA)           │
│                                                                    │
│  This enables DENSE marketplace UIs while staying accessible!      │
│                                                                    │
│  ❌ OLD: No requirements for drag alternatives                     │
│  ✅ NEW: All drag operations need single-pointer alternatives      │
│                                                                    │
│  ❌ OLD: No focus obscuring requirements                           │
│  ✅ NEW: Focused elements must not be hidden by sticky content     │
│                                                                    │
│  ❌ OLD: Parsing criterion (4.1.1)                                  │
│  ✅ NEW: Removed (obsolete - browsers handle this)                  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Shared Foundations

### Tailwind CSS v4 Integration

We use **Tailwind CSS v4** with the new CSS-first configuration:

```css
/* app/globals.css - Tailwind v4 structure */

@import "tailwindcss";           /* Core Tailwind */
@plugin "tailwindcss-animate";   /* Animation plugin */

@custom-variant dark (&:is(.dark *));  /* Dark mode variant */

@theme {
  /* All design tokens defined here (not tailwind.config.js) */
  --color-brand: oklch(0.48 0.22 260);
  --spacing-touch: 2.25rem;
  /* ... see globals.css for full tokens */
}

@layer base {
  /* Reset and base styles */
}

@layer components {
  /* Reusable component patterns like .richtext */
}

@utility container {
  /* Custom utilities that Tailwind v4 can't do */
}
```

#### Key Tailwind v4 Differences

| Feature | v3 (Old) | v4 (Current) |
|---------|----------|--------------|
| Config | `tailwind.config.js` | `@theme {}` in CSS |
| Plugins | JS imports | `@plugin` directive |
| Dark mode | `dark:` prefix | `@custom-variant` |
| Custom utils | `@layer utilities` | `@utility name {}` |
| Theme extend | `extend: {}` | Direct in `@theme` |

### shadcn/ui Integration

We use shadcn/ui as our component foundation with custom marketplace variants:

```tsx
// components.json defines our aliases and styles
{
  "style": "new-york",
  "tailwind": {
    "cssVariables": true,
    "config": ""  // Empty - using CSS @theme
  },
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

#### Adding New shadcn Components

```bash
# Use the CLI (respects components.json)
npx shadcn@latest add button dialog card

# Components go to components/ui/
# Customize variants in the component file
```

### Color System (OKLCH)

We use **OKLCH** color space for all colors:

```css
/* Why OKLCH? */
/* ✅ Perceptually uniform (50% lightness looks 50% bright) */
/* ✅ Better contrast calculations */
/* ✅ P3 wide gamut support */
/* ✅ Smooth interpolation for gradients */

/* Primary Palette */
--color-brand: oklch(0.48 0.22 260);        /* Trust blue */
--color-brand-light: oklch(0.58 0.18 260);
--color-brand-dark: oklch(0.40 0.24 260);

/* Semantic Prices */
--color-price-sale: oklch(0.50 0.22 27);    /* Warm red - high urgency */
--color-price-original: oklch(0.55 0.01 250); /* Gray strikethrough */
--color-price-savings: oklch(0.50 0.18 145);  /* Green - positive */

/* Status */
--color-success: oklch(0.60 0.18 145);
--color-warning: oklch(0.75 0.16 85);
--color-error: oklch(0.55 0.25 27);
--color-info: oklch(0.55 0.18 250);
```

### Typography Scale

Both mobile and desktop share this type scale:

| Token | Size | Mobile Line Height | Desktop Line Height | Usage |
|-------|------|-------------------|---------------------|-------|
| `text-2xs` | 10px | 14px | 14px | Badges only |
| `text-xs` | 12px | 16px | 16px | Meta, captions |
| `text-sm` | 14px | 20px | 18px | Body text |
| `text-base` | 16px | 24px | 22px | Prices, emphasis |
| `text-lg` | 18px | 26px | 24px | Card titles |
| `text-xl` | 20px | 28px | 26px | Section headers |
| `text-2xl` | 24px | 32px | 30px | Page titles |

### Spacing (4px Grid)

```css
/* All spacing is multiples of 4px */
--spacing-0.5: 2px;   /* Micro */
--spacing-1: 4px;     /* Minimum gap */
--spacing-1.5: 6px;   /* Tight */
--spacing-2: 8px;     /* Standard tight */
--spacing-3: 12px;    /* Standard */
--spacing-4: 16px;    /* Default container padding */
--spacing-5: 20px;    /* Large gap */
--spacing-6: 24px;    /* Section */
--spacing-8: 32px;    /* Page section */
```

### Border Radius (eBay-Sharp Style)

```css
/* We use SHARP, minimal radius for professional marketplace feel */
--radius-none: 0;
--radius-sm: 2px;     /* Badges, small elements */
--radius-md: 4px;     /* Buttons, inputs */
--radius-lg: 6px;     /* Cards */
--radius-xl: 8px;     /* Modals, larger elements */
--radius-full: 9999px; /* Pills, avatars */

/* ❌ DON'T: Rounded corners like consumer apps (16px+) */
/* ✅ DO: Sharp, professional corners (2-8px) */
```

---

## 📐 Touch Target Comparison

| Element | WCAG 2.2 Minimum | Mobile Target | Desktop Target |
|---------|------------------|---------------|----------------|
| Primary CTA | 24×24px | 44px (`h-11`) | 36px (`h-9`) |
| Standard Button | 24×24px | 36px (`h-9`) | 32-36px (`h-8`/`h-9`) |
| Icon Button | 24×24px | 36px (`size-9`) | 32px (`size-8`) |
| Dense Button | 24×24px | 32px (`h-8`) | 28px (`h-7`) |
| Form Input | 24×24px | 40px (`h-10`) | 36px (`h-9`) |

### The Spacing Exception (WCAG 2.2)

Targets smaller than 24×24px are allowed if:
- A 24px diameter circle centered on each target doesn't overlap adjacent targets

```
✅ PASS: 20px buttons with 8px gap (28px center-to-center)
❌ FAIL: 20px buttons with 2px gap (22px center-to-center)
```

---

## 🧩 Shared Components (shadcn/ui)

We use shadcn/ui as our component foundation. Here are the key customizations:

### Button Variants

```tsx
// variants defined in components/ui/button.tsx
const buttonVariants = cva(
  // Base classes with WCAG 2.2 compliant focus ring
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Custom marketplace variants
        cta: "bg-cta-trust-blue text-cta-trust-blue-text hover:bg-cta-trust-blue-hover",
        deal: "bg-deal text-white hover:bg-deal/90",
      },
      size: {
        default: "h-9 px-4 py-2",      // 36px - WCAG 2.2 compliant
        sm: "h-8 px-3 text-xs",        // 32px - needs spacing
        lg: "h-10 px-6",               // 40px
        xl: "h-11 px-8",               // 44px (mobile CTA)
        icon: "size-9",                // 36px square
        "icon-sm": "size-8",           // 32px square
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### Focus Ring (WCAG 2.4.13 Compliant)

```css
/* In globals.css - meets Focus Appearance AAA */
:where(
  a, button, input, select, textarea, summary,
  [role="button"], [role="link"],
  [tabindex]:not([tabindex="-1"])
):focus-visible {
  outline: 2px solid var(--color-ring) !important;  /* ≥2px thick */
  outline-offset: 2px !important;                   /* Visible perimeter */
}

/* Focus ring must have 3:1 contrast with adjacent colors */
--color-ring: oklch(0.48 0.22 260);  /* Brand blue on white = 5.2:1 */
```

### Badge Variants

```tsx
// Marketplace-specific badges
const badgeVariants = {
  default: "bg-primary/10 text-primary",
  deal: "bg-deal text-white",
  shipping: "bg-shipping-free/10 text-shipping-free",
  verified: "bg-brand-muted text-brand",
  stock: "bg-stock-low/10 text-stock-low",
  "top-rated": "bg-top-rated/10 text-top-rated",
};
```

---

## 📱💻 Platform-Specific Guidelines

### Mobile-Only Patterns

See [MOBILE_DESIGN_SYSTEM.md](./MOBILE_DESIGN_SYSTEM.md):

- Bottom navigation bar
- Pull-to-refresh
- Swipe actions (with button alternatives)
- Bottom sheets
- Safe area handling
- Touch gesture optimization

### Desktop-Only Patterns

See [DESKTOP_DESIGN_SYSTEM.md](./DESKTOP_DESIGN_SYSTEM.md):

- Sidebar filters
- Mega menu navigation
- Hover interactions
- Keyboard shortcuts
- Dense data tables
- Multi-column grids

---

## 🚫 Anti-Patterns (Don't Do This)

```
┌─────────────────────────────────────────────────────────────────────┐
│  ❌ ANTI-PATTERNS TO AVOID                                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  TOUCH TARGETS                                                      │
│  ❌ Touch targets < 24px without proper spacing                     │
│  ❌ Drag-only interactions without button alternatives              │
│  ❌ Focus hidden by sticky headers/footers                          │
│                                                                     │
│  TYPOGRAPHY                                                         │
│  ❌ Body text smaller than 14px (text-sm)                           │
│  ❌ Input text < 16px on mobile (triggers iOS zoom)                 │
│  ❌ Arbitrary font sizes like text-[13px]                           │
│                                                                     │
│  COLORS                                                             │
│  ❌ Hardcoded hex values (#fff, #000)                                │
│  ❌ Contrast ratio < 4.5:1 for body text                            │
│  ❌ Color as the ONLY indicator (add icons/text)                    │
│                                                                     │
│  SPACING                                                            │
│  ❌ Inconsistent padding (px-2 then px-4)                           │
│  ❌ Gaps > 24px on mobile between related elements                  │
│  ❌ Non-4px-grid spacing values                                     │
│                                                                     │
│  SHADOWS                                                            │
│  ❌ Heavy shadows (shadow-lg, shadow-xl on cards)                   │
│  ❌ Shadows on interactive elements at rest                         │
│  ❌ Colored/glowing shadows                                         │
│                                                                     │
│  FORMS                                                              │
│  ❌ Blocking paste in password fields                               │
│  ❌ Missing autocomplete attributes                                 │
│  ❌ Asking for same data twice                                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## ✅ Accessibility Testing Checklist

### Automated Testing

```bash
# Run axe-core audit
npx @axe-core/cli http://localhost:3000

# Lighthouse accessibility
npx lighthouse http://localhost:3000 --only-categories=accessibility

# Pa11y for CI/CD
npx pa11y http://localhost:3000
```

### Manual Testing Checklist

- [ ] **Zoom:** Site usable at 200% zoom without horizontal scroll
- [ ] **Keyboard:** All interactive elements reachable with Tab
- [ ] **Focus:** Focus indicator visible with 3:1+ contrast
- [ ] **Screen reader:** VoiceOver/NVDA can navigate and announce
- [ ] **Motion:** `prefers-reduced-motion` respected
- [ ] **Contrast:** `prefers-contrast` high contrast mode works
- [ ] **Touch (mobile):** All targets easily tappable with thumb
- [ ] **Drag alternatives:** Every swipe/drag has a button option
- [ ] **Help:** Help mechanism in consistent location

### WCAG 2.2 Specific Tests

- [ ] **2.5.8:** Measure touch targets ≥ 24×24px or proper spacing
- [ ] **2.5.7:** Test all drag operations have alternatives
- [ ] **2.4.11:** Tab through with sticky elements visible
- [ ] **2.4.13 (AAA):** Focus ring ≥2px thick with 3:1 contrast ratio
- [ ] **3.2.6:** Verify help appears in same location across pages
- [ ] **3.3.7:** Check for auto-fill, no redundant entry
- [ ] **3.3.8:** Test password field allows paste

---

## 🎛️ User Preference Media Queries

Always respect user preferences via CSS media queries:

```css
/* Reduced Motion - disable animations */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}

/* High Contrast - increase contrast */
@media (prefers-contrast: more) {
  :root {
    --color-border: oklch(0.20 0 0);
    --color-muted-foreground: oklch(0.30 0 0);
  }
}

/* Reduced Transparency */
@media (prefers-reduced-transparency: reduce) {
  .backdrop-blur {
    backdrop-filter: none;
    background: var(--color-background);
  }
}

/* Color Scheme */
@media (prefers-color-scheme: dark) {
  :root:not(.light) {
    /* Auto dark mode if no manual override */
  }
}
```

### Implementation in React

```tsx
// Respect reduced motion in animations
import { useReducedMotion } from 'framer-motion';

const prefersReducedMotion = useReducedMotion();
const animation = prefersReducedMotion ? {} : { scale: 1.02 };
```

---

## 🔗 Quick Links

| Resource | Location |
|----------|----------|
| Mobile Design System | [docs/MOBILE_DESIGN_SYSTEM.md](./MOBILE_DESIGN_SYSTEM.md) |
| Desktop Design System | [docs/DESKTOP_DESIGN_SYSTEM.md](./DESKTOP_DESIGN_SYSTEM.md) |
| shadcn Components | [components/ui/](../components/ui/) |
| Theme Tokens | [app/globals.css](../app/globals.css) |
| WCAG 2.2 Spec | [w3.org/TR/WCAG22](https://www.w3.org/TR/WCAG22/) |
| Understanding WCAG 2.2 | [w3.org/WAI/WCAG22/Understanding](https://www.w3.org/WAI/WCAG22/Understanding/) |

---

## 📊 Design Token Summary

```css
/* Copy-paste quick reference */

/* Touch Targets */
--spacing-touch-xs: 1.75rem;   /* 28px */
--spacing-touch-sm: 2rem;      /* 32px */
--spacing-touch: 2.25rem;      /* 36px */
--spacing-touch-md: 2.5rem;    /* 40px */
--spacing-touch-lg: 2.75rem;   /* 44px */

/* Typography */
--text-2xs: 0.625rem;          /* 10px */
--text-xs: 0.75rem;            /* 12px */
--text-sm: 0.875rem;           /* 14px */
--text-base: 1rem;             /* 16px */
--text-lg: 1.125rem;           /* 18px */

/* Colors (OKLCH) */
--color-brand: oklch(0.48 0.22 260);
--color-price-sale: oklch(0.50 0.22 27);
--color-price-savings: oklch(0.50 0.18 145);
--color-success: oklch(0.60 0.18 145);
--color-error: oklch(0.55 0.25 27);

/* Shadows (Minimal) */
--shadow-sm: 0 1px 2px 0 hsl(0 0% 0% / 0.05);
--shadow-md: 0 2px 4px 0 hsl(0 0% 0% / 0.05);

/* Radius (Sharp) */
--radius-sm: 0.125rem;         /* 2px */
--radius-md: 0.25rem;          /* 4px */
--radius-lg: 0.375rem;         /* 6px */
```

---

*This document is the master design system reference. For platform-specific patterns, see the mobile and desktop documents.*

---

## 📋 WCAG 2.2 Full Compliance Matrix

For reference, here is the complete WCAG 2.2 Level AA checklist (all SCs we must meet):

### Principle 1: Perceivable

| SC | Name | Level | Notes |
|----|------|-------|-------|
| 1.1.1 | Non-text Content | A | All images have alt text |
| 1.2.1-5 | Time-based Media | A-AA | Captions, audio descriptions |
| 1.3.1-5 | Info & Relationships | A-AA | Semantic HTML, autocomplete |
| 1.4.1 | Use of Color | A | Never color-only indicators |
| 1.4.3 | Contrast (Minimum) | AA | 4.5:1 text, 3:1 large |
| 1.4.4 | Resize Text | AA | 200% zoom without loss |
| 1.4.5 | Images of Text | AA | Use real text |
| 1.4.10 | Reflow | AA | No horizontal scroll at 320px |
| 1.4.11 | Non-text Contrast | AA | 3:1 for UI components |
| 1.4.12 | Text Spacing | AA | Override-able spacing |
| 1.4.13 | Content on Hover/Focus | AA | Dismissible, hoverable |

### Principle 2: Operable

| SC | Name | Level | Notes |
|----|------|-------|-------|
| 2.1.1-2 | Keyboard | A | All functionality keyboard-accessible |
| 2.1.4 | Character Key Shortcuts | A | Can disable/remap |
| 2.2.1-2 | Timing | A | Adjustable, pause/stop |
| 2.3.1 | Three Flashes | A | No seizure-inducing content |
| 2.4.1-4 | Navigable | A | Skip links, page titles, focus order |
| 2.4.5-7 | Multiple Ways, Focus | AA | Multiple nav methods, visible focus |
| **2.4.11** | **Focus Not Obscured** | **AA** | **NEW in 2.2** |
| 2.5.1-4 | Pointer/Motion | A | Alternatives provided |
| **2.5.7** | **Dragging Movements** | **AA** | **NEW in 2.2** |
| **2.5.8** | **Target Size (Minimum)** | **AA** | **NEW in 2.2** |

### Principle 3: Understandable

| SC | Name | Level | Notes |
|----|------|-------|-------|
| 3.1.1-2 | Language | A-AA | `lang` attribute, language of parts |
| 3.2.1-4 | Predictable | A-AA | Consistent navigation |
| **3.2.6** | **Consistent Help** | **A** | **NEW in 2.2** |
| 3.3.1-4 | Input Assistance | A-AA | Error identification, suggestions |
| **3.3.7** | **Redundant Entry** | **A** | **NEW in 2.2** |
| **3.3.8** | **Accessible Authentication** | **AA** | **NEW in 2.2** |

### Principle 4: Robust

| SC | Name | Level | Notes |
|----|------|-------|-------|
| ~~4.1.1~~ | ~~Parsing~~ | - | **Removed in WCAG 2.2** |
| 4.1.2 | Name, Role, Value | A | ARIA, semantic HTML |
| 4.1.3 | Status Messages | AA | Live regions for updates |

---

*Last verified against W3C WCAG 2.2 Recommendation (12 December 2024)*
