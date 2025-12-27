# Audit of Product Page Plans (Mobile + Desktop)

Date: 2025-12-27

Scope:
- Existing plans reviewed:
  - `cleanup/mobile-product-page-audit-and-refactor-plan.md`
  - `cleanup/mobile-product-page-improvement-plan-v2.md`
  - `cleanup/desktop-product-page-audit-and-refactor-plan.md`
  - `cleanup/desktop-product-page-audit-and-refactor-plan-backup.md`
- Current implementation reviewed:
  - `app/[locale]/[username]/[productSlug]/page.tsx`
  - `components/shared/product/*` (gallery, buy box, sticky bar, mobile seller card, accordions, similar items)

---

## What went right in the mobile plan

The mobile plan(s) succeeded because they were:
- **Root-cause driven**: removed above-the-fold duplication (seller modules) and fixed tap targets.
- **Component-scoped**: focused on a few high-leverage components (`ProductBuyBox`, `ProductGalleryHybrid`, `MobileStickyBar`, `MobileSellerCard`).
- **Measurable**: used Playwright audit artifacts and explicit 44×44 touch target acceptance.
- **Aligned to your tokens**: referenced your mobile token doc (touch sizes, dense spacing), and the code largely reflects that now.

---

## Why the desktop plan can make things worse

The desktop plan contains good intent (grid, hierarchy, sticky buy box), but it’s “unsafe to execute” as written because it mixes in changes that often degrade quality in this codebase:

### 1) It violates the design-system constraints
Examples in the plan use hard-coded colors and visual treatments that are **not derived from your theme primitives**, e.g.:
- `text-green-600`, `text-blue-600`, `text-orange-600`
- aggressive `shadow-lg` / `shadow-md`
- `border-0` on Cards

In a shadcn + CSS-variables setup, these quickly create a “random colors / random elevation” look (and often don’t match dark mode).

### 2) It proposes major UX changes without guardrails
Examples:
- Adding breadcrumb UI with hard-coded paths/labels (can conflict with `next-intl` routing and existing breadcrumb JSON-LD)
- Removing or repurposing key modules (SimilarItemsBar) without proving new information architecture is better

Desktop regressions commonly come from “big rewrites” that move/duplicate critical content (seller identity, CTAs, details) rather than tightening what exists.

### 3) It conflates desktop-only vs mobile-only responsibilities
Your current implementation already uses explicit responsive composition:
- `MobileSellerCard` is `lg:hidden`
- `MobileAccordions` is `lg:hidden`
- desktop-only thumbnails/zoom are handled in `ProductGalleryHybrid`

The desktop plan sometimes recommends changes that would reintroduce duplication or visual noise.

### 4) It suggests placeholder-heavy UI in trust-critical areas
Desktop is where users scrutinize trust signals most. Plans that show “fake” data (hard-coded condition/shipping/ratings) can look worse than hiding unknown fields.

---

## What a “masterpiece plan” must do differently

A plan that reliably upgrades both mobile and desktop must:
- **Lock down invariants** (no new colors, no new shadows, no duplicated seller/CTA areas).
- **Be responsive-by-composition** (explicit `hidden lg:block` / `lg:hidden` boundaries).
- **Be data-truthy** (if data is unknown, hide the row; don’t show fake values).
- **Be incremental** (small PR steps with checkpoints and visual regression screenshots).

Next documents:
- `cleanup/mobile-product-page-masterpiece-plan.md`
- `cleanup/desktop-product-page-masterpiece-plan.md`
