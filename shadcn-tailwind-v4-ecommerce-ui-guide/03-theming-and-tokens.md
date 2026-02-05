# 03 — Theming & Tokens (stop shipping “white/gray everything”)

## Principles

1. **Everything uses semantic tokens**, not raw Tailwind palette values.
2. **Tokens live in CSS variables** (`:root` + `.dark`) so brand/theme changes are instant.
3. Tailwind v4 **maps tokens to utilities** using `@theme inline`.
4. shadcn components are designed for this approach (`bg-background`, `text-foreground`, etc).

---

## Required shadcn tokens (baseline)

shadcn’s recommended token set includes:

- `--background`, `--foreground`
- `--card`, `--card-foreground`
- `--popover`, `--popover-foreground`
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--muted`, `--muted-foreground`
- `--accent`, `--accent-foreground`
- `--destructive`, `--destructive-foreground`
- `--border`, `--input`, `--ring`
- optional: `--sidebar*`, `--chart-*`
- `--radius`

You can extend this with marketplace-specific semantics:
- `--success`, `--warning`, `--info`
- `--deal`, `--deal-foreground`
- `--brand`, `--brand-foreground`
- elevation shadows (`--app-shadow-*`)

---

## Recommended marketplace theme direction (native iOS-ish)

### Background & surfaces
- Use an **off-white** background, not pure white.
- Make “cards” true white (or close) to create iOS-like depth.

### Radius
- Increase radius slightly vs default shadcn.
- iOS-like cards feel best around 12–16px radius.

### Elevation
- Use a **soft multi-layer shadow** on cards.
- Use a stronger shadow only on overlays (sheets, drawers).

### Accent
- Pick one memorable brand hue:
  - warm orange works well for marketplace deals
  - blue works well for “trust” and B2B
- Use a distinct “deal” color for discounts/badges.

---

## Example: `globals.css` (Tailwind v4 + shadcn + marketplace tokens)

Adapt the file path to your project (`app/globals.css` or `src/styles/globals.css`).

```css
@import "tailwindcss";
@import "tw-animate-css";

/* Use class-based dark mode (so we can toggle) */
@custom-variant dark (&:is(.dark *));

:root {
  /* Shape */
  --radius: 0.875rem; /* ~14px (app-ish) */

  /* Core surfaces */
  --background: oklch(0.99 0.01 95); /* warm off-white */
  --foreground: oklch(0.18 0.01 95);

  --card: oklch(1 0 0);
  --card-foreground: var(--foreground);

  --popover: oklch(1 0 0);
  --popover-foreground: var(--foreground);

  /* Brand (example: marketplace orange) */
  --brand: oklch(0.78 0.17 58);
  --brand-foreground: oklch(0.2 0.02 95);

  /* shadcn semantic colors */
  --primary: var(--brand);
  --primary-foreground: var(--brand-foreground);

  --secondary: oklch(0.965 0.01 95);
  --secondary-foreground: oklch(0.22 0.01 95);

  --muted: oklch(0.965 0.01 95);
  --muted-foreground: oklch(0.56 0.02 95);

  --accent: oklch(0.965 0.01 95);
  --accent-foreground: oklch(0.22 0.01 95);

  --destructive: oklch(0.62 0.22 25);
  --destructive-foreground: oklch(0.98 0.01 25);

  --border: oklch(0.92 0.01 95);
  --input: oklch(0.92 0.01 95);
  --ring: oklch(0.78 0.17 58 / 60%);

  /* Extra marketplace semantics */
  --success: oklch(0.72 0.18 155);
  --success-foreground: oklch(0.16 0.05 155);

  --warning: oklch(0.84 0.16 84);
  --warning-foreground: oklch(0.28 0.07 46);

  --info: oklch(0.74 0.14 240);
  --info-foreground: oklch(0.16 0.04 240);

  /* iOS-ish elevation */
  --app-shadow-card: 0 1px 2px oklch(0 0 0 / 0.06),
                     0 10px 30px oklch(0 0 0 / 0.06);
  --app-shadow-float: 0 12px 40px oklch(0 0 0 / 0.14);

  /* Optional: sidebar tokens (if you use Sidebar component) */
  --sidebar: oklch(0.985 0.01 95);
  --sidebar-foreground: oklch(0.18 0.01 95);
  --sidebar-primary: var(--brand);
  --sidebar-primary-foreground: var(--brand-foreground);
  --sidebar-accent: oklch(0.965 0.01 95);
  --sidebar-accent-foreground: oklch(0.22 0.01 95);
  --sidebar-border: oklch(0.92 0.01 95);
  --sidebar-ring: oklch(0.78 0.17 58 / 60%);
}

.dark {
  --background: oklch(0.16 0.01 95);
  --foreground: oklch(0.98 0.01 95);

  --card: oklch(0.2 0.01 95);
  --card-foreground: var(--foreground);

  --popover: oklch(0.22 0.01 95);
  --popover-foreground: var(--foreground);

  --secondary: oklch(0.24 0.01 95);
  --secondary-foreground: var(--foreground);

  --muted: oklch(0.24 0.01 95);
  --muted-foreground: oklch(0.74 0.01 95);

  --accent: oklch(0.28 0.01 95);
  --accent-foreground: var(--foreground);

  --border: oklch(1 0 0 / 12%);
  --input: oklch(1 0 0 / 14%);
  --ring: oklch(0.78 0.17 58 / 55%);

  /* Shadows are usually less visible in dark mode */
  --app-shadow-card: 0 1px 2px oklch(0 0 0 / 0.25),
                     0 10px 30px oklch(0 0 0 / 0.25);
  --app-shadow-float: 0 12px 40px oklch(0 0 0 / 0.35);
}

/* Map CSS variables to Tailwind v4 theme variables */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);

  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);

  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);

  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);

  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);

  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);

  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);

  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);

  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  /* Extra semantic colors */
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);

  /* Elevation tokens (creates shadow-card, shadow-float utilities) */
  --shadow-card: var(--app-shadow-card);
  --shadow-float: var(--app-shadow-float);

  /* Radius ladder (creates rounded-sm/md/lg/xl utilities) */
  --radius-sm: calc(var(--radius) - 6px);
  --radius-md: calc(var(--radius) - 3px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 6px);

  /* Sidebar mapping (optional) */
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}
```

---

## How to add new semantic colors (pattern)

1) Add the CSS variables in `:root` + `.dark`
2) Map them via `@theme inline` using the `--color-*` namespace

Then you can use them like:

- `bg-warning text-warning-foreground`
- `bg-success text-success-foreground`

---

## “Good taste” checklist (prevents ugly UI)

- [ ] Background is not pure white; cards are clearly distinct.
- [ ] One brand hue is used consistently (primary).
- [ ] Deals/discounts have a distinct semantic token (`warning` or `deal`).
- [ ] Borders are subtle; rely on elevation, not 1px lines everywhere.
- [ ] Shadows are consistent (use `shadow-card` for cards).
- [ ] Radius is consistent (don’t mix 6px + 24px randomly).
- [ ] Text hierarchy is clear: title, price, meta, secondary.
