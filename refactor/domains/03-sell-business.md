# Domain 3 — (sell) + (business) Route Groups

> **(sell): 54 files · 8,518 LOC — the listing creation flow.**
> **(business): 52 files · 8,053 LOC — the seller dashboard.**
> **Combined: 106 files · 16,571 LOC.**
> **Read `refactor/shared-rules.md` first.**

---

## Why Combined

These serve the same user (sellers). (sell) = creating/editing listings. (business) = managing existing sales, orders, analytics. High chance of shared patterns and duplication.

## Scope

- `app/[locale]/(sell)/` — the sell flow (form, category selection, attributes, images, shipping, pricing)
- `app/[locale]/(business)/` — seller dashboard (products table, orders, stats, settings)

## Audit Checklist

1. **Sell flow form fields:**
   - `_components/fields/attributes-field.tsx` (597L) — massive form field
   - `_components/fields/shipping-field.tsx` (577L) — massive form field
   - `_components/ui/category-selector.tsx` (694L) — massive
   - How many total files serve the sell form? Is it over-fragmented or under-split?

2. **Business dashboard:**
   - `_components/product-form-modal.tsx` (744L) — product edit modal
   - `_components/products-table.tsx` (715L) — products list
   - How much overlap with the sell flow? Same product form in both?

3. **Sell ↔ Business duplication:**
   - Product form in (sell) vs product edit modal in (business) — how much is shared?
   - Category selection — used in both?
   - Image upload — used in both?

4. **Tiny files:** List all <50L files in both domains. Merge candidates.

5. **"use client" audit:** Count in both domains.

6. **Action files:**
   - `(sell)/_actions/sell.ts` (252L, uses raw `getUser()`)
   - `app/actions/products-*.ts` — the product action family
   - Any duplication between sell actions and product actions?

7. **Dead code:** Check all _components/ exports for zero usage.

## Refactor Targets

### Oversized files (744L, 715L, 694L, 597L, 577L)
- Split by extracting sub-sections, types, validation logic
- Product form modal (744L) — extract form sections into sub-components

### Sell ↔ business shared form logic
- If the sell form and business product edit share structure, extract shared form primitives
- Don't create shared form if they're actually different — audit first

### Action consolidation
- Migrate `sell.ts` from `getUser()` → `requireAuth()`
- Check for duplicate product queries between sell and business

## DON'T TOUCH
- Stripe Connect onboarding flow
- Payment-related business settings
- The product action files were already split in session 8 — respect that structure

## Verification
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```
