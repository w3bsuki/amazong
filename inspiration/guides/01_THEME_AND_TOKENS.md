# 01. Theme & Tokens (Tailwind v4 + OKLCH)

**Role:** Design Systems Engineer
**Context:** Migrating to a modern, high-density, technical aesthetic using Tailwind CSS v4 and OKLCH colors.

## 1. The Core Philosophy: "Technical Density"
*   **Color Space:** Strict **OKLCH**. It offers better perceptual uniformity than HSL.
*   **Geometry:** **Tight.** Radius is minimal (4px-6px). Gaps are small (4px-8px).
*   **Density:** Information density is high. Reduce padding, reduce whitespace.

## 2. Tailwind v4 Configuration (`app/globals.css`)

We define the theme directly in CSS using OKLCH variables.

```css
@import "tailwindcss";
@plugin "tailwindcss-animate";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  /* 
     COLOR PALETTE: OKLCH
     Format: Lightness Chroma Hue 
  */
  
  /* BACKGROUNDS */
  --background: 1 0 0;             /* Pure White */
  --foreground: 0.20 0.02 286;     /* Deep Zinc (Almost Black) */

  /* CARDS (Flat, Technical) */
  --card: 1 0 0;
  --card-foreground: 0.20 0.02 286;
  
  /* POPOVERS */
  --popover: 1 0 0;
  --popover-foreground: 0.20 0.02 286;

  /* SECONDARY / MUTED (The Framework) */
  --primary: 0.20 0.02 286;        /* Deep Zinc */
  --primary-foreground: 0.98 0 0;  /* White */

  --secondary: 0.96 0.003 286;     /* Light Zinc (Zinc 100 equiv) */
  --secondary-foreground: 0.20 0.02 286;

  --muted: 0.96 0.003 286;         /* Light Zinc */
  --muted-foreground: 0.55 0.01 286; /* Mid Zinc (Zinc 500 equiv) */

  --accent: 0.96 0.003 286;        /* Hover States */
  --accent-foreground: 0.20 0.02 286;

  /* BORDERS & RINGS */
  --border: 0.92 0.005 286;        /* Zinc 200 equiv */
  --input: 0.92 0.005 286;
  --ring: 0.20 0.02 286;

  /* RADIUS (Tight / Technical) */
  --radius: 0.375rem;              /* 6px (Default) */
}

@theme {
  /* Semantic Color Mapping using OKLCH */
  --color-background: oklch(var(--background));
  --color-foreground: oklch(var(--foreground));
  
  --color-card: oklch(var(--card));
  --color-card-foreground: oklch(var(--card-foreground));
  
  --color-popover: oklch(var(--popover));
  --color-popover-foreground: oklch(var(--popover-foreground));
  
  --color-primary: oklch(var(--primary));
  --color-primary-foreground: oklch(var(--primary-foreground));
  
  --color-secondary: oklch(var(--secondary));
  --color-secondary-foreground: oklch(var(--secondary-foreground));
  
  --color-muted: oklch(var(--muted));
  --color-muted-foreground: oklch(var(--muted-foreground));
  
  --color-accent: oklch(var(--accent));
  --color-accent-foreground: oklch(var(--accent-foreground));
  
  --color-border: oklch(var(--border));
  --color-input: oklch(var(--input));
  --color-ring: oklch(var(--ring));

  /* TIGHT RADIUS SYSTEM */
  --radius-lg: var(--radius);            /* 6px */
  --radius-md: calc(var(--radius) - 2px); /* 4px */
  --radius-sm: calc(var(--radius) - 4px); /* 2px */
  
  /* Safe Areas */
  --spacing-safe-top: env(safe-area-inset-top);
  --spacing-safe-bottom: env(safe-area-inset-bottom);
}
```

## 3. Usage Rules (High Density)

1.  **Tight Spacing:** 
    *   Use `gap-1` (4px) or `gap-2` (8px) for related items. 
    *   Avoid `gap-4` or `gap-6` inside cards.
2.  **Micro-Borders:**
    *   Components should feel "assembled". Use `border-border` extensively.
    *   Use `h-full border-r` to separate horizontal items.
3.  **Typography:**
    *   Headings: `tracking-tight` (tight letter spacing).
    *   Labels: `text-xs font-medium text-muted-foreground`.
