# Frontend Tasks — Production Launch Checklist

> **Comprehensive frontend task list audited for V1 launch.**

**Created:** January 28, 2026  
**Audited:** January 29, 2026 (Opus)  
**Source:** audit/, audit-desktop-2026-01-28/, docs/FEATURES.md, production docs

---

## Audit Summary

### Current State Assessment

| Metric | Before Audit | After Audit | Change |
|--------|--------------|-------------|--------|
| P1 Tasks | 8 | 8 | — |
| P2 Tasks | 14 | 12 | -2 (consolidated) |
| P3 Tasks | 10 | 8 | -2 (deferred) |
| **Total Active** | 32 | 28 | -4 |
| Completed | 5 | 7 | +2 (verified) |

### Verification Gate Compliance

All tasks must pass:
```bash
pnpm -s typecheck    # 0 errors
pnpm -s lint         # 0 errors
pnpm -s styles:gate  # No forbidden patterns
```

UI-specific tasks additionally require:
```bash
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

---

## Summary

| Priority | Count | Description |
|----------|-------|-----------|
| **P1 (Blocker)** | 8 | Must fix before launch |
| **P2 (Should Fix)** | 12 | Important for quality |
| **P3 (Nice to Have)** | 8 | Polish items |
| **Total** | 28 | |

---

## Priority Definitions

| Priority | Definition | Launch Gate |
|----------|------------|-------------|
| **P1 (Blocker)** | Breaks user experience, compliance issue, or security risk | Must fix |
| **P2 (Should Fix)** | Degrades quality, inconsistency, UX friction | Should fix |
| **P3 (Nice to Have)** | Polish, minor improvements, optional enhancements | Post-launch OK |

---

## P1 — Launch Blockers

These **must** be fixed before production deployment.

| ID | Task | Source | Files | Owner | Status |
|----|------|--------|-------|-------|--------|
| F-P1-01 | Fix mixed locale content (Bulgarian on EN pages) | MOBILE_AUDIT | `components/desktop/promoted-section.tsx`, `app/[locale]/(main)/categories/page.tsx`, i18n keys | Opus | 🔄 In Progress |
| F-P1-03 | Fix page titles (Checkout, Account need specific titles) | A11Y_AUDIT | `app/[locale]/(checkout)/*`, `app/[locale]/(account)/*` | — | ⬜ Unclaimed |
| F-P1-04 | Add screen reader labels to all icon-only buttons | A11Y_AUDIT | Components with `<Button variant="ghost" size="icon">` | — | ⬜ Unclaimed |
| F-P1-05 | Ensure touch targets ≥44px (verify heart icons, +/- buttons) | A11Y_AUDIT | `components/shared/product/*`, `components/ui/button.tsx` | — | ⬜ Unclaimed |
| F-P1-06 | Fix cart badge discrepancy (shows 9 but has 495 items) | MOBILE_AUDIT | `components/layout/header/*` | — | ⬜ Unclaimed |
| F-P1-07 | Remove test/dummy products from UI display | DESKTOP_AUDIT | Database + cache invalidation | — | ⬜ Unclaimed |
| F-P1-08 | Fix product categorization (iPhone showing in "Huawei") | MOBILE_AUDIT | Product data / category assignment | — | ⬜ Unclaimed |
| F-P1-09 | Restore full header navigation on cart page | DESKTOP_AUDIT | `app/[locale]/(main)/cart/layout.tsx`, `app/[locale]/(main)/cart/page.tsx` | — | ⬜ Unclaimed |

---

## P2 — Should Fix (Quality)

Important for production quality, should fix before or shortly after launch.

| ID | Task | Source | Files |
|----|------|--------|-------|
| F-P2-01 | Consolidate ProductCard variants (remove redundant files) | TASKS.md | `components/shared/product/product-card*.tsx` |
| F-P2-02 | Align all rounding to `rounded-md` consistently | TASKS.md | Sell flows, cards, form elements |
| F-P2-03 | Add step indicator to sell wizard | DESKTOP_AUDIT | `app/[locale]/(sell)/sell/_components/*` |
| F-P2-04 | Standardize price formatting (€5 vs €5.00) | DESKTOP_AUDIT | `lib/format-price.ts` |
| F-P2-05 | Add pagination to search/category product grids | MOBILE_AUDIT | `app/[locale]/(main)/search/*`, `categories/*` |
| F-P2-06 | Fix chart dimension warnings in account dashboard | MOBILE_AUDIT | `app/[locale]/(account)/*` |
| F-P2-08 | Fix wishlist count inconsistency (header vs page) | DESKTOP_AUDIT | `components/layout/header/*`, wishlist page |
| F-P2-09 | Add error boundaries for API failures (graceful degradation) | MOBILE_AUDIT | Route-level error boundaries |
| F-P2-10 | Fix image preload warnings (add preload hints for LCP) | MOBILE_AUDIT | `app/[locale]/[username]/[productSlug]/*` |
| F-P2-11 | Verify modal/dialog focus trap works correctly | A11Y_AUDIT | All Dialog, Drawer, Sheet components |
| F-P2-13 | Fix chat "No messages" preview issue | DESKTOP_AUDIT | `app/[locale]/(chat)/*` |
| F-P2-15 | Fix React hydration mismatch warnings on key pages | DESKTOP_AUDIT | `app/[locale]/(main)/page.tsx`, `app/[locale]/(main)/search/*`, `app/[locale]/(checkout)/*` |

---

## P3 — Nice to Have (Polish)

Low priority, can be addressed post-launch.

| ID | Task | Source | Files |
|----|------|--------|-------|
| F-P3-01 | Enhance product image alt text (more descriptive) | A11Y_AUDIT | Product cards, PDP |
| F-P3-03 | Add `aria-busy` during loading states | A11Y_AUDIT | Loading components |
| F-P3-04 | Test and verify 200% zoom text reflow | A11Y_AUDIT | All pages |
| F-P3-06 | Improve avatar selection UI (more descriptive labels) | DESKTOP_AUDIT | Profile settings |
| F-P3-07 | Add article counts to help categories | DESKTOP_AUDIT | Customer service page |
| F-P3-08 | Show yearly pricing savings percentage on plans | DESKTOP_AUDIT | Plans page |
| F-P3-09 | Add visual feedback for form validation | A11Y_AUDIT | Form components |
| F-P3-10 | Dedupe jscpd clone clusters in product cards | TASKS.md | `components/shared/product/*` |

---

## Completed (From Audits)

| ID | Task | Completed | Notes |
|----|------|-----------|-------|
| ~~F-01~~ | Fix Cart page React error #419 | 2026-01-28 | Critical blocker |
| ~~F-02~~ | Fix missing i18n `Account.header.profile` | 2026-01-28 | Translation added |
| ~~F-03~~ | Fix Reviews data contradiction | 2026-01-28 | Uses reviews array |
| ~~F-04~~ | Fix Sell page empty/minimal | 2026-01-28 | Shows full form |
| ~~F-05~~ | Fix Footer accordion collapsed | 2026-01-28 | Added defaultValue |
| ~~F-P1-02~~ | Fix footer year (use current year) | 2026-01-29 | Uses `new Date().getFullYear()` |
| ~~F-P2-14~~ | Ensure footer sections are expanded by default on desktop | 2026-01-29 | Already addressed by footer accordion `defaultValue` |

---

## Task Details

### F-P1-01: Fix Mixed Locale Content

**Problem:** Bulgarian content appearing on English locale pages  
**Examples:**
- "ПРОМОТИРАНИ ОБЯВИ" heading on /en homepage
- Product titles in Bulgarian on English pages
- Category names mixing languages

**Solution:**
1. Audit all hardcoded strings in components
2. Move to `messages/en.json` and `messages/bg.json`
3. Use `useTranslations()` / `getTranslations()`

**Files to check:**
- `app/[locale]/(main)/page.tsx`
- `components/desktop/promoted-section.tsx`
- `app/[locale]/(main)/categories/page.tsx`
- `components/shared/product/product-card.tsx`
- Category-related components

---

### F-P1-03: Fix Page Titles

**Problem:** Some pages have generic "Treido" title instead of specific

| Page | Current | Should Be |
|------|---------|-----------|
| Checkout | "Treido" | "Checkout \| Treido" |
| Account | "Treido" | "Account \| Treido" |
| Profile | "Treido" | "Profile Settings \| Treido" |

**Solution:**
1. Add `metadata` export to each page
2. Or use `generateMetadata()` for dynamic titles

---

### F-P1-05: Touch Target Verification

**Problem:** Some interactive elements may be < 44px

**Elements to verify:**
- Wishlist heart icons on cards
- Rating star filters
- Quantity +/- buttons
- Footer link spacing

**Solution:**
- Use `h-touch-*` utilities from DESIGN.md
- `h-touch-xs`: 32px (minimum compact)
- `h-touch-sm`: 36px (pills, chips)
- `h-touch`: 40px (standard buttons)
- `h-touch-lg`: 48px (primary CTAs)

---

### F-P2-01: Consolidate ProductCard Variants

**Problem:** Multiple product card files with overlapping functionality

**Current files:**
```
components/shared/product/
├── product-card.tsx
├── product-card-actions.tsx
├── product-card-badges.tsx
├── product-card-content.tsx
├── product-card-hero.tsx
├── product-card-hero-attributes.tsx
├── product-card-image.tsx
├── product-card-info.tsx
├── product-card-skeleton.tsx
├── product-card-with-fallback.tsx
└── ... (others?)
```

**Solution:**
1. Create composition pattern with base card
2. Use slots/children for variations
3. Document which variant to use where

---

## Acceptance Criteria

### For P1 Tasks
- [ ] Task passes visual review
- [ ] No console errors related to task
- [ ] i18n strings present in both EN and BG
- [ ] Touch targets verified with devtools
- [ ] Typecheck passes

### For P2 Tasks
- [ ] Task passes visual review
- [ ] Related E2E tests pass (if applicable)
- [ ] Lighthouse accessibility score maintained

### For P3 Tasks
- [ ] Task improves user experience
- [ ] No regressions introduced

---

## Verification Commands

```bash
# After each task
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate

# For UI changes
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke

# For accessibility
# Run Lighthouse audit on affected pages
```

---

*Last updated: January 29, 2026*
