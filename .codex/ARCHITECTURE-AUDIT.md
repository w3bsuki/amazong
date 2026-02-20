# Treido — Architecture Audit & Cleanup Roadmap

*Date:* 2026-02-20  
*Context:* Safe-only hardening + overengineering reduction before production launch. This doc is written for future AI sessions to quickly regain project context and execute cleanup work without re-discovering everything.

## Non‑Negotiables (Do Not Touch Without Explicit Approval)

- DB schema / migrations / RLS (`supabase/`)
- Auth/session/access control internals (`lib/auth/**`, `components/providers/auth-state-manager.tsx`)
- Payments/webhooks/billing (Stripe routes + webhook signature verification)
- Any destructive data operations

## Current Targets (from `refactor/CURRENT.md`)

- Files: `<650` (now ~936)
- LOC (source): `<85K` (now ~130K)
- `"use client"`: `<120` (now ~216)
- Tiny files `<50L`: `<100` (now ~247)
- Oversized files `>300L`: `<20` (now ~88)
- Clone %: `<1.5%` (now ~2.56%)

## High‑Signal Audit Findings (2026‑02‑20)

### 1) Repo clutter (tracked artifacts)

- Tracked local artifacts exist in root and `.tmp/`:
  - `.tmp/jscpd-report/jscpd-report.json`
  - `.tmp/dupes-entry.txt`, `.tmp/use-client-files.txt`, `architecture-*.json`, `lean-sweep-*.json`
  - `build-baseline.txt`, `build-final.txt`, `tmp_test.txt`
- `.gitignore` does **not** ignore `.tmp/` as a whole (only some patterns), so it’s easy to reintroduce tracked cruft.

### 2) Architecture violation (route-private import leak)

- `(main)/categories` imports a constant from `(main)/search/_lib`, violating the `_lib` privacy rule.
  - `app/[locale]/(main)/categories/[slug]/_lib/search-products.ts`
  - `app/[locale]/(main)/categories/[slug]/_components/category-page-dynamic-content.tsx`
  - Fix: move shared pagination constant to a neutral location (e.g. `app/[locale]/(main)/_lib/pagination.ts` or top-level `lib/`) and rewire both callers.
  - Note: defer if these files are being edited in another terminal to avoid merge conflicts.

### 3) UI primitives polluted with domain semantics

- `components/ui/badge.tsx` contains marketplace-specific badge variants (condition/shipping/verified/promo/etc.).
  - Fix: keep `components/ui/*` primitive-only; move semantic variants to `components/shared/**` domain wrappers.

### 4) Duplicated realtime subscription logic

- Supabase realtime subscribe/unsubscribe lifecycle is duplicated in:
  - `hooks/use-notification-count.ts`
  - `components/dropdowns/messages-dropdown.tsx`
  - Fix: extract a shared hook/helper so both use a single lifecycle implementation.

### 5) Duplicated product Quick View click logic

- Quick View click handler duplicated in:
  - `components/shared/product/card/desktop.tsx`
  - `components/shared/product/card/mobile.tsx`
  - Fix: extract shared handler/hook (keep behavior identical: modifier keys, href navigation, drawer payload).

### 6) Script duplication (gates / scanners)

- Tailwind token scanners reimplement the same file-walking + comment stripping + report boilerplate across 4 scripts.
- `scripts/architecture-scan.mjs` duplicates similar file-walking logic.
  - Fix: introduce `scripts/lib/*` utilities (`file-walker.mjs`, `tailwind-scan-utils.mjs`) and keep each scanner focused on its regex rules.
  - Risk: medium (build gates). Must verify `pnpm -s styles:gate` and `pnpm -s architecture:scan`.

## Execution Plan (Safe‑Only Batches)

### Batch A — Untrack local artifacts + harden `.gitignore`

- Remove tracked `.tmp/**` artifacts and `tmp_test.txt`.
- Decide on build logs:
  - Option 1 (recommended): move build logs under `.tmp/` and keep untracked.
  - Option 2: keep tracked, but move under `refactor/artifacts/` (keeps root clean).
- Update `.gitignore` to ignore `.tmp/` broadly + build-log outputs.

### Batch B — De-duplicate gate scripts

- Add: `scripts/lib/file-walker.mjs`, `scripts/lib/tailwind-scan-utils.mjs`
- Refactor:
  - `scripts/scan-tailwind-{semantic-tokens,palette,token-alpha,arbitrary}.mjs`
  - Optionally `scripts/architecture-scan.mjs` to reuse shared walker

### Batch C — Restore `components/ui` purity (badge variants)

- Keep primitive `Badge` and minimal variants in `components/ui/badge.tsx`.
- Add shared semantic wrappers under `components/shared/**` (e.g. product/badges).
- Rewire imports in callers (grep to enumerate all `badgeVariant` usage first).

### Batch D — Realtime subscribe helper

- Add a small shared hook under `hooks/` (or `lib/` if truly framework-agnostic, but likely `hooks/`).
- Migrate `use-notification-count` and `messages-dropdown` to use it.

### Batch E — Quick View handler extraction

- Extract shared click handler/hook and migrate desktop+mobile product cards to use it.

### Batch F — Split `hooks/use-geo-welcome.ts`

- Separate storage/cookie helpers and Supabase write helper from orchestration hook.

### Batch G — Fix route-private import leak (defer if conflict)

- Create shared pagination constant in neutral location.
- Replace cross-route `_lib` import.

## Verification (Run Once per Batch Cluster)

Run after completing a logical batch (not after every file):

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

