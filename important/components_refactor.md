# Components Refactoring Plan

> Generated: January 8, 2026  
> Status: In Progress  
> Goal: Break down monolithic "monster" components into clean, maintainable pieces following best practices.

---

## Executive Summary

This audit identified **18 major monster components** (300–847 lines) exhibiting anti-patterns that hurt maintainability, testability, and performance. Total: ~8,650 lines of problematic code.

| Priority | Count | Total Lines | Avg Lines |
|----------|-------|-------------|-----------|
| High     | 5     | 3,575       | 715       |
| Medium   | 10    | 4,096       | 410       |
| Low      | 3     | 975         | 325       |

---

## Anti-Patterns Detected

1. **God components** — Single component doing 5+ unrelated things
2. **Excessive hooks** — Components with 10+ useState/useEffect/useCallback
3. **Inline translations** — Large translation objects instead of next-intl
4. **Mixed concerns** — Data fetching + realtime + state + UI all in one
5. **Code duplication** — Mobile/desktop variants with copy-pasted logic
6. **Deep nesting** — 5+ levels of JSX nesting
7. **Large inline types** — 50+ lines of interfaces at file top

---

## HIGH PRIORITY

### 1. `components/desktop/category-subheader.tsx` — 847 lines

**Problems:**
- God component rendering 11 sub-components inline
- 6+ useState, 3 useRef, 4 useCallback, 2 useEffect
- Menu panel rendering has 5+ levels of nesting
- Utility functions mixed with component code

**Refactoring Plan:**

```
components/desktop/category-subheader/
├── index.tsx                    # Main orchestrator (~150 lines)
├── category-dropdown.tsx        # Individual dropdown (~100 lines)
├── mega-menu-panel.tsx          # Full mega menu (~120 lines)
├── ebay-style-menu.tsx          # eBay-style variant (~80 lines)
├── banner-cta-menu.tsx          # Banner CTA variant (~60 lines)
├── simple-grid-menu.tsx         # Grid layout (~60 lines)
├── category-skeleton.tsx        # Loading state (~40 lines)
├── use-category-subheader.ts    # Custom hook for all state (~80 lines)
└── utils.ts                     # formatCategoryName, etc. (~30 lines)
```

**Steps:**
1. Extract `formatCategoryName` and helpers to `utils.ts`
2. Create `use-category-subheader.ts` hook with all state/handlers
3. Extract each menu variant to its own file
4. Slim down `index.tsx` to pure composition

**Verification:** Typecheck + visual regression on category pages

---

### 2. `components/seller/seller-onboarding.tsx` — 806 lines

**Problems:**
- All 5 wizard steps in one component
- 16 useState hooks managing form fields
- 100+ lines of inline translations (violates next-intl rule)
- Large AnimatePresence with 5 conditional renders

**Refactoring Plan:**

```
components/seller/onboarding/
├── index.tsx                      # Wizard orchestrator (~100 lines)
├── steps/
│   ├── intent-step.tsx            # Step 1 (~80 lines)
│   ├── profile-step.tsx           # Step 2 (~100 lines)
│   ├── social-step.tsx            # Step 3 (~80 lines)
│   ├── business-step.tsx          # Step 4 (~100 lines)
│   └── complete-step.tsx          # Step 5 (~60 lines)
├── use-onboarding-form.ts         # Form state hook (~120 lines)
└── onboarding-context.tsx         # Step navigation context (~50 lines)

messages/
├── en.json  # Add seller.onboarding.* keys
└── bg.json  # Add seller.onboarding.* keys
```

**Steps:**
1. Move all translations to `messages/en.json` and `messages/bg.json`
2. Create `use-onboarding-form.ts` with useReducer for form state
3. Extract each step to its own component
4. Create thin `OnboardingContext` for step navigation
5. Simplify `index.tsx` to orchestration only

**Verification:** Typecheck + E2E seller onboarding flow

---

### 3. `components/providers/message-context.tsx` — ~~701 lines~~ ✅ COMPLETED (119 lines)

**Status:** ✅ Refactored on January 8, 2026

**Problems:**
- Provider handles fetching, realtime subscriptions, state, and transforms
- 60+ lines of inline type definitions
- 8+ useCallback definitions
- Complex Supabase realtime logic mixed with context

**Refactoring Plan:**

```
lib/types/messages.ts              # All message types (166 lines) ✅
lib/supabase/messages.ts           # Pure fetch functions (303 lines) ✅

hooks/
├── use-messages-state.ts          # State management (256 lines) ✅
├── use-messages-realtime.ts       # Realtime subscriptions (174 lines) ✅
└── use-messages-actions.ts        # Send/mark read actions (180 lines) ✅

components/providers/
└── message-context.tsx            # Thin context wrapper (119 lines) ✅
```

**Steps Completed:**
1. ✅ Extract all interfaces to `lib/types/messages.ts`
2. ✅ Move Supabase queries to `lib/supabase/messages.ts` (pure functions)
3. ✅ Create `use-messages-realtime.ts` for subscription logic
4. ✅ Create `use-messages-state.ts` for state management
5. ✅ Create `use-messages-actions.ts` for send/mark read/close/start actions
6. ✅ Slim `message-context.tsx` to just context provider

**Verification:** ✅ Typecheck passes (no new errors introduced)

---

### 4. `components/ui/sidebar.tsx` — 678 lines

**Problems:**
- 20+ components exported from one file
- Complex CVA variants for menu buttons
- Context provider mixed with primitives

**Refactoring Plan:**

```
components/ui/sidebar/
├── index.tsx                      # Re-exports (~20 lines)
├── sidebar-context.tsx            # Provider + useSidebar hook (~80 lines)
├── sidebar-primitives.tsx         # Sidebar, Content, Header, Footer (~150 lines)
├── sidebar-menu.tsx               # Menu components (~200 lines)
├── sidebar-trigger.tsx            # Trigger + Rail (~80 lines)
└── sidebar-variants.ts            # CVA definitions (~50 lines)
```

**Steps:**
1. Extract context to `sidebar-context.tsx`
2. Group menu components in `sidebar-menu.tsx`
3. Move CVA variants to `sidebar-variants.ts`
4. Create barrel `index.tsx` for backwards compatibility

**Verification:** Typecheck + visual check on seller dashboard

---

### 5. `components/layout/notifications-dropdown.tsx` — 543 lines

**Problems:**
- 7 useCallback, 5 useEffect
- 6 utility functions defined inline
- Realtime subscriptions mixed with UI
- Toast notifications, fetching, and rendering all in one

**Refactoring Plan:**

```
lib/notifications.ts               # Pure helpers (~60 lines)
  - formatNotificationTime
  - getNotificationIcon
  - groupNotificationsByDate
  - markNotificationRead

hooks/
├── use-notifications.ts           # State + fetching (~100 lines)
└── use-notifications-realtime.ts  # Realtime subscriptions (~80 lines)

components/layout/
├── notifications-dropdown.tsx     # UI only (~150 lines)
└── notifications-list.tsx         # List rendering (~80 lines)
```

**Steps:**
1. Extract helpers to `lib/notifications.ts`
2. Create `use-notifications.ts` hook for state
3. Create `use-notifications-realtime.ts` for subscriptions
4. Extract `NotificationsList` sub-component
5. Slim main component to UI orchestration

**Verification:** Typecheck + notification interaction test

---

## MEDIUM PRIORITY

### 6. `components/desktop/desktop-filter-modal.tsx` — 492 lines

**Problems:**
- Large form state management with pending filters
- Complex conditional rendering for attribute types
- Inline `FilterChip` sub-component

**Refactoring Plan:**

```
components/desktop/filters/
├── desktop-filter-modal.tsx       # Main modal (~200 lines)
├── filter-chip.tsx                # Extracted chip (~40 lines)
├── attribute-filters/
│   ├── boolean-filter.tsx         # (~40 lines)
│   ├── number-filter.tsx          # (~50 lines)
│   └── select-filter.tsx          # (~50 lines)

hooks/
└── use-filter-state.ts            # Shared filter logic (~100 lines)
```

---

### 7. `components/mobile/mobile-filter-modal.tsx` — 453 lines

**Problems:**
- Duplicate logic with desktop-filter-modal
- Same pending state management pattern

**Refactoring Plan:**
- Share `use-filter-state.ts` hook with desktop version
- Extract common filter components to `components/shared/filters/`
- Keep mobile-specific layout in `mobile-filter-modal.tsx`

---

### 8. `components/desktop/tabbed-product-feed.tsx` — 431 lines

**Problems:**
- 70+ line `fetchProducts` function inline
- Large product transformation logic
- Complex useEffect dependencies

**Refactoring Plan:**

```
lib/api/products-feed.ts           # fetchProductsByTab (~100 lines)
config/product-feed-tabs.ts        # Tab configuration (~30 lines)

hooks/
└── use-product-feed.ts            # State + fetching (~80 lines)

components/desktop/
└── tabbed-product-feed.tsx        # UI only (~150 lines)
```

---

### 9. `components/desktop/scrollable-product-feed.tsx` — 430 lines

**Problems:**
- Duplicate feed logic with tabbed-product-feed
- Intersection Observer logic mixed in

**Refactoring Plan:**
- Share `use-product-feed.ts` hook
- Extract `use-intersection-observer.ts` to `hooks/`
- Consider consolidating with `tabbed-product-feed` if they serve same purpose

---

### 10. `components/mobile/mobile-search-overlay.tsx` — 420 lines

**Problems:**
- Full-screen modal logic inline (scroll lock, escape handler)
- Duplicate search logic with desktop

**Refactoring Plan:**

```
hooks/
├── use-search-overlay.ts          # Modal state management (~60 lines)
└── use-search.ts                  # Already exists - good!

components/shared/search/
├── search-product-result.tsx      # (~50 lines)
├── search-trending-item.tsx       # (~30 lines)
└── search-recent-item.tsx         # (~30 lines)
```

---

### 11. `components/orders/order-detail.tsx` — 414 lines

**Problems:**
- 3 separate dialogs inline (rating, cancel, issue)
- 50+ inline translation strings
- Multiple async handlers

**Refactoring Plan:**

```
components/orders/
├── order-detail.tsx               # Main component (~200 lines)
├── dialogs/
│   ├── cancel-order-dialog.tsx    # (~60 lines)
│   ├── report-issue-dialog.tsx    # (~60 lines)
│   └── rate-order-dialog.tsx      # (~60 lines)

hooks/
└── use-order-actions.ts           # Shared action logic (~80 lines)

messages/
├── en.json  # Add orders.detail.* keys
└── bg.json  # Add orders.detail.* keys
```

---

### 12. `components/desktop/desktop-search-popover.tsx` — 394 lines

**Problems:**
- Complex popover with multiple sections
- Duplicate logic with mobile search

**Refactoring Plan:**
- Share search result components with mobile (see #10)
- Use same `use-search.ts` hook

---

### 13. `components/support/chat-button.tsx` — 385 lines

**Problems:**
- Chat + UI + auth logic all mixed
- Message fetching and realtime inline

**Refactoring Plan:**

```
hooks/
└── use-support-chat.ts            # State + realtime (~120 lines)

components/support/
├── chat-button.tsx                # Trigger only (~80 lines)
├── chat-window.tsx                # Chat UI (~120 lines)
└── chat-message.tsx               # Message rendering (~50 lines)
```

---

### 14. `components/buyer/product-buy-box.tsx` — 387 lines

**Problems:**
- Complex form with variant selection
- Price calculation logic inline
- Large type definitions

**Refactoring Plan:**

```
lib/types/product.ts               # Product types (~40 lines)

hooks/
└── use-product-buy-box.ts         # Price/variant logic (~100 lines)

components/buyer/
├── product-buy-box.tsx            # Main component (~150 lines)
└── variant-selector.tsx           # Extracted (~80 lines)
```

---

### 15. `components/shared/product-card.tsx` — 371 lines

**Problems:**
- Multiple components in one file
- 40+ inline translation strings

**Refactoring Plan:**

```
components/shared/
├── product-card.tsx               # Single card (~150 lines)
└── product-card-grid.tsx          # Grid wrapper (~50 lines)

messages/
├── en.json  # Add product.card.* keys
└── bg.json  # Add product.card.* keys
```

---

## LOW PRIORITY

### 16. `components/pricing/pricing-card.tsx` — 371 lines

**Problems:**
- Complex conditional rendering for different plan states (current, upgrade, downgrade)
- Feature list rendering with icons and tooltips mixed in
- Price display logic with multiple formats
- CTA button logic varies by plan type

**Refactoring Plan:**

```
components/pricing/
├── pricing-card.tsx               # Main card (~150 lines)
├── plan-feature-list.tsx          # Feature list extraction (~80 lines)
├── plan-price-display.tsx         # Price formatting (~50 lines)
└── plan-cta-button.tsx            # CTA with plan-specific logic (~60 lines)

lib/pricing/
└── plan-utils.ts                  # Plan state helpers, transforms (~40 lines)
```

---

### 17. `components/mobile/mobile-product-detail-client.tsx` — 304 lines
- Well-structured, uses composition
- Minor: Large props interface could use discriminated unions

### 18. `app/[locale]/(buyer)/cart/page.tsx` — 300 lines
- Page-level component, some complexity expected
- Minor: Could extract sticky footer

---

## Execution Order

| Phase | Components | Est. Effort | Dependencies | Status |
|-------|------------|-------------|--------------|--------|
| 1 | message-context.tsx | 2-3 hours | None | ✅ DONE |
| 2 | seller-onboarding.tsx | 3-4 hours | next-intl messages | Pending |
| 3 | category-subheader.tsx | 3-4 hours | None | Pending |
| 4 | notifications-dropdown.tsx | 2-3 hours | None | Pending |
| 5 | filter-modals (desktop + mobile) | 2-3 hours | Shared hook | Pending |
| 6 | product-feeds (tabbed + scrollable) | 2 hours | Shared hook | Pending |
| 7 | search components (mobile + desktop) | 2 hours | Shared components | Pending |
| 8 | order-detail.tsx | 1-2 hours | next-intl messages | Pending |
| 9 | chat-button.tsx | 1-2 hours | None | Pending |
| 10 | product-buy-box.tsx | 1-2 hours | None | Pending |
| 11 | sidebar.tsx | 2 hours | None | Pending |
| 12 | product-card.tsx | 1 hour | next-intl messages | Pending |
| 13 | pricing-card.tsx | 1 hour | None | Pending |

**Total estimated effort:** 23-32 hours (1 phase complete)

---

## Verification Checklist (Per Refactor)

- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit` passes
- [ ] `pnpm test:unit` passes (if tests exist for component)
- [ ] `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke` passes
- [ ] Visual regression check in browser
- [ ] No new ESLint warnings about cross-boundary imports

---

## Success Metrics

| Metric | Before | Target |
|--------|--------|--------|
| Max component lines | 847 | <250 |
| Inline translations | ~500 strings | 0 |
| Duplicate hooks | ~10 | 0 |
| God components | 5 | 0 |
| Avg component lines | 487 | <200 |

---

## Files to Create (Summary)

### New Hooks
- `hooks/use-category-subheader.ts`
- `hooks/use-onboarding-form.ts`
- `hooks/use-messages-state.ts`
- `hooks/use-messages-realtime.ts`
- `hooks/use-messages-actions.ts`
- `hooks/use-notifications.ts`
- `hooks/use-notifications-realtime.ts`
- `hooks/use-filter-state.ts`
- `hooks/use-product-feed.ts`
- `hooks/use-intersection-observer.ts`
- `hooks/use-search-overlay.ts`
- `hooks/use-order-actions.ts`
- `hooks/use-support-chat.ts`
- `hooks/use-product-buy-box.ts`

### New Lib Files
- `lib/types/messages.ts`
- `lib/supabase/messages.ts`
- `lib/notifications.ts`
- `lib/api/products-feed.ts`
- `lib/types/product.ts`
- `lib/pricing/plan-utils.ts`

### New Config Files
- `config/product-feed-tabs.ts`

### Translation Keys to Add
- `seller.onboarding.*`
- `orders.detail.*`
- `product.card.*`

---

## Notes

- Each refactor should be a single PR (1-3 files changed max per commit)
- Run verification gates after each extraction
- Preserve exact behavior—no redesigns during refactoring
- Delete dead code rather than reorganizing
