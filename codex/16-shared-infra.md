# [16] Shared Infrastructure

> Providers · Hooks · Lib · Header · Nav · Footer · Drawers · i18n · Middleware

## What Must Work

- Auth state management (1 context)
- Cart state (1 context)
- Wishlist state (1 context)
- Message/notification state (1 context)
- Drawer system for mobile — clean, minimal
- Header — desktop + mobile, responsive (not separate trees)
- Bottom nav (mobile)
- Footer
- i18n — en + bg via `next-intl`
- Currency/price formatting
- Supabase clients — server, static, route-handler, admin, browser
- Image utilities

## Files to Audit

```
components/providers/                   → All context files + messages/
components/layout/                      → header/, sidebar/
components/mobile/                      → drawers/, chrome/, category-nav/
components/dropdowns/
components/ui/                          → shadcn primitives

hooks/                                  → All 14 hooks

lib/                                    → All standalone files at root + all subdirs
lib/supabase/
lib/data/
lib/types/

app/[locale]/_components/
app/[locale]/_providers/

i18n/
messages/
```

## Instructions

1. Read every file listed above
2. Audit for: unused hooks, contexts with 1 consumer, scattered utilities that should merge, desktop/mobile duplication, dead code
3. Refactor — same features, less code, fewer providers, merged utilities
4. Verify: `pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit`
5. Report: files deleted, files merged, LOC before/after

**Do not touch:** `components/ui/` shadcn primitives (keep as-is), Supabase client factory signatures, i18n routing config.
