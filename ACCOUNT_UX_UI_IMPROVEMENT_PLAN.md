# Account Pages Improvement Plan

## Audit Summary (Playwright @ localhost:3000)

### Current State Analysis

**Desktop (1280px):**
- ✅ Sidebar: Working, 3 groups (Main, Settings, Seller)
- ✅ Header: Shows page title, "Back to Store" button
- ✅ Stats Cards: 5 cards in row, proper grid
- ✅ Activity Chart: Orders/Sales toggle, date range dropdown
- ✅ Recent Activity: Orders and Products sections with "View all"

**Mobile (375px):**
- ✅ Tab Bar: 5 tabs (Account, Orders, Selling, Plans, Store), working
- ⚠️ Stats Cards: Bordered cards stacked vertically - should be divider list
- ⚠️ Chart: Hidden on mobile (good - too complex)
- ✅ Recent Activity: Clean list items with avatars

**Issues Found:**
1. Mobile stats use `rounded-lg border bg-card` - should use divider pattern
2. `gap-2` in layout is inconsistent with `gap-4` used elsewhere
3. `pb-20` excessive - tab bar is `h-14`, needs only `pb-16`
4. Tab bar icon has `scale-110` on active - should remove per STYLING.md

---

## Implementation Tasks

### Task 1: account-layout-content.tsx

**File:** `app/[locale]/(account)/account-layout-content.tsx`

**Current (line 59):**
```tsx
<div className="@container/main flex flex-1 flex-col gap-2 px-4 py-4 pb-20 md:px-6 md:py-6 lg:pb-6">
```

**Change to:**
```tsx
<div className="@container/main flex flex-1 flex-col gap-4 px-4 py-4 pb-16 lg:px-6 lg:py-6 lg:pb-6">
```

**Why:**
- `gap-4` consistent with page content
- `pb-16` = tab bar h-14 (56px) + 8px buffer = 64px

---

### Task 2: account-tab-bar.tsx

**File:** `components/account-tab-bar.tsx`

**Current (line 69-72):**
```tsx
<tab.icon 
  className={cn(
    "size-5 transition-transform",
    active && !isStore && "scale-110"
  )}
  stroke={active && !isStore ? 2.5 : 1.5}
/>
```

**Change to:**
```tsx
<tab.icon 
  className="size-5"
  stroke={active && !isStore ? 2 : 1.5}
/>
```

**Why:**
- Remove `scale-110` (no scale animations per STYLING.md)
- Remove `transition-transform` (unnecessary)
- Reduce stroke from 2.5 to 2 (less heavy)

---

### Task 3: account-stats-cards.tsx

**File:** `components/account-stats-cards.tsx`

**Current mobile (line 83-99):**
```tsx
<div className="space-y-2 sm:hidden">
  {quickActions.map((action) => (
    <Link
      key={action.href}
      href={action.href}
      className="flex items-center gap-3 p-3 rounded-lg border bg-card active:bg-muted/50 transition-colors"
    >
```

**Change to:**
```tsx
<div className="divide-y divide-border sm:hidden">
  {quickActions.map((action) => (
    <Link
      key={action.href}
      href={action.href}
      className="flex items-center gap-3 px-4 py-3 active:bg-muted/50"
    >
```

**Current icon container:**
```tsx
<div className="flex size-10 items-center justify-center rounded-full bg-muted">
  <action.icon className="size-5 text-muted-foreground" />
</div>
```

**Change to:**
```tsx
<div className="flex size-9 items-center justify-center rounded-full bg-muted">
  <action.icon className="size-4 text-muted-foreground" />
</div>
```

**Add chevron at end:**
```tsx
<span className="text-xl font-semibold tabular-nums">{action.value}</span>
<IconChevronRight className="size-4 text-muted-foreground ml-1" />
```

**Why:**
- `divide-y divide-border` instead of bordered cards
- `px-4 py-3` for consistent spacing (matches recent activity)
- Smaller icon container (size-9 vs size-10)
- Add chevron to indicate navigation

---

### Task 4: account-recent-activity.tsx

**File:** `components/account-recent-activity.tsx`

**No major changes needed.** Current implementation is clean:
- Uses `divide-y border-t` for lists
- Clean section headers with "View all" links
- Proper avatar/badge usage

**Minor fix - section container:**
```tsx
// Current
<div className="rounded-lg border bg-card">

// Change to (remove bg-card for cleaner look)
<div className="rounded-sm border">
```

---

### Task 5: Desktop Stats Cards

**File:** `components/account-stats-cards.tsx`

**Current (line 102-120):**
```tsx
<div className="hidden sm:grid grid-cols-2 gap-3 @xl/main:grid-cols-3 @4xl/main:grid-cols-5">
```

**Change to:**
```tsx
<div className="hidden sm:grid grid-cols-2 gap-4 @xl/main:grid-cols-3 @4xl/main:grid-cols-5">
```

**Why:** `gap-4` consistent with project spacing

---

## Complete Code Changes

### account-stats-cards.tsx (Full Replacement)

```tsx
"use client"

import { IconPackage, IconChartLine, IconBuildingStore, IconMessage, IconHeart, IconChevronRight } from "@tabler/icons-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface AccountStatsProps {
  totals: {
    orders: number
    pendingOrders: number
    sales: number
    revenue: number
    products: number
    messages: number
    wishlist: number
  }
  locale: string
}

export function AccountStatsCards({ totals, locale }: AccountStatsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: locale === 'bg' ? 'BGN' : 'EUR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const t = {
    orders: locale === 'bg' ? 'Поръчки' : 'Orders',
    pending: locale === 'bg' ? 'активни' : 'active',
    sales: locale === 'bg' ? 'Продажби' : 'Sales',
    products: locale === 'bg' ? 'Обяви' : 'Listings',
    messages: locale === 'bg' ? 'Съобщения' : 'Messages',
    unread: locale === 'bg' ? 'непрочетени' : 'unread',
    wishlist: locale === 'bg' ? 'Любими' : 'Wishlist',
  }

  const quickActions = [
    {
      href: "/account/orders",
      icon: IconPackage,
      label: t.orders,
      value: totals.orders,
      badge: totals.pendingOrders > 0 ? `${totals.pendingOrders} ${t.pending}` : null,
      badgeColor: "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950/50 dark:border-orange-800 dark:text-orange-400",
    },
    {
      href: "/account/selling",
      icon: IconBuildingStore,
      label: t.products,
      value: totals.products,
      badge: null,
      badgeColor: "",
    },
    {
      href: "/account/sales",
      icon: IconChartLine,
      label: t.sales,
      value: totals.sales,
      badge: totals.revenue > 0 ? formatCurrency(totals.revenue) : null,
      badgeColor: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-400",
    },
    {
      href: "/account/messages",
      icon: IconMessage,
      label: t.messages,
      value: totals.messages,
      badge: totals.messages > 0 ? `${totals.messages} ${t.unread}` : null,
      badgeColor: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-400",
    },
    {
      href: "/account/wishlist",
      icon: IconHeart,
      label: t.wishlist,
      value: totals.wishlist,
      badge: null,
      badgeColor: "",
    },
  ]

  return (
    <>
      {/* Mobile: Divider list */}
      <div className="divide-y divide-border sm:hidden">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-3 px-4 py-3 active:bg-muted/50"
          >
            <div className="flex size-9 items-center justify-center rounded-full bg-muted">
              <action.icon className="size-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-normal">{action.label}</p>
              {action.badge && (
                <Badge variant="outline" className={`mt-0.5 text-xs ${action.badgeColor}`}>
                  {action.badge}
                </Badge>
              )}
            </div>
            <span className="text-lg font-medium tabular-nums">{action.value}</span>
            <IconChevronRight className="size-4 text-muted-foreground" />
          </Link>
        ))}
      </div>

      {/* Desktop: Card grid */}
      <div className="hidden sm:grid grid-cols-2 gap-4 @xl/main:grid-cols-3 @4xl/main:grid-cols-5">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="h-full hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-muted shrink-0">
                    <action.icon className="size-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground truncate">{action.label}</p>
                    <p className="text-xl font-semibold tabular-nums">{action.value}</p>
                  </div>
                </div>
                {action.badge && (
                  <Badge variant="outline" className={`mt-2 text-xs ${action.badgeColor}`}>
                    {action.badge}
                  </Badge>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  )
}
```

---

## Execution Checklist

| # | File | Change | Status |
|---|------|--------|--------|
| 1 | `account-layout-content.tsx` | `gap-2` → `gap-4`, `pb-20` → `pb-16` | ✅ Done |
| 2 | `account-tab-bar.tsx` | Remove `scale-110`, reduce stroke | ✅ Done |
| 3 | `account-stats-cards.tsx` | Mobile: divider list pattern + chevrons | ✅ Done |
| 4 | `account-recent-activity.tsx` | `rounded-lg` → `rounded-sm` | ✅ Done |

---

## Verification

After changes, verify with Playwright:

```bash
# Mobile (375x812)
- Stats should show as divider list (no card borders)
- Tab bar icons should not scale on active
- Content should not be cut off by tab bar

# Desktop (1280x800)  
- Stats should show as 5-column card grid
- Hover states should work on cards
- Sidebar should remain functional
```
