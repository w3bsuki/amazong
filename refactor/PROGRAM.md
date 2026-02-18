# Refactor Program — Active SSOT

> **This is the active program document.**
> Use this together with `refactor/CURRENT.md` for session execution.

---

## Program Rules

1. Pixel + behavior parity is mandatory.
2. Route URLs and public API response shapes stay unchanged.
3. No DB schema / migration / RLS work in this program.
4. Auth and webhook internals are last-phase only.
5. Verification gate after each completed batch:

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

---

## Baseline (2026-02-18)

| Metric | Value |
|--------|-------|
| Source files (`app/components/lib/hooks`) | 819 |
| Total LOC (`app/components/lib/hooks`) | ~42.8K |
| `"use client"` files | 216 |
| >300-line files | 118 |
| Duplicate clones | 243 |
| Clone % | 3.04% |

---

## Batch Tracker

- [x] **Batch 0** — Baseline lock + hygiene guardrails
- [x] **Batch 1** — Shared UI primitives + drawer/dropdown dedupe
- [x] **Batch 2** — Cross-route shared primitives (account/business/admin)
- [ ] **Batch 3** — Large-screen decomposition hotspots
- [ ] **Batch 4** — Data layer canonicalization + cache correctness
- [ ] **Batch 5** — Action layer rationalization
- [ ] **Batch 6** — High-risk last phase (auth/payments/webhooks internals)
- [ ] **Batch 7** — Route hygiene (metadata/error/loading normalization)
- [ ] **Batch 8** — Final hardening + launch readiness

---

## Latest Snapshot (Batch 3 in progress; Phase F in progress, 2026-02-18)

| Metric | Value |
|--------|-------|
| Source files (`app/components/lib/hooks`) | 852 |
| `"use client"` files | 217 |
| >300-line files | 114 |
| Duplicate clones | 232 |
| Clone % | 2.80% |

---

## Baseline Commands

```bash
pnpm -s clean:artifacts:dry
pnpm -s architecture:scan
pnpm -s dupes
```
