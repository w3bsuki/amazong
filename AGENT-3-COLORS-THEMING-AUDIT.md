# AGENT-3: Colors & Theming Audit

> **Parallel Agent** - Run alongside AGENT-1 and AGENT-2 after AGENT-0 completes.
> **Scope**: Colors, semantic tokens, borders, shadows, dark mode, gradients ONLY
> **Do NOT touch**: Typography (font sizes, weights), Spacing (gaps, padding, margins)

---

## Mission

Audit and fix ALL color/theming inconsistencies across the codebase:
1. Replace hardcoded colors with semantic tokens
2. Eliminate ALL gradients (flat marketplace UI)
3. Standardize shadow usage (minimal)
4. Ensure dark mode parity
5. Fix border radius consistency

---

## MCP Tools Available

- **Playwright MCP**: Visual regression testing, dark mode screenshots
- **Context7 MCP**: Look up Tailwind CSS v4 theming best practices, OKLCH color space

### Context7 MCP Usage

```
// Query theming best practices
context7.search("Tailwind CSS v4 semantic color tokens")
context7.search("OKLCH color space best practices")
context7.search("shadcn/ui dark mode patterns")
context7.search("flat UI design marketplace")
```

### Playwright MCP Usage

```javascript
// Light mode screenshot
await page.goto('/sell');
await page.screenshot({ path: 'sell-light.png', fullPage: true });

// Dark mode screenshot
await page.evaluate(() => document.documentElement.classList.add('dark'));
await page.screenshot({ path: 'sell-dark.png', fullPage: true });
```

---

## Color Token Reference

### Background Colors (ONLY use these)

| Token | Use Case |
|-------|----------|
| `bg-background` | Page background |
| `bg-card` | Card/surface backgrounds |
| `bg-muted` | Muted surface (sections) |
| `bg-muted/50` | Subtle muted surface |
| `bg-primary` | Primary brand surface |
| `bg-secondary` | Secondary surface |
| `bg-accent` | Hover/active states |
| `bg-destructive` | Error/danger states |

### Text Colors (ONLY use these)

| Token | Use Case |
|-------|----------|
| `text-foreground` | Primary text |
| `text-muted-foreground` | Secondary/meta text |
| `text-primary` | Brand-colored text |
| `text-primary-foreground` | Text on primary bg |
| `text-destructive` | Error text |
| `text-price-sale` | Sale price |
| `text-price-regular` | Regular price |

### Border Colors (ONLY use these)

| Token | Use Case |
|-------|----------|
| `border-border` | Default border |
| `border-input` | Input borders |
| `border-ring` | Focus rings |
| `border-destructive` | Error borders |

### CTA Colors

| Token | Use Case |
|-------|----------|
| `bg-cta-trust-blue` | Primary CTA buttons |
| `bg-cta-trust-blue-hover` | CTA hover state |
| `text-cta-trust-blue-text` | Text on CTA (white) |
| `bg-cta-primary` | Alternative primary CTA |
| `bg-cta-secondary` | Secondary CTA |

---

## Phase 1: Gradient Elimination (CRITICAL - 30 min)

### NO GRADIENTS ALLOWED

This is a **non-negotiable rule**. All gradients must be replaced with solid colors.

### Current Gradient Violations (from scan report)

| File | Violations |
|------|------------|
| `app/[locale]/(main)/wishlist/_components/wishlist-page-client.tsx` | 3 |
| `components/ui/toast.tsx` | 3 |
| `app/[locale]/(main)/page.tsx` | 1 |
| `app/[locale]/(main)/wishlist/shared/[token]/page.tsx` | 1 |
| `app/[locale]/(main)/wishlist/[token]/page.tsx` | 1 |
| `app/[locale]/(sell)/_components/layouts/desktop-layout.tsx` | 1 |
| `components/layout/cookie-consent.tsx` | 1 |
| `components/sections/start-selling-banner.tsx` | 1 |
| `components/shared/filters/mobile-filters.tsx` | 1 |

**Total: 13 gradients to fix**

### Gradient Replacement Strategy

```tsx
// ❌ BAD - gradient
className="bg-gradient-to-r from-blue-500 to-blue-600"

// ✅ GOOD - solid semantic token
className="bg-cta-trust-blue"

// ❌ BAD - gradient overlay
className="bg-gradient-to-t from-black/50 to-transparent"

// ✅ GOOD - solid overlay (if needed)
className="bg-black/50"
// or no overlay at all (prefer)
```

### Run This to Find Gradients

```bash
grep -r "gradient" --include="*.tsx" app/ components/
grep -r "from-" --include="*.tsx" app/ components/ | grep -E "(from|to|via)-"
```

---

## Phase 2: Hardcoded Color Elimination (45 min)

### Find Hardcoded Colors

```bash
# Find Tailwind palette colors (should use tokens instead)
grep -rE "(bg|text|border)-(red|blue|green|yellow|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink|rose)-\d+" --include="*.tsx" app/ components/

# Find arbitrary hex colors
grep -rE "(bg|text|border)-\[#" --include="*.tsx" app/ components/

# Find hardcoded oklch
grep -rE "oklch\(" --include="*.tsx" app/ components/
```

### Top Offenders (from scan report)

Files with arbitrary color values:

| File | Hex Values |
|------|-----------|
| `app/[locale]/(business)/_components/business-notifications.tsx` | 1 |

### Color Replacement Table

| Hardcoded | Replace With |
|-----------|-------------|
| `bg-blue-500` | `bg-primary` or `bg-cta-trust-blue` |
| `bg-gray-100` | `bg-muted` |
| `bg-gray-50` | `bg-muted/50` |
| `bg-white` | `bg-background` or `bg-card` |
| `bg-black` | `bg-foreground` (rarely needed) |
| `text-gray-500` | `text-muted-foreground` |
| `text-gray-900` | `text-foreground` |
| `text-blue-600` | `text-primary` |
| `text-red-500` | `text-destructive` |
| `text-green-500` | `text-success` |
| `border-gray-200` | `border-border` |
| `border-gray-300` | `border-border` |

### Exception: `text-white` on Solid CTA

```tsx
// ✅ ALLOWED - text-white on known solid CTA background
<Button className="bg-cta-trust-blue text-white">
  Buy Now
</Button>

// ✅ ALLOWED - subtle overlays on CTA surfaces
<div className="bg-cta-trust-blue">
  <div className="bg-white/10 border-white/20">
    Pill on CTA
  </div>
</div>
```

---

## Phase 3: Shadow Audit (20 min)

### Shadow Scale (Flat Marketplace UI)

| Token | Value | Use Case |
|-------|-------|----------|
| `shadow-none` | none | **Default for cards** |
| `shadow-sm` | subtle | Hover states, dropdowns |
| `shadow-md` | light | Modals, popovers |
| `shadow-dropdown` | custom | Dropdown menus |
| `shadow-modal` | custom | Modals |

### NEVER USE

- ❌ `shadow-lg`
- ❌ `shadow-xl`
- ❌ `shadow-2xl`
- ❌ Heavy custom shadows

### Find Shadow Violations

```bash
grep -rE "shadow-(lg|xl|2xl)" --include="*.tsx" app/ components/
grep -rE "shadow-\[" --include="*.tsx" app/ components/
```

### Standard Card Shadow Pattern

```tsx
// Default card - no shadow
<div className="rounded-md border bg-card">
  {content}
</div>

// Card with hover shadow (desktop only)
<div className="rounded-md border bg-card lg:hover:shadow-sm">
  {content}
</div>

// Dropdown/popover
<div className="rounded-md border bg-popover shadow-dropdown">
  {content}
</div>

// Modal
<div className="rounded-lg border bg-background shadow-modal">
  {content}
</div>
```

---

## Phase 4: Border Radius Audit (20 min)

### Radius Scale (eBay-style sharp)

| Token | Size | Use Case |
|-------|------|----------|
| `rounded-none` | 0px | None |
| `rounded-sm` | 2px | Badges, pills |
| `rounded-md` | 4px | **Cards, inputs (MAX for cards)** |
| `rounded-lg` | 6px | Modals only |
| `rounded-full` | 9999px | Pills, avatars |

### NEVER USE ON CARDS

- ❌ `rounded-xl` (too round for marketplace)
- ❌ `rounded-2xl`
- ❌ `rounded-3xl`

### Find Radius Violations

```bash
grep -rE "rounded-(xl|2xl|3xl)" --include="*.tsx" app/ components/
```

### Standard Radius Patterns

```tsx
// Card
<div className="rounded-md border bg-card">

// Badge
<span className="rounded-sm bg-primary text-2xs">

// Avatar
<Avatar className="rounded-full">

// Button
<Button className="rounded-md">

// Modal
<DialogContent className="rounded-lg">

// Pill/tag
<span className="rounded-full px-2 py-0.5">
```

---

## Phase 5: Dark Mode Verification (30 min)

### Test Dark Mode Parity

For each page, verify both light and dark modes look correct:

```javascript
// Playwright test pattern
test('dark mode parity', async ({ page }) => {
  await page.goto('/sell');
  
  // Light mode
  await page.screenshot({ path: 'sell-light.png' });
  
  // Dark mode
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await page.screenshot({ path: 'sell-dark.png' });
});
```

### Common Dark Mode Issues

1. **Missing dark variant** - Component only styled for light mode
2. **Hardcoded colors** - `bg-white` instead of `bg-background`
3. **Poor contrast** - Text not visible on dark background
4. **Missing hover states** - Hover colors don't adapt

### Fix Pattern

```tsx
// ❌ BAD - hardcoded, no dark mode
className="bg-white text-gray-900"

// ✅ GOOD - semantic tokens adapt automatically
className="bg-background text-foreground"

// ❌ BAD - hardcoded dark variant
className="bg-white dark:bg-gray-800"

// ✅ GOOD - token handles both
className="bg-card"
```

---

## Phase 6: Priority Pages Color Audit (45 min)

### High Priority Routes

1. **`/sell`** - Form backgrounds, input styling
2. **`/account`** - Stats cards, section backgrounds
3. **`/plans`** - Pricing cards, badges
4. **`/product/[slug]`** - Price colors, badges
5. **`/cart`** - Price totals, buttons

### What to Look For in Each Page

- [ ] All backgrounds use semantic tokens
- [ ] All text uses semantic tokens
- [ ] All borders use `border-border`
- [ ] CTA buttons use `bg-cta-trust-blue`
- [ ] Sale prices use `text-price-sale`
- [ ] No gradients
- [ ] No heavy shadows
- [ ] Dark mode works correctly

---

## Phase 7: Component Library Audit (30 min)

### Files to Check

```
components/ui/button.tsx      # CTA colors
components/ui/badge.tsx       # Badge variants
components/ui/card.tsx        # Card styling
components/ui/input.tsx       # Input borders
components/ui/toast.tsx       # Toast colors (HAS GRADIENTS!)
components/ui/dialog.tsx      # Modal styling
components/ui/dropdown-menu.tsx # Dropdown styling
```

### Badge Color Variants

```tsx
// Standard badges (should all use tokens)
variant="default"     → bg-primary text-primary-foreground
variant="secondary"   → bg-secondary text-secondary-foreground
variant="destructive" → bg-destructive text-destructive-foreground
variant="outline"     → border-border text-foreground
variant="deal"        → bg-deal text-white
variant="condition"   → bg-badge-condition-bg text-badge-condition-text
variant="shipping"    → bg-badge-shipping-bg text-badge-shipping-text
```

---

## Verification Checklist

After each file edit, verify:

- [ ] No gradients (`bg-gradient-*`, `from-*`, `to-*`, `via-*`)
- [ ] No Tailwind palette colors (`bg-blue-500`, `text-gray-500`, etc.)
- [ ] No arbitrary hex colors (`bg-[#fff]`, `text-[#333]`)
- [ ] No hardcoded oklch values in className
- [ ] No `shadow-lg` or heavier
- [ ] No `rounded-xl` or larger on cards
- [ ] Dark mode works (semantic tokens used)
- [ ] CTA buttons use proper token

### Run Gates

```bash
# Typecheck
pnpm -s exec tsc -p tsconfig.json --noEmit

# Run scan scripts
pnpm -s exec node scripts/scan-tailwind-palette.mjs
pnpm -s exec node scripts/scan-tailwind-arbitrary.mjs

# Visual check
pnpm test:e2e:smoke
```

---

## Files to NOT Touch

These are handled by other agents:

- ❌ Typography (`text-sm`, `text-lg`, `font-medium`) - AGENT-1
- ❌ Spacing (`gap-*`, `p-*`, `m-*`, `space-y-*`) - AGENT-2
- ❌ Layout (`grid`, `flex`, `container`) - AGENT-2

---

## Commit Strategy

Make small, focused commits:

```bash
git commit -m "fix(colors): eliminate gradients from toast component"
git commit -m "fix(colors): replace hardcoded colors in /sell"
git commit -m "fix(colors): standardize shadows to flat design"
git commit -m "fix(colors): ensure dark mode parity on /account"
```

---

## Success Criteria

- [ ] Zero gradients in scan report
- [ ] Zero Tailwind palette colors in scan report
- [ ] Zero arbitrary hex colors
- [ ] All cards use `shadow-none` or `shadow-sm` max
- [ ] All cards use `rounded-md` max
- [ ] Dark mode works on all pages
- [ ] All CTAs use `bg-cta-trust-blue`
- [ ] All prices use `text-price-*` tokens
- [ ] Typecheck passes
- [ ] Visual regression acceptable (both light and dark)
