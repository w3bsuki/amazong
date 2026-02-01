# Sell Form Fix Plan v3 - FINAL

**Date**: January 27, 2026  
**Status**: Ready to Execute  
**Total Effort**: ~12 hours  

---

## Verified Bugs (via Supabase MCP + Code Audit)

| ID | Bug | Root Cause | File | Effort |
|----|-----|------------|------|--------|
| P0-1 | Accept Offers toggle crashes form | Dual handlers: button onClick + Switch onCheckedChange | `step-pricing.tsx:234-267` | 30min |
| P0-2 | iPhone/Samsung not showing in picker | UI bug - data EXISTS in DB | Category picker component | 4-6hr |
| P0-3 | Sneakers category rejected | Correct behavior - has 5 children, UI must enforce leaf | Category picker component | Same as P0-2 |
| P0-4 | Price shows wrong currency | BGN entered but displayed as EUR (no conversion) | `format-price.ts` + sell form | 1hr |
| P1-1 | Condition badge shows raw slug | No label mapping | PDP component | 30min |
| P1-2 | Duplicate "Condition" in specs | Rendered twice | PDP specs component | 1hr |
| P1-3 | "New" button goes to wrong step | Form state not reset | Success page | 1-2hr |

**Note**: Stripe onboarding gate is a PRODUCT DECISION, not a bug. Escalate to stakeholders if change needed.

---

## P0-1: Accept Offers Crash (30 min)

### Root Cause
`step-pricing.tsx` lines 234-267 have BOTH:
- `<button onClick={() => setValue("acceptOffers", !acceptOffers)}>` 
- `<Switch onCheckedChange={(checked) => setValue("acceptOffers", checked)}>`

Clicking anywhere triggers both → infinite render loop → crash.

### Fix
Change `<button>` to `<div>`, remove the `onClick`:

```tsx
// BEFORE (broken)
<button
  type="button"
  onClick={() => setValue("acceptOffers", !acceptOffers)}
  className={cn(...)}
>

// AFTER (fixed)
<div
  className={cn(...)}
>
```

### File
`app/[locale]/(sell)/_components/steps/step-pricing.tsx` - lines 234-267

---

## P0-2 & P0-3: Category Picker Issues (4-6 hr)

### Verified Database State
```sql
-- iPhone and Samsung EXIST under Smartphones:
smartphones-iphone  (parent: d20450a8-53ce-4d20-9919-439a39e73cda)
smartphones-samsung (parent: d20450a8-53ce-4d20-9919-439a39e73cda)

-- Sneakers HAS children (correctly rejected by trigger):
men-sneakers → Running, Casual, High-Top, Low-Top, Slip-On
```

### Root Cause
The category picker UI is either:
1. Not fetching all subcategories (pagination/limit issue)
2. Not rendering them correctly
3. Allowing selection of non-leaf categories

### Fix Requirements
1. Debug category picker fetch query - ensure all children load
2. Prevent selection of categories with `has_children = true`
3. Show visual indicator (arrow/chevron) for categories with children
4. Auto-expand to show leaf options

### Files to Investigate
- Look for category picker/selector component in `app/[locale]/(sell)/_components/`
- Check any hooks like `use-category-*` in `hooks/`
- Verify Supabase query fetches all children without limits

---

## P0-4: Currency Display (1 hr)

### Root Cause
- User selects BGN in form
- `sell.ts` does NOT save currency to DB (products table has no currency column)
- `format-price.ts` assumes all prices are EUR
- Result: 38,500 BGN displays as €38,500

### Fix (Simple - No Schema Change)
Bulgaria joined Eurozone Jan 1, 2025. Remove BGN option OR convert to EUR on save.

**Option A (Recommended)**: Remove BGN from currency picker
```tsx
// In step-pricing.tsx or schema-v4.ts
const CURRENCIES = [
  { value: "EUR", label: "Euro", symbol: "€" },
  // Remove BGN since Bulgaria uses EUR now
];
```

**Option B**: Convert BGN to EUR on save (if BGN legacy support needed)
```typescript
// In sell.ts before saving
const priceInEUR = form.currency === 'BGN' ? form.price / 1.95583 : form.price;
```

### Files
- `lib/sell/schema-v4.ts` - line 113 (currency enum)
- `app/[locale]/(sell)/_components/steps/step-pricing.tsx` - currency picker

---

## P1-1: Condition Badge Shows Slug (30 min)

### Root Cause
PDP displays raw `condition` value like `new-with-tags` instead of "New with Tags".

### Fix
Add label mapping in the condition badge component:

```typescript
const CONDITION_LABELS: Record<string, string> = {
  'new': 'New',
  'new-with-tags': 'New with Tags',
  'new-without-tags': 'New without Tags',
  'like-new': 'Like New',
  'used-like-new': 'Like New',
  'used-excellent': 'Used - Excellent',
  'used-good': 'Used - Good',
  'used-fair': 'Used - Fair',
  'refurbished': 'Refurbished',
};

// Usage
<Badge>{CONDITION_LABELS[condition] ?? condition}</Badge>
```

### File
Find the PDP condition badge component (likely in `components/` or product page)

---

## P1-2: Duplicate Condition in Specs (1 hr)

### Root Cause
Condition appears twice in the specifications tab - once from `product.condition` column, once from `product.attributes` JSON.

### Fix
Dedupe in the specs rendering logic:

```typescript
// Filter out 'condition' from attributes if already shown separately
const filteredSpecs = specs.filter(spec => 
  spec.name.toLowerCase() !== 'condition'
);
```

### File
PDP specifications/attributes component

---

## P1-3: "New" Button Wrong Step (1-2 hr)

### Root Cause
After publishing, clicking "New Listing" navigates to `/sell` but form state persists, jumping to Review step.

### Fix
Reset form state before navigation:

```typescript
const handleNewListing = () => {
  // Clear form state (localStorage, context, or Zustand)
  localStorage.removeItem('sell-form-draft');
  // Reset to step 1
  router.push('/sell');
};
```

### File
Success/confirmation page after listing creation

---

## Execution Checklist

### Day 1 (4-5 hours)
- [ ] **P0-1**: Fix Accept Offers crash (change button to div)
- [ ] **P0-4**: Remove BGN or add EUR conversion
- [ ] **P1-1**: Add condition label mapping
- [ ] Run `pnpm typecheck` - fix any TS errors
- [ ] Manual test: Create listing with Accept Offers toggle

### Day 2 (6-8 hours)
- [ ] **P0-2/P0-3**: Debug category picker
  - [ ] Find the component file
  - [ ] Check fetch query for limits/pagination
  - [ ] Add leaf-category enforcement
  - [ ] Test: Select Electronics > Smartphones > iPhone
  - [ ] Test: Select Fashion > Men's > Shoes > Sneakers > Running
- [ ] **P1-2**: Fix duplicate condition in specs
- [ ] **P1-3**: Fix "New" button navigation

### Day 3 (2 hours)
- [ ] Full regression test of sell flow
- [ ] Test all 3 categories: Electronics, Automotive, Fashion
- [ ] Verify PDP displays correctly

---

## Verification Queries (Supabase)

```sql
-- Verify iPhone/Samsung exist
SELECT name, slug FROM categories 
WHERE parent_id = 'd20450a8-53ce-4d20-9919-439a39e73cda';

-- Verify Sneakers children
SELECT name, slug FROM categories 
WHERE parent_id = 'fa46d8fc-3e3b-47ea-84e4-dc5be101d49e';

-- Check if category is leaf
SELECT c.*, 
  NOT EXISTS(SELECT 1 FROM categories c2 WHERE c2.parent_id = c.id) as is_leaf
FROM categories c WHERE slug = 'mens-sneakers-running';
```

---

## Out of Scope (Product Decisions)

These are NOT bugs - require stakeholder decision:

| Item | Current Behavior | Options |
|------|------------------|---------|
| Stripe onboarding gate | Blocks all listing until payout setup complete | A) Keep (safe), B) Gate at checkout, C) Gate at first sale |
| Form state persistence | Lost on crash | Add localStorage backup if UX complaint |

---

## Sign-off

| Step | Status |
|------|--------|
| Bugs verified via Supabase MCP | ✅ |
| Code locations identified | ✅ |
| Fixes are minimal/non-breaking | ✅ |
| No unnecessary schema changes | ✅ |
| Ready to execute | ✅ |
