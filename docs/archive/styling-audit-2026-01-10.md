# Styling Audit (Archive) — 2026-01-10

This is **archived** (dated) material.

- Canonical design system: `docs/DESIGN.md`
- Current styling docs: `docs/styling/README.md`

---

## Part A — Scan-Based Audit (Tailwind v4 / shadcn/ui)

> Generated: 2026-01-10  
> Status: **Production ready**

---

### Executive Summary

The codebase has a **solid Tailwind v4 + shadcn/ui foundation** with well-documented design tokens and patterns. Critical violations have been cleaned up.

| Category | Count | Severity |
|----------|-------|----------|
| Arbitrary values (`[Npx]`, `[Nrem]`) | ~20 | ✅ Mostly clean |
| Hardcoded hex colors (mostly color swatches) | ~32 | 🟢 Low (intentional) |
| Gradient usage (`from-`, `to-`, `via-`) | 0 | ✅ Clean |
| Scale animations (`hover:scale-`, `scale-1*`) | 0 | ✅ Clean |
| Palette colors (`bg-gray-*`, `text-gray-*`) | 0 | ✅ Clean |

---

### ✅ What's Working Well

#### 1) Tailwind v4 Configuration
- ✅ CSS-first config with `@import "tailwindcss"`
- ✅ `@theme` block with comprehensive design tokens
- ✅ OKLCH color space for perceptually uniform colors
- ✅ `@custom-variant dark (&:is(.dark *))` for class-based dark mode
- ✅ `@plugin "tailwindcss-animate"` for animations
- ✅ Custom `@utility` definitions (container variants)

#### 2) Design Token Coverage
- ✅ Full semantic color tokens (`--color-background`, `--color-foreground`, etc.)
- ✅ Dense touch target tokens (`--spacing-touch-*`)
- ✅ Marketplace-specific tokens (prices, deals, shipping, ratings)
- ✅ Dark mode token parity in `.dark {}` block
- ✅ Custom typography scale (`--text-2xs`, `--text-tiny`, `--text-body`)

#### 3) shadcn/ui Setup
- ✅ 42+ components installed with New York style
- ✅ `components.json` properly configured for Tailwind v4
- ✅ CSS variables enabled, baseColor neutral
- ✅ Proper alias paths configured

#### 4) Documentation
- ✅ `docs/DESIGN.md` - comprehensive design system guide
- ✅ `docs/styling/PATTERNS.md` - approved copy-paste patterns
- ✅ `docs/styling/ANTI_PATTERNS.md` - what NOT to do
- ✅ `docs/styling/03-tailwind.md` - Tailwind v4 best practices
- ✅ `docs/styling/04-shadcn.md` - shadcn/ui audit checklist

---

### ✅ Critical Issues (RESOLVED)

#### Issue 1: Gradient Usage
**Status**: ✅ **Fixed** - No gradient classes found in codebase.

#### Issue 2: Scale Animations
**Status**: ✅ **Fixed** - All `hover:scale-*` and `active:scale-*` removed and replaced with color/opacity transitions.

---

### 🟡 Medium Issues (Clean Up Soon)

#### Issue 3: Arbitrary Values
**Status**: ✅ **Mostly Fixed** - Added design tokens and refactored top offending files.

**New tokens added** to `globals.css`:
- `text-compact` (0.8125rem / 13px) - for compact UI text
- `text-reading` (0.9375rem / 15px) - for readable body text
- `--spacing-category-circle` (3.5rem / 56px)
- `--spacing-category-item` (4rem / 64px)
- `--spacing-category-item-lg` (4.5rem / 72px)
- `--spacing-nav-row` (3rem / 48px)

**Files refactored**:
- `category-circles.tsx` - uses new tokens
- `subcategory-circles.tsx` - uses new tokens
- `product-card-price.tsx` - uses `text-reading`, `text-tiny`, `text-2xs`
- `smart-anchor-nav.tsx` - uses `text-compact`, `--spacing-nav-row`
- `product-card.tsx` - uses `text-compact`, `text-tiny`
- `category-l3-pills.tsx` - uses `text-compact`
- `subcategory-pills.tsx` - uses `text-compact`
- `inline-filter-bar.tsx` - uses `text-compact`, `text-2xs`
- `subcategory-tabs.tsx` - uses `--spacing-category-circle`
- `site-header.tsx` - uses `text-xl` instead of arbitrary

**Remaining arbitrary values** (~20 instances):
- `ring-[3px]` in shadcn/ui components (intentional focus ring pattern)
- `@[250px]/card:`, `@[540px]/card:`, `@[767px]/card:` container query breakpoints (intentional responsive pattern)
- `border-[1.5px]` in `chart.tsx` (shadcn tooltip indicator, intentional)
- Chart components use CSS variable heights (`h-(--chart-h-sm)`) - compliant

---

#### Issue 4: Hardcoded Hex Colors (~32 instances)

**Location**: Primarily in `components/shared/filters/color-swatches.tsx`

**Assessment**: These are **intentional** for product color filter swatches (red, blue, green product colors). This is acceptable because:
- Color swatches represent actual product colors, not UI tokens
- They cannot use semantic tokens

**Recommendation**: No action needed if these are product color filters. Document this exception.

---

### 🟢 Low Priority / Already Clean

#### Palette Colors
✅ **0 violations** - No `bg-gray-*`, `text-gray-*`, `border-gray-*` found outside legitimate use.

#### Hardcoded `bg-white`, `text-black`, `bg-black`
Found in ~24 files, but review showed most are:
- Intentional overlay backgrounds
- Print styles
- Inverted text on dark surfaces

---

### Action Plan

#### Phase 1: Critical (Before Production)
✅ **COMPLETED** - All gradients and scale animations removed.

#### Phase 2: Medium (Post-Launch Sprint)
✅ **COMPLETED** - Added typography/spacing tokens and refactored top offending files.
1. ~~**Arbitrary values cleanup** - Start with top 5 offending files~~ ✅ Done
2. **Document exceptions** - Color swatches hex usage is intentional ✅ Documented

#### Phase 3: Ongoing Maintenance
✅ **COMPLETED** - Scan scripts available and CI-ready gate configured.
1. Run scans before each release:
   ```bash
   pnpm styles:scan           # Run both scans
   pnpm styles:scan:palette   # Palette violations only
   pnpm styles:scan:arbitrary # Arbitrary values only
   ```
2. CI gate (optional, fails on any violation):
   ```bash
   pnpm styles:gate           # FAIL_ON_FINDINGS=1
   ```

---

### Validation Commands

```bash
# Full scan suite
pnpm styles:scan

# Or individual scans
pnpm styles:scan:palette
pnpm styles:scan:arbitrary

# CI gate (fails on violations)
pnpm styles:gate

# Type check (always run after CSS changes)
pnpm -s exec tsc -p tsconfig.json --noEmit

# Smoke tests
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

---

## Part B — Narrative Audit Notes (Why Projects Go Wrong)

*Treido Project Analysis — January 2026*

---

### Executive Summary

After auditing the project, the styling foundation is solid. The “black and white” look is intentional and correct for a marketplace UI.

---

### What’s Actually Working ✅

#### Token System
Your `globals.css` defines a comprehensive token system and maps semantic tokens correctly.

#### Component Architecture
shadcn primitives and variants follow best practices (CVA, semantic tokens, consistent active states).

#### Neutral UI is Correct
In marketplaces, product images carry color; UI chrome stays neutral; trust signals use semantic colors.

---

### Common Failure Patterns

- Token explosion / duplicated concepts
- Hardcoded palette colors instead of tokens
- Inconsistent interactive states
- Shadow/elevation abuse
- Border-radius inconsistency

---

### Real Issues Found

#### Hydration errors
Hydration mismatches likely from client-only formatting (dates/locale-dependent rendering).

#### 404 resources
Some product images returning 404.

#### Arbitrary font sizes
Some product card text used `text-[13px]` / `text-[11px]` in older versions.

#### Duplicate footer/nav rendering
Multiple footer instances observed (likely nested layouts rendering duplicate shells).

---

### What NOT to change

- Keep the neutral palette
- Keep flat cards
- Keep dense spacing
- Keep the token system

---

### Checklist: Before Shipping Any UI Change

- [ ] Uses semantic tokens (`bg-muted`, not `bg-gray-100`)
- [ ] No arbitrary values unless unavoidable
- [ ] Active states follow `bg-foreground text-background` pattern
- [ ] Touch targets ≥ 44px (`h-11` or larger)
- [ ] No new shadows (use border for separation)
- [ ] Pills use `rounded-full`, cards use `rounded-md`
- [ ] Run `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [ ] Run smoke tests: `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

---

### Summary

The “black and white” look is correct for a marketplace. Remaining issues were primarily engineering consistency items (hydration, asset 404s, duplicate DOM shells) rather than the token system.
