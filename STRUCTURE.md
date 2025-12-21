#+#+#+#+############################################
# STRUCTURE.md — Canonical Refactor Plan (Enforcement-First)
#+#+#+#+############################################

This is the single plan we will follow to make the repo structure predictable, reduce duplication, and prevent regression.

Agent Skills note:
- Repo-local Agent Skills live under `.github/skills/`. See `AGENT_SKILLS.md` for how to add/maintain skills and templates.

Important:
- This repo is large and moving things will break imports unless we do it with **guardrails + strict refactors** (update imports and delete old paths).
- Audit tools (knip/jscpd/madge) are inputs, not truth. “Unused” code can still be the best implementation — we may keep it and delete the uglier “used” version.

About commands vs tools:
- The markdown docs include command snippets so humans can reproduce work.
- When I (the agent) execute steps, I will use VS Code tools (search + edits + tasks) and only run terminal commands when needed.

## Non-Negotiables (Definition of “Perfect” Here)

- Clear ownership boundaries: every component belongs to exactly one of: **shadcn primitive**, **shared composite**, **route-owned UI**, **provider**, **pure lib**.
- `components/ui/` contains only shadcn-style primitives (and only exports that are actually intended to be public).
- Route-owned UI is colocated under the owning route group in `app/[locale]/.../_components`.
- Domain logic lives in `lib/<domain>/...` as pure TS (no React contexts/providers there).
- Providers/contexts live in `components/providers/`.
- No circular dependencies.
- The import graph is enforceable by lint rules (not tribal knowledge).

## How We Avoid Breaking the App

- One batch at a time: small, reviewable diffs.
- No compatibility shims/re-exports: update imports to the canonical location in the same batch.
- No mass “find/replace” across the repo without a gate in between.
- Deletion is part of the same batch once imports are updated (old paths must not remain).

## Gates (Run After Every Batch)

Minimum gates:

- Typecheck: `pnpm -s exec tsc -p tsconfig.json --noEmit --pretty false`
- Build: `pnpm -s build`

When touching routing, providers, or large shared components:

- Lint: `pnpm -s lint`
- E2E: `pnpm test:e2e`

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
- Planning/audit docs live where they currently are (no `docs/` tree required).

---

## Phase 0 — Baseline + Maps (Required)

**Goal**: stop guessing. Produce a map of what exists and who owns what.

**Deliverables**
- Route map for `app/[locale]`: list every route group and what it owns.
- Component ownership map: classify every file under `components/` into one bucket:
  - `components/ui` (primitive)
  - `components/common` (shared composite)
  - `components/layout`
  - `components/providers`
  - “should move to route-owned `_components`”

**Do**
- Ensure git working tree is clean (commit or stash).
- Run the gates once to capture a known-good baseline.
- Confirm `components.json` aliases match actual usage.

**Exit Criteria**
- Baseline gates pass.
- The repo has a written ownership map (so later phases are mechanical).

---

## Phase 1 — Guardrails Before Moves (Required)

**Goal**: make it hard to re-introduce the mess while we refactor.

**Do**
- Add ESLint rules / restricted imports to enforce:
  - nothing imports hooks from `components/ui`
  - route code does not import other route-owned components across groups
  - `components/ui` does not export feature composites
- Add a short “Where does this file go?” contributor note.

**Exit Criteria**
- Guardrails are in place and gates pass.

---

## Phase 2 — Fix `components/ui` Boundary (Primitives Only)

**Goal**: restore trust in the primitives layer so duplication stops.

**Do**
- Move non-primitives out of `components/ui` into `components/common` or `components/layout`.
- Update all imports to the new canonical location (no forwarding/re-export shims).
- Delete the old `components/ui/*` composite modules once nothing imports them.
- Tighten exports: primitives should not expose dozens of unused exports “just because shadcn generated them”.

**Exit Criteria**
- `components/ui` is primitives-only.
- Gates pass.

---

## Phase 3 — Route Structure + Colocation (App Router Hygiene)

**Goal**: make `/app` navigable and remove “UI dumping” into root components.

**Do**
- For each route group (account/admin/auth/business/chat/checkout/main/plans/sell):
  - move UI that only that group uses into `app/[locale]/(<group>)/.../_components`
  - move server actions into `app/[locale]/(<group>)/.../_actions` (or keep in `app/actions` only if truly cross-cutting)
- Remove deep, ambiguous “shared” imports from route code.

**Exit Criteria**
- Each route group owns its UI.
- `components/` root is measurably smaller.
- Gates pass.

---

## Phase 4 — Providers + Hooks Canonicalization

**Goal**: predictable runtime wiring.

**Do**
- Move React providers/contexts to `components/providers/`.
- Ensure hooks have a single home (`hooks/`).
- Keep `lib/` for pure helpers/clients only.

**Exit Criteria**
- No React context/provider implementations live in `lib/`.
- Gates pass.

---

## Phase 5 — Domain Refactor: Sell (First Real “Deep Clean”)

**Goal**: the sell flow is the biggest duplication hotspot; fix it end-to-end as a reference architecture.

**Do**
- Define the sell domain surface area:
  - `lib/sell/` for schemas, types, data mapping, validators
  - `app/[locale]/(sell)/...` for route UI and route actions
- Collapse duplicate sell schemas and pick the canonical implementation (do not delete the “clean” version just because it’s unused today).
- Reduce “500-line field components” by splitting data-fetching + mapping from UI components.

**Exit Criteria**
- Sell has one schema set, one type set, one UI pattern.
- Gates + E2E pass.

---

## Phase 6 — Cleanup (Delete + Dependency Prune, Now Safe)

**Goal**: remove the leftovers once the canonical architecture exists.

**Do**
- Delete only after verifying zero references.
- Remove dependencies only after code deletion makes them unreferenced.
- Use [production/02-CLEANUP.md](production/02-CLEANUP.md) as the execution checklist.

**Exit Criteria**
- `components/` root shrinks to shared-only.
- Gates pass.

---

## Phase 7 — Normalization + Final Guardrails

**Goal**: lock in the structure so it stays clean.

**Do**
- Normalize `lib/` by domain folders.
- Remove duplicate helpers/configs.
- Tighten public exports.
- Expand restricted-imports rules to prevent cross-domain coupling.

**Exit Criteria**
- No duplicate shared helpers/types remain.
- Gates pass.

---

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
- Route-owned UI is colocated; cross-route imports are blocked.
- Providers live in `components/providers/`.
- Typecheck/lint/build gates pass; E2E passes for major batches.
