# 01. Theme & Tokens (Tailwind v4 + OKLCH)

**Role:** Design Systems Engineer
**Context:** This is the **Source of Truth** for the application design system. 

## 1. Global CSS (app/globals.css)

In Tailwind v4, we use `@theme` directive.

**Copy this exactly into your `app/globals.css`:**

```css
@import "tailwindcss";

@plugin "tailwindcss-animate";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  /* 
     COLOR PALETTE: OKLCH (Zinc-based Technical)
     L = Lightness, C = Chroma, H = Hue
  */
  
  /* Backgrounds */
  --background: 100% 0 0;              /* White */
  --foreground: 21.6% 0.006 270;       /* Zinc 950 */

  /* Surface Structure */
  --card: 100% 0 0;                    /* White */
  --card-foreground: 21.6% 0.006 270;  /* Zinc 950 */
  --popover: 100% 0 0;
  --popover-foreground: 21.6% 0.006 270;

  /* Brand / Interaction */
  --primary: 21.6% 0.006 270;          /* Zinc 950 (Black-ish) */
  --primary-foreground: 98.5% 0 0;     /* Zinc 50 */

  --secondary: 96.8% 0.001 270;        /* Zinc 50 */
  --secondary-foreground: 21.6% 0.006 270;

  --muted: 96.8% 0.001 270;            /* Zinc 50 */
  --muted-foreground: 55.2% 0.015 270; /* Zinc 500 */

  --accent: 96.8% 0.001 270;           /* Zinc 50 (Hover) */
  --accent-foreground: 21.6% 0.006 270;

  /* Boundaries */
  --border: 92.5% 0.004 270;           /* Zinc 200 */
  --input: 92.5% 0.004 270;            /* Zinc 200 */
  --ring: 21.6% 0.006 270;

  /* Geometry - The "Technical" Radius */
  --radius: 0.375rem; /* 6px - The Sweet Spot */
}

@theme {
  /* 1. Map CSS Variables to Tailwind Utility Classes */
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

  /* 2. Radius Configuration */
  --radius-lg: var(--radius);            /* 6px */
  --radius-md: calc(var(--radius) - 2px); /* 4px */
  --radius-sm: calc(var(--radius) - 4px); /* 2px */
  
  /* 3. Safe Area Spacing */
  --spacing-safe-top: env(safe-area-inset-top);
  --spacing-safe-bottom: env(safe-area-inset-bottom);
  
  /* 4. Font Settings */
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
}

/* 
   UTILITIES
   "Native Feel" adjustments
*/
@layer utilities {
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .tap-highlight-transparent {
    -webkit-tap-highlight-color: transparent;
  }
}
```