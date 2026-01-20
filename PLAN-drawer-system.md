# Drawer System Plan — Mobile UX 2026

> **Status**: Planning  
> **Priority**: High (Production-Critical)  
> **Author**: AI Agent  
> **Created**: 2026-01-19

## Executive Summary

Implement a drawer-first mobile UX pattern across the Treido marketplace to:
- Reduce friction in browsing (no context loss)
- Enable quick previews without full navigation
- Match 2026 mobile UX expectations (Instagram, Depop, Vinted patterns)
- Improve conversion by keeping users in "flow state"

---

## Current State Analysis

### Existing Drawer Infrastructure
- ✅ `components/ui/drawer.tsx` — Vaul-based bottom drawer (production-ready)
- ✅ `components/ui/sheet.tsx` — Radix-based side sheet (production-ready)
- ✅ `MobileMenuSheet` — Category drawer already implemented
- ✅ `MobileTabBar` — 5-tab navigation (Home, Categories, Sell, Chat, Account)

### Current Navigation Pattern (Problems)
| Action | Current | Problem |
|--------|---------|---------|
| View product | Full page navigation | Loses scroll position, slow |
| Check messages | Full page `/chat` | Just want to peek at recent chats |
| Account access | Full page `/account` | Users want quick listings/orders view |
| Cart access | Full page `/cart` | Standard pattern expects drawer |

---

## Drawer System Architecture

### 1. Product Quick View Drawer ⭐ (Highest Priority)

**Trigger**: Tap on any `ProductCard` (mobile only)  
**Behavior**: Bottom drawer (80vh max), swipe to dismiss  
**URL**: No route change (state-based)

```
┌─────────────────────────────────────┐
│  ← Quick View                   ✕   │ Header (44px)
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │    Product Image Carousel   │    │ Swipeable gallery
│  │    (16:9 or square)         │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
│  Electronics > Phones               │ Category breadcrumb
│                                     │
│  iPhone 15 Pro Max 256GB            │ Title (line-clamp-2)
│  ★★★★☆ (42 reviews)                │ Social proof
│                                     │
│  €1,149.00                          │ Price (text-2xl bold)
│  Free shipping · Sofia              │ Meta
│                                     │
│  "Excellent condition, used for     │ Description preview
│   3 months only. Includes..."       │ (line-clamp-3)
│                                     │
├─────────────────────────────────────┤
│  ┌──────────────┬──────────────┐    │
│  │   💬 Chat    │  🛒 Add to   │    │ Sticky CTAs
│  │   Seller     │    Cart      │    │
│  └──────────────┴──────────────┘    │
│                                     │
│  [ View Full Listing → ]            │ Secondary CTA (subtle)
└─────────────────────────────────────┘
```

**Component**: `components/mobile/drawers/product-quick-view-drawer.tsx`

**Data Requirements**:
- Product images (array)
- Title, price, description
- Category path
- Seller info (name, avatar)
- Rating/reviews
- Stock status

**Implementation Notes**:
- Preload on `onTouchStart` for instant feel
- Use existing `ProductCard` data, no extra fetch
- Image carousel uses same `MobileGalleryOlx` component
- Respects "out of stock" state
- Closes on background tap or swipe down

---

### 2. Cart Drawer (Standard Pattern)

**Trigger**: Tap cart icon (header)  
**Behavior**: Right sheet or bottom drawer  
**URL**: No route change

```
┌─────────────────────────────────────┐
│  Cart (3 items)                 ✕   │
├─────────────────────────────────────┤
│  ┌────┐ iPhone 15 Pro          ✕    │
│  │ 📷 │ €1,149.00                   │ Item row
│  └────┘ Qty: 1  [-] [+]             │
│─────────────────────────────────────│
│  ┌────┐ AirPods Pro            ✕    │
│  │ 📷 │ €249.00                     │ Item row
│  └────┘ Qty: 1  [-] [+]             │
│─────────────────────────────────────│
│  ┌────┐ MagSafe Charger        ✕    │
│  │ 📷 │ €45.00                      │ Item row
│  └────┘ Qty: 2  [-] [+]             │
├─────────────────────────────────────┤
│  Subtotal                  €1,488.00│
│  Shipping                      Free │
│─────────────────────────────────────│
│  Total                     €1,488.00│
├─────────────────────────────────────┤
│  [ Checkout → ]                     │ Primary CTA
│  [ Continue Shopping ]              │ Text link
└─────────────────────────────────────┘
```

**Component**: `components/mobile/drawers/cart-drawer.tsx`

**Notes**:
- Uses existing `useCart` context
- Quantity adjustments inline
- Shows shipping estimate
- "Checkout" navigates to full checkout flow

---

### 3. Account Quick Access Drawer

**Trigger**: Long-press or tap Account in tab bar  
**Behavior**: Bottom drawer (configurable)  
**URL**: No route change

```
┌─────────────────────────────────────┐
│  Account                        ✕   │
├─────────────────────────────────────┤
│  ┌────┐                             │
│  │ 📷 │  John Doe                   │ Profile summary
│  └────┘  ★4.9 · 127 sales           │
│          john@example.com           │
├─────────────────────────────────────┤
│  📦 Orders           (2 pending) >  │ Quick links
│  💬 Messages         (3 unread) >   │ with badges
│  📋 My Listings      (15 active) >  │
│  ❤️ Wishlist         (8 items)  >   │
│  ⚙️ Settings                     >  │
├─────────────────────────────────────┤
│  Recent Listings                    │
│  ┌────┬────┬────┐                  │
│  │ 📷 │ 📷 │ 📷 │                  │ 3-col grid
│  │€99 │€45 │€199│                  │ (6 items max)
│  └────┴────┴────┘                  │
│  ┌────┬────┬────┐                  │
│  │ 📷 │ 📷 │ 📷 │                  │
│  │€30 │€75 │€120│                  │
│  └────┴────┴────┘                  │
├─────────────────────────────────────┤
│  [ View Full Profile → ]            │
└─────────────────────────────────────┘
```

**Component**: `components/mobile/drawers/account-drawer.tsx`

**Data Requirements**:
- User profile (name, avatar, rating)
- Unread counts (messages, orders)
- Recent listings (6 max)
- Active listing count

---

### 4. Messages Quick Access Drawer

**Trigger**: Tap Chat in tab bar (first tap shows drawer, second opens page)  
**Alternative**: Badge tap or long-press  
**Behavior**: Bottom drawer

```
┌─────────────────────────────────────┐
│  Messages (3 unread)            ✕   │
├─────────────────────────────────────┤
│  ┌────┐ Sarah M.             2m  ●  │
│  │ 📷 │ "Is this still available?"  │ Recent chat 1
│  └────┘ Re: iPhone 15 Pro           │ (with product)
│─────────────────────────────────────│
│  ┌────┐ Mike T.              1h  ●  │
│  │ 📷 │ "Thanks for the quick..."   │ Recent chat 2
│  └────┘ Re: AirPods Pro             │
│─────────────────────────────────────│
│  ┌────┐ Shop XYZ             3h  ✓  │
│  │ 📷 │ "Your order has been..."    │ Recent chat 3
│  └────┘ Re: Order #12345            │ (read)
│─────────────────────────────────────│
│  ┌────┐ Anna K.              1d  ✓  │
│  │ 📷 │ "Great, I'll take it!"      │ Recent chat 4
│  └────┘ Re: MacBook Air             │
│─────────────────────────────────────│
│  ┌────┐ Peter S.             2d  ✓  │
│  │ 📷 │ "Is the price negotiable?"  │ Recent chat 5
│  └────┘ Re: iPad Pro                │
├─────────────────────────────────────┤
│  [ View All Messages → ]            │
└─────────────────────────────────────┘
```

**Component**: `components/mobile/drawers/messages-drawer.tsx`

**Notes**:
- Shows 5 most recent conversations
- Tap conversation → opens chat interface (could be another drawer or page)
- Reuses `ConversationItem` component from existing chat UI
- Real-time badge updates via `useMessages` context

---

### 5. Filter Drawer (Already Exists - Enhance)

**Current**: `MobileCategoryBrowser` has filter drawer  
**Enhancement**: Ensure consistent drawer styling with new system

---

### 6. Sort Drawer (Already Exists - Keep)

**Current**: Bottom sheet in `control-bar.tsx`  
**Status**: ✅ Already implemented

---

## Implementation Priority

| Phase | Drawer | Impact | Effort | Files |
|-------|--------|--------|--------|-------|
| **P0** | Product Quick View | 🔴 Critical | Medium | 3-4 |
| **P1** | Cart Drawer | 🟠 High | Low | 2 |
| **P1** | Messages Drawer | 🟠 High | Low | 2 |
| **P2** | Account Drawer | 🟡 Medium | Medium | 3 |
| **P3** | Refinements | 🟢 Low | Low | Various |

---

## Technical Specifications

### Shared Drawer Provider

Create a central context for managing multiple drawers:

```tsx
// components/providers/drawer-context.tsx
interface DrawerState {
  productQuickView: { open: boolean; productId: string | null }
  cart: { open: boolean }
  messages: { open: boolean }
  account: { open: boolean }
}

interface DrawerContextValue {
  state: DrawerState
  openProductQuickView: (productId: string, product: ProductData) => void
  closeProductQuickView: () => void
  openCart: () => void
  closeCart: () => void
  openMessages: () => void
  closeMessages: () => void
  openAccount: () => void
  closeAccount: () => void
}
```

### Drawer Component Pattern

All drawers follow this structure:

```tsx
// components/mobile/drawers/[drawer-name].tsx
"use client"

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  // drawer-specific props
}

export function ExampleDrawer({ open, onOpenChange, ...props }: Props) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85dvh]">
        <DrawerHeader>
          <DrawerTitle>Title</DrawerTitle>
          <DrawerClose />
        </DrawerHeader>
        
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4">
          {/* Content */}
        </div>
        
        <DrawerFooter>
          {/* CTAs */}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
```

### ProductCard Integration

Modify `ProductCard` to support quick view:

```tsx
// In ProductCard component
const { openProductQuickView } = useDrawer()

// Mobile: open drawer instead of navigating
const handleClick = (e: React.MouseEvent) => {
  if (isMobile) {
    e.preventDefault()
    openProductQuickView(id, productData)
  }
  // Desktop: normal link navigation
}
```

### Preloading Strategy

For instant-feel UX:

```tsx
// Preload product data on touch start
const handleTouchStart = () => {
  // Prefetch any additional data needed
  // Most data already available from card props
}
```

---

## File Structure

```
components/
├── mobile/
│   └── drawers/
│       ├── index.ts                    # Barrel exports
│       ├── product-quick-view-drawer.tsx
│       ├── cart-drawer.tsx
│       ├── messages-drawer.tsx
│       └── account-drawer.tsx
├── providers/
│   └── drawer-context.tsx              # Central drawer state
└── shared/
    └── product/
        └── product-quick-view-content.tsx  # Reusable content
```

---

## UX Rules

### When to Use Drawers (Mobile)
✅ Quick previews (products, profiles, carts)
✅ Recent items lists (messages, notifications)
✅ Filter/sort controls
✅ Contextual actions (share, report, etc.)

### When NOT to Use Drawers
❌ Checkout flow (needs full focus)
❌ Product creation/editing (complex forms)
❌ Full message threads (needs scroll space)
❌ Search results (needs full screen)
❌ Settings pages (complex nested navigation)

### Drawer Sizing
| Type | Max Height | Width |
|------|------------|-------|
| Quick view | 85dvh | 100% |
| Cart | 80dvh | 100% |
| Messages | 70dvh | 100% |
| Account | 85dvh | 100% |
| Filters | 70dvh | 100% |

### Animation Specs
- Open: 300ms ease-out
- Close: 200ms ease-in
- Backdrop: 150ms fade
- Drag-to-dismiss threshold: 100px

---

## i18n Requirements

New translation keys needed:

```json
// messages/en.json
{
  "Drawers": {
    "quickView": "Quick View",
    "viewFullListing": "View Full Listing",
    "viewFullProfile": "View Full Profile",
    "viewAllMessages": "View All Messages",
    "recentListings": "Recent Listings",
    "pendingOrders": "{count} pending",
    "unreadMessages": "{count} unread",
    "activeListings": "{count} active"
  }
}
```

---

## Testing Checklist

### Per Drawer
- [ ] Opens on trigger
- [ ] Closes on backdrop tap
- [ ] Closes on swipe down
- [ ] Closes on X button
- [ ] Respects max-height
- [ ] Safe area padding (notch devices)
- [ ] Keyboard doesn't break layout
- [ ] Screen reader accessible
- [ ] Focus trapped inside drawer

### Integration
- [ ] Multiple drawers don't conflict
- [ ] Context updates propagate
- [ ] Deep links still work
- [ ] Back button behavior correct
- [ ] No scroll bleed to body

---

## Migration Notes

### ProductCard Changes
1. Add `onClick` handler for mobile
2. Pass product data to drawer context
3. Keep `Link` for desktop (SEO)
4. Add `data-product-id` for analytics

### Tab Bar Changes
1. Account tab: first tap → drawer, double tap → page
2. Chat tab: first tap → drawer, double tap → page
3. Or: always drawer, with "View All" CTA inside

### Analytics Events
```ts
// New events to track
trackEvent('drawer_open', { type: 'product_quick_view', productId })
trackEvent('drawer_close', { type: 'product_quick_view', method: 'swipe' | 'backdrop' | 'button' })
trackEvent('drawer_cta_click', { type: 'product_quick_view', action: 'add_to_cart' | 'view_full' })
```

---

## Dependencies

No new dependencies required:
- ✅ Vaul (already in `drawer.tsx`)
- ✅ Radix Dialog (already in `sheet.tsx`)
- ✅ Framer Motion (if needed for gestures - optional)

---

## Rollout Plan

### Phase 1: Foundation (Day 1-2) ✅
- [x] Create `drawer-context.tsx`
- [x] Create `ProductQuickViewDrawer` component
- [x] Integrate with `ProductCard` (mobile only)
- [x] Test on staging

### Phase 2: Core Drawers (Day 3-4) ✅
- [x] Create `CartDrawer`
- [x] Create `MessagesDrawer`
- [x] Hook up to header/tab bar
- [x] Add i18n strings

### Phase 3: Account & Polish (Day 5) ✅
- [x] Create `AccountDrawer`
- [x] Add analytics tracking (`lib/analytics-drawer.ts`)
- [x] Add i18n strings (en.json + bg.json)
- [ ] E2E tests (deferred)

### Phase 4: Production (Day 6) ✅
- [x] Feature flag rollout (`lib/feature-flags.ts`)
- [x] Production analytics with GA4/PostHog integration
- [x] Session metrics tracking (view counts, duration buckets)
- [x] Conversion tracking (`trackDrawerConversion`)
- [ ] Monitor metrics (ongoing)
- [ ] Gather feedback (ongoing)
- [ ] Iterate (ongoing)

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Bounce rate (product pages) | ~45% | <35% |
| Products viewed per session | ~3.2 | >5 |
| Add to cart rate | ~8% | >12% |
| Time to first message | ~45s | <20s |
| Mobile conversion | ~2.1% | >3% |

---

## Open Questions

1. **Double-tap vs single-tap for tab bar drawers?**
   - Option A: First tap = drawer, second = full page
   - Option B: Tap = page (current), long-press = drawer
   - **Recommendation**: Option A (more discoverable)

2. **Product quick view on desktop?**
   - Option A: No (desktop has hover previews)
   - Option B: Yes (modal instead of drawer)
   - **Recommendation**: Option A initially

3. **Drawer stacking?**
   - Allow opening drawer from drawer? (e.g., product → seller profile)
   - **Recommendation**: No stacking initially, navigate to page instead

---

## Appendix: Reference Apps

| App | Drawer Usage |
|-----|--------------|
| Instagram | Stories sheet, comments, share, profile peek |
| Depop | Product quick view, filters, cart |
| Vinted | Filters, sort, seller info |
| TikTok Shop | Product preview, cart, reviews |
| Shein | Everything (filters, size guide, cart, coupons) |
| Pinterest | Save to board, comments, related pins |

---

*Last updated: 2026-01-19*
