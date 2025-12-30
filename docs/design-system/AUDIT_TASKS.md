# UI/UX Audit Tasks

> **Goal:** Beat Temu/eBay/Shein on both mobile and desktop C2C/B2B marketplace UX.  
> **Reference:** [DESIGN.md](./DESIGN.md) | [tokens.md](./tokens.md)  
> **Last Audit:** 2024-12-30

---

## 🚨 Critical Violations (Fix Immediately)

### Active Scale Transforms
Found `active:scale-*` which is forbidden. Fix these:

| File | Line | Issue |
|------|------|-------|
| `components/shared/product/product-buy-box.tsx` | ~236 | `active:scale-[0.98]` on Buy Now button |
| `components/shared/product/product-buy-box.tsx` | ~239 | `active:scale-[0.98]` on Add to Cart button |
| `components/shared/product/product-buy-box.tsx` | ~242 | `active:scale-[0.98]` on Wishlist button |

**Fix:** Remove all `active:scale-*` classes.

### Forbidden Animations
| File | Issue |
|------|-------|
| `components/shared/coming-soon-page.tsx` | `animate-pulse` on Bell icon |

**Fix:** Remove `animate-pulse`, use static icon.

### Over-Rounded Cards
Found `rounded-xl` / `rounded-lg` on cards (max should be `rounded-md`):

| File | Issue |
|------|-------|
| `components/ui/card.tsx` | Uses `rounded-xl` |
| `components/desktop/marketplace-hero.tsx` | Uses `rounded-xl` |
| `components/shared/product/product-carousel-section.tsx` | Uses `rounded-xl` |
| `components/shared/product/product-gallery-hybrid.tsx` | Uses `rounded-xl` |
| `components/shared/product/product-buy-box.tsx` | Uses `rounded-xl` |
| `components/shared/product/customer-reviews-hybrid.tsx` | Uses `rounded-xl` |

**Fix:** Replace with `rounded-md` (6px max for cards).

---

## Phase 1: Foundation (Token Sync) ✅

### 1.1 CSS Variables
- [x] Badge OKLCH tokens in `globals.css`
- [x] Price tokens (`--color-price-sale`, `--color-price-regular`, `--color-price-original`)
- [x] Touch target CSS variables
- [x] All tokens match spec

### 1.2 Tailwind Config
- [x] Colors extended with badge tokens
- [x] `gap-1.5` available (mobile grid)
- [x] Breakpoint values match spec

### 1.3 Contrast Audit
- [ ] Run contrast check on ALL existing badges
- [ ] Fix any badge using `bg-*/10 text-*` pattern (broken contrast)
- [ ] Document all badge variants with contrast ratios

---

## Phase 2: Core Components

### 2.1 ProductCard ✅ (Mostly compliant)
| Task | Status | Notes |
|------|--------|-------|
| Grid gap `gap-1.5` (6px) | ✅ | Implemented |
| Image `aspect-[4/5]` or square | ✅ | Using aspect-[4/5] |
| Price 16px bold largest | ✅ | `text-base font-bold` |
| Title 13px `line-clamp-2` | ✅ | `text-[13px]` |
| Meta 11px muted | ✅ | `text-[11px]` |
| Wishlist 28px | ✅ | `size-7` |
| Quick-add 32px | ✅ | `size-8` |
| No hover scale | ✅ | Blocked globally |
| No shimmer skeleton | ✅ | Static gray blocks |

### 2.2 PriceDisplay Component
- [ ] Verify consistent hierarchy across all price displays
- [ ] Audit `formatPrice()` usage for consistency
- [ ] Ensure `--color-price-sale` used for discounts

### 2.3 Badge System
- [ ] Audit all badge variants for contrast
- [ ] Implement sizing scale (16/20/24/28px heights)
- [ ] Mobile: verify icon-only with `sr-only` text
- [ ] Remove any shimmer/glow effects

### 2.4 Buttons ✅
| Task | Status | Notes |
|------|--------|-------|
| Default 32px (`h-8`) | ✅ | button.tsx |
| Primary CTA 40px (`h-10`) | ✅ | `size="lg"` |
| Icon buttons 28-36px | ✅ | `icon-sm`, `icon`, `icon-lg` |
| No `active:scale-*` | ❌ | **VIOLATION** in product-buy-box |

---

## Phase 3: Navigation & Layout

### 3.1 Mobile Product Grid ✅
- [x] `gap-1.5` (6px) horizontal
- [x] `gap-2` (8px) vertical  
- [x] `px-2` (8px) side padding

### 3.2 Desktop Grid
- [ ] Verify 4-6 columns with `gap-3`
- [ ] Audit filter sidebar spacing

### 3.3 Bottom Navigation
- [ ] Verify 56px + safe area height
- [ ] Icon size 24px
- [ ] Label size 10px

---

## Phase 4: Images & Performance

### 4.1 Image Optimization
- [ ] Audit all `<Image>` components for `sizes` prop
- [ ] Ensure mobile doesn't download desktop images
- [ ] Verify explicit aspect ratios on all images

### 4.2 Skeleton Rules
- [x] No shimmer/pulse on product card skeletons
- [ ] Audit other skeletons for animations
- [ ] Verify skeleton dimensions match content

### 4.3 CLS Prevention
- [ ] Test CLS score < 0.1
- [ ] Verify no layout shift on image load

---

## Phase 5: Forms & Inputs

### 5.1 Input Sizing
- [x] 16px font on mobile inputs (iOS zoom)
- [ ] Audit all inputs for consistent 32px height
- [ ] Verify inline validation

---

## Phase 6: Motion Audit

### 6.1 Forbidden Animations Found
| Animation | Files |
|-----------|-------|
| `animate-pulse` | coming-soon-page.tsx |
| `animate-spin` | Various (allowed for loading) |
| `active:scale-*` | product-buy-box.tsx |

### 6.2 Allowed Animations (OK)
- `animate-spin` on loading spinners (bounded, < 2s) ✅
- `animate-in` / `animate-out` on modals/sheets ✅
- `animate-accordion-*` on accordions ✅

---

## Phase 7: Border Radius Audit

### Components Using rounded-xl (SHOULD BE rounded-md)
```
components/ui/card.tsx                           - rounded-xl
components/desktop/marketplace-hero.tsx          - rounded-xl  
components/shared/product/product-carousel-section.tsx - rounded-xl
components/shared/product/product-gallery-hybrid.tsx  - rounded-xl
components/shared/product/product-buy-box.tsx    - rounded-xl
components/shared/product/customer-reviews-hybrid.tsx - rounded-xl
components/shared/product/mobile-accordions.tsx  - rounded-lg
components/support/support-chat-widget.tsx       - rounded-lg
components/shared/search/sort-select.tsx         - rounded-lg
components/shared/search/mobile-search-overlay.tsx - rounded-lg
```

---

## QA Checklist

### Contrast Testing
- [ ] Test all badge variants (light mode)
- [ ] Test all badge variants (dark mode)
- [ ] Test price colors on all backgrounds

### Touch Target Testing  
- [ ] Primary actions ≥40px
- [ ] Secondary actions ≥32px
- [ ] All interactive ≥24px

### Performance Testing
- [ ] CLS < 0.1
- [ ] LCP < 2.5s
- [ ] No shimmer causing repaints

### 7.4 Responsive Testing
| Breakpoint | Width | Test |
|------------|-------|------|
| Mobile S | 360px | Grid 2-col, gap-1.5 |
| Mobile L | 430px | Grid 2-col, gap-1.5 |
| Tablet | 768px | Grid 3-col |
| Desktop | 1024px | Grid 4-col + rail |
| Wide | 1440px | Grid 5-6 col |

---

## Execution Order

```
1. Phase 1 (Foundation) → Must complete first
2. Phase 2.1-2.3 (ProductCard, Price, Badges) → Core conversion elements
3. Phase 3.1-3.2 (Tabs, Mobile Grid) → UX improvement
4. Phase 4 (Images) → Performance
5. Phase 6 (Motion) → Quick wins
6. Phase 5 (Forms) → Polish
7. Phase 7 (QA) → Verify everything
```

---

## Progress Tracking

| Phase | Status | Completion |
|-------|--------|------------|
| 1. Foundation | ⬜ Not Started | 0% |
| 2. Core Components | ⬜ Not Started | 0% |
| 3. Navigation & Layout | ⬜ Not Started | 0% |
| 4. Images & Performance | ⬜ Not Started | 0% |
| 5. Forms & Inputs | ⬜ Not Started | 0% |
| 6. Motion Audit | ⬜ Not Started | 0% |
| 7. QA Checklist | ⬜ Not Started | 0% |

---

## Notes

- Mobile-first: all tasks apply to mobile first, then scale up
- No separate mobile/desktop docs — unified system with breakpoint-specific notes
- Reference `_MASTER.md` for rationale on any decision
- Update this file as tasks complete with ✅
