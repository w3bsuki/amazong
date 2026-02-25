# 00 — Overview: Current State

> Baseline snapshot of the Treido codebase as of 2026-02-24.

---

## Project Identity

| Key | Value |
|-----|-------|
| Name | Treido (amazong-marketplace) |
| Stage | V1 pre-launch (Bulgaria) |
| Phase | Phase 0 — Production Push |
| Framework | Next.js 16.1.6, React 19.2.4 |
| Language | TypeScript 5.9.3 (strict) |
| CSS | Tailwind CSS 4.1.18 + shadcn/ui (new-york) |
| Database | Supabase (Auth + Postgres + RLS) |
| Payments | Stripe 20.2.0 (Connect Express) |
| i18n | next-intl 4.7.0 (en/bg) |
| Testing | Vitest 4.0.17 + Playwright 1.57.0 |

---

## Codebase Metrics

| Metric | Value | Status |
|--------|-------|--------|
| Source files | 1,151 | — |
| Lines of code | ~120,788 | Large but manageable |
| Client components | 269 (23.37%) | Good ratio |
| Server-only imports | 29 files | Correct boundary usage |
| Unit tests | 455/455 passing | GREEN |
| Typecheck | Clean | GREEN |
| Lint | Clean | GREEN |
| Styles gate | Clean | GREEN |
| Architecture gate | GREEN (client=269/1151, over300=66, over500=3, missingLoading=0, missingMetadata=0) |
| Duplicate clones | 53 clones / 628 lines (0.4%) | Needs reduction |

---

## Quality Issues (Quantified)

| Issue | Count | Impact |
|-------|-------|--------|
| `as unknown as` unsafe casts | 46 (34 in prod code) | Type safety holes |
| `console.*` in production code | 111 occurrences | Noisy prod logs |
| `pb-20` manual padding hacks | 14 in 13 files | Mobile spacing drift |
| Non-Envelope server actions | 29/40 (73%) | Inconsistent API contracts |
| Root clutter (audit artifacts) | 0 tracked (gitignored) | Repo hygiene |
| `generateStaticParams` duplicates | 14 files (11 identical) | DRY violation |
| Migration fallback code | 8+ code paths | Technical debt |
| Tailwind-colliding utilities | 6 in utilities.css | Confusing overrides |
| Global framer-motion provider | 1 (affects all routes) | Bundle bloat |

---

## Refactor History

| Domain | Status |
|--------|--------|
| Domain 1-5 | Complete (32 sessions) |
| Domain 7 | Complete |
| Domain 6 (lib/actions/api) | **BLOCKED** — auth/payment sensitive, needs human approval |

---

## Launch Blockers (From NOW.md)

1. MIG-001: Finalize v2 migration Step 5
2. LAUNCH-001: Stripe webhook idempotency verification
3. LAUNCH-002: Refund/dispute flow E2E test
4. LAUNCH-003: Stripe prod/dev environment separation
5. LAUNCH-004: Leaked password protection (plan dependency)

---

## Gates (Run After Every Change)

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

Extended:
```bash
pnpm -s architecture:gate && pnpm -s knip
```

---

*Snapshot date: 2026-02-24*
