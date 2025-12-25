# FULL_REFACTOR_PLAN.md — Next.js 16 “Perfection” Refactor (Expanded)

This document is the **expanded, execution-ready** refactor plan.

- Canonical phase order + gates still live in **STRUCTURE.md**.
- This file adds **detailed rules**, **decision records**, and **playbooks** for Next.js 16 App Router, Server/Client boundaries, and systematic de-duplication.

If anything here conflicts with **STRUCTURE.md**, **STRUCTURE.md wins**.

---

## Goals

- Align the entire codebase to **Next.js 16 App Router best practices**.
- Make Server Components the default; use Client Components only when required.
- Establish a **predictable structure** so ownership is obvious.
- Enable safe, mechanical removal of **duplicates and dead code**.
- Keep TypeScript strict and maintain a consistently passing build.

### Non-goals (for the refactor phase)

- No product/UX redesign.
- No new features.

Note: We allow **deep internal refactors** (data flow, boundaries, consolidation, naming) as long as the **rendered output and behavior** remain equivalent.

---

## Sources of truth

- STRUCTURE.md — canonical plan and enforcement-first philosophy.
- production/02-CLEANUP.md — deletion workflow.
- cleanup/FULL_CODEBASE_AUDIT.md + cleanup/FILE_INVENTORY.md — leads and evidence.

---

## Required gates (run after every batch)

Minimum:
- Typecheck: `pnpm -s exec tsc -p tsconfig.json --noEmit --pretty false`

Recommended when refactor touches routing/components/providers:
- Build: `pnpm -s build`
- Lint: `pnpm -s lint`
- E2E: `pnpm test:e2e`

Rule: **No batch is “done” until gates pass.**

---

## Definitions (used throughout this plan)

### “Route-owned”
Code that is only used by a single route segment or route group (e.g. `app/[locale]/(sell)`), including UI, route-only helpers, and route-only types.

### “Shared”
Code used by 2+ route groups or clearly part of the global domain model.

### “Public API surface”
The stable import path we want others to use (e.g. `@/lib/sell/schema-v4`). Public APIs should be few and intentional.

---

## Target structure (end state)

This refactor is largely about making ownership enforceable.

### App Router (route-owned)
- `app/**/_components/` — **React composites** and route UI composition only.
- `app/**/_lib/` — **route-only** utilities, types, data mapping, constants.
- `app/**/_actions/` — route-only server actions.

### Shared application code
- `components/ui/` — shadcn primitives only.
- `components/common/` — shared composites.
- `components/layout/` — shared shells.
- `components/providers/` — global providers/contexts.
- `hooks/` — shared hooks.
- `lib/` — pure TS domain logic, utilities, API clients; avoid React contexts/providers here.
- `types/` — shared types (only if truly cross-domain; otherwise keep near the domain).

---

## File extension rules

### `.ts` vs `.tsx`
- Use `.tsx` when the file contains JSX.
- Use `.ts` otherwise.

### Barrels
Two acceptable patterns; pick **one** and enforce consistently:

Option A (recommended):
- Barrels inside `_components/` are allowed, but must be `.tsx` (UI boundary is explicit).

Option B (stricter):
- No barrel files in `_components/`; expose route UI via explicit imports only.

If we keep barrels, they must be:
- UI-only in `_components/` (no types/utils/data)
- Or helper-only in `_lib/` (no UI)

---

## Server/Client correctness (Next.js 16 App Router)

### Default posture
- `page.tsx` and `layout.tsx` are **Server Components by default**.
- Add `"use client"` only where required.

### Common reasons to require `"use client"`
- React hooks like `useState`, `useEffect`, `useRef`, `useLayoutEffect`.
- Browser APIs (window, document, localStorage, media queries).
- Event handlers (`onClick`, `onChange`) in the same module.
- Most third-party UI libraries that assume the browser.

### Refactor playbook: “Client islands”
When a server component needs interactive UI:
1) Keep the route `page.tsx`/`layout.tsx` server.
2) Move the minimal interactive portion into a colocated Client Component in `_components/`.
3) Pass serializable props down.

### Avoid “accidental client”
- Don’t mark large parent trees as client to support one small interactive widget.
- Don’t import client components from server-only utilities.

---

## Import boundary rules (enforceable)

### Forbidden by default
- Route group importing UI from a different route group.
- `components/ui` importing from app routes or feature composites.
- `lib/` importing from `app/`.

### Allowed
- Routes importing from shared `components/**`, `hooks/**`, `lib/**`.
- Route-owned code importing within its own segment.

Implementation note:
- Use ESLint `no-restricted-imports` (or similar) to make boundaries enforceable.

---

## Compatibility strategy (moves without chaos)

STRUCTURE.md prefers “no compatibility shims.” In practice, we’ll use this rule:

- For **route-local** moves (inside one route group), do **same-batch import rewrites + delete old paths**.
- For **shared/global** moves (widely imported modules), allow **temporary compatibility re-exports** only if:
  - the shim is documented,
  - there’s a clear follow-up batch to remove it,
  - and we keep the window short.

---

## Deduplication strategy (how we delete safely)

### Step 1 — Prove equivalence
Before deleting duplicates, prove:
- Same runtime behavior (or intentionally migrate behavior with explicit approval).
- Same types and edge cases.

### Step 2 — Choose canonical owners
Prefer canonical modules that are:
- smaller, clearer, tested,
- closer to the domain in `lib/<domain>/...` (if shared),
- or route-local under `app/**/_lib` if not shared.

### Step 3 — Converge imports
Update call sites to canonical paths.

### Step 4 — Delete
Delete the old module in the **same batch** (unless temporary shim policy is in effect).

---

## Phased execution (expanded)

These phases align with STRUCTURE.md, but provide more detail.

### Phase 0 — Baseline + maps
Deliverables:
- Route map for `app/[locale]`.
- Ownership map for `components/` and `lib/`.
- High-level import graph hotspots.

Outputs:
- “What belongs where” table.
- Top 10 duplication clusters (types/schemas/utils).

### Phase 1 — Guardrails
Deliverables:
- ESLint restricted-imports rules for:
  - route-to-route imports,
  - `components/ui` purity,
  - preventing `lib/` from importing `app/`.

### Phase 2 — `components/ui` purity
Deliverables:
- `components/ui` contains primitives only.
- Move feature composites out to `components/common` or route `_components`.

### Phase 3 — Route colocation + boundaries
Deliverables:
- For each route group: UI and route helpers colocated.
- No route group depends on another route group’s `_components`.

### Phase 4 — Providers + hooks normalization
Deliverables:
- All providers/contexts under `components/providers`.
- Shared hooks in `hooks/`.

### Phase 5 — Domain deep-clean (Sell as reference)
Deliverables:
- Clear split:
  - shared sell domain in `lib/sell/*`
  - sell route internals in `app/[locale]/(sell)/*`
- Consolidate schemas/types.

Known already completed in this repo:
- Sell route types moved into `app/[locale]/(sell)/_lib/types.ts`.

### Phase 6 — Deletion wave
Deliverables:
- Remove dead files and prune deps following production/02-CLEANUP.md.

### Phase 7 — Final normalization + enforcement
Deliverables:
- Tight public APIs (fewer barrels, fewer “everything exports”).
- Expanded guardrails.

---

## Metrics (how we know we’re improving)

- Count of `"use client"` modules over time (should decrease or become localized).
- Count of cross-route imports (should approach zero).
- Count of duplicate “domain types” (should collapse).
- Size of `components/` root (should shrink as route-owned UI moves into app segments).

---

## Practical “next batch” suggestions

Pick one and run it end-to-end (including gates):

1) **Client boundary audit**
- Identify the largest Server Components that are incorrectly client.
- Split into server wrapper + client island.

2) **Barrel normalization**
- Choose barrel policy (A vs B).
- Apply consistently in one route group.

3) **Duplication map for types**
- Catalog domain type definitions (Category/Product/Seller/etc.) across `lib/**` and `app/**/_lib`.
- Decide canonical location per type.

---

## Operating rules for contributors

- Do not add new `"use client"` at the top of a route without justification.
- Put route-only helpers in `app/**/_lib`.
- Put shared domain logic in `lib/<domain>`.
- Prefer adding a small client island over converting parent layouts/pages to client.

---

## Notes

- Next.js is unopinionated about organization, but private folders (underscore-prefixed) are a common pattern to separate UI logic from routing logic.
- This repo intentionally uses `_components` and `_lib` inside route segments as enforceable ownership boundaries.
