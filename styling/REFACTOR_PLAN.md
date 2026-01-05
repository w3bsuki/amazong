# Styling Refactor Plan

> Prioritized cleanup tasks to achieve consistent styling across the codebase.

This plan is intentionally **small-batch** and **verification-first**: no redesigns, no rewrites, no new UI patterns.

---

## Current State Assessment

### ✅ Recent Progress (2026-01-05)

- Converted 10 high-impact palette offenders to semantic token utilities (success/warning/info/primary/destructive).
- Latest palette scan (`pnpm -s exec node scripts/scan-tailwind-palette.mjs`): Totals: files=48 palette=238 gradient=13 fill=4.

**Most recently cleaned (palette/token pass):**

- `app/[locale]/(business)/_components/business-performance-score.tsx`
- `app/[locale]/(main)/(support)/security/page.tsx`
- `app/[locale]/(business)/_components/business-recent-activity.tsx`
- `app/[locale]/(business)/dashboard/inventory/_components/inventory-header.tsx`
- `app/[locale]/(business)/_components/business-notifications.tsx`

### ✅ What's Working Well

- **globals.css**: Comprehensive theme tokens (OKLCH colors, spacing, radii)
- **components/ui/**: shadcn/ui components properly styled
- **Main page**: Good patterns (marketplace-hero, trust-bar, tabbed-product-feed)
- **Product card**: Professional flat design with proper hover states
- **Badge component**: Full variant system for marketplace use cases

### ⚠️ Problem Areas

Based on codebase analysis:

1. **48 files with Tailwind palette/gradient usage** (see `cleanup/palette-scan-report.txt`)
2. **100+ files with arbitrary values / hardcoded colors** (`[px]`, `[rem]`, `[#hex]`)
3. **1 file using heavy shadows** (post-signup-onboarding-modal)
3. **Inconsistent spacing** across route-specific components
4. **Some gradient comments/remnants** in code (mostly cleaned up)
5. **Seller/account pages** may have older styling patterns

---

## How to Generate the Worklist (Reproducible)

Run these to regenerate “what to fix next” before starting a batch:

1. **Tailwind palette / gradients**
	- `pnpm -s exec node scripts/scan-tailwind-palette.mjs`
	- Review `cleanup/palette-scan-report.txt`

2. **Arbitrary values / hardcoded colors**
	- `pnpm -s exec node scripts/scan-tailwind-arbitrary.mjs`
	- Review `cleanup/arbitrary-scan-report.txt`

Notes:
- The palette scan catches things like `bg-blue-500` and `from-*` gradient stops.
- The arbitrary scan catches bracket values like `w-[560px]` and color literals like `[#fff]`.
- `app/globals.css` is excluded from the arbitrary scan (it is the token source of truth and will contain `oklch()` by design).

---

## Phase 1: Critical Fixes (High Impact)

### 1.1 Heavy Shadows Cleanup

**Files**:
- `components/auth/post-signup-onboarding-modal.tsx`

**Action**: Replace `shadow-xl`/`shadow-2xl` with `shadow-md` (modal) or `shadow-sm`.

### 1.2 Account Section Standardization

**Directories**:
- `app/[locale]/(account)/account/_components/`
- `app/[locale]/(account)/account/**/_components/` (nested route-owned components)

**Files (likely offenders)**:
- `app/[locale]/(account)/account/orders/_components/account-orders-stats.tsx`
- `app/[locale]/(account)/account/_components/account-stats-cards.tsx`
- `app/[locale]/(account)/account/_components/account-addresses-stats.tsx`
- `app/[locale]/(account)/account/_components/account-recent-activity.tsx`
- `app/[locale]/(account)/account/_components/account-chart.tsx`
- `app/[locale]/(account)/account/_components/account-addresses-grid.tsx`
- `app/[locale]/(account)/account/wishlist/_components/account-wishlist-stats.tsx`

**Action**: Audit each file, replace arbitrary values with Tailwind scale equivalents.

### 1.3 Business Dashboard Standardization

**Directory**: `app/[locale]/(business)/_components/`

**Files (likely offenders)**:
- `app/[locale]/(business)/_components/business-stats-cards.tsx`
- `app/[locale]/(business)/_components/products-table.tsx`
- `app/[locale]/(business)/_components/orders-table.tsx`
- `app/[locale]/(business)/_components/business-activity-feed.tsx`

**Recently completed (palette/token pass)**:

- `app/[locale]/(business)/_components/business-performance-score.tsx`
- `app/[locale]/(business)/_components/business-notifications.tsx`
- `app/[locale]/(business)/_components/business-recent-activity.tsx`
- `app/[locale]/(business)/dashboard/inventory/_components/inventory-header.tsx`

**Action**: Replace arbitrary values, ensure consistent card/table styling.

---

## Phase 2: Route-Level Consistency

### 2.1 Auth Pages

**Directory**: `app/[locale]/(auth)/_components/`

**Files**:
- `login-form.tsx` (5 instances)

**Action**: Standardize form styling to match PATTERNS.md form section.

### 2.2 Admin Pages

**Directory**: `app/[locale]/(admin)/_components/`

**Files**:
- `admin-stats-cards.tsx` (5 instances)

**Action**: Align with business dashboard styling for consistency.

### 2.3 Sell Flow

**Directory**: `app/[locale]/(sell)/_components/`

**Files**:
- `sell-section-skeleton.tsx` (1 instance)
- `sell-header.tsx` (1 instance)
- `layouts/desktop-layout.tsx` (1 instance)
- `fields/pricing-field.tsx` (2 instances)

**Action**: Audit and standardize.

### 2.4 Checkout Flow

**Files**:
- `app/[locale]/(checkout)/checkout/loading.tsx` (1 instance)

**Action**: Quick fix.

---

## Phase 3: Shared Components Audit

### 3.1 Layout Components

**Files**:
- `components/layout/sidebar/sidebar-menu.tsx` (6 instances)
- `components/layout/footer/site-footer.tsx` (2 instances)

**Action**: Review and standardize.

### 3.2 Dropdown Components

**Files**:
- `components/dropdowns/account-dropdown.tsx` (2 instances)
- `components/dropdowns/locale-delivery-dropdown.tsx` (1 instance)

**Action**: Ensure consistent dropdown styling.

### 3.3 Desktop Components

**Files**:
- `components/desktop/desktop-filter-modal.tsx` (1 instance)

**Action**: Quick fix.

### 3.4 Product-Related

**Files**:
- `components/shared/product/write-review-dialog.tsx` (1 instance)
- `components/shared/product/seller-products-grid.tsx` (1 instance)
- `components/shared/product/product-gallery-hybrid.tsx` (1 instance)

**Action**: Ensure alignment with product-card patterns.

---

## Phase 4: Chart/Data Visualization

**Files**:
- `components/charts/chart-area-interactive.tsx` (5 instances)
- `components/ui/chart.tsx` (1 instance)
- `app/[locale]/(account)/account/sales/_components/sales-chart.tsx` (2 instances)

**Action**: Charts may need arbitrary values for sizing. Audit whether these are necessary exceptions.

---

## Phase 5: Loading States

**Files with arbitrary values in loading/skeleton components**:
- `app/[locale]/loading.tsx` (2 instances)
- `app/[locale]/not-found.tsx` (3 instances)
- Various route `loading.tsx` files

**Action**: Standardize all loading skeletons to use the approved pattern.

---

## Execution Strategy

### For Each File

1. **Search** for arbitrary values: `\[.*px\]`, `\[.*rem\]`, `\[#`
2. **Replace** with closest Tailwind value
3. **Check** for heavy shadows (`shadow-lg`, `shadow-xl`, `shadow-2xl`)
4. **Verify** dark mode works
5. **Test** visually (quick eyeball in dev server)

### Allowed Exceptions (Use Sparingly)

- **Aspect ratios**: `aspect-[3/4]` and similar, when `aspect-*` utilities don’t cover the design.
- **CSS variable sizing**: prefer Tailwind v4’s CSS variable syntax (e.g. `w-(--container-modal)` / `max-w-(--container-modal-lg)`) over pixel brackets.
- **Charts/visualizations**: fixed sizes can be allowed if there’s no stable token alternative; keep them localized.

### Tailwind Value Mapping

| Arbitrary | Tailwind Equivalent |
|-----------|---------------------|
| `h-[32px]` | `h-8` |
| `h-[36px]` | `h-9` |
| `h-[40px]` | `h-10` |
| `h-[44px]` | `h-11` |
| `h-[48px]` | `h-12` |
| `w-[180px]` | `w-44` (176px) or `w-48` (192px) |
| `w-[200px]` | `w-52` (208px) |
| `gap-[10px]` | `gap-2.5` (10px) |
| `text-[13px]` | `text-sm` (14px) |
| `text-[15px]` | `text-base` (16px) |

### Priority Order

1. **Scan-driven top offenders first**: Start with the highest-count files in `cleanup/palette-scan-report.txt` and `cleanup/arbitrary-scan-report.txt`.
2. **Tie-breaker: user-critical paths**: Checkout, Product pages, Search.
3. **Then: account pages** (high visibility to returning users).
4. **Then: admin/business dashboards** (lower traffic but must be consistent).
5. **Then: loading states** (polish).

---

## Verification Checklist

After each refactor batch:

- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit` passes
- [ ] Visual check in browser (light + dark mode)
- [ ] At least one targeted test suite:
	- [ ] `pnpm test:e2e:smoke` (preferred for UI styling batches)
	- [ ] or `pnpm test:unit` (when you touched shared UI utils/components)
- [ ] No regressions in functionality
- [ ] Responsive check (mobile + desktop)

---

## Definition of Done

- Zero arbitrary color values (`[#xxx]`)
- Minimal arbitrary size values (only where truly necessary)
- No shadows heavier than `shadow-md`
- All cards use `rounded-md` max
- Consistent spacing (gap-2 mobile, gap-3 desktop)
- Dark mode works everywhere
- All new code follows STYLE_GUIDE.md

---

## Batch Size Recommendation

- Keep batches to **3–8 files**.
- Prefer fixing the top offenders from the scan reports first.
- Don’t mix unrelated route groups in the same batch unless changes are truly identical.

---

## Estimated Effort

| Phase | Files | Effort |
|-------|-------|--------|
| Phase 1 | ~15 | 2-3 hours |
| Phase 2 | ~10 | 1-2 hours |
| Phase 3 | ~10 | 1-2 hours |
| Phase 4 | ~5 | 30 min (audit) |
| Phase 5 | ~10 | 1 hour |

**Total**: ~5-8 hours of focused cleanup

---

## Notes for AI Agents

When making styling changes:

1. **Read** `styling/STYLE_GUIDE.md` first
2. **Copy** patterns from `styling/PATTERNS.md`
3. **Avoid** everything in `styling/ANTI_PATTERNS.md`
4. **Check** `globals.css` for available tokens
5. **Don't** invent new patterns — use existing ones
6. **Verify** with typecheck before committing
