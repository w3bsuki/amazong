# 14-UI-UX-PLAN.md — App-Feel UI/UX Roadmap

> **How Treido becomes “native-app feeling” while staying simple.** This doc is the execution plan for UI/UX polish without scope creep.

| Scope | UI/UX patterns + implementation approach |
|-------|-----------------------------------------|
| Audience | Humans + AI agents |
| Type | Plan |
| Stack | Next.js App Router + shadcn/ui + Tailwind v4 |

---

## Goals (V1 polish)

1. **Fast + calm** marketplace UX (no visual noise).
2. **Keep browsing context**: users shouldn’t “lose their place” when exploring.
3. **App-feel patterns**:
   - **Mobile**: drawers/sheets for deep actions.
   - **Desktop**: modals for deep dives + multi-step flows.
4. **Accessibility first**: WCAG-aligned focus, labeling, contrast, and touch targets.
5. **Token-safe styling only** (SSOT: `docs/04-DESIGN.md`).

---
## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Modal open interaction-to-paint | < 100ms | DevTools Performance |
| Lighthouse accessibility | ≥ 95 | CI audit |
| Touch target compliance | 100% | All interactive elements ≥ 44px |
| Back-button reliability | 100% | URL-driven, E2E verified |
| Design rail violations | 0 | `pnpm -s styles:gate` |

---

## Current State (as of 2026-02-03)

| Component | Status | Notes |
|-----------|--------|-------|
| Search `@modal` slot | ✅ Done | `app/[locale]/(main)/search/@modal/(..)[username]/[productSlug]/page.tsx` |
| Category `@modal` slot | ❌ Missing | Route exists but no parallel slot |
| Seller preview modal | ❌ Missing | No intercepting route |
| Touch target utilities | ✅ Done | `h-touch`, `h-touch-lg` in `globals.css` |
| ResponsiveOverlay component | ❌ Missing | `Dialog` and `Drawer` are separate code paths |
| Glass surface token | ❌ Missing | Using inline `bg-overlay-dark backdrop-blur-sm` |
| Modal routing E2E test | ❌ Missing | No back-button verification |

---
## Non-goals (for V1)

- No new product features or new IA (information architecture).
- No “AI-drama UI”: gradients, glows, glass layers via opacity hacks, excessive animation.
- No re-platforming or component mega-refactors unless required to remove UX friction.

---

## Core UX strategy: URL-as-state (not UI-as-state)

“Native app feel” on web is mostly:
- **Progressive disclosure** (show more without leaving the context)
- **Back button works** (state is in the URL)
- **Deep links** work (share a product and it opens correctly)

### Default pattern

| Interaction | Mobile | Desktop |
|-------------|--------|---------|
| PDP / item preview | `Sheet` (bottom) | `Dialog` (modal) |
| Filters | `Sheet` | `Dialog` or inline right panel |
| Seller profile quick view | `Sheet` | `Dialog` |
| Multi-step selling | `Sheet` wizard | `Dialog` wizard (or dedicated page only when necessary) |

**Rule:** Prefer **intercepting routes** for overlays so navigation is consistent and bookmarkable.

---

## Implementation pattern: Next.js modal routing

Treido uses App Router **parallel routes + intercepting routes** to open PDP / seller views in an overlay while preserving the underlying page (browse/search/category).

**Golden path (implemented for search):**

```
app/[locale]/(main)/search/@modal/(..)[username]/[productSlug]/page.tsx
  └─ Product quick-view modal from search results
```

> ⚠️ **Note:** Categories and seller routes do NOT have `@modal` slots yet — this is Phase 2 work.

To extend this pattern (categories, sellers, wishlist, etc.):
1. Add an `@modal` slot to the section route that should preserve context.
2. Add an intercepting route that renders the overlay.
3. Keep the overlay URL-driven (shareable + back-button correct).

**Rule:** The modal route renders *the same content component* as the full page route when possible (avoid duplicate UI logic).

### ResponsiveOverlay Decision

**Problem:** `Dialog` (desktop) and `Drawer` (mobile) are separate code paths. Each modal route needs to decide which to render.

**Decision:** Build a shared `ResponsiveOverlay` component in `components/shared/` that:
- Renders `Dialog` on `md:` and above
- Renders `Drawer` (bottom sheet) on mobile
- Accepts unified props: `open`, `onOpenChange`, `title`, `children`
- Handles URL sync via `useRouter`

**Effort:** ~0.5 day. **Benefit:** Single code path per modal route, consistent behavior.

**Implementation path:**
```
components/shared/responsive-overlay.tsx
  ├─ useMediaQuery('(min-width: 768px)')
  ├─ Desktop: <Dialog variant="fullWidth" />
  └─ Mobile: <Drawer direction="bottom" />
```

---

## Design rails (must follow)

SSOT: `docs/04-DESIGN.md`

- **No palette classes** (`bg-gray-100`, `text-blue-500`).
- **No arbitrary values** (`w-[560px]`, `text-[13px]`).
- **No background opacity modifiers** (`bg-background/95`, `bg-primary/10`).
- **Buttons are touch-safe** (`h-touch` / `h-touch-lg` + padding) and never feel tiny.
- **shadcn primitives stay pure** (`components/ui/*` has no app logic).

### Glass Surface Token

For translucent overlays (e.g., floating headers, bottom sheets), add to `app/globals.css`:

```css
--surface-glass: oklch(from var(--background) l c h / 0.85);
--surface-glass-blur: theme(blur.md); /* 12px */
```

**Usage:** `bg-surface-glass backdrop-blur-md` instead of inline `bg-overlay-dark backdrop-blur-sm`.

> **Status:** Token not yet added. Add in Phase 1 foundations work.

---

## Phase plan (ship in small batches)

### Phase 0 — Baseline & UX rubric (1 day)

Outcome:
- One shared rubric used by humans + agents to judge “premium + simple”.

Deliverables:
- Define 5–7 “golden screens” we polish first: Search, Category, PDP, Seller, Sell, Cart, Checkout.
- For each: record 3 screenshots (desktop, mobile, modal state) and list top 3 UX frictions.

### Phase 1 — Foundations (2–4 days)

Outcome:
- Buttons/inputs/icons/spacing feel consistent everywhere.

Work:
- Standardize touch targets and icon button pattern.
- Unify header patterns (desktop + mobile).
- Fix inconsistent “tap” feedback utilities (single class, used everywhere).

Verify:
- `pnpm -s styles:gate`
- `pnpm -s lint`
- `pnpm -s typecheck`

### Phase 2 — Modal/drawer navigation (5–8 days)

Outcome:
- Browsing feels like an app: deep views open in overlays with back button support.

**Current → Target:**
| Route | Current | Target |
|-------|---------|--------|
| Search → PDP | ✅ `@modal` works | Migrate to ResponsiveOverlay |
| Category → PDP | ❌ No `@modal` | Add `@modal` slot + intercepting route |
| Seller preview | ❌ None | Add `@modal` slot to search/category |

Work:
1. **Build `ResponsiveOverlay`** component (`components/shared/responsive-overlay.tsx`) — 0.5 day
2. **Add `@modal` slot to categories** (`app/[locale]/(main)/c/[...path]/@modal/`) — 1 day
3. **Add seller preview modal** from search/category results — 1–2 days
4. **Migrate search PDP modal** to use ResponsiveOverlay — 0.5 day
5. **Add E2E test** for modal back-button behavior — 0.5 day

Verify:
- `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`
- New E2E test: `e2e/modal-routing.spec.ts` — validates:
  - Search page → click product → modal opens
  - Press back → returns to search with scroll position preserved
  - Category page → click product → modal opens → back works

### Phase 3 — Sell UX (2–4 days)

Outcome:
- Selling flow is fast, clear, and mobile-native.

Work:
- Ensure sell wizard uses: header (back/close), progress, scroll body, sticky footer CTA.
- Improve validation + error placement (no hidden errors).

Verify:
- `pnpm -s typecheck` · `pnpm -s lint` · `pnpm -s styles:gate`

### Phase 4 — QA polish pass (ongoing)

Outcome:
- No regressions; feels “finished”.

Work:
- Add Playwright checks for modal routing and drawer flows.
- Add a small “UX checklist” to PR templates (or `.codex/prompts`), focused on states and a11y.
**Required E2E tests:**

| Test file | Scenarios |
|-----------|----------|
| `e2e/modal-routing.spec.ts` | Search→PDP modal, Category→PDP modal, back-button preserves scroll, deep link opens modal |
| `e2e/drawer-flows.spec.ts` | Cart drawer open/close, filter drawer on mobile, sell wizard steps |
| `e2e/touch-targets.spec.ts` | All buttons/links ≥ 44px on mobile viewport |

Verify:
- `pnpm -s test:e2e` passes all new tests
- Lighthouse accessibility ≥ 95 on golden screens
---

## Prototype reference (temp-tradesphere)

The `temp-tradesphere-audit/` prototype is useful for **patterns**, not for code.

### Patterns to port

| Pattern | Source file | What to extract |
|---------|-------------|----------------|
| Multi-step wizard | `temp-tradesphere-audit/src/components/sell/SellDrawer.tsx` | Header (back/close), progress bar, scroll body, sticky footer CTA |
| iOS-native feel | `temp-tradesphere-audit/STYLEGUIDE.md` | Tap highlight removal, safe area handling, scrollbar hide |
| Card scanability | `temp-tradesphere-audit/src/components/ProductCard.tsx` | Image→title→price hierarchy, badge placement |

### Anti-patterns to avoid

```
❌ bg-primary/10          → use semantic token
❌ rounded-3xl            → use rounded-lg or rounded-xl max
❌ bg-gradient-to-r       → no gradients (design rail)
❌ text-[13px]            → use text-sm or text-xs
❌ safe-bottom (custom)   → use pb-safe-max (already in Treido)
```

**Rule:** Port the patterns, not the classes.

---

## “Premium + simple” checklist (per screen)

- [ ] One clear primary action (not competing CTAs).
- [ ] No tiny tap targets; icon buttons are `44px`-ish.
- [ ] Secondary text is `text-muted-foreground` (not smaller + lighter + low-contrast).
- [ ] All states exist: hover/active/focus/disabled/loading/empty/error.
- [ ] Overlay flows are URL-driven (deep link + back works).

---

## Ownership (Skills)

| Phase | Primary Skill | Support |
|-------|---------------|---------|
| Phase 0 | `treido-rails` | — |
| Phase 1 | `treido-frontend` | `treido-rails` |
| Phase 2 | `treido-frontend` | `treido-rails` |
| Phase 3 | `treido-frontend` | `treido-rails` |
| Phase 4 | `treido-rails` | `treido-frontend` |

All phases require gates before merge:
- `pnpm -s typecheck`
- `pnpm -s lint`
- `pnpm -s styles:gate`

---

*Last updated: 2026-02-03*
