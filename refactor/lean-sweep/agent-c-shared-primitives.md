# Phase C — Shared Primitives Extraction

> **Scope:** Extract shared components from cross-route duplication.
> **Read `refactor/shared-rules.md` first.**
> **This is the highest-impact phase.** ~2,500 lines of duplication across (account), (business), (admin).

---

## The Problem

Three dashboard route groups independently implement the same UI patterns:

| Pattern | (account) | (business) | (admin) | Combined |
|---------|----------|-----------|---------|----------|
| Sidebar | 355 L | 295 L | 100 L | 750 L |
| Orders table/grid | 675 L | 600 L | — | 1,275 L |
| Order detail | 735 L | 426 L | — | 1,161 L |
| Stats cards | 116 L | 139 L | — | 255 L |
| Recent activity | 391 L | 163 L | — | 554 L |

## Extraction 1: Dashboard Sidebar Shell

**Read first:**
- `app/[locale]/(account)/account/_components/account-sidebar.tsx`
- `app/[locale]/(business)/_components/business-sidebar.tsx`
- `app/[locale]/(admin)/_components/admin-sidebar.tsx`
- `components/layout/sidebar/sidebar.tsx` (shared primitive)

**Extract to:** `components/shared/dashboard-sidebar.tsx`

**What to extract:**
- Shared shell: `SidebarProvider` → `Sidebar` → header (avatar + name) → nav groups → footer (sign out)
- Accept props: `navGroups: { label: string; items: NavItem[] }[]`, `user: { name, avatar }`, `title: string`
- Each route-specific sidebar becomes a thin wrapper that passes config

**Expected reduction:** ~200-300 lines across 3 files

## Extraction 2: Stat Card

**Read first:**
- `app/[locale]/(account)/account/_components/account-stats-cards.tsx` (116 L)
- `app/[locale]/(account)/account/orders/_components/account-orders-stats.tsx` (134 L)
- `app/[locale]/(account)/account/wishlist/_components/wishlist-stats.tsx` (~140 L)
- `app/[locale]/(account)/account/sales/_components/sales-stats.tsx` (143 L)
- `app/[locale]/(business)/_components/business-stats-cards.tsx` (139 L)

**Extract to:** `components/shared/stat-card.tsx`

```tsx
// Target API:
<StatCardGrid>
  <StatCard icon={Package} label="Total Orders" value={42} trend={+5} />
  <StatCard icon={DollarSign} label="Revenue" value="€1,234" />
</StatCardGrid>
```

**What to extract:**
- Card layout (icon + value + label + optional trend)
- Grid container (responsive grid-cols-2/3/4)
- Each consumer passes its own data

**Expected reduction:** ~250 lines across 5 files

## Extraction 3: Order List Item

**Read first:**
- `app/[locale]/(account)/account/orders/_components/account-orders-grid.tsx` (675 L)
- `app/[locale]/(business)/_components/orders-table.tsx` (600 L)

**Identify shared patterns:**
- Both render: product image, product name, order status badge, date, price, buyer/seller info
- Both have: filtering, sorting, empty state, pagination

**Extract to:** `components/shared/order-list-item.tsx` + `components/shared/order-filters.tsx`

**What's DIFFERENT (keep per-route):**
- Buyer view (account): shows seller info, buyer actions (return, review)
- Seller view (business): shows buyer info, seller actions (ship, cancel)

**Strategy:** Extract the shared rendering (item card, status badge, layout) into a shared component. Each route wraps it with its own actions column/section.

**Expected reduction:** ~400 lines

## Extraction 4: Order Detail Primitives

**Read first:**
- `app/[locale]/(account)/account/orders/[id]/_components/order-detail-content.tsx` (735 L)
- `app/[locale]/(business)/_components/order-detail-view.tsx` (426 L)

**Identify shared sections:**
- Order header (status, date, order number)
- Item list (images, names, quantities, prices)
- Shipping info section
- Order timeline
- Price summary (subtotal, shipping, total)

**Extract to:** `components/shared/order-detail/` directory:
- `order-header.tsx` — status + date + order number
- `order-items-list.tsx` — item display
- `order-price-summary.tsx` — subtotal, shipping, total
- Keep route-specific: buyer-actions, seller-actions

**Expected reduction:** ~300 lines

## Extraction 5: Activity Feed Item

**Read first:**
- `app/[locale]/(account)/account/_components/account-recent-activity.tsx` (391 L)
- `app/[locale]/(business)/_components/business-recent-activity.tsx` (163 L)

**Extract to:** `components/shared/activity-feed.tsx`

**Shared pattern:** Image thumbnail + description + relative time + status badge

**Expected reduction:** ~200 lines

## Extraction 6: Header Dropdown Shell

**Read first:**
- `components/dropdowns/account-dropdown.tsx` (189 L)
- `components/dropdowns/messages-dropdown.tsx` (139 L)
- `components/dropdowns/wishlist-dropdown.tsx` (118 L)

**Extract to:** `components/shared/header-dropdown.tsx`

**Shared pattern:** HoverCard trigger (icon + count badge) → content panel with header + items

**Expected reduction:** ~80-100 lines

## Extraction 7: Drawer/Dropdown Menu Sharing

**Read first:**
- `components/mobile/drawers/account-drawer.tsx` (376 L)
- `components/dropdowns/account-dropdown.tsx` (189 L)

Both render identical menu items: orders, wishlist, messages, settings, sell, sign out.

**Extract to:** `components/shared/account-menu-items.tsx`

Headless component that returns the menu items as data or renders them with a slot pattern. The drawer wraps them in `DrawerContent`, the dropdown wraps them in `HoverCardContent`.

**Expected reduction:** ~150 lines

## How to Execute

1. Start with **Extraction 2 (StatCard)** — smallest, most self-contained, lowest risk.
2. Then **Extraction 6 (HeaderDropdown)** — small, self-contained.
3. Then **Extraction 1 (Sidebar)** — medium complexity.
4. Then **Extraction 5 (Activity Feed)** — medium.
5. Then **Extraction 7 (Drawer/Dropdown)** — medium.
6. Then **Extraction 3 (Order List)** — largest, most complex.
7. Finally **Extraction 4 (Order Detail)** — largest, most complex.

**After each extraction:**
1. Create the shared component
2. Refactor ONE consumer to use it
3. Run `pnpm -s typecheck`
4. Refactor remaining consumers
5. Run full verification

## Verification

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

## Output

Log each extraction in `refactor/lean-sweep/extractions.md`:
- Shared component created (path + line count)
- Consumers refactored (list of files, before/after line counts)
- Total lines removed
