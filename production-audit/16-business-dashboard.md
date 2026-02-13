# Phase 16: Business Dashboard

> Validate the full mobile Business Dashboard experience — Shopify-style admin panel with sidebar (Sheet overlay on mobile via `SidebarProvider` + `useIsMobile()`), header trigger, 13 dashboard routes covering orders, products, inventory, analytics, accounting, customers, discounts, marketing, settings, and upgrade. Verify mobile readability of data tables, form modals, chart/graph rendering, and content responsiveness within the `@container/main` layout.

| Field | Value |
|-------|-------|
| **Scope** | All 13 business dashboard routes — Shopify-style admin panel with sidebar, data tables, analytics, order management |
| **Routes** | `/dashboard`, `/dashboard/orders`, `/dashboard/orders/:orderId`, `/dashboard/products`, `/dashboard/products/:id/edit`, `/dashboard/analytics`, `/dashboard/accounting`, `/dashboard/customers`, `/dashboard/discounts`, `/dashboard/inventory`, `/dashboard/marketing`, `/dashboard/settings`, `/dashboard/upgrade` |
| **Priority** | P2 |
| **Dependencies** | Phase 1 (Shell), Phase 3 (Auth — business role) |
| **Devices** | Pixel 5 (393×851) · iPhone 12 (390×844) |
| **Auth Required** | Yes — business role required |
| **Status** | ✅ Complete (code audit 2026-02-11) |

---

## Prerequisites

| # | Condition | How to verify |
|---|-----------|---------------|
| 1 | Phase 1 (Shell) passes — header, navigation, sticky behavior verified | Phase 1 audit green |
| 2 | Phase 3 (Auth) passes — login flow works, business role session available | Phase 3 audit green |
| 3 | Device viewport set to Pixel 5 (393×851) or iPhone 12 (390×844) | Playwright `use: { viewport }` |
| 4 | Locale set to `en` | URL prefix `/en/` |
| 5 | Authenticated user with business role | Seeded user with business account or upgraded via upgrade flow |
| 6 | At least 5 orders in various statuses (pending, shipped, delivered, cancelled) | Seed data for orders table scenarios |
| 7 | At least 5 products in various states (active, draft, out-of-stock) | Seed data for products table scenarios |
| 8 | At least 3 customers with purchase history | Seed data for customers route |
| 9 | Analytics/accounting data available (revenue, views, conversion metrics) | Seed data or mock analytics entries |
| 10 | Overlays dismissed (cookie consent + geo modal) | `localStorage.setItem('cookie-consent', 'accepted'); localStorage.setItem('geo-welcome-dismissed', 'true')` |

---

## Routes Under Test

| # | Route | Layout Group | Auth | Purpose |
|---|-------|--------------|------|---------|
| 1 | `/dashboard` | `(business)` | Business | Dashboard overview — stats, quick actions, setup guide, activity feed |
| 2 | `/dashboard/orders` | `(business)` | Business | Orders table — list, filter, status management |
| 3 | `/dashboard/orders/:orderId` | `(business)` | Business | Order detail view — full order info, status actions |
| 4 | `/dashboard/products` | `(business)` | Business | Products table — list, edit, manage inventory |
| 5 | `/dashboard/products/:id/edit` | `(business)` | Business | Product edit form modal or page |
| 6 | `/dashboard/analytics` | `(business)` | Business | Analytics — charts, graphs, performance metrics |
| 7 | `/dashboard/accounting` | `(business)` | Business | Accounting — revenue, payouts, financial overview |
| 8 | `/dashboard/customers` | `(business)` | Business | Customers list — buyer data, purchase history |
| 9 | `/dashboard/discounts` | `(business)` | Business | Discounts management — create, edit, toggle codes |
| 10 | `/dashboard/inventory` | `(business)` | Business | Inventory management — stock levels, alerts |
| 11 | `/dashboard/marketing` | `(business)` | Business | Marketing tools — campaigns, promotions |
| 12 | `/dashboard/settings` | `(business)` | Business | Business settings — store config, preferences |
| 13 | `/dashboard/upgrade` | `(business)` | Business | Business plan upgrade — pricing, plan selection |

---

## Scenarios

### S16.1 — Sidebar Navigation: Sheet Overlay on Mobile

**Route:** `/dashboard`

| Step | Action | Selector / Target |
|------|--------|--------------------|
| 1 | Navigate to `/en/dashboard` as authenticated business user | — |
| 2 | Wait for dashboard layout to render | `SidebarProvider` layout hydrated, content visible |
| 3 | Assert sidebar is NOT visible as a persistent panel | `BusinessSidebar` not visible as inline panel — `collapsible="offcanvas"` hides it off-screen on mobile |
| 4 | Assert header trigger button is visible | `BusinessHeader` renders sidebar trigger — hamburger/menu icon button |
| 5 | Tap sidebar trigger button | Sidebar trigger in `BusinessHeader` |
| 6 | Assert Sheet overlay opens with sidebar navigation | `BusinessSidebar` renders inside Sheet (Radix Dialog) overlay |
| 7 | Assert overlay backdrop is visible | Semi-transparent backdrop behind Sheet |
| 8 | Verify all 6 nav groups rendered | Sales Channel, Products, Customers, Marketing, Analytics, Settings groups visible |
| 9 | Verify "Dashboard" nav item is active/highlighted | Active state indicator on Dashboard item within Sales Channel group |
| 10 | Verify "Orders" nav item shows badge (if orders pending) | Badge count next to Orders link |
| 11 | Verify "Back to Store" link is present in Settings group | Link to exit dashboard and return to storefront |
| 12 | Tap overlay backdrop or close button to dismiss | Backdrop tap or X button |
| 13 | Assert Sheet closes and sidebar is hidden again | Sheet overlay dismissed, content visible |
| 14 | 📸 Screenshot | `phase-16-S16.1-sidebar-sheet.png` — Sheet overlay open showing all nav groups |

**Expected:**
- `SidebarProvider` uses `useIsMobile()` to detect mobile — renders `BusinessSidebar` inside a Sheet (Radix Dialog) overlay instead of inline panel.
- `collapsible="offcanvas"` — sidebar slides in from left as full-height Sheet.
- Sidebar width: `--sidebar-width: calc(var(--spacing) * 72)` — approximately 288px.
- Sheet has proper backdrop overlay and close mechanism.
- All 6 nav groups render with icons, labels, and optional badges.
- Active route is visually indicated in the nav list.
- "Back to Store" link exits the dashboard layout.

---

### S16.2 — Sidebar Navigation: Route Transitions

**Route:** `/dashboard` → various routes

| Step | Action | Selector / Target |
|------|--------|--------------------|
| 1 | Navigate to `/en/dashboard` as business user | — |
| 2 | Open sidebar Sheet | Tap header trigger |
| 3 | Tap "Orders" nav item | Orders link in Sales Channel group |
| 4 | Assert navigation to `/dashboard/orders` | URL changes, orders content loads |
| 5 | Assert sidebar Sheet closes after navigation | Sheet dismissed automatically |
| 6 | Open sidebar Sheet again | Tap header trigger |
| 7 | Assert "Orders" is now the active nav item | Active indicator moved to Orders |
| 8 | Tap "Products" nav item | Products link in Products group |
| 9 | Assert navigation to `/dashboard/products` | URL changes, products content loads |
| 10 | Assert sidebar Sheet closes after navigation | Sheet dismissed automatically |
| 11 | 📸 Screenshot | `phase-16-S16.2-nav-transition.png` — products page after navigation from sidebar |

**Expected:**
- Tapping a nav item in the sidebar Sheet triggers client-side navigation.
- Sheet overlay closes automatically after route transition (no stale Sheet state).
- Active nav item updates to reflect the current route.
- Content area (`SidebarInset` → `div.flex.flex-1.flex-col`) updates with new route content.
- No flash of previous route content during transition.
- Loading states (from route `loading.tsx`) display appropriately during lazy loads.

---

### S16.3 — Dashboard Overview: Stats, Quick Actions, Activity

**Route:** `/dashboard`

| Step | Action | Selector / Target |
|------|--------|--------------------|
| 1 | Navigate to `/en/dashboard` as business user with existing data | — |
| 2 | Wait for dashboard content to load | `loading.tsx` skeleton dismissed, `page.tsx` content visible |
| 3 | Assert stats cards are visible | `BusinessStatsCards` component — revenue, orders, views, conversion metrics |
| 4 | Verify stats cards stack vertically on mobile | Cards in single column or 2-column grid, not overflowing |
| 5 | Assert quick actions section | `BusinessQuickActions` — shortcut buttons/cards for common tasks |
| 6 | Verify quick action buttons are tappable | Each action has minimum 44px touch target |
| 7 | Assert setup guide is visible (for new businesses) | `BusinessSetupGuide` — step-by-step onboarding checklist |
| 8 | Assert performance score widget | `BusinessPerformanceScore` — visual score indicator |
| 9 | Assert live activity or recent activity feed | `BusinessLiveActivity` or `BusinessRecentActivity` — latest events |
| 10 | Scroll through entire dashboard overview | Scroll to bottom of page |
| 11 | Verify no horizontal overflow at any point | Page width stays within 393px viewport |
| 12 | 📸 Screenshot | `phase-16-S16.3-dashboard-overview.png` — top of dashboard with stats cards |

**Expected:**
- Dashboard renders within `@container/main` — responsive container queries may affect layout.
- `BusinessStatsCards`: grid of metric cards (revenue, orders, conversion rate) — stacks to 1 or 2 columns on mobile.
- `BusinessQuickActions`: action buttons/cards for "Add Product", "View Orders", etc.
- `BusinessSetupGuide`: stepped checklist for new businesses (completable tasks with progress indicator).
- `BusinessPerformanceScore`: visual score with gauge or progress indicator.
- `BusinessRecentActivity` / `BusinessActivityFeed`: chronological list of recent events.
- All components fit within mobile viewport without horizontal overflow.
- Content area has `gap-2` vertical spacing between sections.

---

### S16.4 — Orders Table: Mobile Readability

**Route:** `/dashboard/orders`

| Step | Action | Selector / Target |
|------|--------|--------------------|
| 1 | Navigate to `/en/dashboard/orders` as business user with ≥ 5 orders | — |
| 2 | Wait for orders table to render | `OrdersTable` component visible |
| 3 | Assert table headers are visible or table has mobile card layout | Column headers or card-based list for mobile |
| 4 | Verify order data is readable at 393px | Order ID, status, customer name, amount, date visible per row/card |
| 5 | If table layout: verify horizontal scroll is available | Table container scrolls horizontally without page-level overflow |
| 6 | If card layout: verify cards stack vertically | Each order as a card with key details |
| 7 | Verify status badges render with correct colors | Status-specific colors (pending: yellow, shipped: blue, delivered: green, cancelled: red) |
| 8 | Tap on an order row/card | First order entry |
| 9 | Assert navigation to order detail | URL changes to `/dashboard/orders/:orderId` |
| 10 | Assert order detail view renders | `OrderDetailView` component with full order information |
| 11 | Verify order detail includes: items, customer info, shipping, status, total | All detail sections visible |
| 12 | Verify detail view is scrollable on mobile | Content accessible via vertical scroll |
| 13 | 📸 Screenshot | `phase-16-S16.4-orders-table.png` — orders list on mobile |

**Expected:**
- `OrdersTable` may render as a traditional table (horizontal scroll) or responsive card list on mobile.
- Each order entry shows: order ID/number, status badge, customer, amount, date at minimum.
- Status badges use semantic colors from design tokens.
- Tapping an order navigates to `OrderDetailView` with comprehensive order data.
- Detail view sections are vertically stacked and scrollable.
- No text truncation that obscures critical information (order ID, amount).
- **DASH-001 related**: table content may not be mobile-optimized — document actual behavior.

---

### S16.5 — Products Table & Product Form Modal

**Route:** `/dashboard/products`, `/dashboard/products/:id/edit`

| Step | Action | Selector / Target |
|------|--------|--------------------|
| 1 | Navigate to `/en/dashboard/products` as business user with ≥ 5 products | — |
| 2 | Wait for products table to render | `ProductsTable` component visible |
| 3 | Assert product list is readable at 393px | Product name, price, status, stock visible per row/card |
| 4 | Verify product images/thumbnails render (if present) | Small image previews per product |
| 5 | Verify "Add Product" CTA is accessible | Button to create new product |
| 6 | Tap on a product row/card | First product entry |
| 7 | Assert edit form opens | `ProductFormModal` or navigation to `/dashboard/products/:id/edit` |
| 8 | If modal: assert modal renders on mobile with scrollable body | Modal/drawer with form fields |
| 9 | If page: assert edit page renders with form fields | Full edit page with product form |
| 10 | Verify form fields visible: title, price, description, images, category, stock | All required fields present |
| 11 | Verify form is scrollable without horizontal overflow | Full form accessible via vertical scroll at 393px |
| 12 | Dismiss modal or navigate back | Close button or back navigation |
| 13 | Assert return to products list | Products table visible again |
| 14 | 📸 Screenshot | `phase-16-S16.5-products-table.png` — products list on mobile |

**Expected:**
- `ProductsTable` displays products with key fields: name, price, status (active/draft), stock count.
- Product editing via `ProductFormModal` or dedicated edit page at `/dashboard/products/:id/edit`.
- Form modal on mobile should render as near-full-screen or bottom Sheet for usability.
- All form fields are accessible and properly sized for touch input (minimum 44px height).
- Form submission provides success/error feedback (toast or inline validation).
- **DASH-001 related**: table content may not be fully mobile-optimized — document actual layout behavior.

---

### S16.6 — Analytics & Charts: Mobile Rendering

**Route:** `/dashboard/analytics`, `/dashboard/accounting`

| Step | Action | Selector / Target |
|------|--------|--------------------|
| 1 | Navigate to `/en/dashboard/analytics` as business user with analytics data | — |
| 2 | Wait for analytics content to render | Charts/graphs visible, loading dismissed |
| 3 | Assert chart containers are visible | Graph/chart elements rendered (SVG, canvas, or div-based) |
| 4 | Verify charts fit within mobile viewport | Charts do not overflow horizontally at 393px |
| 5 | Verify chart labels/legends are readable | Text within charts is legible at mobile size |
| 6 | Verify chart data points are interactive (if applicable) | Tap on data point shows tooltip/detail |
| 7 | Scroll through all analytics sections | Full page scroll to verify all metrics |
| 8 | Navigate to `/en/dashboard/accounting` | — |
| 9 | Wait for accounting content to render | Financial data visible |
| 10 | Verify revenue/payout data is displayed | Monetary amounts, date ranges, summaries |
| 11 | Verify accounting tables/lists fit mobile viewport | Data readable without critical truncation |
| 12 | 📸 Screenshot | `phase-16-S16.6-analytics-charts.png` — analytics page with charts on mobile |

**Expected:**
- Charts render responsively within `@container/main` — width adapts to mobile viewport.
- Chart libraries (Recharts, Chart.js, or similar) should output responsive SVG/canvas.
- Legends and axis labels should be readable at mobile font sizes.
- If charts exceed viewport width, they should be contained in horizontally scrollable containers.
- Accounting data displays monetary values with proper formatting.
- **DASH-001 related**: charts specifically flagged as potentially not mobile-optimized — this scenario validates the actual behavior.

---

### S16.7 — Dashboard Empty State

**Route:** `/dashboard`

| Step | Action | Selector / Target |
|------|--------|--------------------|
| 1 | Authenticate as new business user with no orders/products/customers | Fresh business account |
| 2 | Navigate to `/en/dashboard` | — |
| 3 | Wait for dashboard to render | Content visible |
| 4 | Assert empty state component renders | `BusinessEmptyState` — illustration + messaging for new businesses |
| 5 | Verify setup guide is prominently displayed | `BusinessSetupGuide` — onboarding steps with progress |
| 6 | Verify task cards are visible | `BusinessTaskCards` — actionable tasks (add product, set up payments, etc.) |
| 7 | Verify stats cards show zero/placeholder values | `BusinessStatsCards` — zeroed metrics or "No data yet" messaging |
| 8 | Verify CTA to add first product | Button linking to product creation |
| 9 | Verify layout is mobile-appropriate | All elements fit 393px viewport, no overflow |
| 10 | 📸 Screenshot | `phase-16-S16.7-dashboard-empty.png` — empty dashboard with setup guide |

**Expected:**
- `BusinessEmptyState` provides encouraging messaging with illustration.
- `BusinessSetupGuide` shows step-by-step onboarding: add product → set up payments → customize store.
- `BusinessTaskCards` offer quick action cards for first-time setup tasks.
- Zero-state metrics show neutral values (0 orders, $0 revenue) without looking broken.
- Empty state is distinct from loading state — no confusion with skeleton placeholders.
- CTAs are prominent and guide the user toward first actions.

---

### S16.8 — Command Palette: Mobile Activation

**Route:** `/dashboard` (any dashboard route)

| Step | Action | Selector / Target |
|------|--------|--------------------|
| 1 | Navigate to `/en/dashboard` as business user | — |
| 2 | Look for command palette trigger in header | `BusinessCommandPalette` trigger — search icon or keyboard shortcut indicator |
| 3 | Tap command palette trigger (if visible on mobile) | Command palette trigger button |
| 4 | Assert command palette opens | Modal/overlay with search input and command list |
| 5 | Type a search query (e.g., "orders") | Text input in the command palette |
| 6 | Verify filtered results show relevant commands/routes | Command items matching query |
| 7 | Tap a command result | First matching result |
| 8 | Assert navigation to the selected route | URL changes to matched route |
| 9 | Assert command palette closes after selection | Palette dismissed |
| 10 | 📸 Screenshot | `phase-16-S16.8-command-palette.png` — command palette open with search results |

**Expected:**
- `BusinessCommandPalette` renders as a cmdk-style overlay (Radix Command or similar).
- Search input is immediately focused on open.
- Results filter in real time as user types.
- Selecting a result navigates to the corresponding dashboard route.
- Palette is dismissible via backdrop tap or Escape (if keyboard attached).
- On mobile, palette may render as full-screen or near-full-screen for usability.
- If command palette is desktop-only (no mobile trigger), document this as acceptable or as a finding.

---

### S16.9 — Notifications: Mobile Display

**Route:** `/dashboard` (any dashboard route)

| Step | Action | Selector / Target |
|------|--------|--------------------|
| 1 | Navigate to `/en/dashboard` as business user with pending notifications | — |
| 2 | Look for notification indicator in header | `BusinessNotifications` — bell icon or badge in `BusinessHeader` |
| 3 | Assert notification badge shows unread count | Badge number on notification trigger |
| 4 | Tap notification trigger | Bell icon or notification button |
| 5 | Assert notification panel/dropdown opens | List of notifications visible |
| 6 | Verify notification entries show title, timestamp, and type | Each notification has readable content at mobile width |
| 7 | Tap a notification entry | First notification item |
| 8 | Assert navigation to relevant route or detail | Navigates to related order, product, or activity |
| 9 | Verify notification dismissal/mark-as-read (if supported) | Read state updates |
| 10 | 📸 Screenshot | `phase-16-S16.9-notifications.png` — notification panel open on mobile |

**Expected:**
- `BusinessNotifications` renders a trigger (bell icon) with unread count badge in `BusinessHeader`.
- Notification panel opens as a dropdown, popover, or Sheet on mobile.
- Notification entries are readable at 393px — no critical text truncation.
- Tapping a notification navigates to the related resource.
- Notifications panel is dismissible via backdrop tap or close button.
- If no notifications exist, an empty state message is shown.

---

### S16.10 — DASH-001: Content Responsiveness Verification

**Route:** `/dashboard`, `/dashboard/orders`, `/dashboard/products`, `/dashboard/analytics`

| Step | Action | Selector / Target |
|------|--------|--------------------|
| 1 | Navigate to `/en/dashboard` as business user with full data | — |
| 2 | Measure page horizontal overflow | `await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)` — should be `false` |
| 3 | Navigate to `/en/dashboard/orders` | — |
| 4 | Measure orders page horizontal overflow | Same horizontal overflow check |
| 5 | If table present: verify table is in scrollable container | Table wrapper has `overflow-x-auto` or equivalent |
| 6 | Verify table text readability at 393px | Critical columns (status, amount) not fully hidden |
| 7 | Navigate to `/en/dashboard/products` | — |
| 8 | Measure products page horizontal overflow | Same horizontal overflow check |
| 9 | Navigate to `/en/dashboard/analytics` | — |
| 10 | Measure analytics page horizontal overflow | Same horizontal overflow check |
| 11 | Verify chart containers do not break viewport | Charts contained within mobile width |
| 12 | Navigate to each remaining route: `/dashboard/accounting`, `/dashboard/customers`, `/dashboard/discounts`, `/dashboard/inventory`, `/dashboard/marketing`, `/dashboard/settings`, `/dashboard/upgrade` | — |
| 13 | Run horizontal overflow check on each remaining route | `scrollWidth > clientWidth` assertion per route |
| 14 | Document any routes with overflow or unreadable content | Note specific route, element, and overflow amount |
| 15 | 📸 Screenshot | `phase-16-S16.10-dash001-overflow-check.png` — any route showing overflow (or best-case screenshot if none) |

**Expected:**
- **Bug DASH-001 context**: `SidebarProvider` correctly handles mobile via Sheet overlay + `useIsMobile()`, but dashboard CONTENT (tables, charts, forms) may not be mobile-optimized.
- This scenario systematically validates every dashboard route for horizontal overflow.
- Tables should be in `overflow-x-auto` containers — page-level horizontal scroll is a failing condition.
- Charts should respect container width or be in scroll containers.
- Forms should stack fields vertically on mobile.
- Any route with `scrollWidth > clientWidth` is a confirmed DASH-001 manifestation — capture the specific element causing overflow.
- Result determines whether DASH-001 should be escalated from informational to actionable bug.

---

## Source Files

| File | Purpose |
|------|---------|
| `app/[locale]/(business)/dashboard/layout.tsx` | Dashboard layout — `SidebarProvider` with `BusinessSidebar` + `SidebarInset` |
| `app/[locale]/(business)/dashboard/page.tsx` | Dashboard overview page |
| `app/[locale]/(business)/dashboard/loading.tsx` | Dashboard loading skeleton |
| `app/[locale]/(business)/dashboard/_lib/routes.ts` | Sidebar navigation route definitions (6 groups) |
| `app/[locale]/(business)/dashboard/_lib/categories.ts` | Product category definitions |
| `app/[locale]/(business)/_components/business-sidebar.tsx` | `BusinessSidebar` — sidebar with nav groups, `variant="inset" collapsible="offcanvas"` |
| `app/[locale]/(business)/_components/business-header.tsx` | `BusinessHeader` — sticky header with sidebar trigger, search, notifications |
| `app/[locale]/(business)/_components/business-stats-cards.tsx` | `BusinessStatsCards` — revenue, orders, views, conversion metric cards |
| `app/[locale]/(business)/_components/business-quick-actions.tsx` | `BusinessQuickActions` — shortcut action buttons |
| `app/[locale]/(business)/_components/business-setup-guide.tsx` | `BusinessSetupGuide` — onboarding checklist for new businesses |
| `app/[locale]/(business)/_components/business-task-cards.tsx` | `BusinessTaskCards` — actionable task cards |
| `app/[locale]/(business)/_components/business-live-activity.tsx` | `BusinessLiveActivity` — real-time activity indicator |
| `app/[locale]/(business)/_components/business-performance-score.tsx` | `BusinessPerformanceScore` — visual performance gauge |
| `app/[locale]/(business)/_components/business-recent-activity.tsx` | `BusinessRecentActivity` — chronological activity feed |
| `app/[locale]/(business)/_components/business-activity-feed.tsx` | `BusinessActivityFeed` — detailed activity list |
| `app/[locale]/(business)/_components/business-notifications.tsx` | `BusinessNotifications` — notification trigger + panel |
| `app/[locale]/(business)/_components/business-empty-state.tsx` | `BusinessEmptyState` — zero-data empty state |
| `app/[locale]/(business)/_components/business-command-palette.tsx` | `BusinessCommandPalette` — cmdk-style command search |
| `app/[locale]/(business)/_components/orders-table.tsx` | `OrdersTable` — order list table/cards |
| `app/[locale]/(business)/_components/order-detail-view.tsx` | `OrderDetailView` — full order detail |
| `app/[locale]/(business)/_components/products-table.tsx` | `ProductsTable` — product list table/cards |
| `app/[locale]/(business)/_components/product-form-modal.tsx` | `ProductFormModal` — product create/edit form |

---

## Known Bugs

| ID | Summary | Severity | Audit Scope | Status |
|----|---------|----------|-------------|--------|
| DASH-001 | Business dashboard `SidebarProvider` handles mobile correctly (Sheet overlay + `useIsMobile()`), but dashboard CONTENT (tables, charts, forms) may not be mobile-optimized. Data tables and chart containers may overflow or be unreadable at mobile viewport widths. | Medium | S16.4, S16.5, S16.6, S16.10 | ⚠ Partially confirmed (sidebar OK, content issues open) |

---

## Evidence Log (v2)

Fixed columns. Add one row per scenario run (or per sub-scenario if needed).

| Scenario | Method | Artifact | Result | Issue ID | Severity | Owner | Date |
|----------|--------|----------|--------|----------|----------|-------|------|
| S16.1 | code trace | Mobile sidebar sheet path via shared `SidebarProvider` | Pass | DASH-001 | P2 | Codex | 2026-02-11 |
| S16.2 | code trace | Sidebar Sheet opens on mobile, but route navigation does not explicitly close `openMobile` state after link transitions | Fail | DASH-NAV-006 | P2 | Codex | 2026-02-11 |
| S16.3 | code trace | Overview structure present, but significant hardcoded English text remains | Partial | DASH-I18N-004 | P2 | Codex | 2026-02-11 |
| S16.4 | code trace | Orders table uses hardcoded BGN and wrong message route (`/messages?user=`) | Fail | DASH-ROUTE-002, DASH-CURRENCY-003 | P1 | Codex | 2026-02-11 |
| S16.5 | code trace | Products table/modal use hardcoded BGN text and non-canonical product link patterns | Fail | DASH-CURRENCY-003, DASH-PRODUCT-005 | P1 | Codex | 2026-02-11 |
| S16.6 | code trace | Analytics/content components render, but localization consistency remains unresolved | Partial | DASH-I18N-004 | P2 | Codex | 2026-02-11 |
| S16.7 | code trace | Empty-state component exists, but dashboard overview does not consistently surface it as the primary fallback | Partial | DASH-EMPTY-008 | P2 | Codex | 2026-02-11 |
| S16.8 | code trace | Command palette exists but trigger is desktop-only (`md:flex`) and not directly reachable on mobile | Partial | DASH-CMD-010 | P2 | Codex | 2026-02-11 |
| S16.9 | code trace | Notifications component and header integration present | Pass | — | — | Codex | 2026-02-11 |
| S16.10 | code trace | DASH-001 sweep: sidebar responsive infra is correct; multiple content surfaces remain mobile-weak and non-i18n compliant | Fail | DASH-001 | P1 | Codex | 2026-02-11 |

Method suggestions: `runtime` | `code trace` | `manual` (keep it consistent within a phase).


---

## Findings

| ID | Scenario | Status | Notes |
|----|----------|--------|-------|
| DASH-001 | S16.1/S16.10 | ⚠ Open (P1) | Original claim split: sidebar mobile handling is implemented, but dashboard content responsiveness/readability remains inconsistent across table/form-heavy routes. |
| DASH-ROUTE-002 | S16.4 | ❌ Open (P1) | Orders/detail contact actions route to `/messages?user=...` instead of chat route family (`/chat`). |
| DASH-CURRENCY-003 | S16.4/S16.5 | ❌ Open (P1) | Hardcoded BGN labels/formatting in orders/products/forms (`BGN`, `лв`) conflict with broader EUR-first marketplace rollout. |
| DASH-PRODUCT-005 | S16.5 | ❌ Open (P1) | Products table "View" links use `/product/{id}` non-canonical PDP path. |
| DASH-I18N-004 | S16.3/S16.6 | ⚠ Open (P2) | Business header/sidebar/table surfaces contain many hardcoded English strings outside `next-intl`. |
| DASH-NAV-006 | S16.2 | ❌ Open (P2) | Sidebar offcanvas state is not explicitly closed on link navigation in mobile sheet flows, causing sticky-open behavior risk. |
| DASH-UPGRADE-007 | Cross-cutting | ⚠ Open (P2) | `/dashboard/upgrade` header/title mapping falls back to generic home label instead of route-specific upgrade context. |
| DASH-EMPTY-008 | S16.7 | ⚠ Open (P2) | `BusinessEmptyState` exists but overview route does not consistently render it as primary fallback behavior. |
| DASH-CMD-010 | S16.8 | ⚠ Open (P2) | Command palette trigger is hidden on mobile (`md:flex`), reducing reachability for phone users. |

---

## Summary

| Metric | Value |
|--------|-------|
| Scenarios | 10 |
| Executed | 10 |
| Passed | 2 |
| Failed | 4 |
| Partial | 4 |
| Issues found | 9 (P1:4, P2:5) |
| Known bug verdict | DASH-001 = partially resolved (sidebar) but still open for content |
| Blockers | 0 |
| Status | ✅ Complete (code audit) |

Phase 16 covers the complete business dashboard surface across 13 routes within the `(business)` layout group. The dashboard uses a Shopify-style admin architecture: `SidebarProvider` with `BusinessSidebar` (variant `inset`, collapsible `offcanvas`) rendering as a Sheet overlay on mobile via `useIsMobile()`, and `SidebarInset` wrapping `BusinessHeader` + content area within a `@container/main` responsive container. Known bug DASH-001 is the primary risk — while `SidebarProvider` correctly handles mobile sidebar as Sheet overlay, the dashboard CONTENT (data tables in `OrdersTable`/`ProductsTable`, charts in analytics, form modals in `ProductFormModal`) may not be mobile-optimized. Scenarios S16.4, S16.5, S16.6, and the systematic S16.10 sweep directly verify DASH-001 across all 13 routes. The sidebar navigation has 6 groups (Sales Channel, Products, Customers, Marketing, Analytics, Settings) with route-specific active states and an Orders badge. No `data-testid` attributes exist in business dashboard components — all selectors must rely on structural queries, text content, ARIA roles, or CSS class patterns.
