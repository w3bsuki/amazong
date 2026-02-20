# TypeScript 5.9 Audit + Refactor — Report

Completed: 2026-02-20

## Metrics: Before → After

> Scope for counts: `app/`, `components/`, `hooks/`, `lib/` (excluding tests and generated `.d.ts`).

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| any count (occurrences) | 0 | 0 | 0 |
| @ts-ignore / @ts-expect-error | 0 | 0 | 0 |

## Changes Made

- Tightened generic typing in shared filter/sort utilities (`lib/data/search-products.ts`) to remove unsafe casts while keeping behavior unchanged.
- Fixed Supabase Realtime subscription typing (`hooks/use-supabase-postgres-changes.ts`) by narrowing event overloads and accepting readonly spec arrays.
- Preserved literal typing for realtime specs where needed (`hooks/use-notification-count.ts`) to avoid widening and keep hook callsites strict.
- Standardized marketplace-only badge variants to flow through `MarketplaceBadge` (instead of `Badge` primitive) where encountered, keeping `components/ui/badge.tsx` variant surface clean.

## What Was NOT Changed (and why)

- Auth/session/access control logic, payments/webhooks, and DB schema/RLS/migrations: explicitly out of scope per `AGENTS.md` and task constraints.
- Risky `as unknown as ...` casts in auth/payments/webhook codepaths: documented in audit notes but left unchanged to avoid behavior changes.

## Recommendations

- Consider a follow-up pass to replace high-risk `as unknown as ...` casts in non-sensitive data modules (`lib/data/**`) by typing Supabase queries more precisely (or parsing at boundaries) — done incrementally to avoid runtime regressions.
- Keep route-private boundary rules enforced in tests (several test imports currently warn via lint, but do not fail the gate).

