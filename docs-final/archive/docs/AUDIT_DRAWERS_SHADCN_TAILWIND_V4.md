# Drawers + Sheets Audit & Execution Guide (Tailwind v4 + shadcn/ui + Vaul)

Date: 2026-01-21  
Scope: mobile drawers (quick view, categories/menu, cart/wishlist, account/messages), filter drawers, sell-flow drawers, and any `Sheet`/`Dialog` used as “drawer-like” UI.  
Canonical rules: `docs/DESIGN.md`, `docs/FRONTEND.md`, `docs/ENGINEERING.md` (this file is an audit + execution checklist, not a new design source of truth).

---

## TL;DR (what’s currently off)

- **i18n drift inside drawers**: many user strings (including `aria-*` and `sr-only`) are hardcoded and/or locale-conditional instead of `next-intl`.
- **Touch targets**: multiple drawer controls use `h-6`, `h-7`, `size-6`, `size-7` (below the repo minimum 32px).
- **Vaul scroll correctness**: almost no drawers use `data-vaul-no-drag` (only the quick view uses `DrawerBody`). This commonly breaks scrolling and causes “drag steals scroll”.
- **Tailwind v4 theming drift**: drawer code contains avoidable arbitrary values (e.g. `max-h-[92dvh]`, `pb-[calc(...)]`) and some hardcoded neutrals (`bg-white`, `text-white`).
- **Pattern fragmentation**: there are multiple “cart drawers”, multiple “menu/side panels” (Vaul Drawer vs Radix Sheet), and duplicated handle/close patterns.

---

## Inventory (where drawers/sheets live)

### Primitives / base styling
- `components/ui/drawer.tsx` (Vaul wrapper)
- `components/ui/sheet.tsx` (Radix Dialog “sheet” wrapper)
- `app/shadcn-components.css` (Vaul + shadcn component CSS)
- `app/utilities.css` (safe-area utilities: `pb-safe`, `pb-safe-max`, etc.)
- `app/globals.css` + `app/legacy-vars.css` (theme tokens + legacy CSS vars used by drawers)

### “Global” mobile drawers (provider-driven)
- `components/providers/drawer-context.tsx`
- `app/[locale]/global-drawers.tsx`
- `components/mobile/drawers/product-quick-view-drawer.tsx`
- `components/mobile/drawers/cart-drawer.tsx`
- `components/mobile/drawers/messages-drawer.tsx`
- `components/mobile/drawers/account-drawer.tsx`

### Categories/menu (bottom nav)
- `components/mobile/mobile-tab-bar.tsx`
- `components/mobile/mobile-menu-sheet.tsx` (uses Vaul Drawer)

### Cart / wishlist (header + mobile)
- `components/layout/header/cart/mobile-cart-dropdown.tsx` (drawer-triggered cart)
- `components/mobile/drawers/cart-drawer.tsx` (global cart drawer)
- `components/shared/wishlist/wishlist-drawer.tsx` (drawer)
- `components/shared/wishlist/mobile-wishlist-button.tsx` (trigger)

### Filters (bottom sheets / hubs)
- `components/shared/filters/sort-modal.tsx`
- `components/shared/filters/filter-hub.tsx`
- `components/shared/filters/filter-modal.tsx`

### Sidebar / side panels
- `components/layout/sidebar/sidebar.tsx` (mobile uses `Sheet`)
- `components/layout/sidebar/sidebar-menu-v2.tsx` (mobile uses Vaul `Drawer` left)

### Sell flow drawers
- `app/[locale]/(sell)/_components/ui/select-drawer.tsx`
- `app/[locale]/(sell)/_components/fields/condition-field.tsx`
- `app/[locale]/(sell)/_components/ui/category-modal/index.tsx`
- `app/[locale]/(sell)/_components/ui/brand-combobox.tsx`
- `app/[locale]/(sell)/_components/steps/step-pricing.tsx`
- `app/[locale]/(sell)/_components/steps/step-details.tsx`

### “Drawer-like” Sheets used elsewhere
- `components/support/support-chat-widget.tsx`
- `app/[locale]/(account)/account/_components/account-addresses-grid.tsx`
- `app/[locale]/(account)/account/wishlist/_components/account-wishlist-grid.tsx`
- `app/[locale]/(account)/account/orders/_components/account-orders-grid.tsx`
- `app/[locale]/(checkout)/_components/checkout-page-client.tsx`

---

## Treido Audit — 2026-01-21

### Critical (blocks release-quality)
- [ ] **i18n**: hardcoded drawer strings (visible + `sr-only` + `aria-*`) instead of `next-intl`.  
      Examples (not exhaustive):  
      - `components/mobile/drawers/cart-drawer.tsx` (close/empty strings, `aria-label`s)  
      - `components/mobile/drawers/messages-drawer.tsx` (relative time labels, unread/read labels)  
      - `components/mobile/drawers/account-drawer.tsx` (sign-in prompts, close)  
      - `components/mobile/mobile-menu-sheet.tsx` (all labels, close menu label, description)  
      - `components/shared/wishlist/wishlist-drawer.tsx` (toasts + button labels)  
      - `components/layout/sidebar/sidebar.tsx` + `components/ui/sheet.tsx` (hardcoded `sr-only` strings)
- [ ] **Touch targets**: buttons smaller than 32px in drawers (WCAG + repo rail).  
      High-impact files:  
      - `components/shared/wishlist/wishlist-drawer.tsx` (`h-6`, `size-6`)  
      - `components/mobile/drawers/cart-drawer.tsx` / `components/layout/header/cart/mobile-cart-dropdown.tsx` (`h-7`, `size-7`)  
      - `components/mobile/drawers/messages-drawer.tsx` / `components/mobile/drawers/account-drawer.tsx` (`h-7`)
- [ ] **Vaul scroll/drag correctness**: scrollable regions inside drawers must use `data-vaul-no-drag`.  
      Current state: only `components/mobile/drawers/product-quick-view-drawer.tsx` uses `DrawerBody` (which applies it). Most other drawers use `overflow-y-auto` divs without the attribute.

### High (do next sprint)
- [ ] **Arbitrary Tailwind values in drawer paths** (prefer theme tokens/utilities):  
      - `components/shared/filters/filter-hub.tsx` (`max-h-[92dvh]`, `pb-[calc(...)]`)  
      - `components/shared/filters/filter-modal.tsx` (same pattern)  
      - `components/mobile/drawers/account-drawer.tsx` (`max-h-[85dvh]`)  
      - `app/[locale]/(sell)/_components/fields/condition-field.tsx` (`max-h-[90vh]`)  
      Replace with `max-h-dialog`, `max-h-dialog-sm`, etc, or introduce a token/utility.
- [ ] **Duplicate handles**: some drawers add a custom drag handle while `DrawerContent` already renders one by default.  
      Example: `components/shared/filters/sort-modal.tsx`.
- [ ] **Pattern fragmentation**: multiple menu/side-panel implementations (`Sheet` vs Vaul `Drawer` left), multiple cart drawers, inconsistent header/close patterns.
- [ ] **Localized routing correctness**: avoid using `next/navigation` router helpers in locale-scoped UI where `@/i18n/routing` is expected.  
      Example: `components/mobile/drawers/product-quick-view-drawer.tsx` uses `useRouter` from `next/navigation`.

### Deferred (backlog / after stabilization)
- [ ] **URL-driven drawers** (route-state): unify quick view and other “modal” UI behind URL state for share/back semantics.
- [ ] **Single-open policy**: prevent multiple drawers/sheets being open simultaneously (either via context or a small orchestrator).

---

## Tailwind Lane Phase 1 Audit — 2026-01-21

Ran:
- `pnpm -s styles:scan`

Results:
- Palette/gradient scan: **0 findings**
- Arbitrary/hex scan: **21 files**, **26 arbitrary**, **33 hex**  
  Full report: `cleanup/arbitrary-scan-report.txt` (hex is mostly legitimate in `components/shared/filters/color-swatches.tsx` per repo policy).

Targeted follow-up scans (drawer scope):
- `rg -n "\\b(bg-white|text-white|border-gray|text-black)\\b" app components`
- `rg -n "\\b(h-6|h-7|size-6|size-7)\\b" app components`
- `rg -n "<DrawerBody|data-vaul-no-drag" app components`

---

## Drawer “Gold Standard” (use this everywhere)

### Structure (Vaul Drawer)
- `DrawerContent`: owns the overlay + content container.
- `DrawerHeader`: title + close.
- `DrawerBody`: **all scrollable content** (adds `data-vaul-no-drag`).
- `DrawerFooter`: sticky actions (already safe-area aware via `pb-safe-max`).

Minimal template (pseudo-structure):
- `Drawer` → `DrawerContent` → `DrawerHeader` + `DrawerBody` + `DrawerFooter`

Rules:
- **Do not** put `overflow-y-auto` directly on random `div`s; put scrolling inside `DrawerBody`.
- If you add a custom handle, set `showHandle={false}` on `DrawerContent` to avoid double handles.
- Keep close buttons at **≥32px**: prefer `h-touch-xs` / `size-touch-xs` (or `size-touch` where appropriate).

### Structure (Radix Sheet)
Use for side panels / desktop-ish drawers:
- `Sheet` → `SheetContent` (+ provide your own localized close affordance; avoid hardcoded `sr-only` defaults).

---

## UX Decisions (recommended defaults)

### Should tapping a product card on mobile open a drawer or navigate?

Current behavior: `components/shared/product/product-card.tsx` prevents navigation on mobile and opens the quick view drawer.

Recommendation:
- **Primary tap should navigate** (or be URL-driven “modal”), because it preserves:
  - shareable URLs
  - browser back behavior (especially Android back)
  - expected marketplace mental model (“tap product → product page”)
- Keep **Quick View** as a secondary action:
  - a small “Quick view” affordance/button on the card, or
  - long-press on card, or
  - tap opens page; a “peek drawer” is triggered from within the list via explicit control.

Best-of-both (optional, higher effort):
- Make mobile quick view **route-driven** (Next.js intercepting route) and render it as a Vaul `Drawer` UI on mobile. Then tapping a product can still be “navigation” while visually staying in a drawer.

### Should chat be a drawer?

Recommendation:
- Keep **/chat as the primary destination** (full-height UI, keyboard handling, deep scroll, shareable state).
- Use a **Messages drawer as a “peek”** (you already have `components/mobile/drawers/messages-drawer.tsx`) that links into `/chat/{id}` and `/chat`.
- Only add a “chat drawer” if it’s a narrow, deliberate use case (e.g., quick reply from anywhere), and treat it as an explicit action—not the default navigation.

---

## Execution Plan (for the agent)

Keep changes small (1–3 files per batch), run gates after each meaningful batch.

### Phase 0 — Baseline (no code changes)
- [ ] Run `pnpm -s styles:scan` and paste results into the PR/notes.
- [ ] For the drawer file list above, run the three `rg` commands from Tailwind lane section.

### Phase 1 — Vaul correctness pass (lowest risk, highest UX impact)
- [ ] Convert every scrollable drawer section to `DrawerBody` (or add `data-vaul-no-drag` where `DrawerBody` can’t be used).
- [ ] Remove duplicate handles (or pass `showHandle={false}` when a custom handle is required).

### Phase 2 — Touch targets (fast, measurable)
- [ ] Replace `h-6/h-7/size-6/size-7` controls with `h-touch-xs`/`h-touch-sm` (and consistent padding).
- [ ] Ensure close buttons meet touch target and have localized `aria-label`.

### Phase 3 — i18n cleanup (repo rail)
- [ ] Eliminate `locale === "bg" ? ... : ...` inside drawer UI for user-facing strings.
- [ ] Add missing keys to `messages/en.json` and `messages/bg.json`.
- [ ] Ensure all `aria-*` and `sr-only` strings are also localized.

### Phase 4 — Tailwind v4 tokenization (reduce drift)
- [ ] Replace arbitrary drawer sizing (`max-h-[...]`) with `max-h-dialog`, `max-h-dialog-sm`, etc.
- [ ] Replace safe-area calc arbitrary values with `pb-safe-max` or add a dedicated utility to `app/utilities.css` (avoid `pb-[calc(...)]`).
- [ ] Reduce reliance on `app/legacy-vars.css` for drawer sizing if a stable `@theme` token can represent it.

### Phase 5 — Consolidation (optional, but worth it)
- [ ] Deduplicate cart drawer UI (`components/mobile/drawers/cart-drawer.tsx` vs `components/layout/header/cart/mobile-cart-dropdown.tsx`).
- [ ] Pick one “mobile menu” pattern (Vaul Drawer-left vs Radix Sheet) and standardize.

---

## Verification gates (required after non-trivial changes)

- `pnpm -s exec tsc -p tsconfig.json --noEmit`
- `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`
- `pnpm -s styles:gate`

---

## Definition of Done (drawer lane)

- [ ] Every drawer has: localized title/labels, correct touch targets, correct scroll (`data-vaul-no-drag`), safe area padding, and no duplicate handles.
- [ ] No new arbitrary Tailwind values; existing drawer-related arbitrary values reduced or justified.
- [ ] No new hardcoded strings (including `aria-*` / `sr-only`) outside `next-intl`.
- [ ] Product card mobile behavior is intentionally decided (navigate vs quick view) and consistent with analytics/UX goals.

