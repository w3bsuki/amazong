# Mobile UI/UX Audit Plan

**Created:** 2026-01-15  
**Objective:** Audit all mobile routes for touch targets, spacing, and UX consistency  
**Standard:** Tailwind CSS v4 + WCAG 2.2 + 65% fill ratio

---

## Audit Checklist Per Route

For each route, verify:

- [ ] **Touch targets** — All interactive elements ≥40px (buttons) or ≥24px (with spacing)
- [ ] **Icon sizing** — 65% fill ratio (26px in 40px target)
- [ ] **Text legibility** — Min 16px body, 14px secondary
- [ ] **Spacing** — Consistent gaps, no overlap
- [ ] **Scroll** — Content scrolls properly, no cutoff
- [ ] **Safe areas** — Notch/home indicator respected
- [ ] **Loading states** — Skeletons/spinners present
- [ ] **Error states** — User-friendly messages
- [ ] **Empty states** — Clear messaging when no data

---

## Routes to Audit

### Phase 1: Core Navigation & Layout

| Route | Component | Priority |
|-------|-----------|----------|
| `/[locale]` | Homepage | P0 |
| Header | `site-header.tsx` | P0 |
| Bottom Nav | `mobile-tab-bar.tsx` | P0 |
| Sidebar Menu | `sidebar-menu-v2.tsx` | P0 |
| Search | `search-overlay.tsx` | P0 |

### Phase 2: Product & Category

| Route | Component | Priority |
|-------|-----------|----------|
| `/[locale]/products` | Product listing | P1 |
| `/[locale]/products/[slug]` | Product detail | P1 |
| `/[locale]/categories/[slug]` | Category page | P1 |
| `/[locale]/deals` | Deals page | P1 |
| `/[locale]/new-arrivals` | New arrivals | P1 |

### Phase 3: User Account

| Route | Component | Priority |
|-------|-----------|----------|
| `/[locale]/account` | Account dashboard | P1 |
| `/[locale]/account/orders` | Order history | P1 |
| `/[locale]/account/wishlist` | Wishlist | P1 |
| `/[locale]/account/settings` | Settings | P2 |
| `/[locale]/account/addresses` | Addresses | P2 |

### Phase 4: Cart & Checkout

| Route | Component | Priority |
|-------|-----------|----------|
| `/[locale]/cart` | Cart page | P0 |
| `/[locale]/checkout` | Checkout flow | P0 |
| `/[locale]/checkout/success` | Order confirmation | P1 |

### Phase 5: Auth

| Route | Component | Priority |
|-------|-----------|----------|
| `/[locale]/auth/login` | Login | P0 |
| `/[locale]/auth/signup` | Sign up | P0 |
| `/[locale]/auth/forgot-password` | Password reset | P2 |

### Phase 6: Seller

| Route | Component | Priority |
|-------|-----------|----------|
| `/[locale]/seller` | Seller dashboard | P2 |
| `/[locale]/seller/products` | Product management | P2 |
| `/[locale]/seller/orders` | Order management | P2 |
| `/[locale]/seller/analytics` | Analytics | P2 |

### Phase 7: Support & Static

| Route | Component | Priority |
|-------|-----------|----------|
| `/[locale]/support` | Support center | P2 |
| `/[locale]/chat` | Chat/messages | P1 |
| `/[locale]/about` | About page | P3 |
| `/[locale]/contact` | Contact page | P3 |

---

## Component Categories to Audit

### Interactive Elements

| Component Type | Expected Touch | Icon Fill | Token Class |
|----------------|----------------|-----------|-------------|
| Header buttons | 40px | 65% (26px) | `size-(--spacing-touch)` + `size-(--size-icon-header)` |
| Nav bar buttons | 48px | 50% (24px) | `h-(--spacing-touch-lg)` + `size-(--size-icon)` |
| Primary buttons | 44-48px | N/A | `h-(--spacing-button)` or `h-(--spacing-touch-lg)` |
| Secondary buttons | 40px | N/A | `h-(--spacing-touch)` |
| Form inputs | 44px height | N/A | `h-(--spacing-input)` |
| Checkboxes | 44px touch | 24px visual | `size-(--spacing-button)` wrapper |
| Radio buttons | 44px touch | 24px visual | `size-(--spacing-button)` wrapper |
| Switches | 44px touch | Native | `h-(--spacing-button)` wrapper |
| Dropdown triggers | 44px | 20-24px icon | `h-(--spacing-input)` |
| List items (tappable) | 48px min | N/A | `min-h-(--spacing-touch-lg)` |
| Card actions | 40px | 65% | `size-(--spacing-touch)` |

### Spacing & Layout

| Element | Value | Tailwind |
|---------|-------|----------|
| Screen padding | 16px | `px-4` |
| Section gap | 24px | `gap-6` |
| Card padding | 16px | `p-4` |
| List item gap | 12px | `gap-3` |
| Icon-text gap | 8px | `gap-2` |

### Typography

| Element | Size | Tailwind |
|---------|------|----------|
| H1 (page title) | 24px | `text-2xl` |
| H2 (section title) | 20px | `text-xl` |
| Body | 16px | `text-base` |
| Secondary | 14px | `text-sm` |
| Caption | 12px | `text-xs` |

---

## Audit Process

### Step 1: Visual Inspection

1. Open Chrome DevTools
2. Set viewport to 375×667 (iPhone SE)
3. Enable touch simulation
4. Navigate to each route
5. Screenshot any issues

### Step 2: Touch Target Validation

```bash
# Run in browser console on each page
document.querySelectorAll('button, a, [role="button"]').forEach(el => {
  const rect = el.getBoundingClientRect();
  if (rect.width < 24 || rect.height < 24) {
    console.warn('Small target:', el, rect.width, rect.height);
  }
});
```

### Step 3: Code Review

Search for anti-patterns:

```bash
# Find hardcoded arbitrary sizes (should use tokens)
grep -rn "size-\[.*px\]\|h-\[.*px\]\|w-\[.*px\]" components/

# Find small icon sizes that may need token replacement
grep -rn "size-4\|size-5\|h-6\|w-6" components/
grep -rn "size={16}\|size={18}\|size={20}" components/

# Find missing touch overrides on Button size="icon"
grep -rn 'size="icon"' components/ | grep -v "spacing-touch\|size-icon"

# Verify token usage (should see these patterns)
grep -rn "spacing-touch\|size-icon" components/
```

### Step 4: Document Issues

Create issue in format:

```markdown
### [Component Name]

**File:** `path/to/file.tsx`  
**Issue:** Description of problem  
**Current:** `size-8` (32px) or `size-[20px]`  
**Expected:** `size-(--spacing-touch)` (40px)  
**Icon fix:** `size-(--size-icon-header)` (26px)  
**Screenshot:** [attach]
```

---

## Known Files Already Fixed

✅ `components/layout/sidebar/sidebar-menu-v2.tsx` — 40px/26px  
✅ `components/dropdowns/notifications-dropdown.tsx` — 40px/26px  
✅ `components/shared/wishlist/mobile-wishlist-button.tsx` — 40px/26px  
✅ `components/layout/header/cart/mobile-cart-dropdown.tsx` — 40px/26px  
✅ `components/layout/header/site-header.tsx` — 40px/26px back button  
✅ `components/mobile/mobile-tab-bar.tsx` — 48px/24px

---

## Files to Audit

### High Priority (likely issues)

- [ ] `components/mobile/mobile-search-trigger.tsx`
- [ ] `components/mobile/filters/mobile-filter-drawer.tsx`
- [ ] `components/mobile/filters/mobile-sort-button.tsx`
- [ ] `components/auth/*` — All auth forms
- [ ] `components/buyer/*` — Buyer components
- [ ] `components/orders/*` — Order components
- [ ] `components/seller/*` — Seller dashboard

### Medium Priority

- [ ] `components/category/*`
- [ ] `components/pricing/*`
- [ ] `components/promo/*`
- [ ] `components/sections/*`
- [ ] `components/support/*`

### Shared Components (affects many routes)

- [ ] `components/ui/button.tsx` — Verify variants
- [ ] `components/ui/input.tsx` — Height ≥44px
- [ ] `components/ui/select.tsx` — Trigger height
- [ ] `components/ui/checkbox.tsx` — Touch area
- [ ] `components/ui/switch.tsx` — Touch area
- [ ] `components/ui/dropdown-menu.tsx` — Item heights
- [ ] `components/ui/dialog.tsx` — Close button
- [ ] `components/ui/sheet.tsx` — Close button
- [ ] `components/ui/card.tsx` — Action buttons

---

## Acceptance Criteria

A route passes audit when:

1. ✅ All touch targets ≥40px (buttons) or ≥24px+spacing
2. ✅ Icons follow 65% fill ratio (header) or 50% (nav)
3. ✅ **Uses design tokens** (`--spacing-touch-*`, `--size-icon-*`) not arbitrary values
4. ✅ No horizontal scroll on 375px viewport
5. ✅ All text readable without zooming
6. ✅ No content hidden under notch/nav bar
7. ✅ All interactive elements reachable with one hand
8. ✅ Loading states visible during data fetch
9. ✅ Error states clearly communicated
10. ✅ Typecheck passes
11. ✅ E2E smoke tests pass

---

## Execution Order

1. **Week 1:** Phase 1 (Core Nav) + Phase 4 (Cart/Checkout) + Phase 5 (Auth)
2. **Week 2:** Phase 2 (Product/Category)
3. **Week 3:** Phase 3 (Account) + Phase 7 (Support)
4. **Week 4:** Phase 6 (Seller)

---

## Commands

```bash
# Dev server
pnpm dev

# Typecheck after changes
pnpm -s exec tsc -p tsconfig.json --noEmit

# E2E smoke
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke

# Find all mobile components
find components -name "*mobile*" -o -name "*Mobile*"
```

---

## Reference Docs

- [MOBILE-TOUCH-TARGETS.md](./MOBILE-TOUCH-TARGETS.md) — Implementation guide & token reference
- [../DESIGN.md](../DESIGN.md) — Design tokens
- [../ENGINEERING.md](../ENGINEERING.md) — Code standards

## Design Tokens Quick Reference

```css
/* Touch targets (globals.css @theme) */
--spacing-touch-xs: 2rem;      /* 32px */
--spacing-touch-sm: 2.25rem;   /* 36px */
--spacing-touch: 2.5rem;       /* 40px - header */
--spacing-touch-lg: 3rem;      /* 48px - bottom nav */

/* Icon sizes */
--size-icon-xs: 1.25rem;       /* 20px */
--size-icon-sm: 1.375rem;      /* 22px */
--size-icon: 1.5rem;           /* 24px - nav */
--size-icon-header: 1.625rem;  /* 26px - header */
--size-icon-lg: 1.75rem;       /* 28px */
```

**Usage:** `size-(--spacing-touch)` for 40px touch target, `size-(--size-icon-header)` for 26px icon.
