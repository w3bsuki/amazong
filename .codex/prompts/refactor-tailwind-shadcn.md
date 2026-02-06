# Codex Prompt: Refactor Tailwind v4 + shadcn/ui Token Violations

## Context

You are working on **Treido**, a Next.js 16 App Router e-commerce marketplace.  
Stack: Tailwind CSS v4, shadcn/ui, OKLCH color tokens.  
Theme SSOT: `app/globals.css` (all CSS variables + `@theme inline` + `@theme` blocks).

## Your Mission

Eliminate **all token opacity hacks** and **arbitrary values** from the codebase.  
The project already has 0 palette violations and 0 gradient violations — this is the final cleanup pass.

---

## Rules (NON-NEGOTIABLE)

1. **No palette classes** — never use `bg-gray-*`, `text-blue-*`, etc.
2. **No gradients** — no `bg-gradient-*`, `from-*`, `to-*`.
3. **No arbitrary values** — no `w-[500px]`, `text-[13px]`, `p-[18px]`, etc. Use the spacing/text scale.
4. **No token opacity hacks** — never use `bg-primary/10`, `text-muted-foreground/50`, etc.
   - Exception: `bg-background/95`, `border-border/30` are allowed for glass/hairline effects only.
   - Exception: `outline-ring/50` is the official shadcn/ui pattern (used in `@layer base { * { @apply border-border outline-ring/50; } }`) — do NOT touch this.
5. **Semantic tokens only** — use tokens from `app/globals.css`.
6. **No `dark:` prefix** — semantic tokens auto-switch via `.dark` class on root.
7. **All user-facing copy must stay in `next-intl`** (`messages/en.json` + `messages/bg.json`).
8. **Default to Server Components** — `"use client"` only when required.

---

## What to Fix

### 1. Token Opacity Hacks (93 violations across 45 files)

**Pattern to find:** `(bg|text|border|ring)-TOKEN/OPACITY` where OPACITY is a number.

**How to fix each one:**

| Violation Pattern | Replacement Strategy |
|---|---|
| `text-muted-foreground/50` | Use `text-muted-foreground` (full opacity) or create a new semantic token if the distinction is meaningful |
| `text-muted-foreground/30` | Use `text-muted-foreground` with `opacity-30` as utility, OR better: just use `text-muted-foreground` if the opacity was decorative |
| `text-muted-foreground/40` | Same as above — most of these are unnecessary opacity variations |
| `text-muted-foreground/60` | `text-muted-foreground` (the base token is already muted) |
| `text-muted-foreground/70` | `text-muted-foreground` |
| `bg-primary-foreground/10` | `bg-hover` or `bg-selected` or `bg-muted` |
| `bg-primary-foreground/20` | `bg-hover` or `bg-muted` |
| `border-primary-foreground/20` | `border-border` or `border-border-subtle` |
| `text-primary-foreground/50` | `text-muted-foreground` |
| `text-primary-foreground/70` | `text-foreground` or `text-muted-foreground` |
| `text-primary-foreground/80` | `text-foreground` |
| `text-primary-foreground/90` | `text-foreground` |
| `bg-deal/5` | `bg-destructive-subtle` |
| `bg-deal/10` | `bg-destructive-subtle` |
| `border-deal/20` | `border-destructive` or `border-border` |
| `bg-muted-foreground/40` | `bg-muted` |
| `bg-muted-foreground/50` | `bg-muted` |
| `border-muted-foreground/25` | `border-border` or `border-border-subtle` |
| `border-muted-foreground/30` | `border-border` |
| `border-muted-foreground/40` | `border-border` |
| `text-sidebar-foreground/60` | `text-sidebar-muted-foreground` |
| `text-sidebar-foreground/70` | `text-sidebar-muted-foreground` |
| `bg-surface-floating/20` | `bg-surface-overlay` or `bg-overlay-dark` |
| `bg-surface-floating/90` | `bg-surface-floating` |
| `text-destructive-foreground/70` | `text-destructive-foreground` |
| `text-secondary-foreground/70` | `text-muted-foreground` |

**Decision heuristic:** If the opacity hack is for "making text lighter," replace with `text-muted-foreground`. If it's for "making a background tinted," replace with `bg-hover`, `bg-selected`, `bg-muted`, or `bg-primary-subtle`/`bg-destructive-subtle`.

### 2. Arbitrary Values (11 violations across 7 files)

**Files:**
- `app/[locale]/(sell)/_components/layouts/desktop-layout.tsx` — 2 arbitrary
- `app/[locale]/(sell)/_components/ui/sell-section-skeleton.tsx` — 2 arbitrary
- `components/layout/desktop-shell.tsx` — 2 arbitrary
- `components/ui/alert.tsx` — 2 arbitrary
- `app/[locale]/(account)/account/billing/billing-content.tsx` — 1 arbitrary
- `components/layout/desktop-shell.server.tsx` — 1 arbitrary
- `components/shared/wishlist/wishlist-drawer.tsx` — 1 arbitrary

**How to fix:** Replace arbitrary values with the nearest Tailwind spacing/sizing scale value, or use a design token from `app/globals.css`. For layout values, check if there's already a `--layout-*` or `--spacing-*` token defined.

---

## Available Semantic Tokens (from globals.css)

### Color Tokens (use these as Tailwind classes)
```
bg-background, bg-foreground, bg-card, bg-popover, bg-primary, bg-secondary,
bg-muted, bg-accent, bg-destructive, bg-hover, bg-active, bg-selected,
bg-primary-subtle, bg-destructive-subtle, bg-success-subtle,
bg-surface-page, bg-surface-subtle, bg-surface-card, bg-surface-elevated,
bg-surface-gallery, bg-surface-overlay, bg-surface-floating, bg-surface-glass,
bg-overlay-dark, bg-overlay-light

text-foreground, text-muted-foreground, text-primary, text-primary-foreground,
text-secondary-foreground, text-destructive, text-destructive-foreground,
text-overlay-text, text-overlay-text-muted

border-border, border-border-subtle, border-input, border-selected-border,
border-hover-border
```

### Interactive States (use instead of opacity hacks)
```
bg-hover          — hover background
bg-active         — active/pressed background  
bg-selected       — selected item background
border-selected-border — selected item border
border-hover-border    — hover border
```

### Subtle Backgrounds (use instead of primary/10 or destructive/5)
```
bg-primary-subtle      — light primary tint
bg-destructive-subtle  — light destructive tint
bg-success-subtle      — light success tint
```

---

## Scan Scripts

After making changes, validate with:
```bash
node scripts/scan-tailwind-palette.mjs
```
This generates reports in `cleanup/`. Target: 0 violations in all reports.

## Approach

1. Read `app/globals.css` to understand all available tokens.
2. Run `node scripts/scan-tailwind-palette.mjs` to get current violation counts.
3. Fix files one by one, starting with highest violation counts.
4. For each file:
   - Read the file to understand context
   - Replace violations with semantic tokens
   - Ensure visual intent is preserved (lighter text → muted-foreground, tinted bg → subtle/hover/muted)
5. After all fixes, re-run the scan to confirm 0 violations.
6. Run `pnpm exec tsc -p tsconfig.json --noEmit` to verify no type errors.

## Files to Fix (sorted by violation count)

### Token Opacity Hacks (top offenders first):
1. `components/shared/design-system/design-system-client.tsx` — 6 violations
2. `app/[locale]/(main)/(legal)/_components/legal-page-layout.tsx` — 4
3. `app/[locale]/(main)/(support)/security/page.tsx` — 4
4. `app/[locale]/(main)/about/_components/about-page-content.tsx` — 4
5. `app/[locale]/(main)/members/_components/members-page-client.tsx` — 4
6. `components/layout/cookie-consent.tsx` — 4
7. `app/[locale]/(account)/account/selling/edit/edit-product-client.tsx` — 3
8. `app/[locale]/(account)/account/selling/selling-products-list.tsx` — 3
9. `app/[locale]/(auth)/_components/welcome-client.tsx` — 3
10. `app/[locale]/(business)/_components/products-table.tsx` — 3
11. `app/[locale]/(chat)/_components/chat-interface.tsx` — 3
12. `app/[locale]/(main)/(legal)/returns/page.tsx` — 3
13. `app/[locale]/(main)/(support)/contact/page.tsx` — 3
14. `app/[locale]/(main)/(support)/feedback/page.tsx` — 3
15. `app/[locale]/(sell)/_components/steps/step-details.tsx` — 3
16. `components/support/support-chat-widget.tsx` — 3
17. `app/[locale]/(account)/account/billing/billing-content.tsx` — 2
18. `app/[locale]/(business)/_components/product-form-modal.tsx` — 2
19. `app/[locale]/(main)/cart/_components/cart-page-client.tsx` — 2
20. `app/[locale]/(sell)/_components/fields/description-field.tsx` — 2
21. `app/[locale]/(sell)/_components/ui/category-modal/index.tsx` — 2
22. `app/[locale]/(sell)/_components/ui/checklist-sidebar.tsx` — 2
23. `app/[locale]/(sell)/_components/ui/progress-header.tsx` — 2
24. `components/mobile/product/mobile-gallery.tsx` — 2
25. `app/[locale]/(account)/account/(settings)/notifications/notifications-content.tsx` — 1
26. `app/[locale]/(account)/account/orders/_components/account-orders-grid.tsx` — 1
27. `app/[locale]/(account)/account/orders/_components/account-orders-toolbar.tsx` — 1
28. `app/[locale]/(account)/account/payments/payments-content.tsx` — 1
29. `app/[locale]/(account)/account/wishlist/_components/account-wishlist-toolbar.tsx` — 1
30. `app/[locale]/(account)/account/_components/account-recent-activity.tsx` — 1
31. `app/[locale]/(account)/account/_components/account-stats-cards.tsx` — 1
32. `app/[locale]/(auth)/auth/error/page.tsx` — 1
33. `app/[locale]/(auth)/auth/sign-up-success/sign-up-success-client.tsx` — 1
34. `app/[locale]/(main)/about/_components/about-page-skeleton.tsx` — 1
35. `app/[locale]/(main)/categories/page.tsx` — 1
36. `app/[locale]/(sell)/_components/ai/ai-listing-assistant.tsx` — 1
37. `app/[locale]/(sell)/_components/fields/attributes-field.tsx` — 1
38. `app/[locale]/(sell)/_components/fields/title-field.tsx` — 1
39. `app/[locale]/(sell)/_components/ui/upload-zone.tsx` — 1
40. `components/category/category-breadcrumb-trail.tsx` — 1
41. `components/desktop/desktop-search.tsx` — 1
42. `components/dropdowns/wishlist-dropdown.tsx` — 1
43. `components/layout/header/cart/cart-dropdown.tsx` — 1
44. `components/layout/header/cart/mobile-cart-dropdown.tsx` — 1
45. `components/layout/sidebar/sidebar.tsx` — 1

### Arbitrary Values (7 files):
1. `app/[locale]/(sell)/_components/layouts/desktop-layout.tsx` — 2
2. `app/[locale]/(sell)/_components/ui/sell-section-skeleton.tsx` — 2
3. `components/layout/desktop-shell.tsx` — 2
4. `components/ui/alert.tsx` — 2
5. `app/[locale]/(account)/account/billing/billing-content.tsx` — 1
6. `components/layout/desktop-shell.server.tsx` — 1
7. `components/shared/wishlist/wishlist-drawer.tsx` — 1

## Important: Visual Preservation

When replacing opacity hacks, always consider the visual context:
- On a **white/light background**: `bg-primary-foreground/10` → `bg-hover` or `bg-muted`
- On a **primary/dark background**: `text-primary-foreground/80` → `text-primary-foreground` (keep full white)
- For **disabled/placeholder text**: `text-muted-foreground/50` → `text-muted-foreground`
- For **decorative borders**: `border-muted-foreground/30` → `border-border-subtle`
- For **section backgrounds on hero/primary bg**: `bg-primary-foreground/10` → use a dedicated token or `bg-muted`

The goal is **visual near-equivalence** — users should not notice a difference, but the code uses proper semantic tokens.
