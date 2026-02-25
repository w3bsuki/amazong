# Domain Contracts — Treido

This file is an index of the **domain-level contracts** Treido relies on.
It exists so docs referenced from `README.md`, `docs/DECISIONS.md`, and tests always resolve.

## Core Contracts

- **Architecture + boundaries:** `ARCHITECTURE.md`
- **Stack + runtime conventions:** `docs/STACK.md`
- **Database + RLS + query patterns:** `docs/database.md`
- **UI + styling rules:** `docs/DESIGN.md`
- **Testing conventions:** `docs/testing.md`

## Feature Domains (Implementation)

- Auth: `docs/features/auth.md`
- Bottom nav + mobile chrome: `docs/features/bottom-nav.md`
- Checkout + payments: `docs/features/checkout-payments.md`
- Header: `docs/features/header.md`
- Product cards: `docs/features/product-cards.md`
- Search + filters: `docs/features/search-filters.md`
- Sell flow: `docs/features/sell-flow.md`

## Supabase Client Selection (Quick Reference)

Full table lives in `docs/STACK.md` → “Supabase Client Selection”.

Rule of thumb:
- **Cached reads:** `createStaticClient()` (never user-specific)
- **User-specific server reads/actions:** `createClient()`
- **Route handlers:** `createRouteHandlerClient(req)`
- **Service role:** `createAdminClient()` (verify trust first)

