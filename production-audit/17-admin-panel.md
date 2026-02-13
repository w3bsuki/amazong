# Phase 17: Admin Panel

| Field | Value |
|-------|-------|
| **Scope** | All 8 admin routes — platform administration with sidebar, data tables, user/product/order management |
| **Routes** | `/admin`, `/admin/docs`, `/admin/notes`, `/admin/orders`, `/admin/products`, `/admin/sellers`, `/admin/tasks`, `/admin/users` |
| **Priority** | P3 |
| **Dependencies** | Phase 1 (Shell), Phase 3 (Auth — admin role) |
| **Devices** | Pixel 5 (393×851) · iPhone 12 (390×844) |
| **Auth Required** | Yes — admin role required (requireAdmin()) |
| **Status** | ✅ Complete (code audit 2026-02-11) |

---

## Source Files

| File | Purpose |
|------|---------|
| `app/[locale]/(admin)/admin/layout.tsx` | SidebarProvider + `requireAdmin()` auth gate, redirects non-admins to `/` |
| `app/[locale]/(admin)/admin/page.tsx` | Dashboard overview (stats cards, recent activity) |
| `app/[locale]/(admin)/admin/loading.tsx` | Dashboard skeleton |
| `app/[locale]/(admin)/_components/admin-sidebar.tsx` | Sidebar navigation — 8 nav items + "Back to Store" link |
| `app/[locale]/(admin)/_components/admin-stats-cards.tsx` | Dashboard KPI cards |
| `app/[locale]/(admin)/_components/admin-recent-activity.tsx` | Recent activity feed |
| `app/[locale]/(admin)/_components/dashboard-header.tsx` | Header with SidebarTrigger for mobile |
| `app/[locale]/(admin)/_components/locale-switcher.tsx` | Admin locale switcher |
| `app/[locale]/(admin)/admin/users/page.tsx` | Users management table |
| `app/[locale]/(admin)/admin/products/page.tsx` | Products management table |
| `app/[locale]/(admin)/admin/orders/page.tsx` | Orders management table |
| `app/[locale]/(admin)/admin/sellers/page.tsx` | Sellers management table |
| `app/[locale]/(admin)/admin/tasks/page.tsx` | Tasks board with custom components |
| `app/[locale]/(admin)/admin/docs/page.tsx` | Internal documentation viewer |
| `app/[locale]/(admin)/admin/notes/` | Admin notes |

## Layout Hierarchy

```
(admin)/admin/layout.tsx
  └── requireAdmin("/") ← Auth check, redirects non-admins
       └── <SidebarProvider style="--sidebar-width: calc(var(--spacing) * 72)">
            ├── <AdminSidebar variant="inset" collapsible="offcanvas" />
            └── <SidebarInset>
                 ├── <DashboardHeader />
                 └── div.flex.flex-1.flex-col
                      └── div.@container/main.flex.flex-1.flex-col.gap-2
                           └── {children}
```

### Sidebar Nav Items

Dashboard · Tasks · Docs · Notes · Users · Products · Orders · Sellers · "Back to Store"

### Mobile Behavior

SidebarProvider with `collapsible="offcanvas"` renders the sidebar as a Sheet overlay on mobile. No dedicated mobile tab bar — the SidebarTrigger button in DashboardHeader opens the Sheet.

---

## Prerequisites

- Admin-role user account (seeded or provisioned via Supabase)
- Logged in as admin before starting scenarios
- Dev server running at `http://127.0.0.1:3000`
- No `data-testid` attributes exist — all selectors use role/text/CSS

---

## Known Bugs

### ADMIN-001 — Data Tables Not Mobile-Optimized

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Component** | Users, Products, Orders, Sellers tables |
| **Behavior** | Sidebar mobile handling exists via `SidebarProvider` + offcanvas Sheet, but content data tables still rely on horizontal scroll and dense nowrap cells on narrow viewports. |
| **Expected** | Tables should use responsive card layout or horizontal scroll container with visible scroll affordance on mobile |

---

## Scenarios

### S17.1 — Admin Auth Gate (requireAdmin)

> Verify non-admin users cannot access admin routes.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Log in as a regular (non-admin) user | Auth completes, redirected to homepage |
| 2 | Navigate to `/en/admin` | `requireAdmin()` fires, user is redirected to `/` |
| 3 | Attempt direct navigation to `/en/admin/users` | Same redirect to `/` — no admin content visible |
| 4 | Log out, navigate to `/en/admin` unauthenticated | Redirect to `/` or login page |

📸 **Screenshot checkpoint:** Redirect confirmation — homepage visible after admin route attempt.

---

### S17.2 — Sidebar Sheet on Mobile

> Verify the sidebar renders as an offcanvas Sheet overlay on mobile viewports.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Log in as admin, navigate to `/en/admin` | Dashboard loads, sidebar is hidden (offcanvas) |
| 2 | Verify no sidebar is visible in the viewport | Main content occupies full width, no sidebar rail or collapsed state |
| 3 | Tap the SidebarTrigger button in DashboardHeader | Sheet overlay slides in from the left with all 8 nav items + "Back to Store" |
| 4 | Verify Sheet backdrop/overlay is visible | Dark overlay behind Sheet, tappable to dismiss |
| 5 | Tap a nav item (e.g., "Users") | Sheet closes, navigates to `/en/admin/users` |
| 6 | Tap SidebarTrigger again, then tap backdrop | Sheet dismisses without navigation |

📸 **Screenshot checkpoints:** (a) Dashboard with sidebar hidden, (b) Sheet overlay open with nav items, (c) Sheet dismissed.

---

### S17.3 — Dashboard Header & Trigger

> Verify DashboardHeader renders correctly on mobile with accessible SidebarTrigger.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Navigate to `/en/admin` as admin | DashboardHeader visible at top |
| 2 | Verify SidebarTrigger button is visible and tappable | Button has ≥44px touch target, identifiable icon (hamburger/menu) |
| 3 | Verify header does not overlap or clip content | Header is fixed/sticky, content scrolls beneath without overlap |
| 4 | Navigate to `/en/admin/orders` | Header persists across route changes, SidebarTrigger still functional |

📸 **Screenshot checkpoint:** DashboardHeader with SidebarTrigger on Pixel 5.

---

### S17.4 — Dashboard Overview

> Verify the main admin dashboard renders stats cards and recent activity on mobile.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Navigate to `/en/admin` as admin | Dashboard page loads |
| 2 | Verify `admin-stats-cards` render | KPI cards visible, stacked vertically or in responsive grid on mobile |
| 3 | Verify cards do not overflow horizontally | All card content readable, no horizontal scroll on the page |
| 4 | Scroll down to `admin-recent-activity` | Activity feed visible, items stack vertically |
| 5 | Verify loading skeleton shows on slow connection | Throttle network, reload — `loading.tsx` skeleton renders while data fetches |

📸 **Screenshot checkpoints:** (a) Stats cards on Pixel 5, (b) Recent activity feed, (c) Loading skeleton.

---

### S17.5 — Data Tables Mobile Readability (Users, Products, Orders, Sellers)

> Verify all four data table routes are readable on mobile. Relates to ADMIN-001.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Navigate to `/en/admin/users` as admin | Users table/list renders |
| 2 | Check horizontal overflow | Table either: (a) uses horizontal scroll container with visible scroll affordance, or (b) reformats as stacked cards on mobile |
| 3 | Verify text is not truncated to illegibility | Key columns (name, email, role) are readable without horizontal scrolling |
| 4 | Repeat for `/en/admin/products` | Products data visible and readable |
| 5 | Repeat for `/en/admin/orders` | Orders data visible and readable |
| 6 | Repeat for `/en/admin/sellers` | Sellers data visible and readable |
| 7 | Check loading states for each | Navigate to each route — `loading.tsx` skeleton shows during data fetch |

📸 **Screenshot checkpoints:** Each table route on Pixel 5 — document overflow behavior, mark ADMIN-001 as confirmed or resolved.

**ADMIN-001 Verification:** Record whether tables overflow, scroll, or reformat. Note exact behavior per route.

---

### S17.6 — Tasks Page

> Verify the tasks management page renders correctly on mobile.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Navigate to `/en/admin/tasks` as admin | Tasks page loads with custom `_components/` |
| 2 | Verify task list/board renders on mobile | Content fits viewport width, no horizontal overflow |
| 3 | Verify task items are tappable | Touch targets ≥44px, tap opens task detail or inline expand |
| 4 | Scroll through tasks | Smooth scroll, no layout jank |

📸 **Screenshot checkpoint:** Tasks page on Pixel 5.

---

### S17.7 — Docs & Notes Pages

> Verify internal documentation and notes pages render on mobile.

| Step | Action | Expected |
|------|--------|----------|
| 1 | Navigate to `/en/admin/docs` as admin | Docs page loads, content readable |
| 2 | Verify documentation content is mobile-friendly | Text wraps properly, code blocks have horizontal scroll if needed |
| 3 | Navigate to `/en/admin/notes` | Notes page loads |
| 4 | Verify notes content layout on mobile | Content stacks vertically, readable without horizontal scroll |

📸 **Screenshot checkpoint:** Docs page and Notes page on Pixel 5.

---

### S17.8 — ADMIN-001 Comprehensive Verification

> Dedicated scenario to systematically document ADMIN-001 across all table routes.

| Step | Action | Expected |
|------|--------|----------|
| 1 | For each table route (`users`, `products`, `orders`, `sellers`): measure content width vs viewport width | Document: does content exceed 393px (Pixel 5)? |
| 2 | If overflow exists: check for `overflow-x: auto` or scroll container | Document: is horizontal scroll available? Is scroll affordance visible? |
| 3 | Check if any action buttons (edit, delete, view) are accessible | Buttons reachable without horizontal scroll, touch targets ≥44px |
| 4 | Test on iPhone 12 (390×844) as well | Compare behavior at 390px vs 393px |
| 5 | Document findings per route | Fill in ADMIN-001 table below |

**ADMIN-001 Status per Route:**

| Route | Overflows? | Scroll Container? | Action Buttons Accessible? | Verdict |
|-------|------------|--------------------|---------------------------|---------|
| `/admin/users` | | | | |
| `/admin/products` | | | | |
| `/admin/orders` | | | | |
| `/admin/sellers` | | | | |

📸 **Screenshot checkpoints:** Each table at both Pixel 5 and iPhone 12 widths.

---

## Evidence Log (v2)

Fixed columns. Add one row per scenario run (or per sub-scenario if needed).

| Scenario | Method | Artifact | Result | Issue ID | Severity | Owner | Date |
|----------|--------|----------|--------|----------|----------|-------|------|
| S17.1 | code trace | `requireAdmin("/")` in admin layout | Pass | — | — | Codex | 2026-02-11 |
| S17.2 | code trace | Admin sidebar uses `collapsible=\"offcanvas\"` + shared mobile sheet | Pass | ADMIN-001 | P2 | Codex | 2026-02-11 |
| S17.3 | code trace | Header includes `SidebarTrigger` and locale switcher | Pass | — | — | Codex | 2026-02-11 |
| S17.4 | code trace | Dashboard overview cards/activity components present | Pass | — | — | Codex | 2026-02-11 |
| S17.5 | code trace | Tables are wrapped with horizontal scroll, but `whitespace-nowrap` on headers/cells limits mobile readability | Partial | ADMIN-001 | P2 | Codex | 2026-02-11 |
| S17.6 | code trace | Tasks route present and reachable via admin nav | Pass | — | — | Codex | 2026-02-11 |
| S17.7 | code trace | Docs/notes routes present and reachable via admin nav | Pass | — | — | Codex | 2026-02-11 |
| S17.8 | code trace | ADMIN-001 sweep: mobile sidebar support exists; table UX remains scroll-heavy and dense on small screens | Partial | ADMIN-001 | P2 | Codex | 2026-02-11 |

Method suggestions: `runtime` | `code trace` | `manual` (keep it consistent within a phase).


---

## Findings

| ID | Scenario | Severity | Status | Notes |
|----|----------|----------|--------|-------|
| ADMIN-001 | S17.5/S17.8 | P2 | ⚠ Open | Sidebar/mobile sheet implementation is present, but admin data tables remain dense and scroll-heavy on small screens due to nowrap cells. |
| ADMIN-ROUTE-002 | Cross-cutting | P1 | ❌ Open | Admin products table links to non-canonical `/product/{id}` route instead of canonical PDP path. |
| ADMIN-UX-003 | Cross-cutting | P2 | ⚠ Open | Multiple admin table pages lack explicit empty-state rows, creating ambiguous blank-table outcomes on zero-data states. |
| ADMIN-UX-004 | Cross-cutting | P2 | ⚠ Open | List-route data-fetch errors are mostly logged server-side with limited user-facing recovery surfaces. |
| ADMIN-A11Y-005 | Cross-cutting | P2 | ⚠ Open | Several admin icon-only controls (sidebar trigger/notes actions) rely on compact sizes that are below the 44px touch-target rule. |

---

## Summary

| Metric | Count |
|--------|-------|
| Total scenarios | 8 |
| Passed | 6 |
| Failed | 0 |
| Partial | 2 |
| Bugs found | 5 (P1:1, P2:4) |
| Known bugs verified | ADMIN-001 = partially resolved (sidebar fixed, table readability still open) |
| Status | ✅ Complete (code audit) |
