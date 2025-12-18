#+#+#+#+############################################
# STRUCTURE.md — Phased Refactor Plan (Tool-Agnostic)
#+#+#+#+############################################

This is the execution plan to reach a clean, predictable folder structure without breaking production. It is designed to be run in phases with verification gates after each phase.

## Outcome Goals (Non-Negotiables)

- `components/ui` contains only shadcn-style primitive components.
- Hooks exist in one canonical place: `hooks/`.
- Route-specific UI is colocated under the owning route in `app/[locale]/...`.
- Shared UI is organized (no flat `components/` explosion).
- No “duplicate core components” (e.g., product card) remain.

## Execution Rules

- **Structure-only changes per phase**: avoid mixing refactors with feature work.
- **Prefer compatibility shims over breaking moves**: move the file, then keep a small re-export in the old path until imports are migrated.
- **One phase = one main theme**: if a phase grows, split it.

## Verification Gates (Run after every phase)

Run your usual project gates after each phase. Example (pnpm):

- Typecheck: `pnpm -s exec tsc -p tsconfig.json --noEmit`
- Lint: `pnpm -s lint`
- Build: `pnpm -s build`

If you use different package managers/commands, adapt accordingly.

---

## Target Structure (End State)

- `app/[locale]/...` owns **route-specific** UI and server actions via `_components/` and `_actions/` folders.
- `components/` is **shared only**, organized by purpose:
  - `components/ui/` shadcn primitives only
  - `components/common/` shared composites (cards, data displays, etc.)
  - `components/layout/` shared layout shells (header/footer/sidebar)
  - `components/providers/` global providers (contexts)
- `hooks/` contains all reusable hooks.
- `lib/` contains utilities/clients/domain helpers (avoid React component/context `.tsx` here).
- `types/` contains shared TS types.
- Markdown docs live in `docs/` (optional move; not required for correctness).

---

## Phase 0 — Baseline + Inventory (0.5 day)

**Goal**: know what exists, and avoid accidental breakage.

**Do**
- List all current files under `components/ui` and categorize: primitive vs composite vs hook vs layout.
- Identify obvious duplicates (e.g., multiple `use-toast`, multiple product cards, multiple contexts).
- Confirm `components.json` paths/aliases match the repo (especially `aliases.ui` and `aliases.hooks`).

**Exit Criteria**
- Inventory notes captured (where duplicates are, what moves are planned first).
- Gates pass (no code changes required).

---

## Phase 1 — Fix `components/ui` + Hook Canonicalization (1–2 days)

**Goal**: make `components/ui` match shadcn convention and eliminate hook duplication.

**Do**
- Move all **non-primitives** out of `components/ui`:
  - composites → `components/common/`
  - layout shells → `components/layout/`
- Move hooks out of `components/ui` into `hooks/`.
- Add compatibility re-exports at old paths when needed to prevent broad breakage.
- Update imports incrementally.

**Exit Criteria**
- `components/ui` contains only primitives.
- Hooks are single-source-of-truth under `hooks/`.
- Gates pass.

---

## Phase 2 — Providers/Contexts Cleanup (0.5–1.5 days)

**Goal**: stop React contexts living in `lib/` and prevent “context sprawl”.

**Do**
- Move React providers/contexts to `components/providers/`.
- Ensure there is one canonical provider per domain (cart, wishlist, messaging, etc.).
- Keep `lib/` for utilities and clients (Supabase, formatting, pure helpers).

**Exit Criteria**
- No React context/provider implementations live in `lib/`.
- Gates pass.

---

## Phase 3 — Deduplicate “Product Card” Lineage (1–2 days)

**Goal**: one canonical product card implementation; all imports converge.

**Do (safe order)**
1. Choose a canonical implementation location (recommended): `components/common/product-card/`.
2. Keep temporary re-export shims at old import paths.
3. Update barrel exports to point to canonical.
4. Delete old variants only when there are zero references.

**Exit Criteria**
- Exactly one product-card source-of-truth remains.
- Gates pass.

---

## Phase 4 — Co-locate Feature UI Under Routes (2–4 days)

**Goal**: eliminate the flat `components/` “dumping ground” by moving route-specific UI to where it belongs.

**Do (mapping guide)**
- Account-only UI → `app/[locale]/(account)/**/_components/`
- Admin-only UI → `app/[locale]/(admin)/**/_components/`
- Business dashboard UI → `app/[locale]/(business)/**/_components/`
- Sell flow UI → `app/[locale]/(sell)/**/_components/`
- Checkout/chat route UI → their respective route group `_components/`

**Rule**: only move components that are clearly owned by exactly one route group.

**Exit Criteria**
- `components/` root shrinks to shared-only.
- Gates pass.

---

## Phase 5 — `lib/`, `types/`, `config/` Normalization (1–2 days, as needed)

**Goal**: reduce “misc dumping” and make shared imports predictable.

**Do**
- Group utilities by domain under `lib/` (auth, supabase, formatting, urls, etc.).
- Remove duplicate helpers/configs that exist in multiple places.
- Keep shared type definitions in `types/`.

**Exit Criteria**
- No duplicate shared helpers/types remain.
- Gates pass.

---

## Phase 6 — Guardrails (0.5–1 day)

**Goal**: prevent regressions after the refactor.

**Do**
- Add lint guardrails (e.g., restricted imports) to prevent:
  - hooks imported from `components/ui`
  - non-primitives being added to `components/ui`
- Add a short contributor doc (“Where does this file go?”).

**Exit Criteria**
- Structure regressions become hard to introduce.

---

## Tailwind v4 + shadcn Notes (Verified)

- Tailwind v4 is CSS-first and uses `@import "tailwindcss";` in your global stylesheet, and the PostCSS plugin is `@tailwindcss/postcss`.
- In shadcn v4 docs, `components.json.tailwind.config` should be blank (`""`) for Tailwind v4 projects.
- shadcn’s Tailwind v4 migration guidance includes replacing `@plugin 'tailwindcss-animate';` with `@import "tw-animate-css";` in global CSS.

---

## Final Acceptance Criteria

- `components/ui` contains only primitives.
- Hooks exist only in `hooks/`.
- No duplicate core components (product-card, headers, etc.).
- Route-specific UI is colocated under the owning route.
- Typecheck/lint/build gates pass.
