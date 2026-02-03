# App-feel Patterns (Next.js + shadcn + Tailwind v4)

This reference captures **native-app feeling** UX patterns for Treido, in a way that **respects Treido rails**:
- Token-safe Tailwind v4 (no palette colors, no arbitrary values, no opacity modifiers in classnames).
- shadcn primitives for a11y and consistency.
- URL-driven navigation (shareable links + back button works).

SSOT:
- `docs/04-DESIGN.md` (rails + app-feel section)
- `docs/14-UI-UX-PLAN.md` (roadmap)

---

## 1) The “app feel” rule: keep context

If the user is browsing a list/grid (search, categories, sellers):
- Opening a deep view should **not** feel like “leaving”.
- Prefer an overlay (modal/drawer) where the background page is still “there”.

**Default mapping**

| Deep view | Mobile | Desktop |
|----------:|--------|---------|
| Product quick view / PDP | `Sheet` (bottom) | `Dialog` (modal) |
| Filters | `Sheet` | `Dialog` or right panel |
| Seller preview | `Sheet` | `Dialog` |
| Multi-step flows (sell, upgrade, edit) | `Sheet` wizard | `Dialog` wizard |

---

## 2) URL-as-state (Next.js modal routes)

Prefer **parallel routes + intercepting routes** over `useState`-only modals.

**Golden path in repo**
- Product quick view from search results:
  - `app/[locale]/(main)/search/@modal/(..)[username]/[productSlug]/page.tsx`
  - `app/[locale]/(main)/search/_components/product-route-modal.tsx`

**Rules**
1. Closing the overlay navigates with `router.back()` (not “setOpen(false)” and stay).
2. The overlay should reuse the same “content component” as the full page when possible.
3. The overlay should be responsive: desktop modal, mobile sheet.

---

## 3) Responsive overlay wrapper (Dialog on desktop, Sheet on mobile)

Preferred approach:
- Implement **one wrapper component** in `components/shared/*` (or route-private `_components/*`) that:
  - renders a `Dialog` for `md+`
  - renders a `Sheet` for `<md`

**Why**
- Users get native patterns on mobile without losing desktop ergonomics.
- You avoid duplicating overlay logic across pages.

---

## 4) “Sell wizard” structure (mobile-native)

The temp-tradesphere prototype got the *structure* right:
- header with back/close
- progress indicator
- scrollable body
- sticky footer with one primary CTA

Treido implementation rules:
- Use `Button` variants/sizes (touch safe).
- Keep footer CTA height consistent (`h-touch-lg`).
- Do not use `h-[95vh]` / `bg-*/90` classnames — if you need these, define a token/utility in CSS.

---

## 5) Token-safe “glass” and subtle overlays (without opacity hacks)

Forbidden at callsites:
- `bg-background/95`, `bg-primary/10`, `ring-primary/20`, etc.

If “glass” is truly required:
1. Add a **semantic token** in `app/globals.css` (e.g. `--surface-glass`).
2. Expose it via `@theme inline` (e.g. `--color-surface-glass`).
3. Use it normally: `bg-surface-glass` (no `/xx` modifiers).

---

## 6) Icon + touch patterns

Rules:
- Icon buttons are **always** touch-safe (`size-10` or `h-touch`-aligned).
- Use one icon set (prefer `lucide-react`).
- Prefer `Button variant="ghost" size="icon"` over custom `<button>` styling.

---

## 7) Porting the prototype: patterns only

Use `temp-tradesphere-audit/` as inspiration for:
- layout rhythm (spacing, sticky header, bottom nav mental model)
- drawer-first mobile flows (sell, AI search)
- scan-friendly cards

Do **not** port:
- Tailwind v3 class patterns (opacity modifiers, arbitrary values, palette colors)
- heavy shadow/glow decoration

---

## 8) iOS-feel styling aids (no gimmicks)

“iOS feel” for Treido means **comfort + clarity**, not glass, gradients, or haptics:

- Bigger tap targets: prefer `h-touch` / `h-touch-lg` and `min-h-touch-*`.
- Press feedback: `active:bg-active` / `active:opacity-90` + `tap-highlight-transparent` (no new animations).
- Sticky top/bottom bars: `bg-surface-elevated` + `border-border` + safe area padding (`pt-safe*`, `pb-safe*`).
- Lists: entire row is clickable; text and chevrons never become tiny targets.
- Depth: use spacing and borders; avoid glows and heavy shadows.
