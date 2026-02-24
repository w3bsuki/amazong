# 09 — Mobile-First UX: Current State

---

## Philosophy

Mobile-first design, desktop excellence. Separate component trees, not stretched mobile.

---

## Mobile Layout

```
┌──────────────────────────┐
│ Fixed Header (variant)   │  ← homepage | contextual | product
├──────────────────────────┤
│                          │
│  Scrollable Content      │
│                          │
├──────────────────────────┤
│ Fixed Bottom Tab Bar     │  ← Home | Categories | Sell | Chat | Profile
└──────────────────────────┘
```

### Header Variants
| Variant | Components | Usage |
|---------|-----------|-------|
| `homepage` | logo + search + cart/notifications | Home page |
| `contextual` | back + title + optional actions | Most pages |
| `product` | back + seller + share | PDP |

### Bottom Tab Bar
- 5 tabs: Home, Categories, Sell, Chat, Profile
- `rounded-t-2xl border-t shadow-nav`
- Active: indicator pill + `text-nav-active` + `font-semibold`
- Sell tab: dark circle icon
- Height: 64px (`--spacing-bottom-nav: 4rem`)

### Touch Targets
- `--control-compact`: 36px (secondary actions)
- `--control-default`: 44px (standard interactions)
- `--control-primary`: 48px (primary CTAs)

---

## Mobile Chrome Spacing — THE pb-20 PROBLEM

### Current: 14 hacks in 13 files

The bottom tab bar is 64px. Pages need clearance below content. Current approach: **manual `pb-20` on every page.**

| Pattern | Count | Files |
|---------|-------|-------|
| `pb-20 sm:pb-12` | 11 | static-hero-page-shell, todays-deals, sellers, members, gift-cards, about, legal-*, loading |
| `pb-20 md:pb-28 lg:hidden` | 1 | mobile-product-single-scroll |
| `pb-20 md:hidden md:pb-0` | 1 | wishlist-mobile-grid |
| `pb-20` (standalone) | 1 | locale loading.tsx |

### Solution Already Exists
`app/utilities.css` defines `pb-tabbar-safe` — but it's not used consistently.

---

## Responsive Breakpoints

| Breakpoint | Width | Key Changes |
|------------|-------|------------|
| default | 0-639px | Mobile: single column, bottom nav, drawers |
| `sm` | 640px | Slight layout adjustments |
| `md` | 768px | **Primary split.** Desktop header, no bottom nav, dialogs |
| `lg` | 1024px | Sidebar appears, multi-column layouts |
| `xl/2xl` | 1280px+ | Wider content, max-width constraints |

---

## Drawer System

| Drawer | Trigger | Content |
|--------|---------|---------|
| Cart | Cart icon | Cart items + checkout CTA |
| Messages | Chat icon | Recent conversations |
| Product Quick View | Card tap | Product details |
| Auth | Login CTA | Login/signup form |
| Account | Profile icon | Account menu |

Global mount via `useDrawer()` context. `DrawerShell` provides consistent header.

---

## Product Grid (Mobile)

- 2-column grid, 10px gap
- Cards: 4:3 aspect ratio (feed), 1:1 (rails)
- Stretch-link pattern for full-card tap
- Lazy-load images
- `rounded-xl shadow-xs`

---

## Pain Points

1. **pb-20 hacks in 13 files** — should be layout-driven, not page-driven
2. **Tab bar client-side identity fetch** — duplicate of auth state
3. **No mobile UX audit** — individual pages haven't been validated at 375px
4. **Inconsistent mobile chrome** — some pages have padding, some don't
5. **Touch target audit needed** — not all interactions verified at 44px minimum
6. **Missing empty states** — not all routes have empty state for zero-data scenarios
