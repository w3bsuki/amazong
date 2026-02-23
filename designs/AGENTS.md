# AGENTS.md — Pencil (Treido)

This folder contains Treido’s **Pencil `.pen` design source of truth**. Use it to design, iterate, and validate the *gold standard* mobile UI/UX that the product will be rebuilt to match.

Scope: this guide applies to everything under `designs/`.

---

## What lives here

- `designs/treido.pen` — **the** canonical Treido Pencil file (components, templates, screens, explorations).
- `designs/archive/*.pen` — legacy snapshots kept for reference only (do not edit).
- `designs/route-inventory.json` — route inventory generated from `app/[locale]`.
- `designs/PENCIL-GUIDE.md` — repo-specific Pencil workflow + conventions.
- `designs/UI-UX-MODEL.md` — Treido navigation + IA model.

When doing a **design exploration** (not a 1:1 mapping exercise), iterate inside `designs/treido.pen` in a dedicated “Explorations” section, then promote the winners into `Components / Primitives` and `Templates` before updating route-mapped screens.

---

## Core rules (don’t break these)

1. **Mobile-first:** design for M375 (375×812) first. Desktop comes later.
2. **Semantic tokens only:** use `$--*` variables for colors/sizing. No hardcoded hex unless you are *introducing* a new token.
3. **Touch targets:** interactive rows/buttons/icons must be ≥ **44px** (height and/or hit-area).
4. **No “web page” feel:** favor native-like transitions, drawers, and sticky actions (as patterns in the design).
5. **Components first:** perfect the marketplace primitives (product card, bottom nav, header/search, chips, filter bar) before you design lots of screens.

High-risk pause points from root `AGENTS.md` still apply (payments/auth/DB), but design-only work is safe to execute.

---

## How to work (Pencil MCP workflow)

Use these tools in tight loops:

1. `get_editor_state` — confirm the active file + top-level frames.
2. `batch_get` — inspect a screen/component structure (use low `readDepth` first).
3. `batch_design` — make changes using small, reversible batches (≤25 ops).
4. `get_screenshot` — verify spacing, clipping, and hierarchy after each batch.
5. `snapshot_layout` — sanity-check for clipped/overlapping nodes after larger edits.

Guideline: **design → screenshot → adjust**. Don’t “build the whole page” before looking.

---

## File + naming conventions

- **Device:** `M375` = 375×812.
- **Screen name:** `M375 / <route> / <short title>`
- **Variants:** add two spaces then suffix (e.g. `…  Empty`, `…  Loading`, `…  Errors`)

For exploration files that aren’t route-mapped, still use the same pattern so screens remain comparable.

---

## Layout system (Treido “premium marketplace” defaults)

These are defaults for new work; deviate only with intent.

- **Surfaces:** `surface-page` (subtle/off-white) behind `surface-card` (white) cards.
- **Radius:** cards ~12–16px; pills ~999px; bottom sheets 20–28px top corners.
- **Spacing:** prefer 8/12/16/24/32 rhythms; keep vertical rhythm consistent.
- **Typography:** Inter; use weight `600` for emphasis, avoid `700+` unless it’s a headline.
- **Shadows/borders:** prefer subtle depth (shadow or “surface contrast”); avoid harsh 1px borders.

Touch-target cheatsheet:
- Icon button: 44×44
- Row item: min height 52–56
- Chip: min height 32–36
- Bottom tab: 64+ including safe area

---

## Component strategy (how to make designs reusable)

Create a “Components / Primitives” area in `designs/treido.pen` and define reusable frames:

- `Header / Browse` (logo + search trigger + quick actions)
- `Bottom Tab Bar / 5 tabs` (Sell is elevated)
- `Product Card / Grid` (image + wishlist + badges + meta)
- `Chips / Discovery` (For You, Trending, New, Deals, Near Me)
- `Filter Bar` (Sort + Filter + active filter count)

Prefer instances (`type: "ref"`) of reusable components in screens. Use `descendants` overrides for text/icon changes per instance.

---

## Translating the gold standard into the real app

Yes: you can (and should) **reuse Pencil screens** as the spec for rebuilding the Next.js UI.

Recommended handoff process:

1. Lock the primitives (card, header/search, bottom nav, drawer filters) in Pencil.
2. Map Pencil tokens → `app/globals.css` variables and Tailwind semantic utilities.
3. Implement primitives as composable components (`components/shared/…`, `components/layout/…`).
4. Rebuild routes to match screens; verify tap targets and list density on-device.

Pencil is the spec. The app implementation is the product.

---

## Definition of done (per screen)

- Clear hierarchy at a glance: price → title → trust cues.
- No clipped content (verify via screenshot + layout snapshot).
- All interactive elements meet touch target minimums.
- Bottom nav / sticky actions never obscure content.
- Filter + sort state is visible and reversible.
