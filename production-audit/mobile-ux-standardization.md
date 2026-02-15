# Mobile UX Standardization Audit

Date: 2026-02-15  
Owner: codex-orchestrator  
Canonical patterns:
- `app/[locale]/(main)/_components/mobile-home-v4.tsx`
- `app/[locale]/(main)/demo/v4/demo-v4-home.tsx`

## Scope
- Categories browsing (`/categories`, `/categories/[slug]`, subcategory exploration)
- Global drawers (quick view/cart/wishlist/account/messages/auth)
- Mobile headers, rails, filter/sort bars, chips/tabs, feed rhythm
- Shared primitive dedupe for mobile rail classes and filter count logic

## Baseline Screenshot References
- `/` -> `production-audit/screenshots/mobile-home-v4-390.png`
- `/categories` -> `production-audit/screenshots/categories-index-390.png`
- `/categories/[slug]` -> `production-audit/screenshots/categories-slug-390.png`
- `/:username/:product` -> `production-audit/screenshots/product-page-390.png`
- Quick view drawer -> `production-audit/screenshots/quick-view-drawer-390.png`
- Cart drawer -> `production-audit/screenshots/cart-drawer-390.png`
- Wishlist drawer -> `production-audit/screenshots/wishlist-drawer-390.png`
- Account drawer -> `production-audit/screenshots/account-drawer-390.png`
- Messages drawer -> `production-audit/screenshots/messages-drawer-390.png`
- Auth drawer (`login`, `signup`) -> `production-audit/screenshots/auth-drawer-390.png`

Viewport baseline: `360`, `390`, `430` (plus overflow sanity at `320`).

## High Severity Backlog
| Severity | Surface | File(s) | Issue | Proposed fix | Status |
|---|---|---|---|---|---|
| High | Drawer architecture | `components/providers/drawer-context.tsx`, `app/[locale]/_components/global-drawers.tsx`, `components/shared/wishlist/mobile-wishlist-button.tsx`, `components/shared/wishlist/wishlist-drawer.tsx` | Wishlist used a local drawer root, bypassing global orchestration and creating inconsistent overlay behavior. | Move wishlist into `DrawerProvider` + `GlobalDrawers`, convert wishlist drawer to controlled API, trigger from global context. | Implemented |
| High | Auth drawer transition | `components/mobile/drawers/auth-drawer.tsx`, `components/providers/drawer-context.tsx` | Auth -> account used fixed timeout, causing race-prone transitions. | Replace timeout with provider-level `openAccountAfterAuthClose` transition method. | Implemented |
| High | Category feed safe-area rhythm | `app/[locale]/(main)/categories/[slug]/_components/mobile/mobile-category-browser-contextual.tsx` | Category feed could collide with bottom tab bar due missing canonical feed frame. | Wrap contextual mobile feed in `max-w-(--breakpoint-md)` + `pb-tabbar-safe` frame. | Implemented |
| High | Category contextual header render loop | `app/[locale]/(main)/categories/[slug]/_components/mobile/mobile-category-browser-contextual.tsx` | Route hit `Maximum update depth exceeded` from unstable contextual-header effect churn. | Stabilize contextual header dependencies/callbacks, avoid per-rerender header reset, and keep cleanup unmount-only. | Implemented |

## Medium Severity Backlog
| Severity | Surface | File(s) | Issue | Proposed fix | Status |
|---|---|---|---|---|---|
| Medium | Rail class drift | `app/[locale]/(main)/_components/mobile-home-v4.tsx`, `app/[locale]/(main)/demo/v4/demo-v4-home.tsx` | Primary tab/pill/action chip styles duplicated and risk drifting. | Extract shared rail class recipes in `(main)/_lib` and consume from both surfaces. | Implemented |
| Medium | Filter count drift | `components/mobile/category-nav/filter-sort-bar.tsx`, `app/[locale]/(main)/_components/mobile-home-v4.tsx`, `lib/filters/active-filter-count.ts` | Filter count logic duplicated with diverging criteria across rails. | Add shared `getActiveFilterCount` helper; use options per surface. | Implemented |
| Medium | Categories index action confidence | `app/[locale]/(main)/categories/page.tsx` | Quick-action cards had weaker interaction affordance than canonical rails. | Normalize to semantic tokens, touch targets, and focus-visible patterns. | Implemented |
| Medium | Category surface size drift | `app/[locale]/(main)/categories/page.tsx`, `app/[locale]/(main)/categories/loading.tsx`, `components/layout/header/mobile/contextual-header.tsx`, `components/mobile/category-nav/filter-sort-bar.tsx` | `/categories` and contextual category controls felt oversized vs mobile-home patterns. | Normalize list row rhythm, contextual subcategory rail circle sizes, and filter/sort control heights to compact 44px baseline where appropriate. | Implemented |
| Medium | Parent-context loss in drill-down | `app/[locale]/(main)/categories/[slug]/_components/mobile/mobile-category-browser-contextual.tsx` | When drilling into subcategories, users lost a fast "view all in parent" action. | Add persistent contextual banner action (`allIn`) that returns to parent listings without reload; keep short-label naming. | Implemented |
| Medium | Missing category quick pills (brand/size/etc.) | `app/[locale]/(main)/_components/filters/mobile-filter-controls.tsx`, `app/[locale]/(main)/categories/[slug]/_components/mobile/mobile-category-browser-contextual.tsx` | Category slug flow lacked fast attribute entry points for discovery filtering. | Add prioritized quick-attribute pill rail wired to single-section `FilterHub` mode; highlight active attribute filters and keep token-safe compact chip sizing. | Implemented |
| Medium | Quick-view mobile/desktop double-mount cost | `app/[locale]/_components/global-drawers.tsx` | Both quick-view overlays mounted simultaneously and could duplicate detail-fetch work. | Gate quick-view overlay rendering by viewport (`useIsMobile`) so only one quick-view surface mounts at a time. | Implemented |
| Medium | Account mobile rhythm drift | `app/[locale]/(account)/account-layout-content.tsx`, `app/[locale]/(account)/account/_components/account-tab-bar.tsx` | Account mobile spacing/tab-bar sizing diverged from home/contextual token rhythm. | Tokenize account content spacing and tab-bar touch targets with `--spacing-home-*`, `--spacing-bottom-nav`, and control tokens. | Implemented |

## Low Severity Backlog
| Severity | Surface | File(s) | Issue | Proposed fix | Status |
|---|---|---|---|---|---|
| Low | Drawer analytics coverage | `components/providers/_lib/analytics-drawer.ts`, `lib/feature-flags.ts`, `components/providers/drawer-context.tsx` | Wishlist was not represented in drawer analytics/feature-flag contracts. | Extend drawer analytics + feature flags to include wishlist and track open/close events. | Implemented |
| Low | Responsive regression guard | `e2e/mobile-ux-audit*.spec.ts` | No dedicated assertion matrix attached to this pass artifact. | Add screenshot and overflow assertions for `320/360/390/430` to existing mobile audit specs. | Planned |

## Phase Tracking
- Pass A (high-impact UX consistency): Complete for categories + drawers + headers.
- Pass B (spacing/control hierarchy normalization): In progress (categories/account mostly normalized; remaining global drift audit).
- Pass C (cleanup + dedupe): In progress.
- Pass D (tests + polish): In progress (static gates green; smoke e2e unstable in local environment).

## Verification Checklist
- [x] `pnpm -s typecheck` (pass)
- [x] `pnpm -s lint` (pass with warnings only)
- [x] `pnpm -s styles:gate` (pass)
- [ ] `pnpm -s test:unit` (fails in baseline with existing unrelated tests: `__tests__/proxy-middleware.test.ts`, `__tests__/checkout-webhook-idempotency.test.ts`)
- [ ] `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke` (still hangs during warmup/runner in this environment)
- [ ] `REUSE_EXISTING_SERVER=false pnpm -s test:e2e:smoke` (progresses through warmup/routes, then hangs before completion in this environment)
