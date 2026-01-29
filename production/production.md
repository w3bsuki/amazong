# Production — V1 Launch Alignment (Treido)

> This folder tracks release readiness work. **SSOT remains** `AGENTS.md` + `docs/*`.
>
> Agent drafts:
> - Codex version: `production/codex_production.md`
> - Opus version: (add when written)

## Snapshot (2026-01-28)

### Shipping Gates (local)

- `pnpm -s typecheck` ✅
- `pnpm -s lint` ✅ (0 errors, 569 warnings)
- `pnpm -s styles:gate` ✅
- `pnpm -s knip` ⚠️ (unused files/exports/devDeps)
- `pnpm -s dupes` ⚠️ (clone clusters)

### Product Scope Readiness

From `docs/FEATURES.md` (last updated: 2026-01-25):

- ✅ Implemented: **102**
- 🚧 In progress: **11**
- ⬜ Not started: **6**
- Overall: **~86%** toward “V1-ish” scope

## End Goal (V1)

**Definition of V1** is `docs/PRD.md` + `docs/FEATURES.md`.

### PRD V1 Scope (headline)

- On-platform payments + Buyer Protection (Stripe Checkout)
- Seller payouts (Stripe Connect, delayed release)
- Core marketplace flows: list → discover → chat → checkout → order lifecycle
- Trust & safety: reporting/blocking + minimum moderation surfaces
- English + Bulgarian (next-intl)

## PRD → FEATURES Gap Map (2026-01-28)

**Core flows (should be launch-ready):**

- Auth ✅
- Profiles ✅
- Listings ✅
- Discovery ✅ (Saved searches is explicitly future / ⬜)
- PDP ✅ (Related items / recently viewed are ⬜ and can be V1.1)
- Wishlist ✅ (Sharing is ⬜ and can be V1.1)
- Cart + Checkout ✅
- Messaging ✅
- Payouts ✅
- Reviews ✅

**Gaps that still matter for V1 quality and operations:**

- Buyer cancel order 🚧
- Seller refund flow 🚧 (admin-assisted)
- Admin tooling 🚧 (metrics/user mgmt/content moderation)
- Accessibility 🚧 (screen reader labels + WCAG AA)
- Trust & safety ops 🚧 (moderation surfaces, prohibited items enforcement)

## Release Blockers (must close before production)

### Critical (blocks launch)

- [ ] **Refund/dispute flow verified end-to-end** (PRD hard gate) → complete seller refund path + buyer protection reporting + webhook/idempotency coverage.
- [ ] **No secrets/PII in logs** (PRD hard gate) → remove/guard server `console.log` usage:
  - `app/api/connect/webhook/route.ts` (logs Stripe account id + object)
  - `app/[locale]/(main)/categories/[slug]/_lib/search-products.ts` (debug logging)
  - Review `lib/analytics-drawer.ts` (avoid logging user identifiers/client payloads)
- [ ] **Stripe environment separation verified** (PRD hard gate) → confirm Vercel prod uses live keys + correct webhook secrets; staging uses test keys.
- [ ] **Support playbooks written** (PRD hard gate) → dispute/refund decision tree, SLAs, escalation, prohibited items policy.
- [ ] **Supabase security posture re-verified** (PRD hard gate) → run Supabase dashboard “Security Advisor” + document clean results (or exceptions).

### High (should close before launch, but can be staged)

- [ ] Complete buyer cancel-order flow (UI + state transitions + protections).
- [ ] Remove `as any` in payment webhooks and tighten event typing:
  - `app/api/payments/webhook/route.ts` (multiple `as any`)
- [ ] Knip cleanup pass (reduce production surface):
  - 29 unused files
  - 3 unused devDependencies
  - 8 unused exports
- [ ] Reduce high-impact duplication clusters (start with checkout + filters + product cards).
- [ ] Accessibility pass on core flows: auth, search, PDP, cart/checkout, chat, orders, sell.
- [ ] Admin minimum viable ops: handle reports, refunds, user blocks, and “who did what” notes.

### Deferred (post-launch / V1.1)

- [ ] Saved searches (⬜)
- [ ] Related items + recently viewed (⬜)
- [ ] Wishlist sharing UI (⬜, DB exists)
- [ ] Listing analytics (⬜, business tier)
- [ ] Email notifications (⬜ / backend-only for now)

## Suggested Execution Order (small batches)

1. **Kill release blockers** (refund flow + logs + env separation + support playbooks).
2. **Stabilize seller flows UI** (align to `docs/DESIGN.md` tokens, remove drift, reduce duplication).
3. **Harden ops surfaces** (admin + trust/safety).
4. **Accessibility pass** (focus, labels, semantics; verify with `pnpm -s test:a11y` where applicable).
5. **Reduce bloat** (`knip`, `dupes`) without changing behavior.

## Verification Checklist (every batch)

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
pnpm -s knip
pnpm -s dupes
```

## Manual Checks (dashboards)

- Supabase: **Auth → Settings → Security** → enable **Leaked Password Protection**
- Supabase: run **Security Advisor** and record any findings/exceptions
- Stripe: confirm **test vs live** keys + webhook secrets match environment
- Vercel: confirm prod env vars are **live** keys; preview/staging uses **test** keys
