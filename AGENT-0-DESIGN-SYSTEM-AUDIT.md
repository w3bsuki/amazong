# AGENT-0: Design System Foundation Audit

> **Run this FIRST** before launching the parallel UI agents.
> This agent audits and documents the current design system state so Agents 1-3 have a clean baseline.

---

## Mission

Audit the Tailwind v4 + shadcn/ui design system to ensure:
1. All tokens are properly defined in `app/globals.css`
2. Dark mode has 100% token parity
3. Document any missing tokens that need to be added
4. Create a checklist for Agents 1-3 to reference

---

## MCP Tools Available

- **Playwright MCP**: Visual regression testing, screenshot comparisons
- **Context7 MCP**: Look up Tailwind CSS v4 best practices, shadcn/ui patterns

---

## Phase 1: Token Inventory (30 min)

### 1.1 Audit Current Token Categories

Open `app/globals.css` and document what exists:

```bash
# Verify the file structure
cat app/globals.css | head -500
```

**Checklist - Confirm these token families exist:**

- [ ] **Typography tokens**: `--text-tiny`, `--text-body`, `--text-price`, `--font-size-2xs`
- [ ] **Spacing tokens**: `--spacing-touch-*`, `--spacing-form`, `--spacing-section`
- [ ] **Container tokens**: `--container-*` (modal, dropdown, gallery widths)
- [ ] **Color tokens (shadcn)**: `--color-background`, `--color-foreground`, `--color-muted`, `--color-border`, `--color-ring`, `--color-primary`, `--color-destructive`
- [ ] **Color tokens (marketplace)**: `--color-cta-*`, `--color-header-*`, `--color-price-*`, `--color-deal-*`, `--color-stock-*`
- [ ] **Radius tokens**: `--radius-*` (none, xs, sm, md, lg, xl, 2xl, pill, full)
- [ ] **Shadow tokens**: `--shadow-*` (minimal/flat - no heavy shadows allowed)

### 1.2 Verify Dark Mode Parity

For each token in `@theme {}`, confirm there's a corresponding override in `.dark {}`:

```bash
# Count tokens in @theme vs .dark
grep -c "^  --color-" app/globals.css  # in @theme
grep -c "^  --color-" app/globals.css  # in .dark block
```

**Document any missing dark mode tokens here:**

```
Missing dark mode tokens:
- (list any gaps found)
```

---

## Phase 2: Gradient Elimination (20 min)

### 2.1 Find All Gradients

Run the scan script:

```bash
pnpm -s exec node scripts/scan-tailwind-palette.mjs
```

Or manually search:

```bash
grep -r "gradient" --include="*.tsx" app/ components/
grep -r "bg-gradient" --include="*.tsx" app/ components/
```

**Current gradient violations (from scan report):**

| File | Count |
|------|-------|
| `app/[locale]/(main)/wishlist/_components/wishlist-page-client.tsx` | 3 |
| `components/ui/toast.tsx` | 3 |
| `app/[locale]/(main)/page.tsx` | 1 |
| `app/[locale]/(main)/wishlist/shared/[token]/page.tsx` | 1 |
| `app/[locale]/(main)/wishlist/[token]/page.tsx` | 1 |
| `app/[locale]/(sell)/_components/layouts/desktop-layout.tsx` | 1 |
| `components/layout/cookie-consent.tsx` | 1 |
| `components/sections/start-selling-banner.tsx` | 1 |
| `components/shared/filters/mobile-filters.tsx` | 1 |

**Total: 13 gradient violations**

### 2.2 Gradient Replacement Strategy

Replace all gradients with solid semantic tokens:

```tsx
// ❌ BAD - gradient
className="bg-gradient-to-r from-blue-500 to-blue-600"

// ✅ GOOD - solid semantic token
className="bg-cta-trust-blue"
// or
className="bg-primary"
```

---

## Phase 3: Arbitrary Value Audit (30 min)

### 3.1 Find All Arbitrary Values

Run the scan:

```bash
pnpm -s exec node scripts/scan-tailwind-arbitrary.mjs
```

**Top offenders (from scan report):**

| File | Arbitrary Values |
|------|-----------------|
| `app/[locale]/(business)/_components/products-table.tsx` | 6 |
| `app/[locale]/(chat)/chat/loading.tsx` | 6 |
| `components/layout/sidebar/sidebar.tsx` | 6 |
| `components/pricing/plan-card.tsx` | 6 |
| `components/layout/sidebar/sidebar-menu.tsx` | 5 |
| `components/ui/drawer.tsx` | 5 |

**Total: 97 files, 189 arbitrary values**

### 3.2 Arbitrary Value Replacement Strategy

| Arbitrary | Replace With |
|-----------|-------------|
| `w-[560px]` | `w-(--container-modal)` or token |
| `h-[42px]` | `h-10` (40px) or `h-11` (44px) |
| `text-[13px]` | `text-sm` (14px) |
| `max-h-[300px]` | `max-h-(--spacing-scroll-md)` |
| `gap-[6px]` | `gap-1.5` |

---

## Phase 4: Document Missing Tokens (20 min)

### 4.1 Tokens to Add (if any gaps found)

Based on audit, add these to `@theme {}` in `app/globals.css`:

```css
@theme {
  /* === TRANSITION TOKENS (if missing) === */
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-instant: 50ms;
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
}
```

### 4.2 Update shadcn Components (if needed)

Check if any shadcn components need updates:

```bash
npx shadcn@latest diff
```

---

## Phase 5: Create Reference Sheet for Agents 1-3

### Typography Reference (for Agent-1)

```
Body text:     text-sm (14px)
Meta/caption:  text-xs (12px)
Tiny badges:   text-2xs (10px)
Prices:        text-base (16px) font-semibold
Page titles:   text-xl (20px)
Section titles: text-lg (18px)
```

### Spacing Reference (for Agent-2)

```
Mobile gap:    gap-2 (8px)
Desktop gap:   gap-3 (12px)
Card padding:  p-2 (mobile) / p-3 (desktop)
Section:       py-6 or py-8
Touch target:  min-h-touch (32px), min-h-touch-lg (36px)
```

### Color Reference (for Agent-3)

```
Background:    bg-background
Card:          bg-card
Text:          text-foreground
Muted text:    text-muted-foreground
Border:        border-border
Primary CTA:   bg-cta-trust-blue text-white
Sale price:    text-price-sale
Deal badge:    bg-deal
```

---

## Verification Gate

Before marking this complete, run:

```bash
# Typecheck
pnpm -s exec tsc -p tsconfig.json --noEmit

# Verify no regressions
pnpm build
```

---

## Output Artifacts

Create these files when done:

1. **Update `cleanup/DESIGN-SYSTEM-STATUS.md`** with findings
2. **Document any new tokens added** in commit message
3. **List remaining violations** for Agents 1-3 to fix

---

## Handoff to Parallel Agents

Once this audit is complete, launch these agents simultaneously:

- **AGENT-1-TYPOGRAPHY-AUDIT.md** - Typography standardization
- **AGENT-2-SPACING-LAYOUT-AUDIT.md** - Spacing, padding, layout
- **AGENT-3-COLORS-THEMING-AUDIT.md** - Colors, tokens, theming

Each agent has non-overlapping scope to prevent merge conflicts.
