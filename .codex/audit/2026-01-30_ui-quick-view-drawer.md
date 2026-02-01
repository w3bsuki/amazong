## NEXTJS

### Scope
- Files:
  - `app/[locale]/locale-providers.tsx`
  - `app/[locale]/global-drawers.tsx`
  - `components/providers/drawer-context.tsx`
  - `components/shared/product/product-card.tsx`
  - `components/mobile/drawers/product-quick-view-drawer.tsx`
  - `components/ui/drawer.tsx`
  - `hooks/use-product-quick-view-details.ts`
  - `app/api/products/quick-view/route.ts`
  - `app/[locale]/(main)/search/@modal/(..)[username]/[productSlug]/page.tsx`
  - `app/shadcn-components.css`
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| NEXTJS-001 | High | `app/[locale]/locale-providers.tsx:41` | Suspense fallback renders `{children}` + `GlobalDrawers` and the resolved branch renders `{children}` + `GlobalDrawers` again (`:42-56`), which can double-mount large client subtrees during streaming/suspense → easy source of “fallback/broken UI” + state resets. | Render `GlobalDrawers` only once; remove `{children}` from fallback (or make fallback minimal/skeleton) so children don’t mount twice. |
| NEXTJS-002 | High | `components/shared/product/product-card.tsx:229` | `ProductCard` subscribes to `DrawerContext` (`useDrawer()`), so opening/closing any drawer updates context state and can re-render every product card in a grid → scroll jank on mobile lists. | Split drawer context into `DrawerStateContext` (only consumers that need `state`) + `DrawerActionsContext` (open/close + flags) so grids only subscribe to stable actions. |
| NEXTJS-003 | Medium | `app/[locale]/global-drawers.tsx:4` | `GlobalDrawers` is mounted for every locale route (`app/[locale]/locale-providers.tsx:54`) and statically imports all drawers + desktop dialog, pulling heavy client bundles onto pages that don’t need them → worsens mobile TTI/scroll performance. | Lazy-load drawers (e.g., `next/dynamic`) and/or render each drawer only when its `open` flag is true; consider mounting drawers only in the route group(s) that use them (e.g. `(main)` layout). |
| NEXTJS-004 | High | `components/mobile/drawers/product-quick-view-drawer.tsx:124` | Quick view sets `DrawerBody` to `overflow-hidden`, overriding the primitive’s scroll container (`components/ui/drawer.tsx:342-350`) → likely the direct cause of “drawer doesn’t scroll / feels laggy” on mobile (especially combined with aggressive scroll locking). | Don’t override `DrawerBody` overflow; rely on the primitive’s `overflow-y-auto overscroll-contain` (or move `overflow-hidden` to a non-scroll wrapper inside). |
| NEXTJS-005 | Medium | `app/shadcn-components.css:9` | Global CSS sets `[data-vaul-drawer] { touch-action: none; }`, which can fight the intended per-element `touch-action-pan-y` scroll strategy and amplify gesture jank in drawers. | Remove/relax that rule for vertical drawers (prefer `pan-y` on the correct element) and let `DrawerBody` manage scroll containment. |
| NEXTJS-006 | Low | `app/[locale]/(main)/search/@modal/(..)[username]/[productSlug]/page.tsx:36` | The route-modal quick view does an extra Supabase query for `parentCategory` that isn’t wrapped in a cached helper; modal open can be slower than necessary (desktop, but still). | Fold parent category into `fetchProductByUsernameAndSlug` (cached) or add a small cached helper tagged by `category:<id>`. |

### Acceptance Checks
- [ ] On mobile, opening product quick view shows content immediately (no double-mount flicker) and the drawer content scrolls smoothly.
- [ ] React Profiler: opening/closing quick view does **not** re-render the entire product grid (only drawer-related UI updates).
- [ ] `GlobalDrawers` exists once per page (no duplicate mounting during suspense/streaming).

### Risks
- Splitting contexts (NEXTJS-002) touches many call sites and needs careful regression testing for all drawer triggers (cart/messages/account/quick view).
- Lazy-loading drawers (NEXTJS-003) can change when analytics/events fire and may require ensuring portals/render timing still matches UX expectations.

## TW4

### Scope
- Files:
  - components/ui/drawer.tsx
  - app/globals.css
  - app/shadcn-components.css
  - app/utilities.css
  - components/mobile/drawers/product-quick-view-drawer.tsx
  - components/shared/product/quick-view/product-quick-view-content.tsx
  - components/shared/product/quick-view/quick-view-image-gallery.tsx
  - components/shared/product/quick-view/quick-view-skeleton.tsx
  - components/shared/product/product-card-actions.tsx
  - components/mobile/product/mobile-bottom-bar-v2.tsx
  - components/shared/product/customer-reviews-hybrid.tsx
  - components/shared/product/product-page-layout.tsx
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| TW4-001 | High | components/ui/drawer.tsx:348 | Uses `touch-action-pan-y`, which is not a Tailwind utility and is not defined in `app/utilities.css`; combined with `[data-vaul-drawer]{touch-action:none}` in `app/shadcn-components.css` this can break/lag vertical scrolling inside the drawer on mobile. | Replace with Tailwind `touch-pan-y` (preferred) or add a matching `@utility touch-action-pan-y { touch-action: pan-y; }` and keep naming consistent. |
| TW4-002 | High | components/shared/product/quick-view/quick-view-image-gallery.tsx:167 | Uses `touch-action-pan-x` (not Tailwind / not defined), so horizontal swipe/scroll behavior can be inconsistent/laggy. | Replace with Tailwind `touch-pan-x` (and apply similarly at `components/shared/product/quick-view/quick-view-image-gallery.tsx:243`). |
| TW4-003 | Medium | components/shared/product/quick-view/product-quick-view-content.tsx:190 | Uses `touch-action-manipulation` (not Tailwind / not defined); multiple occurrences across mobile drawers/quick view means intended touch tuning likely isn’t applied. | Replace with Tailwind `touch-manipulation` or drop it where redundant (base layer already sets `touch-action: manipulation` for interactive elements in `app/globals.css`). |
| TW4-004 | High | components/shared/product/quick-view/quick-view-image-gallery.tsx:168 | Forbidden bracket arbitrary value `aspect-[16/10]` (per Treido rails: no `[...]`). | Replace with a tokenized/custom utility (e.g. `@utility aspect-gallery { aspect-ratio: 16 / 10; }` in `app/utilities.css`, then use `aspect-gallery`). |
| TW4-005 | High | components/shared/product/quick-view/quick-view-skeleton.tsx:12 | Forbidden bracket arbitrary value `aspect-[4/3]`. | Same approach as TW4-004 (add a named utility like `aspect-4x3` via `@utility`, or switch to an allowed built-in aspect class if acceptable). |
| TW4-006 | High | components/shared/product/product-card-actions.tsx:124 | Forbidden bracket arbitrary value `stroke-[1.5]`. | Use allowed steps (`stroke-1` / `stroke-2`) or add a named `@utility stroke-1_5 { stroke-width: 1.5; }`. |
| TW4-007 | High | components/mobile/product/mobile-bottom-bar-v2.tsx:220 | Forbidden bracket arbitrary value `flex-[1.5]`. | Replace with allowed layout utilities (e.g. `flex-1` + `basis-*`/`grow`/`shrink` as needed) or add a named `@utility flex-1_5 { flex: 1.5; }`. |
| TW4-008 | High | components/shared/product/customer-reviews-hybrid.tsx:94 | Forbidden bracket arbitrary value `lg:grid-cols-[240px_1fr]` (also appears in `components/shared/product/product-page-layout.tsx:84` and `components/shared/product/product-page-layout.tsx:238`). | Replace with an allowed grid template strategy, or add named `@utility grid-cols-*` utilities and use `lg:grid-cols-<name>`. Also extend `scripts/scan-tailwind-arbitrary.mjs` to catch `aspect|grid-cols|flex|stroke` bracket patterns so `pnpm -s styles:gate` enforces the rail. |

### Acceptance Checks
- [ ] `pnpm -s styles:gate` passes
- [ ] `rg -n "touch-action-pan-|touch-action-manipulation" components` returns no matches
- [ ] `rg -n "aspect-\\[|grid-cols-\\[|stroke-\\[|flex-\\[" components` returns no matches
- [ ] On a mobile device (esp. iOS Safari), drawer + quick view content scrolls smoothly; horizontal image gallery swipes work without “stuck” scrolling

### Risks
- Changing `touch-*` behavior can affect Vaul drag-to-dismiss; verify bottom drawer drag + inner scroll don’t fight.
- Replacing arbitrary layout ratios/columns may shift visual layout; quick view + product card density should be rechecked on small screens.
- Backdrop blur is used widely on mobile surfaces; even when token-correct, it can still contribute to perceived scroll lag on lower-end devices (consider reducing blur usage in scrolling regions if performance remains an issue).

## SHADCN

### Scope
- Files:
  - components/ui/drawer.tsx
  - components/mobile/drawers/product-quick-view-drawer.tsx
  - components/shared/filters/sort-modal.tsx
  - components/layout/sidebar/sidebar-menu-v2.tsx
  - components/ui/drawer.stories.tsx
- Lines: n/a

### Findings
| ID | Severity | File:Line | Issue | Fix |
|----|----------|-----------|-------|-----|
| SHADCN-001 | High | components/ui/drawer.tsx:110 | `DrawerOverlay` mutates `body/html` styles (scroll lock + `position: fixed`) and is always mounted by `DrawerContent`, which contradicts the iOS “no body styles / disablePreventScroll” intent and is likely a root cause for mobile drawer jank/fallback. | Remove manual scroll lock from `DrawerOverlay`; rely on Vaul defaults via `Drawer.Root` or make scroll-lock behavior opt-in outside `components/ui/*`. |
| SHADCN-002 | High | components/mobile/drawers/product-quick-view-drawer.tsx:124 | Quick view overrides `DrawerBody` with `overflow-hidden`, defeating the primitive’s scroll container (and its `data-vaul-no-drag` intent) → likely “can’t scroll / feels broken” quick view UX. | Don’t override `DrawerBody` to `overflow-hidden`; keep it scrollable or add a dedicated scroll container with `data-vaul-no-drag`. |
| SHADCN-003 | Medium | components/layout/sidebar/sidebar-menu-v2.tsx:299 | Drawer’s scrollable region is a custom `div` without `data-vaul-no-drag`/`DrawerBody`, increasing drag-vs-scroll gesture conflicts inside Vaul drawers. | Use `DrawerBody` for the scrolling region or add `data-vaul-no-drag` to the scroll container. |
| SHADCN-004 | Medium | components/shared/filters/sort-modal.tsx:101 | Mobile sort drawer uses `overflow-y-auto` content without `DrawerBody`/`data-vaul-no-drag`, risking scroll being interpreted as drawer drag (especially on iOS). | Replace the scroll wrapper with `DrawerBody` or add `data-vaul-no-drag` to the scroll wrapper. |
| SHADCN-005 | Low | components/ui/drawer.tsx:277 | `DrawerContent` injects an sr-only title fallback with a hardcoded `"Dialog"` string, violating Treido’s “all user-facing strings via next-intl” rail (a11y text counts). | Make `aria-label` required (or require a `DrawerTitle` child) and remove the hardcoded fallback string. |
| SHADCN-006 | Low | components/ui/drawer.stories.tsx:33 | Story renders `DrawerOverlay` inside `DrawerContent`, but `DrawerContent` already injects an overlay → double overlay + double scroll-lock side effects, making story behavior misleading. | Remove `DrawerOverlay` from the story (or stop exporting it if it’s meant to be internal). |

### Acceptance Checks
- [ ] `components/ui/*` has no imports from `app/**` (e.g. `rg -n "@/app/" components/ui` has no matches)
- [ ] No domain/data fetching code inside `components/ui/*` (e.g. `rg -n "supabase|stripe" components/ui` has no matches)
- [ ] Mobile: product quick view drawer scrolls normally (no forced “can’t scroll” state)
- [ ] iOS Safari: opening/closing drawers doesn’t cause sticky header jump/disappear or page position “teleport”

### Risks
- Changing scroll-lock/overlay behavior can reintroduce background scroll or focus/scroll-restoration quirks; verify on iOS Safari + Chrome Android across the main drawers (quick view, filters, cart, sidebar).
