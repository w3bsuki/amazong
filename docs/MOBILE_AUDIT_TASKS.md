# Mobile UI/UX Audit Tasks

> **Created:** 2025-12-29  
> **Purpose:** Systematic audit and standardization of all mobile UI/UX  
> **Reference:** [MOBILE_DESIGN_SYSTEM.md](./MOBILE_DESIGN_SYSTEM.md)  
> **Status:** 🟡 In Progress

---

## 📋 Executive Summary

This document tracks all mobile UI/UX audit tasks to ensure WCAG 2.2 AA compliance and consistent implementation of our design system across the mobile experience.

### Design Decision: 40px Max Standard

> **Important:** Our dense marketplace UI caps primary touch targets at **40px** (`h-10`), not 44px.
> This is intentional—WCAG 2.2 AA only requires **24px minimum** (with spacing exception).
> The old 44px guideline was WCAG 2.1 AAA (Target Size Enhanced), not required for AA compliance.
> 
> **Touch Target Scale:**
> - 24px — WCAG 2.2 floor (with spacing)
> - 32px — Dense buttons (`h-8`)
> - 36px — Standard buttons (`h-9`)
> - 40px — **Max standard** for inputs, primary CTAs (`h-10`)
> - 48px — Hero only, rare exception (`h-12`)

### Quick Stats

| Metric | Target | Current Status |
|--------|--------|----------------|
| Touch Targets | ≥24px (36px standard, 40px max) | 🟡 Needs audit |
| Text Contrast | 4.5:1 minimum | 🟡 Needs verification |
| Focus Visibility | 3:1 ring contrast | 🟡 Needs audit |
| Drag Alternatives | 100% coverage | 🟡 Needs audit |
| Typography | text-sm (14px) min body | 🟡 Needs verification |

---

## 🎯 Phase 1: Foundation Audit (High Priority)

### 1.1 Touch Target Compliance

Verify all interactive elements meet WCAG 2.2 minimum (24px) or our standard (36px).

| Task | File/Component | Status | Notes |
|------|----------------|--------|-------|
| 1.1.1 | `components/ui/button.tsx` | ⬜ TODO | Verify all size variants |
| 1.1.2 | `components/mobile/mobile-tab-bar.tsx` | ⬜ TODO | Bottom nav icons ≥40px |
| 1.1.3 | `components/mobile/mobile-menu-sheet.tsx` | ⬜ TODO | Menu items ≥40px height |
| 1.1.4 | `components/shared/product/product-card.tsx` | ⬜ TODO | Wishlist button ≥36px |
| 1.1.5 | `components/mobile/product/*.tsx` | ⬜ TODO | All product page buttons |
| 1.1.6 | `components/ui/input.tsx` | ⬜ TODO | Input height ≥40px mobile |
| 1.1.7 | `components/ui/checkbox.tsx` | ⬜ TODO | Checkbox ≥24px + spacing |
| 1.1.8 | `components/ui/radio-group.tsx` | ⬜ TODO | Radio ≥24px + spacing |
| 1.1.9 | `components/ui/select.tsx` | ⬜ TODO | Select trigger ≥40px |
| 1.1.10 | `components/shared/search/*.tsx` | ⬜ TODO | Search buttons/icons |

**Acceptance Criteria:**
- [ ] No interactive element < 24px without spacing exception
- [ ] Primary CTAs are 40px (`h-10`) - dense marketplace max
- [ ] Standard buttons are 36px (`h-9`)
- [ ] Icon buttons are 36px (`size-9`)
- [ ] Form inputs are 40px (`h-10`)

---

### 1.2 Typography Standards

Ensure all text meets minimum size and contrast requirements.

| Task | File/Component | Status | Notes |
|------|----------------|--------|-------|
| 1.2.1 | `app/globals.css` | ⬜ TODO | Verify font size tokens |
| 1.2.2 | `components/mobile/product/mobile-price-block.tsx` | ⬜ TODO | Price ≥16px (text-base) |
| 1.2.3 | `components/mobile/product/mobile-product-header.tsx` | ⬜ TODO | Title sizing |
| 1.2.4 | `components/shared/product/product-card.tsx` | ⬜ TODO | Card text ≥14px |
| 1.2.5 | `components/ui/badge.tsx` | ⬜ TODO | Badge 10px is OK (decoration) |
| 1.2.6 | `components/navigation/*.tsx` | ⬜ TODO | Nav label sizing |
| 1.2.7 | `components/mobile/product/mobile-seller-trust-line.tsx` | ⬜ TODO | Meta text ≥12px |
| 1.2.8 | All mobile components | ⬜ TODO | No body text < 14px |

**Acceptance Criteria:**
- [ ] Body text minimum: 14px (`text-sm`)
- [ ] Prices: 16px+ (`text-base`) with `font-semibold`
- [ ] Meta/caption: 12px (`text-xs`) minimum
- [ ] Input text: 16px to prevent iOS zoom
- [ ] No arbitrary sizes like `text-[13px]`

---

### 1.3 Color & Contrast Audit

Verify OKLCH colors and WCAG contrast ratios.

| Task | File/Component | Status | Notes |
|------|----------------|--------|-------|
| 1.3.1 | `app/globals.css` | ⬜ TODO | Verify OKLCH tokens |
| 1.3.2 | `components/pricing/*.tsx` | ⬜ TODO | Price colors 4.5:1+ |
| 1.3.3 | `components/ui/badge.tsx` | ⬜ TODO | Badge text contrast |
| 1.3.4 | `components/mobile/product/mobile-urgency-banner.tsx` | ⬜ TODO | Urgency colors |
| 1.3.5 | `components/mobile/product/mobile-badges-row.tsx` | ⬜ TODO | Badge readability |
| 1.3.6 | All `text-muted-foreground` usage | ⬜ TODO | 4.5:1 minimum |
| 1.3.7 | Error/success/warning states | ⬜ TODO | Status color contrast |
| 1.3.8 | Dark mode colors | ⬜ TODO | Verify dark mode contrast |

**Acceptance Criteria:**
- [ ] Body text: 4.5:1 contrast minimum
- [ ] Large text (18px+): 3:1 minimum
- [ ] UI components: 3:1 minimum
- [ ] Focus indicators: 3:1 minimum
- [ ] No hardcoded hex colors (use OKLCH tokens)

---

## 🎯 Phase 2: Component Audit (Medium Priority)

### 2.1 Mobile Product Page Components

| Task | File | Status | Audit Items |
|------|------|--------|-------------|
| 2.1.1 | `mobile-product-page.tsx` | ⬜ TODO | Layout, spacing, safe areas |
| 2.1.2 | `mobile-product-header.tsx` | ⬜ TODO | Title, breadcrumbs, actions |
| 2.1.3 | `mobile-price-block.tsx` | ⬜ TODO | Price hierarchy, savings |
| 2.1.4 | `mobile-badges-row.tsx` | ⬜ TODO | Badge sizing, touch targets |
| 2.1.5 | `mobile-quick-specs.tsx` | ⬜ TODO | Spec layout, readability |
| 2.1.6 | `mobile-seller-trust-line.tsx` | ⬜ TODO | Trust signals, iconography |
| 2.1.7 | `mobile-trust-block.tsx` | ⬜ TODO | Trust badges, icons |
| 2.1.8 | `mobile-urgency-banner.tsx` | ⬜ TODO | Animation, contrast |
| 2.1.9 | `mobile-sticky-bar-enhanced.tsx` | ⬜ TODO | CTA sizing, safe area |
| 2.1.10 | `mobile-product-info.tsx` | ⬜ TODO | Info cards, accordions |

**Checklist per component:**
- [ ] Touch targets WCAG 2.2 compliant
- [ ] Typography matches design system
- [ ] Spacing uses 4px grid
- [ ] Colors use OKLCH tokens
- [ ] Focus states visible
- [ ] Screen reader friendly

---

### 2.2 Mobile Navigation Components

| Task | File | Status | Audit Items |
|------|------|--------|-------------|
| 2.2.1 | `mobile-tab-bar.tsx` | ⬜ TODO | Icon size, labels, active state |
| 2.2.2 | `mobile-menu-sheet.tsx` | ⬜ TODO | Sheet behavior, item sizing |
| 2.2.3 | `components/navigation/*.tsx` | ⬜ TODO | All nav components |
| 2.2.4 | Breadcrumbs on mobile | ⬜ TODO | Touch targets, truncation |

**Acceptance Criteria:**
- [ ] Bottom nav icons: 40px touch target (dense UI max)
- [ ] Menu items: 40px minimum height
- [ ] Active states clearly visible
- [ ] Focus management for sheets/modals

---

### 2.3 Shared Components (Mobile Context)

| Task | File | Status | Audit Items |
|------|------|--------|-------------|
| 2.3.1 | `product-card.tsx` | ⬜ TODO | Card touch targets, image ratio |
| 2.3.2 | `product-price.tsx` | ⬜ TODO | Price display, savings |
| 2.3.3 | `product-gallery-hybrid.tsx` | ⬜ TODO | Gallery gestures, zoom |
| 2.3.4 | `customer-reviews-hybrid.tsx` | ⬜ TODO | Review cards, actions |
| 2.3.5 | `mobile-seller-card.tsx` | ⬜ TODO | Seller info card |
| 2.3.6 | `mobile-accordions.tsx` | ⬜ TODO | Accordion triggers |
| 2.3.7 | `mobile-sticky-bar.tsx` | ⬜ TODO | Legacy vs enhanced |
| 2.3.8 | `trust-badges.tsx` | ⬜ TODO | Badge icons, spacing |
| 2.3.9 | `category-rail.tsx` | ⬜ TODO | Horizontal scroll, snap |
| 2.3.10 | `star-rating-dialog.tsx` | ⬜ TODO | Rating interaction |

---

### 2.4 UI Primitives (Mobile Variants)

| Task | File | Status | Mobile-Specific Audit |
|------|------|--------|----------------------|
| 2.4.1 | `button.tsx` | ⬜ TODO | Mobile size variants |
| 2.4.2 | `input.tsx` | ⬜ TODO | 16px font (no iOS zoom) |
| 2.4.3 | `sheet.tsx` | ⬜ TODO | Bottom sheet behavior |
| 2.4.4 | `drawer.tsx` | ⬜ TODO | Drawer gestures |
| 2.4.5 | `dialog.tsx` | ⬜ TODO | Mobile dialog sizing |
| 2.4.6 | `select.tsx` | ⬜ TODO | Native select on mobile? |
| 2.4.7 | `checkbox.tsx` | ⬜ TODO | Touch target + label |
| 2.4.8 | `radio-group.tsx` | ⬜ TODO | Touch target + label |
| 2.4.9 | `tabs.tsx` | ⬜ TODO | Tab trigger sizing |
| 2.4.10 | `accordion.tsx` | ⬜ TODO | Trigger height |
| 2.4.11 | `carousel.tsx` | ⬜ TODO | Touch gestures |
| 2.4.12 | `slider.tsx` | ⬜ TODO | Drag + button alternatives |
| 2.4.13 | `toast.tsx` | ⬜ TODO | Toast positioning, actions |
| 2.4.14 | `scroll-area.tsx` | ⬜ TODO | Touch scrolling |
| 2.4.15 | `badge.tsx` | ⬜ TODO | Badge sizing consistency |

---

## 🎯 Phase 3: WCAG 2.2 Specific Compliance

### 3.1 Drag Alternatives (2.5.7)

All drag/swipe operations must have button alternatives.

> **Note:** The base `slider.tsx` component has no built-in +/- buttons.
> When using sliders, wrap with alternatives:
> ```tsx
> <div className="flex items-center gap-2">
>   <Button size="icon-sm" onClick={() => setValue(v => Math.max(min, v - step))}>−</Button>
>   <Slider value={[value]} onValueChange={([v]) => setValue(v)} min={min} max={max} step={step} />
>   <Button size="icon-sm" onClick={() => setValue(v => Math.min(max, v + step))}>+</Button>
> </div>
> ```

| Task | Component/Pattern | Status | Alternative Needed |
|------|-------------------|--------|-------------------|
| 3.1.1 | Image carousel swipe | ⬜ TODO | Arrow buttons |
| 3.1.2 | Product gallery swipe | ⬜ TODO | Dot indicators + arrows |
| 3.1.3 | Bottom sheet drag | ⬜ TODO | Close button |
| 3.1.4 | Pull-to-refresh | ⬜ TODO | Refresh button |
| 3.1.5 | Swipe-to-delete (if any) | ⬜ TODO | Delete button |
| 3.1.6 | Slider components | ⬜ TODO | +/- buttons (see pattern above) |
| 3.1.7 | Reorderable lists (if any) | ⬜ TODO | Up/down buttons |

---

### 3.2 Focus Management (2.4.11, 2.4.13)

| Task | Area | Status | Requirements |
|------|------|--------|--------------|
| 3.2.1 | Sticky header scroll margin | ⬜ TODO | `scroll-margin-top: 80px` |
| 3.2.2 | Bottom nav scroll margin | ⬜ TODO | `scroll-margin-bottom: 120px` |
| 3.2.3 | Focus ring visibility | ⬜ TODO | 2px thick, 3:1 contrast |
| 3.2.4 | Focus trap in modals | ⬜ TODO | Proper focus trapping |
| 3.2.5 | Focus return on close | ⬜ TODO | Return to trigger |

---

### 3.3 Consistent Help (3.2.6)

| Task | Page/Component | Status | Help Location |
|------|----------------|--------|---------------|
| 3.3.1 | Product page | ⬜ TODO | Consistent position |
| 3.3.2 | Checkout flow | ⬜ TODO | Same relative location |
| 3.3.3 | Account pages | ⬜ TODO | Consistent position |
| 3.3.4 | Support/FAQ links | ⬜ TODO | Predictable placement |

---

### 3.4 Redundant Entry (3.3.7)

| Task | Form/Flow | Status | Auto-fill Implementation |
|------|-----------|--------|-------------------------|
| 3.4.1 | Checkout shipping/billing | ⬜ TODO | "Same as billing" checkbox |
| 3.4.2 | Profile data in forms | ⬜ TODO | Pre-populate from profile |
| 3.4.3 | Search history | ⬜ TODO | Remember recent searches |
| 3.4.4 | Address auto-complete | ⬜ TODO | Use saved addresses |

---

### 3.5 Accessible Authentication (3.3.8)

| Task | Auth Component | Status | Requirements |
|------|----------------|--------|--------------|
| 3.5.1 | Password fields | ⬜ TODO | Allow paste, autocomplete |
| 3.5.2 | Login form | ⬜ TODO | `autocomplete="username"` |
| 3.5.3 | Password input | ⬜ TODO | `autocomplete="current-password"` |
| 3.5.4 | New password | ⬜ TODO | `autocomplete="new-password"` |
| 3.5.5 | No paste blocking | ⬜ TODO | Remove any `onPaste` prevention |

---

## 🎯 Phase 4: Page-Level Audit

### 4.1 Mobile Pages

| Task | Route/Page | Status | Audit Focus |
|------|------------|--------|-------------|
| 4.1.1 | `/` (home) | ⬜ TODO | Hero, product rails, CTAs |
| 4.1.2 | `/product/[id]` | ⬜ TODO | Full product page audit |
| 4.1.3 | `/category/[slug]` | ⬜ TODO | Filters, grid, pagination |
| 4.1.4 | `/search` | ⬜ TODO | Search results, filters |
| 4.1.5 | `/cart` | ⬜ TODO | Cart items, checkout CTA |
| 4.1.6 | `/checkout` | ⬜ TODO | Form steps, payment |
| 4.1.7 | `/account/*` | ⬜ TODO | Account management |
| 4.1.8 | `/seller/*` | ⬜ TODO | Seller dashboard mobile |
| 4.1.9 | `/auth/*` | ⬜ TODO | Login, register, forgot |
| 4.1.10 | `/orders/*` | ⬜ TODO | Order history, details |

---

## 🎯 Phase 5: Performance & Polish

### 5.1 Mobile Performance

| Task | Area | Status | Target |
|------|------|--------|--------|
| 5.1.1 | Image lazy loading | ⬜ TODO | All below-fold images |
| 5.1.2 | Font loading | ⬜ TODO | Font display swap |
| 5.1.3 | JS bundle size | ⬜ TODO | < 100KB first load |
| 5.1.4 | LCP | ⬜ TODO | < 2.5s |
| 5.1.5 | CLS | ⬜ TODO | < 0.1 |
| 5.1.6 | FID | ⬜ TODO | < 100ms |

---

### 5.2 Animation & Motion

| Task | Component | Status | Requirements |
|------|-----------|--------|--------------|
| 5.2.1 | `prefers-reduced-motion` | ⬜ TODO | Respect user preference |
| 5.2.2 | Carousel animations | ⬜ TODO | Disable when reduced |
| 5.2.3 | Loading spinners | ⬜ TODO | Static alternative |
| 5.2.4 | Sheet/drawer transitions | ⬜ TODO | Instant when reduced |

---

## 📊 Progress Tracking

### Phase Summary

| Phase | Total Tasks | Completed | Percentage |
|-------|-------------|-----------|------------|
| Phase 1: Foundation | 26 | 0 | 0% |
| Phase 2: Components | 35 | 0 | 0% |
| Phase 3: WCAG 2.2 | 21 | 0 | 0% |
| Phase 4: Pages | 10 | 0 | 0% |
| Phase 5: Performance | 10 | 0 | 0% |
| **Total** | **102** | **0** | **0%** |

---

## 🔧 How to Use This Document

### Working on a Task

1. Find task in the table above
2. Change status from `⬜ TODO` to `🟡 WIP`
3. Complete the audit/fix
4. Update status to `✅ DONE` with date
5. Add notes if needed

### Status Legend

| Symbol | Meaning |
|--------|---------|
| ⬜ TODO | Not started |
| 🟡 WIP | Work in progress |
| ✅ DONE | Completed |
| ❌ BLOCKED | Blocked by dependency |
| ⏭️ SKIP | Intentionally skipped |

### Audit Process

For each component/page:

1. **Visual Inspection**
   - Check sizing with browser dev tools
   - Verify touch targets (36px standard)
   - Check contrast ratios

2. **Code Review**
   - Verify Tailwind classes match design system
   - Check for hardcoded values
   - Ensure OKLCH color tokens used

3. **Accessibility Testing**
   - Tab through with keyboard
   - Test with VoiceOver/TalkBack
   - Verify focus visibility

4. **Document Findings**
   - Note any deviations
   - Create fix PR if needed
   - Update this document

---

## 📎 Related Documents

- [MOBILE_DESIGN_SYSTEM.md](./MOBILE_DESIGN_SYSTEM.md) - Mobile design reference
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - Master design system
- [DESKTOP_AUDIT_TASKS.md](./DESKTOP_AUDIT_TASKS.md) - Desktop audit (separate)
- [globals.css](../app/globals.css) - Token definitions

---

## 📝 Audit Log

| Date | Task | Action | By |
|------|------|--------|-----|
| 2025-12-29 | Document created | Initial task list | AI |
| | | | |

